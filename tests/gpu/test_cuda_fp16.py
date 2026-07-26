"""Lokale CUDA FP16 runtime-tests."""

from __future__ import annotations

import pytest
import torch

from arclm.training import Trainer, TrainingConfig
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel
from tests.gpu.test_cuda_fp32 import clone_parameters, parameters_changed, require_cuda


pytestmark = [pytest.mark.gpu, pytest.mark.cuda, pytest.mark.fp16]


class RecordingTinyTokenModel(TinyTokenModel):
    """Klein model dat de output dtype bewaart."""

    def __init__(self, *args, **kwargs):
        """Maakt het model en een dtype-logboek."""
        super().__init__(*args, **kwargs)
        self.output_dtypes = []

    def forward(self, x):
        """Voert forward uit en onthoudt de output dtype."""
        output = super().forward(x)
        self.output_dtypes.append(output.dtype)
        return output


class RecordingTrainer(Trainer):
    """Trainer die autocast-status tijdens training bewaart."""

    def __init__(self, *args, **kwargs):
        """Maakt de trainer en een autocast-logboek."""
        super().__init__(*args, **kwargs)
        self.autocast_states = []

    def training_step(self, batch):
        """Voert één training step uit en onthoudt autocast."""
        self.autocast_states.append(torch.is_autocast_enabled("cuda"))
        return super().training_step(batch)


def test_cuda_fp16_training_scaler_checkpoint_and_evaluation(tmp_path, monkeypatch):
    device = require_cuda()
    torch.cuda.set_device(device)
    torch.cuda.empty_cache()
    torch.cuda.reset_peak_memory_stats()

    grad_checks = []
    original_clip = torch.nn.utils.clip_grad_norm_

    def record_clip(parameters, max_norm, *args, **kwargs):
        """Controleert gradients nadat de scaler ze heeft teruggeschaald."""
        params = list(parameters)
        finite_grads = [
            torch.isfinite(parameter.grad).all().item()
            for parameter in params
            if parameter.grad is not None
        ]
        grad_checks.append(
            {
                "max_norm": max_norm,
                "devices": {parameter.device.type for parameter in params},
                "finite": all(finite_grads),
            }
        )
        return original_clip(params, max_norm, *args, **kwargs)

    monkeypatch.setattr(torch.nn.utils, "clip_grad_norm_", record_clip)

    model = RecordingTinyTokenModel(vocab_size=8, hidden_size=6)
    config = TrainingConfig(
        epochs=1,
        batch_size=2,
        learning_rate=1e-2,
        gradient_accumulation_steps=2,
        precision="fp16",
        max_grad_norm=0.5,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
        device="cuda",
        shuffle=False,
    )
    trainer = RecordingTrainer(
        model=model,
        train_dataset=TinyTokenDataset(size=6, block_size=3, vocab_size=8),
        validation_dataset=TinyTokenDataset(size=4, block_size=3, vocab_size=8),
        config=config,
    )
    before = clone_parameters(trainer.model)

    assert trainer.precision.scaler.is_enabled()

    state = trainer.train()

    assert state.global_step == 3
    assert state.optimizer_step == 2
    assert state.last_loss is not None
    assert torch.isfinite(torch.tensor(state.last_loss))
    assert parameters_changed(before, trainer.model)
    assert any(trainer.autocast_states)
    assert torch.float16 in model.output_dtypes
    assert grad_checks
    assert all(check["devices"] == {"cuda"} for check in grad_checks)
    assert all(check["finite"] for check in grad_checks)

    checkpoint_dir = trainer.save_checkpoint(tmp_path / "fp16-checkpoint")
    checkpoint = torch.load(checkpoint_dir / "training.pt", map_location="cpu", weights_only=False)

    assert checkpoint["metadata"]["precision"] == "fp16"
    assert checkpoint["scaler_state_dict"]

    metrics = trainer.evaluate(TinyTokenDataset(size=4, block_size=3, vocab_size=8))

    assert metrics["loss"] > 0
    assert torch.isfinite(torch.tensor(metrics["loss"]))
    assert torch.cuda.max_memory_allocated() > 0
