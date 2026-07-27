"""Basis classes voor evaluatie."""

from __future__ import annotations

from abc import ABC, abstractmethod


class BaseMetric(ABC):
    """Basis class voor developers die een eigen metric willen maken."""

    name = "metric"

    @abstractmethod
    def update(self, predictions=None, targets=None, loss=None, outputs=None) -> None:
        """Voegt de resultaten van één batch toe."""
        raise NotImplementedError

    @abstractmethod
    def compute(self):
        """Berekent de uiteindelijke waarde van de metric."""
        raise NotImplementedError

    def reset(self) -> None:
        """Maakt de opgeslagen metricwaarden leeg."""


class BaseEvaluator(ABC):
    """Basis class voor eigen evaluators."""

    @abstractmethod
    def evaluate(self, dataset=None):
        """Voert evaluatie uit en geeft de resultaten terug."""
        raise NotImplementedError
