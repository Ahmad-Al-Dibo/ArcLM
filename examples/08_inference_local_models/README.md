# 08 Inference and Local Models

Purpose: generate bounded text from tiny local native models and describe
external local model boundaries.

Prerequisites: base ArcLM installation.

Concepts: greedy generation, sampling controls, local model reload, structured
visible summaries, and manual external-model requirements.

Examples in order:
- `01_generation_sampling.py`
- `02_external_local_model_status.py`
- `03_console_chat.py`

Installation requirements: base dependencies only for verified examples.

Commands:

```powershell
python examples/08_inference_local_models/01_generation_sampling.py
python examples/08_inference_local_models/02_external_local_model_status.py
python examples/08_inference_local_models/03_console_chat.py PATH_TO_MODEL
```

Expected outputs: bounded generated text, source inspection status, or an
interactive console chat when a real local model is supplied.

Verification status: automated for native generation; external loading and
console chat are manual unless a real local model is provided. For Hugging Face
models, install the optional integration with `pip install "arclm[hf]"`.

Current limitations: no streaming generation is demonstrated.

Related ArcLM APIs: `Generator`, `inspect_model_source`.

Next category: `09_pipelines_inspection`.

