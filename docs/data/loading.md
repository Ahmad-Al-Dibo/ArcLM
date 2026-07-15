# Dataset Laden

Gebruik `load_dataset()` om lokale datasets te laden.

```python
from arclm.datasets import load_dataset

dataset = load_dataset("data/train.jsonl")
```

## Ondersteunde Bronnen

| Bron | Wat gebeurt er? |
| --- | --- |
| JSON | Laadt een dict, lijst, of velden zoals `data`, `samples`, `records`. |
| JSONL | Leest een JSON object per regel. |
| CSV | Leest rijen met `csv.DictReader`. |
| TXT | Maakt per niet-lege regel een item met `{"text": regel}`. |
| Python list | Laat dicts staan en zet losse waarden in het tekstveld. |

## Verplichte Velden

```python
dataset = load_dataset(
    "data/instructions.jsonl",
    required_fields=["instruction", "response"],
)
```

Als een verplicht veld mist, krijg je een duidelijke `DatasetValidationError`.

## Streaming

Voor grote bestanden:

```python
dataset = load_dataset(
    "data/large-corpus.jsonl",
    streaming=True,
)

for example in dataset:
    print(example["text"])
```

Streaming datasets zijn alleen iterables. Ze hebben geen `len()` en geen random indexing. Dat is bewust zo, want het bestand wordt pas gelezen tijdens het itereren.

## Herbruikbare Loader

```python
from arclm.datasets import DatasetLoader

loader = DatasetLoader(
    text_field="text",
    required_fields=["text"],
)

dataset = loader.load("data/train.jsonl")
```
