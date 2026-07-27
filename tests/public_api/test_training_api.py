def test_training_core_public_imports():
    import pytest

    from arclm.training import (
        BaseCallback,
        BaseTrainer,
        TrainingConfig,
        TrainingState,
    )

    assert BaseCallback is not None
    assert BaseTrainer is not None
    assert TrainingConfig is not None
    assert TrainingState is not None

    pytest.importorskip("torch.nn")
    from arclm.training import Trainer

    assert Trainer is not None


def test_training_all_contains_core_names():
    import arclm.training as training

    assert "BaseTrainer" in training.__all__
    assert "Trainer" in training.__all__
    assert "TrainingConfig" in training.__all__
    assert "TrainingState" in training.__all__
