# Custom Metrics

Maak een eigen metric door `BaseMetric` te gebruiken.

```python
from arclm.evaluation import BaseMetric


class ExactMatch(BaseMetric):
    name = "exact_match"

    def __init__(self):
        self.reset()

    def update(self, predictions, targets):
        self.correct += int((predictions == targets).all())
        self.total += 1

    def compute(self):
        return self.correct / self.total if self.total else None

    def reset(self):
        self.correct = 0
        self.total = 0
```

Gebruik de metric:

```python
evaluator = Evaluator(
    model=model,
    dataset=dataset,
    metrics=[ExactMatch()],
)
```

Een custom metric hoeft de evaluator internals niet te kennen.
