import pytest

from arclm.exceptions import TrainingConfigError
from arclm.training import TrainingConfig


def test_training_config_defaults_are_visible():
    config = TrainingConfig()

    assert config.epochs == 3
    assert config.batch_size == 8
    assert config.precision == "fp32"


def test_training_config_validates_values():
    with pytest.raises(TrainingConfigError, match="epochs"):
        TrainingConfig(epochs=0)

    with pytest.raises(TrainingConfigError, match="gradient_accumulation_steps"):
        TrainingConfig(gradient_accumulation_steps=0)

    with pytest.raises(TrainingConfigError, match="precision"):
        TrainingConfig(precision="int8")

    with pytest.raises(TrainingConfigError, match="max_grad_norm"):
        TrainingConfig(max_grad_norm=0)


def test_training_config_round_trip():
    config = TrainingConfig(epochs=2, batch_size=4, precision="bf16")

    restored = TrainingConfig.from_dict(config.to_dict())

    assert restored == config


def test_training_config_is_distinct_from_general_config():
    from arclm.configs import Config
    from arclm.training import TrainingConfig as CoreTrainingConfig

    assert CoreTrainingConfig is not Config
    assert hasattr(CoreTrainingConfig(), "gradient_accumulation_steps")
