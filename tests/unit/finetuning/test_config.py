import pytest

from arclm.exceptions import SFTConfigError
from arclm.finetuning import FineTuningConfig, FineTuningMode, SFTConfig


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


def test_fine_tuning_config_modes_and_round_trip():
    config = FineTuningConfig(
        mode="supervised_fine_tuning",
        formatter="instruction_response",
        max_sequence_length=24,
        train_on_prompt=False,
    )
    loaded = FineTuningConfig.from_dict(config.to_dict())

    assert config.mode is FineTuningMode.SFT
    assert loaded.mode is FineTuningMode.SFT
    assert loaded.to_dict()["mode"] == "supervised_fine_tuning"
    assert loaded.to_sft_config().assistant_only_loss is True
    assert loaded.to_sft_config().dataset_format == "instruction"


def test_fine_tuning_config_rejects_invalid_and_unknown_values():
    with pytest.raises(SFTConfigError, match="mode"):
        FineTuningConfig(mode="classification")
    with pytest.raises(SFTConfigError, match="max_sequence_length"):
        FineTuningConfig(max_sequence_length=0)
    with pytest.raises(SFTConfigError, match="packing"):
        FineTuningConfig(packing=True)
    with pytest.raises(SFTConfigError, match="Unknown fine-tuning"):
        FineTuningConfig.from_dict({"mode": "causal_lm", "callback": "bad"})
