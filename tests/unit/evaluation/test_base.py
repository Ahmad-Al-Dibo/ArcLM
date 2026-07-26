from arclm.evaluation import BaseEvaluator, BaseMetric


class ExactMatch(BaseMetric):
    name = "exact_match"

    def __init__(self):
        self.reset()

    def update(self, predictions, targets):
        self.count += 1

    def compute(self):
        return self.count

    def reset(self):
        self.count = 0


class CustomEvaluator(BaseEvaluator):
    def evaluate(self, dataset=None):
        return {"ok": True}


def test_base_metric_can_be_subclassed():
    metric = ExactMatch()

    metric.update(None, None)

    assert metric.compute() == 1


def test_base_evaluator_can_be_subclassed():
    evaluator = CustomEvaluator()

    assert evaluator.evaluate()["ok"] is True
