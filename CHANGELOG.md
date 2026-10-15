# Changelog

All notable changes to ArcLM are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-14

### Added

- **Light install**: core `pip install arclm` no longer requires PyTorch
  (numpy + sentencepiece only, ~50 MB). Torch lives behind `arclm[train]`.
- **ArcLM Blocks**: trimmed, self-contained editions under `distributions/`
  (core, training, finetuning, loading-inference, evaluation-benchmarks,
  agents-tools, security) installable from git.
- `docs/guide.md` — complete framework guide (22 sections).
- `docs/migration-1-to-2.md` — 1.x → 2.0 migration table.
- `docs/distributions.md` — Blocks architecture and builder.
- `checkpoint_is_compatible_for_tuning` (typo fixed from `..._tuining`).
- Light-import guard tests (`tests/unit/test_light_imports.py`).
- GitHub Actions: CI tests and PyPI publish workflows.

### Changed

- Version line is 2.0.0; web API version 0.11.0.
- `requires-python = ">=3.9"` (removed the `<3.13` upper bound).
- Root package `TrainingConfig` now resolves to `arclm.training.TrainingConfig`
  (not the `arclm.configs.Config` alias).
- `create_config()` no longer seeds global torch RNG as a side effect and
  defaults `device` to `"cpu"`.
- Checkpoint compatibility checks reject checkpoints with a missing/empty
  config (no more false-positive matches).
- Precise `SecurityPolicy` import in `arclm.agents` so the agents block does
  not pull crypto.
- Professional standard headers on all numbered examples.
- `finetuning` and `peft` package inits are lazy (config types import without
  torch).

### Removed

- Deprecated flat import shims: `arclm.trainer`, `arclm.tokenizer`,
  `arclm.sft`, `arclm.model`, `arclm.config`, `arclm.config_loader`,
  `arclm.data`, `arclm.dataset`, `arclm.data_processor`,
  `arclm.instruction_dataset`, `arclm.diagnostics`, `arclm.generator`,
  `arclm.external_inference`, `arclm.logging`, `arclm.pipeline`,
  `arclm.pipeline_v2`, `arclm.regularization`.
- `arclm.loaders` facade (use `arclm.checkpoints`).
- `arclm.api` (use root `import arclm`).
- `arclm.preprocess` (use `arclm.datasets` cleaning/deduplication).
- `arclm.plugins` stub.
- Flask `arclm.simple_interface` and `templates/` (use FastAPI Studio:
  `python -m arclm web-api`).
- `MiniGPT` alias (use `ArcLM`).
- `arclm.configs` aliases: `TrainingConfig`, `ModelConfig`, `TokenizerConfig`,
  `DatasetConfig`, `InferenceConfig` (all were `= Config`).
- Historical `examples/models/`, unnumbered `examples/security/`,
  `examples/agents/`, `examples/distributions/`.
- Optional extras: `preprocess`, `cpu`, `cuda`, `cuda121`, `all-cpu`,
  `all-cuda`, `all-cuda121`, empty `agents`/`agents-web`.

## [1.x] - prior

See git history and `docs/project-status.md` for 1.x notes.
