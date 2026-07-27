from arclm.training import BaseTrainer


class CustomTrainer(BaseTrainer):
    def train(self):
        return "trained"

    def training_step(self, batch):
        return batch


def test_base_trainer_can_be_subclassed():
    trainer = CustomTrainer()

    assert trainer.train() == "trained"
    assert trainer.training_step(1) == 1
