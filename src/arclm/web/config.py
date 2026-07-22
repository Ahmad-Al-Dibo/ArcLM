"""Configuratie voor de lokale ArcLM Web API."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

from arclm.exceptions import ConfigurationError


DEFAULT_ALLOWED_ORIGINS = (
    "http://127.0.0.1:3000",
    "http://localhost:3000",
)

@dataclass(frozen=True)
class DatasetRoot:
    """Een server-side datasetmap die de browser mag laten inspecteren.

    De browser krijgt alleen veilige dataset-IDs terug. Het echte pad blijft
    alleen aan de serverkant bekend.
    """

    name: str
    path: str | Path
    root_id: str | None = None
    enabled: bool = True
    recursive: bool = True
    source_origin: Literal["persisted", "command_line"] = "command_line"

    def __post_init__(self) -> None:
        """Controleert of de rootnaam veilig is voor IDs en logs."""
        if not isinstance(self.name, str) or not self.name:
            raise ConfigurationError("dataset root name must be a non-empty string")
        if any(char in self.name for char in "\r\n\t"):
            raise ConfigurationError("dataset root name must not contain control characters")
        if not isinstance(self.path, (str, Path)):
            raise ConfigurationError("dataset root path must be a string or Path")
        if self.root_id is None:
            object.__setattr__(self, "root_id", _root_id(self.name, self.path))
        if not isinstance(self.root_id, str) or not self.root_id.startswith("root_"):
            raise ConfigurationError("dataset root id must start with 'root_'")
        if not isinstance(self.enabled, bool):
            raise ConfigurationError("dataset root enabled must be a boolean")
        if not isinstance(self.recursive, bool):
            raise ConfigurationError("dataset root recursive must be a boolean")
        if self.source_origin not in {"persisted", "command_line"}:
            raise ConfigurationError("dataset root source_origin is invalid")


def _root_id(name: str, path: str | Path) -> str:
    """Maakt een stabiele veilige ID voor een datasetroot."""
    payload = f"{name}\0{Path(path).as_posix()}".encode("utf-8", errors="replace")
    return "root_" + hashlib.sha256(payload).hexdigest()[:10]


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
    dataset_config_path: str | Path | None = None
    dataset_source_management: bool = True
    workspace_root: str | Path = "workspace"
    dataset_roots: tuple[DatasetRoot, ...] = ()
    max_dataset_roots: int = 20
    max_catalogue_entries: int = 500
    max_recursive_depth: int = 5
    default_preview_rows: int = 20
    max_preview_rows: int = 100
    max_scan_rows: int = 10_000
    max_field_length: int = 2_000
    max_fields: int = 200
    max_inspection_file_size: int = 10 * 1024 * 1024
    max_upload_size: int = 25 * 1024 * 1024
    max_paste_size: int = 2 * 1024 * 1024
    max_tokenizer_text_length: int = 20_000
    max_dataset_inspection_records: int = 20
    max_dataset_inspection_tokens: int = 256
    max_active_training_jobs: int = 1
    max_evaluation_examples: int = 256
    max_generation_prompt_chars: int = 8_000
    max_generation_new_tokens: int = 128
    max_generation_history: int = 100

    def __post_init__(self) -> None:
        """Controleert of de configuratie veilig en bruikbaar is."""
        if not self.host or not isinstance(self.host, str):
            raise ConfigurationError("host must be a non-empty string")
        if not isinstance(self.port, int) or not 1 <= self.port <= 65535:
            raise ConfigurationError("port must be between 1 and 65535")
        if not isinstance(self.expose_docs, bool):
            raise ConfigurationError("expose_docs must be a boolean")
        if not isinstance(self.dataset_source_management, bool):
            raise ConfigurationError("dataset_source_management must be a boolean")
        if self.dataset_config_path is not None and not isinstance(self.dataset_config_path, (str, Path)):
            raise ConfigurationError("dataset_config_path must be a string or Path")
        if not isinstance(self.workspace_root, (str, Path)):
            raise ConfigurationError("workspace_root must be a string or Path")
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
            "max_dataset_roots": self.max_dataset_roots,
            "max_recursive_depth": self.max_recursive_depth,
            "default_preview_rows": self.default_preview_rows,
            "max_preview_rows": self.max_preview_rows,
            "max_scan_rows": self.max_scan_rows,
            "max_field_length": self.max_field_length,
            "max_fields": self.max_fields,
            "max_inspection_file_size": self.max_inspection_file_size,
            "max_upload_size": self.max_upload_size,
            "max_paste_size": self.max_paste_size,
            "max_tokenizer_text_length": self.max_tokenizer_text_length,
            "max_dataset_inspection_records": self.max_dataset_inspection_records,
            "max_dataset_inspection_tokens": self.max_dataset_inspection_tokens,
            "max_active_training_jobs": self.max_active_training_jobs,
            "max_evaluation_examples": self.max_evaluation_examples,
            "max_generation_prompt_chars": self.max_generation_prompt_chars,
            "max_generation_new_tokens": self.max_generation_new_tokens,
            "max_generation_history": self.max_generation_history,
        }
        for name, value in positive_limits.items():
            if not isinstance(value, int) or value <= 0:
                raise ConfigurationError(f"{name} must be greater than zero")

        if self.default_preview_rows > self.max_preview_rows:
            raise ConfigurationError("default_preview_rows must not exceed max_preview_rows")
        if self.max_active_training_jobs != 1:
            raise ConfigurationError("max_active_training_jobs is currently limited to 1")
