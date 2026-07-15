# Eigen Componenten Maken

ArcLM is bedoeld om makkelijk uit te breiden te zijn. Je hoeft geen groot framework te begrijpen om een eigen dataset of stap te maken.

## Eigen Dataset

```python
from arclm.datasets import BaseDataset


class MyDataset(BaseDataset):
    def __init__(self, rows):
        self.rows = list(rows)

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, index):
        return self.rows[index]
```

## Eigen Pipeline Stap

```python
from arclm.datasets import BaseDataStep


class RemoveShortText(BaseDataStep):
    def __init__(self, min_length=20):
        self.min_length = min_length

    def process(self, example):
        if len(example.get("text", "")) < self.min_length:
            return None
        return example
```

## Eigen Cleaner

```python
from arclm.datasets import BaseCleaner


class AddCleanFlag(BaseCleaner):
    def process(self, example):
        item = dict(example)
        item["clean"] = True
        return item
```

## Eigen Deduplicator

```python
from arclm.datasets import BaseDeduplicator


class KeepEverything(BaseDeduplicator):
    def deduplicate(self, dataset):
        return list(dataset)
```

## Eigen Streaming Source

```python
from arclm.datasets import BaseStreamingDataset


class NumberStream(BaseStreamingDataset):
    def __iter__(self):
        for number in range(3):
            yield {"text": str(number)}
```

## Eigen Synthetic Generator

```python
from arclm.datasets import BaseSyntheticDataGenerator


class SimpleGenerator(BaseSyntheticDataGenerator):
    def generate(self, count):
        return [{"text": f"example {index}"} for index in range(count)]
```

De basisregel: maak kleine classes met een duidelijke taak.
