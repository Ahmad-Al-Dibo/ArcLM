# Reproducibility

ArcLM now separates three reproducibility layers:

1. Training checkpoints resume an interrupted training run.
2. Final model artifacts load a trained model for evaluation and inference.
3. Run manifests describe how a run was configured and what outputs it produced.

Run manifests record ArcLM, Python, and PyTorch versions, selected device and
precision summary, CUDA availability summary, explicit seed values, dataset
fingerprints, tokenizer fingerprints, model config fingerprints, checkpoint
format/version, and run manifest version where available.

Run manifests do not copy RNG state. RNG state belongs to training
checkpoints. This keeps run manifests inspectable and safe while checkpoint
resume remains exact where ArcLM supports it.

Reproducibility is evidence-based. A run manifest can show that two runs used
the same recorded configuration and dataset fingerprint, but it does not prove
that external packages, drivers, kernels, or hardware behaved identically.

The current validation gate for this feature is:

```bash
python -m pytest tests/tracking -v
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Real bitsandbytes QLoRA runtime validation remains pending in the optional
runtime matrix and is not converted into a passing local claim by this feature.

## Hyperparameter Search

Core Milestone 2 / Feature 6 adds deterministic local search manifests.

- Grid search uses stable parameter and value ordering.
- Random search uses an explicit seed and a dedicated Python RNG.
- Trial fingerprints include overrides, effective configs, base configs, and
  optional dataset/model/tokenizer fingerprints.
- Search fingerprints exclude timestamps, run IDs, search IDs, and runtime
  object identity.
- Matching fingerprints help detect configuration drift, but do not guarantee
  identical numerical results across hardware.

See [search-manifests.md](search-manifests.md).
