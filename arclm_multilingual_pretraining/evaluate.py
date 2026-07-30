from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import torch

from arclm.inference import Generator
from arclm.models import ArcLM

from .config import ProjectConfig
from .tokenizer import ArcLMTokenizer


def evaluate_model(config: ProjectConfig, model_path: Path | None = None) -> dict[str, Any]:
    config.output_dir.mkdir(parents=True, exist_ok=True)
    tokenizer = ArcLMTokenizer(max_vocab=config.vocab_size)
    tokenizer.load(config.output_dir / "tokenizer.json")

    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=config.embed_dim,
        block_size=config.block_size,
        num_blocks=config.num_blocks,
        dropout=config.dropout,
    )
    if model_path is not None and model_path.exists():
        state = torch.load(model_path, map_location="cpu")
        model.load_state_dict(state)

    prompt = "اللغة العربية والتعلم العميق"
    generator = Generator(model, tokenizer._tokenizer.stoi, tokenizer._tokenizer.itos, block_size=config.block_size, device="cpu", tokenizer=tokenizer._tokenizer)
    sample = generator.generate_string(prompt, max_new_tokens=20, top_k=10)
    report = {"prompt": prompt, "sample": sample}
    (config.output_dir / "evaluation.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report
