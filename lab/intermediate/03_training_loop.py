"""Intermediate tasks for training-loop behavior."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class LabTrainingState:
    """Mutable training state for a small trainer.

    Example:
        LabTrainingState(epoch=1, global_step=10, optimizer_step=5, best_loss=0.8)
    """

    epoch: int = 0
    global_step: int = 0
    optimizer_step: int = 0
    best_loss: float | None = None


def apply_gradient_accumulation(
    batch_index: int,
    accumulation_steps: int,
) -> bool:
    """Return true when the optimizer should step for this batch.

    Example input:
        batch_index=3
        accumulation_steps=2

    Expected output:
        True

    Reason:
        With zero-based batch indexes, batches 1, 3, 5, ... trigger a step.
    """
    pass


def clip_gradients(model: object, max_norm: float) -> float:
    """Clip model gradients and return the gradient norm before clipping.

    Example input:
        max_norm=1.0 and current gradient norm is 5.0

    Expected output:
        5.0

    Expected side effect:
        gradients are clipped to norm 1.0 or lower.
    """
    pass


class LabTrainer:
    """A small trainer that is model-agnostic.

    The worker should support finite loss checks, gradient accumulation,
    optional clipping, state updates, and deterministic callbacks.

    Example input:
        dataloader with 4 batches and accumulation_steps=2

    Expected output:
        LabTrainingState(global_step=4, optimizer_step=2, ...)
    """

    def __init__(self, model: object, optimizer: object):
        pass

    def train_epoch(self, dataloader: object) -> LabTrainingState:
        pass
