# ArcLM Web Experience Roadmap

This document records the approved Web Experience direction and the current
state of Web Milestone 1.

## Approved Scope

Web Milestone 1 is complete. Web Milestone 2 / Feature 1 was approved only as
a planning and API-audit step.

```text
Web Milestone 1: Interface Foundation and Dashboards
```

Web Milestone 1 is implemented and locally verified. Web Milestone 2 Feature 1
and Feature 2 are complete: planning/API audit plus the read-only Dataset
Inspector Backend. The Dataset Inspector UI and later Web Milestones 3-5 remain
planned but not approved. They may only show honest `Planned` states inside the
Web shell until explicitly approved.

## Current Web and UI Code

| Area | Evidence | Status |
| ---- | -------- | ------ |
| Legacy simple interface | `src/arclm/simple_interface.py` | Experimental Flask app |
| HTML template | `src/arclm/templates/index.html` | Single-page Flask template |
| CLI launch | `src/arclm/cli.py` with `arclm --run simple-interface` | Compatibility path |
| Root lazy exports | `src/arclm/__init__.py` exports `create_simple_interface_app` and `run_simple_interface` | Public compatibility |
| Modern frontend workspace | `web/` | Frontend foundation, design system, application shell, Simple Dashboard, and Advanced Dashboard implemented |

Existing Flask routes:

```text
GET  /
GET  /api
GET  /health
GET  /model/inspect
POST /model/inspect
POST /model/load
POST /model/save
POST /predict
POST /generate
```

## Existing Flask and Web Dependencies

Current packaging has:

```toml
[project.optional-dependencies]
web = [
  "flask>=3,<4",
]
```

FastAPI and Uvicorn are installed in the current CPU validation environment for
Feature 4. The legacy Flask app stays available until a migration is approved.

## Reusable CLI Flows

The Web UI should not shell out to these commands. It should reuse the same
Python APIs behind them.

| CLI flow | Existing command | Reusable Python layer |
| -------- | ---------------- | --------------------- |
| Train | `python -m arclm train` | `arclm.training.train_model`, `Trainer` |
| Evaluate | `python -m arclm eval` | `arclm.evaluation`, `load_model` |
| Generate | `python -m arclm generate` | `arclm.inference.load_model`, `predict` |
| Simple web | `python -m arclm --run simple-interface` | `run_simple_interface` compatibility |

## Existing Python APIs for Dashboard Data

| Dashboard need | Existing API evidence |
| -------------- | --------------------- |
| ArcLM version | `arclm.__version__` |
| Device summary | `arclm.get_device()` and `torch.cuda` capability checks |
| Environment text | `arclm.report_environment()` |
| Local checkpoints | `arclm.list_available_models()` |
| Dataset loading | `from arclm.datasets import load_dataset, DataPipeline` |
| Training | `from arclm.training import Trainer, TrainingConfig, TrainingState` |
| Evaluation | `from arclm.evaluation import Evaluator, EvaluationConfig` |
| Inference | `from arclm.inference import load_model, predict, load_any_model` |
| Checkpoints | `from arclm.checkpoints import SmartLoader` |

## Current Frontend Stack

Version metadata was checked with package metadata on July 15, 2026.

| Package | Current version | Purpose |
| ------- | ---------------- | ------- |
| Node.js | local `22.14.0` | Runtime for frontend tooling |
| npm | local `10.9.2` | Package manager |
| `next` | `16.2.10` | React framework with App Router |
| `react` | `19.2.7` | UI runtime |
| `react-dom` | `19.2.7` | DOM rendering |
| `typescript` | `5.9.3` | Strict typing on the stable 5.x line |
| `tailwindcss` | `4.3.2` | Styling and tokens |
| `@tailwindcss/postcss` | `4.3.2` | Tailwind build integration |
| `vitest` | `4.1.10` | Unit tests |
| `vite` | `8.1.4` | Vitest peer/build tooling |
| `@vitejs/plugin-react` | `6.0.3` | React test transform |
| `@testing-library/react` | `16.3.2` | Component tests |
| `@testing-library/dom` | `10.4.1` | DOM assertions |
| `jsdom` | `29.1.1` | Browser-like test runtime |
| `eslint` | `9.39.5` | Linting compatible with Next's current ESLint plugins |
| `postcss` | `8.5.10` | Pinned override for transitive PostCSS advisory |

Next `16.2.10` requires Node `>=20.9.0`, which fits the local Node `22.14.0`.

## Current Backend Stack

| Package | Current version | Purpose |
| ------- | ---------------- | ------- |
| `fastapi` | `0.139.0` | Local ArcLM Web API |
| `uvicorn` | `0.51.0` | Local ASGI development server |
| `flask` | existing optional `>=3,<4` | Legacy simple interface compatibility |

The backend should stay thin and call existing ArcLM Python APIs. FastAPI is
preferred for the modern local API because OpenAPI, typed schemas, and endpoint
tests fit the Web Milestone 1 needs. Flask remains the legacy compatibility
path.

## Current Frontend Shape

Only create files as each feature needs them.

```text
web/
  src/app/
  components/
    foundation/
    shell/
    ui/
  lib/
  public/
  package.json
  package-lock.json
```

The Python Web API shape added by Feature 4:

```text

src/arclm/web/
  __init__.py
  app.py
  config.py
  schemas/
  services.py
```

Avoid `managers/`, `controllers/`, `processors/`, and broad factories.

## Backend Endpoints

Web Milestone 1 Feature 4 adds:

```text
GET /api/health
GET /api/environment
GET /api/capabilities
GET /api/project/status
```

These endpoints return real local information:

- ArcLM version
- Python version
- PyTorch version
- CUDA availability
- GPU names when available
- available precision modes
- current project path
- implemented core capabilities

They must not return secrets, API keys, raw `.env` values, or full environment
dumps.

Feature 5 uses the same endpoints for the Simple Dashboard. Feature 6 uses the
same endpoints for the Advanced Dashboard. The root route
shows connection state, ArcLM version, simple device status, selected
capabilities, quick route links, CLI previews, Web progress, and planned Web
features. In Advanced mode it also shows technical runtime details, grouped
capabilities, validation status, optional integrations, limitations, backend
diagnostics, and a safe response inspector. It does not show fake metrics,
charts, upload controls, training controls, arbitrary API browsing, or raw
project files.

## Simple Mode Wireframe

```text
+------------------------------------------------------------------+
| ArcLM                                    Simple | Advanced  Theme |
+----------------------+-------------------------------------------+
| Overview             | Environment                               |
| Projects             | [ArcLM version] [Python] [Torch] [Device] |
| Data Pipeline        |                                           |
| Training             | Active Project                            |
| Evaluation           | [Current path] [Open]                     |
| Models               |                                           |
| Inference            | Quick Actions                             |
| Plugins              | [Load dataset] [Train] [Evaluate] [Run]   |
| Settings             |                                           |
|                      | Recent Items                              |
|                      | Planned until real data exists            |
+----------------------+-------------------------------------------+
```

## Advanced Mode Wireframe

```text
+------------------------------------------------------------------+
| ArcLM                                    Simple | Advanced  Theme |
+----------------------+-------------------------------------------+
| Overview             | Runtime Details                           |
| Projects             | device, cuda, precision, package versions |
| Data Pipeline        |                                           |
| Training             | Capabilities                              |
| Evaluation           | datasets, training, evaluation, inference |
| Models               |                                           |
| Inference            | Configuration                             |
| Plugins              | read-only JSON/YAML preview               |
| Settings             |                                           |
|                      | Diagnostics                               |
|                      | endpoint status and safe error details    |
+----------------------+-------------------------------------------+
```

## Security Boundaries

- Keep web dependencies optional.
- Keep `import arclm` lightweight.
- Do not make hidden network requests.
- Do not download models or datasets in default web tests.
- Do not expose secrets, API keys, raw `.env` values, or full prompts/logs.
- Do not use shell commands as the normal UI backend.
- Bind local development services safely by default.
- Show future pages as `Planned`, not fake functionality.

## Test Plan

Feature-level verification should include:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
python -m pytest tests/web -v
python -m pytest tests/public_api tests/compatibility -v
python -m pytest
python -m compileall src/arclm
```

Commands should be adapted as the web workspace and backend tests are added.

## Web Milestone 1 Feature Order

1. Frontend Foundation - implemented and verified
2. Design System - implemented and verified
3. Application Shell - implemented and verified
4. ArcLM Local Web Backend - implemented and verified
5. Simple Dashboard - implemented and verified
6. Advanced Dashboard details - implemented and verified
7. Documentation and final milestone verification - implemented and verified

## Web Milestone 2 Feature Order

Status: Feature 1 planning and Feature 2 backend implementation are complete.
Feature 3 is the next recommended implementation feature, but it is not
approved automatically.

| Feature | Status | Scope |
| ------- | ------ | ----- |
| Feature 1: Data Pipeline Studio planning and API audit | Complete | Audit current data pipeline, define safe API/storage/security/event contracts |
| Feature 2: Dataset Inspector Backend | Complete | Read-only bounded dataset inspection backend |
| Feature 3: Dataset Inspector UI | Recommended, awaiting approval | Browser UI for real inspection data |
| Feature 4: Approved Pipeline Step Registry | Planned | List real ArcLM steps and safe configs |
| Feature 5: Pipeline Preview and Step Result Contract | Planned | Bounded before/after previews and step result metadata |
| Feature 6: Pipeline Save/Load Manifest | Planned | Local manifest storage and reload |
| Feature 7: Dry Run Execution | Planned | Safe bounded run without training handoff |
| Feature 8: Upload Security and Local Dataset Store | Planned | Upload controls after storage/security approval |
| Feature 9: Token and SFT Mapping Preview | Planned | Token/stat/mapping previews for training handoff |
| Feature 10: Training Handoff Planning | Planned | Dataset-to-model handoff design only |

Related planning documents:

- [Data Pipeline Studio Planning and API Audit](data-pipeline-studio.md)
- [Data Pipeline Studio API Plan](data-pipeline-api.md)
- [Dataset Upload Security Plan](dataset-upload-security.md)
- [Dataset Storage Plan](dataset-storage.md)
- [Pipeline Events Plan](pipeline-events.md)

## Feature 1: Frontend Foundation

Purpose: create the optional frontend workspace and prove the toolchain works.

Included:

- Next.js App Router workspace under `web/`
- TypeScript strict mode
- lint command
- typecheck command
- unit test command
- production build command
- root layout with design tokens
- light and dark theme CSS variables
- responsive root page

Excluded:

- backend endpoints
- data pipeline studio
- dashboards
- model registry
- plugin management
- marketplace
- new ArcLM Python product features

Success criteria:

- `web/` starts locally with the selected Node toolchain.
- TypeScript strict mode is enabled.
- Linting passes.
- Type checking passes.
- Unit tests pass.
- Production build passes.
- No ArcLM Python source behavior changes.
- `import arclm` still works without frontend packages.
- Design tokens exist.
- Light and dark themes are visible in the root layout.
- The root layout is responsive.
- No external network call is needed after dependency installation.

## Feature 2: Design System

Purpose: create the first small, accessible, reusable component system for the
ArcLM Web UI.

Implemented:

- Semantic token expansion
- Typography hierarchy
- Utility foundation
- Button
- Input components
- Card and layout surfaces
- Status components
- Feedback states
- Dialog, dropdown, and tooltip
- Tabs
- Table foundation
- Page components
- Internal `/design-system` showcase

Excluded:

- Application shell
- Sidebar and final navigation
- FastAPI backend
- Simple or advanced dashboard
- Data Pipeline Studio
- Training dashboard
- Model registry
- Project templates
- Plugin system
- Extension marketplace

Success criteria:

- Components are source-owned and typed.
- No new dependency was needed.
- Unit tests cover important behavior and accessibility contracts.
- Lint, typecheck, tests, build, npm audit, production start smoke, and Python regressions pass.

## Feature 3: Application Shell

Purpose: create the shared shell used by current and future ArcLM Web pages.

Implemented:

- Desktop sidebar
- Collapsible sidebar
- Mobile navigation drawer
- Top bar
- Current page information
- Route-aware breadcrumbs
- Simple and Advanced interface mode
- Light, dark, and system theme control
- Shared typed navigation configuration
- Honest planned and unavailable route pages
- Local-storage persistence for theme, mode, and sidebar collapsed state

Excluded:

- FastAPI backend
- ArcLM environment API
- Simple or advanced dashboard data
- Data Pipeline Studio
- Training dashboard
- Model registry workflows
- Project templates
- Plugin management
- Extension marketplace

Success criteria:

- The shell wraps routes from the root layout instead of being copied per page.
- Navigation comes from one typed configuration.
- Planned pages do not show fake product data.
- Interface preferences persist safely and store no sensitive data.
- Lint, typecheck, tests, build, npm audit, production route smoke, and Python regressions pass.

## Feature 4: ArcLM Local Web Backend

Purpose: add a small secure local API bridge between the browser and existing
ArcLM Python APIs.

Implemented:

- Optional `arclm.web` package
- `WebConfig`
- `create_app()`
- FastAPI application factory
- strict local CORS defaults
- `/api/health`
- `/api/environment`
- `/api/capabilities`
- `/api/project/status`
- consistent JSON error format
- `python -m arclm web-api`
- typed frontend API client under `web/src/lib/api/`

Excluded:

- dashboard data presentation
- training controls
- model serving
- WebSocket or Server-Sent Events
- authentication
- remote/cloud access
- dataset upload
- model registry workflows

Success criteria:

- `import arclm` remains lightweight.
- `from arclm.web import create_app` works when web dependencies are installed.
- Legacy Flask simple interface still imports.
- Read-only endpoints return safe schemas.
- CORS rejects wildcard/default unknown origins.
- Runtime smoke passes on localhost.
- Python and frontend regressions pass.

## Feature 5: Simple Dashboard

Purpose: replace the static overview page with a beginner-friendly dashboard
that uses real data from the local Web API.

Implemented:

- backend connection state from `/api/health`
- ArcLM status summary from `/api/health` and `/api/project/status`
- simple CPU/CUDA device summary from `/api/environment`
- selected core capability summary from `/api/capabilities`
- quick route links and copyable current CLI previews
- Web progress and planned Web feature overview from safe structured project
  status data
- refresh and retry behavior
- partial failure states for secondary endpoints
- Advanced-mode notice without building the Advanced Dashboard

Excluded:

- Advanced Dashboard
- charts and fake metrics
- dataset upload
- browser training controls
- write endpoints
- WebSocket or Server-Sent Events
- model registry workflows

Success criteria:

- Dashboard uses only real endpoint data.
- Failed secondary endpoints do not break the whole page.
- Planned actions are not clickable as working controls.
- CLI previews match current CLI help.
- Lint, typecheck, tests, build, backend tests, Python regressions, package
  wheel, npm audit, and real frontend-to-backend smoke pass.

## Feature 6: Advanced Dashboard

Purpose: add developer-focused technical detail to the existing dashboard
without adding write actions or new backend workflows.

Implemented:

- runtime details from `/api/environment`
- hardware detail cards for CPU/CUDA-safe fields
- grouped capability matrix from `/api/capabilities`
- validation status from safe `/api/project/status` fields
- optional integration status from safe package metadata summaries
- known limitations
- endpoint diagnostics and refresh timestamps
- safe API response inspector for already-loaded approved responses

Excluded:

- Advanced product workflows
- raw project files
- arbitrary endpoint browser
- write endpoints
- training controls
- uploads
- charts
- WebSocket or Server-Sent Events
- Data Pipeline Studio

Success criteria:

- Advanced mode reuses the existing dashboard data layer.
- Simple mode remains compact and hides technical sections.
- Endpoint failures are visible without breaking the whole dashboard.
- Optional integrations show package status without importing heavy packages.
- No private paths, environment variables, or raw planning files are exposed.
- Lint, typecheck, tests, build, backend tests, Python regressions, package
  wheel, npm audit, and real frontend-to-backend smoke pass.
