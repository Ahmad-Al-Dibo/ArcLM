# ArcLM Component Responsibilities

This document is an evidence-based orientation map for ArcLM maintainers. It
describes the main responsibility of important packages and the boundaries they
should keep. It does not replace API docs or tests.

## Responsibility Rules

- Data components read, validate, transform, and describe records. They do not
  train models.
- Tokenizer components convert text to token IDs and back. They do not decide
  training schedules.
- Model lifecycle components save, inspect, validate, and load final model
  artifacts. They do not resume interrupted training runs.
- Checkpoint components save trusted training state for resume. They do not act
  as final model artifacts.
- Trainers execute training loops. They do not own dataset-root management,
  Web UI state, model-registry policy, or cloud orchestration.
- PEFT components apply and persist adapter behavior. They do not make
  quantized runtime claims without dependency and hardware evidence.
- Inference components load runtime models and generate predictions. They do
  not expose a serving API by themselves.
- Web components expose local dashboard/API behavior. They must not duplicate
  Core data, training, evaluation, or inference logic.

## Main Components

| Component | Responsibility | Input | Output | Not responsible for | Depends on | Used by | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `arclm.datasets` | Dataset loading, basic dataset abstractions, processing helpers | Paths, records, dataset configs | Dataset objects, dataloaders, processed records | Training execution, model loading, Web file browsing | Python stdlib, PyTorch datasets where needed | Training, fine-tuning, Web dataset catalogue | `DatasetError`, `DatasetValidationError` |
| `arclm.preprocess` | Local text cleaning, quality filters, dedup helpers, reports | Text rows, JSONL files, preprocess config | Cleaned rows, statistics, reports | Tokenization, model training, PII guarantees beyond configured helpers | stdlib, optional parser helpers | Data pipeline examples and utilities | `DatasetError` family |
| `arclm.tokenizers` | Native tokenizer wrappers and tokenizer factory helpers | Text, tokenizer config, vocabulary files | Token IDs, decoded text, tokenizer instances | Dataset validation, model generation policy | Local vocab files, optional tokenizer libraries | Training, fine-tuning, inference | `TokenizerError` |
| `arclm.models` | Native ArcLM model classes and simple model factories | Model config, tensor inputs | PyTorch modules and outputs | Hugging Face universal support, serving | PyTorch | Training, lifecycle, inference, tests | PyTorch errors, `ModelLoadError` through loaders |
| `arclm.training` | Single-device and distributed-aware training loop contracts | Model, dataloader, `TrainingConfig`, optional distributed config | Updated model, checkpoints, training state | Dataset-source management, final artifact format, Web UI | PyTorch, checkpoints, distributed helpers | CLI, fine-tuning, examples | `TrainingError`, `TrainingConfigError`, `PrecisionError` |
| `arclm.checkpoints` | Trusted training checkpoint save/load/inspect/validate | Checkpoint paths, training payloads | `CheckpointInfo`, restored training state | Final model sharing artifact, arbitrary untrusted pickle support | PyTorch, pathlib | Trainer resume, compatibility loaders | `CheckpointError` |
| `arclm.lifecycle` | Final model artifact save/inspect/validate/load | Runtime model, config, tokenizer, artifact path | `ModelArtifactInfo`, `LoadedModel`, validated artifact directory | Optimizer/scheduler/RNG resume state, registry, cloud upload | PyTorch, optional Transformers lazily | Inference, evaluation, PEFT, examples | `ArtifactError`, optional dependency errors |
| `arclm.evaluation` | Metric definitions and evaluation loop | Model, dataloader, metrics, `EvaluationConfig` | `EvaluationResult`, metrics, optional predictions | Benchmark suites, dashboards, serving | PyTorch | Training checks, examples, smoke tests | `EvaluationError`, `MetricError` |
| `arclm.finetuning` | SFT/full fine-tuning dataset normalization, collator, workflow | Records, tokenizer/model adapters, fine-tuning config | Prepared dataset, trained model, final artifact handoff | LoRA internals, quantized backend loading, Web workflow controls | Training, lifecycle, tokenizers | SFT examples, PEFT tests | `FineTuningError`, `SFTConfigError` |
| `arclm.peft` | Built-in LoRA, adapter artifacts, QLoRA boundary and quantization checks | Base model, PEFT config, adapter path | Adapted model, adapter manifest, capability reports | External PEFT package parity, guaranteed bitsandbytes runtime | PyTorch, optional bitsandbytes/Transformers lazily | Fine-tuning, artifacts, tests | `FineTuningError`, optional dependency errors |
| `arclm.inference` | Native/external model loading and text generation helpers | Model path/source, generation config, prompts | Loaded model object, generated text | REST serving, OpenAI-compatible API, dynamic batching | PyTorch, lifecycle, optional HF stack | CLI, examples, tests | `InferenceError`, `ModelLoadError` |
| `arclm.distributed` | Distributed config, validation, process groups, launcher, DDP/FSDP boundaries | `DistributedConfig`, worker functions, process-group settings | Runtime info, launch results, wrapped model plans | Cloud provisioning, full external hardware validation, Web UI | PyTorch distributed, multiprocessing | Trainer, GPU gates, examples | `DistributedConfigError`, `DistributedRuntimeError` |
| `arclm.tracking` | Local run manifests and reproducibility metadata | Run config, training/fine-tuning/search events | Run manifests, comparison summaries | Cloud experiment services by default | JSON files, pathlib | Training callbacks, search, docs | Tracking validation errors |
| `arclm.search` | Local deterministic hyperparameter search orchestration | Search space, objective function, run storage | Search manifest, trial records, best config | Distributed search, Bayesian optimization, Web UI | Tracking, training configs | Tests, future CLI/Web | Search validation errors |
| `arclm.web` | Optional local FastAPI backend for paused Web dashboard | HTTP requests, local config | JSON schemas and safe local API responses | Core training logic, remote auth, cloud access | FastAPI/Uvicorn optional extras | Next.js frontend, tests | `ConfigurationError`, API error schema |
| `arclm.cli` | Command-line entrypoints using existing Core APIs | CLI arguments, config files | Process exit code, stdout/stderr, local files | Browser UI, model registry, shell-command parsing for Web | Core public APIs | Users, tests | Controlled CLI errors |

## Model-Specific Boundaries

| Area | Model-specific? | Notes |
| --- | --- | --- |
| Native `arclm.models` | Yes | Current native implementation is GPT-style causal language modeling. |
| `arclm.training.Trainer` | Mostly model-agnostic | Assumes a trainable PyTorch module and compatible batch/loss behavior. |
| `arclm.finetuning` | Format-aware | Supports text, instruction, prompt/response, and chat-style records through explicit normalization. |
| `arclm.peft` | Module-structure-aware | LoRA target matching depends on module names and linear layers. |
| `arclm.lifecycle` | Source-type-aware | Native ArcLM can reconstruct automatically; arbitrary PyTorch needs an explicit factory; Hugging Face remains optional. |
| `arclm.inference` | Source-type-aware | Native and external paths differ; unsupported source types should fail clearly. |

## Maintenance Guidance

- Add new behavior to the domain package that already owns the concept.
- Add examples that call public APIs rather than reimplementing library logic.
- Add tests beside the relevant domain suite; use markers for internet, GPU,
  slow, or optional dependency coverage.
- Downgrade roadmap status when code, tests, and docs do not all support an
  implementation claim.
