# 05 - Web Studio Runtime

## Backend shape

`src/arclm/web/app.py` is an app factory, not a module-global app. It delays
FastAPI imports until runtime and stores coordinators in `app.state`:

- `DatasetSourceManager`
- `DatasetCatalogue`
- `DatasetInspector`
- `StudioWorkspace`
- `StudioTrainingCoordinator`
- `Studio3Coordinator`
- a shared compute lock for expensive Studio operations

This is important for tests: app instances are isolated by config and state,
but persistent workspace files can survive between runs if the same root is used.

## Workspace is the real source of truth

`src/arclm/web/workspace.py` stores projects under:

`workspace/projects/project_<id>/...`

It writes:

- `project.json`
- dataset raw files and metadata JSON;
- tokenizer JSON and metadata;
- model metadata without weights;
- run directories with `run.json`, `metrics.jsonl`, `events.jsonl`, checkpoints;
- dataset manifests/reports.

The browser never gets to supply trusted filesystem paths. It supplies IDs and
payloads; the backend resolves paths under the workspace root and calls
`_ensure_inside()` before reading/writing.

## Dataset roots are separate from project datasets

There are two dataset concepts:

- Catalogue dataset roots: server-side folders for read-only inspection through
  `/api/datasets` and `/api/dataset-roots`.
- Project datasets: uploaded/pasted content stored inside a Studio project.

Do not merge these without a migration plan. Catalogue inspection is read-only;
project datasets become part of the Studio artifact graph.

## Training jobs

`StudioTrainingCoordinator` enforces one active local job per app instance. It
creates run metadata immediately, then starts a daemon thread. Progress is
written by a Trainer callback.

Implications:

- Cancellation is cooperative and only happens at callback boundaries.
- There is no cross-process job lock. Two backend processes pointed at the same
  workspace can race.
- If the backend exits, active runs are marked interrupted on next coordinator
  initialization.
- GPU memory cleanup is best-effort after jobs finish.

## Evaluation/generation/checkpoints

`src/arclm/web/studio3.py` handles checkpoint listing/validation/inspection,
evaluation jobs, comparison and generation history. It complements
`studio_training.py`; it is not a replacement for it.

When adding model-runtime features, find out whether the feature belongs in:

- `StudioWorkspace` for persisted metadata/storage;
- `StudioTrainingCoordinator` for active training;
- `Studio3Coordinator` for post-training checkpoints/evaluation/generation;
- `app.py` only for route wiring.

## Frontend contract

The Next.js frontend is typed manually in `web/src/lib/api/client.ts`. It has
runtime validators for backend responses. This is a hidden safety net and a
common source of breakage:

- If a backend response adds optional fields, frontend usually survives.
- If a backend response renames/removes fields, validators or UI break.
- Add/update client methods in `client.ts` before building UI components.
- Pages under `web/src/app/...` are thin route wrappers around feature modules.

## API groups worth knowing

- Health/system: `/api/health`, `/api/environment`, `/api/capabilities`,
  `/api/system/status`.
- Pipeline inspection: `/api/inspection/status`, `/api/inspection/text`.
- Studio projects: `/api/projects...`.
- Project datasets/tokenizers/models/runs: nested under `/api/projects/{id}`.
- Checkpoints/evaluations/generations: nested under project.
- Catalogue datasets and roots: `/api/datasets`, `/api/dataset-roots`.

## Safe web feature path

1. Add or extend a Pydantic schema in `src/arclm/web/schemas.py`.
2. Add storage/domain behavior to `workspace.py`, `studio_training.py` or
   `studio3.py`.
3. Wire a small route in `app.py`.
4. Add/extend backend tests in `tests/web`.
5. Add client method and runtime validator in `web/src/lib/api/client.ts`.
6. Add UI in the relevant `web/src/features/...` module.
7. Add Vitest component/client tests.

