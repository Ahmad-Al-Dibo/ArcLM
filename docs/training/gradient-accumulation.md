# Gradient Accumulation

Gebruik `gradient_accumulation_steps` als je meer batches wilt optellen voordat de optimizer een stap zet.

```python
config = TrainingConfig(
    batch_size=2,
    gradient_accumulation_steps=4,
)
```

De trainer deelt de loss door het aantal accumulation stappen. Daardoor blijven de gradients ongeveer dezelfde schaal houden als bij een grotere batch.

Als de laatste accumulation groep niet compleet is, zet de trainer alsnog één optimizer stap.
