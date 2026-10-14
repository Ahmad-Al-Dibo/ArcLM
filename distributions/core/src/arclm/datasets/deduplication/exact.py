"""Exacte deduplicatie voor datasets."""

from __future__ import annotations

import hashlib
import json
from typing import Any

from .base import BaseDeduplicator, DeduplicationResult
from ...exceptions import DeduplicationError


class ExactDeduplicator(BaseDeduplicator):
    """Verwijdert voorbeelden met dezelfde waarde in gekozen velden."""

    def __init__(
        self,
        field: str | None = None,
        fields: list[str] | tuple[str, ...] | None = None,
        *,
        normalize: bool = False,
        keep: str = "first",
        hash_algorithm: str | None = None,
        missing: str = "keep",
    ):
        """Maakt een deduplicator voor één veld, meerdere velden of hele rows."""
        if field is not None and fields is not None:
            raise DeduplicationError("Use either field or fields, not both.")
        self.fields = list(fields) if fields is not None else ([field] if field else None)
        self.normalize = normalize
        self.keep = keep
        self.hash_algorithm = hash_algorithm
        self.missing = missing

        if keep not in {"first", "last"}:
            raise DeduplicationError("keep must be 'first' or 'last'.")
        if missing not in {"keep", "drop", "error"}:
            raise DeduplicationError("missing must be 'keep', 'drop', or 'error'.")

    def deduplicate(self, dataset) -> DeduplicationResult:
        """Geeft een dataset terug zonder exacte duplicaten."""
        rows = list(dataset)
        if self.keep == "last":
            rows = list(reversed(rows))

        seen = set()
        kept_rows = []
        duplicate_keys = []
        removed = 0

        for row in rows:
            key = self._key(row)
            if key is None:
                removed += 1
                continue
            if key in seen:
                removed += 1
                duplicate_keys.append(key)
                continue
            seen.add(key)
            kept_rows.append(row)

        if self.keep == "last":
            kept_rows.reverse()

        return DeduplicationResult(
            dataset=kept_rows,
            kept=len(kept_rows),
            removed=removed,
            duplicate_keys=duplicate_keys,
        )

    def _key(self, row: dict[str, Any]):
        """Maakt de sleutel waarmee twee voorbeelden worden vergeleken."""
        if not isinstance(row, dict):
            raise DeduplicationError("ExactDeduplicator expects dict examples.")

        if self.fields is None:
            value = json.dumps(row, sort_keys=True, ensure_ascii=False)
        else:
            missing_fields = [field for field in self.fields if field not in row]
            if missing_fields:
                if self.missing == "error":
                    fields = ", ".join(missing_fields)
                    raise DeduplicationError(f"Missing deduplication fields: {fields}")
                if self.missing == "drop":
                    return None
                return ("__missing__", id(row))
            value = tuple(row[field] for field in self.fields)

        if self.normalize:
            value = self._normalize_value(value)

        if self.hash_algorithm:
            return self._hash(value)
        return value

    def _normalize_value(self, value):
        """Normaliseert tekstwaarden voordat ze vergeleken worden."""
        if isinstance(value, str):
            return " ".join(value.lower().split())
        if isinstance(value, tuple):
            return tuple(self._normalize_value(part) for part in value)
        return value

    def _hash(self, value) -> str:
        """Hasht een deduplicatie-sleutel met het gekozen algoritme."""
        try:
            hasher = hashlib.new(self.hash_algorithm)
        except ValueError as error:
            raise DeduplicationError(
                f"Unsupported hash algorithm: {self.hash_algorithm}"
            ) from error

        payload = json.dumps(value, sort_keys=True, ensure_ascii=False, default=str)
        hasher.update(payload.encode("utf-8"))
        return hasher.hexdigest()


def deduplicate(dataset, *, return_result: bool = False, **kwargs):
    """Verwijdert exacte duplicaten met `ExactDeduplicator`."""
    result = ExactDeduplicator(**kwargs).deduplicate(dataset)
    return result if return_result else result.dataset
