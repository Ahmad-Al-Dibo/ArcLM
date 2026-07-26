"""Run Qwen with thinking mode enabled or disabled."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Optional

import torch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

EXAMPLE_DIR = Path(__file__).resolve().parent
DEFAULT_MODEL = "Qwen/Qwen3-0.6B"
DEFAULT_PROMPTS = EXAMPLE_DIR / "data" / "prompts.jsonl"
DEFAULT_OUTPUT = EXAMPLE_DIR / "output" / "thinking_outputs.jsonl"
SYSTEM_PROMPT = (
    "You are a careful assistant. Solve the task and give a concise final answer."
)


def main():
    parser = argparse.ArgumentParser(description="Compare Qwen thinking and non-thinking generation.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--prompts", default=str(DEFAULT_PROMPTS))
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT))
    parser.add_argument("--max-new-tokens", type=int, default=256)
    parser.add_argument("--dtype", default="auto")
    parser.add_argument("--device-map", default="auto")
    parser.add_argument("--thinking", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--compare", action="store_true", help="Run every prompt once with thinking off and once with thinking on.")
    args = parser.parse_args()

    tokenizer, model = load_hf_model(args.model, dtype=args.dtype, device_map=args.device_map)
    rows = []
    for item in read_jsonl(Path(args.prompts)):
        modes = [False, True] if args.compare else [args.thinking]
        for thinking in modes:
            raw_text = generate_answer(
                tokenizer=tokenizer,
                model=model,
                prompt=item["prompt"],
                max_new_tokens=args.max_new_tokens,
                enable_thinking=thinking,
            )
            parsed = split_thinking_text(raw_text)
            print(f"\n[{item['id']} | thinking={thinking}]\n{parsed['final_answer']}\n")
            rows.append(
                {
                    "id": item["id"],
                    "prompt": item["prompt"],
                    "thinking_enabled": thinking,
                    "raw_generated_text": raw_text,
                    "thinking_text": parsed["thinking_text"],
                    "final_answer": parsed["final_answer"],
                }
            )
    write_jsonl(Path(args.output), rows)


def load_hf_model(model_name: str, dtype: str = "auto", device_map: Optional[str] = "auto"):
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer
    except ImportError as exc:
        raise SystemExit(
            "This example requires transformers. Install with: pip install 'transformers>=4.51,<6'"
        ) from exc

    device_map = normalize_device_map(device_map)
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token or tokenizer.unk_token

    kwargs = {"trust_remote_code": True, "torch_dtype": resolve_dtype(dtype)}
    if device_map:
        kwargs["device_map"] = device_map
    try:
        model = AutoModelForCausalLM.from_pretrained(model_name, **kwargs)
    except TypeError:
        kwargs["dtype"] = kwargs.pop("torch_dtype")
        model = AutoModelForCausalLM.from_pretrained(model_name, **kwargs)
    if not device_map:
        model.to(torch.device("cuda" if torch.cuda.is_available() else "cpu"))
    model.eval()
    return tokenizer, model


def generate_answer(tokenizer, model, prompt: str, max_new_tokens: int, enable_thinking: bool):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]
    text = apply_chat_template(tokenizer, messages, enable_thinking=enable_thinking)
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


def apply_chat_template(tokenizer, messages, enable_thinking: bool):
    if not getattr(tokenizer, "chat_template", None):
        return manual_chat_text(messages, add_generation_prompt=True)
    kwargs = {
        "tokenize": False,
        "add_generation_prompt": True,
        "enable_thinking": enable_thinking,
    }
    try:
        return tokenizer.apply_chat_template(messages, **kwargs)
    except TypeError:
        kwargs.pop("enable_thinking", None)
        return tokenizer.apply_chat_template(messages, **kwargs)
    except ValueError:
        return manual_chat_text(messages, add_generation_prompt=True)


def split_thinking_text(text: str):
    start = text.find("<think>")
    end = text.find("</think>")
    if start == -1 or end == -1 or end < start:
        return {"thinking_text": "", "final_answer": text.strip()}
    thinking = text[start + len("<think>"):end].strip()
    final = (text[:start] + text[end + len("</think>"):]).strip()
    return {"thinking_text": thinking, "final_answer": final}


def manual_chat_text(messages, add_generation_prompt=False):
    parts = [
        f"{message.get('role', 'user')}: {message.get('content', '')}"
        for message in messages
    ]
    if add_generation_prompt:
        parts.append("assistant:")
    return "\n".join(parts)


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


def write_jsonl(path: Path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
