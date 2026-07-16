# Recommended Core Roadmap

This roadmap is a recommendation from the Core re-baseline. It does not approve
implementation automatically.

## Proposed Sequence

1. Core Milestone 1: Model Lifecycle and Configuration Foundation
2. Core Milestone 2: Full Fine-Tuning and SFT Stabilization
3. Core Milestone 3: LoRA and General PEFT Foundation
4. Core Milestone 4: QLoRA
5. Core Milestone 5: Experiment Tracking and Reproducibility
6. Core Milestone 6: Inference, Batch Generation, and Streaming
7. Core Milestone 7: DDP and Multi-GPU
8. Core Milestone 8: FSDP
9. Core Milestone 9: Architecture Registry and Native Architecture Expansion
10. Core Milestone 10: Model Serving and Optimization

## Completed Core Features

```text
Core Milestone 1 / Feature 1:
Model Lifecycle and Configuration Contract
```

Implemented:

- `arclm.lifecycle`
- source/artifact metadata classes
- JSON manifest helpers
- checkpoint lifecycle metadata
- config loading from model sources
- full-suite verification after Dataset Inspector test isolation was restored

```text
Core Milestone 1 / Feature 2:
Checkpoint Hardening and Reproducibility Metadata
```

Implemented:

- `CheckpointInfo`
- `inspect_checkpoint()`
- `validate_checkpoint()`
- `checkpoint_format = "arclm-training-checkpoint"`
- `checkpoint_version = 1`
- structured checkpoint metadata
- config snapshot and small dataset provenance summary
- Python, NumPy, PyTorch CPU, and CUDA RNG state capture
- RNG restore on `Trainer.load_checkpoint()`
- atomic save validation and cleanup
- legacy unversioned checkpoint compatibility
- CPU epoch-boundary deterministic resume test

```text
Core Milestone 1 / Feature 3:
Final Model Artifact Save and Load
```

Implemented:

- `artifact_format = "arclm-model-artifact"`
- `artifact_version = 1`
- canonical `manifest.json` artifact directory
- model config persistence
- portable CPU state-dictionary weights
- optional tokenizer persistence
- training and evaluation summaries
- safe provenance
- file inventory and SHA-256 hashes
- staged artifact save and overwrite policy
- artifact inspection without model construction
- artifact validation without model loading
- native ArcLM reconstruction
- PyTorch factory/model reconstruction boundary
- optional Hugging Face folder boundary
- CPU evaluation and inference-forward runtime tests
- checkpoint/artifact separation tests

```text
Core Milestone 2 / Feature 1:
Full Fine-Tuning and SFT Stabilization
```

Implemented:

- `FineTuningMode`
- `FineTuningConfig`
- `FineTuningDatasetReport`
- `PreparedFineTuningDataset`
- `FineTuningResult`
- `prepare_fine_tuning_dataset()`
- `fine_tune()`
- stable SFT tokenization output with `input_ids`, `attention_mask`, and `labels`
- prompt masking through segment-level tokenization
- chat assistant masking for the stable workflow
- deterministic dataset fingerprint and bounded validation report
- native CPU full-parameter SFT runtime
- checkpoint/resume with new runtime objects
- final artifact save, validation, reload, evaluation, and inference after reload

```text
Core Milestone 2 / Feature 2:
LoRA and General PEFT Foundation
```

Implemented:

- `arclm.peft`
- `PeftMethod`, `PeftConfig`, and `LoRAConfig`
- built-in `LoRALinear`
- dry target inspection by suffix, leaf, or full path
- transactional LoRA injection
- base-parameter freezing by default
- trainable parameter reporting
- `fine_tune(..., peft_config=...)`
- adapter-only state extraction/loading
- adapter artifacts with `artifact_format = "arclm-peft-adapter"`
- adapter manifest, file inventory, and SHA-256 validation
- adapter inspection and validation without model construction
- adapter loading onto a compatible clean base model
- merge, unmerge, and unload-to-plain-linear helpers
- explicit merged final model artifact workflow
- CPU native fine-tuning, checkpoint/resume, adapter reload, evaluation, and
  inference runtime tests

## Core Milestone 2 / Feature 3

```text
Core Milestone 2 / Feature 3:
QLoRA and Quantized Fine-Tuning Foundation
```

Implemented:

- `PeftMethod.QLORA`
- `QuantizationBackend`
- `QuantizationConfig`
- `QLoRAConfig`
- bitsandbytes 4-bit backend boundary through lazy Transformers
  `BitsAndBytesConfig`
- `inspect_quantization_capabilities`
- explicit local-folder 4-bit model loading boundary
- quantized-base validation before adapter injection
- QLoRA adapter artifact metadata with the existing PEFT artifact format
- full-precision adapter reload and merge path
- rejection of direct merge from quantized runtime models

Verified:

- configuration round trip
- optional dependency boundary
- CUDA capability reporting through mocked local capability checks
- quantized-module fixture preparation and base freezing
- ordinary LoRA regression
- adapter artifact inspection/validation/load
- public API import

Not verified:

- real bitsandbytes 4-bit model loading
- real GPU QLoRA training
- QLoRA checkpoint/resume on real quantized models
- QLoRA adapter artifact reload from a real quantized runtime

## Core Milestone 2 / Feature 4

```text
Core Milestone 2 / Feature 4:
Hugging Face and QLoRA Runtime Validation Matrix
```

Implemented:

- bounded runtime environment reports for CPU and CUDA validation
- local tiny Hugging Face model artifact save/load runtime
- local tiny Hugging Face full fine-tuning checkpoint/resume runtime
- local tiny Hugging Face built-in LoRA adapter reload/merge runtime
- CUDA Hugging Face forward runtime on GTX 1050 Ti
- CUDA built-in LoRA training step on GTX 1050 Ti
- optional bitsandbytes QLoRA runtime gate with strict skip conditions
- CPU regression for CUDA RNG restore normalization

Verified:

- `tests/integration/test_huggingface_runtime_validation.py`: `4 passed`
- `tests/quantization`: `2 passed, 1 skipped`
- `.venv-gpu-validation` CUDA suite with `PYTHONPATH=src`: `10 passed`
- full CPU suite: `326 passed, 13 skipped, 4 warnings`

Not verified:

- real bitsandbytes 4-bit loading
- real QLoRA forward/backward/optimizer step
- QLoRA checkpoint/resume on a real quantized model
- multi-GPU QLoRA

The canonical matrix is [runtime-validation-matrix.md](runtime-validation-matrix.md).

## Next Recommended Implementation Feature

```text
Core Milestone 2 / Feature 5:
Experiment Tracking and Reproducible Run Manifests
```

Implemented:

- `arclm.tracking`
- local run manifest format `arclm-experiment-run` version 1
- `RunConfig`, `RunManifest`, `RunInfo`, `RunStatus`, `RunTracker`
- `create_run`, `inspect_run`, `validate_run`, `list_runs`, `compare_runs`
- config, model, tokenizer, dataset, PEFT, QLoRA, metric, event, checkpoint,
  adapter, and model-artifact recording
- run lock file for single local writer
- append-only metrics and events
- bounded environment and reproducibility summaries
- `RunTrackingCallback`
- compatibility wrapper for legacy `ExperimentTracker`

Verified:

- `tests/tracking`: `8 passed`
- full CPU suite: `335 passed, 13 skipped, 4 warnings`
- compileall, wheel build, and paused frontend regression passed

Not implemented:

- external tracking-service stability claims
- hyperparameter search
- distributed run aggregation
- remote run storage

```text
Core Milestone 2 / Feature 6:
Hyperparameter Search Foundation
```

Implemented:

- `arclm.search`
- local search manifest format `arclm-hyperparameter-search` version 1
- `SearchStrategy`, `SearchStatus`, and `TrialStatus`
- `ChoiceParameter`, `IntegerParameter`, and `FloatParameter`
- allowlisted search paths for training, fine-tuning, and LoRA configs
- deterministic grid and random trial generation
- `ObjectiveConfig`, `SearchSpace`, and `HyperparameterSearchConfig`
- one existing `RunTracker` run per started trial
- failure policy, bounded failed-trial retry, interruption, and resume
- best-trial selection and best-config export
- inspect, validate, list, and compare APIs

Verified:

- `tests/search`: `10 passed`
- combined search/tracking/PEFT/training/public API/compatibility suite:
  `109 passed, 2 skipped, 1 warning`

Not implemented:

- Bayesian or adaptive search
- pruning, Hyperband, ASHA, or multi-objective optimization
- parallel or distributed trials
- Web search UI
- external sweep providers
- real bitsandbytes QLoRA search runtime

## Next Recommended Implementation Feature

```text
Core Milestone 3 / Feature 1:
Distributed Runtime and Process Abstraction
```

Reason: local training, fine-tuning, PEFT, tracking, and search now have stable
single-process contracts. Distributed work should start with process/runtime
abstractions before DDP, FSDP, or multi-GPU PEFT are implemented.
