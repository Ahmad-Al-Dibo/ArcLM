# Gemma ArcLM Example

This folder shows a Gemma workflow without changing `arclm/` itself:

1. `usage.py` loads a base Gemma model and optionally loads a PEFT LoRA adapter.
2. `training.py` fine-tunes Gemma with ArcLM SFT and saves a LoRA adapter.
3. `adapter.py` creates an ArcLM model/tokenizer adapter fallback from public base classes when no adapter is available.

The default model is `google/gemma-2-2b-it`. You may need to accept the model
license on Hugging Face and be logged in with `huggingface-cli login`.

## Install

```bash
pip install -e ".[peft]"
```

## Usage

PowerShell:

```powershell
.\.venv\Scripts\python.exe examples/gemma/usage.py
```

Cross platform:

```bash
python examples/gemma/usage.py
```

If `examples/gemma/output/gemma_lora/adapter_config.json` exists, `usage.py`
loads it with PEFT. If it does not exist, the script keeps the base model and
creates an ArcLM adapter wrapper from `BaseModelAdapter` / `BaseTokenizerAdapter`
through `examples/gemma/adapter.py`.

## Training

PowerShell:

```powershell
.\.venv\Scripts\python.exe examples/gemma/training.py --max-steps 10
```

Cross platform:

```bash
python examples/gemma/training.py --max-steps 10
```

For a tiny smoke run, keep `--max-steps` small. For a real run, remove it and
adjust `--num-epochs`, `--max-length`, and batch settings for your GPU.

## Adapter Fallback

The fallback is intentionally local to this example:

```python
from adapter import build_model_adapter

arclm_model = build_model_adapter(hf_model)
```

The builder first tries ArcLM's generic `ModelAdapter`. If that adapter is not
available in the installed version, it returns `GemmaCausalLMAdapter`, a small
class that subclasses `BaseModelAdapter` and returns ArcLM-style `loss` and
`logits`.
