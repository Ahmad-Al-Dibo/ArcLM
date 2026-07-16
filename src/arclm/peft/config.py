"""Configuratie voor parameter-efficient fine-tuning."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any, Mapping

from ..exceptions import FineTuningError


class PeftMethod(str, Enum):
    """Bekende PEFT-methodes."""

    NONE = "none"
    LORA = "lora"


@dataclass(frozen=True)
class PeftConfig:
    """Kleine basisconfig voor PEFT."""

    method: PeftMethod = PeftMethod.NONE
    enabled: bool = True
    config_version: int = 1

    def validate(self) -> None:
        """Controleert de gedeelde PEFT-velden."""
        if not isinstance(self.method, PeftMethod):
            raise FineTuningError("PEFT method is not supported")
        if self.config_version <= 0:
            raise FineTuningError("PEFT config version must be positive")

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke configdata terug."""
        self.validate()
        data = asdict(self)
        data["method"] = self.method.value
        return data


@dataclass(frozen=True)
class LoRAConfig(PeftConfig):
    """Configuratie voor ArcLM LoRA adapters."""

    method: PeftMethod = PeftMethod.LORA
    rank: int = 4
    alpha: float = 8.0
    dropout: float = 0.0
    target_modules: tuple[str, ...] = field(default_factory=lambda: ("query", "value"))
    target_match: str = "suffix"
    bias: str = "none"
    init: str = "kaiming_uniform"
    freeze_base_model: bool = True

    def validate(self) -> None:
        """Controleert LoRA-waarden voordat we het model muteren."""
        super().validate()
        if self.method != PeftMethod.LORA:
            raise FineTuningError("LoRAConfig method must be lora")
        if self.rank <= 0:
            raise FineTuningError("LoRA rank must be greater than zero")
        if self.alpha <= 0:
            raise FineTuningError("LoRA alpha must be greater than zero")
        if not 0.0 <= self.dropout < 1.0:
            raise FineTuningError("LoRA dropout must be between 0 and 1")
        if not self.target_modules:
            raise FineTuningError("LoRA target_modules must not be empty")
        if self.target_match not in {"suffix", "leaf", "full"}:
            raise FineTuningError("LoRA target_match must be one of: suffix, leaf, full")
        if self.bias != "none":
            raise FineTuningError("LoRA bias policy must be none")
        if self.init not in {"kaiming_uniform", "zeros"}:
            raise FineTuningError("LoRA init must be one of: kaiming_uniform, zeros")

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "LoRAConfig":
        """Leest een LoRAConfig uit veilige manifestdata."""
        data = dict(values)
        method = data.get("method", PeftMethod.LORA)
        if not isinstance(method, PeftMethod):
            method = PeftMethod(str(method))
        targets = data.get("target_modules", ("query", "value"))
        if isinstance(targets, list):
            targets = tuple(str(item) for item in targets)
        data["method"] = method
        data["target_modules"] = targets
        config = cls(**data)
        config.validate()
        return config
