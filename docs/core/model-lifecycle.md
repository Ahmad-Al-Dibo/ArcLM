# Model Lifecycle Audit

Current lifecycle support now has a small shared contract in `arclm.lifecycle`.
It does not replace the existing training, checkpoint, or inference code; it
gives those systems one JSON-friendly metadata shape to share.

Implemented public API:

```python
from arclm.lifecycle import (
    ARTIFACT_FORMAT,
    ARTIFACT_VERSION,
    LoadedModel,
    ModelArtifactInfo,
    ModelArtifactManifest,
    ModelSource,
    TokenizerInfo,
    inspect_model_artifact,
    load_model_artifact,
    load_model_config,
    save_model_artifact,
    save_artifact_manifest,
    validate_model_artifact,
    load_artifact_manifest,
)
```

Implemented contract:

- model source types: native checkpoint, state dict, Hugging Face folder,
  Hugging Face ID, PyTorch module, unknown
- artifact kinds: training checkpoint, inference artifact, state dict,
  Hugging Face model, PyTorch module, unknown
- JSON-safe tokenizer metadata
- JSON-safe model artifact metadata
- manifest file name: `arclm-artifact.json`
- training checkpoints now include `lifecycle_metadata`
- legacy checkpoints without lifecycle metadata can still be inspected
- `Config.load_config_from_model()` now loads model config from a supported
  model source instead of being a placeholder

Example:

```python
from arclm.lifecycle import inspect_model_artifact

info = inspect_model_artifact("outputs/checkpoint-4/training.pt")
print(info.artifact_kind)
print(info.model_config)
```

Still intentionally out of scope for Core Milestone 1:

- LoRA/PEFT
- QLoRA
- DDP/FSDP
- export formats
- model serving
- new native architecture families
- remote downloads

Core Milestone 1 / Feature 2 strengthened training checkpoints with a versioned
training-checkpoint format, `CheckpointInfo`, `inspect_checkpoint()`,
`validate_checkpoint()`, structured checkpoint metadata, RNG state, atomic
writes, legacy validation, and epoch-boundary deterministic resume tests.

Core Milestone 1 / Feature 3 added final model artifacts. These artifacts use
`artifact_format="arclm-model-artifact"` and `artifact_version=1`, live in a
directory with `manifest.json`, store model config, portable CPU weights,
optional tokenizer files, summaries, safe provenance, a file inventory, and
SHA-256 hashes. They exclude optimizer, scheduler, scaler, RNG, and active
training state. See [model-artifacts.md](model-artifacts.md) for the canonical
format.

Verified runtime flow:

```text
native ArcLM model
→ tiny training step
→ save final artifact
→ inspect and validate hashes
→ load on CPU
→ compare parameters
→ evaluate
→ run inference forward pass
```

Core Milestone 2 / Feature 4 verifies tiny local Hugging Face artifact,
fine-tuning, evaluation, and LoRA adapter flows. See
[runtime-validation-matrix.md](runtime-validation-matrix.md).

Remaining lifecycle limitations:

- Training checkpoints still require trusted PyTorch loading for full-state
  resume; arbitrary internet `.pt` files are not safe inputs.
- Broad Hugging Face architecture coverage remains optional and incomplete.
- GPU artifact portability was not executed during Feature 3.
- QLoRA is implemented as a PEFT boundary, but final model artifact integration
  for real quantized runtimes is pending. Export artifacts and digital
  signatures are not implemented.

## Fine-Tuning Lifecycle

Core Milestone 2 / Feature 1 connects fine-tuning to this lifecycle:

```text
runtime model
-> prepare_fine_tuning_dataset
-> fine_tune
-> checkpoint for resume
-> final model artifact for evaluation and inference
```

The stable native CPU flow verifies artifact reload after SFT and inference
after reload. Feature 4 adds tiny Hugging Face CPU runtime and GTX 1050 Ti LoRA
runtime validation. Broad Hugging Face, QLoRA bitsandbytes, and multi-GPU
runtime validation remain separate optional gates.

## PEFT Lifecycle

Core Milestone 2 / Feature 2 adds LoRA adapter artifacts beside the existing
checkpoint and final model artifact lifecycle:

```text
runtime base model
-> apply LoRA
-> train through Trainer
-> checkpoint for resume
-> adapter artifact for reusing the adapter
-> optional merged final model artifact for evaluation and inference
```

Adapter artifacts use `artifact_format="arclm-peft-adapter"` and do not contain
the complete base model. Loading requires a compatible base model supplied by
the caller.

## Run Manifest Link

Core Milestone 2 / Feature 5 connects lifecycle outputs to local run manifests.

Core Milestone 2 / Feature 6 connects repeated lifecycle runs through local
search manifests. Search references trial runs and best effective configs; it
does not load, copy, publish, or mutate model artifacts automatically.
Run manifests can reference training checkpoints, PEFT adapter artifacts, and
final model artifacts without copying those payloads or exposing absolute paths.
