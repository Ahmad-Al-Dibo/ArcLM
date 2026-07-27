"""Dataset validation, provenance manifests, and lightweight reports.

These helpers sit on top of the existing ``DatasetLoader``/``DataProcessor``
flow. They validate small in-memory record lists, summarize processing, and
produce JSON-safe metadata without storing full dataset contents.
"""

from __future__ import annotations

import json
import statistics
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Iterable, Mapping, Sequence

from .._version import __version__
from ..exceptions import DatasetValidationError


@dataclass(frozen=True)
class DatasetValidationIssue:
    """One validation problem tied to a record index and field."""

    index: int
    field: str | None
    code: str
    message: str
    record_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Return JSON-safe issue data."""

        return asdict(self)


@dataclass
class DatasetValidationResult:
    """Result of validating records against a small field schema."""

    valid_records: list[dict[str, Any]]
    issues: list[DatasetValidationIssue]
    total_records: int

    @property
    def valid_count(self) -> int:
        """Number of valid records."""

        return len(self.valid_records)

    @property
    def invalid_count(self) -> int:
        """Number of distinct invalid records."""

        return len({issue.index for issue in self.issues})

    @property
    def invalid_indexes(self) -> list[int]:
        """Sorted indexes for records that failed validation."""

        return sorted({issue.index for issue in self.issues})

    def to_dict(self) -> dict[str, Any]:
        """Return JSON-safe validation data without record contents."""

        return {
            "total_records": self.total_records,
            "valid_count": self.valid_count,
            "invalid_count": self.invalid_count,
            "invalid_indexes": self.invalid_indexes,
            "issues": [issue.to_dict() for issue in self.issues],
        }

    def to_json(self) -> str:
        """Serialize the validation result."""

        return json.dumps(self.to_dict(), indent=2, sort_keys=True)

    def summary(self) -> str:
        """Return a short human-readable summary."""

        return (
            "Dataset Validation\n"
            f"Records: {self.total_records}\n"
            f"Valid: {self.valid_count}\n"
            f"Invalid: {self.invalid_count}"
        )


def validate_records(
    records: Iterable[Mapping[str, Any]],
    *,
    required_fields: Sequence[str],
    field_types: Mapping[str, type | tuple[type, ...]] | None = None,
    allow_empty: bool = False,
    strict: bool = True,
    record_id_field: str | None = None,
) -> DatasetValidationResult:
    """Validate mapping records with a small schema.

    Strict mode raises ``DatasetValidationError`` when any record is invalid.
    Non-strict mode returns the valid records plus issues.
    """

    field_types = dict(field_types or {})
    raw_records = list(records)
    valid_records: list[dict[str, Any]] = []
    issues: list[DatasetValidationIssue] = []

    for index, record in enumerate(raw_records):
        record_issues = _validate_one_record(
            record,
            index=index,
            required_fields=required_fields,
            field_types=field_types,
            allow_empty=allow_empty,
            record_id_field=record_id_field,
        )
        if record_issues:
            issues.extend(record_issues)
        else:
            valid_records.append(dict(record))

    result = DatasetValidationResult(
        valid_records=valid_records,
        issues=issues,
        total_records=len(raw_records),
    )
    if strict and issues:
        first = issues[0]
        raise DatasetValidationError(
            f"Dataset validation failed at record {first.index}: {first.message}"
        )
    return result


def _validate_one_record(
    record: Mapping[str, Any],
    *,
    index: int,
    required_fields: Sequence[str],
    field_types: Mapping[str, type | tuple[type, ...]],
    allow_empty: bool,
    record_id_field: str | None,
) -> list[DatasetValidationIssue]:
    """Validate one mapping and return all detected issues."""

    if not isinstance(record, Mapping):
        return [
            DatasetValidationIssue(
                index=index,
                field=None,
                code="record_type",
                message="record must be a mapping",
            )
        ]

    record_id = _safe_record_id(record, record_id_field)
    issues: list[DatasetValidationIssue] = []
    for field_name in required_fields:
        if field_name not in record:
            issues.append(
                DatasetValidationIssue(
                    index=index,
                    field=field_name,
                    code="missing_field",
                    message=f"missing required field: {field_name}",
                    record_id=record_id,
                )
            )
            continue
        value = record[field_name]
        expected = field_types.get(field_name, str)
        if not isinstance(value, expected):
            issues.append(
                DatasetValidationIssue(
                    index=index,
                    field=field_name,
                    code="invalid_type",
                    message=f"{field_name} must be { _type_label(expected) }",
                    record_id=record_id,
                )
            )
            continue
        if not allow_empty and isinstance(value, str) and not value.strip():
            issues.append(
                DatasetValidationIssue(
                    index=index,
                    field=field_name,
                    code="empty_value",
                    message=f"{field_name} must not be empty",
                    record_id=record_id,
                )
            )
    return issues


@dataclass(frozen=True)
class DatasetManifest:
    """Lightweight provenance metadata for a processed dataset."""

    dataset_name: str
    manifest_version: int
    source_type: str
    source_files: tuple[str, ...]
    record_count_before_processing: int
    record_count_after_processing: int
    invalid_records: int
    duplicates_removed: int
    text_fields: tuple[str, ...]
    transformations_applied: tuple[str, ...]
    split_information: dict[str, int]
    created_at: float
    arclm_version: str

    def to_dict(self) -> dict[str, Any]:
        """Return JSON-safe manifest data."""

        data = asdict(self)
        data["source_files"] = list(self.source_files)
        data["text_fields"] = list(self.text_fields)
        data["transformations_applied"] = list(self.transformations_applied)
        return data

    def to_json(self) -> str:
        """Serialize the manifest."""

        return json.dumps(self.to_dict(), indent=2, sort_keys=True)


def create_dataset_manifest(
    *,
    dataset_name: str,
    source_type: str,
    records_before: int,
    records_after: int,
    validation_result: DatasetValidationResult | None = None,
    source_files: Sequence[str | Path] = (),
    duplicates_removed: int = 0,
    text_fields: Sequence[str] = ("text",),
    transformations_applied: Sequence[str] = (),
    split_information: Mapping[str, int] | None = None,
) -> DatasetManifest:
    """Create lightweight dataset provenance without storing record values."""

    return DatasetManifest(
        dataset_name=dataset_name,
        manifest_version=1,
        source_type=source_type,
        source_files=tuple(str(Path(path)) for path in source_files),
        record_count_before_processing=int(records_before),
        record_count_after_processing=int(records_after),
        invalid_records=validation_result.invalid_count if validation_result else 0,
        duplicates_removed=int(duplicates_removed),
        text_fields=tuple(text_fields),
        transformations_applied=tuple(transformations_applied),
        split_information={str(key): int(value) for key, value in dict(split_information or {}).items()},
        created_at=time.time(),
        arclm_version=__version__,
    )


@dataclass(frozen=True)
class DatasetReport:
    """A compact processed-dataset and tokenization report."""

    record_count: int
    valid_records: int
    invalid_records: int
    duplicates_removed: int
    empty_records_removed: int
    train_size: int | None
    validation_size: int | None
    min_text_length: int
    max_text_length: int
    average_text_length: float
    token_count: int
    min_token_length: int
    max_token_length: int
    average_token_length: float
    unknown_token_count: int | None
    unknown_token_rate: float | None
    truncated_record_count: int
    manifest: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        """Return JSON-safe report data."""

        return asdict(self)

    def to_json(self) -> str:
        """Serialize the report."""

        return json.dumps(self.to_dict(), indent=2, sort_keys=True)

    def summary(self) -> str:
        """Return a short human-readable report."""

        return (
            "Dataset Report\n"
            f"Records: {self.record_count}\n"
            f"Valid/invalid: {self.valid_records}/{self.invalid_records}\n"
            f"Tokens: {self.token_count}\n"
            f"Text length min/avg/max: {self.min_text_length}/"
            f"{self.average_text_length:.2f}/{self.max_text_length}\n"
            f"Token length min/avg/max: {self.min_token_length}/"
            f"{self.average_token_length:.2f}/{self.max_token_length}"
        )


def build_dataset_report(
    records: Iterable[Mapping[str, Any]],
    *,
    tokenizer: Any | None = None,
    text_fields: Sequence[str] = ("text",),
    validation_result: DatasetValidationResult | None = None,
    manifest: DatasetManifest | None = None,
    split_information: Mapping[str, int] | None = None,
    duplicates_removed: int = 0,
    empty_records_removed: int | None = None,
    truncated_record_count: int = 0,
    max_token_length: int | None = None,
) -> DatasetReport:
    """Build a processed dataset report with optional token statistics."""

    rows = [dict(record) for record in records]
    texts = [_record_text(record, text_fields) for record in rows]
    empty_count = sum(1 for text in texts if not text.strip())
    token_lengths: list[int] = []
    unknown_count = None
    if tokenizer is not None:
        token_rows = []
        unk_id = tokenizer.get_unknown_index() if hasattr(tokenizer, "get_unknown_index") else None
        unknown = 0
        for text in texts:
            token_ids = list(tokenizer.encode_text(text))
            token_rows.append(token_ids)
            token_lengths.append(len(token_ids))
            if unk_id is not None:
                unknown += sum(1 for token_id in token_ids if int(token_id) == int(unk_id))
        unknown_count = unknown
    else:
        token_lengths = [len(str(text).split()) for text in texts]

    if max_token_length is not None:
        truncated_record_count = sum(length > max_token_length for length in token_lengths)

    total_tokens = sum(token_lengths)
    unknown_rate = (unknown_count / total_tokens) if unknown_count is not None and total_tokens else None
    split = dict(split_information or {})
    return DatasetReport(
        record_count=len(rows),
        valid_records=validation_result.valid_count if validation_result else len(rows),
        invalid_records=validation_result.invalid_count if validation_result else 0,
        duplicates_removed=int(duplicates_removed),
        empty_records_removed=empty_count if empty_records_removed is None else int(empty_records_removed),
        train_size=split.get("train"),
        validation_size=split.get("validation"),
        min_text_length=_safe_min([len(text) for text in texts]),
        max_text_length=_safe_max([len(text) for text in texts]),
        average_text_length=_safe_mean([len(text) for text in texts]),
        token_count=total_tokens,
        min_token_length=_safe_min(token_lengths),
        max_token_length=_safe_max(token_lengths),
        average_token_length=_safe_mean(token_lengths),
        unknown_token_count=unknown_count,
        unknown_token_rate=unknown_rate,
        truncated_record_count=int(truncated_record_count),
        manifest=manifest.to_dict() if manifest is not None else None,
    )


def _record_text(record: Mapping[str, Any], fields: Sequence[str]) -> str:
    """Join selected text fields without exposing values in reports."""

    return "\n".join(
        str(record.get(field, ""))
        for field in fields
        if record.get(field) is not None
    )


def _safe_record_id(record: Mapping[str, Any], field_name: str | None) -> str | None:
    if not field_name or field_name not in record:
        return None
    value = record[field_name]
    if isinstance(value, (str, int)):
        return str(value)
    return None


def _type_label(expected: type | tuple[type, ...]) -> str:
    if isinstance(expected, tuple):
        return " or ".join(item.__name__ for item in expected)
    return expected.__name__


def _safe_min(values: Sequence[int]) -> int:
    return min(values) if values else 0


def _safe_max(values: Sequence[int]) -> int:
    return max(values) if values else 0


def _safe_mean(values: Sequence[int]) -> float:
    return float(statistics.mean(values)) if values else 0.0
