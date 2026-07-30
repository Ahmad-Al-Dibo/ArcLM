from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Any

import torch
from torch.utils.data import DataLoader

from arclm.models import ArcLM
from arclm.training import TrainingConfig, Trainer

from .config import ProjectConfig
from .dataset import DataPipeline
from .tokenizer import ArcLMTokenizer


class PretrainingDataset(torch.utils.data.Dataset):
    def __init__(self, texts: list[str], tokenizer: ArcLMTokenizer, block_size: int) -> None:
        self.texts = texts
        self.tokenizer = tokenizer
        self.block_size = block_size
        self.token_ids = []
        for text in texts:
            ids = tokenizer.encode_text(text)
            if not ids:
                continue
            if len(ids) < block_size + 1:
                self.token_ids.append(ids[: block_size + 1] + [0] * max(0, block_size + 1 - len(ids)))
                continue
            self.token_ids.extend([ids[i : i + block_size + 1] for i in range(0, len(ids) - block_size, block_size)])

    def __len__(self) -> int:
        return len(self.token_ids)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        ids = self.token_ids[index]
        if len(ids) < self.block_size + 1:
            ids = ids + [0] * (self.block_size + 1 - len(ids))
        x = torch.tensor(ids[: self.block_size], dtype=torch.long)
        y = torch.tensor(ids[1 : self.block_size + 1], dtype=torch.long)
        return x, y


def set_seed(seed: int) -> None:
    random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def estimate_model_parameters(config: ProjectConfig, vocab_size: int | None = None) -> dict[str, int]:
    vocab = vocab_size or config.vocab_size
    embed_dim = config.embed_dim
    ff_dim = config.ff_dim
    num_blocks = config.num_blocks
    block_size = config.block_size

    token_embedding = vocab * embed_dim
    position_embedding = block_size * embed_dim

    attention_params = 3 * (embed_dim * embed_dim + embed_dim)
    mlp_params = (embed_dim * ff_dim + ff_dim) + (ff_dim * embed_dim + embed_dim)
    norm_params = 2 * embed_dim
    per_block = attention_params + mlp_params + 2 * norm_params
    transformer_blocks = num_blocks * per_block

    final_norm = 2 * embed_dim
    lm_head = vocab * embed_dim + vocab
    total = token_embedding + position_embedding + transformer_blocks + final_norm + lm_head
    return {
        "token_embedding": token_embedding,
        "position_embedding": position_embedding,
        "transformer_blocks": transformer_blocks,
        "final_norm": final_norm,
        "lm_head": lm_head,
        "total_parameters": total,
    }


def train_project(config: ProjectConfig, input_paths: list[Path] | None = None) -> dict[str, Any]:
    set_seed(config.seed)
    config.output_dir.mkdir(parents=True, exist_ok=True)
    config.cache_dir.mkdir(parents=True, exist_ok=True)
    config.checkpoint_dir.mkdir(parents=True, exist_ok=True)

    input_paths = input_paths or [config.data_dir / "sample_corpus.txt"]
    pipeline = DataPipeline(config)
    texts, report = pipeline.build_dataset(input_paths)
    if not texts:
        raise RuntimeError("The preprocessing pipeline produced no valid samples. Check the input corpus and quality filters.")
    tokenizer = ArcLMTokenizer(max_vocab=config.vocab_size)
    tokenizer.build(texts)
    tokenizer.save(config.output_dir / "tokenizer.json")

    dataset = PretrainingDataset(texts, tokenizer, block_size=config.block_size)
    loader = DataLoader(dataset, batch_size=config.batch_size, shuffle=True, num_workers=0)

    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=config.embed_dim,
        block_size=config.block_size,
        num_blocks=config.num_blocks,
        dropout=config.dropout,
    )

    precision = "bf16" if config.mixed_precision and torch.cuda.is_available() else "fp32"
    training_cfg = TrainingConfig(
        epochs=config.epochs,
        batch_size=config.batch_size,
        learning_rate=config.learning_rate,
        weight_decay=config.weight_decay,
        gradient_accumulation_steps=config.gradient_accumulation_steps,
        precision=precision,
        max_grad_norm=config.max_grad_norm,
        output_dir=str(config.output_dir),
        save_every_steps=config.save_every_steps,
        log_every_steps=config.log_every_steps,
        warmup_steps=config.warmup_steps,
        max_steps=config.max_steps,
        device=config.device,
        shuffle=True,
    )

    trainer = Trainer(model=model, config=training_cfg, train_dataset=dataset)
    trainer.train(loader=loader, epochs=config.epochs)

    metrics = {
        "model_parameters": model.get_num_parameters(),
        "model_size_breakdown": estimate_model_parameters(config, vocab_size=tokenizer.get_vocab_size()),
        "vocab_size": tokenizer.get_vocab_size(),
        "dataset_report": report,
        "tokenizer_path": str(config.output_dir / "tokenizer.json"),
        "checkpoint_dir": str(config.checkpoint_dir),
    }
    (config.output_dir / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics
