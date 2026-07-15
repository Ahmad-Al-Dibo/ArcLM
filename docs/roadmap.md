# ArcLM Roadmap

Deze roadmap hoort bij de speciale ArcLM-versie. Deze versie is niet bedoeld als open-source publieke release, maar als private/speciale ontwikkelversie waarin ook advanced features mogen komen.

## Klaar

| Onderdeel | Status | Uitleg |
| --- | --- | --- |
| `src/` layout | Klaar | Package code staat onder `src/arclm`. |
| Domain packages | Klaar | Code is verdeeld in configs, models, tokenizers, datasets, training, inference, enzovoort. |
| Lazy root import | Klaar | `import arclm` blijft licht. |
| Compatibility shims | Klaar | Oude imports blijven voorlopig werken. |
| Nederlandse code-docstrings | Klaar | Alle `src/arclm` classes/functions/methods hebben docstrings. |
| Dataset API | Klaar eerste fase | Laden, streaming basis, pipelines, cleaning en exacte deduplicatie. |
| Tokenizers | Klaar basis | Word tokenizer, SentencePiece en factories. |
| Training Core | Klaar eerste fase | `Trainer`, `BaseTrainer`, `TrainingConfig`, `TrainingState`, single-device loop, accumulation, precision checks, checkpoints, resume en callbacks. |
| SFT | Klaar eerste fase | Full fine-tuning en SFT via `Trainer`, model/tokenizer adapters, formatting, labels, assistant-only masking, packing basis, evaluation en resume. |
| Checkpoint loaders | Klaar basis | SmartLoader en verschillende loader types. |
| Basic Evaluation | Klaar eerste fase | `Evaluator`, `EvaluationConfig`, `EvaluationResult`, loss, perplexity, accuracy, custom metrics, callbacks en trainer-integratie. |

## Volgende Data Fases

| Onderdeel | Status | Uitleg |
| --- | --- | --- |
| Dataset versioning | Gepland | Lokale dataset stores met manifests en hashes. |
| Dataset statistics | Gepland | Aantal voorbeelden, velden, lege waarden, duplicaten en lengte-statistieken. |
| Token analysis | Gepland | Tokens per voorbeeld, context length checks en vocab usage. |
| Data augmentation | Gepland | Simpele veilige augmentaties zoals templates, prefix/suffix en field dropout. |
| Synthetic data | Gepland | Provider-onafhankelijke generator interface. |
| WebDataset | Gepland | Optionele integratie zonder verplichte dependency. |

## Advanced Speciale-Versie Fases

| Onderdeel | Status | Uitleg |
| --- | --- | --- |
| Distributed training | Later | DDP, FSDP, DeepSpeed en distributed checkpoints pas na de stabiele core. |
| Adapter training | Volgende fase | LoRA, QLoRA en PEFT workflows zijn nog niet onderdeel van de SFT core. |
| Advanced SFT workflows | Later | DPO, RLHF, GRPO, dashboards en benchmark suites blijven buiten de eerste SFT fase. |
| DPO/RLHF/GRPO | Later | Niet in de eerste datafase. |
| Hyperparameter search | Later | Geen search framework in de training core. |
| Benchmark suites | Later | MMLU, GSM8K, safety, bias, retrieval en multimodal evaluatie pas na Basic Evaluation. |
| Evaluation dashboards | Later | Geen leaderboards, dashboards of model comparison UI in Basic Evaluation. |
| Dashboards | Later | Lokale UI voor training, datasets en evaluatie. |
| Model serving | Later | Lokale serving helpers en mogelijk API-server. |
| Multimodal experiments | Later | Alleen als de core stabiel genoeg is. |
| Cloud/Kubernetes | Later | Alleen voor speciale/pro workflows. |
| Auth/billing/enterprise | Later | Niet voor de student-core, alleen als speciale versie dat nodig heeft. |

## Documentatie Regels

- Publieke docs schrijven we in simpel Nederlands.
- Code names blijven Engels.
- Foutmeldingen in code blijven Engels.
- Oude archiefdocs kunnen blijven bestaan, maar de actuele docs staan in `README.md` en `docs/`.
