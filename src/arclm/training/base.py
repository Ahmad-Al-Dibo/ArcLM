"""Basis classes voor ArcLM training workflows."""

from abc import ABC, abstractmethod


class BaseModelLoader(ABC):
    """Basis class voor model loaders die een model en metadata geven."""

    @abstractmethod
    def load(self):
        """Laadt een modelbron."""
        raise NotImplementedError


class BaseModelAdapter(ABC):
    """Basis class voor adapters tussen twee model implementaties."""

    @abstractmethod
    def adapt_weights(self, verbose: bool = True):
        """Zet source weights om naar het doelmodel."""
        raise NotImplementedError


class BaseTrainingPipeline(ABC):
    """Basis class voor aanpasbare training pipelines."""

    @abstractmethod
    def build(self, vocab_size: int):
        """Bouwt de pipeline voor een vocabulairegrootte."""
        raise NotImplementedError

    @abstractmethod
    def train(self, train_loader, val_loader=None, num_epochs=None):
        """Start de pipeline training."""
        raise NotImplementedError

    @abstractmethod
    def save_checkpoint(self, path=None):
        """Slaat de pipeline state op."""
        raise NotImplementedError

    @abstractmethod
    def get_model(self):
        """Geeft het huidige model terug."""
        raise NotImplementedError


class BaseTrainer(ABC):
    """Basis class voor developers die een eigen trainer willen maken.

    De class houdt het contract klein: trainen, één training step, en
    optioneel evalueren.
    """

    @abstractmethod
    def train(self, *args, **kwargs):
        """Start de training."""
        raise NotImplementedError

    @abstractmethod
    def training_step(self, batch):
        """Voert één training step uit en geeft de loss terug."""
        raise NotImplementedError

    def evaluate(self, dataset=None):
        """Voert een eenvoudige evaluatie uit.

        Subclasses mogen dit overschrijven als ze eigen metrics nodig hebben.
        """
        raise NotImplementedError
