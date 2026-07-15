# Data Overzicht

Dit is de nieuwe data-laag van de speciale ArcLM-versie.

De basisworkflow is:

```text
Laden -> Controleren -> Schoonmaken -> Duplicaten verwijderen -> Analyseren -> Trainen
```

Voor simpele projecten gebruik je meestal:

```python
from arclm.datasets import DataPipeline, load_dataset
from arclm.datasets.cleaning import NormalizeWhitespace, RemoveEmptyText
from arclm.datasets.deduplication import ExactDeduplicator

dataset = load_dataset("data/train.jsonl", required_fields=["text"])

pipeline = DataPipeline([
    NormalizeWhitespace("text"),
    RemoveEmptyText("text"),
    ExactDeduplicator(field="text", normalize=True),
])

dataset = pipeline.run(dataset)
```

## Belangrijke Onderdelen

| Onderdeel | Waarvoor gebruik je het? |
| --- | --- |
| `load_dataset` | Bestanden of Python lijsten laden. |
| `DatasetLoader` | Herbruikbare loader met vaste instellingen. |
| `DataPipeline` | Stappen na elkaar uitvoeren. |
| Cleaning steps | Tekst en velden schoonmaken. |
| `ExactDeduplicator` | Exacte duplicaten verwijderen. |
| `StreamingDataset` | Grote bestanden lazy lezen. |
| `BaseDataStep` | Zelf pipeline stappen bouwen. |
| `BaseDataset` | Zelf dataset classes maken. |

## Oud En Nieuw

De oude training helpers blijven werken:

```python
from arclm.datasets import TextDataset, create_dataloader, prepare_data
```

De oude JSONL preprocess workflow blijft ook bestaan:

```python
from arclm.preprocess import PreprocessConfig, PreprocessPipeline
```

Gebruik voor nieuwe code liever `arclm.datasets`, omdat die API simpeler en beter uitbreidbaar is.
