# 08 Inference and Local Models

Purpose: generate bounded text from tiny local native models and describe
external local model boundaries.

Prerequisites: base ArcLM installation.

Concepts: greedy generation, sampling controls, local model reload, structured
visible summaries, and manual external-model requirements.

Examples in order:
- `01_generation_sampling.py`
- `02_external_local_model_status.py`

Installation requirements: base dependencies only for verified examples.

Commands:

```powershell
python examples/08_inference_local_models/01_generation_sampling.py
python examples/08_inference_local_models/02_external_local_model_status.py
```

Expected outputs: bounded generated text and source inspection status.

Verification status: automated for native generation; external loading is
manual unless a real local model is provided.

Current limitations: no streaming generation is demonstrated.

Related ArcLM APIs: `Generator`, `inspect_model_source`.

Next category: `09_pipelines_inspection`.

