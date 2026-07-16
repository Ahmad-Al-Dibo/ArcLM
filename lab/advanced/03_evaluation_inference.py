"""Advanced tasks for evaluation and inference."""

from __future__ import annotations


def evaluate_loss(model: object, dataloader: object) -> float:
    """Evaluate mean loss with gradients disabled and model mode restored.

    Example input:
        dataloader yields losses [0.5, 1.5]

    Expected output:
        1.0

    Expected side effect:
        model training/eval mode is restored to its original value.
    """
    pass


def compute_accuracy(predictions: list[int], labels: list[int], ignore_index: int = -100) -> float:
    """Compute accuracy while ignoring labels equal to `ignore_index`.

    Example input:
        predictions=[1, 2, 3]
        labels=[1, -100, 0]

    Expected output:
        0.5
    """
    pass


def generate_text(model: object, tokenizer: object, prompt: str, max_new_tokens: int) -> str:
    """Run deterministic local text generation without network access.

    Example input:
        prompt="Hello"
        max_new_tokens=3

    Expected output shape:
        A string beginning with the prompt, such as "Hello world today".
    """
    pass


class InferenceBatcher:
    """Batch prompts for inference while preserving output order.

    Example input:
        prompts=["a", "b", "c"]
        batch_size=2

    Expected output:
        Three generated strings in the same order as the prompts.
    """

    def __init__(self, batch_size: int):
        pass

    def run(self, prompts: list[str], generate_fn: object) -> list[str]:
        pass
