# Evaluator

`Evaluator` voert een eenvoudige evaluatieloop uit.

De loop:

1. zet het model in eval mode
2. zet batches op het gekozen device
3. gebruikt `torch.no_grad()`
4. leest loss, logits en labels
5. werkt metrics bij
6. herstelt de oude model mode
7. geeft een `EvaluationResult` terug

```python
from arclm.evaluation import Evaluator

evaluator = Evaluator(model=model, dataset=dataset)
result = evaluator.evaluate()
```

Als je al een dataloader hebt:

```python
evaluator = Evaluator(model=model, dataloader=loader)
```

De evaluator downloadt niets en heeft geen GPU nodig.
