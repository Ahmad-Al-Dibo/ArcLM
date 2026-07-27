import warnings

import pytest


def test_old_trainer_import_still_points_to_training_trainer():
    pytest.importorskip("torch.nn")
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        from arclm.trainer import Trainer as OldTrainer

    from arclm.training import Trainer

    assert OldTrainer is Trainer


def test_old_pipeline_train_model_import_still_exists():
    pytest.importorskip("torch.nn")
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        from arclm.pipeline import train_model

    assert train_model is not None


def test_old_trainer_constructor_and_train_signature_still_work(tmp_path):
    torch = pytest.importorskip("torch")
    pytest.importorskip("torch.nn")
    from torch.utils.data import DataLoader, TensorDataset

    from arclm.configs import Config
    from arclm.training import Trainer

    model = torch.nn.Linear(4, 1)
    optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
    criterion = torch.nn.MSELoss()
    x = torch.randn(4, 4)
    y = torch.randn(4, 1)
    loader = DataLoader(TensorDataset(x, y), batch_size=2)
    config = Config(device="cpu", training_log_interval=0, model_path=str(tmp_path / "old.pth"))

    class RegressionTrainer(Trainer):
        def unpack_batch(self, batch):
            inputs, labels = batch
            return inputs.to(self.device), labels.to(self.device), None

        def compute_loss(self, logits, y, loss_mask=None):
            return self.criterion(logits, y)

    trainer = RegressionTrainer(model, optimizer, criterion, config)
    state = trainer.train(loader, 1)

    assert state.global_step == 2
    assert trainer.optimizer is optimizer
