# ArcLM Training Checkpoints

This is the canonical checkpoint specification for Core Milestone 1 / Feature 2.
It describes training checkpoints, not final model artifacts.

Final model artifacts were added in Core Milestone 1 / Feature 3 and are
documented separately in [model-artifacts.md](model-artifacts.md). A checkpoint
is for resuming training. A final artifact is for evaluation, inference,
sharing, export, or future fine-tuning.

## Public API

```python
from arclm.checkpoints import (
    CheckpointInfo,
    inspect_checkpoint,
    validate_checkpoint,
)
```

`Trainer.save_checkpoint()` and `Trainer.load_checkpoint()` remain the primary
save and resume APIs. The inspection APIs are for safe metadata review within
the documented PyTorch trust boundary.

## Format

Current training checkpoints use:

```text
checkpoint_format = "arclm-training-checkpoint"
checkpoint_version = 1
```

Existing unversioned ArcLM checkpoints are treated as legacy checkpoints. They
can still be inspected and loaded when the known legacy fields are present.
Future checkpoint versions are rejected with a controlled `CheckpointError`.

## Required Fields

Current checkpoints include:

- `checkpoint_format`
- `checkpoint_version`
- `training_state_version`
- `model_state_dict`
- `optimizer_state_dict`
- `scheduler_state_dict`
- `scaler_state_dict`
- `rng_state`
- `training_state`
- `config`
- `current_epoch`
- `current_batch`
- `global_step`
- `optimizer_step`
- `train_history`
- `lifecycle_metadata`
- `checkpoint_metadata`
- compatibility `metadata`

Legacy checkpoints may omit the format, version, RNG state, and structured
metadata.

## Metadata

`checkpoint_metadata` is JSON-friendly and contains:

- checkpoint identity and version
- ArcLM, Python-adjacent runtime, and PyTorch version information
- created timestamp
- epoch, batch, global step, and optimizer step
- precision and resolved device string
- optimizer and scheduler type names
- gradient accumulation and clipping settings
- training-state snapshot
- training-config snapshot
- small dataset provenance summary such as dataset type, length, batch size,
  shuffle flag, dataloader length, and worker count
- lifecycle metadata from `arclm.lifecycle`

Metadata intentionally excludes environment variables, API keys, access tokens,
dataset contents, callbacks, callables, raw model credentials, and unrelated
private paths.

## RNG State

ArcLM stores supported RNG state for resume:

- Python `random`
- NumPy, when available, converted to primitive-safe values
- PyTorch CPU RNG
- PyTorch CUDA RNG for visible CUDA devices when saving from CUDA

Inspection does not restore or mutate RNG state. `Trainer.load_checkpoint()`
restores RNG state as part of resume. CUDA RNG state is retained in the payload
but restored only when the target runtime is CUDA-capable.

Reproducibility guarantee:

```text
ArcLM restores supported random-number generator state. Exact numerical
reproducibility can still depend on hardware, kernels, library versions,
data ordering, and deterministic algorithm settings.
```

The current CPU runtime test verifies epoch-boundary deterministic resume.
Mid-epoch dataloader position is not claimed as restored.

## Atomic Writes

Checkpoint saving writes to a temporary file in the target directory, validates
the temporary payload, then replaces the final file with `os.replace()`. If
writing fails, the existing checkpoint remains intact and temporary files are
removed.

Checkpoint directories still use the existing naming contract:

```text
checkpoint-{global_step}/training.pt
```

Old checkpoint filenames are not renamed.

## Retention

`keep_last_checkpoints` keeps the newest automatic checkpoint directories by
numeric step. Retention runs only after a new checkpoint has been successfully
written. Unrelated files are preserved, temporary files are ignored, and
retention can be disabled with `None` or `0`.

## Inspection and Validation

`inspect_checkpoint(path)` returns `CheckpointInfo` and loads the checkpoint on
CPU. It creates no model, optimizer, scheduler, trainer, or CUDA runtime state.
`validate_checkpoint(path)` performs bounded structural checks and returns the
same typed info when the payload is acceptable.

Validation checks:

- file exists, is regular, and is non-empty
- top-level payload is a dictionary
- format and version for current checkpoints
- required model and optimizer state
- metadata dictionary type
- training-state dictionary type
- unsupported future versions
- legacy checkpoint shape

No checksum or digital signature is implemented in this feature. Integrity
validation detects malformed and incomplete checkpoint shapes, not malicious
tampering.

## Trust Boundary

PyTorch training checkpoints may contain pickle-based state and should only be
loaded from trusted sources. ArcLM uses trusted full-state loading for training
resume because optimizer, scheduler, scaler, RNG, and training state must be
restored. Do not treat arbitrary internet `.pt` files as safe.

Final model artifacts use a separate manifest directory format and restricted
state-dictionary loading where supported. Training checkpoints remain trusted
PyTorch full-state files because they restore optimizer, scheduler, scaler, RNG,
and trainer state.

## Cross-Device and Precision

CPU inspection uses `map_location="cpu"`. CUDA-created checkpoints can be
inspected on CPU when PyTorch can deserialize the payload. Loading for resume
uses the trainer's resolved device. ArcLM records precision metadata and stores
scaler state only when the precision helper has an active scaler.

CPU validation covers FP32 and BF16 CPU precision paths. CUDA FP32, FP16,
BF16 correctness, and checkpoint resume remain covered by the GPU test suite
when `.venv-gpu-validation` is used.

## Existing Checkpoint Inventory

| Path | Writer | Loader | Used by | Resume capable | Format |
| ---- | ------ | ------ | ------- | -------------- | ------ |
| `checkpoint-{step}/training.pt` | `Trainer.save_checkpoint()` | `Trainer.load_checkpoint()` | Training Core, FullFineTuner/SFT wrappers | Yes | Versioned ArcLM training checkpoint |
| `Config.model_path` file | `Trainer.save()` | `Trainer.load()` and compatibility loaders | Legacy quickstart/CLI paths | Yes | Versioned payload with legacy-compatible fields |
| Native ArcLM model checkpoint | legacy `train_model`/`save_training_checkpoint` paths | `SmartLoader`, `ArcLMCheckpointLoader` | Inference/fine-tuning adapters | Partial | Legacy-compatible ArcLM checkpoint |
| Raw state dict | user/adapter save helpers | `StateDictLoader` | External adaptation | No training resume | Weights/state dict only |

Known limitations:

- Mid-epoch dataloader position is not restored.
- Callback state is not serialized because callbacks have no approved safe
  state contract.
- No checksum/signature is implemented.
- Broader external-model checkpoint matrices remain future work.

## Fine-Tuning Checkpoints

Core Milestone 2 / Feature 1 reuses the same versioned training checkpoint
format for full fine-tuning and SFT. Fine-tuning checkpoints are for resume
only. They may include optimizer, scheduler, scaler, RNG, and trainer state.

Final fine-tuned models must be saved as model artifacts through
`FineTuningResult.save_model_artifact()` or `FullFineTuner.save_model_artifact()`.
Those final artifacts intentionally exclude optimizer, scheduler, scaler, and
RNG state.

## PEFT Checkpoints

Core Milestone 2 / Feature 2 keeps PEFT resume inside the existing training
checkpoint format. A LoRA run must reapply the same `LoRAConfig` before loading
a checkpoint into a new model/trainer, after which `Trainer.load_checkpoint()`
restores model state, optimizer state, scheduler/scaler state, RNG state, and
training counters.

Adapter artifacts are separate. They save only LoRA adapter tensors and cannot
resume training by themselves.
