# Custom Fine-Tuner

Gebruik `BaseFineTuner` wanneer je een eigen fine-tuner wilt bouwen.

```python
from arclm.finetuning import BaseFineTuner


class MyFineTuner(BaseFineTuner):
    def train(self):
        ...
```

Houd custom fine-tuners klein. Hergebruik de bestaande `Trainer` wanneer je
gewone gradient training, checkpoints en resume nodig hebt.
