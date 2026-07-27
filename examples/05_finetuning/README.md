# 05 Fine-Tuning

Purpose: preview canonical SFT preparation and run a tiny SFT-style update.

Prerequisites: base ArcLM installation with PyTorch.

Concepts: instruction/response records, label masks, response-only labels, and
one bounded local update.

Examples in order:
- `01_preview_sft_data.py`
- `02_tiny_sft_step.py`

Installation requirements: base dependencies only.

Commands:

```powershell
python examples/05_finetuning/01_preview_sft_data.py
python examples/05_finetuning/02_tiny_sft_step.py
```

Expected outputs: prepared record preview and one-step loss.

Verification status: automated.

Current limitations: PEFT/QLoRA examples are manual/deferred in the manifest.

Related ArcLM APIs: `FineTuningConfig`, `prepare_fine_tuning_record`,
`prepare_fine_tuning_dataset`.

Next category: `06_checkpoints`.

