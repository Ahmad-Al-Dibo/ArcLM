# Metrics

Basic Evaluation bevat drie standaard metrics:

- `LossMetric`
- `Perplexity`
- `Accuracy`

```python
from arclm.evaluation import Accuracy, LossMetric, Perplexity

metrics = [
    LossMetric(),
    Perplexity(),
    Accuracy(),
]
```

Metrics hebben een kleine interface:

- `update(...)`
- `compute()`
- `reset()`

Custom metrics kunnen dezelfde interface gebruiken.
