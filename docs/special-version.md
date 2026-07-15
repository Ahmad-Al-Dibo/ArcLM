# Speciale ArcLM Versie

Deze repository beschrijft de speciale ArcLM-versie.

## Belangrijk

Deze versie is **niet bedoeld als open-source release**. Behandel de code, docs en advanced onderdelen als private projectinformatie. Deel deze versie niet publiek zonder toestemming van de projecteigenaar.

## Waarom Een Speciale Versie?

De speciale versie mag verder gaan dan een simpele publieke library. Hier kunnen we advanced onderdelen bouwen zoals:

- dataset versioning
- token analysis
- synthetic data generation
- advanced SFT
- model-source inspectie
- dashboards
- lokale serving helpers
- betere evaluatie workflows
- toekomstige DPO/RLHF/GRPO experimenten

## Documentatiestijl

Alle publieke documentatie in deze werkmap moet simpel Nederlands gebruiken.

Code names blijven Engels:

```python
load_dataset()
DataPipeline
ExactDeduplicator
Tokenizer
Trainer
```

Maar uitleg schrijven we alsof een student de library moet kunnen begrijpen zonder zware enterprise-taal.

## Wat Is De Waarheid?

Gebruik deze bestanden als actuele documentatie:

- `README.md`
- `docs/special-version.md`
- `docs/roadmap.md`
- `docs/architecture/public-api.md`
- `docs/architecture/target-structure.md`
- `docs/data/`

Bestanden onder `docs/versions/` zijn archiefmateriaal van oudere fases.
