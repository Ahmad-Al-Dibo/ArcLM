"""Resultaat object voor evaluatie."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class EvaluationResult:
    """Bewaart de uitkomst van een evaluatierun."""

    metrics: dict[str, float | None]
    num_examples: int
    num_batches: int
    predictions: list[Any] | None = None
    labels: list[Any] | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Zet het resultaat om naar een gewone dict."""
        return {
            "metrics": self.metrics,
            "num_examples": self.num_examples,
            "num_batches": self.num_batches,
            "predictions": self.predictions,
            "labels": self.labels,
            "metadata": self.metadata,
        }
