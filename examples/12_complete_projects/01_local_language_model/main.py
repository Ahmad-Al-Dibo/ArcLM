"""
ArcLM Complete Project: Local Language Model

What you'll learn
-----------------
- Build a tokenizer from raw text and train a tiny native ArcLM for one step
- Save a model checkpoint and compute perplexity
- Generate a short continuation on CPU

When to use this
----------------
- A minimal end-to-end local pre-training loop to study or extend

Requirements
------------
    pip install "arclm[train]"

Run
---
    python examples/12_complete_projects/01_local_language_model/main.py

Expected output
---------------
    "final_loss": 3.3558, "perplexity": 28.6688, "tokens": 25
    "checkpoint": "model_state.pt", "training_steps": 1

Runtime
-------
    Under 10 seconds on CPU.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

import torch

from arclm.evaluation import calculate_perplexity
from arclm.inference import Generator
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


# --- 1. Local corpus ---
CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small bounded and inspectable. "
    "Tiny models help developers understand tokenization training evaluation generation."
)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 2. Train: tokenizer, model, one pre-training step ---
def main() -> None:
    torch.manual_seed(17)
    tokenizer = Tokenizer(max_vocab=64)
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text(CORPUS)
    block_size = 8
    x = torch.tensor([ids[:block_size]], dtype=torch.long)
    y = torch.tensor([ids[1 : block_size + 1]], dtype=torch.long)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=block_size, num_blocks=1)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)
    logits = model(x)
    loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), y.reshape(-1))
    loss.backward()
    optimizer.step()
    # --- 3. Persist the checkpoint, evaluate, and generate ---
    generator = Generator(model, tokenizer.stoi, tokenizer.itos, block_size=block_size, device="cpu", tokenizer=tokenizer)
    with tempfile.TemporaryDirectory(prefix="arclm-project-local-lm-") as tmpdir:
        tmp = Path(tmpdir)
        state_path = tmp / "model_state.pt"
        torch.save(model.state_dict(), state_path)
        print_json(
            {
                "records": 1,
                "tokens": len(ids),
                "model_parameters": sum(p.numel() for p in model.parameters()),
                "training_steps": 1,
                "final_loss": round(float(loss.detach()), 4),
                "perplexity": round(calculate_perplexity(float(loss.detach())), 4),
                "checkpoint": state_path.name,
                "generation": generator.generate_string("ArcLM", max_new_tokens=3, top_k=3),
            }
        )


if __name__ == "__main__":
    main()
