"""Deprecated compatibility shim for ``arclm.logging``."""

import warnings

warnings.warn(
    "arclm.logging is deprecated and will be removed in a future release. "
    "Use 'from arclm.training.logging import AsyncTrainingLogger' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .training.logging import AsyncTrainingLogger

__all__ = ["AsyncTrainingLogger"]
