"""Kleine callback API voor training."""

from __future__ import annotations


class BaseCallback:
    """Basis class voor eigen training callbacks.

    Subclasses kunnen alleen de hooks overschrijven die ze nodig hebben.
    De trainer blijft zelf bepalen hoe de training loopt.
    """

    def on_train_start(self, trainer) -> None:
        """Wordt uitgevoerd voordat de training begint."""

    def on_train_end(self, trainer) -> None:
        """Wordt uitgevoerd nadat de training klaar is."""

    def on_epoch_start(self, trainer, state) -> None:
        """Wordt uitgevoerd aan het begin van een epoch."""

    def on_epoch_end(self, trainer, state) -> None:
        """Wordt uitgevoerd aan het einde van een epoch."""

    def on_step_end(self, trainer, state) -> None:
        """Wordt uitgevoerd nadat een batch is verwerkt."""

    def on_evaluate(self, trainer, metrics) -> None:
        """Wordt uitgevoerd nadat evaluatie metrics zijn berekend."""

    def on_checkpoint_save(self, trainer, path) -> None:
        """Wordt uitgevoerd nadat een checkpoint is opgeslagen."""
