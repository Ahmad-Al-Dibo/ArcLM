# 04 Training

Purpose: show a tiny pre-training-style optimization step.

Prerequisites: base ArcLM installation with PyTorch.

Concepts: token sequences, next-token labels, loss, optimizer step, and bounded
CPU training.

Examples in order:
- `01_tiny_pretraining_step.py`

Installation requirements: base dependencies only.

Commands:

```powershell
python examples/04_training/01_tiny_pretraining_step.py
```

Expected outputs: initial and final loss for one tiny update.

Verification status: automated.

Current limitations: this is a single educational optimization step, not a
quality training run.

Related ArcLM APIs: `Tokenizer`, `ArcLM`.

Next category: `05_finetuning`.

