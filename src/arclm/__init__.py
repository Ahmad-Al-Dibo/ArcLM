"""Public ArcLM package interface.

ArcLM is a compact PyTorch toolkit for native causal language-model training,
checkpoint loading, dataset preparation, diagnostics, and Hugging Face SFT.

The root package intentionally loads lazily so ``import arclm`` stays light.
Prefer domain imports for new code, for example ``from arclm.training import
Trainer`` or ``from arclm.tokenizers import AutoTokenizer``.
"""

from __future__ import annotations

from importlib import import_module
from pathlib import Path
from typing import Any

from ._version import __version__

__author__ = "Ahmad Al Dibo"

_EXPORTS = {
    "ArcLM": "arclm.models",
    "AutoModel": "arclm.models",
    "ModelCapabilityReport": "arclm.models",
    "get_model_capability": "arclm.models",
    "model_support_matrix": "arclm.models",
    "Config": "arclm.configs",
    "create_config": "arclm.configs",
    "Tokenizer": "arclm.tokenizers",
    "SentencePieceTokenizer": "arclm.tokenizers",
    "TokenizerFactory": "arclm.tokenizers",
    "AutoTokenizer": "arclm.tokenizers",
    "create_tokenizer": "arclm.tokenizers",
    "get_tokenizer_from_config": "arclm.tokenizers",
    "TextDataset": "arclm.datasets",
    "BaseDataset": "arclm.datasets",
    "BaseStreamingDataset": "arclm.datasets",
    "BaseDataStep": "arclm.datasets",
    "BaseCleaner": "arclm.datasets",
    "BaseDeduplicator": "arclm.datasets",
    "BaseAugmenter": "arclm.datasets",
    "BaseSyntheticDataGenerator": "arclm.datasets",
    "DatasetLoader": "arclm.datasets",
    "DatasetManifest": "arclm.datasets",
    "DatasetReport": "arclm.datasets",
    "DatasetValidationIssue": "arclm.datasets",
    "DatasetValidationResult": "arclm.datasets",
    "DatasetConfig": "arclm.datasets",
    "DataPipeline": "arclm.datasets",
    "StreamingDataset": "arclm.datasets",
    "ExactDeduplicator": "arclm.datasets",
    "DeduplicationResult": "arclm.datasets",
    "RemoveDuplicates": "arclm.datasets",
    "load_dataset": "arclm.datasets",
    "build_dataset_report": "arclm.datasets",
    "create_dataset_manifest": "arclm.datasets",
    "deduplicate": "arclm.datasets",
    "create_dataloader": "arclm.datasets",
    "DataBundle": "arclm.datasets",
    "DataProcessor": "arclm.datasets",
    "ProcessedDataset": "arclm.datasets",
    "InstructionDataset": "arclm.datasets",
    "create_instruction_dataloader": "arclm.datasets",
    "load_tokens": "arclm.datasets",
    "prepare_data": "arclm.datasets",
    "read_tokens": "arclm.datasets",
    "split_train_val": "arclm.datasets",
    "validate_records": "arclm.datasets",
    "PipelineTrace": "arclm.inspection",
    "inspect_text": "arclm.inspection",
    "Trainer": "arclm.training",
    "TrainingConfig": "arclm.training",
    "BaseTrainer": "arclm.training",
    "BaseCallback": "arclm.training",
    "TrainingState": "arclm.training",
    "TrainingResult": "arclm.training",
    "build_model": "arclm.training",
    "build_trainer": "arclm.training",
    "train_model": "arclm.training",
    "BaseModelAdapter": "arclm.training",
    "BaseModelLoader": "arclm.training",
    "BaseTrainingPipeline": "arclm.training",
    "ModelAdapter": "arclm.training",
    "PreTrainedModelLoader": "arclm.training",
    "StoppingCriteria": "arclm.training",
    "UnifiedPipeline": "arclm.training",
    "checkpoint_is_compatible_for_continue_training": "arclm.training",
    "checkpoint_is_compatible_for_tuning": "arclm.training",
    "create_checkpoint_callback": "arclm.training",
    "create_epoch_checkpoint_callback": "arclm.training",
    "load_compatible_checkpoint": "arclm.training",
    "save_training_checkpoint": "arclm.training",
    "tokenizer_from_checkpoint": "arclm.training",
    "SFTTrainingResult": "arclm.finetuning",
    "BaseFineTuner": "arclm.finetuning",
    "FullFineTuner": "arclm.finetuning",
    "SFTConfig": "arclm.finetuning",
    "SFTRecordContract": "arclm.finetuning",
    "SFTTrainer": "arclm.finetuning",
    "SFTDataCollator": "arclm.finetuning",
    "TokenizerAdapter": "arclm.finetuning",
    "train_sft": "arclm.finetuning",
    "get_sft_record_contract": "arclm.finetuning",
    "validate_sft_records": "arclm.finetuning",
    "Generator": "arclm.inference",
    "TextGenerator": "arclm.inference",
    "DEFAULT_MODEL_PATH": "arclm.inference",
    "LoadedModel": "arclm.inference",
    "load_model": "arclm.inference",
    "predict": "arclm.inference",
    "ExternalModelConfig": "arclm.inference",
    "ExternalLoadedModel": "arclm.inference",
    "GenerationConfig": "arclm.inference",
    "ModelSaveConfig": "arclm.inference",
    "ModelSourceInfo": "arclm.inference",
    "inspect_model_source": "arclm.inference",
    "load_any_model": "arclm.inference",
    "load_external_for_inference": "arclm.inference",
    "predict_external": "arclm.inference",
    "fine_tune_external_model": "arclm.inference",
    "train_native_model": "arclm.inference",
    "fine_tune_native_model": "arclm.inference",
    "continue_native_training": "arclm.inference",
    "save_loaded_model": "arclm.inference",
    "LoadedCheckpoint": "arclm.checkpoints",
    "LoadPlan": "arclm.checkpoints",
    "AdaptedModelBundle": "arclm.checkpoints",
    "ModelInspector": "arclm.checkpoints",
    "SmartLoader": "arclm.checkpoints",
    "register_model_inspector": "arclm.checkpoints",
    "load_external_model": "arclm.checkpoints",
    "adapt_for_training": "arclm.checkpoints",
    "validate_tokenizer_compatibility": "arclm.checkpoints",
    "build_training_diagnostics_report": "arclm.evaluation",
    "build_evaluation_report": "arclm.evaluation",
    "calculate_metrics": "arclm.evaluation",
    "calculate_perplexity": "arclm.evaluation",
    "Accuracy": "arclm.evaluation",
    "BaseEvaluationCallback": "arclm.evaluation",
    "BaseEvaluator": "arclm.evaluation",
    "BaseMetric": "arclm.evaluation",
    "EvaluationConfig": "arclm.evaluation",
    "EvaluationReport": "arclm.evaluation",
    "EvaluationResult": "arclm.evaluation",
    "Evaluator": "arclm.evaluation",
    "LossMetric": "arclm.evaluation",
    "Perplexity": "arclm.evaluation",
    "evaluate": "arclm.evaluation",
    "export_metrics_to_json": "arclm.evaluation",
    "export_metrics_to_markdown": "arclm.evaluation",
    "ConceptBenchmarkCase": "arclm.evaluation",
    "ConceptBenchmarkResult": "arclm.evaluation",
    "DEFAULT_CONCEPT_BENCHMARKS": "arclm.evaluation",
    "LongContextResult": "arclm.evaluation",
    "MetricsReport": "arclm.evaluation",
    "TopKPrediction": "arclm.evaluation",
    "format_concept_benchmark_report": "arclm.evaluation",
    "format_long_context_results": "arclm.evaluation",
    "format_tokenizer_coverage_report": "arclm.evaluation",
    "format_top_k_predictions": "arclm.evaluation",
    "predict_top_k": "arclm.evaluation",
    "run_long_context_evaluation": "arclm.evaluation",
    "score_concept_relationships": "arclm.evaluation",
    "format_duration": "arclm.utils",
    "L1Regularization": "arclm.training",
    "L2Regularization": "arclm.training",
    "EarlyStopping": "arclm.training",
    "LearningRateScheduler": "arclm.training",
    "GeneralizationMonitor": "arclm.training",
    "MixupAugmentation": "arclm.training",
    "LabelSmoothing": "arclm.training",
    "Sentence": "arclm.logics",
    "Symbol": "arclm.logics",
    "Not": "arclm.logics",
    "And": "arclm.logics",
    "Or": "arclm.logics",
    "Implication": "arclm.logics",
    "Biconditional": "arclm.logics",
    "EntailmentResult": "arclm.logics",
    "KnowledgeBase": "arclm.logics",
    "create_symbols": "arclm.logics",
    "model_check": "arclm.logics",
}

__all__ = sorted(
    [
        "__version__",
        "get_version",
        "get_device",
        "list_available_models",
        "load_training_checkpoint",
        "report_environment",
        *_EXPORTS,
    ]
)


def __getattr__(name: str) -> Any:
    """Laadt een attribuut dynamisch wanneer het wordt opgevraagd."""
    if name in _EXPORTS:
        module = import_module(_EXPORTS[name])
        value = getattr(module, name)
        globals()[name] = value
        return value
    raise AttributeError(f"module 'arclm' has no attribute {name!r}")


def get_version() -> str:
    """Return the installed ArcLM version."""
    return __version__


def get_device():
    """Return the preferred local torch device."""
    import torch

    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


def list_available_models(models_dir: str | Path = "models") -> list[str]:
    """List local ``.pth`` checkpoints in a models directory."""
    path = Path(models_dir)
    if not path.exists():
        return []
    return sorted(item.stem for item in path.glob("*.pth") if item.is_file())


def load_training_checkpoint(path: str | Path, device_type: str = "cpu"):
    """Load a trusted ArcLM/PyTorch training checkpoint."""
    import torch
    from .checkpoints.training import safe_load_training_checkpoint

    return safe_load_training_checkpoint(
        path,
        map_location=torch.device(device_type),
    )


def report_environment(models_dir: str | Path = "models") -> str:
    """Return a short human-readable runtime report."""
    device = get_device()
    device_note = "CUDA available" if device.type == "cuda" else "CUDA not available"
    models = list_available_models(models_dir)
    return (
        f"ArcLM {__version__} | device={device.type} ({device_note}) | "
        f"local_checkpoints={models}"
    )

