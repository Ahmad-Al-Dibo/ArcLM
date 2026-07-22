"""Beginner 2: train a tiny native ArcLM causal model and save a checkpoint."""

from pathlib import Path
import json
import shutil

import torch

from arclm.datasets import create_dataloader, load_dataset
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import Trainer, TrainingConfig


OUTPUT_DIR = Path(__file__).resolve().parent / "_outputs" / "causal_lm_workbench"


def main():
    torch.manual_seed(8)
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    records = load_dataset(
        [
            {"text": "arc lm trains tiny causal models"},
            {"text": "tiny checkpoints make reloads easy"},
            {"text": "students inspect the native path"},
        ],
        required_fields=["text"],
    )
    text = " ".join(record["text"] for record in records)

    tokenizer = Tokenizer(max_vocab=40)
    tokenizer.build(text)
    token_ids = tokenizer.encode_text(text)
    dataloader = create_dataloader(
        token_ids * 4,
        block_size=5,
        batch_size=2,
        shuffle=False,
    )

    model_config = {
        "vocab_size": tokenizer.get_vocab_size(),
        "embed_dim": 10,
        "block_size": 5,
        "num_blocks": 1,
        "dropout": 0.0,
    }
    model = ArcLM(**model_config)
    trainer = Trainer(
        model=model,
        config=TrainingConfig(
            epochs=1,
            batch_size=2,
            learning_rate=1e-2,
            output_dir=str(OUTPUT_DIR / "run"),
            save_every_steps=0,
            log_every_steps=0,
            device="cpu",
        ),
    )
    state = trainer.train(dataloader, epochs=1)
    checkpoint_path = trainer.save_checkpoint(OUTPUT_DIR / "checkpoint")

    tokenizer.save(OUTPUT_DIR / "tokenizer.json")
    (OUTPUT_DIR / "model_config.json").write_text(
        json.dumps(model_config, indent=2),
        encoding="utf-8",
    )

    print("ArcLM Beginner 2: train a tiny native model")
    print(f"Training steps: {state.global_step}")
    print(f"Checkpoint: {checkpoint_path}")
    print(f"Tokenizer: {OUTPUT_DIR / 'tokenizer.json'}")


if __name__ == "__main__":
    main()
