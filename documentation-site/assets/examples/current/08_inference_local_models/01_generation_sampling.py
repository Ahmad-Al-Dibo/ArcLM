"""
ArcLM Example: Generation Sampling

This example demonstrates bounded local generation options with a tiny native
model. The model is random, so output quality is not meaningful.
"""

from __future__ import annotations

import json
import torch

from arclm.inference import Generator
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = "ArcLM trains tiny native language models on local data."


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    torch.manual_seed(3)
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)
    generator = Generator(model, tokenizer.stoi, tokenizer.itos, block_size=8, device="cpu", tokenizer=tokenizer)
    greedy = generator.generate_string("ArcLM", max_new_tokens=3, temperature=1.0, top_k=1)
    sampled = generator.generate_string("ArcLM", max_new_tokens=3, temperature=0.8, top_k=5, top_p=0.9)
    print_json({"greedy": greedy, "sampled": sampled, "max_new_tokens": 3})


if __name__ == "__main__":
    main()

