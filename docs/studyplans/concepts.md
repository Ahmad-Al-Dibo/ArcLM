# Core Concepts for ArcLM Engineers

This guide explains the concepts engineers should understand before changing ArcLM core code.

## Product Architecture

ArcLM should keep one shared Python core:

```text
Python API
├── CLI
├── Web UI
├── Configuration files
└── Future plugins
```

The CLI and Web UI should call core APIs. They should not duplicate training, data, evaluation, inference, or distributed logic.

## Model Lifecycle

The lifecycle is:

```text
model source
-> configuration
-> runtime model
-> training
-> checkpoint
-> final artifact
-> evaluation
-> inference
```

Important boundaries:

- A training checkpoint continues an interrupted training run.
- A final model artifact is for evaluation, inference, sharing, export, or future fine-tuning.
- A state dictionary stores tensor weights, not arbitrary Python architecture code.
- Arbitrary PyTorch modules need an explicit reconstruction factory.
- Hugging Face local folders are optional integration artifacts, not a reason to require Transformers at root import time.

## Configuration

Good configuration is:

- Typed.
- Validated.
- JSON/YAML friendly where supported.
- Version-aware where needed.
- Free of secrets.
- Reproducible.
- Backward-compatible when public.

Bad configuration hides Python objects, callbacks, open files, arbitrary callables, or environment-specific paths.

## Checkpoints

A training checkpoint may contain:

- Model state.
- Optimizer state.
- Scheduler state.
- Gradient scaler state.
- Training state.
- RNG state.
- Reproducibility metadata.

A final model artifact should not contain optimizer, scheduler, active trainer, or RNG state required only for resume.

## Tokenizers

Tokenizer behavior matters because model weights alone are often not enough for inference.

Check:

- Vocabulary files.
- Special tokens.
- Padding and truncation behavior.
- Local-only loading.
- Optional dependency boundaries.
- No hidden downloads.

## Evaluation

Evaluation should prove:

- Gradients are disabled.
- Model mode is restored.
- Metrics are numerically correct.
- Batch shapes are documented.
- Custom metrics do not leak private records.

## Inference

Inference should prove:

- The model is on the requested device.
- No gradients are created.
- Tokenizer behavior is correct where required.
- Output shape or generated text is valid.
- No hidden network request occurs.

## Distributed Runtime

Key terms:

- `rank`: global worker index.
- `world_size`: total number of workers.
- `local_rank`: worker index on the current machine.
- `process group`: communication group used by distributed collectives.
- `backend`: communication backend, such as Gloo or NCCL.
- `DDP`: DistributedDataParallel, one process per device in normal GPU training.
- `FSDP`: Fully Sharded Data Parallel, shards parameters and optimizer state.
- `rank zero`: the process that usually writes logs, checkpoints, and artifacts.

Important rules:

- CPU process-group tests do not prove multi-GPU runtime.
- One GPU does not prove two-GPU DDP.
- Simulated CUDA does not prove CUDA runtime.
- Cloud validation must be recorded separately from local validation.

## Hardware Validation

Use capability checks instead of GPU-name assumptions:

```python
torch.cuda.is_available()
torch.cuda.device_count()
torch.cuda.get_device_capability(device)
torch.cuda.is_bf16_supported()
```

Status wording should be evidence-based:

- `Implemented and verified`
- `Implemented but pending cloud runtime validation`
- `Blocked by hardware`
- `Planned`
- `Not implemented`

Do not describe BF16, DDP, FSDP, or FlashAttention as locally verified unless the required hardware actually ran the tests.

## Optional Dependencies

Root imports must stay lightweight:

```python
import arclm
```

Optional dependencies should fail only when their feature is used, with a clear message.

Examples:

- Transformers is optional for Hugging Face integrations.
- FastAPI and Uvicorn are optional for the modern web backend.
- PEFT, bitsandbytes, and Accelerate should not become core requirements without approval.

## Data Pipeline

Data work should preserve:

- Safe dataset IDs.
- Deterministic transforms where expected.
- Provenance.
- Manifest support.
- No arbitrary file access.
- No path leakage through public catalogue endpoints.
- Clear separation between Python data pipeline and paused Web Data Pipeline Studio.

## Security Boundaries

Treat these as untrusted input:

- Artifact directories.
- Dataset paths.
- Config files.
- Checkpoints from outside the current project.
- Frontend request payloads.
- Environment strings.

Avoid:

- `eval`
- `exec`
- arbitrary import strings
- pickled model objects
- hidden network calls
- absolute private path exposure
- environment-variable leakage

## Compatibility

Public APIs should not be renamed or removed casually.

When changing a public API:

- Preserve old import paths where practical.
- Add compatibility tests.
- Document recommended and legacy imports.
- Avoid root exports for internal helpers.
- Keep `import arclm` free of optional dependency failures.

