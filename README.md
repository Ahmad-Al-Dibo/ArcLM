# ArcLM Speciale Versie

ArcLM is een compacte Python library voor taalmodellen. Deze versie is de speciale ArcLM-versie voor verder onderzoek en ontwikkeling. Behandel deze werkmap als **niet-open-source** en als een private/speciale editie. De stabiele kern richt zich nu op datasets, single-device training, checkpoints, evaluatie, full fine-tuning/SFT en lokale inference. Geavanceerde onderdelen zoals LoRA/PEFT, dashboards, distributed training, deployment en enterprise workflows staan nog in de roadmap totdat ze apart zijn goedgekeurd en getest.

De code is bedoeld om makkelijk te lezen te zijn. Denk aan een sterke student of beginnende onderzoeker die wil begrijpen hoe een LLM-library werkt zonder door onnodig zware architectuur heen te moeten.

## Wat Zit Erin?

| Onderdeel | Wat het doet |
| --- | --- |
| `arclm.configs` | Configuratie maken, laden en opslaan. |
| `arclm.models` | Compacte GPT-achtige ArcLM modellen. |
| `arclm.tokenizers` | Word tokenizer, SentencePiece tokenizer en tokenizer factories. |
| `arclm.datasets` | Dataset loading, pipelines, cleaning, streaming en deduplicatie. |
| `arclm.training` | Native training, trainers, checkpoints en training helpers. |
| `arclm.finetuning` | Supervised fine-tuning en Hugging Face SFT helpers. |
| `arclm.inference` | Modellen laden en tekst genereren. |
| `arclm.checkpoints` | Checkpoints en externe modelbronnen inspecteren/laden. |
| `arclm.evaluation` | Diagnostiek, metrics en top-k inspectie. |
| `arclm.preprocess` | Oudere JSONL cleaning pipeline met rapporten. |
| `arclm.logics` | Kleine knowledge-base module voor simpele regels en checks. |

## Installatie

Voor lokaal ontwikkelen:

```bash
pip install -e .
```

Voor development tools:

```bash
pip install -e ".[dev]"
```

Optionele extra's:

```bash
pip install -e ".[web]"
pip install -e ".[preprocess]"
pip install -e ".[hf]"
pip install -e ".[peft]"
```

Let op: de huidige gevalideerde ontwikkelomgeving gebruikt Python `3.12.10` met PyTorch `2.13.0+cpu`. CUDA is in deze workspace niet beschikbaar, daarom worden CUDA-specifieke mixed-precision tests overgeslagen.

## Snel Starten

```python
from arclm.training import train_model

result = train_model(
    mode="pretrain",
    data="data/data.txt",
    output="output/model.pth",
    tokenizer_type="word",
    num_epochs=1,
)

print(result.model_path)
```

## Dataset API

De nieuwe dataset API is simpel en bedoeld voor dagelijks gebruik:

```python
from arclm.datasets import DataPipeline, load_dataset
from arclm.datasets.cleaning import NormalizeWhitespace, RemoveEmptyText
from arclm.datasets.deduplication import ExactDeduplicator

dataset = load_dataset(
    "data/train.jsonl",
    required_fields=["text"],
)

pipeline = DataPipeline([
    NormalizeWhitespace("text"),
    RemoveEmptyText("text"),
    ExactDeduplicator(field="text", normalize=True),
])

dataset = pipeline.run(dataset)
```

Ondersteunde dataset formats:

- JSON
- JSONL
- CSV
- TXT
- Python lists
- Streaming JSONL/CSV/TXT via `streaming=True`

## Tokenizers

```python
from arclm.tokenizers import Tokenizer, SentencePieceTokenizer, AutoTokenizer

tokenizer = Tokenizer(max_vocab=10_000)
tokenizer.build("ArcLM leert van tekst")
ids = tokenizer.encode_text("ArcLM leert")
text = tokenizer.decode_string(ids)
```

## Inference

```python
from arclm.inference import load_model, predict

loaded = load_model("output/model.pth")
answer = predict(loaded, "ArcLM", max_new_tokens=20)
print(answer)
```

## Aanbevolen Imports

Gebruik domain imports:

```python
from arclm.configs import Config, create_config
from arclm.datasets import DataPipeline, DatasetLoader, load_dataset
from arclm.models import ArcLM, AutoModel
from arclm.tokenizers import AutoTokenizer, Tokenizer
from arclm.training import Trainer, train_model
from arclm.finetuning import train_sft
from arclm.inference import load_model, predict
from arclm.checkpoints import SmartLoader
from arclm.evaluation import calculate_metrics
```

Oude imports zoals `arclm.data`, `arclm.dataset`, `arclm.pipeline` en `arclm.trainer` blijven voorlopig bestaan als compatibility shims.

## Documentatie

Actieve docs:

- [Publieke API](docs/architecture/public-api.md)
- [Doelstructuur](docs/architecture/target-structure.md)
- [Migratie naar src-layout](docs/migration/package-restructure.md)
- [Dataset overzicht](docs/data/overview.md)
- [Dataset laden](docs/data/loading.md)
- [Data pipelines](docs/data/pipelines.md)
- [Data schoonmaken](docs/data/cleaning.md)
- [Deduplicatie](docs/data/deduplication.md)
- [Eigen componenten](docs/data/custom-components.md)
- [Logic hulpmiddelen](docs/logics/overview.md)
- [Roadmap](docs/roadmap.md)

Archiefdocs onder `docs/versions/` zijn oude snapshots. Gebruik de hoofddocumentatie hierboven als waarheid voor deze speciale versie.

## Testen

Volledige CPU-suite die in deze workspace groen is:

```bash
python -m pytest
```

Compile check:

```bash
python -m compileall src/arclm
```

Package build check zonder extra dependency-wijzigingen:

```bash
python -m pip wheel . --no-deps
```

De directe opdracht `python -m build` vereist de optionele development dependency `build`. Installeer die via `pip install -e ".[dev]"` wanneer je release-builds wilt maken.

## Status

Deze speciale versie bevat nu:

- `src/` package layout
- Domain packages
- Lazy root imports
- Compatibility shims
- Nieuwe dataset API
- Dataset cleaning
- Exacte deduplicatie
- Streaming dataset basis
- Single-device training core
- Training checkpoints en resume
- Basic evaluation
- Full fine-tuning en supervised fine-tuning
- Basic lokale inference
- Nederlandse docstrings/comments in de library code
- Nederlandse publieke student-documentatie

Nog gepland voor latere fases:

- Dataset versioning
- Dataset statistics
- Token analysis
- Data augmentation
- Synthetic data generation
- WebDataset integratie
- LoRA, QLoRA en andere PEFT workflows
- Distributed training
- Production serving en deployment
- Dashboards en uitgebreidere tooling
- Enterprise workflows

## Licentie En Gebruik

Deze README beschrijft de **speciale ArcLM-versie**. Behandel deze versie als **niet-open-source** en deel de code of geavanceerde onderdelen niet publiek zonder expliciete toestemming van de eigenaar van dit project.
