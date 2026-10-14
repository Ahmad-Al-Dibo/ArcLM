# 07 - Feature And Bug Recipes

## Add a new CLI command

Fast safe path:

1. Implement logic in a domain module first.
2. Add a small handler in `src/arclm/cli.py`.
3. Add parser creation function and register it in `main()`.
4. Prefer JSON output for machine-readable commands.
5. Add tests under `tests/cli` or a matching domain test folder.

Watch for optional imports. CLI startup should not require FastAPI,
Transformers or PEFT unless the chosen command needs them.

## Add a new Web Studio backend feature

Fast safe path:

1. Put persistent state changes in `StudioWorkspace`.
2. Put long-running compute in a coordinator, not directly inside route code.
3. Add Pydantic request/response schema in `web/schemas.py`.
4. Wire a short route in `web/app.py`.
5. Add tests in `tests/web` using app factory and temp workspace.

Do not let the browser send raw filesystem paths for project assets.

## Add a new frontend Studio page or panel

Fast safe path:

1. Extend `web/src/lib/api/client.ts` with method and runtime assertion.
2. Build feature UI in `web/src/features/...`.
3. Keep `web/src/app/.../page.tsx` thin.
4. Add Vitest tests for loading, error and success states.
5. If the backend can be offline, handle disconnected state explicitly.

## Fix a training bug

Start here:

- `src/arclm/training/trainer.py` for loop, loss, callbacks, precision,
  checkpoints and resume.
- `src/arclm/training/pipeline.py` for high-level train_model behavior.
- `src/arclm/datasets/loader.py` for old data prep.
- `src/arclm/finetuning/workflow.py` for SFT formatting and labels.

Debug sequence:

1. Confirm tokenizer vocab size and model vocab size.
2. Inspect one batch shape and label mask before changing model code.
3. Check old vs new config field names.
4. Run a tiny one-step test and checkpoint resume test.

## Fix a dataset or SFT formatting bug

Start here:

- General dataset parsing: `src/arclm/datasets/loader.py`
- Production source abstraction: `src/arclm/data_sources.py`
- Schema validation: `src/arclm/schemas.py`
- Quality reports: `src/arclm/data_quality.py`
- SFT normalization and masking: `src/arclm/finetuning/workflow.py`

Do not infer SFT response boundaries by decoding token IDs. The current logic
marks trainable segments before tokenization; preserve that property.

## Add external model support

Minimum safe path:

1. Extend `src/arclm/models/capabilities.py` with honest status and limitations.
2. Verify `src/arclm/inference/_external_loading.py` can inspect/load it without
   unsafe defaults.
3. Add optional-dependency tests with mocks and, if possible, local-files-only
   runtime tests.
4. Update examples only after tests back the claim.

Avoid claiming real weight validation unless tests or examples actually load the
model in the target environment.

## Add a workflow stage

Fast safe path:

1. Add pure function and report dataclass outside `workflow.py`.
2. Add config fields in `config_schema.py`.
3. Convert typed config to workflow dict in `ArcLMConfig.to_workflow_dict()`.
4. Add stage handling in `_run_stage`.
5. Log a report through `Run.log_report`.
6. Add dry-run behavior.
7. Test with JSON/TOML config and run directory inspection.

## When a bug looks impossible

Check these hidden mismatches:

- Source tree changed but `distributions/*` did not.
- Frontend client validator rejects a backend response that Python tests accept.
- A deprecated shim imports a different object than the canonical module.
- Dataset iterator was one-shot and consumed during validation.
- Config path was normalized relative to config file directory, not CWD.
- Studio process restarted and marked active jobs interrupted.
- PyTorch checkpoint is final artifact, not resumable `training.pt`.

