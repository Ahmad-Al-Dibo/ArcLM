# Dataset Storage Plan

Status: partial implementation. Web Milestone 2 / Feature 4 implemented
persistent local dataset source configuration. No persistent uploaded dataset
store is implemented.

Feature 2 adds only an in-memory, per-request catalogue over configured
server-side roots. Feature 3 adds a read-only browser inspector for that
catalogue and bounded inspection data. Feature 4 adds persisted source roots in
a small JSON file. These features do not copy files, upload files, create
manifests, or persist dataset metadata.

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

## Implemented Source Configuration

Dataset roots are stored separately from dataset content.

Default:

```text
<user home>/.arclm/dataset-roots.json
```

When `ARCLM_CONFIG_DIR` is set:

```text
<ARCLM_CONFIG_DIR>/dataset-roots.json
```

The file contains only source records such as name, path, enabled state, and
recursive state. It is written atomically and validated when loaded.

Dataset catalogue IDs are derived safely at runtime. The normal catalogue and
inspection endpoints do not return root paths.

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
