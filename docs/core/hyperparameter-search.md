# Hyperparameter Search

Core Milestone 2 / Feature 6 adds a local-first hyperparameter search
foundation in `arclm.search`.

The first version is intentionally small:

- local filesystem storage
- one process
- one trial at a time
- deterministic grid and random trial generation
- one `RunTracker` run per started trial
- metadata-only inspection, validation, listing, and comparison
- best effective configuration export

It does not implement Bayesian optimization, pruning, parallel workers,
distributed search, Optuna, Ray Tune, W&B sweeps, MLflow optimization, Web UI
controls, or automatic model publishing.

## Public API

```python
from arclm.search import (
    ChoiceParameter,
    FloatParameter,
    HyperparameterSearchConfig,
    IntegerParameter,
    ObjectiveConfig,
    SearchSpace,
    SearchStrategy,
    create_search,
    inspect_search,
    validate_search,
)
```

Example:

```python
from arclm.search import (
    ChoiceParameter,
    HyperparameterSearchConfig,
    ObjectiveConfig,
    SearchSpace,
    create_search,
)
from arclm.training import TrainingConfig

config = HyperparameterSearchConfig(
    base_training_config=TrainingConfig(epochs=1, batch_size=1),
    search_space=SearchSpace(
        {
            "training.learning_rate": ChoiceParameter((1e-3, 5e-4)),
            "training.batch_size": ChoiceParameter((1, 2)),
        }
    ),
    objective=ObjectiveConfig(metric="loss", direction="minimize"),
)

search = create_search(config)
try:
    result = search.execute(my_trial_runner)
finally:
    search.close()
```

`my_trial_runner(context)` is ordinary Python code. It should create fresh
runtime objects for the trial, run the existing `Trainer`, `fine_tune()`, or
evaluation workflow, and return a metrics mapping that contains the configured
objective metric.

## Search Space

Supported parameter definitions:

- `ChoiceParameter(values=(...))`
- `IntegerParameter(minimum=..., maximum=..., step=...)`
- `FloatParameter(minimum=..., maximum=..., sampling="linear" | "log")`

Supported first-version paths are allowlisted fields in:

- `training.*`
- `fine_tuning.*`
- `lora.*`

Runtime objects, output paths, devices, run IDs, dataset contents, arbitrary
object traversal, and quantization backend changes are not searchable in this
foundation.

The default maximum planned trial count is `1000`. Developers may raise the
limit explicitly through `HyperparameterSearchConfig.max_trials`.

## Strategies

`grid` creates the deterministic Cartesian product of all parameter values.

`random` requires an explicit `trial_count` and `seed`. It uses a dedicated
Python RNG so global Python, NumPy, and PyTorch training RNG state is not used
for search-space sampling.

## Trial Execution

Each started trial creates one local run manifest through `arclm.tracking`.
The trial record stores:

- trial ID
- status
- overrides
- effective validated configs
- trial fingerprint
- run ID and relative run path
- objective metric and value
- bounded failure message when needed

Search does not copy model weights, checkpoint payloads, adapter artifacts,
final model artifacts, raw datasets, prompts, responses, or external tracking
credentials. Trial runs may reference those outputs through the existing run
manifest contract.

## Failure and Resume

Failure policy:

- `continue`: record the failed trial and keep executing later trials
- `stop`: record the failed trial and mark the search failed

`execute(..., max_trials=N)` can intentionally interrupt a search after a
bounded number of trials. `load_search(path).execute(...)` resumes pending
trials without rerunning completed trials.

Failed trials are not retried by default. Passing `retry_failed=True` allows
one bounded retry for failed trials. Adaptive retry, pruning, and attempt
history analytics are deferred.

## Best Trial

The configured objective uses one metric and one direction:

- `minimize`
- `maximize`

Only completed trials with finite objective values can become the best trial.
Ties are resolved by lower trial index. `HyperparameterSearchResult` can export
the best effective configuration as JSON with `save_best_config(path)`.

## Security Boundary

Search manifests are metadata, not executable code.

ArcLM rejects unknown parameter paths, callables, non-finite parameter values,
unbounded search sizes, unsafe search roots, unsafe relative run references,
duplicate trial IDs, duplicate trial fingerprints, and malformed JSON records.

Inspection and validation do not load models, load checkpoints, initialize
CUDA, import Transformers, import bitsandbytes, execute factories, or read raw
dataset records.

## Validation

Feature 6 added `tests/search` and updated public API tests.

Primary commands:

```bash
python -m pytest tests/search -v
python -m pytest tests/tracking tests/peft tests/unit/training tests/public_api tests/compatibility -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

The CPU runtime validation executes four sequential tiny training trials,
records one run per trial, compares objectives, validates the search, resumes a
second interrupted search, and exports the best effective config.

Optional CUDA search validation and real bitsandbytes QLoRA search validation
remain pending.
