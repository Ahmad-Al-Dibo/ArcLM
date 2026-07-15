# Doelstructuur

ArcLM gebruikt nu een `src/` layout en is verdeeld in duidelijke domeinen.

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

## Domeinen

| Domein | Taak | Voorbeelden |
| --- | --- | --- |
| `arclm.configs` | Instellingen maken, laden en opslaan. | `Config`, `create_config`, `load_config` |
| `arclm.models` | Native ArcLM modellen. | `ArcLM`, `MiniGPT`, `AutoModel` |
| `arclm.tokenizers` | Tekst naar tokens en terug. | `Tokenizer`, `SentencePieceTokenizer`, `AutoTokenizer` |
| `arclm.datasets` | Dataset loading, cleaning, pipelines en deduplicatie. | `load_dataset`, `DataPipeline`, `ExactDeduplicator` |
| `arclm.checkpoints` | Checkpoints en modelbronnen laden. | `SmartLoader`, `LoadedCheckpoint` |
| `arclm.training` | Model training en training helpers. | `Trainer`, `train_model` |
| `arclm.finetuning` | SFT en Hugging Face fine-tuning. | `train_sft` |
| `arclm.inference` | Modellen laden en tekst genereren. | `load_model`, `predict` |
| `arclm.evaluation` | Metrics en diagnostiek. | `calculate_metrics`, `predict_top_k` |
| `arclm.preprocess` | Oudere JSONL preprocess workflow. | `PreprocessPipeline` |
| `arclm.logics` | Kleine knowledge-base helpers voor simpele regels. | `KnowledgeBase`, `Symbol`, `model_check` |

## Regels Voor Nieuwe Code

- Nieuwe publieke code hoort in een domeinpackage.
- Root imports blijven lazy en klein.
- Oude modules blijven alleen als compatibility shims.
- Dataset code mag niet afhankelijk zijn van training.
- Training mag wel datasets gebruiken.
- Optionele dependencies mogen import van `arclm` niet breken.

## Speciale Versie

Deze structuur hoort bij de speciale ArcLM-versie. Deze editie is bedoeld om ook advanced onderdelen toe te voegen. Denk aan dataset versioning, token analysis, synthetic data, advanced SFT, dashboards en model-source tooling.
