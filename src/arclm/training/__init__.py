"""Publieke training API.

De module laadt zware onderdelen pas als ze echt nodig zijn. Daardoor blijft
`import arclm.training` licht en start het geen onnodige modelcode.
"""

from __future__ import annotations

from importlib import import_module
from typing import Any

_EXPORTS = {
    "BaseCallback": "arclm.training.callbacks",
    "BaseModelAdapter": "arclm.training.base",
    "BaseModelLoader": "arclm.training.base",
    "BaseTrainer": "arclm.training.base",
    "BaseTrainingPipeline": "arclm.training.base",
    "EarlyStopping": "arclm.training.regularization",
    "GeneralizationMonitor": "arclm.training.regularization",
    "L1Regularization": "arclm.training.regularization",
    "L2Regularization": "arclm.training.regularization",
    "LabelSmoothing": "arclm.training.regularization",
    "LearningRateScheduler": "arclm.training.regularization",
    "MixupAugmentation": "arclm.training.regularization",
    "ModelAdapter": "arclm.training.unified",
    "PreTrainedModelLoader": "arclm.training.unified",
    "StoppingCriteria": "arclm.training.unified",
    "Trainer": "arclm.training.trainer",
    "TrainingConfig": "arclm.training.config",
    "TrainingResult": "arclm.training.pipeline",
    "TrainingState": "arclm.training.state",
    "UnifiedPipeline": "arclm.training.unified",
    "build_model": "arclm.training.pipeline",
    "build_optimizer_with_discriminative_lr": "arclm.training.pipeline",
    "build_trainer": "arclm.training.pipeline",
    "checkpoint_is_compatible_for_continue_training": "arclm.training.pipeline",
    "checkpoint_is_compatible_for_tuning": "arclm.training.pipeline",
    "create_checkpoint_callback": "arclm.training.pipeline",
    "create_epoch_checkpoint_callback": "arclm.training.pipeline",
    "load_compatible_checkpoint": "arclm.training.pipeline",
    "save_training_checkpoint": "arclm.training.pipeline",
    "tokenizer_from_checkpoint": "arclm.training.pipeline",
    "train_model": "arclm.training.pipeline",
}

__all__ = sorted(_EXPORTS)


def __getattr__(name: str) -> Any:
    """Laadt een training attribuut pas wanneer het nodig is."""
    if name in _EXPORTS:
        module = import_module(_EXPORTS[name])
        value = getattr(module, name)
        globals()[name] = value
        return value
    raise AttributeError(f"module 'arclm.training' has no attribute {name!r}")
