"""Fine-tuning public API.

Loads heavy torch-backed modules only when accessed so config-only imports
stay light.
"""

from __future__ import annotations

from importlib import import_module
from typing import Any

_EXPORTS = {
    "BaseFineTuner": "arclm.finetuning.base",
    "BaseModelAdapter": "arclm.finetuning.base",
    "BaseTokenizerAdapter": "arclm.finetuning.base",
    "FineTuningConfig": "arclm.finetuning.config",
    "FineTuningMode": "arclm.finetuning.config",
    "SFTConfig": "arclm.finetuning.config",
    "FineTuningDatasetReport": "arclm.finetuning.workflow",
    "PreparedFineTuningRecord": "arclm.finetuning.workflow",
    "FineTuningResult": "arclm.finetuning.workflow",
    "PreparedFineTuningDataset": "arclm.finetuning.workflow",
    "SFTRecordContract": "arclm.finetuning.workflow",
    "fine_tuning_format_fingerprint": "arclm.finetuning.workflow",
    "fine_tune": "arclm.finetuning.workflow",
    "get_sft_record_contract": "arclm.finetuning.workflow",
    "normalize_fine_tuning_example": "arclm.finetuning.workflow",
    "prepare_fine_tuning_dataset": "arclm.finetuning.workflow",
    "prepare_fine_tuning_record": "arclm.finetuning.workflow",
    "validate_sft_records": "arclm.finetuning.workflow",
    "ModelAdapter": "arclm.finetuning.adapters",
    "TokenizerAdapter": "arclm.finetuning.adapters",
    "SFTDataCollator": "arclm.finetuning.collator",
    "FullFineTuner": "arclm.finetuning.full",
    "SFTTrainer": "arclm.finetuning.full",
    "create_labels": "arclm.finetuning.labels",
    "mask_labels": "arclm.finetuning.labels",
    "format_chat_example": "arclm.finetuning.formatting",
    "format_example": "arclm.finetuning.formatting",
    "format_instruction_example": "arclm.finetuning.formatting",
    "format_prompt_response_example": "arclm.finetuning.formatting",
    "format_text_example": "arclm.finetuning.formatting",
    "pack_sequences": "arclm.finetuning.packing",
    "SFTTrainingResult": "arclm.finetuning.sft",
    "train_sft": "arclm.finetuning.sft",
}

__all__ = sorted(_EXPORTS)


def __getattr__(name: str) -> Any:
    """Load a fine-tuning attribute only when it is requested."""
    if name in _EXPORTS:
        module = import_module(_EXPORTS[name])
        value = getattr(module, name)
        globals()[name] = value
        return value
    raise AttributeError(f"module 'arclm.finetuning' has no attribute {name!r}")
