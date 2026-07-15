# TrainingConfig

`TrainingConfig` is de kleine config voor de nieuwe training core.

```python
from arclm.training import TrainingConfig

config = TrainingConfig(
    epochs=3,
    batch_size=8,
    learning_rate=2e-5,
    weight_decay=0.0,
    gradient_accumulation_steps=1,
    precision="fp32",
    max_grad_norm=1.0,
    output_dir="outputs",
    save_every_steps=500,
    keep_last_checkpoints=3,
    log_every_steps=10,
)
```

Validatie gebeurt direct bij het maken. Ongeldige waarden geven een duidelijke fout.

## Twee TrainingConfig Imports

Er zijn nu twee paden met dezelfde naam:

```python
from arclm.configs import TrainingConfig
```

Dit is de oude compatibiliteitsroute. Deze naam is een alias voor de brede `Config` class. Die config bevat model-, tokenizer-, data- en oude trainingvelden zoals `num_epochs`, `model_path` en `checkpoint_batch_interval`.

```python
from arclm.training import TrainingConfig
```

Dit is de nieuwe aanbevolen Training Core API. Deze class is kleiner en richt zich alleen op de trainer core. Hij gebruikt velden zoals `epochs`, `output_dir`, `precision`, `gradient_accumulation_steps`, `save_every_steps` en `keep_last_checkpoints`.

Gebruik voor nieuwe code:

```python
from arclm.training import TrainingConfig
```

Gebruik `arclm.configs.TrainingConfig` alleen voor bestaande code die de oude brede `Config` verwacht. Later kan er een migratiepad komen, maar deze fase verandert of verwijdert de oude alias niet.
