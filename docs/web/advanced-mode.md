# ArcLM Web Advanced Mode

Advanced mode adds technical read-only detail to the same ArcLM Web UI routes.

## Purpose

Advanced mode is for developers who want runtime, capability, validation, and
integration details without leaving the local dashboard.

## Current Behavior

- Users can switch to Advanced mode from the top bar.
- The preference is stored in browser local storage as `arclm-interface-mode`.
- The same routes, shell, dashboard data hook, and API client are used as
  Simple mode.
- Advanced mode does not create a separate application or route tree.
- The Advanced Dashboard is visible on `/` only after the user switches to
  Advanced mode.

## Dashboard Data

Advanced mode reuses the same read-only endpoints as the Simple Dashboard:

```text
GET /api/health
GET /api/environment
GET /api/capabilities
GET /api/project/status
```

It does not make separate hidden requests, poll continuously, or call arbitrary
URLs.

## What Advanced Mode Shows

- Runtime details such as Python, PyTorch, CUDA availability, and preferred
  device.
- Hardware details such as GPU name, rounded VRAM, and compute capability when
  the backend reports them.
- Grouped capability matrix with evidence, hardware requirement, optional
  dependency, and product state.
- Validation status for CPU, CUDA, BF16, and multi-GPU paths.
- Optional integration status for packages such as Transformers, PEFT,
  Accelerate, WebDataset, ONNX, MLflow, and W&B.
- Known local limitations.
- Backend diagnostics, endpoint status, and last refresh time.
- A safe API response inspector for already-loaded approved dashboard
  responses.

## What Advanced Mode Does Not Show

- Fake runtime data.
- Full project files.
- Raw `PROJECT_MAP.md` or `[ORPHANS & PENDING]`.
- Secrets, environment variables, usernames, home directories, or absolute
  repository paths.
- Full stack traces.
- Training controls, upload controls, registry workflows, or plugin actions.
- Arbitrary endpoint browsing.

## API Inspector Boundary

The inspector is hidden by default. When opened, it formats only the already
loaded responses used by the dashboard. It has no URL input and cannot execute
commands.

## Limitation

Advanced mode is still read-only. It gives more detail, but it does not unlock
hidden workflows or bypass planned-state guards.
