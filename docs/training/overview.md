# Training Core

`arclm.training` bevat de basis voor single-device training.

Geïmplementeerd in deze fase:

- `BaseTrainer`
- `Trainer`
- `TrainingConfig`
- `TrainingState`
- gradient accumulation
- `fp32`, `fp16` en `bf16` precision checks
- automatische checkpoints
- resume vanaf checkpoint
- eenvoudige callbacks
- optimizer en scheduler helpers
- train en validation loss metrics

Niet geïmplementeerd in deze fase:

- DDP, FSDP en DeepSpeed
- LoRA, QLoRA en PEFT workflows
- DPO, GRPO, RLHF en reward models
- hyperparameter search
- dashboards
- cloud training
- distributed checkpoints

## Snel Voorbeeld

```python
from arclm.training import Trainer, TrainingConfig

config = TrainingConfig(
    epochs=3,
    batch_size=8,
    learning_rate=2e-5,
    precision="bf16",
    gradient_accumulation_steps=4,
    output_dir="outputs/model",
)

trainer = Trainer(
    model=model,
    train_dataset=train_dataset,
    config=config,
)

state = trainer.train()
```

Voor oude ArcLM code blijft dit werken:

```python
trainer.train(train_loader, config.num_epochs)
```
