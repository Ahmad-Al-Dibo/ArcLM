# Data Pipeline Studio API Plan

Status: Web Milestone 2 / Feature 2 implemented the first read-only Dataset
Inspector Backend.

The browser must call the local ArcLM Web API. It must not shell out to CLI
commands or parse terminal output.

## Existing Reusable APIs

| Need | Current API | Notes |
| ---- | ----------- | ----- |
| Load data | `arclm.datasets.load_dataset`, `DatasetLoader` | Works for files, lists, and streamable local paths |
| Clean data | `arclm.datasets.cleaning` steps | Source-owned simple steps |
| Compose steps | `DataPipeline` | Ordered execution only |
| Deduplicate | `ExactDeduplicator`, `deduplicate` | Detailed result exists outside `DataPipeline` |
| Preprocess JSONL | `PreprocessPipeline` | Path-based JSONL flow with reports |
| Format SFT examples | `arclm.finetuning.formatting` | Text, instruction, prompt-response, chat |
| Collate SFT batches | `SFTDataCollator` | Training-side, not a web preview API |

## Proposed Endpoint Order

| Feature | Endpoint | Status | Purpose |
| ------- | -------- | ------ | ------- |
| Feature 2 | `GET /api/datasets` | Implemented | Read-only dataset catalogue |
| Feature 2 | `GET /api/datasets/{dataset_id}/inspection` | Implemented | Read-only bounded dataset inspection |
| Feature 3 | no new endpoint expected | Planned | UI consumes inspector |
| Feature 4 | `GET /api/data/pipeline/steps` | Planned | List approved step configs |
| Feature 5 | `POST /api/data/pipeline/preview` | Planned | Run bounded preview with step results |
| Feature 6 | `POST /api/data/pipeline/manifests` | Planned | Save pipeline manifest locally |
| Feature 6 | `GET /api/data/pipeline/manifests/{id}` | Planned | Load saved manifest |
| Later | upload endpoints | Planned | Only after upload security is approved |
| Later | execution endpoints | Planned | Only after dry run, cancellation, and events |

## Implemented `GET /api/datasets`

Returns a safe catalogue of supported dataset files from configured server-side
roots.

Response:

```json
{
  "datasets": [
    {
      "dataset_id": "dataset_7d92e8c1a2b3",
      "name": "sample.jsonl",
      "format": "jsonl",
      "size_bytes": 482194
    }
  ],
  "count": 1
}
```

## Implemented `GET /api/datasets/{dataset_id}/inspection`

Optional query:

```text
preview_rows=20
```

The server validates this value against configured limits.

Response:

```json
{
  "dataset_id": "dataset_7d92e8c1a2b3",
  "name": "sample.jsonl",
  "format": "jsonl",
  "size_bytes": 482194,
  "encoding": "utf-8",
  "fields": [
    {
      "name": "text",
      "type": "string",
      "nullable": false,
      "observed_in_rows": 20,
      "missing_count": 0,
      "empty_count": 0
    }
  ],
  "preview_rows": [
    {"row_id": "0", "values": {"text": "hello"}}
  ],
  "statistics": {
    "rows_scanned": 20,
    "row_count": 20,
    "row_count_scope": "exact",
    "field_count": 1,
    "field_count_scope": "sample",
    "invalid_row_count": 0,
    "duplicate_count": 0,
    "duplicate_scope": "bounded_scan",
    "text_lengths": {"min": 5, "max": 5, "average": 5.0}
  },
  "metadata": {
    "scanned_rows": 20,
    "preview_rows": 20,
    "scan_limit": 10000,
    "preview_limit": 20,
    "max_field_length": 2000,
    "max_fields": 200,
    "truncated": false,
    "complete": true,
    "schema_source": "sample"
  },
  "warnings": []
}
```

Not allowed:

- arbitrary absolute paths from the browser
- file upload
- remote URLs
- shell commands
- Python callables
- pipeline execution
- training handoff

Historical note: Feature 1 drafted `POST /api/data/inspect`. Feature 2 chose
the safer read-only REST shape above so the browser can list server-approved
datasets before inspecting by safe ID.

## Step Registry Draft

Future step metadata should be static and explicit.

```json
{
  "steps": [
    {
      "type": "normalize_whitespace",
      "name": "Normalize whitespace",
      "category": "cleaning",
      "status": "available",
      "input": "rows",
      "output": "rows",
      "config_schema": {}
    }
  ]
}
```

The registry should include only real steps that can run through existing ArcLM
code. Planned steps must remain visibly planned.

## Pipeline Preview Draft

Future preview should return step-level metadata:

```json
{
  "pipeline_id": null,
  "status": "completed",
  "steps": [
    {
      "step_id": "step-1",
      "type": "normalize_whitespace",
      "input_count": 50,
      "output_count": 50,
      "changed_count": 12,
      "removed_count": 0,
      "warnings": []
    }
  ],
  "preview": {
    "before": [],
    "after": []
  }
}
```

## Error Format

Data Pipeline Studio endpoints should reuse the current Web API error format:

```json
{
  "error": {
    "code": "invalid_dataset_source",
    "message": "The dataset source is not allowed."
  }
}
```

Errors must not include stack traces, absolute paths, environment variables, or
raw private file contents.

Implemented dataset error codes:

- `dataset_not_found`
- `dataset_format_unsupported`
- `dataset_too_large`
- `dataset_read_failed`
- `dataset_encoding_invalid`
- `dataset_shape_invalid`
- `dataset_inspection_limit_invalid`
- `dataset_catalogue_too_large`
