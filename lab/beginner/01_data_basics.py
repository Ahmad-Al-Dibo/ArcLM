"""Beginner tasks for data loading and cleaning."""

from __future__ import annotations


def normalize_text(text: str) -> str:
    """Return clean text with trimmed whitespace and normalized line breaks.

    Example input:
        "  Hello\\r\\nworld!  "

    Expected output:
        "Hello\\nworld!"
    """
    return text.strip().replace("\r\n", "\n").replace("\r", "")


def load_jsonl_records(path: str) -> list[dict[str, object]]:
    """Load a JSONL file and return one dictionary per valid line.

    The worker should reject invalid JSON with a clear error and should not
    silently skip malformed records.

    Example file content:
        {"text": "Hello", "label": "greeting"}
        {"text": "Bye", "label": "farewell"}

    Expected output:
        [
            {"text": "Hello", "label": "greeting"},
            {"text": "Bye", "label": "farewell"},
        ]
    """
    import json

    records = []
    with open(path, "r", encoding = "utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    record = json.loads(line)
                    records.append(record)
                except json.JSONDecodeError as e:
                    raise ValueError(f"Invalid JSON line: {line}") from e
    return records


def split_records(
    records: list[dict[str, object]],
    validation_fraction: float,
) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    """Split records into train and validation lists without shuffling.

    Example input:
        records=[{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}]
        validation_fraction=0.25

    Expected output:
        ([{"id": 1}, {"id": 2}, {"id": 3}], [{"id": 4}])
    """
    split_index = int(len(records) * (1 - validation_fraction))
    return records[:split_index], records[split_index:]


class SimpleDataset:
    """A tiny dataset wrapper around a list of records.

    The worker should implement length and item access while keeping the
    original record dictionaries unchanged.

    Example input:
        records=[{"text": "a"}, {"text": "b"}]

    Expected behavior:
        len(dataset) == 2
        dataset[0] == {"text": "a"}
    """

    def __init__(self, records: list[dict[str, object]]):
        self.records = records

    def __len__(self) -> int:
        return len(self.records)

    def __getitem__(self, index: int) -> dict[str, object]:
        return self.records[index]


if __name__ == "__main__":
    # Example usage
    text = "  Hello\r\nworld!  "
    print(normalize_text(text))  # Output: "Hello\nworld!"

    # Load JSONL records from a file (replace 'data.jsonl' with your file path)
    records = load_jsonl_records('lab/beginner/data/data.jsonl')
    print(records)

    # Split records into training and validation sets
    train_records, val_records = split_records(records, validation_fraction=0.2)
    print(f"Train records: {train_records[:5]}")
    print(f"Validation records: {val_records}")

    # Create a SimpleDataset instance
    dataset = SimpleDataset(train_records)
    print(f"Dataset length: {len(dataset)}")
    print(f"First record: {dataset[0]}")