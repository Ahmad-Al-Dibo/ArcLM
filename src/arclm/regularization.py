"""Deprecated compatibility shim for ``arclm.regularization``."""

import warnings

warnings.warn(
    "arclm.regularization is deprecated and will be removed in a future release. "
    "Use 'from arclm.training import EarlyStopping' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .training.regularization import (
    Dropout,
    EarlyStopping,
    GeneralizationMonitor,
    L1Regularization,
    L2Regularization,
    LabelSmoothing,
    LearningRateScheduler,
    MixupAugmentation,
)

__all__ = [
    "Dropout",
    "EarlyStopping",
    "GeneralizationMonitor",
    "L1Regularization",
    "L2Regularization",
    "LabelSmoothing",
    "LearningRateScheduler",
    "MixupAugmentation",
]
