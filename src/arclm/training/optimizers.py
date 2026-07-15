"""Optimizer helpers voor de training core."""

from __future__ import annotations

import torch

from ..exceptions import TrainingConfigError


def create_optimizer(model, config):
    """Maakt een optimizer voor het model.

    Args:
        model: Het PyTorch model.
        config: Een `TrainingConfig` of object met optimizer velden.

    Returns:
        Een PyTorch optimizer.
    """
    name = getattr(config, "optimizer", "adamw")
    learning_rate = getattr(config, "learning_rate", 2e-5)
    weight_decay = getattr(config, "weight_decay", 0.0)

    if name == "adamw":
        return torch.optim.AdamW(
            model.parameters(),
            lr=learning_rate,
            weight_decay=weight_decay,
        )
    if name == "adam":
        return torch.optim.Adam(
            model.parameters(),
            lr=learning_rate,
            weight_decay=weight_decay,
        )
    if name == "sgd":
        return torch.optim.SGD(
            model.parameters(),
            lr=learning_rate,
            weight_decay=weight_decay,
        )

    raise TrainingConfigError("optimizer must be one of: adamw, adam, sgd")
