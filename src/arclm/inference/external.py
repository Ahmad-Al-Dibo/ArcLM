"""Public facade for external ArcLM inference integrations.

New code should treat this module as the stable import path for external model
inspection, loading, generation, and export. The implementation lives in
``arclm.inference._external_loading`` so this file stays easy to scan and old
imports such as ``from arclm.inference.external import load_any_model`` continue
to work.
"""

from __future__ import annotations

from ._external_loading import (
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
    "ExternalModelConfig",
    "ExternalLoadedModel",
    "GenerationConfig",
    "ModelSaveConfig",
    "ModelSourceInfo",
    "inspect_model_source",
    "load_any_model",
    "load_external_for_inference",
    "predict_external",
    "fine_tune_external_model",
    "train_native_model",
    "fine_tune_native_model",
    "continue_native_training",
    "save_loaded_model",
]
