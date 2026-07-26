"""Deprecated compatibility facade for ``arclm.loaders``."""

import warnings

warnings.warn(
    "arclm.loaders is deprecated and will be removed in a future release. "
    "Use 'from arclm.checkpoints import SmartLoader' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from ..checkpoints.loaders import *  # noqa: F403
from ..checkpoints.loaders import __all__
