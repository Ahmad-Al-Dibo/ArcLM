# 00 Quick Start

Purpose: show the smallest useful ArcLM workflows.

Prerequisites: `pip install -e .`

Concepts: loading records, word tokenization, tiny native models, local
inspection, and temporary persistence.

Examples in order:
- `01_first_arclm_workflow.py`
- `02_inspect_text.py`

Installation requirements: base ArcLM dependencies only.

Commands:

```powershell
python examples/00_quick_start/01_first_arclm_workflow.py
python examples/00_quick_start/02_inspect_text.py
```

Expected outputs: compact JSON summaries with token counts and tensor shapes.

Verification status: automated.

Current limitations: the model is randomly initialized and not useful for real
language quality.

Related ArcLM APIs: `load_dataset`, `Tokenizer`, `ArcLM`, `inspect_text`.

Next category: `01_data`.

