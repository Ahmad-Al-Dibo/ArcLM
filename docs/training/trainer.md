# Trainer

Gebruik `Trainer` voor eenvoudige training op één apparaat.

```python
from arclm.training import Trainer, TrainingConfig

config = TrainingConfig(epochs=1, batch_size=4)
trainer = Trainer(model=model, train_dataset=train_dataset, config=config)

state = trainer.train()
```

Validatie:

```python
metrics = trainer.evaluate(validation_dataset)
```

Belangrijke public methods:

- `train()`
- `evaluate(dataset=None)`
- `training_step(batch)`
- `save_checkpoint(path=None)`
- `load_checkpoint(path)`
- `resume(path)`

Oude methods blijven bestaan:

- `train(loader, epochs)`
- `save(config, vocab=None, stoi=None, itos=None)`
- `load(model_path)`
