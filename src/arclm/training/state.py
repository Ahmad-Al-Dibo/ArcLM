"""State object voor trainingen."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any


@dataclass
class TrainingState:
    """Houdt bij waar de training is.

    De state blijft klein zodat checkpoints makkelijk te lezen en te
    herstellen zijn.
    """

    epoch: int = 0
    step: int = 0
    global_step: int = 0
    optimizer_step: int = 0
    best_loss: float | None = None
    last_loss: float | None = None
    last_validation_loss: float | None = None
    learning_rate: float | None = None
    elapsed_seconds: float = 0.0

    def to_dict(self) -> dict[str, Any]:
        """Zet de state om naar een gewone dict."""
        return asdict(self)

    @classmethod
    def from_dict(cls, values: dict[str, Any] | None) -> "TrainingState":
        """Maakt een state vanuit checkpoint-data."""
        if not values:
            return cls()
        known = set(cls.__dataclass_fields__)
        clean = {key: value for key, value in values.items() if key in known}
        for key in ("epoch", "step", "global_step", "optimizer_step"):
            if key in clean:
                try:
                    clean[key] = int(clean[key])
                except (TypeError, ValueError) as error:
                    raise ValueError(f"{key} must be an integer") from error
                if clean[key] < 0:
                    raise ValueError(f"{key} must not be negative")
        return cls(**clean)
