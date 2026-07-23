"""Local ArcLM Studio workspace storage.

The browser never supplies trusted filesystem paths. This module owns generated
project, dataset, and tokenizer IDs, resolves every path under one configured
workspace root, and delegates data/tokenizer work to public ArcLM APIs.
"""

from __future__ import annotations

import csv
import json
import os
import re
import secrets
import shutil
import tempfile
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Iterable, Literal, Mapping, Sequence

import arclm
from arclm.datasets import (
    build_dataset_report,
    create_dataset_manifest,
    load_dataset,
    validate_records,
)
from arclm.exceptions import ArcLMError, CheckpointError, DatasetLoadError, DatasetValidationError
from arclm.finetuning import FineTuningConfig, validate_sft_records
from arclm.models import ArcLM
from arclm.tokenizers import SentencePieceTokenizer, Tokenizer

from .config import WebConfig

ProjectStatus = Literal["active"]
DatasetSourceType = Literal["upload", "paste"]
DatasetFormat = Literal["txt", "csv", "json", "jsonl"]
DatasetValidationStatus = Literal["not_validated", "valid", "invalid"]
TokenizerStatus = Literal["ready"]
TokenizerKind = Literal["word", "sentencepiece"]
SentencePieceModelType = Literal["bpe", "unigram", "char", "word"]
ModelStatus = Literal["configured"]
RunStatus = Literal["queued", "starting", "running", "cancelling", "cancelled", "completed", "failed", "interrupted"]

PROJECT_ID_RE = re.compile(r"^project_[a-z0-9]{12}$")
DATASET_ID_RE = re.compile(r"^dataset_[a-z0-9]{12}$")
TOKENIZER_ID_RE = re.compile(r"^tokenizer_[a-z0-9]{12}$")
MODEL_ID_RE = re.compile(r"^model_[a-z0-9]{12}$")
RUN_ID_RE = re.compile(r"^run_[a-z0-9]{12}$")
SAFE_NAME_RE = re.compile(r"[^A-Za-z0-9._ -]+")
SUPPORTED_FORMATS: set[DatasetFormat] = {"txt", "csv", "json", "jsonl"}
FORMAT_BY_SUFFIX = {
    ".txt": "txt",
    ".csv": "csv",
    ".json": "json",
    ".jsonl": "jsonl",
}


class WorkspaceApiError(Exception):
    """Safe error translated by the FastAPI layer."""

    def __init__(self, code: str, message: str, status_code: int = 400, details: Mapping[str, Any] | None = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = dict(details or {})


@dataclass
class ProjectMetadata:
    """Small JSON-safe project record."""

    id: str
    name: str
    description: str
    created_at: float
    updated_at: float
    arclm_version: str
    status: ProjectStatus = "active"
    active_dataset_id: str | None = None
    active_tokenizer_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class StudioDatasetMetadata:
    """Dataset metadata stored separately from dataset contents."""

    id: str
    project_id: str
    name: str
    source_type: DatasetSourceType
    original_filename: str | None
    stored_format: DatasetFormat
    created_at: float
    size_bytes: int
    record_count: int
    selected_format: str = "plain_text"
    text_fields: list[str] = field(default_factory=lambda: ["text"])
    validation_status: DatasetValidationStatus = "not_validated"
    raw_filename: str = ""
    validation_result: dict[str, Any] | None = None
    sft_validation_result: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class StudioTokenizerMetadata:
    """Native tokenizer metadata without tokenizer internals."""

    id: str
    project_id: str
    name: str
    type: Literal["native"]
    vocab_size: int
    created_at: float
    source_dataset_id: str
    special_tokens: dict[str, str]
    status: TokenizerStatus
    tokenizer_filename: str
    tokenizer_type: TokenizerKind = "word"
    sentencepiece_model_type: SentencePieceModelType | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class StudioModelMetadata:
    """Native ArcLM model configuration stored without weights."""

    id: str
    project_id: str
    name: str
    source: Literal["native_arclm"]
    task: Literal["causal_language_modeling"]
    status: ModelStatus
    created_at: float
    updated_at: float
    tokenizer_id: str
    dataset_id: str | None
    configuration: dict[str, Any]
    parameter_count: int
    estimated_memory: dict[str, Any]
    capabilities: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class StudioRunMetadata:
    """Persistent Studio run record."""

    id: str
    project_id: str
    name: str
    status: RunStatus
    training_type: str
    created_at: float
    updated_at: float
    started_at: float | None
    completed_at: float | None
    dataset_id: str
    tokenizer_id: str
    model_id: str
    current_epoch: int
    total_epochs: int
    current_step: int
    total_steps: int | None
    latest_metrics: dict[str, Any]
    latest_checkpoint_id: str | None
    device: str
    dtype: str
    error: dict[str, Any] | None
    warnings: list[str]
    configuration: dict[str, Any]
    training_mode: str = "legacy_native_training"
    fine_tuning_method: str | None = None
    base_checkpoint_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class StudioWorkspace:
    """Direct local storage for ArcLM Studio projects, data, and tokenizers."""

    def __init__(self, config: WebConfig):
        self.config = config
        self.root = Path(config.workspace_root).expanduser().resolve()
        self.projects_root = self.root / "projects"

    def initialize(self) -> None:
        self._ensure_inside(self.root)
        self.projects_root.mkdir(parents=True, exist_ok=True)

    def status(self) -> dict[str, Any]:
        self.initialize()
        return {
            "available": True,
            "project_count": len(self.list_projects()),
            "active_dataset_count": sum(len(self.list_datasets(project.id)) for project in self.list_projects()),
            "active_tokenizer_count": sum(len(self.list_tokenizers(project.id)) for project in self.list_projects()),
        }

    def list_projects(self) -> list[ProjectMetadata]:
        self.initialize()
        projects = []
        for path in self.projects_root.glob("project_*/project.json"):
            try:
                projects.append(ProjectMetadata(**_read_json(path)))
            except (OSError, TypeError, ValueError):
                continue
        return sorted(projects, key=lambda item: item.updated_at, reverse=True)

    def create_project(self, name: str, description: str = "") -> ProjectMetadata:
        clean_name = _validate_name(name, "project_name_invalid")
        clean_description = _validate_description(description)
        if any(project.name.casefold() == clean_name.casefold() for project in self.list_projects()):
            raise WorkspaceApiError("project_conflict", "A project with that name already exists.", status_code=409)
        project_id = _new_id("project")
        now = time.time()
        project = ProjectMetadata(
            id=project_id,
            name=clean_name,
            description=clean_description,
            created_at=now,
            updated_at=now,
            arclm_version=arclm.__version__,
        )
        project_dir = self._project_dir(project_id, create=True)
        for rel in (
            "datasets/raw",
            "datasets/processed",
            "datasets/reports",
            "tokenizers",
            "models",
            "runs",
            "checkpoints",
            "evaluations",
        ):
            (project_dir / rel).mkdir(parents=True, exist_ok=True)
        self._write_project(project)
        return project

    def get_project(self, project_id: str) -> ProjectMetadata:
        path = self._project_dir(project_id) / "project.json"
        if not path.exists():
            raise WorkspaceApiError("project_not_found", "The selected project could not be found.", status_code=404)
        return ProjectMetadata(**_read_json(path))

    def update_project(self, project_id: str, *, name: str | None = None, description: str | None = None) -> ProjectMetadata:
        project = self.get_project(project_id)
        if name is not None:
            project.name = _validate_name(name, "project_name_invalid")
        if description is not None:
            project.description = _validate_description(description)
        project.updated_at = time.time()
        self._write_project(project)
        return project

    def delete_project(self, project_id: str, *, confirm: bool, confirm_name: str | None = None) -> ProjectMetadata:
        project = self.get_project(project_id)
        if not confirm or confirm_name != project.name:
            raise WorkspaceApiError(
                "request_invalid",
                "Project deletion requires confirmation and the exact project name.",
                status_code=400,
            )
        project_dir = self._project_dir(project_id)
        self._ensure_inside(project_dir)
        shutil.rmtree(project_dir)
        return project

    def list_datasets(self, project_id: str) -> list[StudioDatasetMetadata]:
        datasets_dir = self._project_dir(project_id) / "datasets"
        metadata_dir = datasets_dir / "processed"
        items = []
        for path in metadata_dir.glob("dataset_*.json"):
            try:
                items.append(StudioDatasetMetadata(**_read_json(path)))
            except (OSError, TypeError, ValueError):
                continue
        return sorted(items, key=lambda item: item.created_at, reverse=True)

    def add_dataset(
        self,
        project_id: str,
        *,
        name: str,
        source_type: DatasetSourceType,
        content: str,
        selected_format: str,
        stored_format: DatasetFormat | None = None,
        original_filename: str | None = None,
        text_fields: Sequence[str] | None = None,
    ) -> StudioDatasetMetadata:
        project = self.get_project(project_id)
        clean_name = _validate_name(name, "request_invalid")
        selected_format, required_fields = _schema_fields(selected_format, text_fields)
        fmt = _resolve_dataset_format(stored_format, original_filename)
        max_size = self.config.max_upload_size if source_type == "upload" else self.config.max_paste_size
        raw_bytes = content.encode("utf-8")
        if len(raw_bytes) > max_size:
            raise WorkspaceApiError("dataset_too_large", "Dataset content exceeds the configured size limit.", status_code=413)
        _validate_text_file_content(content, fmt)
        dataset_id = _new_id("dataset")
        safe_filename = _safe_filename(original_filename or f"{clean_name}.{fmt}", fmt)
        raw_filename = f"{dataset_id}_{safe_filename}"
        raw_path = self._project_dir(project_id) / "datasets" / "raw" / raw_filename
        self._ensure_inside(raw_path)
        raw_path.write_bytes(raw_bytes)
        try:
            records = self._load_records(project_id, raw_filename, fmt)
        except (DatasetLoadError, ArcLMError, ValueError) as exc:
            raw_path.unlink(missing_ok=True)
            raise WorkspaceApiError("dataset_parse_failed", str(exc), status_code=400) from exc
        metadata = StudioDatasetMetadata(
            id=dataset_id,
            project_id=project_id,
            name=clean_name,
            source_type=source_type,
            original_filename=original_filename,
            stored_format=fmt,
            created_at=time.time(),
            size_bytes=len(raw_bytes),
            record_count=len(records),
            selected_format=selected_format,
            text_fields=list(required_fields),
            raw_filename=raw_filename,
        )
        self._write_dataset(metadata)
        project.active_dataset_id = metadata.id
        project.updated_at = time.time()
        self._write_project(project)
        return metadata

    def get_dataset(self, project_id: str, dataset_id: str) -> StudioDatasetMetadata:
        _validate_dataset_id(dataset_id)
        path = self._dataset_meta_path(project_id, dataset_id)
        if not path.exists():
            raise WorkspaceApiError("dataset_not_found", "The selected dataset could not be found.", status_code=404)
        return StudioDatasetMetadata(**_read_json(path))

    def preview_dataset(self, project_id: str, dataset_id: str, limit: int | None = None) -> dict[str, Any]:
        metadata = self.get_dataset(project_id, dataset_id)
        preview_limit = self._preview_limit(limit)
        records = self._load_dataset_records(metadata)
        fields = _field_order(records)
        return {
            "dataset": metadata.to_dict(),
            "fields": fields,
            "total_records": len(records),
            "preview_limit": preview_limit,
            "truncated": len(records) > preview_limit,
            "records": [
                {"index": index, "values": _safe_preview_record(record, fields, self.config.max_field_length)}
                for index, record in enumerate(records[:preview_limit])
            ],
        }

    def validate_dataset(
        self,
        project_id: str,
        dataset_id: str,
        *,
        selected_format: str | None = None,
        text_fields: Sequence[str] | None = None,
        strict: bool = False,
    ) -> dict[str, Any]:
        metadata = self.get_dataset(project_id, dataset_id)
        selected_format, required_fields = _schema_fields(selected_format or metadata.selected_format, text_fields or metadata.text_fields)
        records = self._load_dataset_records(metadata)
        try:
            validation = validate_records(records, required_fields=required_fields, strict=strict)
        except DatasetValidationError as exc:
            if strict:
                raise WorkspaceApiError("dataset_validation_failed", str(exc), status_code=400) from exc
            raise
        sft_result = None
        if selected_format != "plain_text":
            try:
                sft_result = validate_sft_records(
                    records,
                    FineTuningConfig(formatter="instruction_response" if selected_format == "instruction_response" else "prompt_completion"),
                    strict=False,
                )
            except Exception:
                sft_result = None
        metadata.selected_format = selected_format
        metadata.text_fields = list(required_fields)
        metadata.validation_status = "valid" if validation.invalid_count == 0 else "invalid"
        metadata.validation_result = validation.to_dict()
        metadata.sft_validation_result = sft_result.to_dict() if sft_result is not None else None
        self._write_dataset(metadata)
        return {
            "dataset": metadata.to_dict(),
            "validation": validation.to_dict(),
            "sft_validation": metadata.sft_validation_result,
        }

    def create_manifest_and_report(self, project_id: str, dataset_id: str) -> dict[str, Any]:
        metadata = self.get_dataset(project_id, dataset_id)
        records = self._load_dataset_records(metadata)
        validation_result = validate_records(records, required_fields=metadata.text_fields, strict=False)
        manifest = create_dataset_manifest(
            dataset_name=metadata.name,
            source_type=metadata.source_type,
            source_files=[metadata.original_filename or metadata.name],
            records_before=len(records),
            records_after=validation_result.valid_count,
            validation_result=validation_result,
            text_fields=metadata.text_fields,
            transformations_applied=["schema_validation"],
        )
        tokenizer = self._active_or_temporary_tokenizer(project_id, records, metadata.text_fields)
        report = build_dataset_report(
            records,
            tokenizer=tokenizer,
            text_fields=metadata.text_fields,
            validation_result=validation_result,
            manifest=manifest,
        )
        payload = {"manifest": manifest.to_dict(), "report": report.to_dict()}
        reports_dir = self._project_dir(project_id) / "datasets" / "reports"
        _atomic_json(reports_dir / f"{dataset_id}_manifest.json", payload["manifest"])
        _atomic_json(reports_dir / f"{dataset_id}_report.json", payload["report"])
        return payload

    def create_tokenized_report(
        self,
        project_id: str,
        dataset_id: str,
        *,
        tokenizer_id: str | None,
        maximum_sequence_length: int | None = None,
    ) -> dict[str, Any]:
        """Build a dataset report with an explicit project tokenizer."""
        metadata = self.get_dataset(project_id, dataset_id)
        if not tokenizer_id:
            raise WorkspaceApiError(
                "dataset_tokenizer_required",
                "Select a ready project tokenizer before generating token statistics.",
                status_code=400,
            )
        tokenizer_meta = self.get_ready_tokenizer(project_id, tokenizer_id)
        records = self._load_dataset_records(metadata)
        validation_result = validate_records(records, required_fields=metadata.text_fields, strict=False)
        manifest = create_dataset_manifest(
            dataset_name=metadata.name,
            source_type=metadata.source_type,
            source_files=[metadata.original_filename or metadata.name],
            records_before=len(records),
            records_after=validation_result.valid_count,
            validation_result=validation_result,
            text_fields=metadata.text_fields,
            transformations_applied=["schema_validation", "token_statistics"],
        )
        tokenizer = self._load_tokenizer(project_id, tokenizer_meta)
        report = build_dataset_report(
            records,
            tokenizer=tokenizer,
            text_fields=metadata.text_fields,
            validation_result=validation_result,
            manifest=manifest,
            max_token_length=maximum_sequence_length,
        )
        payload = {
            "dataset_id": dataset_id,
            "manifest": manifest.to_dict(),
            "report": report.to_dict(),
            "tokenizer": _tokenizer_identity(tokenizer_meta),
            "report_identity": _report_identity(dataset_id, tokenizer_meta.id, maximum_sequence_length),
        }
        reports_dir = self._project_dir(project_id) / "datasets" / "reports"
        report_id = payload["report_identity"]["id"]
        _atomic_json(reports_dir / f"{report_id}_manifest.json", payload["manifest"])
        _atomic_json(reports_dir / f"{report_id}_report.json", payload)
        return payload

    def inspect_dataset_records(
        self,
        project_id: str,
        dataset_id: str,
        *,
        tokenizer_id: str,
        record_indexes: Sequence[int],
        text_fields: Sequence[str] | None = None,
        maximum_sequence_length: int | None = None,
        max_records: int | None = None,
        max_tokens_per_record: int | None = None,
    ) -> dict[str, Any]:
        """Tokenize selected dataset records with a chosen project tokenizer."""
        metadata = self.get_dataset(project_id, dataset_id)
        tokenizer_meta = self.get_ready_tokenizer(project_id, tokenizer_id)
        max_records = min(max_records or self.config.max_dataset_inspection_records, self.config.max_dataset_inspection_records)
        max_tokens = min(max_tokens_per_record or self.config.max_dataset_inspection_tokens, self.config.max_dataset_inspection_tokens)
        if len(record_indexes) > max_records:
            raise WorkspaceApiError(
                "dataset_inspection_limit_exceeded",
                "Too many records were requested for token inspection.",
                status_code=413,
            )
        records = self._load_dataset_records(metadata)
        tokenizer = self._load_tokenizer(project_id, tokenizer_meta)
        fields = list(text_fields or metadata.text_fields)
        inspected = []
        for index in record_indexes:
            if index < 0 or index >= len(records):
                raise WorkspaceApiError("request_invalid", "record index is outside the dataset.", status_code=400)
            text = _record_text(records[index], fields)
            token_ids = tokenizer.encode_text(text)
            tokens = tokenizer.decode(token_ids)
            unknown = tokenizer.get_unknown_index()
            would_truncate = bool(maximum_sequence_length and len(token_ids) > maximum_sequence_length)
            display_truncated = len(token_ids) > max_tokens
            shown_ids = token_ids[:max_tokens]
            inspected.append(
                {
                    "record_index": index,
                    "source_text": text[: self.config.max_field_length],
                    "tokens": tokens[:max_tokens],
                    "token_ids": shown_ids,
                    "token_count": len(token_ids),
                    "unknown_token_count": sum(1 for token_id in token_ids if int(token_id) == int(unknown)),
                    "would_be_truncated": would_truncate,
                    "display_truncated": display_truncated,
                    "warnings": ["Token list was shortened for display."] if display_truncated else [],
                }
            )
        return {
            "dataset_id": dataset_id,
            "tokenizer": _tokenizer_identity(tokenizer_meta),
            "maximum_sequence_length": maximum_sequence_length,
            "records": inspected,
        }

    def get_manifest(self, project_id: str, dataset_id: str) -> dict[str, Any]:
        return self._read_report_file(project_id, dataset_id, "manifest")

    def get_report(self, project_id: str, dataset_id: str) -> dict[str, Any]:
        return self._read_report_file(project_id, dataset_id, "report")

    def delete_dataset(self, project_id: str, dataset_id: str, *, confirm: bool) -> StudioDatasetMetadata:
        metadata = self.get_dataset(project_id, dataset_id)
        if not confirm:
            raise WorkspaceApiError("request_invalid", "Dataset deletion requires confirmation.", status_code=400)
        for path in [
            self._project_dir(project_id) / "datasets" / "raw" / metadata.raw_filename,
            self._dataset_meta_path(project_id, dataset_id),
            self._project_dir(project_id) / "datasets" / "reports" / f"{dataset_id}_manifest.json",
            self._project_dir(project_id) / "datasets" / "reports" / f"{dataset_id}_report.json",
        ]:
            self._ensure_inside(path)
            path.unlink(missing_ok=True)
        project = self.get_project(project_id)
        if project.active_dataset_id == dataset_id:
            project.active_dataset_id = None
            self._write_project(project)
        return metadata

    def list_tokenizers(self, project_id: str) -> list[StudioTokenizerMetadata]:
        tokenizers_dir = self._project_dir(project_id) / "tokenizers"
        items = []
        for path in tokenizers_dir.glob("tokenizer_*.meta.json"):
            try:
                items.append(StudioTokenizerMetadata(**_read_json(path)))
            except (OSError, TypeError, ValueError):
                continue
        return sorted(items, key=lambda item: item.created_at, reverse=True)

    def create_native_tokenizer(
        self,
        project_id: str,
        *,
        dataset_id: str,
        name: str,
        max_vocab: int,
        text_fields: Sequence[str] | None = None,
        tokenizer_type: TokenizerKind = "word",
        sentencepiece_model_type: SentencePieceModelType = "bpe",
    ) -> StudioTokenizerMetadata:
        dataset = self.get_dataset(project_id, dataset_id)
        clean_name = _validate_name(name, "request_invalid")
        if max_vocab < 2 or max_vocab > 100_000:
            raise WorkspaceApiError("request_invalid", "max_vocab must be between 2 and 100000.", status_code=400)
        if tokenizer_type not in {"word", "sentencepiece"}:
            raise WorkspaceApiError("request_invalid", "tokenizer_type must be 'word' or 'sentencepiece'.", status_code=400)
        if sentencepiece_model_type not in {"bpe", "unigram", "char", "word"}:
            raise WorkspaceApiError(
                "request_invalid",
                "sentencepiece_model_type must be one of: bpe, unigram, char, word.",
                status_code=400,
            )
        fields = list(text_fields or dataset.text_fields)
        records = self._load_dataset_records(dataset)
        text = _records_text(records, fields)
        if tokenizer_type == "sentencepiece":
            tokenizer = SentencePieceTokenizer(
                max_vocab=max_vocab,
                model_type=sentencepiece_model_type,
                model_name=clean_name,
            )
        else:
            tokenizer = Tokenizer(max_vocab=max_vocab)
        tokenizer.build(text)
        tokenizer_id = _new_id("tokenizer")
        tokenizer_path = self._project_dir(project_id) / "tokenizers" / f"{tokenizer_id}.json"
        tokenizer.save(tokenizer_path)
        metadata = StudioTokenizerMetadata(
            id=tokenizer_id,
            project_id=project_id,
            name=clean_name,
            type="native",
            vocab_size=tokenizer.get_vocab_size(),
            created_at=time.time(),
            source_dataset_id=dataset_id,
            special_tokens={},
            status="ready",
            tokenizer_filename=f"{tokenizer_id}.json",
            tokenizer_type=tokenizer_type,
            sentencepiece_model_type=sentencepiece_model_type if tokenizer_type == "sentencepiece" else None,
        )
        _atomic_json(self._tokenizer_meta_path(project_id, tokenizer_id), metadata.to_dict())
        project = self.get_project(project_id)
        project.active_tokenizer_id = tokenizer_id
        project.updated_at = time.time()
        self._write_project(project)
        return metadata

    def get_tokenizer(self, project_id: str, tokenizer_id: str) -> StudioTokenizerMetadata:
        _validate_tokenizer_id(tokenizer_id)
        path = self._tokenizer_meta_path(project_id, tokenizer_id)
        if not path.exists():
            raise WorkspaceApiError("tokenizer_not_found", "The selected tokenizer could not be found.", status_code=404)
        return StudioTokenizerMetadata(**_read_json(path))

    def get_ready_tokenizer(self, project_id: str, tokenizer_id: str) -> StudioTokenizerMetadata:
        try:
            metadata = self.get_tokenizer(project_id, tokenizer_id)
        except WorkspaceApiError as exc:
            raise WorkspaceApiError(
                "dataset_tokenizer_not_found",
                "The selected tokenizer could not be found in this project.",
                status_code=404,
            ) from exc
        if metadata.status != "ready":
            raise WorkspaceApiError(
                "dataset_tokenizer_not_ready",
                "The selected tokenizer is not ready.",
                status_code=409,
            )
        return metadata

    def inspect_tokenizer(self, project_id: str, tokenizer_id: str, text: str) -> dict[str, Any]:
        if not text.strip():
            raise WorkspaceApiError("request_invalid", "text must not be empty.", status_code=400)
        if len(text) > self.config.max_tokenizer_text_length:
            raise WorkspaceApiError("request_invalid", "text exceeds the tokenizer inspection limit.", status_code=413)
        metadata = self.get_tokenizer(project_id, tokenizer_id)
        tokenizer = self._load_tokenizer(project_id, metadata)
        token_ids = tokenizer.encode_text(text)
        tokens = tokenizer.decode(token_ids)
        decoded = tokenizer.decode_string(token_ids)
        unk = tokenizer.get_unknown_index()
        unknown_count = sum(1 for token_id in token_ids if int(token_id) == int(unk))
        return {
            "text": text,
            "tokens": tokens,
            "token_ids": token_ids,
            "token_count": len(token_ids),
            "unknown_token_count": unknown_count,
            "decoded_text": decoded,
            "round_trip_matches": decoded == text,
            "tokenizer_class": type(tokenizer).__name__,
            "vocab_size": tokenizer.get_vocab_size(),
            "warnings": [],
        }

    def delete_tokenizer(self, project_id: str, tokenizer_id: str, *, confirm: bool) -> StudioTokenizerMetadata:
        metadata = self.get_tokenizer(project_id, tokenizer_id)
        if not confirm:
            raise WorkspaceApiError("request_invalid", "Tokenizer deletion requires confirmation.", status_code=400)
        for path in [
            self._project_dir(project_id) / "tokenizers" / metadata.tokenizer_filename,
            self._tokenizer_meta_path(project_id, tokenizer_id),
        ]:
            self._ensure_inside(path)
            path.unlink(missing_ok=True)
        project = self.get_project(project_id)
        if project.active_tokenizer_id == tokenizer_id:
            project.active_tokenizer_id = None
            self._write_project(project)
        return metadata

    def validate_native_model(self, project_id: str, configuration: Mapping[str, Any], tokenizer_id: str) -> dict[str, Any]:
        """Validate native ArcLM constructor fields by creating a temporary model."""
        tokenizer_meta = self.get_ready_tokenizer(project_id, tokenizer_id)
        config = _normalize_model_config(configuration, tokenizer_meta.vocab_size)
        try:
            model = ArcLM(**config)
        except Exception as exc:
            raise WorkspaceApiError("model_configuration_invalid", str(exc), status_code=400) from exc
        parameter_count = int(model.get_num_parameters())
        del model
        return {
            "valid": True,
            "configuration": config,
            "parameter_count": parameter_count,
            "estimated_memory": _estimate_memory(parameter_count),
            "capabilities": _native_model_capabilities(),
            "warnings": ["Native ArcLM uses a compact causal attention block; num_attention_heads is not configurable."],
        }

    def estimate_native_model(self, project_id: str, configuration: Mapping[str, Any], tokenizer_id: str) -> dict[str, Any]:
        return self.validate_native_model(project_id, configuration, tokenizer_id)

    def create_native_model(
        self,
        project_id: str,
        *,
        name: str,
        tokenizer_id: str,
        dataset_id: str | None,
        configuration: Mapping[str, Any],
    ) -> StudioModelMetadata:
        self.get_project(project_id)
        if dataset_id:
            self.get_dataset(project_id, dataset_id)
        validation = self.validate_native_model(project_id, configuration, tokenizer_id)
        model_id = _new_id("model")
        now = time.time()
        model = StudioModelMetadata(
            id=model_id,
            project_id=project_id,
            name=_validate_name(name, "request_invalid"),
            source="native_arclm",
            task="causal_language_modeling",
            status="configured",
            created_at=now,
            updated_at=now,
            tokenizer_id=tokenizer_id,
            dataset_id=dataset_id,
            configuration=validation["configuration"],
            parameter_count=validation["parameter_count"],
            estimated_memory=validation["estimated_memory"],
            capabilities=validation["capabilities"],
        )
        _atomic_json(self._model_meta_path(project_id, model_id), model.to_dict())
        return model

    def list_models(self, project_id: str) -> list[StudioModelMetadata]:
        models_dir = self._project_dir(project_id) / "models"
        models_dir.mkdir(parents=True, exist_ok=True)
        items = []
        for path in models_dir.glob("model_*.json"):
            try:
                items.append(StudioModelMetadata(**_read_json(path)))
            except (OSError, TypeError, ValueError):
                continue
        return sorted(items, key=lambda item: item.updated_at, reverse=True)

    def get_model(self, project_id: str, model_id: str) -> StudioModelMetadata:
        _validate_model_id(model_id)
        path = self._model_meta_path(project_id, model_id)
        if not path.exists():
            raise WorkspaceApiError("model_not_found", "The selected model configuration could not be found.", status_code=404)
        return StudioModelMetadata(**_read_json(path))

    def update_model(self, project_id: str, model_id: str, *, name: str | None = None, configuration: Mapping[str, Any] | None = None) -> StudioModelMetadata:
        model = self.get_model(project_id, model_id)
        if name is not None:
            model.name = _validate_name(name, "request_invalid")
        if configuration is not None:
            validation = self.validate_native_model(project_id, configuration, model.tokenizer_id)
            model.configuration = validation["configuration"]
            model.parameter_count = validation["parameter_count"]
            model.estimated_memory = validation["estimated_memory"]
        model.updated_at = time.time()
        _atomic_json(self._model_meta_path(project_id, model_id), model.to_dict())
        return model

    def delete_model(self, project_id: str, model_id: str, *, confirm: bool) -> StudioModelMetadata:
        model = self.get_model(project_id, model_id)
        if not confirm:
            raise WorkspaceApiError("request_invalid", "Model deletion requires confirmation.", status_code=400)
        self._model_meta_path(project_id, model_id).unlink(missing_ok=True)
        return model

    def create_run_metadata(self, project_id: str, payload: Mapping[str, Any]) -> StudioRunMetadata:
        """Create queued run metadata under the project runs directory."""
        self.get_project(project_id)
        run_id = _new_id("run")
        now = time.time()
        run_dir = self._run_dir(project_id, run_id, create=True)
        (run_dir / "checkpoints").mkdir(parents=True, exist_ok=True)
        (run_dir / "artifacts").mkdir(parents=True, exist_ok=True)
        run = StudioRunMetadata(
            id=run_id,
            project_id=project_id,
            name=str(payload.get("name") or "Native training run")[:80],
            status="queued",
            training_type=str(payload.get("training_type") or "native_causal_lm"),
            created_at=now,
            updated_at=now,
            started_at=None,
            completed_at=None,
            dataset_id=str(payload["dataset_id"]),
            tokenizer_id=str(payload["tokenizer_id"]),
            model_id=str(payload["model_id"]),
            current_epoch=0,
            total_epochs=int(payload.get("epochs", 1)),
            current_step=0,
            total_steps=None,
            latest_metrics={},
            latest_checkpoint_id=None,
            device=str(payload.get("device") or "auto"),
            dtype=str(payload.get("precision") or "fp32"),
            error=None,
            warnings=[],
            configuration=dict(payload),
            training_mode=str(payload.get("training_mode") or "pretraining"),
            fine_tuning_method=payload.get("fine_tuning_method"),
            base_checkpoint_id=payload.get("base_checkpoint_id"),
        )
        _atomic_json(run_dir / "run.json", run.to_dict())
        _atomic_json(run_dir / "configuration.json", dict(payload))
        return run

    def list_runs(self, project_id: str) -> list[StudioRunMetadata]:
        runs_dir = self._project_dir(project_id) / "runs"
        runs_dir.mkdir(parents=True, exist_ok=True)
        items = []
        for path in runs_dir.glob("run_*/run.json"):
            try:
                items.append(StudioRunMetadata(**_read_json(path)))
            except (OSError, TypeError, ValueError):
                continue
        return sorted(items, key=lambda item: item.created_at, reverse=True)

    def get_run(self, project_id: str, run_id: str) -> StudioRunMetadata:
        _validate_run_id(run_id)
        path = self._run_dir(project_id, run_id) / "run.json"
        if not path.exists():
            raise WorkspaceApiError("run_not_found", "The selected training run could not be found.", status_code=404)
        return StudioRunMetadata(**_read_json(path))

    def write_run(self, run: StudioRunMetadata) -> None:
        run.updated_at = time.time()
        _atomic_json(self._run_dir(run.project_id, run.id) / "run.json", run.to_dict())

    def append_metric(self, project_id: str, run_id: str, metric: Mapping[str, Any]) -> None:
        self._append_jsonl(self._run_dir(project_id, run_id) / "metrics.jsonl", metric)

    def append_event(self, project_id: str, run_id: str, event: Mapping[str, Any]) -> None:
        self._append_jsonl(self._run_dir(project_id, run_id) / "events.jsonl", event)

    def read_run_jsonl(self, project_id: str, run_id: str, filename: str, limit: int = 200) -> list[dict[str, Any]]:
        path = self._run_dir(project_id, run_id) / filename
        self._ensure_inside(path)
        if not path.exists():
            return []
        limit = min(max(int(limit), 1), 500)
        rows = []
        for line in path.read_text(encoding="utf-8").splitlines()[-limit:]:
            if line.strip():
                rows.append(json.loads(line))
        return rows

    def mark_stale_runs_interrupted(self) -> None:
        for project in self.list_projects():
            for run in self.list_runs(project.id):
                if run.status in {"queued", "starting", "running", "cancelling"}:
                    run.status = "interrupted"
                    run.completed_at = time.time()
                    run.error = {
                        "code": "training_interrupted",
                        "message": "This training run was interrupted when ArcLM Studio stopped.",
                    }
                    self.write_run(run)

    def list_run_checkpoints(self, project_id: str, run_id: str) -> list[dict[str, Any]]:
        run_dir = self._run_dir(project_id, run_id)
        checkpoints_dir = run_dir / "checkpoints"
        items = []
        for path in sorted(checkpoints_dir.glob("checkpoint-*")):
            if path.is_dir():
                items.append(_checkpoint_summary(path))
        return items

    def get_run_checkpoint(self, project_id: str, run_id: str, checkpoint_id: str) -> dict[str, Any]:
        if not re.fullmatch(r"checkpoint-[0-9]+", checkpoint_id):
            raise WorkspaceApiError("checkpoint_not_found", "The selected checkpoint could not be found.", status_code=404)
        path = self._run_dir(project_id, run_id) / "checkpoints" / checkpoint_id
        self._ensure_inside(path)
        if not path.exists():
            raise WorkspaceApiError("checkpoint_not_found", "The selected checkpoint could not be found.", status_code=404)
        return _checkpoint_summary(path)

    def _project_dir(self, project_id: str, create: bool = False) -> Path:
        _validate_project_id(project_id)
        self.initialize()
        path = (self.projects_root / project_id).resolve()
        self._ensure_inside(path)
        if not path.exists() and not create:
            raise WorkspaceApiError("project_not_found", "The selected project could not be found.", status_code=404)
        return path

    def _write_project(self, project: ProjectMetadata) -> None:
        _atomic_json(self._project_dir(project.id, create=True) / "project.json", project.to_dict())

    def _write_dataset(self, metadata: StudioDatasetMetadata) -> None:
        _atomic_json(self._dataset_meta_path(metadata.project_id, metadata.id), metadata.to_dict())

    def _dataset_meta_path(self, project_id: str, dataset_id: str) -> Path:
        _validate_dataset_id(dataset_id)
        path = self._project_dir(project_id) / "datasets" / "processed" / f"{dataset_id}.json"
        self._ensure_inside(path)
        return path

    def _tokenizer_meta_path(self, project_id: str, tokenizer_id: str) -> Path:
        _validate_tokenizer_id(tokenizer_id)
        path = self._project_dir(project_id) / "tokenizers" / f"{tokenizer_id}.meta.json"
        self._ensure_inside(path)
        return path

    def _model_meta_path(self, project_id: str, model_id: str) -> Path:
        _validate_model_id(model_id)
        path = self._project_dir(project_id) / "models" / f"{model_id}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        self._ensure_inside(path)
        return path

    def _run_dir(self, project_id: str, run_id: str, create: bool = False) -> Path:
        _validate_run_id(run_id)
        path = self._project_dir(project_id) / "runs" / run_id
        self._ensure_inside(path)
        if not path.exists():
            if create:
                path.mkdir(parents=True, exist_ok=True)
            else:
                raise WorkspaceApiError("run_not_found", "The selected training run could not be found.", status_code=404)
        return path

    def _append_jsonl(self, path: Path, payload: Mapping[str, Any]) -> None:
        self._ensure_inside(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as file:
            file.write(json.dumps(dict(payload), sort_keys=True) + "\n")

    def _load_records(self, project_id: str, raw_filename: str, fmt: DatasetFormat) -> list[dict[str, Any]]:
        path = self._project_dir(project_id) / "datasets" / "raw" / raw_filename
        self._ensure_inside(path)
        return list(load_dataset(path, format=fmt))

    def _load_dataset_records(self, metadata: StudioDatasetMetadata) -> list[dict[str, Any]]:
        return self._load_records(metadata.project_id, metadata.raw_filename, metadata.stored_format)

    def _preview_limit(self, value: int | None) -> int:
        if value is None:
            return self.config.default_preview_rows
        if value < 0 or value > self.config.max_preview_rows:
            raise WorkspaceApiError("request_invalid", "preview limit is outside the configured bounds.", status_code=400)
        return value

    def _read_report_file(self, project_id: str, dataset_id: str, kind: str) -> dict[str, Any]:
        self.get_dataset(project_id, dataset_id)
        path = self._project_dir(project_id) / "datasets" / "reports" / f"{dataset_id}_{kind}.json"
        self._ensure_inside(path)
        if not path.exists():
            raise WorkspaceApiError("dataset_not_found", "The requested dataset report is not available.", status_code=404)
        return _read_json(path)

    def _load_tokenizer(self, project_id: str, metadata: StudioTokenizerMetadata) -> Tokenizer | SentencePieceTokenizer:
        path = self._project_dir(project_id) / "tokenizers" / metadata.tokenizer_filename
        self._ensure_inside(path)
        data = _read_json(path)
        tokenizer_type = data.get("tokenizer_type") or metadata.tokenizer_type
        if tokenizer_type == "sentencepiece":
            return SentencePieceTokenizer.from_json(data)
        return Tokenizer.from_json(data)

    def _active_or_temporary_tokenizer(self, project_id: str, records: list[dict[str, Any]], fields: Sequence[str]) -> Tokenizer:
        project = self.get_project(project_id)
        if project.active_tokenizer_id:
            try:
                return self._load_tokenizer(project_id, self.get_tokenizer(project_id, project.active_tokenizer_id))
            except WorkspaceApiError:
                pass
        tokenizer = Tokenizer(max_vocab=5000)
        tokenizer.build(_records_text(records, fields))
        return tokenizer

    def _ensure_inside(self, path: Path) -> None:
        root = self.root
        resolved = path.resolve() if path.exists() else path.parent.resolve() / path.name
        try:
            resolved.relative_to(root)
        except ValueError as exc:
            raise WorkspaceApiError("path_rejected", "Workspace path was rejected.", status_code=400) from exc


def _new_id(prefix: Literal["project", "dataset", "tokenizer", "model", "run"]) -> str:
    return f"{prefix}_{secrets.token_hex(6)}"


def _validate_project_id(project_id: str) -> None:
    if not PROJECT_ID_RE.fullmatch(project_id):
        raise WorkspaceApiError("project_not_found", "The selected project could not be found.", status_code=404)


def _validate_dataset_id(dataset_id: str) -> None:
    if not DATASET_ID_RE.fullmatch(dataset_id):
        raise WorkspaceApiError("dataset_not_found", "The selected dataset could not be found.", status_code=404)


def _validate_tokenizer_id(tokenizer_id: str) -> None:
    if not TOKENIZER_ID_RE.fullmatch(tokenizer_id):
        raise WorkspaceApiError("tokenizer_not_found", "The selected tokenizer could not be found.", status_code=404)


def _validate_model_id(model_id: str) -> None:
    if not MODEL_ID_RE.fullmatch(model_id):
        raise WorkspaceApiError("model_not_found", "The selected model configuration could not be found.", status_code=404)


def _validate_run_id(run_id: str) -> None:
    if not RUN_ID_RE.fullmatch(run_id):
        raise WorkspaceApiError("run_not_found", "The selected training run could not be found.", status_code=404)


def _validate_name(name: str, code: str) -> str:
    if not isinstance(name, str) or not name.strip():
        raise WorkspaceApiError(code, "name must not be empty.", status_code=400)
    clean = name.strip()
    if len(clean) > 80:
        raise WorkspaceApiError(code, "name must be at most 80 characters.", status_code=400)
    if any(char in clean for char in "\r\n\t"):
        raise WorkspaceApiError(code, "name must not contain control characters.", status_code=400)
    return clean


def _validate_description(description: str) -> str:
    if not isinstance(description, str):
        raise WorkspaceApiError("request_invalid", "description must be a string.", status_code=400)
    clean = description.strip()
    if len(clean) > 500:
        raise WorkspaceApiError("request_invalid", "description must be at most 500 characters.", status_code=400)
    return clean


def _schema_fields(selected_format: str, text_fields: Sequence[str] | None) -> tuple[str, list[str]]:
    selected = selected_format or "plain_text"
    defaults = {
        "plain_text": ["text"],
        "prompt_completion": ["prompt", "completion"],
        "instruction_response": ["instruction", "response"],
        "chat_messages": ["messages"],
        "custom_fields": list(text_fields or ["text"]),
    }
    if selected not in defaults:
        raise WorkspaceApiError("request_invalid", "selected_format is not supported.", status_code=400)
    fields = [str(field).strip() for field in (text_fields or defaults[selected]) if str(field).strip()]
    if not fields:
        raise WorkspaceApiError("request_invalid", "at least one text field is required.", status_code=400)
    if len(fields) > 20:
        raise WorkspaceApiError("request_invalid", "too many text fields were selected.", status_code=400)
    return selected, fields


def _resolve_dataset_format(stored_format: DatasetFormat | None, filename: str | None) -> DatasetFormat:
    if stored_format:
        if stored_format not in SUPPORTED_FORMATS:
            raise WorkspaceApiError("dataset_format_unsupported", "Dataset format is not supported.", status_code=415)
        return stored_format
    suffix = Path(filename or "").suffix.lower()
    if suffix in FORMAT_BY_SUFFIX:
        return FORMAT_BY_SUFFIX[suffix]  # type: ignore[return-value]
    raise WorkspaceApiError("dataset_format_unsupported", "Dataset format is not supported.", status_code=415)


def _safe_filename(filename: str, fmt: DatasetFormat) -> str:
    basename = Path(filename).name.replace("\\", "_").replace("/", "_")
    basename = SAFE_NAME_RE.sub("_", basename).strip(" ._") or f"dataset.{fmt}"
    if Path(basename).suffix.lower() not in FORMAT_BY_SUFFIX:
        basename = f"{basename}.{fmt}"
    return basename[:120]


def _validate_text_file_content(content: str, fmt: DatasetFormat) -> None:
    if "\x00" in content:
        raise WorkspaceApiError("dataset_format_unsupported", "Binary dataset content is not supported.", status_code=415)
    if fmt == "json":
        json.loads(content)
    elif fmt == "jsonl":
        for index, line in enumerate(content.splitlines(), 1):
            if line.strip():
                try:
                    json.loads(line)
                except json.JSONDecodeError as exc:
                    raise WorkspaceApiError("dataset_parse_failed", f"Malformed JSONL near line {index}.", status_code=400) from exc
    elif fmt == "csv":
        list(csv.DictReader(content.splitlines()))


def _atomic_json(path: Path, payload: Mapping[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as file:
            json.dump(payload, file, indent=2, sort_keys=True)
        for attempt in range(8):
            try:
                Path(tmp_name).replace(path)
                break
            except PermissionError:
                if attempt == 7:
                    raise
                time.sleep(0.025)
    finally:
        Path(tmp_name).unlink(missing_ok=True)


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _field_order(records: Iterable[Mapping[str, Any]]) -> list[str]:
    fields: list[str] = []
    for record in records:
        for key in record:
            if key not in fields:
                fields.append(str(key))
    return fields[:100]


def _safe_preview_record(record: Mapping[str, Any], fields: Sequence[str], max_length: int) -> dict[str, Any]:
    result = {}
    for field in fields:
        value = record.get(field)
        if isinstance(value, str) and len(value) > max_length:
            result[field] = value[:max_length]
        else:
            result[field] = value
    return result


def _records_text(records: Iterable[Mapping[str, Any]], fields: Sequence[str]) -> str:
    return "\n".join(
        "\n".join(str(record.get(field, "")) for field in fields if record.get(field) is not None)
        for record in records
    )


def _record_text(record: Mapping[str, Any], fields: Sequence[str]) -> str:
    return "\n".join(str(record.get(field, "")) for field in fields if record.get(field) is not None)


def _tokenizer_identity(metadata: StudioTokenizerMetadata) -> dict[str, Any]:
    return {
        "id": metadata.id,
        "name": metadata.name,
        "type": metadata.type,
        "tokenizer_type": metadata.tokenizer_type,
        "sentencepiece_model_type": metadata.sentencepiece_model_type,
        "vocab_size": metadata.vocab_size,
        "status": metadata.status,
    }


def _report_identity(dataset_id: str, tokenizer_id: str, maximum_sequence_length: int | None) -> dict[str, Any]:
    suffix = f"{dataset_id}-{tokenizer_id}-{maximum_sequence_length or 'full'}"
    return {
        "id": "report_" + re.sub(r"[^a-zA-Z0-9_-]+", "_", suffix),
        "dataset_id": dataset_id,
        "tokenizer_id": tokenizer_id,
        "maximum_sequence_length": maximum_sequence_length,
    }


def _normalize_model_config(configuration: Mapping[str, Any], tokenizer_vocab_size: int) -> dict[str, Any]:
    config = dict(configuration or {})
    if "num_attention_heads" in config and int(config["num_attention_heads"]) != 1:
        raise WorkspaceApiError(
            "model_configuration_invalid",
            "Native ArcLM does not expose configurable attention heads; use num_attention_heads=1 or omit it.",
            status_code=400,
        )
    vocab_size = int(config.get("vocab_size") or tokenizer_vocab_size)
    if vocab_size != int(tokenizer_vocab_size):
        raise WorkspaceApiError(
            "tokenizer_vocab_model_mismatch",
            "Model vocabulary size must match the selected tokenizer vocabulary size.",
            status_code=400,
        )
    normalized = {
        "vocab_size": vocab_size,
        "embed_dim": int(config.get("embed_dim", config.get("embedding_dim", 64))),
        "block_size": int(config.get("block_size", config.get("context_length", 64))),
        "num_blocks": int(config.get("num_blocks", config.get("num_layers", 2))),
        "dropout": float(config.get("dropout", 0.0)),
    }
    if normalized["embed_dim"] > 2048 or normalized["block_size"] > 4096 or normalized["num_blocks"] > 96:
        raise WorkspaceApiError("model_configuration_invalid", "Native model configuration is outside Studio safety limits.", status_code=400)
    return normalized


def _estimate_memory(parameter_count: int) -> dict[str, Any]:
    parameter_memory = {
        "float32": parameter_count * 4,
        "float16": parameter_count * 2,
        "bfloat16": parameter_count * 2,
    }
    return {
        "parameter_memory_bytes": parameter_memory,
        "estimated_training_memory_bytes": {
            "minimum": parameter_memory["float32"] * 4,
            "recommended": parameter_memory["float32"] * 6,
        },
        "warnings": ["Training-memory estimates are approximate and do not guarantee CUDA allocator behavior."],
    }


def _native_model_capabilities() -> dict[str, Any]:
    return {
        "source": "native_arclm",
        "task": "causal_language_modeling",
        "can_forward": True,
        "can_generate": True,
        "can_train": True,
        "can_save_reload": True,
        "supports_cpu": True,
        "supports_cuda": True,
        "supports_external_models": False,
    }


def _checkpoint_summary(path: Path) -> dict[str, Any]:
    from arclm.checkpoints import inspect_checkpoint

    checkpoint_file = path / "training.pt"
    base = {
        "id": path.name,
        "created_at": path.stat().st_mtime,
        "metrics": {},
        "file_size": checkpoint_file.stat().st_size if checkpoint_file.is_file() else 0,
        "model_source": "native_checkpoint",
        "model_task": "causal_language_modeling",
        "architecture": "ArcLM",
        "has_optimizer_state": False,
        "has_scheduler_state": False,
        "reload_compatibility": "metadata_incomplete",
        "warnings": [],
    }
    if not checkpoint_file.is_file():
        base["warnings"] = ["Checkpoint is not complete yet or its tensor payload is missing."]
        return base
    try:
        info = inspect_checkpoint(path)
    except CheckpointError:
        base["reload_compatibility"] = "corrupted"
        base["warnings"] = ["Checkpoint metadata or tensor payload could not be read."]
        return base
    base.update(
        {
            "epoch": info.epoch,
            "step": info.global_step,
            "model_source": info.metadata.get("source_type") or info.metadata.get("model_source") or "native_checkpoint",
            "model_task": info.metadata.get("model_task") or "causal_language_modeling",
            "architecture": info.metadata.get("model_type") or "ArcLM",
            "has_optimizer_state": info.has_optimizer_state,
            "has_scheduler_state": info.has_scheduler_state,
            "reload_compatibility": "compatible",
        }
    )
    fine_tuning = info.metadata.get("fine_tuning")
    if fine_tuning:
        base["fine_tuning"] = fine_tuning
        base["training_mode"] = fine_tuning.get("training_mode")
        base["fine_tuning_method"] = fine_tuning.get("fine_tuning_method")
        base["format_fingerprint"] = fine_tuning.get("format_fingerprint")
    return base
