# Dataset Storage Plan

Status: planning only. No persistent Data Pipeline Studio dataset store is
implemented.

Feature 2 adds only an in-memory, per-request catalogue over configured
server-side roots. It does not copy files, upload files, create manifests, or
persist dataset metadata.

The Studio needs a local storage model before upload, saved previews, pipeline
manifests, or training handoff can be stable.

## Goals

- avoid exposing absolute paths to the browser
- keep dataset content local
- support reproducible pipeline manifests
- allow deletion and cleanup
- keep Web API responses small and safe

## Proposed Local Layout

The exact path is not approved yet. A future implementation may use a project
workspace such as:

```text
.arclm/
  datasets/
    <dataset_id>/
      manifest.json
      source.jsonl
      previews/
  pipelines/
    <pipeline_id>.json
```

This is a proposal only.

## Dataset Manifest Draft

```json
{
  "dataset_id": "ds_...",
  "name": "Local dataset",
  "format": "jsonl",
  "created_with": "0.6.1",
  "content_hash": "sha256:...",
  "row_count": 1000,
  "fields": ["text"],
  "source_kind": "uploaded",
  "created_at": "2026-07-15T00:00:00Z"
}
```

Do not include:

- usernames
- home directories
- absolute source paths
- environment variables
- secrets

## Retention

Retention policy is not implemented. Future work must define:

- when temporary previews are removed
- how uploaded datasets are deleted
- whether derived datasets are retained
- how storage usage is reported

## Training Handoff

Training handoff should use a safe dataset reference and manifest, not raw UI
state. Dataset-to-model workflows belong to a later feature after the Studio
can inspect, preview, and save pipeline manifests.
