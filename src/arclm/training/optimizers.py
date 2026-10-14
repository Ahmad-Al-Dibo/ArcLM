"""Optimizer helpers voor de training core."""

from __future__ import annotations

from ..utils.imports import require_torch

require_torch("ArcLM training")
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

    parameters = [parameter for parameter in model.parameters() if parameter.requires_grad]
    if not parameters:
        raise TrainingConfigError("optimizer requires at least one trainable parameter")

    if name == "adamw":
        return torch.optim.AdamW(
            parameters,
            lr=learning_rate,
            weight_decay=weight_decay,
        )
    if name == "adam":
        return torch.optim.Adam(
            parameters,
            lr=learning_rate,
            weight_decay=weight_decay,
        )
    if name == "sgd":
        return torch.optim.SGD(
            parameters,
            lr=learning_rate,
            weight_decay=weight_decay,
        )

    raise TrainingConfigError("optimizer must be one of: adamw, adam, sgd")
