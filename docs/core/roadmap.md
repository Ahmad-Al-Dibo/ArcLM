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

## Next Recommended Implementation Feature

```text
Core Milestone 2 / Feature 3:
QLoRA and Quantized Fine-Tuning Foundation
```

Reason: the built-in LoRA foundation is now verified on CPU with native ArcLM.
The next Core gap is quantized adapter fine-tuning. It must be approved
separately because it requires quantization policy, dependency decisions, and
hardware-sensitive validation.
