# ArcLM Web Local Development

The Web frontend lives in `web/` and is separate from the Python package. This
keeps `import arclm` lightweight and avoids installing Node.js packages for
normal Python users.

## Environment

Validated locally on July 15, 2026:

| Tool | Version |
| ---- | ------- |
| Node.js | `22.14.0` |
| npm | `10.9.2` |
| Next.js | `16.2.10` |
| React | `19.2.7` |
| React DOM | `19.2.7` |
| TypeScript | `5.9.3` |
| Tailwind CSS | `4.3.2` |
| ESLint | `9.39.5` |
| Vitest | `4.1.10` |
| FastAPI | `0.139.0` |
| Uvicorn | `0.51.0` |

## Install

```bash
cd web
npm install
```

The lockfile is `web/package-lock.json`. Do not create a second lockfile.

## Run Locally

```bash
cd web
npm run dev
```

The application shell routes are available at:

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

Planned workflow routes intentionally show planned or unavailable states until
the matching backend or dashboard feature is approved.

The root route is the dashboard. Simple mode shows the compact beginner view.
Advanced mode adds read-only runtime details, capabilities, validation status,
optional integrations, limitations, diagnostics, and a safe response inspector.
Both modes read the same real data from the local Web API.

## Validate

```bash
cd web
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

Features 1-3 do not start the ArcLM Python backend. Feature 4 adds the optional
read-only backend, but it still starts only when the user launches it.

## Run the Local Web API

Install the optional web dependencies:

```bash
pip install "arclm[web]"
```

Start the modern read-only API:

```bash
python -m arclm web-api --host 127.0.0.1 --port 8765
```

or:

```bash
python -m uvicorn arclm.web.app:create_app --factory --host 127.0.0.1 --port 8765
```

Check:

```text
http://127.0.0.1:8765/api/health
http://127.0.0.1:8765/api/environment
http://127.0.0.1:8765/api/capabilities
http://127.0.0.1:8765/api/project/status
```

Do not use a remote host for normal local development.

## Simple Dashboard Smoke

Start the backend:

```bash
python -m arclm web-api --host 127.0.0.1 --port 8765
```

Start the production frontend after `npm run build`:

```bash
cd web
npm run start -- --hostname 127.0.0.1 --port 3125
```

Open:

```text
http://127.0.0.1:3125/
```

Verify that the dashboard shows the connected backend state, ArcLM version,
device summary, core capabilities, and Web progress. Stop the backend and use
Refresh or Retry to confirm the disconnected state. Restart the backend and
verify the page can reconnect.

## Advanced Dashboard Smoke

With the same backend and production frontend running, switch the top-bar mode
control to `Advanced`.

Verify:

- runtime details render without private paths
- hardware details show CPU or GPU information from the backend
- capability matrix uses real capability statuses
- validation and integration sections use safe project-status data
- limitations are clearly labeled
- backend diagnostics show endpoint success or failure
- the API response inspector is hidden until opened and has no arbitrary URL
  input

Switch back to `Simple` and verify the technical sections are hidden.

## Internal Design System Route

```text
/design-system
```

This route is for local component review. It is not a public marketing page and
does not show fake ArcLM metrics or fake backend data.

## Application Shell Checks

After a production build, run:

```bash
cd web
npm run start -- --hostname 127.0.0.1 --port 3124
```

Then open the shell routes listed above. Check the desktop sidebar, collapsed
sidebar, mobile navigation, Simple/Advanced mode switch, theme control, and
planned-page states. The shell should not show fake backend connection status.
## Dataset Inspector Backend

Web Milestone 2 / Feature 2 adds read-only dataset inspection endpoints. Start
the backend with an explicit dataset root:

```bash
python -m arclm web-api --dataset-root workspace=./data
```

Then call:

```text
GET /api/datasets
GET /api/datasets/{dataset_id}/inspection
```

No dataset roots are configured by default. The browser cannot add roots and
cannot pass arbitrary local paths.
