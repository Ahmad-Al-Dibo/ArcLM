# Project 05: Model Benchmark Lab

Goal: benchmark compatible tiny local models using the same tokenizer and data.

Command:

```powershell
python examples/12_complete_projects/05_model_benchmark_lab/main.py
```

Expected behavior: prints a compatibility-aware benchmark summary.

Generated files: none.

Tests: manual/structural only in this phase.

Limitations: compares synthetic randomly initialized models.

Cleanup: no persistent files.

Replace tiny components with signed local checkpoints that share tokenizer and
configuration metadata.

