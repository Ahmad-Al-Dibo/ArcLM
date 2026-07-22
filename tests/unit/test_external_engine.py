from pathlib import Path

import pytest
import torch

from arclm import (
    Config,
    Tokenizer,
    adapt_for_training,
    build_model,
    build_trainer,
    load_external_model,
    train_model,
)
from arclm.inference import external
from arclm.inference import _external_loading as external_loading
from arclm.inference.external import GenerationConfig, ModelSaveConfig, load_any_model


def _small_config(tmp_path, **overrides):
    values = {
        "embed_dim": 8,
        "block_size": 4,
        "num_blocks": 1,
        "dropout": 0.0,
        "batch_size": 2,
        "num_epochs": 1,
        "learning_rate": 1e-3,
        "training_log_interval": 0,
        "device": "cpu",
        "model_path": str(tmp_path / "model.pth"),
        "vocab_size": 8,
    }
    values.update(overrides)
    return Config(**values)


def test_load_and_adapt_raw_state_dict(tmp_path):
    config = _small_config(tmp_path)
    model = build_model(config, vocab_size=config.vocab_size)
    path = tmp_path / "raw_state.pth"
    torch.save(model.state_dict(), path)

    loaded = load_external_model(path)
    bundle = adapt_for_training(loaded, target_config=config, strict=True)

    assert loaded.source_type == "state_dict"
    assert bundle.config.vocab_size == config.vocab_size
    logits = bundle.model(torch.randint(0, config.vocab_size, (1, config.block_size)))
    assert tuple(logits.shape) == (1, config.block_size, config.vocab_size)


def test_load_native_arclm_checkpoint_with_tokenizer_check(tmp_path):
    tokenizer = Tokenizer(max_vocab=8)
    tokenizer.build("arc lm arc data model")
    config = _small_config(tmp_path, vocab_size=tokenizer.get_vocab_size())
    model = build_model(config, vocab_size=config.vocab_size)
    trainer = build_trainer(model, config)
    trainer.save(
        config,
        vocab=tokenizer.vocab,
        stoi=tokenizer.stoi,
        itos=tokenizer.itos,
        tokenizer_metadata=tokenizer.to_checkpoint(),
    )

    loaded = load_external_model(config.model_path)
    bundle = adapt_for_training(
        loaded,
        target_config=config,
        tokenizer=tokenizer,
        require_tokenizer_match=True,
        strict=True,
    )

    assert loaded.source_type == "arclm"
    assert loaded.stoi == tokenizer.stoi
    assert bundle.missing_keys == []


def test_train_model_pretrain_writes_checkpoint_and_metrics(tmp_path):
    data_path = tmp_path / "data.txt"
    data_path.write_text(
        "arc lm trains on compact text data. " * 12,
        encoding="utf-8",
    )
    output_path = tmp_path / "trained.pth"
    metrics_path = tmp_path / "metrics.jsonl"

    result = train_model(
        mode="pretrain",
        data=str(data_path),
        output=str(output_path),
        embed_dim=8,
        block_size=4,
        num_blocks=1,
        batch_size=2,
        num_epochs=1,
        max_vocab=32,
        training_log_interval=0,
        validation_split=0.0,
        metrics_log_path=str(metrics_path),
        device="cpu",
    )

    assert result.mode == "pretrain"
    assert Path(result.model_path).exists()
    assert metrics_path.exists()
    assert "epoch_completed" in metrics_path.read_text(encoding="utf-8")


def test_external_inspection_distinguishes_hf_folder_adapter_and_model_id(tmp_path):
    hf_folder = tmp_path / "hf-model"
    hf_folder.mkdir()
    (hf_folder / "config.json").write_text('{"model_type": "gpt2"}', encoding="utf-8")
    (hf_folder / "tokenizer.json").write_text("{}", encoding="utf-8")
    (hf_folder / "model.safetensors").write_text("", encoding="utf-8")

    adapter_folder = tmp_path / "adapter"
    adapter_folder.mkdir()
    (adapter_folder / "adapter_config.json").write_text(
        '{"base_model_name_or_path": "owner/base"}',
        encoding="utf-8",
    )
    (adapter_folder / "adapter_model.safetensors").write_text("", encoding="utf-8")

    hf_info = external.inspect_model_source(hf_folder)
    adapter_info = external.inspect_model_source(adapter_folder)
    model_id_info = external.inspect_model_source("hf://owner/tiny-model")

    assert hf_info.source_type == "hf_full_model"
    assert hf_info.tokenizer_files_exist is True
    assert adapter_info.source_type == "hf_lora_adapter"
    assert adapter_info.base_model_name_or_path == "owner/base"
    assert model_id_info.source_type == "hf_full_model"
    assert model_id_info.resolved_source == "owner/tiny-model"


def test_external_optional_dependency_errors_are_actionable(monkeypatch):
    original_import = __import__

    def blocked_import(name, *args, **kwargs):
        if name in {"transformers", "peft"}:
            raise ImportError(name)
        return original_import(name, *args, **kwargs)

    monkeypatch.setattr("builtins.__import__", blocked_import)

    with pytest.raises(ImportError, match="pip install 'transformers"):
        external_loading._import_transformers()
    with pytest.raises(ImportError, match="pip install peft"):
        external_loading._import_peft()


class _FakeBatch(dict):
    def to(self, device):
        return _FakeBatch({key: value.to(device) for key, value in self.items()})


class _FakeTokenizer:
    pad_token = None
    eos_token = "<eos>"
    unk_token = "<unk>"
    pad_token_id = None
    eos_token_id = 2
    unk_token_id = 3
    chat_template = None

    def __init__(self):
        self.saved_to = None

    def __call__(self, text, return_tensors=None, add_special_tokens=True):
        return _FakeBatch({"input_ids": torch.tensor([[1, 2]])})

    def decode(self, ids, skip_special_tokens=True):
        return "decoded answer"

    def save_pretrained(self, path):
        self.saved_to = Path(path)
        self.saved_to.mkdir(parents=True, exist_ok=True)
        (self.saved_to / "tokenizer.json").write_text("{}", encoding="utf-8")


class _FakeAutoTokenizer:
    loaded_sources = []

    @classmethod
    def from_pretrained(cls, source, **kwargs):
        cls.loaded_sources.append((source, kwargs))
        return _FakeTokenizer()


class _FakeCausalLM:
    def __init__(self):
        self.to_device = None
        self.saved_to = None
        self.generation_config = None

    def to(self, device):
        self.to_device = device
        return self

    def parameters(self):
        yield torch.nn.Parameter(torch.zeros(1))

    def generate(self, **kwargs):
        input_ids = kwargs["input_ids"]
        return torch.cat([input_ids, torch.tensor([[4, 5]], device=input_ids.device)], dim=-1)

    def save_pretrained(self, path, **kwargs):
        self.saved_to = Path(path)
        self.saved_to.mkdir(parents=True, exist_ok=True)
        (self.saved_to / "model.safetensors").write_text("", encoding="utf-8")


class _FakeAutoModelForCausalLM:
    loaded_sources = []
    last_model = None

    @classmethod
    def from_pretrained(cls, source, **kwargs):
        cls.loaded_sources.append((source, kwargs))
        cls.last_model = _FakeCausalLM()
        return cls.last_model


def test_external_hf_loading_generation_dtype_device_and_export(monkeypatch, tmp_path):
    monkeypatch.setattr(
        external_loading,
        "_import_transformers",
        lambda: (_FakeAutoTokenizer, _FakeAutoModelForCausalLM),
    )
    _FakeAutoTokenizer.loaded_sources = []
    _FakeAutoModelForCausalLM.loaded_sources = []

    loaded = load_any_model(
        "owner/tiny-model",
        device="cpu",
        dtype="fp32",
        generation_config=GenerationConfig(return_full_text=False),
    )
    text = loaded.predict("ArcLM", max_new_tokens=2, temperature=0)
    output = loaded.save(
        tmp_path / "export",
        save_config=ModelSaveConfig(save_layout="flat", save_mode="full_model", overwrite=True),
    )

    assert text == "decoded answer"
    assert _FakeAutoTokenizer.loaded_sources[0][0] == "owner/tiny-model"
    assert _FakeAutoModelForCausalLM.loaded_sources[0][1]["torch_dtype"] is torch.float32
    assert _FakeAutoModelForCausalLM.last_model.to_device == "cpu"
    assert output == tmp_path / "export"
    assert (output / "model.safetensors").exists()
    assert (output / "tokenizer.json").exists()
    assert (output / "arclm_metadata.json").exists()


def test_external_lora_adapter_loads_base_model_and_peft(monkeypatch, tmp_path):
    adapter = tmp_path / "adapter"
    adapter.mkdir()
    (adapter / "adapter_config.json").write_text(
        '{"base_model_name_or_path": "owner/base"}',
        encoding="utf-8",
    )
    (adapter / "adapter_model.safetensors").write_text("", encoding="utf-8")

    class FakePeftModel:
        calls = []

        @classmethod
        def from_pretrained(cls, base, source):
            cls.calls.append((base, source))
            return base

    monkeypatch.setattr(
        external_loading,
        "_import_transformers",
        lambda: (_FakeAutoTokenizer, _FakeAutoModelForCausalLM),
    )
    monkeypatch.setattr(external_loading, "_import_peft", lambda: FakePeftModel)
    _FakeAutoTokenizer.loaded_sources = []
    _FakeAutoModelForCausalLM.loaded_sources = []

    loaded = load_any_model(adapter, device="cpu")

    assert loaded.source_info.source_type == "hf_lora_adapter"
    assert loaded.config.base_model == "owner/base"
    assert _FakeAutoModelForCausalLM.loaded_sources[0][0] == "owner/base"
    assert FakePeftModel.calls[0][1] == str(adapter)
