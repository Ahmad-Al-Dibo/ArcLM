"""Dataset en data-loading public API."""

from .base import (
    BaseAugmenter,
    BaseCleaner,
    BaseDataStep,
    BaseDataset,
    BaseDeduplicator,
    BaseStreamingDataset,
    BaseSyntheticDataGenerator,
    TextDataset,
    create_dataloader,
)
from .deduplication import (
    DeduplicationResult,
    ExactDeduplicator,
    RemoveDuplicates,
    deduplicate,
)
from .instruction import InstructionDataset, create_instruction_dataloader
from .loader import (
    DataBundle,
    DatasetConfig,
    DatasetLoader,
    load_dataset,
    load_tokenizer_from_checkpoint,
    load_tokens,
    prepare_data,
    read_tokens,
    split_train_val,
)
from .pipeline import DataPipeline
from .processing import DataProcessor, ProcessedDataset
from .streaming import StreamingDataset
from .validation import (
    DatasetManifest,
    DatasetReport,
    DatasetValidationIssue,
    DatasetValidationResult,
    build_dataset_report,
    create_dataset_manifest,
    validate_records,
)

DataCleaner = BaseCleaner
Deduplicator = BaseDeduplicator
DataAugmenter = BaseAugmenter

__all__ = [
    "BaseAugmenter",
    "BaseCleaner",
    "BaseDataStep",
    "BaseDataset",
    "BaseDeduplicator",
    "BaseStreamingDataset",
    "BaseSyntheticDataGenerator",
    "DataAugmenter",
    "DataBundle",
    "DataCleaner",
    "DataPipeline",
    "DataProcessor",
    "DatasetConfig",
    "DatasetLoader",
    "DatasetManifest",
    "DatasetReport",
    "DatasetValidationIssue",
    "DatasetValidationResult",
    "Deduplicator",
    "DeduplicationResult",
    "ExactDeduplicator",
    "InstructionDataset",
    "ProcessedDataset",
    "RemoveDuplicates",
    "StreamingDataset",
    "TextDataset",
    "create_dataloader",
    "create_instruction_dataloader",
    "build_dataset_report",
    "create_dataset_manifest",
    "deduplicate",
    "load_dataset",
    "load_tokenizer_from_checkpoint",
    "load_tokens",
    "prepare_data",
    "read_tokens",
    "split_train_val",
    "validate_records",
]
