def test_finetuning_public_imports():
    from arclm.finetuning import (
        FullFineTuner,
        ModelAdapter,
        SFTConfig,
        SFTDataCollator,
        SFTTrainer,
        TokenizerAdapter,
    )

    assert FullFineTuner is not None
    assert ModelAdapter is not None
    assert SFTConfig is not None
    assert SFTDataCollator is not None
    assert SFTTrainer is not None
    assert TokenizerAdapter is not None


def test_root_finetuning_imports_do_not_replace_training_model_adapter():
    from arclm import FullFineTuner, SFTConfig, SFTTrainer, TokenizerAdapter
    from arclm.training import ModelAdapter as TrainingModelAdapter

    assert FullFineTuner is not None
    assert SFTConfig is not None
    assert SFTTrainer is not None
    assert TokenizerAdapter is not None
    assert TrainingModelAdapter.__module__.startswith("arclm.training")
