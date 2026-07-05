"""Run masked SFT after adapting a Hugging Face causal LM source to ArcLM."""

import argparse
import sys
from pathlib import Path

import torch
from torch.utils.data import DataLoader

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from arclm import (
    Config,
    InstructionDataset,
    Tokenizer,
    adapt_for_training,
    build_trainer,
    load_external_model,
)
from sft_utils import read_instruction_pairs


def main():
    parser = argparse.ArgumentParser(
        description="Adapt a Hugging Face causal LM source into ArcLM and run masked SFT."
    )
    parser.add_argument("--model", default="sshleifer/tiny-gpt2", help="HF model ID or local HF folder.")
    parser.add_argument(
        "--data",
        required=True,
        help="Structured JSON/JSONL/CSV SFT data with instruction/response fields or chat messages.",
    )
    parser.add_argument("--output", default="models/arclm_hf_sft.pth")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--batch-size", type=int, default=2)
    parser.add_argument("--learning-rate", type=float, default=5e-5)
    parser.add_argument("--max-vocab", type=int, default=8000)
    parser.add_argument("--embed-dim", type=int, default=64)
    parser.add_argument("--num-blocks", type=int, default=2)
    parser.add_argument("--block-size", type=int, default=128)
    args = parser.parse_args()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    instructions, responses = read_instruction_pairs(args.data)
    training_text = "\n".join(
        f"<|instruction|>\n{instruction}\n<|response|>\n{response}"
        for instruction, response in zip(instructions, responses)
    )

    tokenizer = Tokenizer(
        max_vocab=args.max_vocab,
        user_defined_symbols=["<|instruction|>", "<|response|>"],
    )
    tokenizer.build(training_text)

    loaded = load_external_model(args.model, map_location=device)
    config = Config(
        model_path=args.output,
        vocab_size=tokenizer.get_vocab_size(),
        max_vocab=tokenizer.get_vocab_size(),
        embed_dim=args.embed_dim,
        num_blocks=args.num_blocks,
        block_size=args.block_size,
        batch_size=args.batch_size,
        num_epochs=args.epochs,
        learning_rate=args.learning_rate,
        training_log_interval=10,
        device=device,
    )

    bundle = adapt_for_training(
        loaded,
        target_config=config,
        tokenizer=tokenizer,
        require_tokenizer_match=False,
    )
    print(
        "Adapted HF source to ArcLM "
        f"(missing={len(bundle.missing_keys)}, unexpected={len(bundle.unexpected_keys)})."
    )

    dataset = InstructionDataset(
        instructions=instructions,
        responses=responses,
        tokenizer=tokenizer,
        block_size=bundle.config.block_size,
    )
    loader = DataLoader(dataset, batch_size=args.batch_size, shuffle=True)
    trainer = build_trainer(bundle.model, bundle.config)
    trainer.train(loader, bundle.config.num_epochs)
    trainer.save(
        bundle.config,
        vocab=tokenizer.vocab,
        stoi=tokenizer.stoi,
        itos=tokenizer.itos,
        tokenizer_metadata=tokenizer.to_checkpoint(),
    )
    print(f"Saved SFT checkpoint: {bundle.config.model_path}")


if __name__ == "__main__":
    main()
