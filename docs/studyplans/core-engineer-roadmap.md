# Core Engineer Roadmap

This roadmap helps an engineer become productive on ArcLM core work. It is a study path, not an approval to implement features.

## Week 1: Repository Orientation

Goals:

- Understand the package layout under `src/arclm`.
- Learn the active project-state documents.
- Run the Python baseline.
- Identify which code belongs to core, web, examples, and tests.

Read:

- `docs/project/PROJECT_MAP.md`
- `docs/project/MILESTONES.md`
- `docs/core/current-capabilities.md`
- `docs/core/roadmap.md`
- `docs/core/model-lifecycle.md`

Practice:

```bash
python -c "import arclm; print(arclm.__version__)"
python -m pytest tests/public_api -v
python -m pytest tests/compatibility -v
```

Deliverable:

- A short note listing public APIs, compatibility imports, and the next approved action.

## Week 2: Training, Evaluation, and Inference

Goals:

- Understand `Trainer`, `TrainingConfig`, callbacks, checkpoints, evaluation, and inference.
- Learn how ArcLM keeps training checkpoints separate from final model artifacts.
- Understand CPU runtime validation before GPU claims.

Read:

- `docs/core/training.md`
- `docs/core/checkpoints.md`
- `docs/core/model-artifacts.md`
- `docs/core/evaluation.md`
- `docs/core/inference.md`

Practice:

```bash
python -m pytest tests/unit/training -v
python -m pytest tests/evaluation -v
python -m pytest tests/inference -v
python -m pytest tests/checkpoints -v
```

Deliverable:

- A tiny training run that saves a checkpoint and a final artifact, then loads the artifact for inference.

## Week 3: Model Lifecycle and Configuration

Goals:

- Understand model source types.
- Understand what can and cannot be reconstructed from a state dictionary.
- Learn artifact inspection, validation, loading, and security boundaries.

Read:

- `docs/core/model-lifecycle.md`
- `docs/core/model-artifacts.md`
- `docs/project/API_DESIGN.md`
- `docs/project/SECURITY_MODEL.md`

Practice:

- Save and inspect an artifact.
- Try loading an arbitrary PyTorch state dictionary without a model factory and confirm the controlled error.
- Check that artifact inspection does not construct a model.

Deliverable:

- A short matrix showing native ArcLM, PyTorch, and Hugging Face artifact behavior.

## Week 4: Fine-Tuning, SFT, and PEFT

Goals:

- Understand supervised fine-tuning and completion-only loss.
- Learn the difference between full fine-tuning and adapter-based fine-tuning.
- Understand LoRA, PEFT, and QLoRA boundaries.

Read:

- `docs/core/fine-tuning.md`
- `docs/core/dependencies.md`
- `papers-and-references.md`

Practice:

```bash
python -m pytest tests/finetuning -v
```

Deliverable:

- A small SFT run or test that proves label masking and artifact saving behavior.

## Week 5: Distributed Runtime

Goals:

- Understand ranks, world size, local rank, process groups, launchers, and DDP.
- Learn which tests are local CPU tests and which require real multi-GPU hardware.
- Understand why a single GPU does not validate multi-GPU behavior.

Read:

- `docs/core/distributed-runtime.md`
- `docs/core/hardware-validation.md`
- `docs/testing/gpu-capability-matrix.md` if present

Practice:

```bash
python -m pytest tests/distributed -v
python examples/17_multiprocessing_launcher.py
python examples/20_ddp_cpu_trainer.py
```

Deliverable:

- A small CPU process-group example that initializes, exchanges rank information, and shuts down cleanly.

## Week 6: Data Pipeline Core

Goals:

- Understand dataset loaders, examples, validation, manifests, and safe IDs.
- Separate Python data pipeline work from paused Web Data Pipeline Studio work.
- Learn path safety rules before touching local dataset sources.

Read:

- `docs/core/data-pipeline.md`
- `docs/web/dataset-storage.md` if working near web dataset APIs
- `docs/project/SECURITY_MODEL.md`

Practice:

```bash
python -m pytest tests/data -v
```

Deliverable:

- A tiny local dataset fixture that loads, validates, and produces deterministic metadata.

## Week 7: Hardware and Dependency Boundaries

Goals:

- Understand CPU, CUDA FP32, CUDA FP16, BF16, DDP, and FSDP validation levels.
- Learn optional dependency rules.
- Avoid making false hardware claims.

Read:

- `docs/core/hardware-validation.md`
- `docs/project/DEPENDENCIES.md`
- `docs/core/dependencies.md`

Practice:

```bash
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Deliverable:

- A dependency inventory for the feature you want to touch.

## Week 8: Contribution Capstone

Goals:

- Implement one small approved feature end to end.
- Preserve compatibility.
- Update only the required docs.

Practice flow:

```text
one feature
-> focused tests
-> full regression
-> runtime validation
-> docs
-> report
```

Deliverable:

- A complete feature report with changed files, tests, runtime evidence, limitations, and next recommended action.

