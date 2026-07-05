# ArcLM Documentation

This folder contains the maintained project documentation. The root
`README.md` is the public landing page; these files give more direct task and
reference guidance.

## Files

- `USAGE.md`: practical workflows for training, fine-tuning, SFT, inference, data preparation, and troubleshooting.
- `FULL_FEATURE_GUIDE.md`: broader tour of the current ArcLM feature surface.
- `VERSIONING.md`: versioning, release, and documentation-maintenance rules.
- `reference/LIBRARY_README.md`: public API reference grouped by module and workflow.

## Current Public Training Paths

- `train_model(mode="pretrain", ...)`: train a new native ArcLM checkpoint on plain text.
- `train_model(mode="finetune", ...)`: next-token fine-tune an ArcLM-compatible checkpoint on formatted text.
- `train_model(mode="continue_training", ...)`: continue compatible ArcLM pretraining with strict tokenizer checks.
- `train_sft(backend="huggingface", ...)`: Hugging Face causal-LM SFT with assistant-only labels and optional PEFT LoRA.
- `InstructionDataset` plus `Trainer.train(...)`: lower-level ArcLM-native instruction tuning with masked loss.

## Current Limitations

- Preference training such as DPO/RLHF/PPO is not implemented.
- Native LoRA layers for the built-in `ArcLM` model are not implemented.
- `attention_mask` is used by Hugging Face `train_sft()`, but native `ArcLM.forward()` currently accepts token IDs only.
- The package CLI has stale `train` and `eval` commands; use the Python APIs and maintained example scripts.

When the code changes, update the relevant docs in the same change.
