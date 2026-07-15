# External Model Support

ArcLM is not limited to native ArcLM models, but support depends on the feature area. The repository does not prove support for every arbitrary model.

| Model type | Supported? | How? |
| ---------- | ---------- | ---- |
| Native ArcLM model | Yes | Direct `ArcLM`/`MiniGPT`, `Trainer`, `FullFineTuner`, `SFTTrainer`, native checkpoint inference |
| Standard PyTorch model | Partial/Yes for training contracts | Works when the model follows the expected forward contract or is wrapped with `finetuning.ModelAdapter` |
| Hugging Face model | Partial | Optional Transformers integration for causal LM inference and legacy `train_sft`; fake HF-style outputs tested for SFT |
| Custom external model | Partial/Yes for SFT | `finetuning.ModelAdapter` supports input/output key mapping and was tested with a custom external model |
| Non-PyTorch model | No | No non-PyTorch runtime bridge is implemented |

## Native ArcLM Models

Evidence:

- Implementation: `src/arclm/models/text/causal_lm.py` — `ArcLM`, `MiniGPT`
- Training: `src/arclm/training/trainer.py`
- Fine-tuning: `src/arclm/finetuning/full.py`
- Inference: `src/arclm/inference/engine.py`
- Tests: `tests/unit/finetuning/test_finetuners.py`, `tests/smoke/test_single_device_training.py`, `tests/smoke/test_full_finetuning.py`

Status: `Implemented`

Native support is strongest for the compact GPT-like causal LM.

## Standard PyTorch Models

Supported contract:

- model has trainable parameters
- model supports `.train()`, `.eval()`, `.to(device)`
- model accepts tokenized tensors directly or through a `ModelAdapter`
- model returns `loss`, `logits`, or logits-only output from which ArcLM can compute causal LM loss

Evidence:

- Implementation: `src/arclm/finetuning/adapters.py` — `ModelAdapter`
- Trainer dict-batch behavior: `src/arclm/training/trainer.py`
- Tests: `tests/unit/finetuning/test_adapters.py`, `tests/unit/finetuning/test_finetuners.py`

Status: `Implemented` for SFT/fine-tuning contracts, `Partially Implemented` for general library-wide external model workflows.

## Hugging Face Models

Supported areas:

- Optional causal LM loading for inference through `load_any_model`
- Optional legacy HF SFT through `train_sft(backend="huggingface")`
- HF-style output object support in `ModelAdapter`
- HF tokenizer/chat-template style support in SFT formatting

Evidence:

- Implementation: `src/arclm/inference/external.py`
- Implementation: `src/arclm/finetuning/sft.py`
- Implementation: `src/arclm/finetuning/adapters.py`
- Tests: fake HF-style model output in `tests/unit/finetuning/test_adapters.py`
- Optional dependency: `transformers`

Status: `Partially Implemented` / `Experimental`

Known limitation: no remote or real local HF model was loaded in the standard CPU test suite during this audit.

## Custom External Models

Custom models can be connected with input/output maps:

```python
from arclm.finetuning import ModelAdapter

adapter = ModelAdapter(
    model,
    input_map={
        "input_ids": "tokens",
        "attention_mask": "mask",
        "labels": "targets",
    },
    output_map={
        "loss": "training_loss",
        "logits": "scores",
    },
)
```

Evidence:

- Implementation: `src/arclm/finetuning/adapters.py`
- Tests: `tests/unit/finetuning/test_adapters.py`
- Smoke: `tests/smoke/test_sft_training.py`

Status: `Implemented` for SFT/fine-tuning adapters.

## Tokenizer Adapters

`TokenizerAdapter` supports tokenizers with one of:

- `encode_text`
- `encode`
- callable tokenizer returning `input_ids`
- optional `apply_chat_template`

Evidence:

- Implementation: `src/arclm/finetuning/adapters.py`
- Tests: `tests/unit/finetuning/test_adapters.py`, `tests/unit/finetuning/test_formatting.py`
- Docs: `docs/finetuning/tokenizer-adapters.md`

Status: `Implemented` for SFT.

## Save And Resume Requirements

Stable path:

- `Trainer.save_checkpoint()` saves model state dict, optimizer, scheduler, scaler and training state.
- `FullFineTuner.save_checkpoint()` also writes `sft_metadata.json`.
- Resume is tested with a new model and trainer instance.

External/HF caveat:

- Generic HF `save_pretrained` behavior exists in external inference save/export helpers, but broad artifact validity was not fully tested.
- Custom adapters need explicit save/load behavior if they cannot use normal PyTorch `state_dict`.

## Input And Output Contracts

For SFT/fine-tuning:

- Inputs: `input_ids`, optional `attention_mask`, optional `labels`
- Outputs: `loss`, `logits`, or logits-only
- Custom names: map through `input_map` and `output_map`

For native training:

- Old ArcLM batches use `x`, `y`, optional `mask`
- New dict batches can pass through model kwargs when they include model-computed loss

## Known Limitations

- No universal non-PyTorch model adapter.
- No stable external model registry.
- No broad HF model-family runtime matrix.
- No proven support for encoder-only, encoder-decoder, vision or multimodal external models.
- PEFT/LoRA paths exist but PEFT was not installed or runtime-tested in this audit.
