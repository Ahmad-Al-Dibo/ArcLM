"""Beginner 1: in-memory data to native token IDs."""

from arclm.datasets import load_dataset
from arclm.tokenizers import Tokenizer


def main():
    records = load_dataset(
        [
            {"text": "arc lm starts with small readable data"},
            {"text": "token ids are the numbers the model receives"},
        ],
        required_fields=["text"],
    )
    text = " ".join(record["text"] for record in records)

    tokenizer = Tokenizer(max_vocab=32)
    tokenizer.build(text)
    token_ids = tokenizer.encode_text(text)

    print("ArcLM Beginner 1: data and tokenization")
    print(f"Records: {len(records)}")
    print(f"Vocabulary size: {tokenizer.get_vocab_size()}")
    print(f"First tokens: {text.split()[:8]}")
    print(f"First token IDs: {token_ids[:8]}")


if __name__ == "__main__":
    main()
