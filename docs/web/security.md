# ArcLM Web Security Notes

The Web UI is a local developer tool, not a production server.

## Defaults

- The modern Web API defaults to `127.0.0.1`.
- The default API port is `8765`.
- The legacy Flask interface keeps its own compatibility launch path and port.
- CORS allows only explicit local frontend origins by default.
- Credentials are not enabled.
- Wildcard CORS is rejected.

## Sensitive Data Exclusions

The Feature 4 backend does not return:

- environment variables
- raw `.env` values
- usernames
- home directories
- absolute repository paths
- model paths
- dataset paths
- prompts or responses
- full stack traces

## Read-Only Scope

Feature 4 endpoints are read-only:

- health
- environment
- capabilities
- project status

They do not start training, run evaluation, load models, generate text, upload
datasets, or mutate project files.

The Feature 5 Simple Dashboard stays inside the same read-only boundary. It
shows only selected safe fields from the Web API, displays CLI commands as text,
and never executes commands from the browser.

Dashboard strings are rendered as normal text. The dashboard must not display
raw JSON, raw project-map content, stack traces, private paths, usernames, API
keys, or environment variables.

The Feature 6 Advanced Dashboard stays inside the same boundary. It can show a
safe API response inspector, but only for already-loaded approved dashboard
responses from health, environment, capabilities, and project status. The
inspector has no arbitrary URL input and cannot execute commands.

Advanced mode may show optional package names and package install status, but
it must not expose full environment variables, private file paths, credentials,
or raw dependency command output.

## Remote Binding

Using `0.0.0.0` or another non-local host is allowed only through explicit
configuration and prints a warning. It is not production-safe without a later
security milestone that adds authentication, authorization, rate limits, and
server hardening.

Dataset source management is stricter than the read-only dashboard endpoints.
The mutation endpoints are disabled by default when the backend is bound to a
non-loopback host, and unknown origins are rejected.

## Error Handling

API errors use a stable JSON format and hide stack traces in normal responses.
Internal details may be logged for local debugging, but request bodies and
secrets should not be logged.

## Known Limits

- No authentication yet.
- No rate limiting yet.
- No audit log yet.
- No production CORS policy yet.
- No secret scanning endpoint.
- No remote deployment hardening.
## Data Pipeline Studio Security Plan

Status: Dataset Inspector Backend, read-only Dataset Inspector UI, and local
Dataset Source Manager are implemented. Upload, saved dataset storage, and
browser-run pipeline execution are not implemented.

Datasets are treated as untrusted data. The browser is not allowed to request
arbitrary local files by path, trigger shell commands, deserialize Python
objects, or start training through the Data Pipeline Studio.

Feature 2 protections:

- dataset roots are configured server-side with `DatasetRoot`
- no roots are configured by default
- the browser receives safe IDs such as `dataset_...`
- absolute paths are not returned in dataset responses
- symlink escapes are ignored
- unsupported file types are ignored by the catalogue
- inspection is bounded by file size, scan rows, preview rows, field count, and
  field length
- TXT, CSV, JSON, and JSONL are the only supported formats
- no upload, mutation, execution, network access, CUDA init, or model loading

Feature 3 UI protections:

- `/data` uses only `GET /api/datasets` and
  `GET /api/datasets/{dataset_id}/inspection`
- selection state stores only a safe `dataset_...` ID in the URL
- path-like or invalid query values are cleared and not requested repeatedly
- dataset names, field names, warnings, and preview values render as plain text
- preview rows are bounded by the backend and are not fetched beyond the
  inspection response
- row details show only already-returned bounded data
- Simple mode hides technical IDs and warning codes
- Advanced mode shows only safe metadata and bounded response data
- no upload, edit, delete, field mapping, shell command, or pipeline execution
  control exists in the UI

Feature 4 Dataset Source Manager protections:

- source mutation requires the backend to run on a loopback host
- allowed origins are checked by the backend
- paths are treated as untrusted input
- only absolute local directories are accepted
- relative paths, missing paths, files, filesystem roots, symlink roots, and
  UNC/network paths are rejected
- duplicate names and duplicate canonical paths are rejected
- nested roots produce warnings to reduce duplicate catalogue entries
- removing a source deletes only ArcLM source configuration, never files
- normal dataset catalogue and inspection responses still do not expose root
  paths
- CLI roots remain session-only unless the user adds a persisted source through
  the dashboard

Before upload or execution is implemented, ArcLM needs:

- strict file type allowlist
- file, row, field, and cell limits
- bounded previews
- parse warnings without stack traces
- no raw dataset rows in normal logs
- manifest/provenance fields for saved datasets
- deletion and retention policy

Blocked until a later approved feature:

- pickle and Python object loading
- archive extraction
- remote dataset URLs
- WebDataset ingestion
- browser-triggered pipeline execution
- training handoff

The detailed upload plan is in
[Dataset Upload Security Plan](dataset-upload-security.md).
