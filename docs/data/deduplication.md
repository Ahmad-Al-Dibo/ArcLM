# Deduplicatie

Gebruik `ExactDeduplicator` om exacte dubbele voorbeelden te verwijderen.

```python
from arclm.datasets.deduplication import ExactDeduplicator

deduplicator = ExactDeduplicator(
    field="text",
    normalize=True,
)

result = deduplicator.deduplicate(dataset)

print(result.kept)
print(result.removed)

dataset = result.dataset
```

## Korte Helper

```python
from arclm.datasets import deduplicate

dataset = deduplicate(dataset, field="text")
```

## Opties

| Optie | Betekenis |
| --- | --- |
| `field` | Een veld gebruiken als sleutel. |
| `fields` | Meerdere velden samen gebruiken als sleutel. |
| `normalize` | Tekst lowercase maken en whitespace normaliseren voor vergelijking. |
| `keep` | `"first"` of `"last"` bewaren. |
| `hash_algorithm` | Optioneel hashen met bijvoorbeeld `"sha256"`. |
| `missing` | Wat doen bij missende velden: `"keep"`, `"drop"` of `"error"`. |

## In Een Pipeline

```python
from arclm.datasets import DataPipeline
from arclm.datasets.deduplication import ExactDeduplicator

pipeline = DataPipeline([
    ExactDeduplicator(fields=["instruction", "response"], normalize=True),
])

dataset = pipeline.run(dataset)
```

Deze eerste deduplicatie is bewust simpel. Approximate deduplicatie zoals MinHash, SimHash of embeddingsimilariteit hoort bij een latere advanced fase.
