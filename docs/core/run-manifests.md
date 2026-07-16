# Run Manifests

ArcLM run manifests are local JSON records for reproducible training,
fine-tuning, and evaluation runs.

```json
{
  "run_format": "arclm-experiment-run",
  "run_version": 1,
  "run_id": "run_...",
  "name": "example",
  "status": "completed",
  "operation": "training",
  "training_method": "full_fine_tuning",
  "config": {},
  "model": {},
  "tokenizer": {},
  "dataset": {},
  "peft": {},
  "quantization": {},
  "environment": {},
  "reproducibility": {},
  "outputs": {},
  "summaries": {},
  "fingerprint": "runfp_..."
}
```

Valid statuses are `created`, `running`, `interrupted`, `completed`, and
`failed`.

Valid operations are `training`, `fine_tuning`, and `evaluation`.

Valid training methods are `full_fine_tuning`, `lora`, and `qlora`.

## Search Trial Runs

Core Milestone 2 / Feature 6 records hyperparameter-search trial metadata in
normal run manifests. The run summary may include the parent search ID, trial
ID, trial fingerprint, search strategy, objective definition, and overrides.

The search manifest links to the run by relative path. Run manifests remain
independently inspectable and are not copied into the search summary.

The fingerprint is derived from reproducible fields such as configs, model
metadata, tokenizer metadata, dataset fingerprint, PEFT/quantization metadata,
and bounded reproducibility metadata. It is useful for detecting drift. It is
not a cryptographic identity for the whole run directory.

Output references store safe reference names and fingerprints. They do not
expose absolute checkpoint, adapter, or artifact paths in the manifest.

The manifest is written atomically. Metric and event streams are append-only
JSONL files. A lock file prevents two local writers from editing the same run at
the same time.
