"""Path validation helpers for secure storage."""

from __future__ import annotations

from pathlib import Path

from .errors import SecurityPolicyError


def resolve_under_root(root: str | Path, relative_path: str | Path, *, allow_existing_symlink: bool = False) -> Path:
    """Resolve a relative path under a trusted root."""

    root_path = Path(root).resolve()
    requested = Path(relative_path)
    if requested.is_absolute():
        raise SecurityPolicyError("absolute paths are not allowed")
    target = (root_path / requested).resolve()
    try:
        target.relative_to(root_path)
    except ValueError as exc:
        raise SecurityPolicyError("path traversal is not allowed") from exc
    if target.exists() and target.is_symlink() and not allow_existing_symlink:
        raise SecurityPolicyError("symlink targets are not allowed")
    return target


def safe_relative_path(path: str | Path) -> str:
    """Validate a manifest/storage relative path."""

    value = Path(path)
    if value.is_absolute() or ".." in value.parts:
        raise SecurityPolicyError("manifest path must be safe and relative")
    if any(part in {"", ".", ".."} for part in value.parts):
        raise SecurityPolicyError("manifest path contains an unsafe path segment")
    return value.as_posix()
