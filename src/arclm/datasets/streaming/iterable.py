"""Kleine streaming dataset helpers."""

from __future__ import annotations

import csv
import json
from collections.abc import Callable, Iterator
from pathlib import Path
from typing import Any

from ..base import BaseStreamingDataset
from ...exceptions import DatasetLoadError, StreamingError


class StreamingDataset(BaseStreamingDataset):
    """Dataset die voorbeelden pas leest tijdens het itereren."""

    def __init__(self, factory: Callable[[], Iterator[dict[str, Any]]]):
        """Maakt dit object klaar voor gebruik."""
        self._factory = factory

    def __iter__(self) -> Iterator[dict[str, Any]]:
        """Interne helper voor `iter`."""
        return self._factory()

    @classmethod
    def from_jsonl(cls, path: str | Path, encoding: str = "utf-8") -> "StreamingDataset":
        """Leest een JSONL-bestand regel voor regel."""
        path = Path(path)

        def read_rows() -> Iterator[dict[str, Any]]:
            """Voert `read rows` uit."""
            try:
                with path.open("r", encoding=encoding) as file:
                    for line_number, line in enumerate(file, 1):
                        if not line.strip():
                            continue
                        try:
                            value = json.loads(line)
                        except json.JSONDecodeError as error:
                            raise StreamingError(
                                f"Invalid JSON on line {line_number} in {path}"
                            ) from error
                        yield value if isinstance(value, dict) else {"text": value}
            except OSError as error:
                raise DatasetLoadError(f"Could not stream dataset from {path}") from error

        return cls(read_rows)

    @classmethod
    def from_csv(cls, path: str | Path, encoding: str = "utf-8") -> "StreamingDataset":
        """Leest een CSV-bestand rij voor rij."""
        path = Path(path)

        def read_rows() -> Iterator[dict[str, Any]]:
            """Voert `read rows` uit."""
            try:
                with path.open("r", encoding=encoding, newline="") as file:
                    yield from csv.DictReader(file)
            except OSError as error:
                raise DatasetLoadError(f"Could not stream dataset from {path}") from error

        return cls(read_rows)

    @classmethod
    def from_txt(
        cls,
        path: str | Path,
        text_field: str = "text",
        encoding: str = "utf-8",
    ) -> "StreamingDataset":
        """Leest een tekstbestand regel voor regel."""
        path = Path(path)

        def read_rows() -> Iterator[dict[str, Any]]:
            """Voert `read rows` uit."""
            try:
                with path.open("r", encoding=encoding) as file:
                    for line in file:
                        text = line.strip()
                        if text:
                            yield {text_field: text}
            except OSError as error:
                raise DatasetLoadError(f"Could not stream dataset from {path}") from error

        return cls(read_rows)
