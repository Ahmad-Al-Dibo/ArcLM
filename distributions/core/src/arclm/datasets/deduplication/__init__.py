"""Publieke deduplicatie helpers."""

from .base import BaseDeduplicator, DeduplicationResult
from .exact import ExactDeduplicator, deduplicate

RemoveDuplicates = ExactDeduplicator

__all__ = [
    "BaseDeduplicator",
    "DeduplicationResult",
    "ExactDeduplicator",
    "RemoveDuplicates",
    "deduplicate",
]
