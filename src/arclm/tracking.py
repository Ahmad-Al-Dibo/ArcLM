"""Local experiment tracking and reproducible run manifests."""

from __future__ import annotations

import hashlib
import json
import math
import os
import platform
import random
import shutil
import tempfile
import time
import uuid
import warnings
from dataclasses import asdict, dataclass, field, is_dataclass
from datetime import datetime, timezone

try:  # Python 3.11+
    from datetime import UTC
except ImportError:  # pragma: no cover - 3.9/3.10
    UTC = timezone.utc
from enum import Enum
from pathlib import Path
from typing import Any, Iterable, Mapping

from ._version import __version__


RUN_FORMAT = "arclm-experiment-run"
RUN_VERSION = 1
EVENT_VERSION = 1
DEFAULT_RUN_ROOT = "runs"
MAX_RUN_NAME_LENGTH = 120
MAX_EVENT_PAYLOAD_KEYS = 32
MAX_METRICS_PER_EVENT = 32


class RunTrackingError(RuntimeError):
    """Fout voor lokale run tracking."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


class RunStatus(str, Enum):
    """Stabiele statuswaarden voor een run manifest."""

    CREATED = "created"
    RUNNING = "running"
    INTERRUPTED = "interrupted"
    COMPLETED = "completed"
    FAILED = "failed"


class RunOperation(str, Enum):
    """Hoofdtype van de run."""

    TRAINING = "training"
    FINE_TUNING = "fine_tuning"
    EVALUATION = "evaluation"


class TrainingMethod(str, Enum):
    """Methode binnen training of fine-tuning."""

    FULL_FINE_TUNING = "full_fine_tuning"
    LORA = "lora"
    QLORA = "qlora"


_ALLOWED_TRANSITIONS = {
    RunStatus.CREATED: {RunStatus.RUNNING, RunStatus.FAILED},
    RunStatus.RUNNING: {
        RunStatus.COMPLETED,
        RunStatus.FAILED,
        RunStatus.INTERRUPTED,
    },
    RunStatus.INTERRUPTED: {RunStatus.RUNNING, RunStatus.FAILED},
    RunStatus.COMPLETED: set(),
    RunStatus.FAILED: set(),
}


@dataclass(frozen=True)
class RunStorageConfig:
    """Instellingen voor lokale run opslag."""

    root_directory: str | Path = DEFAULT_RUN_ROOT
    flush_metrics_every: int = 1
    fsync: bool = False
    lock_timeout_seconds: float | None = None

    def __post_init__(self) -> None:
        if self.flush_metrics_every <= 0:
            raise RunTrackingError(
                "run_config_invalid",
                "flush_metrics_every must be greater than zero",
            )
        if self.lock_timeout_seconds is not None and self.lock_timeout_seconds <= 0:
            raise RunTrackingError(
                "run_config_invalid",
                "lock_timeout_seconds must be greater than zero",
            )

    def to_dict(self) -> dict[str, Any]:
        """Geeft een veilige configuratiekopie terug."""
        return {
            "root_directory": "<local-run-root>",
            "flush_metrics_every": self.flush_metrics_every,
            "fsync": self.fsync,
            "lock_timeout_seconds": self.lock_timeout_seconds,
        }


@dataclass(frozen=True)
class RunConfig:
    """Gebruikersinstellingen voor een nieuwe run."""

    name: str | None = None
    operation: RunOperation | str = RunOperation.TRAINING
    training_method: TrainingMethod | str | None = None
    storage: RunStorageConfig = field(default_factory=RunStorageConfig)
    run_id: str | None = None

    def __post_init__(self) -> None:
        _coerce_operation(self.operation)
        if self.training_method is not None:
            _coerce_training_method(self.training_method)
        if self.run_id is not None and not _is_safe_id(self.run_id, "run_"):
            raise RunTrackingError("run_config_invalid", "run_id is not valid")
        if self.name is not None:
            _validate_run_name(self.name)

    def to_dict(self) -> dict[str, Any]:
        """Zet de run config om naar JSON-vriendelijke data."""
        return {
            "name": self.name,
            "operation": _coerce_operation(self.operation).value,
            "training_method": (
                _coerce_training_method(self.training_method).value
                if self.training_method is not None
                else None
            ),
            "storage": self.storage.to_dict(),
            "run_id": self.run_id,
        }


@dataclass
class RunManifest:
    """Versioned manifest voor een lokale ArcLM run."""

    run_format: str
    run_version: int
    run_id: str
    name: str | None
    status: str
    operation: str
    training_method: str | None
    created_at: str
    started_at: str | None = None
    updated_at: str | None = None
    completed_at: str | None = None
    failed_at: str | None = None
    interrupted_at: str | None = None
    resume_count: int = 0
    fingerprint: str | None = None
    config: dict[str, Any] = field(default_factory=dict)
    model: dict[str, Any] = field(default_factory=dict)
    tokenizer: dict[str, Any] = field(default_factory=dict)
    dataset: dict[str, Any] = field(default_factory=dict)
    peft: dict[str, Any] = field(default_factory=dict)
    quantization: dict[str, Any] = field(default_factory=dict)
    environment: dict[str, Any] = field(default_factory=dict)
    reproducibility: dict[str, Any] = field(default_factory=dict)
    outputs: dict[str, Any] = field(default_factory=dict)
    summaries: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Zet manifest om naar een gewone dict."""
        return _json_safe(asdict(self))

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "RunManifest":
        """Maakt een manifest vanuit gevalideerde JSON data."""
        if values.get("run_format") != RUN_FORMAT:
            raise RunTrackingError("run_invalid", "Unsupported run format")
        version = values.get("run_version")
        if not isinstance(version, int) or version <= 0:
            raise RunTrackingError("run_invalid", "run_version must be positive")
        if version > RUN_VERSION:
            raise RunTrackingError(
                "run_version_unsupported",
                f"Unsupported run version: {version}",
            )
        status = _coerce_status(values.get("status"))
        operation = _coerce_operation(values.get("operation"))
        method = values.get("training_method")
        if method is not None:
            _coerce_training_method(method)
        run_id = values.get("run_id")
        if not isinstance(run_id, str) or not _is_safe_id(run_id, "run_"):
            raise RunTrackingError("run_invalid", "run_id is not valid")
        name = values.get("name")
        if name is not None:
            _validate_run_name(str(name))
        data = dict(values)
        data["status"] = status.value
        data["operation"] = operation.value
        return cls(**{key: data.get(key) for key in cls.__dataclass_fields__})


@dataclass
class RunInfo:
    """Veilige inspectie van een run zonder modellen te laden."""

    run_id: str
    path: str
    status: str
    operation: str
    training_method: str | None
    name: str | None
    created_at: str
    updated_at: str | None
    completed_at: str | None
    resume_count: int
    fingerprint: str | None
    event_count: int
    metric_count: int
    checkpoint_count: int
    adapter_count: int
    artifact_count: int
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Geeft een JSON-vriendelijke inspectie terug."""
        return asdict(self)


@dataclass
class RunComparison:
    """Kleine vergelijking tussen meerdere runs."""

    run_ids: list[str]
    same_fingerprint: bool
    statuses: dict[str, str]
    metric_summary: dict[str, dict[str, float]]
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Geeft een JSON-vriendelijke vergelijking terug."""
        return asdict(self)


class RunTracker:
    """Schrijft een lokale ArcLM run manifest, events en metrics."""

    def __init__(
        self,
        run_dir: str | Path,
        *,
        storage: RunStorageConfig | None = None,
        create: bool = False,
    ) -> None:
        self.run_dir = Path(run_dir)
        self.storage = storage or RunStorageConfig(root_directory=self.run_dir.parent)
        self.manifest_path = self.run_dir / "manifest.json"
        self.events_path = self.run_dir / "events.jsonl"
        self.metrics_path = self.run_dir / "metrics.jsonl"
        self.summaries_dir = self.run_dir / "summaries"
        self.references_dir = self.run_dir / "references"
        self.lock_path = self.run_dir / ".run.lock"
        if create:
            self.run_dir.mkdir(parents=True, exist_ok=False)
            self.summaries_dir.mkdir()
            self.references_dir.mkdir()
        if not self.manifest_path.exists():
            raise RunTrackingError("run_not_found", "Run manifest not found")
        self.manifest = load_run_manifest(self.manifest_path)
        self._event_sequence = _last_sequence(self.events_path)
        self._metric_sequence = _last_sequence(self.metrics_path)
        self._metric_writes_since_flush = 0
        self._acquire_lock()

    @classmethod
    def create(cls, config: RunConfig | None = None, **updates: Any) -> "RunTracker":
        """Maakt een nieuwe lokale run."""
        config = config or RunConfig(**updates)
        run_id = config.run_id or _generate_run_id()
        root = Path(config.storage.root_directory)
        _reject_unsafe_root(root)
        run_dir = root / run_id
        if run_dir.exists():
            raise RunTrackingError("run_already_exists", "Run directory already exists")
        created_at = _utc_now()
        manifest = RunManifest(
            run_format=RUN_FORMAT,
            run_version=RUN_VERSION,
            run_id=run_id,
            name=config.name,
            status=RunStatus.CREATED.value,
            operation=_coerce_operation(config.operation).value,
            training_method=(
                _coerce_training_method(config.training_method).value
                if config.training_method is not None
                else None
            ),
            created_at=created_at,
            updated_at=created_at,
            environment=build_environment_summary(),
            reproducibility=build_reproducibility_metadata(),
        )
        root.mkdir(parents=True, exist_ok=True)
        run_dir.mkdir()
        (run_dir / "summaries").mkdir()
        (run_dir / "references").mkdir()
        _write_json_atomic(run_dir / "manifest.json", manifest.to_dict())
        tracker = cls(run_dir, storage=config.storage)
        tracker.record_event("run_created", {"name": config.name})
        tracker._refresh_fingerprint()
        return tracker

    def close(self) -> None:
        """Verwijdert de lokale schrijf-lock."""
        if self.lock_path.exists():
            try:
                self.lock_path.unlink()
            except OSError:
                pass

    def __enter__(self) -> "RunTracker":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        if exc is not None and self.manifest.status == RunStatus.RUNNING.value:
            self.fail(str(exc))
        self.close()

    def start(self) -> None:
        """Zet de run op running."""
        self._transition(RunStatus.RUNNING, "run_started")

    def resume(
        self,
        *,
        expected_fingerprint: str | None = None,
        strict: bool = True,
    ) -> None:
        """Hervat een onderbroken run."""
        if self.manifest.status != RunStatus.INTERRUPTED.value:
            raise RunTrackingError(
                "run_status_transition_invalid",
                "Only interrupted runs can be resumed",
            )
        if expected_fingerprint and self.manifest.fingerprint != expected_fingerprint:
            message = "Run fingerprint does not match the requested resume"
            if strict:
                raise RunTrackingError("run_resume_incompatible", message)
            self.record_event("resume_fingerprint_warning", {"message": message})
        self._transition(RunStatus.RUNNING, "run_resumed", resume=True)

    def complete(self, summary: Mapping[str, Any] | None = None) -> None:
        """Markeert de run als voltooid."""
        if summary:
            self.manifest.summaries["final"] = _json_safe(summary)
        self._transition(RunStatus.COMPLETED, "run_completed")

    def interrupt(self, reason: str | None = None) -> None:
        """Markeert de run als onderbroken."""
        self._transition(RunStatus.INTERRUPTED, "run_interrupted", {"reason": reason})

    def fail(self, message: str, *, code: str = "run_failed") -> None:
        """Markeert de run als gefaald zonder stacktrace op te slaan."""
        self._transition(
            RunStatus.FAILED,
            "run_failed",
            {"code": code, "message": _bounded_string(message, 500)},
        )

    def update_manifest(self, **sections: Any) -> None:
        """Werkt manifest-secties atomisch bij."""
        for key, value in sections.items():
            if key not in {
                "config",
                "model",
                "tokenizer",
                "dataset",
                "peft",
                "quantization",
                "environment",
                "reproducibility",
                "outputs",
                "summaries",
            }:
                raise RunTrackingError("run_invalid", f"Unknown manifest section: {key}")
            current = getattr(self.manifest, key)
            if isinstance(current, dict) and isinstance(value, Mapping):
                current.update(_json_safe(value))
            else:
                setattr(self.manifest, key, _json_safe(value))
        self._refresh_fingerprint()

    def record_config(
        self,
        *,
        training_config: Any | None = None,
        fine_tuning_config: Any | None = None,
        peft_config: Any | None = None,
        quantization_config: Any | None = None,
        evaluation_config: Any | None = None,
    ) -> None:
        """Slaat effectieve configs op zonder runtime objecten."""
        config: dict[str, Any] = dict(self.manifest.config)
        if training_config is not None:
            config["training"] = _safe_config_snapshot(training_config)
        if fine_tuning_config is not None:
            config["fine_tuning"] = _safe_config_snapshot(fine_tuning_config)
        if evaluation_config is not None:
            config["evaluation"] = _safe_config_snapshot(evaluation_config)
        peft: dict[str, Any] = dict(self.manifest.peft)
        if peft_config is not None:
            peft["config"] = _safe_config_snapshot(peft_config)
        quantization: dict[str, Any] = dict(self.manifest.quantization)
        if quantization_config is not None:
            quantization["config"] = _safe_config_snapshot(quantization_config)
        self.update_manifest(config=config, peft=peft, quantization=quantization)

    def record_model(self, model: Any, **metadata: Any) -> None:
        """Slaat veilige modelidentiteit op."""
        info = {
            "model_type": type(model).__name__,
            "parameter_count": _count_parameters(model),
            "trainable_parameter_count": _count_parameters(model, trainable_only=True),
        }
        info.update(_json_safe(metadata))
        self.update_manifest(model=info)

    def record_tokenizer(self, tokenizer: Any | None, **metadata: Any) -> None:
        """Slaat veilige tokenizeridentiteit op."""
        if tokenizer is None:
            self.update_manifest(tokenizer={"present": False})
            return
        info = {
            "present": True,
            "tokenizer_type": type(tokenizer).__name__,
            "vocab_size": _safe_tokenizer_vocab_size(tokenizer),
            "bos_token_id": getattr(tokenizer, "bos_token_id", None),
            "eos_token_id": getattr(tokenizer, "eos_token_id", None),
            "pad_token_id": getattr(tokenizer, "pad_token_id", None),
            "unk_token_id": getattr(tokenizer, "unk_token_id", None),
        }
        info.update(_json_safe(metadata))
        self.update_manifest(tokenizer=info)

    def record_dataset(self, report: Any | Mapping[str, Any], **metadata: Any) -> None:
        """Slaat dataset fingerprint en tellingen op."""
        values = _to_plain_dict(report)
        safe = {
            key: values.get(key)
            for key in (
                "mode",
                "formatter",
                "records_seen",
                "records_valid",
                "records_rejected",
                "records_truncated",
                "examples_dropped",
                "total_tokens",
                "trainable_tokens",
                "dataset_fingerprint",
            )
            if key in values
        }
        safe.update(_redact_paths(metadata))
        self.update_manifest(dataset=safe)

    def record_fine_tuning_result(self, result: Any) -> None:
        """Koppelt een FineTuningResult aan de run."""
        self.record_config(
            training_config=getattr(result, "training_config", None),
            fine_tuning_config=getattr(result, "fine_tuning_config", None),
            peft_config=getattr(result, "peft_config", None),
            quantization_config=getattr(getattr(result, "peft_config", None), "quantization", None),
        )
        self.record_model(getattr(result, "model", None))
        self.record_tokenizer(getattr(result, "tokenizer", None))
        self.record_dataset(getattr(result, "dataset_report"))
        peft_result = getattr(result, "peft_result", None)
        if peft_result is not None and hasattr(peft_result, "to_dict"):
            self.update_manifest(peft={"result": peft_result.to_dict()})
        checkpoint_path = getattr(result, "checkpoint_path", None)
        if checkpoint_path:
            self.record_checkpoint(checkpoint_path)
        evaluation = getattr(result, "evaluation_result", None)
        if evaluation:
            self.record_evaluation(evaluation)
        self.record_event("fine_tuning_result_recorded")

    def record_evaluation(self, result: Any, *, split: str = "eval") -> None:
        """Slaat evaluatiemetrics op."""
        metrics = getattr(result, "metrics", result)
        metrics = dict(metrics or {})
        self.record_metric(split=split, metrics=metrics)
        self.manifest.summaries["evaluation"] = {"metrics": _metric_values(metrics)}
        self._save_manifest()
        self.record_event("evaluation_completed", {"metric_names": sorted(metrics)})

    def record_metric(
        self,
        *,
        metrics: Mapping[str, Any],
        step: int | None = None,
        epoch: int | None = None,
        split: str = "train",
    ) -> None:
        """Voegt een metric-record toe aan `metrics.jsonl`."""
        clean = _metric_values(metrics)
        self._metric_sequence += 1
        record = {
            "metric_format": "arclm-run-metric",
            "metric_version": EVENT_VERSION,
            "run_id": self.manifest.run_id,
            "sequence": self._metric_sequence,
            "timestamp": _utc_now(),
            "step": step,
            "epoch": epoch,
            "split": split,
            "metrics": clean,
        }
        _append_jsonl(self.metrics_path, record, fsync=self.storage.fsync)
        self._metric_writes_since_flush += 1

    def record_event(
        self,
        event_type: str,
        payload: Mapping[str, Any] | None = None,
    ) -> None:
        """Voegt een veilig event toe aan `events.jsonl`."""
        if not event_type or not isinstance(event_type, str):
            raise RunTrackingError("run_event_invalid", "event_type must be a string")
        payload = _bounded_payload(payload or {})
        self._event_sequence += 1
        record = {
            "event_format": "arclm-run-event",
            "event_version": EVENT_VERSION,
            "run_id": self.manifest.run_id,
            "sequence": self._event_sequence,
            "timestamp": _utc_now(),
            "event_type": event_type,
            "payload": payload,
        }
        _append_jsonl(self.events_path, record, fsync=self.storage.fsync)

    def record_checkpoint(self, path: str | Path, *, role: str = "training_checkpoint") -> None:
        """Registreert een checkpoint zonder het te kopiëren."""
        self._record_reference("checkpoints", path, role=role, event_type="checkpoint_saved")

    def record_adapter_artifact(self, path: str | Path) -> None:
        """Registreert een adapter artifact."""
        self._record_reference("adapters", path, role="adapter_artifact", event_type="adapter_saved")

    def record_model_artifact(self, path: str | Path) -> None:
        """Registreert een final model artifact."""
        self._record_reference("artifacts", path, role="model_artifact", event_type="artifact_saved")

    def _record_reference(
        self,
        kind: str,
        path: str | Path,
        *,
        role: str,
        event_type: str,
    ) -> None:
        reference = _safe_reference(path, role=role)
        values = _load_reference_list(self.references_dir / f"{kind}.json")
        values.append(reference)
        _write_json_atomic(self.references_dir / f"{kind}.json", values)
        outputs = dict(self.manifest.outputs)
        outputs[kind] = len(values)
        self.update_manifest(outputs=outputs)
        self.record_event(event_type, {"role": role, "path_name": reference["path_name"]})

    def _transition(
        self,
        status: RunStatus,
        event_type: str,
        payload: Mapping[str, Any] | None = None,
        *,
        resume: bool = False,
    ) -> None:
        current = _coerce_status(self.manifest.status)
        if status not in _ALLOWED_TRANSITIONS[current]:
            raise RunTrackingError(
                "run_status_transition_invalid",
                f"Cannot transition run from {current.value} to {status.value}",
            )
        now = _utc_now()
        self.manifest.status = status.value
        self.manifest.updated_at = now
        if status == RunStatus.RUNNING and self.manifest.started_at is None:
            self.manifest.started_at = now
        if resume:
            self.manifest.resume_count += 1
        if status == RunStatus.COMPLETED:
            self.manifest.completed_at = now
        if status == RunStatus.FAILED:
            self.manifest.failed_at = now
        if status == RunStatus.INTERRUPTED:
            self.manifest.interrupted_at = now
        self._save_manifest()
        self.record_event(event_type, payload)

    def _refresh_fingerprint(self) -> None:
        self.manifest.fingerprint = build_run_fingerprint(self.manifest)
        self._save_manifest()

    def _save_manifest(self) -> None:
        self.manifest.updated_at = _utc_now()
        _write_json_atomic(self.manifest_path, self.manifest.to_dict())

    def _acquire_lock(self) -> None:
        if self.lock_path.exists():
            if self.storage.lock_timeout_seconds is None:
                raise RunTrackingError("run_locked", "Run is already open for writing")
            age = time.time() - self.lock_path.stat().st_mtime
            if age < self.storage.lock_timeout_seconds:
                raise RunTrackingError("run_locked", "Run is already open for writing")
        self.lock_path.write_text(
            json.dumps({"run_id": self.manifest.run_id, "created_at": _utc_now()}),
            encoding="utf-8",
        )


class RunTrackingCallback:
    """Training callback die run events en metrics schrijft."""

    def __init__(
        self,
        tracker: RunTracker,
        *,
        complete_on_train_end: bool = False,
    ) -> None:
        self.tracker = tracker
        self.complete_on_train_end = complete_on_train_end

    def on_train_start(self, trainer) -> None:
        """Start de run en bewaart model/config metadata."""
        if self.tracker.manifest.status == RunStatus.CREATED.value:
            self.tracker.start()
        self.tracker.record_config(training_config=getattr(trainer, "config", None))
        self.tracker.record_model(getattr(trainer, "model", None))

    def on_step_end(self, trainer, state) -> None:
        """Schrijft een train metric na een stap."""
        metrics = {}
        last_loss = getattr(state, "last_loss", None)
        if last_loss is not None:
            metrics["loss"] = last_loss
        learning_rate = getattr(state, "learning_rate", None)
        if learning_rate is not None:
            metrics["learning_rate"] = learning_rate
        if metrics:
            self.tracker.record_metric(
                metrics=metrics,
                step=getattr(state, "global_step", None),
                epoch=getattr(state, "epoch", None),
                split="train",
            )

    def on_evaluate(self, trainer, metrics) -> None:
        """Schrijft evaluatiemetrics."""
        self.tracker.record_metric(
            metrics=metrics,
            step=getattr(trainer, "global_step", None),
            epoch=getattr(trainer, "current_epoch", None),
            split="eval",
        )
        self.tracker.record_event("evaluation_completed")

    def on_checkpoint_save(self, trainer, path) -> None:
        """Registreert een checkpoint."""
        self.tracker.record_checkpoint(path)

    def on_train_end(self, trainer) -> None:
        """Sluit optioneel de run af."""
        self.tracker.record_event("training_completed")
        if self.complete_on_train_end:
            self.tracker.complete(
                {
                    "global_step": getattr(trainer, "global_step", None),
                    "optimizer_step": getattr(trainer, "optimizer_step", None),
                }
            )

    def on_train_interrupted(self, trainer, reason: str | None = None) -> None:
        """Markeert een run als onderbroken wanneer de trainer dit doorgeeft."""
        if self.tracker.manifest.status == RunStatus.RUNNING.value:
            self.tracker.interrupt(reason or "training interrupted")

    def on_train_error(self, trainer, error: BaseException | str) -> None:
        """Markeert een run als gefaald zonder stacktrace te bewaren."""
        if self.tracker.manifest.status == RunStatus.RUNNING.value:
            self.tracker.fail(str(error), code="training_error")


def create_run(config: RunConfig | None = None, **updates: Any) -> RunTracker:
    """Maakt een nieuwe lokale run tracker."""
    return RunTracker.create(config, **updates)


def load_run(path: str | Path, *, storage: RunStorageConfig | None = None) -> RunTracker:
    """Opent een bestaande run voor schrijven."""
    run_dir = _resolve_run_dir(path)
    return RunTracker(run_dir, storage=storage)


def inspect_run(path: str | Path) -> RunInfo:
    """Inspecteert een run zonder modellen of optionele packages te laden."""
    run_dir = _resolve_run_dir(path)
    manifest = load_run_manifest(run_dir / "manifest.json")
    warnings_found: list[str] = []
    events = _read_jsonl(run_dir / "events.jsonl", warnings_found)
    metrics = _read_jsonl(run_dir / "metrics.jsonl", warnings_found)
    if manifest.status == RunStatus.RUNNING.value:
        warnings_found.append("Run is still marked running; it may be interrupted")
    references = _reference_counts(run_dir)
    return RunInfo(
        run_id=manifest.run_id,
        path=str(run_dir),
        status=manifest.status,
        operation=manifest.operation,
        training_method=manifest.training_method,
        name=manifest.name,
        created_at=manifest.created_at,
        updated_at=manifest.updated_at,
        completed_at=manifest.completed_at,
        resume_count=manifest.resume_count,
        fingerprint=manifest.fingerprint,
        event_count=len(events),
        metric_count=len(metrics),
        checkpoint_count=references["checkpoints"],
        adapter_count=references["adapters"],
        artifact_count=references["artifacts"],
        warnings=warnings_found,
    )


def validate_run(path: str | Path) -> RunInfo:
    """Valideert manifest, streams en veilige referenties."""
    run_dir = _resolve_run_dir(path)
    if not run_dir.exists():
        raise RunTrackingError("run_not_found", "Run directory not found")
    if _has_symlink_escape(run_dir):
        raise RunTrackingError("run_invalid", "Run directory contains an unsafe symlink")
    info = inspect_run(run_dir)
    for filename in ("checkpoints.json", "adapters.json", "artifacts.json"):
        _validate_references(run_dir / "references" / filename)
    return info


def list_runs(
    root_directory: str | Path = DEFAULT_RUN_ROOT,
    *,
    status: RunStatus | str | None = None,
    limit: int = 100,
) -> list[RunInfo]:
    """Geeft run summaries in deterministische volgorde."""
    if limit <= 0:
        raise RunTrackingError("run_config_invalid", "limit must be greater than zero")
    root = Path(root_directory)
    if not root.exists():
        return []
    wanted = _coerce_status(status).value if status is not None else None
    runs: list[RunInfo] = []
    for entry in sorted(root.iterdir(), key=lambda item: item.name):
        if not entry.is_dir():
            continue
        try:
            info = inspect_run(entry)
        except RunTrackingError:
            continue
        if wanted is None or info.status == wanted:
            runs.append(info)
        if len(runs) >= limit:
            break
    return runs


def compare_runs(paths: Iterable[str | Path], *, metric_name: str = "loss") -> RunComparison:
    """Vergelijkt een kleine lijst lokale runs."""
    infos = [inspect_run(path) for path in paths]
    fingerprints = {info.fingerprint for info in infos}
    summaries: dict[str, dict[str, float]] = {}
    warnings_found: list[str] = []
    for info in infos:
        metrics = _read_jsonl(Path(info.path) / "metrics.jsonl", warnings_found)
        values = [
            float(record["metrics"][metric_name])
            for record in metrics
            if metric_name in record.get("metrics", {})
        ]
        if values:
            summaries[info.run_id] = {
                "first": values[0],
                "last": values[-1],
                "best": min(values),
                "count": float(len(values)),
            }
        else:
            summaries[info.run_id] = {}
    return RunComparison(
        run_ids=[info.run_id for info in infos],
        same_fingerprint=len(fingerprints) == 1,
        statuses={info.run_id: info.status for info in infos},
        metric_summary=summaries,
        warnings=warnings_found,
    )


def build_run_fingerprint(manifest: RunManifest | Mapping[str, Any]) -> str:
    """Maakt een deterministische fingerprint van reproduceerbare runvelden."""
    values = manifest.to_dict() if isinstance(manifest, RunManifest) else dict(manifest)
    payload = {
        "run_format": values.get("run_format"),
        "run_version": values.get("run_version"),
        "operation": values.get("operation"),
        "training_method": values.get("training_method"),
        "config": values.get("config") or {},
        "model": values.get("model") or {},
        "tokenizer": values.get("tokenizer") or {},
        "dataset": values.get("dataset") or {},
        "peft": values.get("peft") or {},
        "quantization": values.get("quantization") or {},
        "reproducibility": values.get("reproducibility") or {},
    }
    encoded = json.dumps(_json_safe(payload), sort_keys=True, separators=(",", ":"))
    return "runfp_" + hashlib.sha256(encoded.encode("utf-8")).hexdigest()[:24]


def load_run_manifest(path: str | Path) -> RunManifest:
    """Laadt en valideert een run manifest."""
    manifest_path = Path(path)
    if manifest_path.is_dir():
        manifest_path = manifest_path / "manifest.json"
    if not manifest_path.exists():
        raise RunTrackingError("run_not_found", "Run manifest not found")
    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise RunTrackingError("run_invalid", "Run manifest is not valid JSON") from error
    if not isinstance(data, Mapping):
        raise RunTrackingError("run_invalid", "Run manifest must be a JSON object")
    return RunManifest.from_dict(data)


def build_environment_summary(*, device: str | None = None, precision: str | None = None) -> dict[str, Any]:
    """Build a bounded runtime environment summary without secrets."""
    try:
        import torch
    except ModuleNotFoundError:
        torch = None

    cuda_available = bool(torch is not None and torch.cuda.is_available())
    selected_device = device or ("cuda" if cuda_available else "cpu")
    summary: dict[str, Any] = {
        "arclm_version": __version__,
        "python_version": platform.python_version(),
        "pytorch_version": str(getattr(torch, "__version__", None)) if torch is not None else None,
        "platform": platform.system(),
        "device": selected_device,
        "precision": precision,
        "cuda_available": cuda_available,
        "cuda_runtime": torch.version.cuda if torch is not None else None,
        "cuda_device_count": torch.cuda.device_count() if cuda_available else 0,
    }
    if cuda_available:
        index = torch.cuda.current_device()
        props = torch.cuda.get_device_properties(index)
        summary["gpu"] = {
            "name": torch.cuda.get_device_name(index),
            "compute_capability": list(torch.cuda.get_device_capability(index)),
            "vram_bytes": int(props.total_memory),
        }
    return summary


def build_reproducibility_metadata(
    *,
    seed: int | None = None,
    dataset_fingerprint: str | None = None,
    tokenizer_fingerprint: str | None = None,
    model_config_fingerprint: str | None = None,
) -> dict[str, Any]:
    """Describe what is reproducible without copying RNG state."""
    try:
        import torch
    except ModuleNotFoundError:
        torch = None

    return {
        "seed": seed,
        "python_rng_tracked": True,
        "numpy_rng_tracked": _module_available("numpy"),
        "torch_cpu_rng_tracked": torch is not None,
        "torch_cuda_rng_tracked": bool(torch is not None and torch.cuda.is_available()),
        "deterministic_algorithms": bool(
            torch is not None and torch.are_deterministic_algorithms_enabled()
        ),
        "dataset_fingerprint": dataset_fingerprint,
        "tokenizer_fingerprint": tokenizer_fingerprint,
        "model_config_fingerprint": model_config_fingerprint,
        "checkpoint_format": "arclm-training-checkpoint",
        "checkpoint_version": 1,
        "run_manifest_version": RUN_VERSION,
    }


def set_reproducible_seed(seed: int, *, deterministic: bool = False) -> dict[str, Any]:
    """Set Python, NumPy, and PyTorch seeds where available.

    This improves repeatability for local CPU/GPU runs, but bit-identical
    results are still backend- and hardware-dependent.
    """

    seed = int(seed)
    random.seed(seed)
    numpy_seeded = False
    try:
        import numpy as np

        np.random.seed(seed)
        numpy_seeded = True
    except Exception:
        numpy_seeded = False
    torch_seeded = False
    cuda_seeded = False
    deterministic_enabled = False
    try:
        import torch

        torch.manual_seed(seed)
        torch_seeded = True
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)
            cuda_seeded = True
        if deterministic:
            torch.use_deterministic_algorithms(True, warn_only=True)
        deterministic_enabled = bool(torch.are_deterministic_algorithms_enabled())
    except ModuleNotFoundError:
        torch_seeded = False
    return {
        "seed": seed,
        "python_seeded": True,
        "numpy_seeded": numpy_seeded,
        "torch_cpu_seeded": torch_seeded,
        "torch_cuda_seeded": cuda_seeded,
        "deterministic_algorithms": deterministic_enabled,
        "determinism_limitations": (
            "Identical results are not guaranteed across different hardware, "
            "PyTorch builds, CUDA kernels, or optional backends."
        ),
    }


class ExperimentTracker:
    """Oude compatibiliteitswrapper bovenop lokale run tracking.

    Nieuwe code gebruikt `RunTracker`. Deze class blijft bestaan zodat oudere
    voorbeelden met `ExperimentTracker` niet breken.
    """

    def __init__(
        self,
        name: str,
        backend: str = "local",
        experiment_dir: str = "experiments",
        tags: Mapping[str, str] | None = None,
        **kwargs: Any,
    ) -> None:
        self.name = name
        self.backend = backend
        self.tags = dict(tags or {})
        if backend == "local":
            self._tracker = create_run(
                RunConfig(
                    name=name,
                    operation=RunOperation.TRAINING,
                    storage=RunStorageConfig(root_directory=experiment_dir),
                )
            )
            self.experiment_id = self._tracker.manifest.run_id
            self.exp_dir = self._tracker.run_dir
            self.config_file = self.exp_dir / "summaries" / "config.json"
            self.metrics_file = self._tracker.metrics_path
            self.artifacts_dir = self.exp_dir / "references"
        elif backend == "mlflow":
            mlflow = _import_optional_backend("mlflow", "MLflow")
            if "tracking_uri" in kwargs:
                mlflow.set_tracking_uri(kwargs["tracking_uri"])
            mlflow.set_experiment(name)
            self.mlflow_run = mlflow.start_run()
            for key, value in self.tags.items():
                mlflow.set_tag(key, value)
            self.experiment_id = self.mlflow_run.info.run_id
        elif backend == "wandb":
            wandb = _import_optional_backend("wandb", "Weights & Biases")
            wandb.init(
                project=kwargs.get("project", "arclm"),
                name=name,
                tags=list(self.tags.values()),
                config=kwargs.get("config", {}),
            )
            self.experiment_id = name
        else:
            raise ValueError(f"Unknown backend: {backend}")

    def log_config(self, config: Mapping[str, Any] | Any) -> None:
        """Logt configuratie via de oude API."""
        if self.backend == "local":
            snapshot = _safe_config_snapshot(config)
            _write_json_atomic(self.config_file, snapshot)
            self._tracker.update_manifest(config={"legacy": snapshot})
        elif self.backend == "mlflow":
            _import_optional_backend("mlflow", "MLflow").log_params(_flat_params(config))
        elif self.backend == "wandb":
            _import_optional_backend("wandb", "Weights & Biases").config.update(_safe_config_snapshot(config))

    def log_metrics(self, metrics: Mapping[str, Any], step: int | None = None) -> None:
        """Logt metrics via de oude API."""
        if self.backend == "local":
            self._tracker.record_metric(metrics=metrics, step=step)
        elif self.backend == "mlflow":
            _import_optional_backend("mlflow", "MLflow").log_metrics(_metric_values(metrics), step=step)
        elif self.backend == "wandb":
            payload = dict(_metric_values(metrics))
            if step is not None:
                payload["step"] = step
            _import_optional_backend("wandb", "Weights & Biases").log(payload)

    def log_artifact(self, filepath: str | Path) -> None:
        """Registreert een artifact zonder standaard te kopiëren."""
        path = Path(filepath)
        if not path.exists():
            warnings.warn(f"Artifact file not found: {path}")
            return
        if self.backend == "local":
            self._tracker.record_model_artifact(path)
        elif self.backend == "mlflow":
            _import_optional_backend("mlflow", "MLflow").log_artifact(str(path))
        elif self.backend == "wandb":
            _import_optional_backend("wandb", "Weights & Biases").save(str(path))

    def log_text(self, text: str, filename: str = "notes.txt") -> None:
        """Schrijft korte tekstnotities voor de oude API."""
        if self.backend == "local":
            safe_name = _safe_filename(filename)
            path = self.exp_dir / "summaries" / safe_name
            path.write_text(_bounded_string(text, 10_000), encoding="utf-8")
            self._tracker.record_event("text_logged", {"filename": safe_name})
        elif self.backend == "mlflow":
            temp = Path(_safe_filename(filename))
            temp.write_text(text, encoding="utf-8")
            try:
                _import_optional_backend("mlflow", "MLflow").log_artifact(str(temp))
            finally:
                temp.unlink(missing_ok=True)
        elif self.backend == "wandb":
            temp = Path(_safe_filename(filename))
            temp.write_text(text, encoding="utf-8")
            try:
                _import_optional_backend("wandb", "Weights & Biases").save(str(temp))
            finally:
                temp.unlink(missing_ok=True)

    def log_params(self, params: Mapping[str, Any]) -> None:
        """Oude alias voor config params."""
        self.log_config({"params": dict(params)})

    def get_metric_history(self, metric_name: str | None = None) -> list[dict[str, Any]]:
        """Leest lokale metric historie voor de oude API."""
        if self.backend != "local":
            raise NotImplementedError(
                f"Metric history not available for backend: {self.backend}"
            )
        warnings_found: list[str] = []
        records = _read_jsonl(self.metrics_file, warnings_found)
        if metric_name is None:
            return records
        return [
            record
            for record in records
            if metric_name in record.get("metrics", {}) or metric_name in record
        ]

    def end(self) -> str:
        """Sluit oude tracker af."""
        if self.backend == "local":
            if self._tracker.manifest.status == RunStatus.CREATED.value:
                self._tracker.start()
            if self._tracker.manifest.status == RunStatus.RUNNING.value:
                self._tracker.complete({"legacy_tracker": True})
            self._tracker.close()
            print(f"[OK] Experiment saved to: {self.exp_dir}")
        elif self.backend == "mlflow":
            _import_optional_backend("mlflow", "MLflow").end_run()
        elif self.backend == "wandb":
            _import_optional_backend("wandb", "Weights & Biases").finish()
        return self.experiment_id

    def get_experiment_dir(self) -> Path | None:
        """Geeft lokale experimentmap terug."""
        if self.backend == "local":
            return self.exp_dir
        return None


def create_experiment(name: str, backend: str = "local", **kwargs: Any) -> ExperimentTracker:
    """Compatibiliteitshelper voor oude voorbeelden."""
    return ExperimentTracker(name, backend=backend, **kwargs)


def list_experiments(experiment_dir: str = "experiments") -> list[str]:
    """Compatibiliteitshelper die lokale experimenten opsomt."""
    return [info.run_id for info in list_runs(experiment_dir)]


def _generate_run_id() -> str:
    return "run_" + uuid.uuid4().hex[:20]


def _utc_now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def _write_json_atomic(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            "w",
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
            encoding="utf-8",
        ) as temp_file:
            temp_path = Path(temp_file.name)
            json.dump(_json_safe(payload), temp_file, indent=2, sort_keys=True)
            temp_file.write("\n")
            temp_file.flush()
            os.fsync(temp_file.fileno())
        os.replace(temp_path, path)
    except Exception as error:
        raise RunTrackingError("run_write_failed", f"Could not write run file: {path.name}") from error
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink()


def _append_jsonl(path: Path, record: Mapping[str, Any], *, fsync: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(_json_safe(record), sort_keys=True) + "\n")
        handle.flush()
        if fsync:
            os.fsync(handle.fileno())


def _read_jsonl(path: Path, warnings_found: list[str]) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    records: list[dict[str, Any]] = []
    lines = path.read_text(encoding="utf-8").splitlines()
    for index, line in enumerate(lines):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError:
            if index == len(lines) - 1:
                warnings_found.append(f"Ignored truncated final line in {path.name}")
                break
            raise RunTrackingError("run_invalid", f"{path.name} contains invalid JSON")
        if not isinstance(value, dict):
            raise RunTrackingError("run_invalid", f"{path.name} records must be objects")
        records.append(value)
    return records


def _last_sequence(path: Path) -> int:
    warnings_found: list[str] = []
    records = _read_jsonl(path, warnings_found)
    if not records:
        return 0
    return int(records[-1].get("sequence", 0) or 0)


def _safe_config_snapshot(value: Any) -> dict[str, Any]:
    return _redact_paths(_to_plain_dict(value))


def _to_plain_dict(value: Any) -> dict[str, Any]:
    if value is None:
        return {}
    if hasattr(value, "to_dict"):
        return dict(value.to_dict())
    if is_dataclass(value):
        return asdict(value)
    if isinstance(value, Mapping):
        return dict(value)
    if hasattr(value, "__dict__"):
        return {
            key: item
            for key, item in vars(value).items()
            if not key.startswith("_")
        }
    raise RunTrackingError("run_config_invalid", "Value cannot be converted to metadata")


def _json_safe(value: Any) -> Any:
    if callable(value):
        raise RunTrackingError("run_invalid", "Run metadata cannot contain callables")
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, Mapping):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, bool)) or value is None:
        return value
    if isinstance(value, float):
        if not math.isfinite(value):
            raise RunTrackingError("run_metric_invalid", "Run metadata must be finite")
        return value
    if _is_torch_tensor(value):
        if value.numel() == 1:
            return _json_safe(value.detach().cpu().item())
        return {
            "tensor": True,
            "shape": list(value.shape),
            "dtype": str(value.dtype),
        }
    try:
        import numpy as np

        if isinstance(value, np.generic):
            return _json_safe(value.item())
    except Exception:
        pass
    if is_dataclass(value):
        return _json_safe(asdict(value))
    if isinstance(value, Path):
        return {"path": True, "name": value.name}
    return str(value)


def _metric_values(metrics: Mapping[str, Any]) -> dict[str, float | int]:
    if len(metrics) > MAX_METRICS_PER_EVENT:
        raise RunTrackingError("run_metric_invalid", "Too many metrics in one event")
    clean: dict[str, float | int] = {}
    for key, value in metrics.items():
        if not isinstance(key, str) or not key:
            raise RunTrackingError("run_metric_invalid", "Metric names must be strings")
        if _is_torch_tensor(value):
            if value.numel() != 1:
                raise RunTrackingError("run_metric_invalid", "Tensor metrics must be scalar")
            value = value.detach().cpu().item()
        try:
            import numpy as np

            if isinstance(value, np.generic):
                value = value.item()
        except Exception:
            pass
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise RunTrackingError("run_metric_invalid", "Metrics must be numeric")
        if not math.isfinite(float(value)):
            raise RunTrackingError("run_metric_invalid", "Metrics must be finite")
        clean[key] = int(value) if isinstance(value, int) else float(value)
    return clean


def _bounded_payload(payload: Mapping[str, Any]) -> dict[str, Any]:
    if len(payload) > MAX_EVENT_PAYLOAD_KEYS:
        raise RunTrackingError("run_event_invalid", "Event payload has too many fields")
    return _redact_paths(_json_safe(payload))


def _redact_paths(value: Any) -> Any:
    if isinstance(value, Mapping):
        redacted: dict[str, Any] = {}
        for key, item in value.items():
            lowered = str(key).lower()
            if any(token in lowered for token in ("path", "dir", "directory", "root", "file")):
                if isinstance(item, (str, Path)):
                    redacted[str(key)] = "<path omitted>"
                else:
                    redacted[str(key)] = _redact_paths(item)
            else:
                redacted[str(key)] = _redact_paths(item)
        return redacted
    if isinstance(value, list):
        return [_redact_paths(item) for item in value]
    return _json_safe(value)


def _safe_reference(path: str | Path, *, role: str) -> dict[str, Any]:
    target = Path(path)
    if any(part == ".." for part in target.parts):
        raise RunTrackingError("run_reference_missing", "Reference path is not safe")
    return {
        "reference_id": "ref_" + uuid.uuid4().hex[:16],
        "role": role,
        "path_name": target.name,
        "path_fingerprint": _fingerprint_text(str(target.resolve()) if target.exists() else str(target)),
        "exists_at_record": target.exists(),
        "is_directory": target.is_dir(),
        "recorded_at": _utc_now(),
    }


def _load_reference_list(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise RunTrackingError("run_invalid", "Reference file must contain a list")
    return [dict(item) for item in data]


def _reference_counts(run_dir: Path) -> dict[str, int]:
    return {
        "checkpoints": len(_load_reference_list(run_dir / "references" / "checkpoints.json")),
        "adapters": len(_load_reference_list(run_dir / "references" / "adapters.json")),
        "artifacts": len(_load_reference_list(run_dir / "references" / "artifacts.json")),
    }


def _validate_references(path: Path) -> None:
    if not path.exists():
        return
    for item in _load_reference_list(path):
        if not isinstance(item.get("path_name"), str):
            raise RunTrackingError("run_invalid", "Reference path_name is invalid")
        if "\\" in item["path_name"] or "/" in item["path_name"]:
            raise RunTrackingError("run_invalid", "Reference path_name must be a name only")


def _resolve_run_dir(path: str | Path) -> Path:
    target = Path(path)
    if target.name == "manifest.json":
        target = target.parent
    if not target.exists():
        raise RunTrackingError("run_not_found", "Run directory not found")
    if not target.is_dir():
        raise RunTrackingError("run_not_found", "Run path must be a directory")
    return target


def _reject_unsafe_root(root: Path) -> None:
    if str(root).strip() == "":
        raise RunTrackingError("run_config_invalid", "Run root must not be empty")
    if root.exists() and not root.is_dir():
        raise RunTrackingError("run_config_invalid", "Run root must be a directory")


def _has_symlink_escape(root: Path) -> bool:
    if not root.exists():
        return False
    root_resolved = root.resolve()
    for path in root.rglob("*"):
        if path.is_symlink():
            try:
                path.resolve().relative_to(root_resolved)
            except ValueError:
                return True
    return False


def _validate_run_name(name: str) -> None:
    if len(name) > MAX_RUN_NAME_LENGTH:
        raise RunTrackingError("run_config_invalid", "Run name is too long")
    if any(separator in name for separator in ("/", "\\")):
        raise RunTrackingError("run_config_invalid", "Run name must not contain path separators")


def _safe_filename(name: str) -> str:
    if not name or any(separator in name for separator in ("/", "\\")) or name in {".", ".."}:
        raise RunTrackingError("run_config_invalid", "filename is not safe")
    return name


def _bounded_string(value: str, limit: int) -> str:
    text = str(value)
    return text if len(text) <= limit else text[:limit] + "..."


def _coerce_status(value: RunStatus | str | None) -> RunStatus:
    try:
        return value if isinstance(value, RunStatus) else RunStatus(str(value))
    except Exception as error:
        raise RunTrackingError("run_invalid", "Unknown run status") from error


def _coerce_operation(value: RunOperation | str | None) -> RunOperation:
    try:
        return value if isinstance(value, RunOperation) else RunOperation(str(value))
    except Exception as error:
        raise RunTrackingError("run_config_invalid", "Unknown run operation") from error


def _coerce_training_method(value: TrainingMethod | str | None) -> TrainingMethod:
    try:
        return value if isinstance(value, TrainingMethod) else TrainingMethod(str(value))
    except Exception as error:
        raise RunTrackingError("run_config_invalid", "Unknown training method") from error


def _is_safe_id(value: str, prefix: str) -> bool:
    return value.startswith(prefix) and all(
        character.isalnum() or character == "_"
        for character in value
    )


def _count_parameters(model: Any, *, trainable_only: bool = False) -> int | None:
    if model is None or not hasattr(model, "parameters"):
        return None
    total = 0
    try:
        for parameter in model.parameters():
            if trainable_only and not parameter.requires_grad:
                continue
            total += int(parameter.numel())
    except Exception:
        return None
    return total


def _safe_tokenizer_vocab_size(tokenizer: Any) -> int | None:
    for attr in ("vocab_size",):
        value = getattr(tokenizer, attr, None)
        if isinstance(value, int):
            return value
    try:
        return int(len(tokenizer))
    except Exception:
        return None


def _fingerprint_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:24]


def _module_available(name: str) -> bool:
    try:
        __import__(name)
        return True
    except Exception:
        return False


def _is_torch_tensor(value: Any) -> bool:
    try:
        import torch
    except ModuleNotFoundError:
        return False
    return torch.is_tensor(value)


def _import_optional_backend(module_name: str, label: str):
    try:
        return __import__(module_name)
    except ImportError as error:
        raise ValueError(f"{label} not installed. Install it before using this backend.") from error


def _flat_params(value: Any) -> dict[str, Any]:
    values = _safe_config_snapshot(value)
    return {
        key: item
        for key, item in values.items()
        if isinstance(item, (str, int, float, bool)) or item is None
    }


__all__ = [
    "EVENT_VERSION",
    "RUN_FORMAT",
    "RUN_VERSION",
    "ExperimentTracker",
    "RunComparison",
    "RunConfig",
    "RunInfo",
    "RunManifest",
    "RunOperation",
    "RunStatus",
    "RunStorageConfig",
    "RunTracker",
    "RunTrackingCallback",
    "RunTrackingError",
    "TrainingMethod",
    "build_environment_summary",
    "build_reproducibility_metadata",
    "build_run_fingerprint",
    "compare_runs",
    "create_experiment",
    "create_run",
    "inspect_run",
    "list_experiments",
    "list_runs",
    "load_run",
    "load_run_manifest",
    "set_reproducible_seed",
    "validate_run",
]
