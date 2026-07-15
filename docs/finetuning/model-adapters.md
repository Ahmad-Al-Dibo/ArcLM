# Model Adapters

`ModelAdapter` verbindt afwijkende model-API's met ArcLM.

```python
from arclm.finetuning import ModelAdapter

adapter = ModelAdapter(
    model,
    input_map={
        "input_ids": "tokens",
        "attention_mask": "mask",
        "labels": "targets",
    },
    output_map={
        "logits": "scores",
        "loss": "training_loss",
    },
)
```

De adapter verplaatst geen training logic. Hij bereidt alleen inputs voor,
leest outputs en kan loss berekenen wanneer het model alleen logits geeft.
