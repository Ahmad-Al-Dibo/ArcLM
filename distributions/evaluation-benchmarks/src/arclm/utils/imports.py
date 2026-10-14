"""Helpers for optional dependencies."""

from __future__ import annotations

import importlib.util

from ..exceptions import OptionalDependencyError


def require_optional_dependency(
    package_name: str,
    feature_name: str,
    install_extra: str,
) -> None:
    """Raise a clear error when an optional dependency is missing."""
    try:
        available = importlib.util.find_spec(package_name) is not None
    except (ImportError, ModuleNotFoundError, ValueError):
        available = False
    if available:
        return
    raise OptionalDependencyError(
        f"{feature_name} requires optional dependency '{package_name}'.\n\n"
        f'Install it with:\n\n    pip install "arclm[{install_extra}]"'
    )


def require_torch(feature_name: str = "This feature") -> None:
    """Fail with a clear install hint when torch-backed code runs without torch."""
    require_optional_dependency("torch", feature_name, "train")
