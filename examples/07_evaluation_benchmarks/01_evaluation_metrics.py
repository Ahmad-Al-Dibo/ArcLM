"""
ArcLM Example: Evaluation Metrics

This example calculates loss-derived perplexity, token accuracy, and top-k
predictions from a tiny native model.
"""

from __future__ import annotations

import json
import torch

from arclm.evaluation import Accuracy, calculate_perplexity, predict_top_k
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = "ArcLM trains tiny native language models on local data."


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    tokenizer = Tokenizer(max_vocab=48)
    tokenizer.build(CORPUS)
    ids = tokenizer.encode_text("ArcLM trains tiny")
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=8, num_blocks=1)
    logits = model(torch.tensor([ids], dtype=torch.long))
    labels = torch.tensor([ids], dtype=torch.long)
    metric = Accuracy()
    metric.update(predictions=logits, targets=labels)
    accuracy = metric.compute()
    predictions = predict_top_k(model, tokenizer.stoi, tokenizer.itos, block_size=8, device="cpu", prompt="ArcLM", k=3, tokenizer=tokenizer)
    print_json(
        {
            "perplexity_from_loss_2": round(calculate_perplexity(2.0), 4),
            "accuracy": round(float(accuracy), 4),
            "top_k": [
                {"rank": item.rank, "token": item.token, "probability": round(float(item.probability), 4)}
                for item in predictions
            ],
        }
    )


if __name__ == "__main__":
    main()
