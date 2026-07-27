import pytest
import torch

from arclm.evaluation import (
    Accuracy,
    BaseEvaluationCallback,
    BaseMetric,
    EvaluationConfig,
    Evaluator,
    LossMetric,
    Perplexity,
    evaluate,
)
from arclm.exceptions import EvaluationError

from ._helpers import ClassificationDataset, ClassificationModel, TokenDataset, TokenModel


def test_evaluator_runs_without_gradients_and_restores_mode():
    model = ClassificationModel()
    model.train()

    class GradMetric(BaseMetric):
        name = "grad_enabled"

        def __init__(self):
            self.values = []

        def update(self, predictions, targets):
            self.values.append(torch.is_grad_enabled())

        def compute(self):
            return any(self.values)

        def reset(self):
            self.values = []

    metric = GradMetric()
    result = Evaluator(
        model=model,
        dataset=ClassificationDataset(),
        metrics=[metric],
        config=EvaluationConfig(batch_size=2),
    ).evaluate()

    assert result.metrics["grad_enabled"] is False
    assert model.training is True


def test_evaluator_computes_loss_perplexity_and_accuracy():
    result = Evaluator(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        metrics=[LossMetric(), Perplexity(), Accuracy()],
        config=EvaluationConfig(batch_size=2),
    ).evaluate()

    assert result.metrics["loss"] is not None
    assert result.metrics["perplexity"] is not None
    assert 0.0 <= result.metrics["accuracy"] <= 1.0
    assert result.num_examples == 4
    assert result.num_batches == 2


def test_evaluator_supports_token_accuracy_and_ignore_index():
    model = TokenModel()

    def loss_fn(logits, labels):
        return torch.nn.functional.cross_entropy(
            logits.reshape(-1, logits.size(-1)),
            labels.reshape(-1),
            ignore_index=-100,
        )

    result = Evaluator(
        model=model,
        dataset=TokenDataset(),
        metrics=[LossMetric(), Accuracy(ignore_index=-100)],
        config=EvaluationConfig(batch_size=1),
        loss_fn=loss_fn,
    ).evaluate()

    assert result.metrics["loss"] is not None
    assert 0.0 <= result.metrics["accuracy"] <= 1.0


def test_evaluator_stops_at_max_batches():
    result = Evaluator(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        config=EvaluationConfig(batch_size=1, max_batches=2),
    ).evaluate()

    assert result.num_batches == 2
    assert result.num_examples == 2


def test_evaluator_does_not_store_predictions_by_default():
    result = Evaluator(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        config=EvaluationConfig(batch_size=2),
    ).evaluate()

    assert result.predictions is None
    assert result.labels is None


def test_evaluator_can_return_predictions():
    result = Evaluator(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        config=EvaluationConfig(batch_size=2, return_predictions=True),
    ).evaluate()

    assert len(result.predictions) == 2
    assert len(result.labels) == 2


def test_evaluate_function_uses_evaluator():
    result = evaluate(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        config=EvaluationConfig(batch_size=2),
    )

    assert result.num_batches == 2


def test_custom_metric_with_simple_update_signature_runs():
    class CountMetric(BaseMetric):
        name = "count"

        def reset(self):
            self.count = 0

        def update(self, predictions, targets):
            self.count += int(targets.shape[0])

        def compute(self):
            return self.count

    result = Evaluator(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        metrics=[CountMetric()],
        config=EvaluationConfig(batch_size=2),
    ).evaluate()

    assert result.metrics["count"] == 4


def test_callbacks_receive_events():
    events = []

    class Recorder(BaseEvaluationCallback):
        def on_evaluate_start(self, evaluator):
            events.append("start")

        def on_batch_end(self, evaluator, batch_index, metrics):
            events.append(("batch", batch_index, "loss" in metrics))

        def on_evaluate_end(self, evaluator, result):
            events.append(("end", result.num_batches))

    Evaluator(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        config=EvaluationConfig(batch_size=2),
        callbacks=[Recorder()],
    ).evaluate()

    assert events == ["start", ("batch", 1, True), ("batch", 2, True), ("end", 2)]


def test_empty_dataset_returns_empty_metrics():
    class EmptyDataset(torch.utils.data.Dataset):
        def __len__(self):
            return 0

        def __getitem__(self, index):
            raise IndexError

    result = Evaluator(
        model=ClassificationModel(),
        dataset=EmptyDataset(),
        metrics=[LossMetric(), Accuracy()],
    ).evaluate()

    assert result.num_batches == 0
    assert result.metrics["loss"] is None
    assert result.metrics["accuracy"] is None


def test_missing_labels_fails_for_accuracy():
    class NoLabelDataset(torch.utils.data.Dataset):
        def __len__(self):
            return 1

        def __getitem__(self, index):
            return {"inputs": torch.ones(4)}

    with pytest.raises(Exception):
        Evaluator(
            model=ClassificationModel(),
            dataset=NoLabelDataset(),
            metrics=[Accuracy()],
        ).evaluate()


def test_missing_loss_is_allowed_when_loss_metric_absent():
    result = Evaluator(
        model=ClassificationModel(),
        dataset=ClassificationDataset(),
        metrics=[Accuracy()],
        config=EvaluationConfig(batch_size=2),
    ).evaluate()

    assert "accuracy" in result.metrics
