"""Deprecated compatibility shim for ``arclm.data``."""

import warnings

warnings.warn(
    "arclm.data is deprecated and will be removed in a future release. "
    "Use 'from arclm.datasets import prepare_data' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .datasets import (
    DataBundle,
    load_tokenizer_from_checkpoint,
    load_tokens,
    prepare_data,
    read_tokens,
    split_train_val,
)

__all__ = [
    "DataBundle",
    "load_tokenizer_from_checkpoint",
    "load_tokens",
    "prepare_data",
    "read_tokens",
    "split_train_val",
]
