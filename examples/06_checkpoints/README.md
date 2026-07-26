# 06 Checkpoints

Purpose: save, reload, validate, and inspect local trusted checkpoints.

Prerequisites: base ArcLM installation with PyTorch.

Concepts: checkpoint payloads, tokenizer metadata, safe inspection metadata,
and trusted local loading boundaries.

Examples in order:
- `01_checkpoint_lifecycle.py`

Installation requirements: base dependencies only.

Commands:

```powershell
python examples/06_checkpoints/01_checkpoint_lifecycle.py
```

Expected outputs: checkpoint format and metadata summary.

Verification status: automated.

Current limitations: PyTorch checkpoints are trusted legacy artifacts; strict
secure loading is covered in the Security category.

Related ArcLM APIs: `safe_load_training_checkpoint`, `inspect_checkpoint`.

Next category: `07_evaluation_benchmarks`.

