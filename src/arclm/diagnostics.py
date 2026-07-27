"""Deprecated compatibility shim for ``arclm.diagnostics``."""

import warnings

warnings.warn(
    "arclm.diagnostics is deprecated and will be removed in a future release. "
    "Use 'from arclm.evaluation import calculate_metrics' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .evaluation import *  # noqa: F403
from .evaluation import __all__
