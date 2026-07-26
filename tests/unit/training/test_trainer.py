from pathlib import Path

import pytest
import torch

pytest.importorskip("torch.nn")

from arclm.training import BaseCallback, Trainer, TrainingConfig, TrainingState

from ._helpers import TinyTokenDataset, TinyTokenModel


def _trainer(tmp_path, **overrides):
    values = {
        "epochs": 1,
        "batch_size": 1,
        "learning_rate": 1e-2,
        "output_dir": str(tmp_path),
        "save_every_steps": 0,
        "log_every_steps": 0,
    }
    values.update(overrides)
    config = TrainingConfig(**values)
    return Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=4),
        validation_dataset=TinyTokenDataset(size=2),
        config=config,
    )


def test_trainer_runs_single_device_training(tmp_path):
    trainer = _trainer(tmp_path)
    before = [parameter.detach().clone() for parameter in trainer.model.parameters()]

    state = trainer.train()
    after = list(trainer.model.parameters())

    assert isinstance(state, TrainingState)
    assert state.global_step == 4
    assert state.optimizer_step == 4
    assert trainer.train_losses
    assert torch.isfinite(torch.tensor(trainer.train_losses[-1]))
    assert any(
        not torch.equal(old, new.detach())
        for old, new in zip(before, after)
    )


def test_trainer_evaluates_validation_dataset(tmp_path):
    trainer = _trainer(tmp_path)
    trainer.train()

    metrics = trainer.evaluate()

    assert metrics["loss"] > 0
    assert "token_accuracy" in metrics


def test_multiple_epochs_update_state_and_callbacks(tmp_path):
    events = []

    class Recorder(BaseCallback):
        def on_epoch_start(self, trainer, state):
            events.append(("start", state.epoch, state.global_step))

        def on_epoch_end(self, trainer, state):
            events.append(("end", state.epoch, state.global_step))

    trainer = _trainer(tmp_path, epochs=2)
    trainer.callbacks = [Recorder()]

    state = trainer.train()

    assert state.epoch == 2
    assert state.global_step == 8
    assert len(trainer.train_losses) == 2
    assert events == [
        ("start", 0, 0),
        ("end", 1, 4),
        ("start", 1, 4),
        ("end", 2, 8),
    ]


def test_gradient_accumulation_counts_optimizer_steps(tmp_path):
    trainer = _trainer(
        tmp_path,
        gradient_accumulation_steps=2,
    )

    trainer.train()

    assert trainer.global_step == 4
    assert trainer.optimizer_step == 2


def test_gradient_accumulation_scales_loss_and_backwards_each_batch(tmp_path):
    backward_grads = []

    class CountingTrainer(Trainer):
        def training_step(self, batch):
            loss = super().training_step(batch)
            loss.register_hook(lambda grad: backward_grads.append(float(grad.detach())))
            return loss

    config = TrainingConfig(
        epochs=1,
        batch_size=1,
        gradient_accumulation_steps=2,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
    )
    trainer = CountingTrainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=4),
        config=config,
    )

    trainer.train()

    assert len(backward_grads) == 4
    assert backward_grads == [0.5, 0.5, 0.5, 0.5]
    assert trainer.global_step == 4
    assert trainer.optimizer_step == 2


def test_final_incomplete_accumulation_group_steps(tmp_path):
    config = TrainingConfig(
        epochs=1,
        batch_size=1,
        gradient_accumulation_steps=2,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
    )
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=5),
        config=config,
    )

    trainer.train()

    assert trainer.global_step == 5
    assert trainer.optimizer_step == 3


def test_gradient_clipping_runs_before_optimizer_step(tmp_path, monkeypatch):
    events = []
    trainer = _trainer(tmp_path, max_grad_norm=0.5)
    original_step = trainer.optimizer.step

    def clip(parameters, max_norm):
        events.append(("clip", max_norm))
        return torch.tensor(0.0)

    def step(*args, **kwargs):
        events.append(("step", None))
        return original_step(*args, **kwargs)

    monkeypatch.setattr(torch.nn.utils, "clip_grad_norm_", clip)
    monkeypatch.setattr(trainer.optimizer, "step", step)

    trainer.train()

    assert events[:2] == [("clip", 0.5), ("step", None)]


def test_gradient_clipping_is_skipped_when_disabled(tmp_path, monkeypatch):
    calls = []
    trainer = _trainer(tmp_path, max_grad_norm=None)

    def clip(parameters, max_norm):
        calls.append(max_norm)
        return torch.tensor(0.0)

    monkeypatch.setattr(torch.nn.utils, "clip_grad_norm_", clip)

    trainer.train()

    assert calls == []


def test_callbacks_run_in_order(tmp_path):
    events = []

    class Recorder(BaseCallback):
        def on_train_start(self, trainer):
            events.append("train_start")

        def on_epoch_start(self, trainer, state):
            events.append("epoch_start")

        def on_step_end(self, trainer, state):
            events.append("step_end")

        def on_epoch_end(self, trainer, state):
            events.append("epoch_end")

        def on_train_end(self, trainer):
            events.append("train_end")

        def on_checkpoint_save(self, trainer, path):
            events.append(("checkpoint", trainer.state.global_step, path.exists()))

    trainer = _trainer(tmp_path, save_every_steps=2)
    trainer.callbacks = [Recorder()]

    trainer.train()

    assert events[0] == "train_start"
    assert "step_end" in events
    assert ("checkpoint", 2, True) in events
    assert ("checkpoint", 4, True) in events
    assert events[-1] == "train_end"


def test_checkpoint_save_and_resume(tmp_path):
    trainer = _trainer(tmp_path)
    trainer.train()
    checkpoint_path = trainer.save_checkpoint()

    resumed = _trainer(tmp_path)
    resumed.load_checkpoint(checkpoint_path)

    assert resumed.global_step == trainer.global_step
    assert resumed.optimizer_step == trainer.optimizer_step


def test_resume_continues_with_new_trainer_instance(tmp_path):
    first = _trainer(tmp_path, epochs=1, scheduler="linear")
    first.train()
    checkpoint_path = first.save_checkpoint()
    saved_params = {
        name: value.detach().clone()
        for name, value in first.model.state_dict().items()
    }

    second = _trainer(tmp_path, epochs=2, scheduler="linear")
    second.load_checkpoint(checkpoint_path)

    for name, value in second.model.state_dict().items():
        assert torch.equal(value, saved_params[name])
    assert second.global_step == 4
    assert second.optimizer_step == 4
    assert second.scheduler is not None

    second.train()

    assert second.global_step == 8
    assert second.optimizer_step == 8


def test_checkpoint_contains_runtime_state_and_metadata(tmp_path):
    trainer = _trainer(tmp_path, scheduler="linear")
    trainer.train()
    checkpoint_path = trainer.save_checkpoint()

    checkpoint = torch.load(checkpoint_path / "training.pt", map_location="cpu")

    assert "model_state_dict" in checkpoint
    assert "optimizer_state_dict" in checkpoint
    assert "scheduler_state_dict" in checkpoint
    assert "training_state" in checkpoint
    assert "config" in checkpoint
    assert "scaler_state_dict" in checkpoint
    assert checkpoint["metadata"]["format"] == "arclm-training-core"


def test_automatic_checkpoint_retention(tmp_path):
    trainer = _trainer(
        tmp_path,
        save_every_steps=1,
        keep_last_checkpoints=2,
    )

    trainer.train()

    checkpoints = sorted(Path(tmp_path).glob("checkpoint-*"))
    assert len(checkpoints) == 2
    assert all((path / "training.pt").exists() for path in checkpoints)


def test_checkpoint_retention_keeps_newest_by_step(tmp_path):
    config = TrainingConfig(
        epochs=1,
        batch_size=1,
        output_dir=str(tmp_path),
        keep_last_checkpoints=2,
        save_every_steps=0,
        log_every_steps=0,
    )
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=1),
        config=config,
    )
    unrelated = tmp_path / "notes.txt"
    unrelated.write_text("keep me", encoding="utf-8")

    for step in [1, 2, 10]:
        trainer.global_step = step
        trainer.save_checkpoint()

    checkpoints = sorted(
        (path.name for path in tmp_path.glob("checkpoint-*")),
        key=lambda name: int(name.rsplit("-", 1)[1]),
    )

    assert checkpoints == ["checkpoint-2", "checkpoint-10"]
    assert unrelated.exists()


def test_checkpoint_retention_can_be_disabled(tmp_path):
    config = TrainingConfig(
        epochs=1,
        batch_size=1,
        output_dir=str(tmp_path),
        keep_last_checkpoints=None,
        save_every_steps=0,
        log_every_steps=0,
    )
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=1),
        config=config,
    )

    for step in [1, 2, 3]:
        trainer.global_step = step
        trainer.save_checkpoint()

    assert len(list(tmp_path.glob("checkpoint-*"))) == 3


def test_fp16_is_rejected_on_cpu(tmp_path):
    config = TrainingConfig(
        precision="fp16",
        output_dir=str(tmp_path),
        save_every_steps=0,
    )

    try:
        Trainer(
            model=TinyTokenModel(),
            train_dataset=TinyTokenDataset(size=1),
            config=config,
        )
    except Exception as error:
        assert "fp16 precision requires a CUDA device" in str(error)
    else:
        assert torch.cuda.is_available()
