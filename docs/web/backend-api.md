# ArcLM Local Web Backend API

Web Milestone 1 / Feature 4 adds a small read-only FastAPI backend for the
modern ArcLM Web UI. Feature 5 uses those endpoints for the Simple Dashboard.
Feature 6 extends the safe schemas used by the Advanced Dashboard.

## Purpose

The backend connects the browser to existing ArcLM Python APIs through validated
response schemas:

```text
Browser
-> ArcLM Local Web API
-> existing ArcLM Python APIs
-> validated JSON response
-> Browser
```

It does not duplicate training, evaluation, inference, checkpoint, CLI, or data
pipeline logic.

## Install

The modern backend is optional:

```bash
pip install "arclm[web]"
```

The `web` extra currently includes:

- Flask `>=3,<4` for the legacy simple interface
- FastAPI `0.139.0` for the modern API
- Uvicorn `0.51.0` for local ASGI serving

FastAPI and Uvicorn currently require Python `>=3.10`. ArcLM core imports still
work without these packages.

## Public API

```python
from arclm.web import WebConfig, create_app

app = create_app()
```

`create_app()` creates the app but does not start a server, load a model, scan a
project, or initialize CUDA.

## Local Launch

```bash
python -m uvicorn arclm.web.app:create_app --factory --host 127.0.0.1 --port 8765
```

or:

```bash
python -m arclm web-api --host 127.0.0.1 --port 8765
```

The default host is `127.0.0.1`. Binding to `0.0.0.0` or another non-local host
prints a warning and is not production-safe without a later security milestone.

## Endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/api/health` | Fast API health check |
| GET | `/api/environment` | Safe runtime summary |
| GET | `/api/capabilities` | Evidence-based capability status |
| GET | `/api/project/status` | Small safe project/web milestone status |
| GET | `/docs` | Local OpenAPI docs, enabled by default |
| GET | `/openapi.json` | OpenAPI schema, enabled by default |

## Response Notes

The environment endpoint may include:

- ArcLM version
- Python version
- platform name
- PyTorch version
- CUDA availability
- CUDA runtime
- device count
- preferred device
- safe GPU name, VRAM bytes, and compute capability

It intentionally excludes:

- usernames
- home directories
- absolute repository paths
- environment variables
- raw `.env` values
- `nvidia-smi` output
- model paths
- dataset paths

The project-status endpoint returns only safe structured fields for the Web UI:

- project name and version
- current Web milestone name, feature, and status
- available route section names
- completed Web foundation items
- current Web feature
- next Web items
- compact planned Web feature summaries
- validation summaries for local and external hardware paths
- optional integration summaries
- known local limitations

It does not expose raw planning documents, full roadmap text, absolute paths,
owner notes, or `[ORPHANS & PENDING]`.

The capabilities endpoint can include optional evidence fields:

- `evidence`
- `hardware_requirement`
- `optional_dependency`
- `product_state`

These fields are static, safe summaries. They are not command output and do not
scan local projects.

Additional status values used by the dashboard include:

- `verified_for_correctness`
- `unsupported`
- `pending_cloud_validation`
- `hardware_unavailable_locally`
- `not_implemented`

## Error Format

Errors use:

```json
{
  "error": {
    "code": "internal_error",
    "message": "An unexpected server error occurred."
  }
}
```

Normal API responses do not include stack traces or absolute paths.

## CORS

Default allowed origins:

```text
http://127.0.0.1:3000
http://localhost:3000
```

Wildcard CORS is rejected by configuration. Credentials are not enabled.

## Legacy Flask Relationship

Legacy Flask interface:

```bash
python -m arclm --run simple-interface
```

Modern Web API:

```bash
python -m arclm web-api
```

The Flask interface remains a compatibility/experimental simple interface. The
modern API is a separate backend for the Next.js application.

## Current Limits

- The Simple Dashboard is read-only and shows only a compact subset of endpoint
  data.
- The Advanced Dashboard is read-only and shows technical details from the same
  approved endpoint data.
- No training controls.
- No model serving.
- No WebSocket or Server-Sent Events.
- No authentication.
- No remote cloud access.
## Data Pipeline Studio API

Status: Web Milestone 2 / Feature 2 implements the read-only Dataset Inspector
Backend.

Implemented endpoints:

```text
GET /api/datasets
GET /api/datasets/{dataset_id}/inspection
```

These endpoints inspect only files inside server-configured dataset roots. The
browser uses safe dataset IDs and never sends local paths.

Planned later endpoints include:

- `GET /api/data/pipeline/steps`
- `POST /api/data/pipeline/preview`
- pipeline manifest save/load endpoints

See [Data Pipeline Studio API Plan](data-pipeline-api.md) for the draft
contracts.
