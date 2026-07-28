# 09 - Open Source Sync Notes

## What was recently brought into Special

The Open Source production-oriented strengths now exist in Special as new
modules:

- `src/arclm/cache.py`
- `src/arclm/config_schema.py`
- `src/arclm/config_validation.py`
- `src/arclm/data_quality.py`
- `src/arclm/data_sources.py`
- `src/arclm/events.py`
- `src/arclm/report_schemas.py`
- `src/arclm/reproducibility.py`
- `src/arclm/runs.py`
- `src/arclm/schemas.py`
- `src/arclm/stability.py`
- `src/arclm/tokenization.py`
- `src/arclm/workflow.py`

They are wired into:

- root lazy exports in `src/arclm/__init__.py`;
- legacy shims `src/arclm/config.py` and `src/arclm/data.py`;
- CLI commands in `src/arclm/cli.py`;
- exception exports;
- pytest markers;
- `tests/phase3`.

## Integration choices that matter

- `workflow.py` imports typed config from `config_schema`, not from deprecated
  `config`.
- Workflow model support uses Special's `get_model_capability`.
- Non-dry-run model loading uses Special's `load_any_model`.
- The root package maps typed config exports to `arclm.config_schema` so old
  `arclm.config.Config` semantics stay intact.
- `arclm.data` is still deprecated, but now re-exports the data-scale APIs for
  compatibility.

## Validated after the sync

The following targeted checks passed during integration:

- `tests/phase3`
- `tests/cli`
- public API and compatibility tests
- dataset unit tests
- package structure checks
- import smoke for `ArcLMConfig`, `open_dataset`, `run_workflow`, `api_manifest`
- CLI smoke for data/config/version/run/cache commands

## Follow-up risks

- Source has the new modules, but generated distributions may not.
- `config_schema.py` contains copied legacy `Config` code plus typed config.
  This should be cleaned later by splitting legacy compatibility from typed
  workflow config.
- Workflow training/evaluation are less mature than the Studio training path.
- Cache is JSON-based and suitable for small/medium workflow artifacts, not
  optimized tensor storage.
- Large-data helpers are deterministic and report-rich, but many still
  materialize rows.

## Safe next steps after sync

1. Rebuild and diff `distributions/*` if these APIs must ship in distributions.
2. Add documentation examples for typed config and `arclm data` CLI.
3. Decide whether `config_schema.py` should be refactored into a typed-only file.
4. Add web UI entry points only after product intent is clear; the current sync
   is Python/CLI-first.

