# 03 Models

Purpose: create tiny native ArcLM models and persist local state.

Prerequisites: base ArcLM installation with PyTorch.

Concepts: configuration, forward pass shape, parameter count, state dict save
and reload, and capability reports.

Examples in order:
- `01_create_tiny_model.py`
- `02_save_and_load_state.py`

Installation requirements: base dependencies only.

Commands:

```powershell
python examples/03_models/01_create_tiny_model.py
python examples/03_models/02_save_and_load_state.py
```

Expected outputs: JSON model summaries.

Verification status: automated.

Current limitations: examples use randomly initialized models.

Related ArcLM APIs: `ArcLM`, `model_support_matrix`.

Next category: `04_training`.

