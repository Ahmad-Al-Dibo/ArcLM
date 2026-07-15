"""Deprecated compatibility shim for ``arclm.pipeline``."""

import warnings

warnings.warn(
    "arclm.pipeline is deprecated and will be removed in a future release. "
    "Use 'from arclm.training import train_model' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .training import (
    TrainingResult,
    build_model,
    build_optimizer_with_discriminative_lr,
    build_trainer,
    checkpoint_is_compatible_for_continue_training,
    checkpoint_is_compatible_for_tuining,
    create_checkpoint_callback,
    create_epoch_checkpoint_callback,
    load_compatible_checkpoint,
    save_training_checkpoint,
    tokenizer_from_checkpoint,
    train_model,
)

__all__ = [
    "TrainingResult",
    "build_model",
    "build_optimizer_with_discriminative_lr",
    "build_trainer",
    "checkpoint_is_compatible_for_continue_training",
    "checkpoint_is_compatible_for_tuining",
    "create_checkpoint_callback",
    "create_epoch_checkpoint_callback",
    "load_compatible_checkpoint",
    "save_training_checkpoint",
    "tokenizer_from_checkpoint",
    "train_model",
]
