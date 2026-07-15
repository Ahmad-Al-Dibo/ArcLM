# Dataset Upload Security Plan

Status: planning only. Dataset upload is not implemented.

Datasets are untrusted input. The Studio must inspect and store them safely
before any transformation, training, or evaluation workflow can use them.

## Default Policy

- No upload endpoints exist yet.
- No browser path can request arbitrary local files.
- No archive extraction exists.
- No Python object deserialization is allowed.
- No remote dataset downloads are allowed by default.
- No uploaded data is sent to external services.

## Allowed First Formats

These formats are candidates for the first upload implementation:

| Format | Reason | Notes |
| ------ | ------ | ----- |
| TXT | Simple text rows | Treat each non-empty line as a record |
| JSONL | Common for datasets and streamable | Validate each line independently |
| CSV | Common tabular input | Detect headers and encoding safely |
| JSON | Common small structured input | Limit size and nesting |

## Blocked Formats

| Format | Reason |
| ------ | ------ |
| Pickle | Can execute code during loading |
| Python files | Code, not data |
| Archives | Need extraction policy and path traversal protection |
| Binary model files | Not a dataset upload format |
| Remote URLs | Need network and caching policy |

## Required Controls Before Upload

- file size limit
- row count limit for preview
- field count limit
- cell length limit
- encoding handling
- MIME and extension checks
- safe temporary storage
- content hash
- safe generated dataset ID
- no absolute path exposure
- clear deletion policy
- parse warnings and row-level errors

## UI Rules

The browser must not show upload as available until the backend implements the
controls above. Planned upload actions should be visible only as planned
features, not as dead buttons.

## Logging Rules

Do not log raw dataset rows by default. Logs may include safe IDs, counts,
formats, and error codes.
