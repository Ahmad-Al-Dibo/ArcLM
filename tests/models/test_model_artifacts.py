import json
import math
import os
import random

import pytest
import torch
from torch import nn

from arclm.configs import Config
from arclm.evaluation import Accuracy, EvaluationConfig, Evaluator, LossMetric
from arclm.lifecycle import (
    ARTIFACT_FORMAT,
    ARTIFACT_VERSION,
    ArtifactError,
    ModelArtifactManifest,
    inspect_model_artifact,
    load_model_artifact,
    save_model_artifact,
    validate_model_artifact,
)
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import Trainer, TrainingConfig
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


def _native_model():
    torch.manual_seed(7)
    return ArcLM(vocab_size=8, embed_dim=6, block_size=3, num_blocks=1, dropout=0.0)


def _native_config():
    return Config(
        vocab_size=8,
        embed_dim=6,
        block_size=3,
        num_blocks=1,
        dropout=0.0,
        batch_size=2,
        device="cpu",
    )


def _train_one_step(model):
    optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
    x = torch.tensor([[0, 1, 2], [1, 2, 3]], dtype=torch.long)
    y = torch.tensor([[1, 2, 3], [2, 3, 4]], dtype=torch.long)
    logits = model(x)
    loss = torch.nn.functional.cross_entropy(
        logits.reshape(-1, logits.shape[-1]),
        y.reshape(-1),
    )
    loss.backward()
    optimizer.step()
    return float(loss.detach().item())


def _tokenizer():
    tokenizer = Tokenizer(max_vocab=8)
    tokenizer.build("hello world hello arclm")
    return tokenizer


def test_manifest_round_trip_and_current_format(tmp_path):
    model = _native_model()
    manifest = save_model_artifact(model, tmp_path / "artifact", config=_native_config())
    data = json.loads((tmp_path / "artifact" / "manifest.json").read_text())
    loaded = ModelArtifactManifest.from_dict(data)

    assert manifest.artifact_format == ARTIFACT_FORMAT
    assert loaded.artifact_version == ARTIFACT_VERSION
    assert loaded.model["architecture"] == "arclm"
    assert loaded.model["weights_file"] == "model/weights.pt"


def test_native_artifact_cpu_round_trip_evaluate_and_infer(tmp_path):
    model = _native_model()
    loss = _train_one_step(model)
    expected = {key: value.detach().cpu().clone() for key, value in model.state_dict().items()}
    tokenizer = _tokenizer()

    manifest = save_model_artifact(
        model,
        tmp_path / "native-artifact",
        config=_native_config(),
        tokenizer=tokenizer,
        training_summary={"final_loss": loss, "global_step": 1},
        evaluation_summary={"metrics": {"accuracy": 0.5}, "num_examples": 2},
    )
    info = inspect_model_artifact(tmp_path / "native-artifact", verify_integrity=True)
    validate_model_artifact(tmp_path / "native-artifact")

    del model
    loaded = load_model_artifact(tmp_path / "native-artifact", device="cpu")

    assert info.artifact_id == manifest.artifact_id
    assert loaded.config["vocab_size"] == 8
    assert loaded.tokenizer.decode_string(loaded.tokenizer.encode_text("hello")) == "hello"
    for key, value in loaded.model.state_dict().items():
        assert torch.equal(value.cpu(), expected[key])

    dataset = TinyTokenDataset(size=2, block_size=3, vocab_size=8)
    evaluator = Evaluator(
        loaded.model,
        dataset=dataset,
        metrics=[LossMetric(), Accuracy()],
        config=EvaluationConfig(batch_size=1, device="cpu"),
        loss_fn=lambda logits, labels: torch.nn.functional.cross_entropy(
            logits.reshape(-1, logits.shape[-1]),
            labels.reshape(-1),
        ),
    )
    result = evaluator.evaluate()
    with torch.no_grad():
        output = loaded.model(torch.tensor([[0, 1, 2]], dtype=torch.long))

    assert math.isfinite(result.metrics["loss"])
    assert 0.0 <= result.metrics["accuracy"] <= 1.0
    assert output.shape == (1, 3, 8)


def test_artifact_contains_no_training_state(tmp_path):
    model = _native_model()
    save_model_artifact(model, tmp_path / "artifact", config=_native_config())
    weights = torch.load(tmp_path / "artifact" / "model" / "weights.pt", map_location="cpu")
    manifest = json.loads((tmp_path / "artifact" / "manifest.json").read_text())

    assert "optimizer_state_dict" not in weights
    assert "scheduler_state_dict" not in weights
    assert "rng_state" not in manifest
    assert not any("optimizer" in item["path"] for item in manifest["files"])


def test_pytorch_artifact_requires_factory_and_loads_with_factory(tmp_path):
    model = TinyTokenModel()
    artifact = tmp_path / "torch-artifact"
    save_model_artifact(
        model,
        artifact,
        config={"vocab_size": 8, "hidden_size": 6},
        source_type="pytorch_module",
    )

    with pytest.raises(ArtifactError, match="model_factory"):
        load_model_artifact(artifact)

    loaded = load_model_artifact(
        artifact,
        model_factory=lambda config: TinyTokenModel(
            vocab_size=config["vocab_size"],
            hidden_size=config["hidden_size"],
        ),
    )

    assert isinstance(loaded.model, TinyTokenModel)


def test_incorrect_pytorch_factory_fails_clearly(tmp_path):
    model = TinyTokenModel(vocab_size=8, hidden_size=6)
    artifact = tmp_path / "torch-artifact"
    save_model_artifact(
        model,
        artifact,
        config={"vocab_size": 8, "hidden_size": 6},
        source_type="pytorch_module",
    )

    with pytest.raises(ArtifactError, match="Model reconstruction failed"):
        load_model_artifact(
            artifact,
            model_factory=lambda config: TinyTokenModel(vocab_size=8, hidden_size=5),
        )


def test_hash_mismatch_and_missing_file_are_rejected(tmp_path):
    model = _native_model()
    artifact = tmp_path / "artifact"
    save_model_artifact(model, artifact, config=_native_config())

    weights = artifact / "model" / "weights.pt"
    data = bytearray(weights.read_bytes())
    data[-1] = (data[-1] + 1) % 255
    weights.write_bytes(bytes(data))
    with pytest.raises(ArtifactError, match="hash mismatch"):
        validate_model_artifact(artifact)

    artifact2 = tmp_path / "artifact2"
    save_model_artifact(model, artifact2, config=_native_config())
    (artifact2 / "model" / "weights.pt").unlink()
    with pytest.raises(ArtifactError):
        validate_model_artifact(artifact2)


def test_unsafe_manifest_paths_are_rejected(tmp_path):
    model = _native_model()
    artifact = tmp_path / "artifact"
    save_model_artifact(model, artifact, config=_native_config())
    manifest_path = artifact / "manifest.json"
    data = json.loads(manifest_path.read_text())
    data["files"][0]["path"] = "../escape.pt"
    manifest_path.write_text(json.dumps(data), encoding="utf-8")

    with pytest.raises(ArtifactError, match="unsafe file path"):
        validate_model_artifact(artifact)


def test_inspection_does_not_construct_model_or_mutate_rng(tmp_path):
    model = _native_model()
    artifact = tmp_path / "artifact"
    save_model_artifact(model, artifact, config=_native_config())
    torch_state = torch.random.get_rng_state()
    random_state = random.getstate()

    info = inspect_model_artifact(artifact)

    assert info.source_type == "native_checkpoint"
    assert torch.equal(torch.random.get_rng_state(), torch_state)
    assert random.getstate() == random_state


def test_existing_destination_rejected_and_overwrite_replaces(tmp_path):
    model = _native_model()
    artifact = tmp_path / "artifact"
    save_model_artifact(model, artifact, config=_native_config())
    old_id = inspect_model_artifact(artifact).artifact_id

    with pytest.raises(ArtifactError, match="already exists"):
        save_model_artifact(model, artifact, config=_native_config())

    save_model_artifact(model, artifact, config=_native_config(), overwrite=True)
    assert inspect_model_artifact(artifact).artifact_id != old_id
    assert not list(tmp_path.glob(".artifact.tmp-*"))


def test_save_failure_preserves_existing_artifact(tmp_path, monkeypatch):
    model = _native_model()
    artifact = tmp_path / "artifact"
    save_model_artifact(model, artifact, config=_native_config())
    old_id = inspect_model_artifact(artifact).artifact_id

    def fail_commit(*args, **kwargs):
        raise ArtifactError("forced failure")

    monkeypatch.setattr("arclm.lifecycle.artifacts._commit_staging_directory", fail_commit)
    with pytest.raises(ArtifactError, match="forced failure"):
        save_model_artifact(model, artifact, config=_native_config(), overwrite=True)

    assert inspect_model_artifact(artifact).artifact_id == old_id


def test_precision_and_device_errors_are_controlled(tmp_path):
    model = _native_model()
    artifact = tmp_path / "artifact"
    save_model_artifact(model, artifact, config=_native_config())

    with pytest.raises(ArtifactError, match="FP16 loading on CPU"):
        load_model_artifact(artifact, precision="fp16")

    if torch.cuda.is_available():
        loaded = load_model_artifact(artifact, device="cuda")
        assert loaded.device.type == "cuda"
        bad_index = torch.cuda.device_count()
        with pytest.raises(ArtifactError, match="Requested CUDA device index"):
            load_model_artifact(artifact, device=f"cuda:{bad_index}")
    else:
        with pytest.raises(ArtifactError, match="CUDA was requested"):
            load_model_artifact(artifact, device="cuda")


def test_training_checkpoint_is_not_model_artifact_and_artifact_is_not_checkpoint(tmp_path):
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=2),
        config=TrainingConfig(
            epochs=1,
            batch_size=1,
            output_dir=str(tmp_path / "checkpoints"),
            save_every_steps=0,
            log_every_steps=0,
        ),
    )
    trainer.train()
    checkpoint_dir = trainer.save_checkpoint()

    with pytest.raises(ArtifactError, match="Artifact path must be a directory"):
        validate_model_artifact(checkpoint_dir / "training.pt")

    artifact = tmp_path / "artifact"
    trainer.save_model_artifact(
        artifact,
        training_summary={"global_step": trainer.global_step},
        overwrite=False,
    )
    with pytest.raises(Exception):
        trainer.load_checkpoint(artifact)


def test_summary_rejects_non_finite_numbers(tmp_path):
    with pytest.raises(ArtifactError, match="non-finite"):
        save_model_artifact(
            _native_model(),
            tmp_path / "artifact",
            config=_native_config(),
            evaluation_summary={"loss": float("nan")},
        )


def test_huggingface_missing_dependency_boundary(tmp_path):
    model = _native_model()
    artifact = tmp_path / "artifact"
    save_model_artifact(model, artifact, config=_native_config())
    manifest_path = artifact / "manifest.json"
    data = json.loads(manifest_path.read_text())
    data["model"]["source_type"] = "huggingface_folder"
    data["model"]["directory"] = "model/huggingface"
    data["files"] = [item for item in data["files"] if item["path"] == "model/config.json"]
    manifest_path.write_text(json.dumps(data), encoding="utf-8")

    with pytest.raises(Exception):
        load_model_artifact(artifact)


def test_runtime_model_device_unchanged_after_save(tmp_path):
    model = _native_model()
    before = next(model.parameters()).device
    save_model_artifact(model, tmp_path / "artifact", config=_native_config())
    after = next(model.parameters()).device

    assert after == before


def test_manifest_rejects_callable_metadata(tmp_path):
    with pytest.raises(ArtifactError):
        save_model_artifact(
            _native_model(),
            tmp_path / "artifact",
            config={"vocab_size": 8, "bad": lambda: None},
        )
