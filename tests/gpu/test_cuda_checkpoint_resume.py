"""CUDA checkpoint en resume-tests met nieuwe trainer-objecten."""

from __future__ import annotations

import pytest
import torch

from arclm.training import Trainer, TrainingConfig
from tests.gpu.test_cuda_fp32 import require_cuda
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


pytestmark = [pytest.mark.gpu, pytest.mark.cuda]


def assert_same_parameters(left, right):
    """Controleert of twee modellen dezelfde parameters hebben."""
    for left_param, right_param in zip(left.parameters(), right.parameters()):
        assert torch.allclose(left_param.detach().cpu(), right_param.detach().cpu())


@pytest.mark.parametrize("precision", ["fp32", "fp16", "bf16"])
def test_cuda_checkpoint_resume_with_new_trainer_objects(tmp_path, precision):
    device = require_cuda()
    torch.cuda.set_device(device)
    if precision == "bf16" and not torch.cuda.is_bf16_supported():
        pytest.skip("BF16 CUDA test requires a CUDA device with native BF16 support.")

    torch.cuda.empty_cache()
    torch.cuda.reset_peak_memory_stats()

    config = TrainingConfig(
        epochs=1,
        batch_size=2,
        learning_rate=1e-2,
        gradient_accumulation_steps=2,
        precision=precision,
        max_grad_norm=0.5,
        output_dir=str(tmp_path / precision),
        save_every_steps=0,
        log_every_steps=0,
        device="cuda",
        shuffle=False,
    )
    train_dataset = TinyTokenDataset(size=6, block_size=3, vocab_size=8)
    first = Trainer(
        model=TinyTokenModel(vocab_size=8, hidden_size=6),
        train_dataset=train_dataset,
        config=config,
    )

    state = first.train()
    checkpoint_dir = first.save_checkpoint(tmp_path / f"{precision}-checkpoint")
    checkpoint_file = checkpoint_dir / "training.pt"
    cpu_checkpoint = torch.load(checkpoint_file, map_location="cpu", weights_only=False)

    assert cpu_checkpoint["model_state_dict"]
    assert cpu_checkpoint["optimizer_state_dict"]
    assert "training_state" in cpu_checkpoint
    assert cpu_checkpoint["metadata"]["precision"] == precision
    if precision == "fp16":
        assert cpu_checkpoint["scaler_state_dict"]
    else:
        assert cpu_checkpoint["scaler_state_dict"] == {}

    resumed = Trainer(
        model=TinyTokenModel(vocab_size=8, hidden_size=6),
        train_dataset=train_dataset,
        config=TrainingConfig(
            epochs=2,
            batch_size=2,
            learning_rate=1e-2,
            gradient_accumulation_steps=2,
            precision=precision,
            max_grad_norm=0.5,
            output_dir=str(tmp_path / f"{precision}-resume"),
            save_every_steps=0,
            log_every_steps=0,
            device="cuda",
            shuffle=False,
        ),
    )

    resumed.load_checkpoint(checkpoint_dir)

    assert resumed.state.global_step == state.global_step
    assert resumed.state.optimizer_step == state.optimizer_step
    assert resumed.global_step == state.global_step
    assert resumed.optimizer_step == state.optimizer_step
    assert_same_parameters(first.model, resumed.model)

    continued = resumed.train()

    assert continued.global_step > state.global_step
    assert continued.optimizer_step > state.optimizer_step
    assert next(resumed.model.parameters()).device.type == "cuda"
    assert torch.cuda.max_memory_allocated() > 0
