import pytest

from arclm_multilingual_pretraining.config import ProjectConfig
from arclm_multilingual_pretraining.train import estimate_model_parameters


def test_estimate_model_parameters_targets_50m():
    config = ProjectConfig()
    breakdown = estimate_model_parameters(config, vocab_size=config.vocab_size)

    assert breakdown["total_parameters"] == pytest.approx(50_000_000, rel=0.05)
    assert breakdown["token_embedding"] > 0
    assert breakdown["transformer_blocks"] > 0
    assert breakdown["lm_head"] > 0
