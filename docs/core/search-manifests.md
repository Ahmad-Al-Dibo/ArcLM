# Search Manifests

`docs/core/search-manifests.md` is the canonical persisted-format note for
Core Milestone 2 / Feature 6.

## Directory Layout

```text
searches/
└── search_<id>/
    ├── manifest.json
    ├── trials.jsonl
    ├── events.jsonl
    ├── summaries/
    │   └── results.json
    └── runs/
        └── run_<id>/
```

The search directory stores metadata and relative references to trial runs. It
does not copy run directories, checkpoint payloads, model artifacts, adapter
artifacts, model weights, datasets, prompts, responses, or credentials.

## Manifest

Current format:

```text
search_format = "arclm-hyperparameter-search"
search_version = 1
```

Important manifest fields:

- `search_id`
- `name`
- `status`
- `strategy`
- `objective`
- `search_space`
- `base_configs`
- `seed`
- `max_trials`
- `planned_trials`
- `completed_trials`
- `failed_trials`
- `interrupted_trials`
- `skipped_trials`
- `resume_count`
- `best_trial_id`
- `best_run_id`
- `best_objective`
- `search_fingerprint`
- timestamps
- bounded `result_summary`

The manifest is JSON-safe and updated atomically.

## Trial Records

`trials.jsonl` stores one safely rewritten JSONL record per planned trial.
Fields include:

- `trial_id`
- `trial_index`
- `status`
- `overrides`
- `effective_config`
- `fingerprint`
- `run_id`
- relative `run_path`
- objective metric and value
- bounded error code and message
- timestamps
- duration
- attempt and retry count

Trial records are summaries. Full metric streams remain in the linked run
directory.

## Events

`events.jsonl` is append-only. Events contain:

- format version
- sequence number
- UTC timestamp
- event type
- bounded payload

Known events include search creation/start/resume/completion/failure,
trial start/completion/failure/interruption, and best-trial updates.

## Fingerprints

The search fingerprint includes:

- format and version
- strategy
- objective
- search space
- base configs
- seed
- planned trial count

The trial fingerprint includes:

- overrides
- effective trial configs
- base configs
- optional dataset/model/tokenizer fingerprints

Fingerprints exclude timestamps, run IDs, search IDs, host information, and
runtime object identity. Matching fingerprints help detect configuration drift;
they do not guarantee identical numerical results across hardware.

## Validation

`validate_search(path)` checks:

- directory and manifest presence
- manifest JSON shape
- format and version
- trial count consistency
- unique trial IDs
- unique trial fingerprints
- safe relative run references
- run-reference existence for terminal started trials
- best-trial consistency

Validation does not load models, checkpoints, artifacts, datasets, optional
model dependencies, CUDA, or user factories.
