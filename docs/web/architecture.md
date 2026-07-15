# ArcLM Web Architecture

The Web UI is a local developer interface. It should make ArcLM easier to use
without creating a second training, evaluation, inference, or dataset system.

## Boundary

```text
Browser
-> ArcLM Web API
-> existing ArcLM Python APIs
-> Dataset / Trainer / Evaluator / Inference
-> results and events
-> ArcLM Web API
-> Browser
```

Features 1-6 implement the frontend foundation, design system, application
shell, local read-only Web API, typed frontend client, Simple Dashboard, and
Advanced Dashboard details.

## Current Foundation

- `web/` contains the Next.js App Router workspace.
- `web/src/app/layout.tsx` wraps pages in shared providers and the application
  shell.
- `web/src/app/page.tsx` implements the overview route.
- `web/src/app/*/page.tsx` contains minimal honest route pages for planned
  sections.
- `web/src/app/globals.css` contains the first design tokens.
- `web/src/lib/theme.ts`, `web/src/providers/theme-provider.tsx`, and
  `web/src/providers/interface-mode-provider.tsx` provide reusable preference
  behavior.
- `web/src/config/navigation.ts` is the single navigation source for sidebar,
  mobile navigation, active route state, and breadcrumbs.
- `web/src/components/shell/` contains the desktop sidebar, mobile drawer, top
  bar, breadcrumbs, and planned-page layout.
- `web/src/features/dashboard/` contains the shared dashboard data hook, Simple
  Dashboard presentation, and Advanced Dashboard detail sections.

## Application Shell

The shell flow is:

```text
Root layout
-> AppProviders
-> ApplicationShell
-> route content
```

The shell includes:

- desktop sidebar with expanded and collapsed states
- mobile navigation drawer
- top bar with current page, interface mode, and theme controls
- route-aware breadcrumbs
- skip-to-content link
- shared content area

The shell stores only user interface preferences in browser local storage:

- `arclm-theme`
- `arclm-interface-mode`
- `arclm-sidebar-collapsed`

No project paths, model paths, dataset paths, prompts, secrets, or backend data
are stored.

## Routes

Feature 3 adds these routes:

```text
/
/projects
/data
/training
/evaluation
/models
/inference
/plugins
/settings
/design-system
```

The overview route is the Simple Dashboard. Settings preferences and the
design-system review route are available frontend pages. Product workflow pages
show planned or unavailable states and do not show fake metrics, models,
datasets, GPU data, or backend responses.

## Interface Modes

Simple and Advanced mode share the same routes, shell, API client, and
dashboard data hook. Simple mode shows the compact beginner dashboard. Advanced
mode adds runtime, hardware, capability, validation, integration, limitation,
diagnostic, and safe response-inspector details. It does not expose raw project
files, private paths, secrets, fake runtime data, or arbitrary endpoint access.

## Local Web API

Feature 4 adds:

- `src/arclm/web/config.py`
- `src/arclm/web/app.py`
- `src/arclm/web/schemas.py`
- `src/arclm/web/services.py`

The public API is:

```python
from arclm.web import WebConfig, create_app
```

The API exposes only approved read-only endpoints:

```text
GET /api/health
GET /api/environment
GET /api/capabilities
GET /api/project/status
```

It does not load models, run training, run evaluation, serve inference, upload
datasets, or parse shell output. The frontend client lives in
`web/src/lib/api/`.

## Simple Dashboard

Feature 5 replaces the static overview page with a real read-only dashboard.
The data flow is:

```text
Overview page
-> useDashboardData
-> typed frontend API client
-> ArcLM Local Web API
-> existing ArcLM public Python information
```

The dashboard renders backend connection state, ArcLM version, simple device
summary, selected core capabilities, quick route links, copyable CLI previews,
current Web progress, and planned Web areas. It does not execute commands,
start jobs, upload files, or display fake activity.

## Advanced Dashboard

Feature 6 adds the Advanced Dashboard to the same `/` route. It appears only
when the global interface mode is `Advanced`.

The Advanced Dashboard reuses the already loaded read-only endpoint data:

```text
Health
Environment
Capabilities
Project status
```

It shows technical summaries for runtime, GPU hardware, grouped capabilities,
validation status, optional integrations, known limitations, endpoint
diagnostics, and approved API response JSON. It does not add write endpoints,
training controls, uploads, model loading, WebSockets, Server-Sent Events, or
new backend workflows.

## Compatibility

The legacy Flask interface remains available through:

```bash
python -m arclm --run simple-interface
```

Features 1-6 do not modify the Flask app behavior. The modern API is separate
from the legacy Flask compatibility path.
## Data Pipeline Studio Architecture Plan

Status: planning only. No Data Pipeline Studio backend or UI has been
implemented.

Future flow:

```text
Browser -> ArcLM Web API -> safe dataset reference -> existing dataset APIs
-> bounded preview/schema/statistics -> validated response -> Browser
```

The Studio must reuse existing ArcLM data APIs instead of duplicating data
loading, cleaning, deduplication, tokenization, or preprocessing logic.

Current reusable code:

- `arclm.datasets.load_dataset`
- `arclm.datasets.DatasetLoader`
- `arclm.datasets.DataPipeline`
- `arclm.datasets.cleaning`
- `arclm.datasets.deduplication`
- `arclm.preprocess.PreprocessPipeline`
- `arclm.finetuning` formatting and collator helpers

The first implementation feature should be a read-only Dataset Inspector
Backend. It must not upload files, mutate datasets, execute pipelines, start
training, or accept arbitrary file paths from the browser.

Detailed contracts are in:

- [Data Pipeline Studio Planning and API Audit](data-pipeline-studio.md)
- [Data Pipeline Studio API Plan](data-pipeline-api.md)
- [Dataset Upload Security Plan](dataset-upload-security.md)
- [Dataset Storage Plan](dataset-storage.md)
- [Pipeline Events Plan](pipeline-events.md)
