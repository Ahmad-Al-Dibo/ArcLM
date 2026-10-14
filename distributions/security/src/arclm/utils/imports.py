"""Helpers voor optionele dependencies."""

from __future__ import annotations

import importlib.util

from ..exceptions import OptionalDependencyError


def require_optional_dependency(
    package_name: str,
    feature_name: str,
    install_extra: str,
) -> None:
    """Geeft een duidelijke fout als een optionele dependency ontbreekt."""
    if importlib.util.find_spec(package_name) is not None:
        return
    raise OptionalDependencyError(
        f"{feature_name} requires optional dependency '{package_name}'.\n\n"
        f'Install it with:\n\n    pip install "arclm[{install_extra}]"'
    )
