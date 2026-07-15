"""Deprecated compatibility shim for ``arclm.generator``."""

import warnings

warnings.warn(
    "arclm.generator is deprecated and will be removed in a future release. "
    "Use 'from arclm.inference import Generator' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .inference import Generator, TextGenerator

__all__ = ["Generator", "TextGenerator"]
