"""Canonical metric implementations used by evaluation and diagnostics."""

from __future__ import annotations

import math

from ..utils.imports import require_torch

require_torch("ArcLM evaluation")
import torch

from ..exceptions import MetricError
from .base import BaseMetric


def calculate_perplexity(loss: float) -> float:
    """Return perplexity for a cross-entropy loss value."""

    if loss < 0 or math.isnan(loss) or math.isinf(loss):
        return float("inf")
    return math.exp(loss)


class LossMetric(BaseMetric):
    """Berekent gemiddelde loss per batch."""

    name = "loss"

    def __init__(self) -> None:
        """Maakt de metric klaar."""
        self.reset()

    def update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> None:
        """Voegt loss van één batch toe."""
        if loss is None:
            return
        value = float(loss.detach().item() if torch.is_tensor(loss) else loss)
        if not math.isfinite(value):
            raise MetricError("loss must be finite")
        self.total += value
        self.count += 1

    def compute(self):
        """Geeft de gemiddelde batch loss terug."""
        if self.count == 0:
            return None
        return self.total / self.count

    def reset(self) -> None:
        """Maakt de opgeslagen loss leeg."""
        self.total = 0.0
        self.count = 0


class Perplexity(BaseMetric):
    """Berekent perplexity uit gemiddelde loss."""

    name = "perplexity"

    def __init__(self, max_loss: float = 20.0) -> None:
        """Maakt de perplexity metric.

        Args:
            max_loss: Boven deze loss geven we `inf` terug.
        """
        self.max_loss = max_loss
        self.loss = LossMetric()

    def update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> None:
        """Voegt de batch loss toe."""
        self.loss.update(loss=loss)

    def compute(self):
        """Geeft `exp(loss)` terug als de loss bruikbaar is."""
        value = self.loss.compute()
        if value is None:
            return None
        if not math.isfinite(value) or value > self.max_loss:
            return float("inf")
        return calculate_perplexity(value)

    def reset(self) -> None:
        """Maakt de opgeslagen loss leeg."""
        self.loss.reset()


class Accuracy(BaseMetric):
    """Berekent accuracy voor classificatie of token logits.

    Ondersteund:
    - logits `[batch, classes]` met labels `[batch]`
    - logits `[batch, seq, vocab]` met labels `[batch, seq]`
    """

    name = "accuracy"

    def __init__(self, ignore_index: int = -100) -> None:
        """Maakt de accuracy metric."""
        self.ignore_index = ignore_index
        self.reset()

    def update(self, predictions=None, targets=None, loss=None, outputs=None, batch=None) -> None:
        """Voegt voorspellingen en targets van één batch toe."""
        if predictions is None or targets is None:
            raise MetricError("Accuracy requires predictions and targets")
        if predictions.ndim == targets.ndim + 1:
            predictions = predictions.argmax(dim=-1)
        elif predictions.ndim != targets.ndim:
            raise MetricError(
                "Accuracy expects logits with one extra class dimension or predictions matching targets"
            )

        if predictions.shape != targets.shape:
            raise MetricError(
                f"Accuracy shape mismatch: predictions={tuple(predictions.shape)}, targets={tuple(targets.shape)}"
            )

        active = targets != self.ignore_index
        if isinstance(batch, dict) and batch.get("mask") is not None:
            active = active & batch["mask"].bool()
        active_count = int(active.sum().item())
        if active_count == 0:
            return
        self.correct += int(((predictions == targets) & active).sum().item())
        self.total += active_count

    def compute(self):
        """Geeft accuracy tussen 0 en 1 terug."""
        if self.total == 0:
            return None
        return self.correct / self.total

    def reset(self) -> None:
        """Maakt de tellingen leeg."""
        self.correct = 0
        self.total = 0
