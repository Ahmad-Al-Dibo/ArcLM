"""Fine-tune a Gemma model with ArcLM SFT and LoRA."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from arclm import train_sft

EXAMPLE_DIR = Path(__file__).resolve().parent
DEFAULT_MODEL = "google/gemma-2-2b-it"
DEFAULT_DATA = EXAMPLE_DIR / "data" / "sample_sft.jsonl"
DEFAULT_OUTPUT = EXAMPLE_DIR / "output" / "gemma_lora"


def main():
    parser = argparse.ArgumentParser(description="Run ArcLM LoRA SFT on a Gemma model.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--dataset", default=str(DEFAULT_DATA))
    parser.add_argument("--output-dir", default=str(DEFAULT_OUTPUT))
    parser.add_argument("--batch-size", type=int, default=1)
    parser.add_argument("--gradient-accumulation-steps", type=int, default=8)
    parser.add_argument("--learning-rate", type=float, default=2e-4)
    parser.add_argument("--num-epochs", type=int, default=1)
    parser.add_argument("--max-length", type=int, default=1024)
    parser.add_argument("--max-steps", type=int, default=None)
    parser.add_argument("--dtype", default="auto")
    parser.add_argument("--device-map", default="auto")
    parser.add_argument("--no-lora", action="store_true", help="Save a full fine-tuned model instead of a LoRA adapter.")
    parser.add_argument("--trust-remote-code", action="store_true")
    args = parser.parse_args()

    result = train_sft(
        model=args.model,
        dataset=args.dataset,
        output_dir=args.output_dir,
        backend="huggingface",
        assistant_only_loss=True,
        use_lora=not args.no_lora,
        batch_size=args.batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        learning_rate=args.learning_rate,
        num_epochs=args.num_epochs,
        max_length=args.max_length,
        dtype=args.dtype,
        device_map=args.device_map,
        max_steps=args.max_steps,
        trust_remote_code=args.trust_remote_code,
        lora_target_modules=[
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
    )
    print(f"Saved SFT output: {result.output_dir}")
    print(f"Metadata: {result.metadata_path}")


if __name__ == "__main__":
    main()
