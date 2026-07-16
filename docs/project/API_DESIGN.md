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
from arclm.checkpoints import SmartLoader, inspect_checkpoint, validate_checkpoint
from arclm.lifecycle import save_model_artifact, load_model_artifact
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

## Core Model Lifecycle Contract

Core Milestone 1 / Feature 1 added `arclm.lifecycle`.

Public API:

```python
from arclm.lifecycle import (
    ModelArtifactInfo,
    ModelSource,
    TokenizerInfo,
    inspect_model_artifact,
    load_model_config,
)
```

The contract defines:

- model source types
- model artifact kinds
- model configuration metadata
- tokenizer source and metadata
- training checkpoint versus inference artifact
- JSON-safe manifest helpers
- compatibility behavior for current and legacy checkpoints

Core Milestone 1 / Feature 2 added the training-checkpoint inspection API:

```python
from arclm.checkpoints import CheckpointInfo, inspect_checkpoint, validate_checkpoint
```

Training checkpoints use `checkpoint_format="arclm-training-checkpoint"` and
`checkpoint_version=1`. They are trusted PyTorch full-state files for resume,
not final model artifacts for distribution.

Core Milestone 1 / Feature 3 added the final model artifact API:

```python
from arclm.lifecycle import (
    ARTIFACT_FORMAT,
    ARTIFACT_VERSION,
    LoadedModel,
    ModelArtifactManifest,
    inspect_model_artifact,
    load_model_artifact,
    save_model_artifact,
    validate_model_artifact,
)
```

Final model artifacts use `artifact_format="arclm-model-artifact"` and
`artifact_version=1`. They are directory artifacts for evaluation, inference,
sharing, export, or future fine-tuning. They must not contain optimizer,
scheduler, scaler, RNG, or active trainer state.

Generic PyTorch artifacts require a caller-supplied `model_factory` or model
object at load time. ArcLM does not pickle arbitrary modules and does not store
Python import paths in artifact manifests.
## Data Pipeline Studio API Direction

Status: Web Milestone 2 / Feature 4 implements the first read-only Data
Pipeline Studio inspection endpoints plus local dataset source management.

The browser should call the local ArcLM Web API and that API should reuse
existing ArcLM dataset functions. It must not shell out to `arclm` commands or
parse terminal text.

Implemented backend APIs:

```text
GET /api/datasets
GET /api/datasets/{dataset_id}/inspection
GET /api/dataset-roots
POST /api/dataset-roots
PATCH /api/dataset-roots/{root_id}
DELETE /api/dataset-roots/{root_id}
POST /api/dataset-roots/{root_id}/validate
POST /api/datasets/refresh
```

The inspection endpoints are read-only and bounded:

- server-configured dataset roots only
- safe dataset IDs only
- TXT, JSON, JSONL, and CSV inspection
- sample rows and field metadata
- parse warnings
- no upload
- no arbitrary path access
- no pipeline execution
- no training handoff

The dataset-root endpoints are local administrative endpoints:

- require loopback server binding for mutation
- reject unknown origins
- validate paths before saving
- store root configuration in local JSON
- never delete dataset folders or files
- keep root paths out of normal catalogue and inspection responses

The longer API plan lives in [../web/data-pipeline-api.md](../web/data-pipeline-api.md).

## Fine-Tuning API

Core Milestone 2 / Feature 1 adds the stable Python-first fine-tuning API:

```python
from arclm.finetuning import (
    FineTuningConfig,
    FineTuningMode,
    FineTuningResult,
    fine_tune,
    prepare_fine_tuning_dataset,
)
```

The API reuses `TrainingConfig`, `Trainer`, `Evaluator`, checkpoints, and model
artifacts. It does not add a second training engine. Existing `SFTConfig`,
`FullFineTuner`, `SFTTrainer`, and deprecated `arclm.sft` compatibility imports
remain available.

## PEFT API

Core Milestone 2 / Feature 2 adds a small PEFT domain API:

```python
from arclm.peft import (
    PeftMethod,
    LoRAConfig,
    inspect_lora_targets,
    apply_lora,
    save_adapter_artifact,
    inspect_adapter_artifact,
    validate_adapter_artifact,
    load_adapter_artifact,
)
```

The recommended fine-tuning entry point is:

```python
fine_tune(..., peft_config=LoRAConfig(...))
```

Built-in LoRA does not require the external `peft` package. Adapter artifacts
use `artifact_format="arclm-peft-adapter"` and are separate from training
checkpoints and final model artifacts. A compatible base model must be supplied
when loading an adapter.
