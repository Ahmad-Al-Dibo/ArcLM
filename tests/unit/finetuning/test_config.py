import pytest

from arclm.exceptions import SFTConfigError
from arclm.finetuning import SFTConfig


def test_sft_config_defaults_to_text_format():
    config = SFTConfig(max_length=16)

    assert config.dataset_format == "text"
    assert config.batch_size == 8


def test_sft_config_supports_instruction_format():
    config = SFTConfig(
        instruction_field="instruction",
        input_field="input",
        response_field="output",
        max_length=16,
        assistant_only_loss=True,
    )

    assert config.dataset_format == "instruction"


def test_sft_config_rejects_invalid_values():
    with pytest.raises(SFTConfigError, match="max_length"):
        SFTConfig(max_length=0)
    with pytest.raises(SFTConfigError, match="assistant_only_loss"):
        SFTConfig(assistant_only_loss=True)
    with pytest.raises(SFTConfigError, match="Only one"):
        SFTConfig(text_field="text", messages_field="messages", prompt_field="prompt")
