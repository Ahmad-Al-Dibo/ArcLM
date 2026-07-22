"""Deprecated compatibility shim for the former ``arclm.pipeline_v2`` module."""

import warnings

warnings.warn(
    "arclm.pipeline_v2 is deprecated and will be removed in a future release. "
    "Use 'from arclm.training import UnifiedPipeline' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .training import ModelAdapter, PreTrainedModelLoader, StoppingCriteria, UnifiedPipeline
from .training import build_model, build_optimizer_with_discriminative_lr, build_trainer

__all__ = [
    "ModelAdapter",
    "PreTrainedModelLoader",
    "StoppingCriteria",
    "UnifiedPipeline",
    "build_model",
    "build_optimizer_with_discriminative_lr",
    "build_trainer",
]
