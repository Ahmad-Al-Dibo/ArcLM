import json

import torch
import pytest

from arclm.exceptions import FineTuningError
from arclm.models import ArcLM
from arclm.peft import (
    ADAPTER_ARTIFACT_FORMAT,
    LoRAConfig,
    apply_lora,
    inspect_adapter_artifact,
    is_lora_model,
    load_adapter_artifact,
    save_adapter_artifact,
    validate_adapter_artifact,
)


def _model():
    torch.manual_seed(321)
    return ArcLM(vocab_size=32, embed_dim=8, block_size=12, num_blocks=1, dropout=0.0)


def _adapted_model():
    model = _model()
    config = LoRAConfig(rank=2, alpha=4, dropout=0.0)
    apply_lora(model, config)
    with torch.no_grad():
        for name, parameter in model.named_parameters():
            if "lora_b" in name:
                parameter.fill_(0.03)
    return model, config


def test_adapter_artifact_save_inspect_validate_and_load(tmp_path):
    model, config = _adapted_model()
    path = tmp_path / "adapter"

    manifest = save_adapter_artifact(model, path, config=config)
    info = inspect_adapter_artifact(path, verify_integrity=True)
    validate_adapter_artifact(path)
    clean = _model()
    inputs = torch.randint(0, 32, (1, 6))
    model.eval()
    expected = model(inputs)

    loaded_manifest = load_adapter_artifact(clean, path)
    clean.eval()

    assert manifest.artifact_format == ADAPTER_ARTIFACT_FORMAT
    assert info.integrity_verified is True
    assert loaded_manifest.adapter_id == manifest.adapter_id
    assert is_lora_model(clean)
    assert torch.allclose(expected, clean(inputs), atol=1e-5)


def test_adapter_artifact_rejects_existing_destination_and_overwrites(tmp_path):
    model, config = _adapted_model()
    path = tmp_path / "adapter"
    save_adapter_artifact(model, path, config=config)

    with pytest.raises(FineTuningError, match="already exists"):
        save_adapter_artifact(model, path, config=config)
    save_adapter_artifact(model, path, config=config, overwrite=True)
    validate_adapter_artifact(path)


def test_adapter_artifact_rejects_hash_mismatch_and_unsafe_path(tmp_path):
    model, config = _adapted_model()
    path = tmp_path / "adapter"
    save_adapter_artifact(model, path, config=config)
    weights = path / "adapter" / "adapter.pt"
    payload = bytearray(weights.read_bytes())
    payload[-1] = (payload[-1] + 1) % 255
    weights.write_bytes(bytes(payload))

    with pytest.raises(FineTuningError, match="hash mismatch"):
        validate_adapter_artifact(path)

    save_adapter_artifact(model, path, config=config, overwrite=True)
    manifest_path = path / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["files"][0]["path"] = "../escape.pt"
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    with pytest.raises(FineTuningError, match="unsafe"):
        validate_adapter_artifact(path)


def test_adapter_load_rejects_wrong_base_model(tmp_path):
    model, config = _adapted_model()
    path = tmp_path / "adapter"
    save_adapter_artifact(model, path, config=config)
    wrong = ArcLM(vocab_size=33, embed_dim=8, block_size=12, num_blocks=1, dropout=0.0)

    with pytest.raises(FineTuningError, match="does not match"):
        load_adapter_artifact(wrong, path)


def test_inspect_does_not_load_model_or_import_optional_dependencies(tmp_path, monkeypatch):
    model, config = _adapted_model()
    path = tmp_path / "adapter"
    save_adapter_artifact(model, path, config=config)

    def fail(*_args, **_kwargs):
        raise AssertionError("torch.load should not be called during inspection")

    monkeypatch.setattr(torch, "load", fail)
    info = inspect_adapter_artifact(path)

    assert info.method == "lora"
    assert info.integrity_verified is None
