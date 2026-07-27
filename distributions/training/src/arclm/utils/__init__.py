"""Publieke utility API voor kleine ArcLM helpers."""

from __future__ import annotations

from importlib import import_module
from typing import Any

from .imports import require_optional_dependency

_EXPORTS = {
    "BenchmarkMetrics": "arclm.utils.formatting",
    "PreModelBenchmark": "arclm.utils.formatting",
    "format_duration": "arclm.utils.formatting",
}

__all__ = [
    "BenchmarkMetrics",
    "PreModelBenchmark",
    "format_duration",
    "require_optional_dependency",
]


def __getattr__(name: str) -> Any:
    """Laadt utility exports pas wanneer ze worden opgevraagd."""
    if name in _EXPORTS:
        module = import_module(_EXPORTS[name])
        value = getattr(module, name)
        globals()[name] = value
        return value
    raise AttributeError(f"module 'arclm.utils' has no attribute {name!r}")
