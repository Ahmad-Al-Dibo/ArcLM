"""Deprecated compatibility shim for ``arclm.dataset``."""

import warnings

warnings.warn(
    "arclm.dataset is deprecated and will be removed in a future release. "
    "Use 'from arclm.datasets import TextDataset, create_dataloader' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .datasets import TextDataset, create_dataloader

__all__ = ["TextDataset", "create_dataloader"]
