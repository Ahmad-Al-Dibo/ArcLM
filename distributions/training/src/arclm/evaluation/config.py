"""Configuratie voor eenvoudige evaluatie."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

import torch

from ..exceptions import EvaluationConfigError


@dataclass
class EvaluationConfig:
    """Bewaart instellingen voor een evaluatierun."""

    batch_size: int = 8
    device: str = "cpu"
    max_batches: int | None = None
    ignore_index: int = -100
    return_predictions: bool = False
    prediction_key: str = "logits"
    label_key: str = "labels"

    def __post_init__(self) -> None:
        """Controleert de instellingen na het maken."""
        self.validate()

    def validate(self) -> None:
        """Controleert of de config bruikbaar is.

        Raises:
            EvaluationConfigError: Als een waarde niet geldig is.
        """
        if self.batch_size <= 0:
            raise EvaluationConfigError("batch_size must be greater than zero")
        if self.max_batches is not None and self.max_batches <= 0:
            raise EvaluationConfigError("max_batches must be positive or None")
        if not isinstance(self.ignore_index, int):
            raise EvaluationConfigError("ignore_index must be an integer")
        if self.device.startswith("cuda") and not torch.cuda.is_available():
            raise EvaluationConfigError("CUDA device requested but CUDA is not available")

    def to_dict(self) -> dict[str, Any]:
        """Zet de config om naar een gewone dict."""
        return asdict(self)
