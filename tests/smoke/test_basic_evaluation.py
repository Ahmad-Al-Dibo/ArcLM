import math

from arclm.evaluation import EvaluationConfig, Evaluator

from tests.unit.evaluation._helpers import ClassificationDataset, ClassificationModel


def test_basic_evaluation_smoke_cpu():
    model = ClassificationModel()
    model.train()

    result = Evaluator(
        model=model,
        dataset=ClassificationDataset(),
        config=EvaluationConfig(batch_size=2, device="cpu"),
    ).evaluate()

    assert math.isfinite(result.metrics["loss"])
    assert 0.0 <= result.metrics["accuracy"] <= 1.0
    assert result.predictions is None
    assert model.training is True
