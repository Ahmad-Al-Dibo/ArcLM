"""Kleine filters en field helpers voor datasets."""

from __future__ import annotations

from typing import Any

from .base import BaseCleaner
from .text import _copy_example, _fields


class FilterByLength(BaseCleaner):
    """Houdt tekst alleen als de lengte binnen de grenzen valt."""

    def __init__(
        self,
        field: str = "text",
        *,
        min_length: int | None = None,
        max_length: int | None = None,
    ):
        """Maakt een lengtefilter voor een tekstveld."""
        self.field = field
        self.min_length = min_length
        self.max_length = max_length

    def process(self, example: dict[str, Any]) -> dict[str, Any] | None:
        """Geeft None terug als de tekst te kort of te lang is."""
        item = _copy_example(example)
        text = str(item.get(self.field, ""))
        length = len(text)

        if self.min_length is not None and length < self.min_length:
            return None
        if self.max_length is not None and length > self.max_length:
            return None
        return item


class SelectFields(BaseCleaner):
    """Houdt alleen de gekozen velden over."""

    def __init__(self, fields: str | list[str] | tuple[str, ...]):
        """Maakt een stap die alleen de gekozen velden bewaart."""
        self.fields = _fields(fields)

    def process(self, example: dict[str, Any]) -> dict[str, Any]:
        """Geeft een nieuw voorbeeld terug met alleen de gekozen velden."""
        item = _copy_example(example)
        return {field: item[field] for field in self.fields if field in item}


class RenameFields(BaseCleaner):
    """Hernoemt velden volgens een mapping."""

    def __init__(self, mapping: dict[str, str]):
        """Maakt een stap met oude veldnamen naar nieuwe veldnamen."""
        self.mapping = dict(mapping)

    def process(self, example: dict[str, Any]) -> dict[str, Any]:
        """Hernoemt velden volgens de mapping."""
        item = _copy_example(example)
        for old_name, new_name in self.mapping.items():
            if old_name in item:
                item[new_name] = item.pop(old_name)
        return item


class DropFields(BaseCleaner):
    """Verwijdert de gekozen velden."""

    def __init__(self, fields: str | list[str] | tuple[str, ...]):
        """Maakt een stap die velden verwijdert."""
        self.fields = _fields(fields)

    def process(self, example: dict[str, Any]) -> dict[str, Any]:
        """Verwijdert de gekozen velden uit een kopie van het voorbeeld."""
        item = _copy_example(example)
        for field in self.fields:
            item.pop(field, None)
        return item
