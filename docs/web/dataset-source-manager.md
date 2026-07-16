# Dataset Source Manager

Status: Web Milestone 2 / Feature 4 implemented and locally verified.

The Dataset Source Manager lets a local user configure multiple approved
dataset folders from the `/data` page. ArcLM stores folder configuration through
the Python Web API, not in browser local storage.

## What It Adds

- multiple dataset roots
- user-facing source names
- enabled and disabled roots
- optional recursive scanning
- persistent local JSON configuration
- session-only CLI roots
- loopback-only write endpoints
- catalogue refresh after root changes
- Dataset Inspector integration through safe dataset IDs

It does not upload, edit, delete, or move dataset files.

## Browser Path Input

Normal browsers cannot safely return an unrestricted server-side folder path.
For this first local version the user types or pastes the folder path:

```text
D:\ArcLM\data\training
```

There is no fake Browse button and no `webkitdirectory` upload picker.

## Configuration File

Persisted roots are stored as JSON outside the installed Python package.

Default location:

```text
<user home>/.arclm/dataset-roots.json
```

If `ARCLM_CONFIG_DIR` is set, the file is:

```text
<ARCLM_CONFIG_DIR>/dataset-roots.json
```

Tests and controlled deployments may pass an explicit `dataset_config_path` to
`WebConfig`.

The file is written atomically. A corrupt file returns a controlled API error
instead of exposing a stack trace.

## Root Model

Each root record contains:

```json
{
  "root_id": "root_a37f91",
  "name": "Training Data",
  "path": "D:/ArcLM/data/training",
  "enabled": true,
  "recursive": false,
  "source_origin": "persisted"
}
```

The API also returns validation status, dataset counts, ignored file counts, and
safe warnings for the local manager view.

## CLI Roots

The existing CLI option remains supported:

```bash
python -m arclm web-api --dataset-root "training=D:\ArcLM\data\training"
```

CLI roots are merged with persisted roots for the current server session:

```text
persisted roots + command-line roots -> active server roots
```

CLI roots are marked as session-only. They are visible in the UI but cannot be
removed from persistent storage because they were never saved there.

## Validation Rules

The first version allows absolute local directory paths only.

Rejected:

- empty paths
- relative paths
- missing directories
- files instead of directories
- filesystem roots such as `C:\` or `/`
- symlink roots
- UNC/network paths by default
- duplicate source names
- duplicate canonical paths

Nested configured roots are allowed with a warning so the user can avoid
duplicate catalogue entries.

## Recursive Scanning

Recursive scanning is off by default for dashboard-added roots.

Advanced mode can enable it per source. Recursive scans:

- use the configured maximum depth
- ignore unsupported files
- do not follow symlink directory escapes
- report safe warnings when limits are reached

## Security Boundary

Dataset source mutation is local-only.

Write endpoints are disabled when the backend binds to a non-loopback host such
as `0.0.0.0`. Requests from unknown origins are rejected. Responses do not leak
paths through normal dataset catalogue or inspection endpoints.

The manager endpoints are administrative local endpoints. They may return the
configured folder path only inside the Dataset Source Manager API.

## Dataset Catalogue Integration

`GET /api/datasets` still returns safe dataset IDs. It may include a safe source
name or source ID, but it does not return the root path.

After adding, disabling, enabling, removing, or refreshing roots, the `/data`
page reloads the active catalogue. If a selected dataset disappears, the
selection is cleared instead of repeatedly requesting an invalid ID.

## Known Limits

- no upload flow
- no general file browser
- no network folder authentication
- no dataset editing or deletion
- no pipeline execution
- no background worker or WebSocket refresh
