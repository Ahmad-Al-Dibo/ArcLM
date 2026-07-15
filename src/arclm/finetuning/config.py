"""Configuratie voor full fine-tuning en SFT."""

from __future__ import annotations

from dataclasses import dataclass

from ..exceptions import SFTConfigError
from ..training import TrainingConfig


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
