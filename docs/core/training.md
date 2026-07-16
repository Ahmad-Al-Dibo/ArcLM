# Training Core Audit

The Training Core is implemented and runtime-verified for the single-device
local workflow.

Evidence:

- Implementation: `src/arclm/training/trainer.py`
- Config/state: `TrainingConfig`, `TrainingState`
- Precision: `PrecisionHelper`
- Tests: `tests/unit/training`, `tests/smoke/test_single_device_training.py`,
  `tests/gpu`
- Current focused CPU result: `113 passed, 2 skipped` across training,
  evaluation, fine-tuning, datasets, and smoke tests

Implemented and verified:

- CPU FP32 training
- Gradient accumulation
- Final partial accumulation group
- Gradient clipping
- Optimizers and schedulers
- Callbacks
- Automatic checkpoints
- Checkpoint retention
- Resume with new trainer objects
- Versioned checkpoint metadata
- Python, NumPy, PyTorch CPU, and CUDA RNG state capture where available
- CPU epoch-boundary deterministic resume
- Atomic checkpoint writes and partial-write cleanup

Hardware-sensitive:

- CUDA FP32/FP16 were previously verified in `.venv-gpu-validation`.
- CUDA tests skip correctly in the CPU baseline.
- Multi-GPU, DDP, and FSDP are not implemented or runtime-verified.

Main limitations:

- The trainer is model-agnostic for common PyTorch contracts, but batch and
  output handling still assumes common keys such as `input_ids`, `labels`,
  `loss`, and `logits`.
- Task-specific workflows such as text classification, token classification,
  sequence-to-sequence training, DDP, and FSDP need separate milestones.
- Mid-epoch dataloader position is not restored yet. The verified
  reproducibility guarantee is epoch-boundary resume for the current
  single-device CPU path.

## Fine-Tuning Integration

Core Milestone 2 / Feature 1 adds a stable full fine-tuning and SFT workflow on
top of this Training Core. `fine_tune()` prepares records into tokenized
features, then delegates optimization, gradient accumulation, clipping,
scheduler stepping, evaluation, checkpointing, and resume to `Trainer`.

Core Milestone 2 / Feature 2 adds built-in LoRA before the `Trainer` is created.
The optimizer helper now filters to trainable parameters, so frozen base
parameters are not optimized during PEFT runs.

No second native training loop was added. QLoRA, DDP, FSDP, serving, and Web
training controls remain outside this feature.

Core Milestone 2 / Feature 5 adds `RunTrackingCallback` for recording training
metadata, step metrics, evaluation metrics, checkpoint references, and explicit
failure/interruption hooks into a local run manifest. The callback does not add
a second training loop.

## Hyperparameter Search Integration

Core Milestone 2 / Feature 6 adds local sequential hyperparameter search above
the existing `Trainer`. Search trial runners create fresh models and
optimizers per trial and call the normal training/evaluation APIs. Search does
not add a second training loop. See
[hyperparameter-search.md](hyperparameter-search.md).
