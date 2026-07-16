"""Beginner tasks for a small training loop."""

from __future__ import annotations


def compute_mean_loss(losses: list[float]) -> float:
    """Return the mean of finite loss values.

    The worker should reject empty input, NaN, and infinity.

    Example input:
        [2.0, 1.0, 3.0]

    Expected output:
        2.0
    """
    pass


def train_one_batch(model: object, batch: object, optimizer: object) -> float:
    """Run one training step and return the scalar loss.

    The worker should call forward, backward, optimizer step, and gradient
    clearing in the correct order.

    Example input:
        model returns a loss tensor with value 0.75 for the provided batch

    Expected output:
        0.75

    Expected side effects:
        model gradients are used for one optimizer step and then cleared.
    """
    pass


class TrainingCounter:
    """Track epochs, global steps, and optimizer steps.

    Example behavior:
        counter.record_batch(optimizer_step=True)
        counter.record_batch(optimizer_step=False)
        counter.finish_epoch()

    Expected state:
        epoch == 1
        global_step == 2
        optimizer_step == 1
    """

    def __init__(self) -> None:
        pass

    def record_batch(self, optimizer_step: bool) -> None:
        pass

    def finish_epoch(self) -> None:
        pass
