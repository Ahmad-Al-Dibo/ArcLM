"""Lokale CUDA BF16 runtime-tests."""

from __future__ import annotations

import pytest
import torch

from arclm.training import Trainer, TrainingConfig
from tests.gpu.test_cuda_fp16 import RecordingTinyTokenModel, RecordingTrainer
from tests.gpu.test_cuda_fp32 import clone_parameters, parameters_changed, require_cuda
from tests.unit.training._helpers import TinyTokenDataset


pytestmark = [pytest.mark.gpu, pytest.mark.cuda, pytest.mark.bf16]


def test_cuda_bf16_training_checkpoint_and_evaluation(tmp_path):
    device = require_cuda()
    torch.cuda.set_device(device)
    if not torch.cuda.is_bf16_supported():
        pytest.skip("BF16 CUDA test requires a CUDA device with native BF16 support.")

    torch.cuda.empty_cache()
    torch.cuda.reset_peak_memory_stats()

    model = RecordingTinyTokenModel(vocab_size=8, hidden_size=6)
    config = TrainingConfig(
        epochs=1,
        batch_size=2,
        learning_rate=1e-2,
        gradient_accumulation_steps=2,
        precision="bf16",
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

    assert not trainer.precision.scaler.is_enabled()

    state = trainer.train()

    assert state.global_step == 3
    assert state.optimizer_step == 2
    assert state.last_loss is not None
    assert torch.isfinite(torch.tensor(state.last_loss))
    assert parameters_changed(before, trainer.model)
    assert any(trainer.autocast_states)
    assert torch.bfloat16 in model.output_dtypes

    checkpoint_dir = trainer.save_checkpoint(tmp_path / "bf16-checkpoint")
    checkpoint = torch.load(checkpoint_dir / "training.pt", map_location="cpu", weights_only=False)

    assert checkpoint["metadata"]["precision"] == "bf16"
    assert checkpoint["scaler_state_dict"] == {}

    metrics = trainer.evaluate(TinyTokenDataset(size=4, block_size=3, vocab_size=8))

    assert metrics["loss"] > 0
    assert torch.isfinite(torch.tensor(metrics["loss"]))
    assert torch.cuda.max_memory_allocated() > 0
