"""Train a tiny causal translator with ArcLM training APIs."""

from __future__ import annotations

from pathlib import Path

from arclm.configs import create_config, save_config_json
from arclm.tokenizers import Tokenizer
from arclm.tracking import set_reproducible_seed
from arclm.training import train_model

import config as project


def train_translator(pairs: list[dict[str, str]], workdir: Path) -> dict:
    set_reproducible_seed(project.SEED)
    workdir.mkdir(parents=True, exist_ok=True)

    train_text = "\n".join(
        f"translate {project.SOURCE_LANG} to {project.TARGET_LANG}: "
        f"{p['src']} > {p['tgt']}"
        for p in pairs
    )
    data_path = workdir / "train.txt"
    data_path.write_text(train_text + "\n", encoding="utf-8")

    tokenizer = Tokenizer(max_vocab=project.MAX_VOCAB)
    tokenizer.build(train_text)

    cfg = create_config(
        embed_dim=project.EMBED_DIM,
        block_size=project.BLOCK_SIZE,
        num_epochs=project.NUM_EPOCHS,
        device=project.DEVICE,
        model_path=str(project.CHECKPOINT_PATH),
        learning_rate=project.LEARNING_RATE,
        vocab_size=tokenizer.get_vocab_size(),
    )
    save_config_json(cfg, project.CONFIG_PATH)

    result = train_model(
        mode="pre_training",
        data=str(data_path),
        output=str(project.CHECKPOINT_PATH),
        config=cfg,
    )
    losses = result.history.get("train_losses", [])
    return {
        "checkpoint": str(project.CHECKPOINT_PATH),
        "vocab_size": tokenizer.get_vocab_size(),
        "training_steps": len(losses),
        "final_loss": None if not losses else float(losses[-1]),
    }
