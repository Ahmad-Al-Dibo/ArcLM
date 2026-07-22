"""Resultaat object voor evaluatie."""

from __future__ import annotations

import json
import time
from dataclasses import asdict, dataclass, field
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


@dataclass(frozen=True)
class EvaluationReport:
    """Structured, JSON-safe summary of an evaluation run."""

    metrics: dict[str, float | int | str | None]
    num_examples: int
    num_batches: int
    num_tokens: int | None
    model_identity: str | None
    checkpoint_identity: str | None
    dataset_identity: str | None
    evaluation_timestamp: float
    device: str | None
    dtype: str | None
    warnings: tuple[str, ...] = ()

    def to_dict(self) -> dict[str, Any]:
        """Return JSON-safe report data."""

        data = asdict(self)
        data["warnings"] = list(self.warnings)
        return data

    def to_json(self) -> str:
        """Serialize the report."""

        return json.dumps(self.to_dict(), indent=2, sort_keys=True)

    def summary(self) -> str:
        """Return a short human-readable evaluation summary."""

        metric_text = ", ".join(f"{key}={value}" for key, value in self.metrics.items())
        return (
            "Evaluation Report\n"
            f"Examples: {self.num_examples}\n"
            f"Batches: {self.num_batches}\n"
            f"Metrics: {metric_text}\n"
            f"Device: {self.device or 'unknown'}"
        )


def build_evaluation_report(
    result: EvaluationResult,
    *,
    model: Any | None = None,
    checkpoint_identity: str | None = None,
    dataset_identity: str | None = None,
    num_tokens: int | None = None,
    warnings: list[str] | tuple[str, ...] = (),
) -> EvaluationReport:
    """Build a report from canonical evaluator metrics without recalculation."""

    metadata = dict(result.metadata or {})
    model_identity = type(model).__name__ if model is not None else metadata.get("model_identity")
    dtype = metadata.get("dtype")
    if dtype is None and model is not None:
        try:
            dtype = str(next(model.parameters()).dtype)
        except Exception:
            dtype = None
    return EvaluationReport(
        metrics=_safe_metrics(result.metrics),
        num_examples=int(result.num_examples),
        num_batches=int(result.num_batches),
        num_tokens=num_tokens if num_tokens is not None else metadata.get("num_tokens"),
        model_identity=model_identity,
        checkpoint_identity=checkpoint_identity or metadata.get("checkpoint_identity"),
        dataset_identity=dataset_identity or metadata.get("dataset_identity"),
        evaluation_timestamp=float(metadata.get("evaluation_timestamp") or time.time()),
        device=metadata.get("device"),
        dtype=dtype,
        warnings=tuple(str(item) for item in warnings),
    )


def _safe_metrics(metrics: dict[str, Any]) -> dict[str, float | int | str | None]:
    """Keep evaluation metrics JSON-safe and scalar."""

    safe: dict[str, float | int | str | None] = {}
    for key, value in dict(metrics).items():
        if hasattr(value, "item"):
            value = value.item()
        if isinstance(value, (float, int, str)) or value is None:
            safe[str(key)] = value
    return safe
