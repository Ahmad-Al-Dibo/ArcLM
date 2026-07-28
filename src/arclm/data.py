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
from .data_quality import (
    DataQualityReport,
    DuplicateReport,
    ShardResult,
    SplitResult,
    analyze_dataset,
    check_leakage,
    find_duplicates,
    find_near_duplicates,
    shard_dataset,
    split_dataset,
)
from .data_sources import DatasetSource, DatasetSourceMetadata, open_dataset
from .schemas import (
    ConversationRecord,
    DatasetValidationReport,
    InstructionRecord,
    PromptCompletionRecord,
    TextRecord,
    ValidationIssue,
    validate_record,
    validate_records,
)

__all__ = [
    "ConversationRecord",
    "DataBundle",
    "DataQualityReport",
    "DatasetSource",
    "DatasetSourceMetadata",
    "DatasetValidationReport",
    "DuplicateReport",
    "InstructionRecord",
    "PromptCompletionRecord",
    "ShardResult",
    "SplitResult",
    "TextRecord",
    "ValidationIssue",
    "analyze_dataset",
    "check_leakage",
    "find_duplicates",
    "find_near_duplicates",
    "load_tokenizer_from_checkpoint",
    "load_tokens",
    "open_dataset",
    "prepare_data",
    "read_tokens",
    "shard_dataset",
    "split_dataset",
    "split_train_val",
    "validate_record",
    "validate_records",
]
