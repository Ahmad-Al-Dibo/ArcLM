"""Deprecated compatibility shim for ``arclm.sft``."""

import warnings

warnings.warn(
    "arclm.sft is deprecated and will be removed in a future release. "
    "Use 'from arclm.finetuning import train_sft' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .finetuning.sft import *  # noqa: F403
from .finetuning.sft import (
    SFTTrainingResult,
    _find_subsequence,
    _load_sft_records,
    train_sft,
)

__all__ = [
    "SFTTrainingResult",
    "_find_subsequence",
    "_load_sft_records",
    "train_sft",
]
