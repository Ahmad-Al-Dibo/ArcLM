# Fine-Tuning and SFT

Core Milestone 2 / Feature 1 stabilizes ArcLM full-parameter fine-tuning and
supervised fine-tuning for causal language modeling. Core Milestone 2 / Feature
2 adds built-in LoRA through the same workflow. Core Milestone 2 / Feature 3
adds the QLoRA configuration and quantized-runtime boundary without adding a
second training loop. Core Milestone 2 / Feature 4 verifies tiny local Hugging
Face CPU runtime and CUDA LoRA runtime while keeping real bitsandbytes QLoRA
runtime pending.

## Status

Implemented and verified for the native CPU workflow.

Evidence:

- Implementation: `src/arclm/finetuning`
- Public API:
  - `FineTuningMode`
  - `FineTuningConfig`
  - `FineTuningResult`
  - `PreparedFineTuningDataset`
  - `prepare_fine_tuning_dataset`
  - `fine_tune`
  - existing `SFTConfig`, `FullFineTuner`, `SFTTrainer`
- PEFT API:
  - `LoRAConfig`
  - `QLoRAConfig`
  - `QuantizationConfig`
  - `fine_tune(..., peft_config=...)`
  - `FineTuningResult.save_adapter_artifact()`
  - `FineTuningResult.save_model_artifact(..., merge_adapter=True)`
- Focused tests: `tests/unit/finetuning`
- Runtime tests:
  - `tests/smoke/test_full_finetuning.py`
  - `tests/smoke/test_sft_training.py`
  - `tests/smoke/test_finetuning_workflow.py`

## Supported Modes

| Mode | Status | Notes |
| ---- | ------ | ----- |
| `causal_lm` | Implemented | Plain causal language modeling with all tokens trainable. |
| `supervised_fine_tuning` | Implemented | Prompt/instruction/chat workflows with prompt masking by default. |

The mode is explicit and serialized through `FineTuningConfig`. ArcLM does not
infer classification, NER, seq2seq, multimodal, or preference-training tasks
from column names.

## Configuration Boundary

`TrainingConfig` owns training runtime settings:

- epochs
- batch size
- optimizer and scheduler
- precision
- checkpoint cadence
- device

`FineTuningConfig` owns data and label settings:

- mode
- formatter
- max sequence length
- prompt masking
- EOS behavior
- truncation
- padding
- dataset schema fields
- strict or bounded invalid-record handling

`FineTuningConfig.to_dict()` and `FineTuningConfig.from_dict()` provide a
JSON-safe round trip. Unknown fields are rejected.

## Supported Record Schemas

| Schema | Required fields | Optional fields | Formatter |
| ------ | --------------- | --------------- | --------- |
| Plain text | `text` | none | `plain_text` |
| Prompt/completion | `completion` | `prompt` may be empty | `prompt_completion` |
| Instruction/response | `instruction`, `response` or compatible `output` | `input` | `instruction_response` |
| Chat | `messages` list with `system`, `user`, `assistant` roles | none | `chat` |

Unknown record fields are ignored. Source records are not mutated.

## Formatting and Masking

The stable workflow normalizes records into explicit text segments before
tokenization. Each segment is marked trainable or not trainable, so prompt and
assistant masking do not depend on decoded string search.

Default SFT masking:

- system and user text: masked with `ignore_index`
- prompt/instruction/input text: masked unless `train_on_prompt=True`
- assistant/response text: trainable
- padding: masked
- EOS: trainable when it belongs to a trainable response segment

Chat records reject unknown roles and require at least one non-empty assistant
message for SFT.

## Tokenization Output

Prepared examples use the stable causal-LM contract:

```text
input_ids
attention_mask
labels
```

`PreparedFineTuningDataset` stores only token ids, masks, labels, and a safe
report. It does not store raw examples in reports.

## Truncation, Padding, and Packing

- Right truncation is implemented for the stable workflow.
- Fully masked examples after truncation are rejected.
- Dynamic padding is the default through the existing `SFTDataCollator`.
- Fixed `max_length` padding remains available through `SFTConfig`.
- Stable workflow packing is deliberately disabled in `FineTuningConfig`.

The older `SFTConfig(packing=True)` path remains available and tested for the
existing collator, but it is not the recommended stable workflow for new SFT
features until a larger packing/attention-mask design is approved.

## Dataset Report and Fingerprint

`prepare_fine_tuning_dataset()` returns a `PreparedFineTuningDataset` with a
`FineTuningDatasetReport`.

The report includes:

- records seen
- valid records
- rejected records
- truncated records
- total tokens
- trainable tokens
- deterministic dataset fingerprint
- bounded validation errors

The fingerprint is based on safe processed token data and configuration. It is
useful for provenance and comparison, but it is not a signature and does not
prove authorship.

## Training Workflow

The `fine_tune()` helper uses:

```text
records
-> prepare_fine_tuning_dataset
-> SFTDataCollator
-> FullFineTuner
-> Trainer
-> checkpoints/evaluation/final artifact
```

There is no second training loop.

For LoRA, `fine_tune()` applies PEFT after dataset preparation and before the
`FullFineTuner` creates the `Trainer`. The optimizer receives only trainable
parameters, so frozen base parameters are not optimized by default.

The CPU runtime test verifies:

- dataset validation
- tokenization and prompt masking
- native ArcLM full-parameter training
- finite loss
- parameter changes
- evaluation
- checkpoint save
- resume with new model and trainer objects
- final model artifact save
- artifact validation
- artifact reload on CPU
- inference after reload

Additional LoRA CPU runtime verifies:

- target planning and adapter injection
- base parameter freezing
- adapter-only training
- checkpoint/resume with new model and trainer objects
- adapter artifact save, inspection, validation, and reload
- merge/unmerge output equivalence
- merged final model artifact reload, evaluation, and inference

QLoRA boundary tests verify:

- QLoRA and quantization config validation
- optional bitsandbytes/Transformers dependency reporting
- capability status without loading a model
- rejection of unquantized base models
- quantized-module fixture preparation and base freezing
- adapter artifact metadata with `method="qlora"`
- full-precision base reload and merge path for QLoRA adapter metadata
- rejection of direct final-artifact merge from a quantized runtime model

Real bitsandbytes 4-bit model loading and real GPU QLoRA training were not
executed because bitsandbytes is unavailable in the current validation
environments. Runtime evidence is tracked in
[runtime-validation-matrix.md](runtime-validation-matrix.md).

Core Milestone 2 / Feature 5 records fine-tuning runs through
`RunTracker.record_fine_tuning_result()`. The manifest stores safe
`FineTuningConfig`, `TrainingConfig`, dataset report/fingerprint, tokenizer
summary, LoRA/QLoRA config, quantization config, checkpoint references, and
evaluation metrics without raw records or private paths.

## External Models

Standard PyTorch causal language models can use the existing
`ModelAdapter`/`TokenizerAdapter` boundary. The runtime tests cover custom
external PyTorch-style adapters for SFT.

Hugging Face full fine-tuning remains optional. Feature 4 verifies a tiny local
Hugging Face model through artifact save/load, fine-tuning checkpoint/resume,
evaluation, and built-in LoRA adapter reload/merge. The legacy
`train_sft(backend="huggingface")` path is preserved as compatibility code.

The legacy optional `train_sft(use_lora=True)` path remains compatibility code.
The stable ArcLM-owned LoRA contract is `arclm.peft.LoRAConfig` plus
`fine_tune(..., peft_config=...)`.

## Security

Fine-tuning treats datasets and tokenizer/model folders as untrusted input.

Implemented guardrails:

- no `eval`
- no `exec`
- no serialized Python callables in `FineTuningConfig`
- no hidden network access in the native workflow
- no raw examples in reports or artifact summaries
- bounded validation errors
- optional dependencies stay optional
- final artifacts do not contain optimizer, scheduler, scaler, or RNG state

## Limitations

- Stable packing is disabled for the new workflow.
- Hugging Face tiny-local runtime is verified, but broad HF architecture
  coverage remains pending.
- GPU LoRA runtime is verified on GTX 1050 Ti, but broad GPU fine-tuning and
  performance coverage remain pending.
- QLoRA real runtime validation requires the optional `arclm[qlora]`
  dependencies, a supported CUDA GPU, and a bitsandbytes wheel that supports
  that stack.
- Mid-epoch dataloader position is still not restored by checkpoints.
- QLoRA, DPO, RLHF, GRPO, DDP, FSDP, model serving, and Web features are not
  part of this feature.
- External `peft` package automation remains pending; Feature 4 validated
  ArcLM-owned built-in LoRA on tiny Hugging Face models.

## Hyperparameter Search Boundary

Core Milestone 2 / Feature 6 can search approved `training.*`,
`fine_tuning.*`, and `lora.*` config paths while reusing `fine_tune()`,
`Trainer`, and run manifests. QLoRA search remains a configuration/capability
boundary until real bitsandbytes runtime validation passes.
