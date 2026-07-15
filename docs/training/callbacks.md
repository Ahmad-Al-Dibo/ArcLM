# Callbacks

Callbacks zijn kleine hooks rond de training.

```python
from arclm.training import BaseCallback


class PrintStep(BaseCallback):
    def on_step_end(self, trainer, state):
        print(state.global_step, state.last_loss)
```

Beschikbare hooks:

- `on_train_start`
- `on_train_end`
- `on_epoch_start`
- `on_epoch_end`
- `on_step_end`
- `on_evaluate`
- `on_checkpoint_save`

Callbacks sturen de trainer niet verborgen aan. Ze zijn bedoeld voor simpele logging, counters en kleine side effects.
