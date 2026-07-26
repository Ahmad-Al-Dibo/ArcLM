"""Beginner tasks for tiny model utilities."""

from __future__ import annotations


def count_trainable_parameters(model: object) -> int:
    """Count parameters where `requires_grad` is true.

    The worker should support normal PyTorch modules without importing optional
    ArcLM web or distributed dependencies.

    Example input:
        a model with 10 frozen parameters and 6 trainable parameters

    Expected output:
        6
    """
    pass


def choose_device(preferred: str = "auto") -> str:
    """Return `cpu`, `cuda`, or `cuda:<index>` with no silent fallback.

    If CUDA is explicitly requested but unavailable, the worker should raise a
    clear error instead of returning CPU.

    Example input:
        preferred="cpu"

    Expected output:
        "cpu"

    Example error:
        preferred="cuda" on a CPU-only machine should raise a clear error.
    """
    pass


class TinyVocabulary:
    """Map text tokens to integer IDs.

    The worker should support unknown tokens, encode, decode, and vocabulary
    size inspection.

    Example input:
        tokens=["<unk>", "hello", "world"]
        text="hello missing world"

    Expected behavior:
        encode(text) == [1, 0, 2]
        decode([1, 0, 2]) == "hello <unk> world"
        size == 3
    """

    def __init__(self, tokens: list[str], unknown_token: str = "<unk>"):
        pass

    def encode(self, text: str) -> list[int]:
        pass

    def decode(self, token_ids: list[int]) -> str:
        pass

    @property
    def size(self) -> int:
        pass
