"""Run Gemma inference, using a LoRA adapter when it exists."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import torch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from adapter import build_model_adapter, build_tokenizer_adapter, render_manual_chat

EXAMPLE_DIR = Path(__file__).resolve().parent
DEFAULT_MODEL = "google/gemma-2-2b-it"
DEFAULT_ADAPTER = EXAMPLE_DIR / "output" / "gemma_lora"
DEFAULT_PROMPTS = EXAMPLE_DIR / "data" / "prompts.jsonl"


def main():
    parser = argparse.ArgumentParser(description="Generate Gemma answers with optional fine-tuned adapter loading.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--adapter", default=str(DEFAULT_ADAPTER))
    parser.add_argument("--prompts", default=str(DEFAULT_PROMPTS))
    parser.add_argument("--max-new-tokens", type=int, default=160)
    parser.add_argument("--dtype", default="auto")
    parser.add_argument("--device-map", default="auto")
    parser.add_argument("--trust-remote-code", action="store_true")
    args = parser.parse_args()

    tokenizer, model, source = load_model_with_optional_adapter(
        model_name=args.model,
        adapter_dir=Path(args.adapter),
        dtype=args.dtype,
        device_map=args.device_map,
        trust_remote_code=args.trust_remote_code,
    )
    model_adapter = build_model_adapter(model)
    tokenizer_adapter = build_tokenizer_adapter(tokenizer)
    print(f"Model source: {source}")
    print(f"ArcLM model adapter: {type(model_adapter).__name__}")
    print(f"ArcLM tokenizer adapter: {type(tokenizer_adapter).__name__}")

    for row in read_jsonl(Path(args.prompts)):
        generated = generate_answer(
            tokenizer=tokenizer,
            model=model,
            prompt=row["prompt"],
            max_new_tokens=args.max_new_tokens,
        )
        print(f"\n[{row['id']}]\n{generated}\n")


def load_model_with_optional_adapter(
    model_name: str,
    adapter_dir: Path,
    dtype: str,
    device_map: str | None,
    trust_remote_code: bool,
):
    tokenizer, model = load_base_model(model_name, dtype, device_map, trust_remote_code)
    if adapter_dir.exists() and (adapter_dir / "adapter_config.json").exists():
        try:
            from peft import PeftModel
        except ImportError as exc:
            raise SystemExit("Loading a LoRA adapter requires PEFT. Install with: pip install peft") from exc
        model = PeftModel.from_pretrained(model, adapter_dir)
        model.eval()
        return tokenizer, model, f"base model plus LoRA adapter at {adapter_dir}"

    if adapter_dir.exists():
        return tokenizer, model, f"base model; {adapter_dir} is not a PEFT adapter"
    return tokenizer, model, f"base model; adapter not found at {adapter_dir}, created ArcLM adapter fallback"


def load_base_model(model_name: str, dtype: str, device_map: str | None, trust_remote_code: bool):
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer
    except ImportError as exc:
        raise SystemExit("Install Hugging Face dependencies with: pip install -e .[hf]") from exc

    normalized_device_map = normalize_device_map(device_map)
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=trust_remote_code)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token or tokenizer.unk_token

    kwargs = {
        "trust_remote_code": trust_remote_code,
        "torch_dtype": resolve_dtype(dtype),
    }
    if normalized_device_map:
        kwargs["device_map"] = normalized_device_map
    try:
        model = AutoModelForCausalLM.from_pretrained(model_name, **kwargs)
    except TypeError:
        kwargs["dtype"] = kwargs.pop("torch_dtype")
        model = AutoModelForCausalLM.from_pretrained(model_name, **kwargs)
    if not normalized_device_map:
        model.to(torch.device("cuda" if torch.cuda.is_available() else "cpu"))
    model.eval()
    return tokenizer, model


def generate_answer(tokenizer, model, prompt: str, max_new_tokens: int):
    messages = [{"role": "user", "content": prompt}]
    text = apply_chat_template(tokenizer, messages)
    inputs = tokenizer([text], return_tensors="pt").to(model_input_device(model))
    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=False,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )
    generated_ids = output_ids[0][inputs["input_ids"].shape[-1]:]
    return tokenizer.decode(generated_ids, skip_special_tokens=True).strip()


def apply_chat_template(tokenizer, messages):
    if not getattr(tokenizer, "chat_template", None):
        return render_manual_chat(messages, add_generation_prompt=True)
    try:
        return tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )
    except (TypeError, ValueError):
        return render_manual_chat(messages, add_generation_prompt=True)


def model_input_device(model):
    try:
        return next(model.parameters()).device
    except StopIteration:
        return torch.device("cpu")


def resolve_dtype(dtype: str):
    if dtype in (None, "auto"):
        return "auto"
    mapping = {
        "float16": torch.float16,
        "fp16": torch.float16,
        "bfloat16": torch.bfloat16,
        "bf16": torch.bfloat16,
        "float32": torch.float32,
        "fp32": torch.float32,
    }
    try:
        return mapping[dtype.lower()]
    except KeyError as exc:
        raise ValueError("dtype must be auto, fp16, float16, bf16, bfloat16, fp32, or float32.") from exc


def normalize_device_map(device_map):
    if device_map is None:
        return None
    if str(device_map).lower().strip() in {"", "none", "null"}:
        return None
    return device_map


def read_jsonl(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                yield json.loads(line)


if __name__ == "__main__":
    main()
