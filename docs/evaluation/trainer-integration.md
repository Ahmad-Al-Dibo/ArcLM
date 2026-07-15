# Trainer Integration

`Trainer.evaluate()` blijft compatibel met bestaande code.

```python
metrics = trainer.evaluate(validation_dataset)
```

Het resultaat blijft een gewone dict:

```python
{
    "loss": 1.2,
    "perplexity": 3.32,
    "token_accuracy": 0.81,
}
```

Intern gebruikt de trainer de Basic Evaluation core. De trainer:

- gebruikt hetzelfde model
- gebruikt hetzelfde device
- gebruikt geen gradients
- herstelt de model mode
- verandert optimizer state niet
- reset training state niet
