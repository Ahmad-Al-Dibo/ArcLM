# Supervised Fine-Tuning

`SFTTrainer` is de eenvoudige trainer voor instruction-, prompt-response- en
chatdata.

```python
from arclm.finetuning import SFTConfig, SFTTrainer

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    config=SFTConfig(
        instruction_field="instruction",
        input_field="input",
        response_field="output",
        assistant_only_loss=True,
    ),
)

trainer.train()
```

SFT gebruikt causal-lm labels. Als een model zelf loss teruggeeft, gebruikt
ArcLM die loss. Als het model alleen logits teruggeeft, berekent de adapter een
shifted causal-lm loss.
