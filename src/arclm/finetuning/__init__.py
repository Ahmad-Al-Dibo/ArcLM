"""Fine-tuning public API."""

from .adapters import ModelAdapter, TokenizerAdapter
from .base import BaseFineTuner, BaseModelAdapter, BaseTokenizerAdapter
from .collator import SFTDataCollator
from .config import FineTuningConfig, FineTuningMode, SFTConfig
from .formatting import (
    format_chat_example,
    format_example,
    format_instruction_example,
    format_prompt_response_example,
    format_text_example,
)
from .full import FullFineTuner, SFTTrainer
from .labels import create_labels, mask_labels
from .packing import pack_sequences
from .sft import SFTTrainingResult, train_sft
from .workflow import (
    FineTuningDatasetReport,
    PreparedFineTuningRecord,
    FineTuningResult,
    PreparedFineTuningDataset,
    SFTRecordContract,
    fine_tuning_format_fingerprint,
    fine_tune,
    get_sft_record_contract,
    normalize_fine_tuning_example,
    prepare_fine_tuning_dataset,
    prepare_fine_tuning_record,
    validate_sft_records,
)

__all__ = [
    "BaseFineTuner",
    "BaseModelAdapter",
    "BaseTokenizerAdapter",
    "FullFineTuner",
    "FineTuningConfig",
    "FineTuningDatasetReport",
    "FineTuningMode",
    "FineTuningResult",
    "ModelAdapter",
    "PreparedFineTuningDataset",
    "PreparedFineTuningRecord",
    "SFTConfig",
    "SFTDataCollator",
    "SFTRecordContract",
    "SFTTrainer",
    "SFTTrainingResult",
    "TokenizerAdapter",
    "create_labels",
    "format_chat_example",
    "format_example",
    "format_instruction_example",
    "format_prompt_response_example",
    "format_text_example",
    "mask_labels",
    "fine_tune",
    "fine_tuning_format_fingerprint",
    "get_sft_record_contract",
    "normalize_fine_tuning_example",
    "pack_sequences",
    "prepare_fine_tuning_dataset",
    "prepare_fine_tuning_record",
    "train_sft",
    "validate_sft_records",
]
