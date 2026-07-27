"""Intermediate tasks for reusable data pipelines."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DatasetStats:
    """Summary statistics for a prepared dataset.

    Example:
        DatasetStats(
            total_records=3,
            empty_records=1,
            duplicate_records=1,
            average_text_length=4.0,
        )
    """

    total_records: int
    empty_records: int
    duplicate_records: int
    average_text_length: float


def calculate_dataset_stats(records: list[dict[str, object]], text_field: str) -> DatasetStats:
    """Calculate deterministic dataset statistics for one text field.

    Example input:
        records=[{"text": "hi"}, {"text": ""}, {"text": "hi"}]
        text_field="text"

    Expected output:
        DatasetStats(total_records=3, empty_records=1, duplicate_records=1, ...)
    """
    pass


def deduplicate_records(
    records: list[dict[str, object]],
    key: str,
) -> list[dict[str, object]]:
    """Return records with duplicate key values removed while preserving order.

    Example input:
        records=[{"id": 1}, {"id": 1}, {"id": 2}]
        key="id"

    Expected output:
        [{"id": 1}, {"id": 2}]
    """
    pass


class DataPipelineStep:
    """Base interface for one data transformation step.

    Example:
        A lowercase step receives {"text": "HELLO"} and returns
        {"text": "hello"}.
    """

    name: str

    def apply(self, record: dict[str, object]) -> dict[str, object]:
        """Transform one record and return a new record.

        Example input:
            {"text": "  Hello  "}

        Expected output:
            {"text": "Hello"}
        """
        pass


class DataPipeline:
    """Apply a list of steps to records in order.

    Example:
        trim step -> lowercase step
        [{"text": "  HELLO  "}] becomes [{"text": "hello"}]
    """

    def __init__(self, steps: list[DataPipelineStep]):
        pass

    def run(self, records: list[dict[str, object]]) -> list[dict[str, object]]:
        pass
