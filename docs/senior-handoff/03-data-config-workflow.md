# 03 - Data, Config, Cache, Workflow

## The two config worlds

There are currently two config systems:

- Legacy training config: `src/arclm/configs/base.py` and shim
  `src/arclm/config.py`.
- Typed workflow config: `src/arclm/config_schema.py`.

The recent Open Source sync copied the typed config layer into Special while
preserving legacy compatibility. `src/arclm/config.py` re-exports typed APIs but
keeps legacy `Config` from `arclm.configs`. Internally, `src/arclm/workflow.py`
imports `load_arclm_config` from `arclm.config_schema` to avoid deprecation and
name ambiguity.

Important assumption: typed config is workflow-oriented, not a drop-in
replacement for legacy `Config`. It validates dataset/model/workflow sections
and then converts to workflow dict via `ArcLMConfig.to_workflow_dict()`.

## Config details that matter

- JSON and TOML are supported for typed configs.
- Relative paths are normalized relative to the config file directory, not CWD.
- Environment expansion is blocked unless `allow_env=True`.
- Secret-looking values are redacted by default in `to_dict(redact=True)`.
- `trust_remote_code=True` is allowed but emits a runtime warning.
- `model.task` is effectively limited to `causal-lm`.
- Split ratios must sum to 1.0.

## Dataset sources

`src/arclm/data_sources.py` provides a repeatable `DatasetSource` abstraction
over JSON, JSONL, CSV, TXT, directories, in-memory records and optional Hugging
Face datasets.

Non-obvious behavior:

- File-backed sources are repeatable and marked `seekable=True`.
- Iterator-backed sources are one-shot unless cached deliberately.
- JSON files are materialized because ordinary JSON requires reading the full
  structure.
- `malformed="report"` yields error records with `_error`, `_path`, `_index`;
  downstream validators must know this can appear.
- Directory sources recurse and concatenate supported shards in sorted order.

## Data quality is privacy-aware but not memory-free

`src/arclm/data_quality.py` avoids raw samples unless requested and can redact
simple email/number patterns. However, most operations materialize:

- `analyze_dataset`
- `split_dataset`
- `shard_dataset`
- `find_near_duplicates`

This is acceptable for current tests and CLI workflows, but not enough for truly
large production datasets. If adding scale features, implement streaming-first
variants or bounded sampling instead of extending the list-materializing path.

## Cache and fingerprinting

Tokenization cache keys are derived from:

- dataset fingerprint;
- tokenization config;
- ArcLM version.

This gives useful reproducibility, but also means version bumps invalidate
caches. Cache entries are JSON-oriented, not tensor mmap stores. That keeps them
portable but can become slow/large for bigger tokenized datasets.

## Workflow runner

`src/arclm/workflow.py` runs these stages in order:

`load -> validate -> quality -> deduplicate -> split -> tokenize -> model -> train -> evaluate`

Key details:

- Runs are written through `src/arclm/runs.py` into timestamped directories.
- Every run captures dependency versions, device info and git dirty status.
- Dry-run skips expensive tokenization/model load/train/evaluation where possible.
- Model support uses Special's `get_model_capability`, not the Open Source model
  inspector.
- Training/evaluation stages are thin and less mature than the Studio training
  path. Treat workflow training as experimental until expanded tests cover it.

## Safe extension pattern

For a new data/workflow feature:

1. Add pure functionality in `data_sources`, `schemas`, `data_quality`,
   `tokenization` or a new small module.
2. Add a dataclass option in `config_schema.py` only if config-driven use needs it.
3. Wire it into `workflow.py` as one stage or one option on an existing stage.
4. Add CLI access in `cli.py` only after the Python API is tested.
5. Add tests under `tests/phase3` or a more specific domain folder.

