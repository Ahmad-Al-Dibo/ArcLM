import math

import pytest
import torch

from arclm.peft import (
    LoRAConfig,
    QLoRAConfig,
    inspect_quantization_capabilities,
    load_quantized_model,
    prepare_model_for_qlora,
)
from arclm.peft.runtime_validation import inspect_runtime_environment

pytestmark = [pytest.mark.qlora]


def test_runtime_environment_report_is_bounded_and_json_safe():
    report = inspect_runtime_environment("Core CPU baseline", selected_device="cpu")
    data = report.to_dict()

    assert data["environment"] == "Core CPU baseline"
    assert data["selected_device"] == "cpu"
    assert "pytorch_version" in data
    assert "supported_validation" in data
    assert "environment_variables" not in data
    assert "hostname" not in data


def test_capability_probe_reports_missing_bitsandbytes_without_claiming_runtime(monkeypatch):
    monkeypatch.setattr("arclm.peft.quantization._has_module", lambda name: name == "transformers")
    monkeypatch.setattr(torch.cuda, "is_available", lambda: False)

    report = inspect_quantization_capabilities()

    assert report.dependency_installed is False
    assert report.four_bit_loading_supported is False
    assert report.qlora_training_supported is False
    assert any("bitsandbytes" in reason for reason in report.reasons)


@pytest.mark.bitsandbytes
@pytest.mark.cuda
@pytest.mark.cuda_optional
def test_real_bitsandbytes_qlora_step_if_environment_supports_it(tmp_path):
    pytest.importorskip("transformers", reason="Transformers optional integration is unavailable")
    pytest.importorskip("bitsandbytes", reason="BitsAndBytes is not installed")
    if not torch.cuda.is_available():
        pytest.skip("CUDA-enabled PyTorch is unavailable")

    from tokenizers import Tokenizer as RawTokenizer
    from tokenizers.models import WordLevel
    from tokenizers.pre_tokenizers import Whitespace
    from transformers import GPT2Config, GPT2LMHeadModel, PreTrainedTokenizerFast

    vocab = {
        "<pad>": 0,
        "<bos>": 1,
        "<eos>": 2,
        "<unk>": 3,
        "hello": 4,
        "world": 5,
        "arclm": 6,
        "response": 7,
    }
    raw = RawTokenizer(WordLevel(vocab, unk_token="<unk>"))
    raw.pre_tokenizer = Whitespace()
    tokenizer = PreTrainedTokenizerFast(
        tokenizer_object=raw,
        unk_token="<unk>",
        pad_token="<pad>",
        bos_token="<bos>",
        eos_token="<eos>",
    )
    model = GPT2LMHeadModel(
        GPT2Config(
            vocab_size=len(tokenizer),
            n_positions=16,
            n_ctx=16,
            n_embd=16,
            n_layer=1,
            n_head=2,
            bos_token_id=tokenizer.bos_token_id,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.pad_token_id,
        )
    )
    source = tmp_path / "hf-model"
    model.save_pretrained(source)
    tokenizer.save_pretrained(source)
    config = QLoRAConfig(lora=LoRAConfig(rank=2, alpha=4, target_modules=("lm_head",), target_match="leaf"))

    quantized = load_quantized_model(source, config, device="cuda:0")
    report = prepare_model_for_qlora(quantized, config)
    input_ids = torch.tensor([[4, 5, 2]], device="cuda:0")
    labels = input_ids.clone()
    output = quantized(input_ids=input_ids, labels=labels)
    loss = output.loss

    assert report.quantized_module_count > 0
    assert torch.isfinite(loss)
    assert math.isfinite(float(loss.detach().cpu().item()))
