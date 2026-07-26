import random

import pytest
import torch

from arclm.checkpoints import (
    CHECKPOINT_FORMAT,
    CHECKPOINT_VERSION,
    CheckpointInfo,
    inspect_checkpoint,
    validate_checkpoint,
)
from arclm.checkpoints.training import (
    atomic_save_checkpoint,
    capture_rng_state,
    restore_rng_state,
    safe_load_training_checkpoint,
)
from arclm.exceptions import CheckpointError
from arclm.training import Trainer, TrainingConfig, TrainingState
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


def make_trainer(tmp_path, *, epochs=1, seed=123, size=4):
    torch.manual_seed(seed)
    random.seed(seed)
    config = TrainingConfig(
        epochs=epochs,
        batch_size=1,
        learning_rate=1e-2,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
        scheduler="constant",
    )
    return Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=size),
        config=config,
    )


def test_new_checkpoint_has_format_version_metadata_and_rng(tmp_path):
    trainer = make_trainer(tmp_path)
    trainer.train()

    checkpoint_dir = trainer.save_checkpoint()
    checkpoint = torch.load(checkpoint_dir / "training.pt", map_location="cpu")

    assert checkpoint["checkpoint_format"] == CHECKPOINT_FORMAT
    assert checkpoint["checkpoint_version"] == CHECKPOINT_VERSION
    assert checkpoint["training_state_version"] == 1
    assert checkpoint["checkpoint_metadata"]["checkpoint_format"] == CHECKPOINT_FORMAT
    assert checkpoint["checkpoint_metadata"]["config_snapshot"]["batch_size"] == 1
    assert checkpoint["checkpoint_metadata"]["dataset"]["dataset_length"] == 4
    assert checkpoint["rng_state"]["python"]
    assert checkpoint["rng_state"]["torch_cpu"] is not None
    if torch.cuda.is_available():
        assert checkpoint["rng_state"]["torch_cuda"]
    else:
        assert checkpoint["rng_state"]["torch_cuda"] == []


def test_inspect_checkpoint_returns_typed_info_without_rng_mutation(tmp_path):
    trainer = make_trainer(tmp_path)
    trainer.train()
    checkpoint_dir = trainer.save_checkpoint()
    before_python = random.getstate()
    before_torch = torch.get_rng_state().clone()

    info = inspect_checkpoint(checkpoint_dir)

    assert isinstance(info, CheckpointInfo)
    assert info.format == CHECKPOINT_FORMAT
    assert info.version == CHECKPOINT_VERSION
    assert info.legacy is False
    assert info.global_step == trainer.global_step
    assert info.has_optimizer_state is True
    assert info.has_rng_state is True
    assert random.getstate() == before_python
    assert torch.equal(torch.get_rng_state(), before_torch)


def test_legacy_checkpoint_without_version_is_supported(tmp_path):
    path = tmp_path / "legacy.pt"
    torch.save(
        {
            "model_state_dict": TinyTokenModel().state_dict(),
            "optimizer_state_dict": {},
            "training_state": {"epoch": 1, "global_step": 3, "optimizer_step": 2},
            "config": {"batch_size": 2},
            "metadata": {"format": "arclm-training-core", "precision": "fp32"},
        },
        path,
    )

    info = validate_checkpoint(path)

    assert info.legacy is True
    assert info.version is None
    assert info.global_step == 3
    assert info.precision == "fp32"


def test_future_checkpoint_version_is_rejected(tmp_path):
    trainer = make_trainer(tmp_path)
    trainer.train()
    checkpoint_dir = trainer.save_checkpoint()
    checkpoint_path = checkpoint_dir / "training.pt"
    checkpoint = torch.load(checkpoint_path, map_location="cpu")
    checkpoint["checkpoint_version"] = CHECKPOINT_VERSION + 100
    torch.save(checkpoint, checkpoint_path)

    with pytest.raises(CheckpointError, match="Unsupported checkpoint version"):
        validate_checkpoint(checkpoint_path)


def test_invalid_payloads_raise_controlled_errors(tmp_path):
    empty = tmp_path / "empty.pt"
    empty.write_bytes(b"")
    with pytest.raises(CheckpointError, match="empty"):
        inspect_checkpoint(empty)

    bad = tmp_path / "bad.pt"
    torch.save({"checkpoint_format": CHECKPOINT_FORMAT, "checkpoint_version": 1}, bad)
    with pytest.raises(CheckpointError, match="model_state_dict"):
        validate_checkpoint(bad)

    invalid_state = tmp_path / "invalid-state.pt"
    torch.save(
        {
            "model_state_dict": TinyTokenModel().state_dict(),
            "optimizer_state_dict": {},
            "training_state": "bad",
        },
        invalid_state,
    )
    with pytest.raises(CheckpointError, match="training_state"):
        validate_checkpoint(invalid_state)


def test_training_state_rejects_invalid_counters():
    with pytest.raises(ValueError, match="global_step"):
        TrainingState.from_dict({"global_step": -1})
    with pytest.raises(ValueError, match="epoch"):
        TrainingState.from_dict({"epoch": "bad"})


def test_rng_state_round_trip_restores_python_numpy_and_torch():
    pytest.importorskip("numpy")
    import numpy as np

    random.seed(10)
    np.random.seed(10)
    torch.manual_seed(10)
    state = capture_rng_state()
    expected_python = random.random()
    expected_numpy = float(np.random.rand())
    expected_torch = torch.rand(1)

    random.seed(99)
    np.random.seed(99)
    torch.manual_seed(99)
    restore_rng_state(state)

    assert random.random() == expected_python
    assert float(np.random.rand()) == expected_numpy
    assert torch.equal(torch.rand(1), expected_torch)


def test_cuda_rng_restore_normalizes_loaded_tensors(monkeypatch):
    captured = {}

    monkeypatch.setattr(torch.cuda, "is_available", lambda: True)

    def fake_set_rng_state_all(states):
        captured["states"] = states

    monkeypatch.setattr(torch.cuda, "set_rng_state_all", fake_set_rng_state_all)
    restore_rng_state(
        {
            "torch_cuda": [
                torch.tensor([1, 2, 3], dtype=torch.uint8),
            ],
        },
        restore_cuda=True,
    )

    assert captured["states"][0].device.type == "cpu"
    assert captured["states"][0].dtype == torch.uint8


def test_atomic_write_preserves_existing_checkpoint_on_failure(tmp_path, monkeypatch):
    trainer = make_trainer(tmp_path)
    trainer.train()
    checkpoint_dir = trainer.save_checkpoint()
    checkpoint_file = checkpoint_dir / "training.pt"
    original = checkpoint_file.read_bytes()
    payload = safe_load_training_checkpoint(checkpoint_file)

    def fail_save(*_args, **_kwargs):
        raise RuntimeError("boom")

    monkeypatch.setattr("arclm.checkpoints.training.torch.save", fail_save)

    with pytest.raises(CheckpointError, match="Could not save checkpoint"):
        atomic_save_checkpoint(payload, checkpoint_file)

    assert checkpoint_file.read_bytes() == original
    assert list(tmp_path.rglob("*.tmp")) == []


def test_resume_restores_rng_state(tmp_path):
    trainer = make_trainer(tmp_path)
    trainer.train()
    checkpoint_dir = trainer.save_checkpoint()
    expected = torch.rand(3)

    torch.manual_seed(999)
    resumed = make_trainer(tmp_path / "resume")
    resumed.load_checkpoint(checkpoint_dir)

    assert torch.equal(torch.rand(3), expected)


def test_epoch_boundary_resume_matches_continuous_training(tmp_path):
    continuous = make_trainer(tmp_path / "continuous", epochs=2, seed=2024)
    continuous.train()
    continuous_state = {
        name: tensor.detach().clone()
        for name, tensor in continuous.model.state_dict().items()
    }

    interrupted = make_trainer(tmp_path / "interrupted", epochs=1, seed=2024)
    interrupted.train()
    checkpoint_dir = interrupted.save_checkpoint()

    resumed = make_trainer(tmp_path / "resumed", epochs=2, seed=999)
    resumed.load_checkpoint(checkpoint_dir)
    resumed.train()

    for name, tensor in resumed.model.state_dict().items():
        assert torch.allclose(tensor, continuous_state[name], atol=1e-7, rtol=0)
    assert resumed.global_step == continuous.global_step
    assert resumed.optimizer_step == continuous.optimizer_step
