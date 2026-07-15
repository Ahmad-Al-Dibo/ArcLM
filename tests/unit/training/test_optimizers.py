import pytest

pytest.importorskip("torch.nn")

from arclm.training import Trainer, TrainingConfig

from ._helpers import TinyTokenDataset, TinyTokenModel


def test_trainer_builds_optimizer_and_scheduler(tmp_path):
    config = TrainingConfig(
        epochs=1,
        batch_size=1,
        optimizer="adam",
        scheduler="linear",
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
    )
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=3),
        config=config,
    )

    trainer.train()

    assert trainer.optimizer.__class__.__name__ == "Adam"
    assert trainer.scheduler is not None
    assert trainer.scheduler.last_epoch == trainer.optimizer_step


def test_custom_optimizer_can_be_passed(tmp_path):
    model = TinyTokenModel()
    optimizer = __import__("torch").optim.SGD(model.parameters(), lr=0.01)
    config = TrainingConfig(
        epochs=1,
        batch_size=1,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
    )

    trainer = Trainer(
        model=model,
        train_dataset=TinyTokenDataset(size=2),
        config=config,
        optimizer=optimizer,
    )
    trainer.train()

    assert trainer.optimizer is optimizer
    assert trainer.optimizer_step == 2
