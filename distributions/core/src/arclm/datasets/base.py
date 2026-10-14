"""Basisclasses en simpele training datasets voor ArcLM."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Iterator
from typing import Any

from ..exceptions import OptionalDependencyError

try:
    import torch
    from torch.utils.data import DataLoader, Dataset
except Exception:
    torch = None

    class Dataset:
        """Fallback zodat gewone dataset imports licht blijven."""


class BaseDataset(ABC):
    """Basis class voor datasets met lengte en index-toegang."""

    @abstractmethod
    def __len__(self) -> int:
        """Geeft het aantal voorbeelden in de dataset terug."""
        raise NotImplementedError

    @abstractmethod
    def __getitem__(self, index: int) -> dict[str, Any]:
        """Geeft een voorbeeld terug op basis van index."""
        raise NotImplementedError

    def __iter__(self) -> Iterator[dict[str, Any]]:
        """Loopt door de dataset met gewone indexen."""
        for index in range(len(self)):
            yield self[index]


class BaseStreamingDataset(ABC):
    """Basis class voor datasets die je alleen kunt doorlopen."""

    @abstractmethod
    def __iter__(self) -> Iterator[dict[str, Any]]:
        """Loopt door de dataset zonder lengte of index nodig te hebben."""
        raise NotImplementedError


class BaseDataStep(ABC):
    """Basis class voor een stap die een voorbeeld verwerkt."""

    @abstractmethod
    def process(self, example: dict[str, Any]) -> dict[str, Any] | None:
        """Verwerkt een voorbeeld.

        Geef `None` terug als het voorbeeld uit de dataset moet verdwijnen.
        """
        raise NotImplementedError


class BaseCleaner(BaseDataStep):
    """Basis class voor eigen data cleaners."""


class BaseAugmenter(BaseDataStep):
    """Basis class voor eigen data augmenters."""


class BaseDeduplicator(ABC):
    """Basis class voor deduplicatie over een hele dataset."""

    @abstractmethod
    def deduplicate(self, dataset):
        """Verwijdert dubbele voorbeelden uit een dataset."""
        raise NotImplementedError


class BaseSyntheticDataGenerator(ABC):
    """Basis class voor eigen synthetic-data generators."""

    @abstractmethod
    def generate(self, count: int):
        """Maakt `count` nieuwe voorbeelden."""
        raise NotImplementedError


class TextDataset(Dataset):
    """Dataset voor taalmodeltraining met een schuivend venster."""

    def __init__(self, data, block_size):
        """Maakt een dataset van token ids met vaste venstergrootte."""
        self.data = data
        self.block_size = block_size

    def __len__(self):
        """Geeft het aantal mogelijke schuivende vensters terug."""
        return len(self.data) - self.block_size

    def __getitem__(self, idx):
        """Geeft input en target tokens terug voor een venster."""
        if torch is None:
            raise OptionalDependencyError(
                "TextDataset requires a working torch installation."
            )
        x = torch.tensor(self.data[idx : idx + self.block_size])
        y = torch.tensor(self.data[idx + 1 : idx + self.block_size + 1])
        return x, y


def create_dataloader(encoded_data, block_size, batch_size, shuffle=True):
    """Maakt een PyTorch DataLoader van token ids."""
    if torch is None:
        raise OptionalDependencyError(
            "create_dataloader requires a working torch installation."
        )
    dataset = TextDataset(encoded_data, block_size)
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
