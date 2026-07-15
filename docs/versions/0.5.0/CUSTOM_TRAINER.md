# Eigen Trainer Archief

Dit is een archiefpagina voor oude custom-trainer documentatie uit ArcLM 0.5.0.

Voor actuele training docs gebruik je:

- `README.md`
- `docs/architecture/public-api.md`
- `docs/roadmap.md`

## Korte Uitleg

ArcLM ondersteunt eigen trainers door de bestaande `Trainer` te gebruiken of methodes zoals loss-berekening te overschrijven. Nieuwe code gebruikt:

```python
from arclm.training import Trainer, build_model, build_trainer
```

Deze archiefpagina is geen hoofdbron meer voor de speciale versie.
