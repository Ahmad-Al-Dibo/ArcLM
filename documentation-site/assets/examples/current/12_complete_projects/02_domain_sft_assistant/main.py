"""
ArcLM Complete Project: Domain SFT Assistant

Base tiny model -> instruction dataset -> canonical SFT preparation ->
one response-label update -> bounded generation report.
"""

from __future__ import annotations

import json

import torch

from arclm.finetuning import FineTuningConfig, fine_tuning_format_fingerprint, prepare_fine_tuning_dataset
from arclm.inference import Generator
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer


CORPUS = "ArcLM is a compact local toolkit. Tiny examples are fast and safe."
SFT_RECORDS = [
    {"instruction": "What is ArcLM?", "response": "ArcLM is a compact local language-model toolkit."},
    {"instruction": "Why use tiny examples?", "response": "Tiny examples are fast, inspectable, and safe."},
]


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    torch.manual_seed(23)
    tokenizer = Tokenizer(max_vocab=80)
    tokenizer.build(CORPUS + " " + " ".join(row["instruction"] + " " + row["response"] for row in SFT_RECORDS))
    config = FineTuningConfig(max_sequence_length=40, train_on_prompt=False)
    prepared = prepare_fine_tuning_dataset(SFT_RECORDS, tokenizer, config)
    feature = prepared[0]
    model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=16, block_size=len(feature["input_ids"]), num_blocks=1)
    x = torch.tensor([feature["input_ids"]], dtype=torch.long)
    labels = torch.tensor([feature["labels"]], dtype=torch.long)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-2)
    logits = model(x)
    loss = torch.nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), labels.reshape(-1), ignore_index=config.ignore_index)
    loss.backward()
    optimizer.step()
    generator = Generator(model, tokenizer.stoi, tokenizer.itos, block_size=len(feature["input_ids"]), device="cpu", tokenizer=tokenizer)
    print_json(
        {
            "records": prepared.report.records_valid,
            "trainable_tokens": prepared.report.trainable_tokens,
            "fingerprint": fine_tuning_format_fingerprint(config=config, tokenizer_identity={"vocab_size": tokenizer.get_vocab_size()}),
            "loss": round(float(loss.detach()), 4),
            "sample": generator.generate_string("Instruction: What is ArcLM?", max_new_tokens=4, top_k=5),
        }
    )


if __name__ == "__main__":
    main()

