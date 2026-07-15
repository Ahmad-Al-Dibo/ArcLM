# Data Huidige Staat

Deze pagina vat de data-audit samen voor de speciale ArcLM-versie.

## Huidige Data Modules

```text
src/arclm/datasets/
  __init__.py
  base.py
  loader.py
  processing.py
  instruction.py
  pipeline.py
  cleaning/
  deduplication/
  streaming/

src/arclm/preprocess/
  config.py
  pipeline.py
  cleaner.py
  filters.py
  duplicate.py
  io.py
  report.py
  statistics.py
```

## Nieuwe Dataset API

Belangrijkste nieuwe imports:

```python
from arclm.datasets import (
    BaseDataset,
    BaseStreamingDataset,
    BaseDataStep,
    BaseCleaner,
    BaseDeduplicator,
    DatasetLoader,
    DataPipeline,
    StreamingDataset,
    ExactDeduplicator,
    load_dataset,
    deduplicate,
)
```

## Wat Is Al Klaar?

| Onderdeel | Status |
| --- | --- |
| Base dataset interfaces | Klaar |
| Dataset loader | Klaar eerste versie |
| JSON/JSONL/CSV/TXT loading | Klaar |
| Python list loading | Klaar |
| Streaming JSONL/CSV/TXT | Klaar basis |
| Sequential pipeline | Klaar |
| Cleaning steps | Klaar basis |
| Exact deduplicatie | Klaar |
| Compatibility met oude `DataProcessor` | Klaar |

## Oude APIs Die Blijven

Deze namen blijven werken voor bestaande code:

- `DataProcessor`
- `ProcessedDataset`
- `TextDataset`
- `InstructionDataset`
- `prepare_data`
- `create_dataloader`
- `PreprocessPipeline`

Nieuwe code gebruikt liever `load_dataset()` en `DataPipeline`.

## Nog Gepland

- Dataset versioning
- Dataset statistics
- Token analysis
- Data augmentation
- Synthetic data generation
- WebDataset support
- Advanced deduplicatie

## Compatibility Risico's

- Training gebruikt nog `prepare_data`.
- Sommige voorbeelden gebruiken nog `DataProcessor`.
- De oude `arclm.preprocess` pipeline schrijft rapporten en blijft apart bestaan.
- Oude imports geven waar mogelijk waarschuwingen, maar worden nog niet verwijderd.
