# 08 - Test And Release Map

## Test layers

Use the smallest layer that proves the change:

- `tests/public_api`: import contracts and public package surface.
- `tests/compatibility`: old import paths and backwards compatibility.
- `tests/unit/datasets`: old dataset loader/pipeline behavior.
- `tests/unit/training`: Trainer/config/optimizer/precision behavior.
- `tests/unit/finetuning`: SFT workflow and finetuning contracts.
- `tests/web`: FastAPI backend, Studio APIs and dataset inspectors.
- `web/src/**/*.test.tsx` and `web/src/**/*.test.ts`: frontend client/components.
- `tests/phase3`: recent Open Source parity modules for data/config/cache/workflow.
- `tests/security`: security policy, manifests, crypto and web-agent policy.
- `tests/smoke`: heavier end-to-end paths.

## Good targeted commands

Python core/API:

```powershell
.\.venv\Scripts\python.exe -m pytest -q tests\public_api tests\compatibility
```

Data/config/workflow parity:

```powershell
.\.venv\Scripts\python.exe -m pytest -q tests\phase3
```

CLI:

```powershell
.\.venv\Scripts\python.exe -m pytest -q tests\cli
```

Web backend:

```powershell
.\.venv\Scripts\python.exe -m pytest -q tests\web
```

Frontend:

```powershell
cd web
npm test
```

## Release/distribution gotcha

`distributions/*` are generated copies/subsets. If source changes should be
available in a named distribution, run and inspect the distribution builder:

```powershell
.\.venv\Scripts\python.exe tools\build_arclm_distributions.py
```

Then test the affected distribution folder, because package-data, optional deps
and public imports can differ from full source.

## Build hygiene

- The project supports Python `>=3.9,<3.13`.
- Some optional web dependencies are pinned tightly.
- `compileall` and pytest may touch tracked `.pyc` files in this repo because
  some cache files are tracked. Check `git status --short` before finalizing.
- Keep generated docs/sites/distributions separate from source changes unless
  the task explicitly asks for them.

## Test selection by change type

- Root export or shim change: `tests/public_api`, `tests/compatibility`.
- CLI parser/handler change: `tests/cli` plus command smoke.
- Dataset source/quality change: `tests/phase3`, `tests/unit/datasets`.
- Training loop change: `tests/unit/training`, at least one smoke test if
  checkpoint/resume changed.
- SFT formatting change: `tests/unit/finetuning`, Studio fine-tuning validation
  tests if UI path is affected.
- Web API schema change: `tests/web` and frontend API client tests.
- Security policy/path validation change: `tests/security`, relevant web tests.

