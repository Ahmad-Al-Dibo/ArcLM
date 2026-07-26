# Qwen Thinking Mode Example

This example shows how to use Qwen's thinking-mode chat-template switch from
ArcLM example code.

The default model is `Qwen/Qwen3-0.6B`.

## What It Does

1. `usage.py` loads Qwen and runs prompts with `enable_thinking=True` by default.
2. `usage.py --compare` runs each prompt twice: thinking disabled, then enabled.
3. `training.py` fine-tunes Qwen with ArcLM SFT and passes `enable_thinking` to ArcLM's Hugging Face SFT path.
4. Outputs are written to `examples/qwen_thinking/output/`.

## Install

```bash
pip install -e ".[hf]"
```

For LoRA training:

```bash
pip install -e ".[peft]"
```

## Usage

PowerShell:

```powershell
.\.venv\Scripts\python.exe examples/qwen_thinking/usage.py
.\.venv\Scripts\python.exe examples/qwen_thinking/usage.py --compare
```

Cross platform:

```bash
python examples/qwen_thinking/usage.py
python examples/qwen_thinking/usage.py --compare
```

Disable thinking explicitly:

```bash
python examples/qwen_thinking/usage.py --no-thinking
```

## Training

PowerShell:

```powershell
.\.venv\Scripts\python.exe examples/qwen_thinking/training.py --max-steps 10
```

Cross platform:

```bash
python examples/qwen_thinking/training.py --max-steps 10
```

Use `--no-thinking` if you want to train the same data with the thinking switch
disabled.

## Notes

The sample SFT data trains concise final answers. The thinking behavior comes
from the Qwen chat template and model behavior, not from storing long reasoning
traces in the dataset.
