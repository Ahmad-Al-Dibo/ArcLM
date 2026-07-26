"""Deprecated compatibility shim for ``arclm.model``."""

import warnings

warnings.warn(
    "arclm.model is deprecated and will be removed in a future release. "
    "Use 'from arclm.models import ArcLM' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .models import ArcLM, AutoModel, GPTBlock, MiniGPT, SelfAttention

__all__ = ["ArcLM", "AutoModel", "GPTBlock", "MiniGPT", "SelfAttention"]
