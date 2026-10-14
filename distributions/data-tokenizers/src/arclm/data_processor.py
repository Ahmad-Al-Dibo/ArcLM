"""Deprecated compatibility shim for ``arclm.data_processor``."""

import warnings

warnings.warn(
    "arclm.data_processor is deprecated and will be removed in a future release. "
    "Use 'from arclm.datasets import DataProcessor' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .datasets import DataProcessor, ProcessedDataset

__all__ = ["DataProcessor", "ProcessedDataset"]
