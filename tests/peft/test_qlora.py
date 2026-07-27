import json

import pytest
import torch
from torch import nn

from arclm.exceptions import FineTuningError
from arclm.finetuning import FineTuningDatasetReport, FineTuningResult
from arclm.models import ArcLM
from arclm.peft import (
    LoRAConfig,
    PeftMethod,
    QLoRAConfig,
    QuantizationBackend,
    QuantizationConfig,
    QuantizationType,
    QuantizedComputeDType,
    apply_peft,
    inspect_adapter_artifact,
    inspect_quantization_capabilities,
    is_lora_model,
    load_adapter_artifact,
    load_quantized_model,
    merged_lora_model,
    save_adapter_artifact,
    validate_quantized_base_model,
)
import arclm.peft.quantization as quantization


class Linear4bit(nn.Linear):
    __module__ = "bitsandbytes.nn"


class FixtureQuantizedModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.query = Linear4bit(4, 4)
        self.value = Linear4bit(4, 4)

    def forward(self, inputs):
        return self.value(self.query(inputs))


def _native_model():
    torch.manual_seed(456)
    return ArcLM(vocab_size=32, embed_dim=8, block_size=12, num_blocks=1, dropout=0.0)


def test_qlora_config_round_trips_and_validates():
    config = QLoRAConfig(
        quantization=QuantizationConfig(
            backend=QuantizationBackend.BITSANDBYTES_4BIT,
            bits=4,
            quant_type=QuantizationType.NF4,
            use_double_quant=True,
            compute_dtype=QuantizedComputeDType.BF16,
        ),
        lora=LoRAConfig(rank=2, alpha=4, target_modules=("query", "value")),
    )

    restored = QLoRAConfig.from_dict(config.to_dict())

    assert restored == config
    assert restored.method == PeftMethod.QLORA
    with pytest.raises(FineTuningError, match="bits"):
        QuantizationConfig(bits=8).validate()
    with pytest.raises(FineTuningError, match="method"):
        QLoRAConfig(method=PeftMethod.LORA).validate()


def test_quantization_capability_reports_missing_optional_dependencies(monkeypatch):
    monkeypatch.setattr(quantization, "_has_module", lambda _name: False)
    monkeypatch.setattr(torch.cuda, "is_available", lambda: False)

    report = inspect_quantization_capabilities()

    assert report.backend == "bitsandbytes_4bit"
    assert report.dependency_installed is False
    assert report.cuda_available is False
    assert report.qlora_training_supported is False
    assert any("bitsandbytes" in reason for reason in report.reasons)


def test_quantization_capability_reports_supported_cuda_boundary(monkeypatch):
    monkeypatch.setattr(quantization, "_has_module", lambda name: name in {"bitsandbytes", "transformers"})
    monkeypatch.setattr(quantization, "_package_version", lambda _name: "0.49.0")
    monkeypatch.setattr(torch.cuda, "is_available", lambda: True)
    monkeypatch.setattr(torch.cuda, "get_device_capability", lambda _index=0: (7, 5))

    report = inspect_quantization_capabilities()

    assert report.dependency_installed is True
    assert report.device_supported is True
    assert report.four_bit_loading_supported is True
    assert report.qlora_training_supported is True
    assert report.backend_version == "0.49.0"


def test_qlora_rejects_unquantized_base_model():
    model = nn.Sequential(nn.Linear(4, 4))
    config = QLoRAConfig(lora=LoRAConfig(rank=2, target_modules=("0",), target_match="leaf"))

    with pytest.raises(FineTuningError, match="genuinely quantized"):
        apply_peft(model, config)


def test_qlora_fixture_boundary_freezes_base_and_adds_lora():
    model = FixtureQuantizedModel()
    config = QLoRAConfig(lora=LoRAConfig(rank=2, alpha=4, target_modules=("query", "value")))

    result = apply_peft(model, config)

    assert result.method == "qlora"
    assert is_lora_model(model)
    assert getattr(model, "_arclm_qlora_prepared") is True
    assert validate_quantized_base_model(model, config).quantized_module_count == 2
    assert all(
        ("lora_" in name) == parameter.requires_grad
        for name, parameter in model.named_parameters()
    )


def test_qlora_adapter_artifact_keeps_quantization_metadata_and_loads_on_full_precision_base(tmp_path):
    model = _native_model()
    config = QLoRAConfig(lora=LoRAConfig(rank=2, alpha=4, target_modules=("query", "value")))
    apply_peft(model, config.lora)
    with torch.no_grad():
        for name, parameter in model.named_parameters():
            if "lora_b" in name:
                parameter.fill_(0.02)
    path = tmp_path / "adapter"
    inputs = torch.randint(0, 32, (1, 6))
    model.eval()
    expected = model(inputs)

    manifest = save_adapter_artifact(model, path, config=config)
    info = inspect_adapter_artifact(path, verify_integrity=True)
    clean = _native_model()
    loaded = load_adapter_artifact(clean, path)
    clean.eval()
    merged = merged_lora_model(clean)

    assert manifest.method == "qlora"
    assert manifest.metadata["quantization"]["backend"] == "bitsandbytes_4bit"
    assert info.method == "qlora"
    assert info.quantization_backend == "bitsandbytes_4bit"
    assert loaded.method == "qlora"
    assert torch.allclose(expected, clean(inputs), atol=1e-5)
    assert not is_lora_model(merged)


def test_load_quantized_model_requires_real_cuda_and_local_directory(tmp_path, monkeypatch):
    monkeypatch.setattr(torch.cuda, "is_available", lambda: False)
    config = QLoRAConfig()

    with pytest.raises(FineTuningError, match="CUDA"):
        load_quantized_model(tmp_path, config, device="cuda:0")


def test_qlora_metadata_is_json_safe(tmp_path):
    model = _native_model()
    config = QLoRAConfig(lora=LoRAConfig(rank=2, alpha=4, target_modules=("query", "value")))
    apply_peft(model, config.lora)
    path = tmp_path / "adapter"

    save_adapter_artifact(model, path, config=config)
    manifest = json.loads((path / "manifest.json").read_text(encoding="utf-8"))

    assert manifest["method"] == "qlora"
    assert manifest["config"]["quantization"]["bits"] == 4
    assert "callable" not in json.dumps(manifest).lower()


def test_quantized_runtime_merge_to_final_artifact_is_rejected(tmp_path):
    model = _native_model()
    config = QLoRAConfig(lora=LoRAConfig(rank=2, alpha=4, target_modules=("query", "value")))
    apply_peft(model, config.lora)
    setattr(model, "_arclm_quantized_runtime", True)
    result = FineTuningResult(
        training_state=object(),
        dataset_report=FineTuningDatasetReport(
            mode="sft",
            formatter="plain_text",
            records_seen=1,
            records_valid=1,
            records_rejected=0,
            records_truncated=0,
            examples_dropped=0,
            total_tokens=4,
            trainable_tokens=4,
            dataset_fingerprint="dataset_test",
        ),
        model=model,
        tokenizer=object(),
        peft_config=config,
    )

    with pytest.raises(FineTuningError, match="quantized runtime"):
        result.save_model_artifact(tmp_path / "model", merge_adapter=True)
