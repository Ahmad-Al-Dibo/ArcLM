# Research extension examples

Examples aimed at **researchers** who want to customize ArcLM by
**subclassing public contracts** and orchestrating workflows with
**public `arclm.*` APIs only** (no `import torch` in application files
where avoidable).

| Example | What it shows | Torch in app file |
|---|---|---|
| `01_custom_trainer.py` | Subclass `BaseTrainer` | No (library-side only) |
| `02_custom_pipeline.py` | Subclass `BaseTrainingPipeline` | No |
| `03_custom_callback.py` | Subclass `BaseCallback` + `Trainer` callbacks | No |
| `04_custom_data_step.py` | Subclass `BaseDataStep` + `DataPipeline` | No (core only) |
| `05_custom_tokenizer.py` | Subclass `Tokenizer` + `TokenizerFactory` | No (core only) |
| `06_research_workflow.py` | End-to-end: config + tracking + `train_model` + eval | No |

## Run

```bash
pip install "arclm[train]"   # for 01–03, 06
pip install arclm            # for 04–05

python examples/13_research_extension/01_custom_trainer.py
python examples/13_research_extension/06_research_workflow.py
```

## Research extension points (public)

| Contract | Module | Use for |
|---|---|---|
| `BaseTrainer` | `arclm.training` | Custom train/step loops |
| `BaseTrainingPipeline` | `arclm.training` | Build/train/save orchestration |
| `BaseCallback` | `arclm.training` | Early stop, logging, gates |
| `BaseDataStep` | `arclm.datasets` | Corpus filters |
| `Tokenizer` + `TokenizerFactory` | `arclm.tokenizers` | Domain tokenization |
| `TrainingConfig` | `arclm.training` | Validated hyperparameters |
| `Trainer(model, config, callbacks=…, train_dataset=Dataset)` then `.train()` | `arclm.training` | Stock training with custom callbacks |
| `train_model` | `arclm.training` | One-call baseline training |
| `AutoModel` | `arclm.models` | Model from config |

Prefer these contracts over forking internal files. See also
`docs/guide.md` and `CODEBASE_GUIDE.md`.
