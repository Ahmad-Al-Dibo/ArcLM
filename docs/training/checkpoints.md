# Checkpoints

De nieuwe checkpoint API gebruikt simpele namen:

```python
path = trainer.save_checkpoint()
trainer.load_checkpoint(path)
```

Zonder pad schrijft ArcLM naar:

```text
output_dir/checkpoint-{global_step}/training.pt
```

Een checkpoint bevat:

- model state
- optimizer state
- scheduler state
- training state
- config
- precision scaler state
- basis metadata

Automatisch opslaan:

```python
config = TrainingConfig(
    output_dir="outputs/run-1",
    save_every_steps=500,
    keep_last_checkpoints=3,
)
```

Oude `trainer.save(config)` checkpoints blijven bestaan voor bestaande ArcLM workflows.
