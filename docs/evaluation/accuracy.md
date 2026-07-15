# Accuracy

`Accuracy` ondersteunt twee veelgebruikte vormen.

Classificatie:

```text
logits: [batch, classes]
labels: [batch]
```

Token-level:

```text
logits: [batch, sequence, vocab]
labels: [batch, sequence]
```

De hoogste logit wordt gekozen als voorspelling. Labels met `ignore_index` worden overgeslagen.

```python
from arclm.evaluation import Accuracy

metric = Accuracy(ignore_index=-100)
```

Bij niet-ondersteunde shapes geeft ArcLM een duidelijke metric error.
