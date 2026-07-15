# ArcLM 0.5.0 Gebruik

Dit is een archiefpagina. De oude `0.5.0` uitleg is vervangen door een korte samenvatting, omdat de repository nu verdergaat als speciale ArcLM-versie.

Deze speciale versie is niet open-source. De docs zijn wel publiek leesbaar geschreven in eenvoudige studententaal, zodat de library makkelijk te leren en te onderhouden blijft.

## Actuele Startpunten

- Begin met `README.md`.
- Lees `docs/special-version.md` voor de status van deze speciale versie.
- Lees `docs/data/overview.md` voor de nieuwe dataset API.
- Lees `docs/roadmap.md` voor wat klaar is en wat later komt.

## Basisgebruik

```python
from arclm.datasets import DataPipeline, load_dataset
from arclm.datasets.cleaning import NormalizeWhitespace, RemoveEmptyText
from arclm.datasets.deduplication import ExactDeduplicator

dataset = load_dataset("data/train.jsonl", required_fields=["text"])

pipeline = DataPipeline([
    NormalizeWhitespace("text"),
    RemoveEmptyText("text"),
    ExactDeduplicator(field="text"),
])

dataset = pipeline.run(dataset)
```

## Training

Voor training blijven de gewone ArcLM helpers beschikbaar. Nieuwe code gebruikt bij voorkeur imports uit de package waar het onderdeel hoort:

```python
from arclm.training import train_model
```

Oude imports blijven voorlopig bestaan via compatibility shims, maar nieuwe voorbeelden gebruiken de nieuwe structuur.

## Let Op

Deze pagina is niet bedoeld als volledige handleiding. Hij bestaat vooral zodat oude links niet breken.
