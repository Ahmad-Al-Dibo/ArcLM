"""Datasetcatalogus en inspectie voor de lokale Web API."""

from __future__ import annotations

import csv
import hashlib
import json
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Literal

from .config import DatasetRoot, WebConfig
from .schemas import (
    DatasetField,
    DatasetInspectionMetadata,
    DatasetInspectionResponse,
    DatasetPreviewRow,
    DatasetStatistics,
    DatasetSummary,
    DatasetWarning,
    TextLengthStatistics,
)

DatasetFormat = Literal["txt", "csv", "json", "jsonl"]

SUPPORTED_FORMATS: dict[str, DatasetFormat] = {
    ".txt": "txt",
    ".csv": "csv",
    ".json": "json",
    ".jsonl": "jsonl",
}


class DatasetApiError(Exception):
    """Fout die veilig naar de Web API kan worden vertaald."""

    def __init__(self, code: str, message: str, status_code: int = 400):
        """Bewaart een stabiele foutcode en een Engelse melding."""
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


@dataclass(frozen=True)
class DatasetRecord:
    """Interne koppeling tussen een veilige ID en een echt bestand."""

    dataset_id: str
    name: str
    format: DatasetFormat
    size_bytes: int
    path: Path
    source_name: str | None = None
    source_id: str | None = None

    def to_summary(self) -> DatasetSummary:
        """Maakt een veilige catalogusregel zonder pad."""
        return DatasetSummary(
            dataset_id=self.dataset_id,
            name=self.name,
            format=self.format,
            size_bytes=self.size_bytes,
            source_name=self.source_name,
            source_id=self.source_id,
        )


class DatasetCatalogue:
    """Vindt ondersteunde datasets binnen geconfigureerde roots."""

    def __init__(self, config: WebConfig, source_manager=None):
        """Maakt een catalogus voor de huidige Web API configuratie."""
        self.config = config
        self.source_manager = source_manager

    def list_records(self) -> list[DatasetRecord]:
        """Geeft alle veilige datasetrecords terug.

        De catalogus scant alleen bestandsnamen en metadata. Bestandsinhoud
        wordt pas gelezen tijdens inspectie.
        """
        records: list[DatasetRecord] = []
        for root, root_path in self._roots():
            records.extend(self._records_for_root(root, root_path))
            if len(records) > self.config.max_catalogue_entries:
                raise DatasetApiError(
                    "dataset_catalogue_too_large",
                    "The configured dataset catalogue is too large.",
                    status_code=400,
                )
        return sorted(records, key=lambda record: (record.name.lower(), record.dataset_id))

    def _roots(self) -> tuple[tuple[DatasetRoot, Path], ...]:
        """Geeft de actuele ingeschakelde roots terug."""
        roots = self.source_manager.active_roots() if self.source_manager is not None else self.config.dataset_roots
        return tuple((root, Path(root.path).expanduser().resolve()) for root in roots if root.enabled)

    def find(self, dataset_id: str) -> DatasetRecord:
        """Zoekt een dataset op veilige ID."""
        if not _is_safe_dataset_id(dataset_id):
            raise DatasetApiError("dataset_not_found", "Dataset was not found.", status_code=404)
        for record in self.list_records():
            if record.dataset_id == dataset_id:
                return record
        raise DatasetApiError("dataset_not_found", "Dataset was not found.", status_code=404)

    def _records_for_root(self, root: DatasetRoot, root_path: Path) -> list[DatasetRecord]:
        """Scant één root zonder paden te lekken."""
        records: list[DatasetRecord] = []
        iterator = root_path.rglob("*") if root.recursive else root_path.iterdir()
        for candidate in iterator:
            if not candidate.is_file():
                continue
            suffix = candidate.suffix.lower()
            if suffix not in SUPPORTED_FORMATS:
                continue
            try:
                resolved = candidate.resolve(strict=True)
            except OSError:
                continue
            if not _is_inside(resolved, root_path):
                continue
            relative = resolved.relative_to(root_path)
            if root.recursive and len(relative.parts) - 1 > self.config.max_recursive_depth:
                continue
            records.append(
                DatasetRecord(
                    dataset_id=_dataset_id(root.name, relative),
                    name=resolved.name,
                    format=SUPPORTED_FORMATS[suffix],
                    size_bytes=resolved.stat().st_size,
                    path=resolved,
                    source_name=root.name,
                    source_id=root.root_id,
                )
            )
        return records


class DatasetInspector:
    """Leest een bounded preview en schema uit een datasetbestand."""

    def __init__(self, config: WebConfig):
        """Maakt een inspector met server-side limieten."""
        self.config = config

    def inspect(self, record: DatasetRecord, preview_rows: int | None = None) -> DatasetInspectionResponse:
        """Inspecteert een dataset zonder het bestand te wijzigen."""
        preview_limit = self._validate_preview_limit(preview_rows)
        if record.size_bytes > self.config.max_inspection_file_size:
            raise DatasetApiError(
                "dataset_too_large",
                "Dataset is too large for inspection.",
                status_code=413,
            )

        collector = _InspectionCollector(self.config, preview_limit)
        try:
            for row in self._iter_rows(record):
                if collector.reached_scan_limit:
                    collector.mark_scan_limit()
                    break
                collector.add_row(row)
        except UnicodeDecodeError as exc:
            raise DatasetApiError(
                "dataset_encoding_invalid",
                "Dataset encoding is not valid UTF-8.",
                status_code=400,
            ) from exc
        except json.JSONDecodeError as exc:
            raise DatasetApiError(
                "dataset_shape_invalid",
                "Dataset JSON shape is invalid.",
                status_code=400,
            ) from exc
        except OSError as exc:
            raise DatasetApiError(
                "dataset_read_failed",
                "Dataset could not be read.",
                status_code=400,
            ) from exc

        return collector.to_response(record)

    def _validate_preview_limit(self, value: int | None) -> int:
        """Controleert de previewlimiet van de client."""
        if value is None:
            return self.config.default_preview_rows
        if not isinstance(value, int) or value < 0:
            raise DatasetApiError(
                "dataset_inspection_limit_invalid",
                "preview_rows must be zero or greater.",
                status_code=400,
            )
        if value > self.config.max_preview_rows:
            raise DatasetApiError(
                "dataset_inspection_limit_invalid",
                "preview_rows exceeds the server maximum.",
                status_code=400,
            )
        return value

    def _iter_rows(self, record: DatasetRecord) -> Iterable[dict[str, object]]:
        """Kiest de parser voor het bestandstype."""
        if record.format == "txt":
            return _iter_txt(record.path)
        if record.format == "csv":
            return _iter_csv(record.path)
        if record.format == "jsonl":
            return _iter_jsonl(record.path)
        if record.format == "json":
            return _iter_json(record.path)
        raise DatasetApiError(
            "dataset_format_unsupported",
            "Dataset format is not supported.",
            status_code=415,
        )


class _InspectionCollector:
    """Verzamelt schema, preview en statistieken tijdens een bounded scan."""

    def __init__(self, config: WebConfig, preview_limit: int):
        self.config = config
        self.preview_limit = preview_limit
        self.rows_scanned = 0
        self.invalid_rows = 0
        self.truncated = False
        self.preview: list[DatasetPreviewRow] = []
        self.field_order: list[str] = []
        self.field_types: dict[str, set[str]] = {}
        self.observed: Counter[str] = Counter()
        self.missing: Counter[str] = Counter()
        self.empty: Counter[str] = Counter()
        self.text_lengths: list[int] = []
        self.duplicates: Counter[str] = Counter()
        self.warnings: dict[str, DatasetWarning] = {}

    @property
    def reached_scan_limit(self) -> bool:
        """Geeft terug of de volgende rij buiten de scanlimiet valt."""
        return self.rows_scanned >= self.config.max_scan_rows

    def mark_scan_limit(self) -> None:
        """Noteert dat er meer data was dan we veilig scannen."""
        self.truncated = True
        self.warn(
            "scan_limit_reached",
            f"Statistics are based on the first {self.config.max_scan_rows} rows.",
        )

    def add_row(self, row: dict[str, object]) -> None:
        """Voegt één rij toe aan schema, preview en statistieken."""
        limited_row = dict(row)
        if len(limited_row) > self.config.max_fields:
            limited_row = dict(list(limited_row.items())[: self.config.max_fields])
            self.warn("too_many_fields", "Only the first configured fields were inspected.")

        self.rows_scanned += 1
        for field in limited_row:
            if field not in self.field_order and len(self.field_order) < self.config.max_fields:
                self.field_order.append(field)

        fields_seen = set(limited_row)
        for field in self.field_order:
            if field not in fields_seen:
                self.missing[field] += 1

        safe_values: dict[str, object] = {}
        for field in self.field_order:
            if field not in limited_row:
                continue
            value = limited_row[field]
            type_name = _value_type(value)
            self.field_types.setdefault(field, set()).add(type_name)
            self.observed[field] += 1
            if value == "":
                self.empty[field] += 1
            if isinstance(value, str):
                self.text_lengths.append(len(value))
            safe_values[field] = self._safe_value(value)

        key = json.dumps(safe_values, sort_keys=True, ensure_ascii=False, default=str)
        self.duplicates[key] += 1

        if len(self.preview) < self.preview_limit:
            self.preview.append(DatasetPreviewRow(row_id=str(self.rows_scanned - 1), values=safe_values))
        elif self.preview_limit > 0:
            self.warn("preview_truncated", "Preview contains only the first configured rows.")

    def to_response(self, record: DatasetRecord) -> DatasetInspectionResponse:
        """Maakt het Pydantic responsemodel."""
        fields = [self._field(name) for name in self.field_order]
        duplicate_count = sum(count - 1 for count in self.duplicates.values() if count > 1)
        complete = not self.truncated
        row_scope: Literal["exact", "bounded_scan", "unavailable"] = "exact" if complete else "bounded_scan"
        schema_source: Literal["sample", "empty"] = "sample" if self.rows_scanned else "empty"
        return DatasetInspectionResponse(
            dataset_id=record.dataset_id,
            name=record.name,
            format=record.format,
            size_bytes=record.size_bytes,
            encoding="utf-8",
            fields=fields,
            preview_rows=self.preview,
            statistics=DatasetStatistics(
                rows_scanned=self.rows_scanned,
                row_count=self.rows_scanned if complete else None,
                row_count_scope=row_scope,
                field_count=len(fields),
                field_count_scope="sample",
                invalid_row_count=self.invalid_rows,
                duplicate_count=duplicate_count,
                duplicate_scope="bounded_scan",
                text_lengths=self._text_length_stats(),
            ),
            metadata=DatasetInspectionMetadata(
                scanned_rows=self.rows_scanned,
                preview_rows=len(self.preview),
                scan_limit=self.config.max_scan_rows,
                preview_limit=self.preview_limit,
                max_field_length=self.config.max_field_length,
                max_fields=self.config.max_fields,
                truncated=self.truncated,
                complete=complete,
                schema_source=schema_source,
            ),
            warnings=list(self.warnings.values()),
        )

    def warn(self, code: str, message: str) -> None:
        """Bewaart één waarschuwing per code."""
        self.warnings.setdefault(code, DatasetWarning(code=code, message=message))

    def _field(self, name: str) -> DatasetField:
        """Maakt een veldsamenvatting."""
        types = self.field_types.get(name, {"null"})
        if len(types) > 1:
            self.warn("mixed_field_types", "One or more fields contain mixed value types.")
            field_type = "mixed"
        else:
            field_type = next(iter(types))
        return DatasetField(
            name=name,
            type=field_type,  # type: ignore[arg-type]
            nullable="null" in types or self.missing[name] > 0,
            observed_in_rows=self.observed[name],
            missing_count=self.missing[name],
            empty_count=self.empty[name],
        )

    def _safe_value(self, value: object, depth: int = 0) -> object:
        """Maakt een waarde veilig en bounded voor JSON responses."""
        if value is None or isinstance(value, (bool, int, float)):
            return value
        if isinstance(value, str):
            if len(value) > self.config.max_field_length:
                self.warn("field_value_truncated", "One or more field values were truncated.")
                return value[: self.config.max_field_length]
            return value
        if depth >= 3:
            self.warn("unsupported_nested_values", "Deep nested values were summarized.")
            return "[nested value omitted]"
        if isinstance(value, dict):
            return {
                str(key): self._safe_value(item, depth + 1)
                for key, item in list(value.items())[: self.config.max_fields]
            }
        if isinstance(value, list):
            if len(value) > 20:
                self.warn("unsupported_nested_values", "Long array values were summarized.")
            return [self._safe_value(item, depth + 1) for item in value[:20]]
        return str(value)

    def _text_length_stats(self) -> TextLengthStatistics:
        """Berekent tekstlengtes zonder tokenization."""
        if not self.text_lengths:
            return TextLengthStatistics()
        return TextLengthStatistics(
            min=min(self.text_lengths),
            max=max(self.text_lengths),
            average=sum(self.text_lengths) / len(self.text_lengths),
        )


def _iter_txt(path: Path) -> Iterable[dict[str, object]]:
    """Leest TXT zoals de publieke loader: niet-lege regels als records."""
    with path.open("r", encoding="utf-8") as file:
        for line in file:
            value = line.strip()
            if value:
                yield {"text": value}


def _iter_csv(path: Path) -> Iterable[dict[str, object]]:
    """Leest CSV via DictReader, net als de datasetloader."""
    with path.open("r", encoding="utf-8", newline="") as file:
        for row in csv.DictReader(file):
            yield {str(key) if key is not None else "_extra": value for key, value in row.items()}


def _iter_jsonl(path: Path) -> Iterable[dict[str, object]]:
    """Leest JSONL en meldt kapotte regels veilig."""
    with path.open("r", encoding="utf-8") as file:
        for line_number, line in enumerate(file, 1):
            if not line.strip():
                continue
            try:
                value = json.loads(line)
            except json.JSONDecodeError as exc:
                raise DatasetApiError(
                    "dataset_shape_invalid",
                    f"Dataset contains malformed JSONL near line {line_number}.",
                    status_code=400,
                ) from exc
            yield _normalize_row(value)


def _iter_json(path: Path) -> Iterable[dict[str, object]]:
    """Leest de JSON-vormen die de huidige datasetloader ook ondersteunt."""
    with path.open("r", encoding="utf-8") as file:
        value = json.load(file)

    if isinstance(value, dict):
        records = value.get("data") or value.get("samples") or value.get("records")
        if isinstance(records, list):
            for row in records:
                yield _normalize_row(row)
            return
        yield dict(value)
        return

    if isinstance(value, list):
        for row in value:
            yield _normalize_row(row)
        return

    raise DatasetApiError(
        "dataset_shape_invalid",
        "Dataset JSON shape is not supported.",
        status_code=400,
    )


def _normalize_row(value: object) -> dict[str, object]:
    """Zet losse waarden om naar hetzelfde `text` veld als de loader."""
    if isinstance(value, dict):
        return {str(key): item for key, item in value.items()}
    return {"text": value}


def _dataset_id(root_name: str, relative_path: Path) -> str:
    """Maakt een stabiele veilige ID uit server-side informatie."""
    payload = f"{root_name}\0{relative_path.as_posix()}".encode("utf-8")
    return "dataset_" + hashlib.sha256(payload).hexdigest()[:12]


def _is_safe_dataset_id(value: str) -> bool:
    """Controleert of een dataset-ID geen pad kan zijn."""
    if not value.startswith("dataset_"):
        return False
    suffix = value.removeprefix("dataset_")
    return len(suffix) == 12 and all(char in "0123456789abcdef" for char in suffix)


def _is_inside(path: Path, root: Path) -> bool:
    """Controleert dat een resolved pad binnen de root blijft."""
    try:
        path.relative_to(root)
    except ValueError:
        return False
    return True


def _value_type(value: object) -> str:
    """Geeft een kleine JSON-achtige type naam terug."""
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, int) and not isinstance(value, bool):
        return "integer"
    if isinstance(value, float):
        return "number"
    if isinstance(value, str):
        return "string"
    if isinstance(value, dict):
        return "object"
    if isinstance(value, list):
        return "array"
    return "string"
