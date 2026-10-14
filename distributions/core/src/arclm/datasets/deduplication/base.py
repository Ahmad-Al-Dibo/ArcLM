"""Basis voor dataset deduplicatie."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from ..base import BaseDeduplicator


@dataclass
class DeduplicationResult:
    """Resultaat van een deduplicatie stap."""

    dataset: list[dict[str, Any]]
    kept: int
    removed: int
    duplicate_keys: list[Any] = field(default_factory=list)

    def __iter__(self):
        """Laat het resultaat direct als dataset gebruiken in een for-loop."""
        return iter(self.dataset)

    def __len__(self) -> int:
        """Geeft het aantal overgebleven voorbeelden terug."""
        return len(self.dataset)


__all__ = ["BaseDeduplicator", "DeduplicationResult"]
