# Data Schoonmaken

Cleaning stappen staan in `arclm.datasets.cleaning`.

```python
from arclm.datasets.cleaning import (
    DropFields,
    FilterByLength,
    NormalizeWhitespace,
    RemoveControlCharacters,
    RemoveEmptyText,
    RenameFields,
    SelectFields,
    StripText,
)
```

## Simpele Tekst Pipeline

```python
from arclm.datasets import DataPipeline
from arclm.datasets.cleaning import FilterByLength, NormalizeWhitespace, RemoveEmptyText, StripText

pipeline = DataPipeline([
    StripText("text"),
    NormalizeWhitespace("text"),
    RemoveEmptyText("text"),
    FilterByLength("text", min_length=20),
])

dataset = pipeline.run(dataset)
```

## Beschikbare Stappen

| Stap | Wat doet hij? |
| --- | --- |
| `StripText` | Haalt spaties aan begin/einde weg. |
| `NormalizeWhitespace` | Vervangt meerdere whitespace tekens door een spatie. |
| `RemoveControlCharacters` | Verwijdert control characters. |
| `RemoveEmptyText` | Verwijdert voorbeelden met lege tekstvelden. |
| `FilterByLength` | Verwijdert tekst die te kort of te lang is. |
| `SelectFields` | Houdt alleen gekozen velden over. |
| `RenameFields` | Hernoemt velden. |
| `DropFields` | Verwijdert gekozen velden. |

Cleaning stappen maken een kopie van het voorbeeld voordat ze velden aanpassen. Daardoor verandert de originele input niet onverwacht.
