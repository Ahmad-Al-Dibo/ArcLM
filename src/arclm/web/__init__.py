"""Publieke API voor de moderne lokale ArcLM Web API."""

from __future__ import annotations

from arclm.exceptions import OptionalDependencyError

from .config import DatasetRoot, WebConfig

_WEB_DEPENDENCY_MESSAGE = (
    "ArcLM Web API requires the optional web dependencies.\n\n"
    "Install them with:\n\n"
    '    pip install "arclm[web]"'
)

try:
    from .app import create_app
except RuntimeError as exc:
    _IMPORT_ERROR = exc

    def create_app(*args, **kwargs):  # type: ignore[no-untyped-def]
        """Geeft een duidelijke fout als de web dependencies ontbreken."""
        raise OptionalDependencyError(str(_IMPORT_ERROR)) from _IMPORT_ERROR
except ModuleNotFoundError as exc:
    if exc.name not in {"fastapi", "starlette", "pydantic"}:
        raise
    _IMPORT_ERROR = exc

    def create_app(*args, **kwargs):  # type: ignore[no-untyped-def]
        """Geeft een duidelijke fout als de web dependencies ontbreken."""
        raise OptionalDependencyError(_WEB_DEPENDENCY_MESSAGE) from _IMPORT_ERROR


__all__ = ["DatasetRoot", "WebConfig", "create_app"]
