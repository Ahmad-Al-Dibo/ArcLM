import math

import pytest
import torch

from arclm.evaluation import Accuracy, LossMetric, MetricsReport, Perplexity, calculate_metrics, calculate_perplexity
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


def test_diagnostics_calculate_perplexity_matches_canonical_metric():
    metric = Perplexity()
    metric.update(loss=torch.tensor(math.log(3.0)))

    assert calculate_perplexity(math.log(3.0)) == pytest.approx(metric.compute())


def test_diagnostics_calculate_metrics_returns_legacy_report_shape():
    class TinyLM(torch.nn.Module):
        def forward(self, x):
            logits = torch.zeros(x.shape[0], x.shape[1], 3)
            logits[..., 1] = 5.0
            return logits

    val_loader = [
        (
            torch.tensor([[0, 0], [0, 0]], dtype=torch.long),
            torch.tensor([[1, 1], [1, 2]], dtype=torch.long),
        )
    ]

    report = calculate_metrics(TinyLM(), val_loader, config=None, device="cpu")

    assert isinstance(report, MetricsReport)
    assert report.total_tokens == 4
    assert report.correct_predictions == 3
    assert report.accuracy == pytest.approx(0.75)
    assert report.perplexity == pytest.approx(calculate_perplexity(report.avg_loss))
