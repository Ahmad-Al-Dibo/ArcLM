"""Intermediate tasks for model lifecycle contracts."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class LabModelConfig:
    """Small JSON-safe model configuration.

    Example:
        LabModelConfig(
            architecture="tiny-gpt",
            vocab_size=100,
            hidden_size=32,
            num_layers=2,
        )
    """

    architecture: str
    vocab_size: int
    hidden_size: int
    num_layers: int


def validate_model_config(config: LabModelConfig) -> None:
    """Validate positive sizes and a known architecture name.

    Example valid input:
        LabModelConfig("tiny-gpt", 100, 32, 2)

    Example invalid input:
        LabModelConfig("unknown", 0, -1, 0) should raise a clear error.
    """
    pass


def save_model_config(config: LabModelConfig, path: str) -> None:
    """Save model configuration as deterministic JSON.

    Example input:
        config=LabModelConfig("tiny-gpt", 100, 32, 2)
        path="model-config.json"

    Expected file content shape:
        {"architecture": "tiny-gpt", "vocab_size": 100, ...}
    """
    pass


def load_model_config(path: str) -> LabModelConfig:
    """Load and validate model configuration from JSON.

    Example file content:
        {"architecture": "tiny-gpt", "vocab_size": 100, "hidden_size": 32, "num_layers": 2}

    Expected output:
        LabModelConfig("tiny-gpt", 100, 32, 2)
    """
    pass


class ModelFactory:
    """Create runtime models from approved configuration objects.

    Example input:
        LabModelConfig("tiny-gpt", 100, 32, 2)

    Expected output:
        A model object whose vocabulary size is 100 and hidden size is 32.
    """

    def create(self, config: LabModelConfig) -> object:
        """Return a model instance for the given config."""
        pass
