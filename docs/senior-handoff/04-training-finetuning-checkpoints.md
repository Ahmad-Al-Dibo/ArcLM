# 04 - Training, Fine-Tuning, Checkpoints

## Training has an old facade and a newer Trainer core

The high-level `train_model()` path in `src/arclm/training/pipeline.py` is the
legacy-friendly workflow. It builds config, prepares data, builds/adapts a model,
runs `Trainer.train()`, then saves an old-style checkpoint at `config.model_path`.

The newer direct path is `Trainer(model=..., train_dataset=..., config=TrainingConfig(...))`.
This path owns:

- device resolution;
- optional DDP wrapping;
- precision helper/autocast/scaler;
- gradient accumulation;
- optimizer/scheduler creation;
- callbacks;
- checkpoint save/load/resume;
- old and new config compatibility.

Do not duplicate training loops in a new feature. Hook into Trainer callbacks or
wrap Trainer setup.

## Tokenizer compatibility is central

Training and fine-tuning are sensitive to tokenizer identity:

- Pretraining may build a tokenizer from data.
- Continue-training requires a compatible checkpoint tokenizer or explicit
  tokenizer.
- Finetuning can adapt checkpoints, but shape and tokenizer assumptions still
  matter.
- Studio requires model vocab size to match tokenizer vocab size before training.

If a bug looks like "bad model output" or "loss is nonsense", check tokenizer
metadata before model weights.

## Fine-tuning/SFT business rules

`src/arclm/finetuning/workflow.py` is the canonical SFT formatter. It supports:

- plain text;
- prompt/completion;
- instruction/response;
- chat messages.

Important hidden rules:

- SFT masks prompt tokens by assigning ignore index labels.
- Chat SFT requires at least one assistant message.
- Response-only SFT can fail if truncation removes all trainable response tokens.
- Formatting fingerprints are used by Studio to prevent stale preview/start
  mismatches.
- Error reports intentionally avoid storing full record contents.

Studio fine-tuning uses the same preparation logic, then adapts features into
the existing Trainer batch contract using `_MaskedTensorDataset`.

## Checkpoint formats

There are two meanings of "save":

- `Trainer.save_checkpoint()` writes resumable checkpoint directories containing
  `training.pt`, optimizer/scheduler/scaler/RNG state, lifecycle metadata and
  training counters.
- `Trainer.save()` writes old-style ArcLM model checkpoints to `config.model_path`
  for compatibility.

Do not confuse final model artifacts with resumable training checkpoints.
`save_model_artifact()` goes through lifecycle APIs and is meant for finished
artifacts, not optimizer resume.

## Resume risks

Resume depends on:

- model architecture;
- tokenizer/vocab;
- optimizer and scheduler compatibility;
- precision/scaler state;
- RNG state;
- old vs new config field names.

The code validates a lot, but not every semantic mismatch. A changed tokenizer
with the same vocab size can still produce wrong behavior. Preserve tokenizer
metadata and test resume with an actual one-step checkpoint when touching this
area.

## Known rough edges

- Some log strings contain mojibake from old checkmark characters, visible as
  `âœ“` in parts of training output.
- `checkpoint_is_compatible_for_tuining` has a misspelled public name; changing
  it directly can break compatibility.
- Workflow training imports a `train` facade from `arclm.training`; verify this
  path before claiming workflow training production-ready.
- Studio training runs in one in-process daemon thread. If the process exits,
  stale runs are marked interrupted on next startup.

