# 07 Evaluation and Benchmarks

Purpose: calculate small local metrics and benchmark summaries.

Prerequisites: base ArcLM installation with PyTorch.

Concepts: loss, perplexity, token accuracy, top-k prediction, and concept
benchmark scoring.

Examples in order:
- `01_evaluation_metrics.py`

Installation requirements: base dependencies only.

Commands:

```powershell
python examples/07_evaluation_benchmarks/01_evaluation_metrics.py
```

Expected outputs: JSON metrics with finite values.

Verification status: automated.

Current limitations: benchmark data is synthetic and tiny.

Related ArcLM APIs: `calculate_perplexity`, `Accuracy`, `predict_top_k`.

Next category: `08_inference_local_models`.

