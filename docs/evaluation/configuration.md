# EvaluationConfig

`EvaluationConfig` bevat alleen instellingen die de Basic Evaluation core gebruikt.

```python
from arclm.evaluation import EvaluationConfig

config = EvaluationConfig(
    batch_size=8,
    device="cpu",
    max_batches=None,
    ignore_index=-100,
    return_predictions=False,
)
```

Belangrijke velden:

- `batch_size`: aantal voorbeelden per batch
- `device`: bijvoorbeeld `"cpu"` of `"cuda"`
- `max_batches`: stop vroeg na een aantal batches
- `ignore_index`: labelwaarde die accuracy overslaat
- `return_predictions`: bewaar predictions en labels in het resultaat

Ongeldige waarden geven een duidelijke fout, zoals `batch_size must be greater than zero`.
