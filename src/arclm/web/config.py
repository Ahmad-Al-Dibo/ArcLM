"""Configuratie voor de lokale ArcLM Web API."""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from arclm.exceptions import ConfigurationError


DEFAULT_ALLOWED_ORIGINS = (
    "http://127.0.0.1:3000",
    "http://localhost:3000",
)

_ROOT_NAME_PATTERN = re.compile(r"^[A-Za-z0-9_-]+$")


@dataclass(frozen=True)
class DatasetRoot:
    """Een server-side datasetmap die de browser mag laten inspecteren.

    De browser krijgt alleen veilige dataset-IDs terug. Het echte pad blijft
    alleen aan de serverkant bekend.
    """

    name: str
    path: str | Path

    def __post_init__(self) -> None:
        """Controleert of de rootnaam veilig is voor IDs en logs."""
        if not isinstance(self.name, str) or not self.name:
            raise ConfigurationError("dataset root name must be a non-empty string")
        if not _ROOT_NAME_PATTERN.fullmatch(self.name):
            raise ConfigurationError(
                "dataset root name may only contain letters, numbers, '_' and '-'"
            )
        if not isinstance(self.path, (str, Path)):
            raise ConfigurationError("dataset root path must be a string or Path")


@dataclass(frozen=True)
class WebConfig:
    """Instellingen voor de lokale Web API.

    De defaults zijn lokaal en klein. Een remote host moet bewust worden
    gekozen, zodat de API niet per ongeluk op het netwerk staat.
    """

    host: str = "127.0.0.1"
    port: int = 8765
    allowed_origins: tuple[str, ...] = DEFAULT_ALLOWED_ORIGINS
    expose_docs: bool = True
    dataset_roots: tuple[DatasetRoot, ...] = ()
    max_catalogue_entries: int = 500
    default_preview_rows: int = 20
    max_preview_rows: int = 100
    max_scan_rows: int = 10_000
    max_field_length: int = 2_000
    max_fields: int = 200
    max_inspection_file_size: int = 10 * 1024 * 1024

    def __post_init__(self) -> None:
        """Controleert of de configuratie veilig en bruikbaar is."""
        if not self.host or not isinstance(self.host, str):
            raise ConfigurationError("host must be a non-empty string")
        if not isinstance(self.port, int) or not 1 <= self.port <= 65535:
            raise ConfigurationError("port must be between 1 and 65535")
        if not isinstance(self.expose_docs, bool):
            raise ConfigurationError("expose_docs must be a boolean")
        if not self.allowed_origins:
            raise ConfigurationError("allowed_origins must not be empty")
        if "*" in self.allowed_origins:
            raise ConfigurationError("allowed_origins must not contain '*'")
        for origin in self.allowed_origins:
            if not isinstance(origin, str) or not origin.startswith(("http://", "https://")):
                raise ConfigurationError("allowed_origins must contain absolute HTTP origins")
        self._validate_dataset_settings()

    @property
    def is_remote_binding(self) -> bool:
        """Geeft terug of de API buiten localhost kan luisteren."""
        return self.host not in {"127.0.0.1", "localhost", "::1"}

    def _validate_dataset_settings(self) -> None:
        """Controleert datasetroots en limieten voor de inspector."""
        if not isinstance(self.dataset_roots, tuple):
            raise ConfigurationError("dataset_roots must be a tuple")

        names: set[str] = set()
        for root in self.dataset_roots:
            if not isinstance(root, DatasetRoot):
                raise ConfigurationError("dataset_roots must contain DatasetRoot values")
            if root.name in names:
                raise ConfigurationError("dataset root names must be unique")
            names.add(root.name)
            resolved = Path(root.path).expanduser().resolve()
            if not resolved.exists():
                raise ConfigurationError("dataset root does not exist")
            if not resolved.is_dir():
                raise ConfigurationError("dataset root must be a directory")

        positive_limits = {
            "max_catalogue_entries": self.max_catalogue_entries,
            "default_preview_rows": self.default_preview_rows,
            "max_preview_rows": self.max_preview_rows,
            "max_scan_rows": self.max_scan_rows,
            "max_field_length": self.max_field_length,
            "max_fields": self.max_fields,
            "max_inspection_file_size": self.max_inspection_file_size,
        }
        for name, value in positive_limits.items():
            if not isinstance(value, int) or value <= 0:
                raise ConfigurationError(f"{name} must be greater than zero")

        if self.default_preview_rows > self.max_preview_rows:
            raise ConfigurationError("default_preview_rows must not exceed max_preview_rows")
