# Basic Evaluation

`arclm.evaluation` bevat nu een kleine evaluatie core voor CPU en single-device gebruik.

Geïmplementeerd:

- `Evaluator`
- `EvaluationConfig`
- `EvaluationResult`
- `BaseMetric`
- `BaseEvaluator`
- validation loss
- perplexity
- basic accuracy
- custom metrics
- evaluation callbacks
- `Trainer.evaluate()` integratie

Niet geïmplementeerd:

- MMLU en GSM8K
- LLM-as-a-judge
- human evaluation tools
- dashboards
- distributed evaluation
- cloud evaluation
- safety, bias, retrieval, vision of multimodal benchmarks

## Snel Voorbeeld

```python
from arclm.evaluation import Accuracy, Evaluator, EvaluationConfig, Perplexity

config = EvaluationConfig(batch_size=8, device="cpu")

evaluator = Evaluator(
    model=model,
    dataset=validation_dataset,
    metrics=[Accuracy(), Perplexity()],
    config=config,
)

result = evaluator.evaluate()

print(result.metrics)
```

Je kunt ook de korte functie gebruiken:

```python
from arclm.evaluation import evaluate

result = evaluate(model=model, dataset=validation_dataset)
```
