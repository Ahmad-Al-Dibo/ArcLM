"""Beginner tasks for data loading and cleaning."""

from __future__ import annotations


def normalize_text(text: str) -> str:
    """Return clean text with trimmed whitespace and normalized line breaks.

    Example input:
        "  Hello\\r\\nworld!  "

    Expected output:
        "Hello\\nworld!"
    """
    pass


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
    pass


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
    pass


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
        pass

    def __len__(self) -> int:
        pass

    def __getitem__(self, index: int) -> dict[str, object]:
        pass
