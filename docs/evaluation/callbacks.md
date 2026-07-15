# Evaluation Callbacks

Gebruik `BaseEvaluationCallback` voor kleine hooks rond evaluatie.

```python
from arclm.evaluation import BaseEvaluationCallback


class Recorder(BaseEvaluationCallback):
    def on_evaluate_start(self, evaluator):
        print("start")

    def on_batch_end(self, evaluator, batch_index, metrics):
        print(batch_index, metrics)

    def on_evaluate_end(self, evaluator, result):
        print(result.metrics)
```

Beschikbare hooks:

- `on_evaluate_start`
- `on_batch_end`
- `on_evaluate_end`

Callbacks zijn bedoeld voor logging en kleine side effects. Ze sturen de evaluatieloop niet verborgen aan.
