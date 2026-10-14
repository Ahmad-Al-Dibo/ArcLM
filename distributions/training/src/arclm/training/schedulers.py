"""Scheduler helpers voor de training core."""

from __future__ import annotations

import math

from ..utils.imports import require_torch

require_torch("ArcLM training")
import torch

from ..exceptions import TrainingConfigError


def create_scheduler(optimizer, config, total_optimizer_steps: int | None = None):
    """Maakt een eenvoudige learning-rate scheduler.

    Args:
        optimizer: De optimizer die aangepast wordt.
        config: Training config met `scheduler` en `warmup_steps`.
        total_optimizer_steps: Totaal aantal optimizer stappen als dat bekend is.

    Returns:
        Een PyTorch scheduler of `None` voor constant zonder warmup.
    """
    name = getattr(config, "scheduler", "constant")
    warmup_steps = getattr(config, "warmup_steps", 0)
    total_steps = total_optimizer_steps or 0

    if name == "constant" and warmup_steps == 0:
        return None

    if name == "constant":
        def lr_lambda(step):
            """Houdt de learning rate constant na warmup."""
            if warmup_steps and step < warmup_steps:
                return max(step, 1) / warmup_steps
            return 1.0
    elif name == "linear":
        def lr_lambda(step):
            """Laat de learning rate lineair dalen na warmup."""
            if warmup_steps and step < warmup_steps:
                return max(step, 1) / warmup_steps
            if total_steps <= warmup_steps:
                return 1.0
            remaining = total_steps - step
            decay_steps = total_steps - warmup_steps
            return max(0.0, remaining / decay_steps)
    elif name == "cosine":
        def lr_lambda(step):
            """Laat de learning rate met een cosine curve dalen."""
            if warmup_steps and step < warmup_steps:
                return max(step, 1) / warmup_steps
            if total_steps <= warmup_steps:
                return 1.0
            progress = (step - warmup_steps) / max(1, total_steps - warmup_steps)
            return 0.5 * (1.0 + math.cos(math.pi * min(progress, 1.0)))
    else:
        raise TrainingConfigError("scheduler must be one of: constant, linear, cosine")

    return torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda)
