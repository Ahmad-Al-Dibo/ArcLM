# Data Pipelines

`DataPipeline` voert stappen een voor een uit.

```python
from arclm.datasets import DataPipeline
from arclm.datasets.cleaning import StripText, RemoveEmptyText

pipeline = DataPipeline([
    StripText("text"),
    RemoveEmptyText("text"),
])

dataset = pipeline.run(dataset)
```

## Per Voorbeeld Werken

Een gewone stap erft van `BaseDataStep` en verwerkt een voorbeeld.

```python
from arclm.datasets import BaseDataStep


class AddSource(BaseDataStep):
    def process(self, example):
        item = dict(example)
        item["source"] = "local"
        return item
```

Geef `None` terug als een voorbeeld verwijderd moet worden:

```python
class RemoveShortText(BaseDataStep):
    def __init__(self, min_length=20):
        self.min_length = min_length

    def process(self, example):
        if len(example.get("text", "")) < self.min_length:
            return None
        return example
```

## Hele Dataset Stappen

Sommige stappen werken op de hele dataset, zoals deduplicatie:

```python
from arclm.datasets.deduplication import ExactDeduplicator

pipeline = DataPipeline([
    ExactDeduplicator(field="text"),
])
```

De pipeline houdt dit simpel: per-example stappen gebruiken `process()`, dataset-stappen gebruiken `deduplicate()`.
