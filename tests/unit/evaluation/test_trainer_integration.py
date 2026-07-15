from arclm.training import Trainer, TrainingConfig

from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


def test_trainer_evaluate_keeps_dict_return(tmp_path):
    config = TrainingConfig(
        epochs=1,
        batch_size=1,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
    )
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=2),
        validation_dataset=TinyTokenDataset(size=2),
        config=config,
    )
    trainer.model.train()

    metrics = trainer.evaluate()

    assert set(metrics) == {"loss", "perplexity", "token_accuracy"}
    assert trainer.model.training is True
    assert 0.0 <= metrics["token_accuracy"] <= 1.0
