"""Plugin interfaces zonder automatisch plugins te zoeken bij import."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class PluginMetadata:
    """Kleine beschrijving van een plugin."""

    name: str
    version: str


class PluginProtocol(Protocol):
    """Contract voor plugins die zelf ArcLM uitbreidingen registreren."""

    metadata: PluginMetadata

    def register(self) -> None:
        """Registreert de onderdelen die de plugin toevoegt aan ArcLM."""
