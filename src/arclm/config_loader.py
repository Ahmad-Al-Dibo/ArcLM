"""Deprecated compatibility shim for ``arclm.config_loader``."""

import warnings

warnings.warn(
    "arclm.config_loader is deprecated and will be removed in a future release. "
    "Use 'arclm.configs' serialization helpers instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .configs.serialization import (
    create_example_configs,
    load_config,
    load_config_json,
    load_config_yaml,
    save_config,
    save_config_json,
    save_config_yaml,
)

__all__ = [
    "create_example_configs",
    "load_config",
    "load_config_json",
    "load_config_yaml",
    "save_config",
    "save_config_json",
    "save_config_yaml",
]
