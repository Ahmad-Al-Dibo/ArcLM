"""
ArcLM Example: Tiny Pre-Training Step

This example performs one CPU next-token training step on synthetic local text.
"""

from __future__ import annotations

import json
import torch

from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = (
    "ArcLM trains tiny native language models on local data. "
    "Local examples stay small bounded and inspectable. "
    "Tiny models help developers understand tokenization training evaluation generation."
)


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    torch.manual_seed(7)
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text(CORPUS)
    block_size = 8
    x = torch.tensor([ids[:block_size]], dtype=torch.long)
    y = torch.tensor([ids[1 : block_size + 1]], dtype=torch.long)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=block_size, num_blocks=1)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)
    logits = model(x)
    first_loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), y.reshape(-1))
    first_loss.backward()
    optimizer.step()
    optimizer.zero_grad()
    second_logits = model(x)
    second_loss = torch.nn.functional.cross_entropy(second_logits.reshape(-1, second_logits.size(-1)), y.reshape(-1))
    print_json({"initial_loss": round(float(first_loss.detach()), 4), "after_one_step_loss": round(float(second_loss.detach()), 4), "tokens": len(ids)})


if __name__ == "__main__":
    main()

