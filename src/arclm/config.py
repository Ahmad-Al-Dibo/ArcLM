"""Deprecated compatibility shim for ``arclm.config``."""

import warnings

warnings.warn(
    "arclm.config is deprecated and will be removed in a future release. "
    "Use 'from arclm.configs import Config' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .configs import Config, create_config, get_finetuning_config, get_instruction_tuning_config

__all__ = [
    "Config",
    "create_config",
    "get_finetuning_config",
    "get_instruction_tuning_config",
]
