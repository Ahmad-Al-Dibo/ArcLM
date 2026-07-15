# Migratie Naar De Nieuwe Package Structuur

ArcLM is verplaatst naar een `src/` layout met duidelijke domain packages.

Nieuwe code gebruikt bij voorkeur:

```python
from arclm.datasets import load_dataset
from arclm.training import train_model
from arclm.tokenizers import Tokenizer
```

## Oude Imports

Deze oude imports blijven voorlopig bestaan:

| Oud | Nieuw |
| --- | --- |
| `from arclm.config import Config` | `from arclm.configs import Config` |
| `from arclm.dataset import TextDataset` | `from arclm.datasets import TextDataset` |
| `from arclm.data import prepare_data` | `from arclm.datasets import prepare_data` |
| `from arclm.data_processor import DataProcessor` | `from arclm.datasets import DataProcessor` |
| `from arclm.instruction_dataset import InstructionDataset` | `from arclm.datasets import InstructionDataset` |
| `from arclm.trainer import Trainer` | `from arclm.training import Trainer` |
| `from arclm.pipeline import train_model` | `from arclm.training import train_model` |
| `from arclm.tokenizer import Tokenizer` | `from arclm.tokenizers import Tokenizer` |

## Aanbevolen Versus Legacy

Voor nieuwe code zijn deze imports het meest duidelijk:

```python
from arclm.datasets import load_dataset
from arclm.training import Trainer, TrainingConfig
from arclm.evaluation import Evaluator
from arclm.finetuning import SFTTrainer, ModelAdapter
```

Let op deze dubbele namen:

- `arclm.training.TrainingConfig` is de nieuwe training-core config.
- `arclm.configs.TrainingConfig` is een legacy alias naar de brede `Config`.
- `arclm.finetuning.ModelAdapter` is bedoeld voor SFT/fine-tuning adapters.
- `arclm.training.ModelAdapter` hoort bij de oudere unified training helpers.

Deze namen worden in Milestone 1 alleen gedocumenteerd en getest. Ze worden niet
samengevoegd of verwijderd.

## Waarom Deze Migratie?

De oude flat structuur maakte de library moeilijker te groeien. Alles zat naast elkaar. De nieuwe structuur maakt duidelijker waar iets hoort:

- data in `arclm.datasets`
- training in `arclm.training`
- tokenizers in `arclm.tokenizers`
- inference in `arclm.inference`
- checkpoints in `arclm.checkpoints`

## Wat Moet Jij Doen?

Voor bestaande code hoef je niet meteen alles te veranderen. De oude imports geven meestal een deprecation warning maar blijven werken.

Voor nieuwe code:

```python
from arclm.datasets import DataPipeline, load_dataset
from arclm.training import train_model
from arclm.tokenizers import AutoTokenizer
```

## Speciale Versie

Deze migratie hoort bij de speciale ArcLM-versie. Deze versie is private/niet-open-source en mag advanced onderdelen bevatten die niet bedoeld zijn voor een gewone publieke release.
