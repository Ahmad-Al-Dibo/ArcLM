from __future__ import annotations

from pathlib import Path


def ensure_within_directory(path: str | Path, root: str | Path) -> Path:
    """Resolve a path and ensure it stays under a root directory."""

    resolved_root = Path(root).resolve()
    resolved_path = Path(path).resolve()
    if resolved_path != resolved_root and resolved_root not in resolved_path.parents:
        raise ValueError(f"Path escapes allowed Lab directory: {path}")
    return resolved_path


def stable_sort_key(value: object) -> tuple[str, str]:
    """Return a deterministic sort key for mixed simple values."""

    return (type(value).__name__, repr(value))

