# ArcLM API Design Plan

## Public API Principles

- Use simple domain imports.
- Keep optional dependencies optional.
- Keep backward-compatible aliases until a migration plan removes them.
- Prefer direct classes and functions over large managers.
- Do not add a public name before runtime behavior is tested.

## Recommended Imports

```python
from arclm.datasets import load_dataset, DataPipeline
from arclm.training import Trainer, TrainingConfig
from arclm.evaluation import Evaluator, EvaluationConfig, Accuracy, Perplexity
from arclm.finetuning import SFTTrainer, SFTConfig, ModelAdapter, TokenizerAdapter
from arclm.inference import load_model, predict, TextGenerator
from arclm.checkpoints import SmartLoader
```

## Web API Boundary

The modern Web Experience should expose a thin optional local API around the
same public Python APIs listed above. It should not duplicate training,
evaluation, inference, dataset, or checkpoint logic.

Initial Web Milestone 1 endpoints are limited to local status data:

```text
GET /api/health
GET /api/environment
GET /api/capabilities
GET /api/project/status
```

The legacy Flask simple interface remains available through
`run_simple_interface` until a migration is approved. New web code should keep
`import arclm` lightweight and must not require web dependencies at root import
time.

## Model Contracts

Native ArcLM models:

- Provide normal PyTorch module behavior.
- Support ArcLM checkpoints and local inference.

Standard PyTorch models:

- Must support `.train()`, `.eval()`, `.to(device)`, `parameters()`, and `state_dict()`.
- For training/evaluation, should return loss/logits or be wrapped by an adapter.

Hugging Face models:

- Must stay optional behind Transformers.
- Need real local runtime tests before stable family claims.

Custom external models:

- Use `ModelAdapter` for input/output key mapping.
- Need explicit save/load behavior if normal `state_dict()` is not enough.

Non-PyTorch models:

- Not supported yet.
- Future support should use explicit runtime adapters.

## Tokenizer Contracts

- Native tokenizers should support encode/decode/save/load.
- Custom tokenizers can be wrapped by `TokenizerAdapter`.
- Chat templates should be explicit and tested with real tokenizer objects.

## Error Behavior

- Error messages stay in English.
- Optional dependency errors should say which package to install and which feature needs it.
- Public APIs should raise clear errors for unsupported model outputs, missing labels, invalid config, unsupported devices, and missing files.

## Compatibility Risks

- `TrainingConfig` has two meanings: `arclm.training.TrainingConfig` and `arclm.configs.TrainingConfig`.
- `ModelAdapter` exists in training and finetuning with different roles.
- Deprecated modules are still public compatibility paths.
- Future work should document migrations before changing imports.
## Data Pipeline Studio API Direction

Status: Web Milestone 2 / Feature 2 implements the first read-only Data
Pipeline Studio backend endpoints.

The browser should call the local ArcLM Web API and that API should reuse
existing ArcLM dataset functions. It must not shell out to `arclm` commands or
parse terminal text.

Implemented backend APIs:

```text
GET /api/datasets
GET /api/datasets/{dataset_id}/inspection
```

These endpoints are read-only and bounded:

- server-configured dataset roots only
- safe dataset IDs only
- TXT, JSON, JSONL, and CSV inspection
- sample rows and field metadata
- parse warnings
- no upload
- no arbitrary path access
- no pipeline execution
- no training handoff

The longer API plan lives in [../web/data-pipeline-api.md](../web/data-pipeline-api.md).
