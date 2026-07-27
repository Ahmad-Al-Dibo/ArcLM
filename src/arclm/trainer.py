"""Deprecated compatibility shim for ``arclm.trainer``."""

import warnings

warnings.warn(
    "arclm.trainer is deprecated and will be removed in a future release. "
    "Use 'from arclm.training import Trainer' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .training import Trainer

__all__ = ["Trainer"]
