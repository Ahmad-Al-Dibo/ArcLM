# Full Fine-Tuning

`FullFineTuner` traint alle parameters waarvan `requires_grad=True`.

```python
from arclm.finetuning import FullFineTuner, SFTConfig

config = SFTConfig(epochs=3, batch_size=4, max_length=1024)

fine_tuner = FullFineTuner(
    model=model,
    tokenizer=tokenizer,
    train_dataset=train_dataset,
    config=config,
)

state = fine_tuner.train()
```

De fine-tuner kopieert geen training loop. Optimizer steps, mixed precision,
gradient accumulation, checkpoints en resume blijven onderdeel van `Trainer`.
