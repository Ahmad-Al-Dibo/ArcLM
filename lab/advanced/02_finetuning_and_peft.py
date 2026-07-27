"""Advanced tasks for fine-tuning and PEFT boundaries."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class LabLoRAConfig:
    """Small LoRA configuration for adapter planning.

    Example:
        LabLoRAConfig(
            rank=8,
            alpha=16.0,
            dropout=0.05,
            target_modules=("q_proj", "v_proj"),
        )
    """

    rank: int
    alpha: float
    dropout: float
    target_modules: tuple[str, ...]


def validate_lora_config(config: LabLoRAConfig) -> None:
    """Validate LoRA rank, alpha, dropout, and target module names.

    Example valid input:
        LabLoRAConfig(8, 16.0, 0.05, ("q_proj",))

    Example invalid input:
        LabLoRAConfig(0, -1.0, 1.5, ()) should raise a clear error.
    """
    pass


def find_lora_targets(model: object, target_names: tuple[str, ...]) -> list[str]:
    """Return names of model modules that should receive adapters.

    Example input:
        target_names=("q_proj", "v_proj")
        model modules: ["layers.0.q_proj", "layers.0.mlp"]

    Expected output:
        ["layers.0.q_proj"]
    """
    pass


def freeze_base_model(model: object) -> None:
    """Freeze base model parameters before adapter fine-tuning.

    Example input:
        model with all parameters trainable

    Expected side effect:
        base parameters have requires_grad=False before adapters are enabled.
    """
    pass


class AdapterArtifact:
    """Represent adapter-only saved weights and metadata.

    Example behavior:
        save("adapter/", model, config) writes adapter weights and metadata.
        load("adapter/", fresh_model) attaches the saved adapter.
    """

    def save(self, path: str, model: object, config: LabLoRAConfig) -> None:
        pass

    def load(self, path: str, model: object) -> object:
        pass
