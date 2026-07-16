# ArcLM Final Model Artifacts

This is the canonical format specification for Core Milestone 1 / Feature 3.
Final model artifacts are for evaluation, inference, sharing, export, or future
fine-tuning. They are not training checkpoints.

## Checkpoint Versus Artifact

| Format | Purpose | Contains optimizer state | Contains RNG state | Resume training |
| ------ | ------- | ------------------------ | ------------------ | --------------- |
| Training checkpoint | Continue an interrupted training run | Yes | Yes | Yes |
| Final model artifact | Load a trained model for evaluation or inference | No | No | No |

`Trainer.save_checkpoint()` remains the resume API.
`save_model_artifact()` is the final-model API.

## Public API

```python
from arclm.lifecycle import (
    ARTIFACT_FORMAT,
    ARTIFACT_VERSION,
    ArtifactError,
    LoadedModel,
    ModelArtifactManifest,
    inspect_model_artifact,
    load_model_artifact,
    save_model_artifact,
    validate_model_artifact,
)
```

Trainer convenience:

```python
trainer.save_model_artifact("outputs/final-model")
```

The canonical implementation lives in `arclm.lifecycle`, not in the trainer.

## Directory Layout

Current artifacts use:

```text
my-model/
├── manifest.json
├── model/
│   ├── config.json
│   └── weights.pt
├── tokenizer/
│   └── tokenizer.json
└── metadata/
    ├── training-summary.json
    └── evaluation-summary.json
```

Hugging Face artifacts may store the source-owned folder under:

```text
model/huggingface/
```

ArcLM does not rename Hugging Face `save_pretrained()` files.

## Format

```text
artifact_format = "arclm-model-artifact"
artifact_version = 1
manifest = "manifest.json"
```

Artifacts without a valid manifest are rejected. Unsupported future versions are
rejected. No destructive migration is attempted automatically.

## Manifest

Required top-level fields:

- `artifact_format`
- `artifact_version`
- `artifact_id`
- `created_at`
- `created_with`
- `model`
- `files`

Common optional fields:

- `tokenizer`
- `training`
- `evaluation`
- `provenance`
- `metadata`

The manifest is JSON-safe and contains no callables, executable Python code,
environment variables, credentials, absolute payload paths, optimizer state,
scheduler state, scaler state, RNG state, or dataset contents.

## File Inventory

Every payload file is listed with:

- relative path
- size in bytes
- SHA-256 hash
- optional semantic role

The manifest hash is not embedded inside itself. Validation rejects path
traversal, absolute payload paths, symlink payloads, missing files, size
mismatch, and hash mismatch.

Hashes detect accidental or unauthorized modification. They do not prove trusted
authorship and are not digital signatures.

## Source Support Matrix

| Model source | Save supported | Load supported | Self-contained | Reconstruction requirement |
| ------------ | -------------- | -------------- | -------------- | -------------------------- |
| Native ArcLM | Yes | Yes | Yes | Built-in `AutoModel.from_config()` |
| PyTorch module | Yes | Yes | Weights/config only | Caller supplies `model_factory` or `model` |
| PyTorch state dictionary | Via PyTorch module artifact | Via supplied model/factory | No architecture | Caller supplies reconstruction provider |
| Hugging Face local folder | Optional | Optional | Yes when local files are saved | `transformers` optional dependency |
| Hugging Face model ID | No final artifact by ID alone | No | No | Materialize local files first |

## Native ArcLM

Native ArcLM artifacts save:

- model config from real runtime values or provided config
- CPU state dictionary
- optional tokenizer
- optional training summary
- optional evaluation summary

Loading reconstructs the supported native causal language model from config and
then loads the state dictionary strictly by default.

## PyTorch Modules

ArcLM does not pickle arbitrary `torch.nn.Module` objects and does not store
Python import paths in the manifest.

Loading a generic PyTorch artifact requires:

```python
loaded = load_model_artifact(
    "artifact",
    model_factory=lambda config: MyModel(**config),
)
```

or:

```python
loaded = load_model_artifact("artifact", model=MyModel(...))
```

Inspection and validation do not require this factory.

## Hugging Face

Hugging Face final artifacts are optional. Inspection does not import
Transformers. Loading imports Transformers only when the artifact source type is
`huggingface_folder`.

Load behavior:

- `local_files_only=True`
- `trust_remote_code=False` by default
- no hidden internet request
- clear optional-dependency error when Transformers is missing

The default CPU baseline did not execute a real Hugging Face runtime round trip.

## Tokenizers

Tokenizers are optional.

Implemented tokenizer artifact support:

- ArcLM word tokenizer JSON
- ArcLM SentencePiece tokenizer JSON
- Hugging Face `save_pretrained()` tokenizer folders when available

Missing optional tokenizer files or unsupported tokenizer source types produce a
controlled artifact error.

## Atomic Save and Overwrite

Save process:

```text
validate destination
→ create sibling staging directory
→ write model config
→ write CPU weights
→ write tokenizer and summaries
→ compute file inventory
→ write manifest last
→ validate staged artifact
→ move staged directory into final location
```

Default overwrite policy is `overwrite=False`. Existing destinations are
rejected. With `overwrite=True`, ArcLM stages and validates the replacement
before replacing the previous artifact. Existing valid artifacts are preserved
when staging or validation fails.

## Inspection

`inspect_model_artifact(path, verify_integrity=False)` reads the manifest and
model config. It does not construct the model, import Transformers, load
tokenizers, initialize CUDA, mutate RNG state, or load optimizer state.

With `verify_integrity=True`, hashes and sizes are checked.

## Validation

`validate_model_artifact(path)` checks:

- artifact directory exists
- manifest exists and parses
- format and version
- safe relative paths
- no symlink payload files
- required config and weight files
- file sizes
- SHA-256 hashes
- tokenizer requirement
- source-type-specific fields

Validation does not construct the model.

## Loading

`load_model_artifact(path, device="cpu", precision="fp32")` validates the
artifact, loads weights on CPU first, reconstructs the model, applies requested
device and precision, and returns `LoadedModel`.

Supported device values:

- `auto`
- `cpu`
- `cuda`
- `cuda:<index>`

Explicit unavailable CUDA requests raise an error. No silent fallback is used.

Supported precision values:

- `fp32`
- `fp16`
- `bf16`

CPU FP16 loading is rejected. Quantization and device maps are not implemented.

## Security Boundary

ArcLM treats artifact directories as untrusted input. It rejects path traversal,
absolute paths, symlink payloads, malformed manifests, unsupported versions,
missing files, integrity mismatches, arbitrary imports, executable code, and
module pickles.

Model weights are loaded with restricted `weights_only=True` where the installed
PyTorch supports it. Artifact weights must be state-dictionary-like mappings of
string keys to tensors.

External files that are not valid ArcLM artifacts are outside this trust
contract.

## Runtime Evidence

CPU runtime flow passed:

```text
create native ArcLM model
→ train one tiny step
→ save final model artifact
→ inspect artifact
→ validate hashes
→ destroy runtime reference
→ load artifact on CPU
→ compare parameters
→ evaluate
→ run inference forward pass
```

Also verified:

- checkpoint is not accepted as final artifact
- final artifact is not accepted as training checkpoint
- artifact contains no optimizer, scheduler, scaler, or RNG state

## PEFT Adapter Artifacts

PEFT adapter artifacts are implemented separately from final model artifacts.
See [peft.md](peft.md) and [lora.md](lora.md).

```text
artifact_format = "arclm-peft-adapter"
artifact_version = 1
```

Adapter artifacts contain LoRA adapter weights and safe metadata only. They do
not contain the complete base model. A compatible base model must be supplied
when loading the adapter.

Fine-tuned LoRA models must be explicitly merged before saving as
`arclm-model-artifact` final model artifacts:

```python
result.save_model_artifact("final-model", config=model_config, merge_adapter=True)
```

Unmerged LoRA models are rejected by the fine-tuning result helper for final
model artifact saves, because native reconstruction would not know how to
recreate the temporary LoRA wrappers from a native model config alone.

## Known Limitations

- No digital signatures.
- No remote upload or registry.
- No Hugging Face Hub publishing.
- Tiny local Hugging Face artifact runtime is verified by Core Milestone 2 /
  Feature 4; broad Hugging Face architecture coverage remains pending.
- Core Milestone 2 / Feature 6 does not create, copy, or publish model
  artifacts automatically. Trial runs may reference artifacts through the
  existing run-manifest contract when user code creates them.
- GPU final-artifact portability remains pending, though CUDA Hugging Face
  forward and LoRA runtime are verified separately.
- No ONNX, GGUF, TensorRT, quantization, serving, or distributed model artifact
  format.

## Fine-Tuned Model Artifacts

Core Milestone 2 / Feature 1 connects fine-tuning results to this artifact
format. `FineTuningResult.save_model_artifact()` delegates to
`save_model_artifact()` and records safe fine-tuning metadata:

- fine-tuning mode
- fine-tuning config snapshot
- dataset report and fingerprint
- training loss/step summary
- optional evaluation metrics

It does not copy raw dataset records, optimizer state, scheduler state, scaler
state, or RNG state into the final artifact.
