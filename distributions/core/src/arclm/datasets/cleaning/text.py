"""Tekst cleaners voor dataset voorbeelden."""

from __future__ import annotations

import re
from typing import Any

from .base import BaseCleaner
from ...exceptions import CleaningError

CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
WHITESPACE_RE = re.compile(r"\s+")


def _fields(fields: str | list[str] | tuple[str, ...]) -> list[str]:
    """Zet een veldnaam of lijst met veldnamen om naar een lijst."""
    if isinstance(fields, str):
        return [fields]
    return list(fields)


def _copy_example(example: dict[str, Any]) -> dict[str, Any]:
    """Maakt een kopie van een voorbeeld en controleert het type."""
    if not isinstance(example, dict):
        raise CleaningError("Cleaning steps expect each example to be a dict.")
    return dict(example)


class StripText(BaseCleaner):
    """Haalt spaties aan het begin en einde van tekstvelden weg."""

    def __init__(self, fields: str | list[str] | tuple[str, ...] = "text"):
        """Maakt een stap voor de gekozen tekstvelden."""
        self.fields = _fields(fields)

    def process(self, example: dict[str, Any]) -> dict[str, Any]:
        """Stript de gekozen velden in een kopie van het voorbeeld."""
        item = _copy_example(example)
        for field in self.fields:
            if field in item and isinstance(item[field], str):
                item[field] = item[field].strip()
        return item


class NormalizeWhitespace(BaseCleaner):
    """Vervangt meerdere whitespace tekens door een enkele spatie."""

    def __init__(self, fields: str | list[str] | tuple[str, ...] = "text"):
        """Maakt een whitespace-normalisatie stap."""
        self.fields = _fields(fields)

    def process(self, example: dict[str, Any]) -> dict[str, Any]:
        """Vervangt meerdere whitespace tekens door een enkele spatie."""
        item = _copy_example(example)
        for field in self.fields:
            if field in item and isinstance(item[field], str):
                item[field] = WHITESPACE_RE.sub(" ", item[field]).strip()
        return item


class RemoveControlCharacters(BaseCleaner):
    """Verwijdert control characters uit tekstvelden."""

    def __init__(self, fields: str | list[str] | tuple[str, ...] = "text"):
        """Maakt een stap die control characters verwijdert."""
        self.fields = _fields(fields)

    def process(self, example: dict[str, Any]) -> dict[str, Any]:
        """Verwijdert control characters uit de gekozen velden."""
        item = _copy_example(example)
        for field in self.fields:
            if field in item and isinstance(item[field], str):
                item[field] = CONTROL_RE.sub("", item[field])
        return item


class RemoveEmptyText(BaseCleaner):
    """Verwijdert voorbeelden waar een tekstveld leeg is."""

    def __init__(self, fields: str | list[str] | tuple[str, ...] = "text"):
        """Maakt een filter voor lege tekstvelden."""
        self.fields = _fields(fields)

    def process(self, example: dict[str, Any]) -> dict[str, Any] | None:
        """Geeft None terug als een gekozen tekstveld leeg is."""
        item = _copy_example(example)
        for field in self.fields:
            value = item.get(field, "")
            if not isinstance(value, str) or value.strip() == "":
                return None
        return item
