"""Lokale CUDA FP32 runtime-tests."""

from __future__ import annotations

import pytest
import torch

from arclm.training import Trainer, TrainingConfig
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


pytestmark = [pytest.mark.gpu, pytest.mark.cuda]


def require_cuda() -> torch.device:
    """Geeft `cuda:0` terug of skipt voordat de test start."""
    if not torch.cuda.is_available():
        pytest.skip("CUDA test requires a CUDA-enabled PyTorch runtime.")
    return torch.device("cuda:0")


def clone_parameters(model):
    """Bewaart een kopie van de huidige parameters."""
    return [parameter.detach().cpu().clone() for parameter in model.parameters()]


def parameters_changed(before, model) -> bool:
    """Controleert of minstens één parameter veranderd is."""
    after = [parameter.detach().cpu() for parameter in model.parameters()]
    return any(not torch.allclose(old, new) for old, new in zip(before, after))


def test_cuda_fp32_training_evaluation_accumulation_and_clipping(tmp_path, monkeypatch):
    device = require_cuda()
    torch.cuda.set_device(device)
    torch.cuda.empty_cache()
    torch.cuda.reset_peak_memory_stats()

    clip_calls = []
    original_clip = torch.nn.utils.clip_grad_norm_

    def record_clip(parameters, max_norm, *args, **kwargs):
        """Legt vast dat clipping op CUDA-parameters gebeurt."""
        params = list(parameters)
        clip_calls.append(
            {
                "max_norm": max_norm,
                "devices": {parameter.device.type for parameter in params},
            }
        )
        return original_clip(params, max_norm, *args, **kwargs)

    monkeypatch.setattr(torch.nn.utils, "clip_grad_norm_", record_clip)

    model = TinyTokenModel(vocab_size=8, hidden_size=6)
    config = TrainingConfig(
        epochs=1,
        batch_size=2,
        learning_rate=1e-2,
        gradient_accumulation_steps=2,
        precision="fp32",
        max_grad_norm=0.5,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
        device="cuda",
        shuffle=False,
    )
    trainer = Trainer(
        model=model,
        train_dataset=TinyTokenDataset(size=6, block_size=3, vocab_size=8),
        validation_dataset=TinyTokenDataset(size=4, block_size=3, vocab_size=8),
        config=config,
    )
    before = clone_parameters(trainer.model)

    state = trainer.train()

    assert trainer.device.type == "cuda"
    assert next(trainer.model.parameters()).device.type == "cuda"
    assert state.global_step == 3
    assert state.optimizer_step == 2
    assert state.last_loss is not None
    assert torch.isfinite(torch.tensor(state.last_loss))
    assert parameters_changed(before, trainer.model)
    assert clip_calls
    assert all(call["devices"] == {"cuda"} for call in clip_calls)

    trainer.model.train()
    metrics = trainer.evaluate(TinyTokenDataset(size=4, block_size=3, vocab_size=8))

    assert trainer.model.training is True
    assert metrics["loss"] > 0
    assert torch.isfinite(torch.tensor(metrics["loss"]))
    assert trainer.state.global_step == state.global_step
    assert torch.cuda.max_memory_allocated() > 0
