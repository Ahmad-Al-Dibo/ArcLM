# Huidige Structuur

ArcLM gebruikt nu deze hoofdstructuur:

```text
src/arclm/
  configs/
  models/
  tokenizers/
  datasets/
  checkpoints/
  training/
  finetuning/
  inference/
  evaluation/
  exceptions/
  registry/
  plugins/
  utils/
  preprocess/
  logics/
```

## Wat Is Belangrijk?

- De oude flat package is verplaatst naar `src/arclm`.
- Oude imports blijven tijdelijk beschikbaar via compatibility shims.
- Nieuwe code gebruikt domain imports.
- De root package laadt veel onderdelen lazy, zodat `import arclm` licht blijft.
- De datasetlaag heeft nu een eigen moderne API met `load_dataset`, `DataPipeline`, cleaning en deduplicatie.

## Actieve Domeinen

| Domein | Uitleg |
| --- | --- |
| `configs` | Config objecten en JSON/YAML helpers. |
| `models` | Native ArcLM modelcode. |
| `tokenizers` | Word en SentencePiece tokenizers. |
| `datasets` | Data loading, cleaning, pipelines en deduplicatie. |
| `checkpoints` | Model/checkpoint loading en inspectie. |
| `training` | Training loops, trainers en callbacks. |
| `finetuning` | SFT en Hugging Face fine-tuning. |
| `inference` | Modellen laden en tekst genereren. |
| `evaluation` | Metrics en diagnostiek. |
| `preprocess` | Oudere JSONL preprocess pipeline. |
| `logics` | Kleine knowledge-base helpers voor simpele regels. |

## Speciale Editie

Deze structuur is bedoeld voor de speciale niet-open-source ArcLM-versie. Daardoor is er ruimte voor advanced tooling, maar de basis moet nog steeds simpel blijven.
