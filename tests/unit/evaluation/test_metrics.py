import math

import pytest
import torch

from arclm.evaluation import Accuracy, LossMetric, Perplexity
from arclm.exceptions import MetricError


def test_loss_metric_averages_batch_loss():
    metric = LossMetric()

    metric.update(loss=torch.tensor(1.0))
    metric.update(loss=torch.tensor(3.0))

    assert metric.compute() == 2.0


def test_perplexity_uses_known_loss_value():
    metric = Perplexity()

    metric.update(loss=torch.tensor(math.log(4.0)))

    assert metric.compute() == pytest.approx(4.0)


def test_perplexity_returns_none_without_loss():
    assert Perplexity().compute() is None


def test_classification_accuracy():
    metric = Accuracy()
    logits = torch.tensor([[3.0, 1.0], [0.0, 2.0], [4.0, 1.0]])
    labels = torch.tensor([0, 1, 1])

    metric.update(logits, labels)

    assert metric.compute() == pytest.approx(2 / 3)


def test_token_accuracy_ignores_index():
    metric = Accuracy(ignore_index=-100)
    logits = torch.tensor(
        [
            [[3.0, 1.0], [0.0, 2.0], [2.0, 0.0]],
        ]
    )
    labels = torch.tensor([[0, 1, -100]])

    metric.update(logits, labels)

    assert metric.compute() == 1.0


def test_accuracy_rejects_invalid_shape():
    metric = Accuracy()

    with pytest.raises(MetricError, match="shape"):
        metric.update(torch.randn(2, 3), torch.randint(0, 2, (2, 2)))


def test_metric_reset_behavior():
    metric = Accuracy()
    metric.update(torch.tensor([[1.0, 0.0]]), torch.tensor([0]))

    metric.reset()

    assert metric.compute() is None
