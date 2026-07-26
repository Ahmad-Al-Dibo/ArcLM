"""Deprecated compatibility shim for ``arclm.instruction_dataset``."""

import warnings

warnings.warn(
    "arclm.instruction_dataset is deprecated and will be removed in a future release. "
    "Use 'from arclm.datasets import InstructionDataset' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .datasets import InstructionDataset, create_instruction_dataloader

__all__ = ["InstructionDataset", "create_instruction_dataloader"]
