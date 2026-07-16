# Experiment Tracking

Core Milestone 2 / Feature 5 adds local, dependency-free experiment tracking
for ArcLM runs.

Core Milestone 2 / Feature 6 uses this tracking layer for hyperparameter
search. Each started trial creates one ordinary local run, and the search
manifest stores only a relative reference plus bounded objective metadata.

The stable public API lives in `arclm.tracking`:

```python
from arclm.tracking import (
    RunConfig,
    RunStatus,
    RunTracker,
    create_run,
    inspect_run,
    validate_run,
    list_runs,
    compare_runs,
)
```

The tracker records a local run directory with:

- `manifest.json`
- `events.jsonl`
- `metrics.jsonl`
- `summaries/`
- `references/`
- `.run.lock`

The manifest records safe metadata only. It can include training config,
fine-tuning config, PEFT and QLoRA config, model identity, tokenizer identity,
dataset fingerprints, checkpoint references, adapter artifact references, final
model artifact references, runtime environment summary, and reproducibility
metadata.

It does not store raw datasets, raw prompts or completions, environment
variables, usernames, hostnames, optimizer state, scheduler state, scaler state,
or external service credentials.

External service trackers such as MLflow and Weights & Biases remain optional
compatibility paths. They are imported lazily only when those legacy backends
are explicitly requested. The stable Community workflow is the local run
manifest.

## Basic Usage

```python
from arclm.tracking import RunConfig, create_run

with create_run(RunConfig(name="tiny run")) as run:
    run.start()
    run.record_metric(metrics={"loss": 1.23}, step=1)
    run.complete({"final_loss": 1.23})
```

Trainer integration is available through `RunTrackingCallback`:

```python
from arclm.tracking import RunTrackingCallback, create_run

run = create_run(name="training run")
trainer = Trainer(..., callbacks=[RunTrackingCallback(run)])
```

The callback records start, step metrics, evaluation metrics, checkpoint
references, completion, and explicit failure/interruption hooks when the trainer
or caller invokes them.

## Validation

Run manifests can be inspected and validated without loading models or optional
tracking services:

```python
from arclm.tracking import inspect_run, validate_run

info = inspect_run("runs/run_...")
validate_run("runs/run_...")
```

`inspect_run()` tolerates a truncated final JSONL line and reports a warning.
Other malformed records are treated as invalid.

## Comparison

`compare_runs()` compares a small local set of runs by metric name. It reports
first, last, best, and count for the selected metric. This is intentionally not
a hyperparameter-search engine.

## Compatibility

`ExperimentTracker`, `create_experiment()`, and `list_experiments()` remain
available for old examples. Local compatibility tracking now writes through the
same run-manifest backend.
