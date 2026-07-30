"""Data processing: load JSONL records and format prompt text."""

from pathlib import Path
import json
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from arclm import DataProcessor


def duplicate_rows(rows, num_duplications=10):
    """add duplicate rows to the dataset for testing"""
    return rows * num_duplications

def main():
    rows = [
        {"question": "What is ArcLM?", "answer": "A compact language-model toolkit."},
        {"question": "What is SFT?", "answer": "Training on instruction-response examples."},
        {"question": "What is ArcLM?", "answer": "A compact language-model toolkit."},  # Duplicate
    ]
    rows = duplicate_rows(rows, num_duplications=1000)  # Increase the number of rows for testing
    print(f"Number of rows: {len(rows)}")

    start = time.time()

    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "qa.jsonl"
        path.write_text(
            "\n".join(json.dumps(row) for row in rows),
            encoding="utf-8",
        )

        dataset = (
            DataProcessor.load(path)
            .clean()
            .transform(
                format="instruction",
                mapping={"instruction": "question", "output": "answer"},
                template="Question: {instruction}\nAnswer: {output}",
            )
        )

        print(f"{len(dataset.samples)} rows processed.")
        print(f"Sample row: {dataset.samples[0:10]}")
        end = time.time()
        print(f"Processing time: {end - start:.5f} seconds")


if __name__ == "__main__":
    main()
