"""Deprecated compatibility shim for ``arclm.external_inference``."""

import warnings

warnings.warn(
    "arclm.external_inference is deprecated and will be removed in a future release. "
    "Use 'from arclm.inference import load_any_model' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .inference import (
    ExternalLoadedModel,
    ExternalModelConfig,
    GenerationConfig,
    ModelSaveConfig,
    ModelSourceInfo,
    continue_native_training,
    fine_tune_external_model,
    fine_tune_native_model,
    inspect_model_source,
    load_any_model,
    load_external_for_inference,
    predict_external,
    save_loaded_model,
    train_native_model,
)

__all__ = [
    "ExternalLoadedModel",
    "ExternalModelConfig",
    "GenerationConfig",
    "ModelSaveConfig",
    "ModelSourceInfo",
    "continue_native_training",
    "fine_tune_external_model",
    "fine_tune_native_model",
    "inspect_model_source",
    "load_any_model",
    "load_external_for_inference",
    "predict_external",
    "save_loaded_model",
    "train_native_model",
]
