"""Configuratie voor full fine-tuning en SFT."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from enum import Enum
from typing import Any

from ..exceptions import SFTConfigError
from ..training import TrainingConfig


class FineTuningMode(str, Enum):
    """Beschrijft welke fine-tuning taak uitgevoerd wordt."""

    CAUSAL_LM = "causal_lm"
    SFT = "supervised_fine_tuning"


@dataclass
class FineTuningConfig:
    """Configuratie voor data, formatting en labels bij fine-tuning.

    Training zelf blijft in `TrainingConfig`. Deze config bevat alleen de
    keuzes die bepalen hoe voorbeelden naar tokens en labels worden omgezet.
    """

    mode: FineTuningMode | str = FineTuningMode.SFT
    formatter: str = "auto"
    max_sequence_length: int = 1024
    train_on_prompt: bool = False
    append_eos_token: bool = True
    truncation: bool = True
    padding: str = "longest"
    packing: bool = False
    ignore_index: int = -100
    text_field: str = "text"
    prompt_field: str = "prompt"
    completion_field: str = "completion"
    instruction_field: str = "instruction"
    input_field: str = "input"
    response_field: str = "response"
    messages_field: str = "messages"
    skip_invalid_records: bool = False
    max_report_errors: int = 10
    config_version: int = 1

    def __post_init__(self) -> None:
        """Normaliseert en controleert de waarden."""
        self.mode = self._normalize_mode(self.mode)
        self.validate()

    @staticmethod
    def _normalize_mode(value: FineTuningMode | str) -> FineTuningMode:
        """Zet strings om naar de publieke mode enum."""
        if isinstance(value, FineTuningMode):
            return value
        try:
            return FineTuningMode(str(value))
        except ValueError as error:
            allowed = ", ".join(item.value for item in FineTuningMode)
            raise SFTConfigError(f"mode must be one of: {allowed}") from error

    def validate(self) -> None:
        """Controleert of de fine-tuning instellingen bruikbaar zijn."""
        if self.max_sequence_length <= 0:
            raise SFTConfigError("max_sequence_length must be greater than zero")
        if self.padding not in {"longest", "max_length", "none"}:
            raise SFTConfigError("padding must be one of: longest, max_length, none")
        if not isinstance(self.ignore_index, int):
            raise SFTConfigError("ignore_index must be an integer")
        if self.formatter not in {
            "auto",
            "plain_text",
            "text",
            "prompt_completion",
            "instruction_response",
            "chat",
        }:
            raise SFTConfigError("formatter is not supported")
        if self.packing:
            raise SFTConfigError(
                "packing is not enabled for the stable FineTuningConfig workflow yet"
            )
        if self.max_report_errors < 0:
            raise SFTConfigError("max_report_errors must not be negative")
        if self.config_version != 1:
            raise SFTConfigError("config_version must be 1")

    def to_dict(self) -> dict[str, Any]:
        """Zet de config om naar JSON-vriendelijke data."""
        values = asdict(self)
        values["mode"] = self.mode.value
        return values

    @classmethod
    def from_dict(cls, values: dict[str, Any]) -> "FineTuningConfig":
        """Maakt een config vanuit een dict met strikte veldcontrole."""
        known = set(cls.__dataclass_fields__)
        unknown = set(values) - known
        if unknown:
            raise SFTConfigError(
                "Unknown fine-tuning config field(s): " + ", ".join(sorted(unknown))
            )
        return cls(**values)

    def to_sft_config(self, training_config: TrainingConfig | None = None) -> "SFTConfig":
        """Maakt een `SFTConfig` voor de bestaande trainer-integratie."""
        base = training_config.to_dict() if training_config is not None else {}
        if self.formatter in {"plain_text", "text"}:
            schema_fields = {"text_field": self.text_field}
        elif self.formatter == "prompt_completion":
            schema_fields = {
                "text_field": None,
                "prompt_field": self.prompt_field,
                "response_field": self.completion_field,
            }
        elif self.formatter == "instruction_response":
            schema_fields = {
                "text_field": None,
                "instruction_field": self.instruction_field,
                "input_field": self.input_field,
                "response_field": self.response_field,
            }
        elif self.formatter == "chat":
            schema_fields = {"text_field": None, "messages_field": self.messages_field}
        else:
            schema_fields = {"text_field": self.text_field}
        return SFTConfig(
            **base,
            **schema_fields,
            max_length=self.max_sequence_length,
            padding=self.padding,
            truncation=self.truncation,
            packing=self.packing,
            assistant_only_loss=(
                self.mode == FineTuningMode.SFT and not self.train_on_prompt
            ),
            add_eos_token=self.append_eos_token,
            ignore_index=self.ignore_index,
        )


@dataclass
class SFTConfig(TrainingConfig):
    """Bewaart instellingen voor supervised fine-tuning.

    De trainingvelden komen uit `TrainingConfig`. De extra velden bepalen hoe
    voorbeelden worden geformatteerd, getokenized en gemaskeerd.
    """

    text_field: str | None = "text"
    instruction_field: str | None = None
    input_field: str | None = None
    response_field: str | None = None
    prompt_field: str | None = None
    messages_field: str | None = None
    max_length: int = 1024
    padding: str = "longest"
    truncation: bool = True
    packing: bool = False
    assistant_only_loss: bool = False
    add_eos_token: bool = True
    ignore_index: int = -100
    label_shift: bool = True
    chat_template: str | None = None

    def validate(self) -> None:
        """Controleert of de SFT instellingen bruikbaar zijn."""
        super().validate()
        if self.max_length <= 0:
            raise SFTConfigError("max_length must be greater than zero")
        if self.padding not in {"longest", "max_length", "none"}:
            raise SFTConfigError("padding must be one of: longest, max_length, none")
        if not isinstance(self.ignore_index, int):
            raise SFTConfigError("ignore_index must be an integer")
        if self.packing and self.padding == "none":
            raise SFTConfigError("packing requires padding='longest' or padding='max_length'")

        formats = []
        if self.messages_field:
            formats.append("chat")
        if self.instruction_field or (self.input_field and self.response_field):
            formats.append("instruction")
        if self.prompt_field or (
            self.response_field and not self.instruction_field and not self.input_field
        ):
            formats.append("prompt_response")
        if self.text_field and not formats:
            formats.append("text")
        if len(set(formats)) > 1:
            raise SFTConfigError("Only one dataset format can be selected")
        if not formats:
            raise SFTConfigError("No dataset format is configured")
        if self.assistant_only_loss and formats[0] == "text":
            raise SFTConfigError(
                "assistant_only_loss requires instruction, prompt-response, or chat data"
            )

    @property
    def dataset_format(self) -> str:
        """Geeft het gekozen datasetformaat terug."""
        if self.messages_field:
            return "chat"
        if self.instruction_field or (self.input_field and self.response_field):
            return "instruction"
        if self.prompt_field or (
            self.response_field and not self.instruction_field and not self.input_field
        ):
            return "prompt_response"
        return "text"
