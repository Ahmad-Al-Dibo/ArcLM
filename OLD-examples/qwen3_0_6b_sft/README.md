# Qwen3-0.6B Structured-Output Fine-Tuning

This example fine-tunes `Qwen/Qwen3-0.6B` for a customer-style structured-output
task.

The target behavior is:

```json
{
  "task": "product_summary",
  "answer": "ArcLM is a local AI framework for training, fine-tuning, evaluating, and running language models.",
  "confidence": "high",
  "tags": ["ai-framework", "local-training", "fine-tuning"]
}
```

The example uses ArcLM SFT with LoRA by default. It is meant for a real
customer demo shape, not for a production-quality model release.

## What It Does

1. Loads the base Qwen model through Hugging Face.
2. Generates baseline structured-output attempts.
3. Fine-tunes on JSON-output examples with assistant-only loss.
4. Saves a LoRA adapter.
5. Loads the adapter on top of the base model.
6. Generates fine-tuned outputs.
7. Validates that generated text is JSON with required keys.
8. Compares base and fine-tuned structure scores.

## Install

```bash
pip install -e ".[peft]"
```

This workflow needs Hugging Face `transformers` and PEFT. The first run may
download `Qwen/Qwen3-0.6B`, so internet access and disk space are needed for the
initial model fetch.

## Run

PowerShell:

```powershell
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/test_base_model.py
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/train_qwen3_0_6b_sft.py
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/test_finetuned_model.py
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/validate_structured_outputs.py
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/benchmark_base_vs_finetuned.py
```

Cross platform:

```bash
python examples/qwen3_0_6b_sft/test_base_model.py
python examples/qwen3_0_6b_sft/train_qwen3_0_6b_sft.py
python examples/qwen3_0_6b_sft/test_finetuned_model.py
python examples/qwen3_0_6b_sft/validate_structured_outputs.py
python examples/qwen3_0_6b_sft/benchmark_base_vs_finetuned.py
```

## Fine-Tuning API

The training script uses the public ArcLM API:

```python
from arclm import train_sft

result = train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="examples/qwen3_0_6b_sft/data/sample_sft.jsonl",
    output_dir="examples/qwen3_0_6b_sft/output/qwen3_0_6b_sft_lora",
    backend="huggingface",
    assistant_only_loss=True,
    use_lora=True,
    batch_size=1,
    gradient_accumulation_steps=8,
    learning_rate=2e-4,
    num_epochs=1,
    max_length=1024,
    dtype="auto",
    device_map="auto",
)
```

## Dataset Format

Use JSONL records with chat messages. The assistant response should be the
exact structure you want the model to learn:

```json
{"messages":[{"role":"system","content":"You convert user requests into strict JSON. Return only valid JSON with keys: task, answer, confidence, tags."},{"role":"user","content":"Summarize ArcLM for a product catalogue."},{"role":"assistant","content":"{\"task\":\"product_summary\",\"answer\":\"ArcLM is a local AI framework for training, fine-tuning, evaluating, and running language models.\",\"confidence\":\"high\",\"tags\":[\"ai-framework\",\"local-training\",\"fine-tuning\"]}"}]}
```

Keep the examples consistent. If the customer needs another structure, change
all assistant examples to that exact schema.

## Output Files

Files are written under:

```text
examples/qwen3_0_6b_sft/output/
```

Important outputs:

- `base_outputs.jsonl`
- `qwen3_0_6b_sft_lora/`
- `finetuned_outputs.jsonl`
- `benchmark_results.json`

## Validation

`validate_structured_outputs.py` checks:

- generated text is valid JSON
- JSON is an object
- required keys exist: `task`, `answer`, `confidence`, `tags`
- `answer` is a non-empty string
- `confidence` is `low`, `medium`, or `high`
- `tags` is a list of strings

This is important: fine-tuning can improve structure, but production workflows
should still validate generated JSON and retry or reject invalid responses.

## Memory Notes

For small GPUs:

```text
use_lora=True
batch_size=1
gradient_accumulation_steps=8
max_length=512 or 1024
```

If CUDA memory is still too small, run on CPU for a smoke test or use a smaller
model for development.
