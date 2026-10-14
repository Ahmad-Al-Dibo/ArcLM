"""Callbacks voor evaluatie."""

from __future__ import annotations


class BaseEvaluationCallback:
    """Basis class voor eigen evaluation callbacks."""

    def on_evaluate_start(self, evaluator) -> None:
        """Wordt uitgevoerd voordat de evaluatie begint."""

    def on_batch_end(self, evaluator, batch_index: int, metrics: dict) -> None:
        """Wordt uitgevoerd nadat één batch is verwerkt."""

    def on_evaluate_end(self, evaluator, result) -> None:
        """Wordt uitgevoerd nadat de evaluatie klaar is."""
