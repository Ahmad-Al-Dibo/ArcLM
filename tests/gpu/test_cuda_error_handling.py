"""Veilige CUDA foutgedrag-tests."""

from __future__ import annotations

import pytest
import torch
from torch import nn

from arclm.training import Trainer, TrainingConfig
from tests.gpu.test_cuda_fp32 import require_cuda
from tests.unit.training._helpers import TinyTokenDataset


pytestmark = [pytest.mark.gpu, pytest.mark.cuda]


class SimulatedCudaOomModel(nn.Module):
    """Klein model dat veilig een CUDA OOM nadoet."""

    def __init__(self):
        """Maakt één parameter zodat de optimizer geldig is."""
        super().__init__()
        self.weight = nn.Parameter(torch.ones(()))

    def forward(self, x):
        """Geeft een duidelijke CUDA OOM fout zonder grote allocatie."""
        raise torch.cuda.OutOfMemoryError(
            "CUDA out of memory. Simulated tiny validation failure."
        )


def test_cuda_oom_error_is_not_silently_moved_to_cpu(tmp_path):
    device = require_cuda()
    torch.cuda.set_device(device)
    torch.cuda.empty_cache()

    trainer = Trainer(
        model=SimulatedCudaOomModel(),
        train_dataset=TinyTokenDataset(size=2, block_size=3, vocab_size=8),
        config=TrainingConfig(
            epochs=1,
            batch_size=1,
            learning_rate=1e-2,
            precision="fp32",
            output_dir=str(tmp_path),
            save_every_steps=0,
            log_every_steps=0,
            device="cuda",
        ),
    )

    with pytest.raises(torch.cuda.OutOfMemoryError, match="CUDA out of memory"):
        trainer.train()

    assert trainer.device.type == "cuda"
    assert next(trainer.model.parameters()).device.type == "cuda"

    torch.cuda.empty_cache()
    probe = torch.ones(1, device=device)
    assert probe.item() == 1
