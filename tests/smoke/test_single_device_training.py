import pytest

pytest.importorskip("torch.nn")

from arclm.training import Trainer, TrainingConfig

from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


def test_single_device_training_smoke(tmp_path):
    config = TrainingConfig(
        epochs=1,
        batch_size=2,
        learning_rate=1e-2,
        output_dir=str(tmp_path),
        save_every_steps=0,
        log_every_steps=0,
    )
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=4),
        config=config,
    )

    state = trainer.train()

    assert state.global_step == 2
    assert state.optimizer_step == 2
