# Custom Trainer

Maak een eigen trainer door `training_step` te overschrijven.

```python
from arclm.training import Trainer


class MyTrainer(Trainer):
    def training_step(self, batch):
        outputs = self.model(**batch)
        return outputs.loss
```

Voor een volledig eigen trainer kun je `BaseTrainer` gebruiken:

```python
from arclm.training import BaseTrainer


class MyTrainer(BaseTrainer):
    def train(self):
        ...

    def training_step(self, batch):
        ...
```

Houd custom trainers klein. Gebruik de standaard `Trainer` zolang je alleen loss, batches of callbacks wilt aanpassen.
