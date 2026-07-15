import pytest

from arclm.evaluation import EvaluationConfig
from arclm.exceptions import EvaluationConfigError


def test_evaluation_config_defaults():
    config = EvaluationConfig()

    assert config.batch_size == 8
    assert config.device == "cpu"
    assert config.ignore_index == -100


def test_evaluation_config_validates_values():
    with pytest.raises(EvaluationConfigError, match="batch_size"):
        EvaluationConfig(batch_size=0)

    with pytest.raises(EvaluationConfigError, match="max_batches"):
        EvaluationConfig(max_batches=0)

    with pytest.raises(EvaluationConfigError, match="ignore_index"):
        EvaluationConfig(ignore_index="bad")
