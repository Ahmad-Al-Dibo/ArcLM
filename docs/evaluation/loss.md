# Validation Loss

`LossMetric` berekent gemiddelde loss per batch.

De evaluator gebruikt loss uit model outputs als die bestaat:

```python
{"loss": loss, "logits": logits}
```

Als het model geen loss teruggeeft, kun je een `loss_fn` meegeven:

```python
evaluator = Evaluator(
    model=model,
    dataset=dataset,
    loss_fn=my_loss_fn,
)
```

ArcLM houdt geen computation graph vast tijdens evaluatie.
