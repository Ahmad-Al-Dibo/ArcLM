"""Run masked SFT on a local ArcLM checkpoint."""

import argparse
import sys
from pathlib import Path

import torch
from torch.utils.data import DataLoader

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from arclm import (
    Config,
    InstructionDataset,
    adapt_for_training,
    build_trainer,
    load_external_model,
    tokenizer_from_checkpoint,
)
from sft_utils import read_instruction_pairs


def main():
    parser = argparse.ArgumentParser(description="SFT a local ArcLM checkpoint.")
    parser.add_argument("--checkpoint", required=True, help="ArcLM checkpoint to fine-tune.")
    parser.add_argument(
        "--data",
        required=True,
        help="Structured JSON/JSONL/CSV SFT data with instruction/response fields or chat messages.",
    )
    parser.add_argument("--output", default="models/arclm_sft.pth")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--batch-size", type=int, default=2)
    parser.add_argument("--learning-rate", type=float, default=5e-5)
    parser.add_argument("--block-size", type=int, default=None)
    parser.add_argument("--freeze-backbone", action="store_true")
    args = parser.parse_args()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    loaded = load_external_model(args.checkpoint, map_location=device)
    tokenizer = tokenizer_from_checkpoint(loaded)
    instructions, responses = read_instruction_pairs(args.data)

    checkpoint_config = loaded.config or {}
    config = Config(
        model_path=args.output,
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=checkpoint_config.get("embed_dim", 64),
        num_blocks=checkpoint_config.get("num_blocks", 2),
        block_size=args.block_size or checkpoint_config.get("block_size", 128),
        dropout=checkpoint_config.get("dropout", 0.0),
        batch_size=args.batch_size,
        num_epochs=args.epochs,
        learning_rate=args.learning_rate,
        freeze_backbone=args.freeze_backbone,
        use_discriminative_lr=True,
        training_log_interval=10,
        device=device,
    )

    bundle = adapt_for_training(
        loaded,
        target_config=config,
        tokenizer=tokenizer,
        require_tokenizer_match=loaded.is_arclm_checkpoint,
    )
    trainer = build_trainer(bundle.model, bundle.config)
    if args.freeze_backbone:
        trainer.freeze_layers("blocks")

    dataset = InstructionDataset(
        instructions=instructions,
        responses=responses,
        tokenizer=tokenizer,
        block_size=bundle.config.block_size,
    )
    loader = DataLoader(dataset, batch_size=args.batch_size, shuffle=True)

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
