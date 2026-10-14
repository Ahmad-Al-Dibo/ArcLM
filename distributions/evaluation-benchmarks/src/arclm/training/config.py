"""Configuratie voor de eenvoudige training core."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

from ..exceptions import TrainingConfigError


@dataclass
class TrainingConfig:
    """Bewaart de belangrijkste instellingen voor een training.

    De class is bewust klein. Hij is bedoeld voor de nieuwe `Trainer`
    API en verandert de brede `arclm.configs.Config` niet.
    """

    epochs: int = 3
    batch_size: int = 8
    learning_rate: float = 2e-5
    weight_decay: float = 0.0
    gradient_accumulation_steps: int = 1
    precision: str = "fp32"
    max_grad_norm: float | None = 1.0
    output_dir: str = "outputs"
    save_every_steps: int = 500
    keep_last_checkpoints: int | None = 3
    log_every_steps: int = 10
    optimizer: str = "adamw"
    scheduler: str = "constant"
    warmup_steps: int = 0
    max_steps: int | None = None
    device: str | None = None
    num_workers: int = 0
    shuffle: bool = True

    def __post_init__(self) -> None:
        """Controleert de waarden direct na het maken."""
        self.validate()

    def validate(self) -> None:
        """Controleert of de training instellingen bruikbaar zijn.

        Raises:
            TrainingConfigError: Als een waarde niet geldig is.
        """
        if self.epochs <= 0:
            raise TrainingConfigError("epochs must be greater than zero")
        if self.batch_size <= 0:
            raise TrainingConfigError("batch_size must be greater than zero")
        if self.learning_rate <= 0:
            raise TrainingConfigError("learning_rate must be greater than zero")
        if self.weight_decay < 0:
            raise TrainingConfigError("weight_decay must not be negative")
        if self.gradient_accumulation_steps <= 0:
            raise TrainingConfigError(
                "gradient_accumulation_steps must be greater than zero"
            )
        if self.precision not in {"fp32", "fp16", "bf16"}:
            raise TrainingConfigError("precision must be one of: fp32, fp16, bf16")
        if self.max_grad_norm is not None and self.max_grad_norm <= 0:
            raise TrainingConfigError("max_grad_norm must be greater than zero")
        if self.save_every_steps < 0:
            raise TrainingConfigError("save_every_steps must not be negative")
        if (
            self.keep_last_checkpoints is not None
            and self.keep_last_checkpoints < 0
        ):
            raise TrainingConfigError("keep_last_checkpoints must not be negative")
        if self.log_every_steps < 0:
            raise TrainingConfigError("log_every_steps must not be negative")
        if self.warmup_steps < 0:
            raise TrainingConfigError("warmup_steps must not be negative")
        if self.max_steps is not None and self.max_steps <= 0:
            raise TrainingConfigError("max_steps must be greater than zero")
        if self.optimizer not in {"adamw", "adam", "sgd"}:
            raise TrainingConfigError("optimizer must be one of: adamw, adam, sgd")
        if self.scheduler not in {"constant", "linear", "cosine"}:
            raise TrainingConfigError("scheduler must be one of: constant, linear, cosine")

    def to_dict(self) -> dict[str, Any]:
        """Zet de config om naar een gewone dict."""
        return asdict(self)

    @classmethod
    def from_dict(cls, values: dict[str, Any]) -> "TrainingConfig":
        """Maakt een config vanuit een dict.

        Onbekende keys geven een duidelijke fout, zodat typefouten niet stil
        worden genegeerd.
        """
        known = set(cls.__dataclass_fields__)
        unknown = set(values) - known
        if unknown:
            raise TrainingConfigError(
                "Unknown training config field(s): " + ", ".join(sorted(unknown))
            )
        return cls(**values)

    @property
    def output_path(self) -> Path:
        """Geeft `output_dir` terug als `Path`."""
        return Path(self.output_dir)
