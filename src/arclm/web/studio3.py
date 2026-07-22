"""Studio 3 checkpoint, evaluation, generation and inspection workflows.

This module is a thin web coordinator. It discovers checkpoints inside Studio
run folders, reconstructs native ArcLM models from stored project metadata, and
then calls the canonical ArcLM Evaluator, Generator and inspect_text APIs.
"""

from __future__ import annotations

import csv
import gc
import io
import json
import os
import random
import re
import secrets
import shutil
import tempfile
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping, Sequence

import torch
import torch.nn.functional as F
from torch.utils.data import Subset

import arclm
from arclm.checkpoints import inspect_checkpoint
from arclm.checkpoints.training import load_trusted_checkpoint
from arclm.evaluation import Accuracy, EvaluationConfig, Evaluator, LossMetric, Perplexity, build_evaluation_report
from arclm.exceptions import CheckpointError
from arclm.inference import Generator
from arclm.models import ArcLM

from .studio_training import _tensor_dataset
from .workspace import StudioWorkspace, WorkspaceApiError

CHECKPOINT_ID_RE = re.compile(r"^ckpt_([a-z0-9]{12})_([0-9]+)$")
EVALUATION_ID_RE = re.compile(r"^evaluation_[a-z0-9]{12}$")
GENERATION_ID_RE = re.compile(r"^generation_[a-z0-9]{12}$")
TERMINAL_STATUSES = {"completed", "failed", "cancelled", "interrupted"}
ACTIVE_STATUSES = {"queued", "starting", "running", "cancelling"}
SUPPORTED_METRICS = {"loss", "perplexity", "accuracy"}


@dataclass
class ActiveEvaluation:
    project_id: str
    evaluation_id: str
    thread: threading.Thread
    cancel_event: threading.Event


class Studio3Coordinator:
    """Coordinates read-only native checkpoint use for the local web API."""

    def __init__(self, workspace: StudioWorkspace, *, training_coordinator: Any, compute_lock: threading.Lock):
        self.workspace = workspace
        self.training_coordinator = training_coordinator
        self.compute_lock = compute_lock
        self._lock = threading.Lock()
        self._active_evaluations: dict[str, ActiveEvaluation] = {}
        self.mark_stale_evaluations_interrupted()

    def list_checkpoints(self, project_id: str) -> list[dict[str, Any]]:
        """List project-wide checkpoint metadata without loading model weights."""
        self.workspace.get_project(project_id)
        items: list[dict[str, Any]] = []
        for run in self.workspace.list_runs(project_id):
            checkpoints_dir = self.workspace._run_dir(project_id, run.id) / "checkpoints"
            for path in sorted(checkpoints_dir.glob("checkpoint-*")):
                if not path.is_dir():
                    continue
                items.append(self._checkpoint_summary(project_id, run.id, path))
        return sorted(items, key=lambda item: float(item.get("created_at") or 0), reverse=True)

    def get_checkpoint(self, project_id: str, checkpoint_id: str) -> dict[str, Any]:
        """Return one safe project-wide checkpoint record."""
        run_id, checkpoint_name = _parse_checkpoint_id(checkpoint_id)
        path = self._checkpoint_path(project_id, run_id, checkpoint_name)
        return self._checkpoint_summary(project_id, run_id, path, include_details=True)

    def validate_checkpoint(self, project_id: str, checkpoint_id: str) -> dict[str, Any]:
        """Load metadata and state dict shape into a native ArcLM instance."""
        loaded = self._load_native_checkpoint(project_id, checkpoint_id, device="cpu")
        try:
            return {
                "valid": True,
                "checkpoint": self.get_checkpoint(project_id, checkpoint_id),
                "reload_status": "compatible",
                "warnings": loaded["warnings"],
            }
        finally:
            self._cleanup_loaded(loaded)

    def delete_checkpoint(self, project_id: str, checkpoint_id: str, *, confirm: bool, checkpoint_name: str | None) -> dict[str, Any]:
        """Delete exactly one checkpoint directory after ownership and confirmation checks."""
        checkpoint = self.get_checkpoint(project_id, checkpoint_id)
        if not confirm or checkpoint_name != checkpoint["name"]:
            raise WorkspaceApiError(
                "checkpoint_delete_confirmation_required",
                "Checkpoint deletion requires confirm=true and the exact checkpoint name.",
                status_code=400,
            )
        if self._resource_busy() or self._checkpoint_in_active_evaluation(checkpoint_id):
            raise WorkspaceApiError("checkpoint_in_use", "The checkpoint is currently in use.", status_code=409)
        run_id, name = _parse_checkpoint_id(checkpoint_id)
        path = self._checkpoint_path(project_id, run_id, name)
        if path.is_symlink():
            raise WorkspaceApiError("path_rejected", "Symlink checkpoints cannot be deleted through Studio.", status_code=400)
        self.workspace._ensure_inside(path)
        shutil.rmtree(path)
        return checkpoint

    def create_evaluation(self, project_id: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        """Persist an evaluation and start a bounded background worker."""
        config = self._validate_evaluation_payload(project_id, payload)
        with self._lock:
            self._drop_finished_evaluations_locked()
            if self._active_evaluations or self._resource_busy():
                raise WorkspaceApiError("compute_resource_busy", "Another local training or evaluation job is active.", status_code=409)
            evaluation = self._create_evaluation_record(project_id, config)
            cancel_event = threading.Event()
            thread = threading.Thread(target=self._evaluation_worker, args=(evaluation["id"], cancel_event), daemon=True)
            self._active_evaluations[evaluation["id"]] = ActiveEvaluation(project_id, evaluation["id"], thread, cancel_event)
            thread.start()
            return evaluation

    def list_evaluations(self, project_id: str) -> list[dict[str, Any]]:
        """List stored evaluation records for one project."""
        self.workspace.get_project(project_id)
        items = []
        for path in self._evaluations_dir(project_id).glob("evaluation_*/evaluation.json"):
            try:
                items.append(_read_json(path))
            except (OSError, ValueError):
                continue
        return sorted(items, key=lambda item: float(item.get("created_at") or 0), reverse=True)

    def get_evaluation(self, project_id: str, evaluation_id: str) -> dict[str, Any]:
        _validate_evaluation_id(evaluation_id)
        path = self._evaluation_dir(project_id, evaluation_id) / "evaluation.json"
        if not path.exists():
            raise WorkspaceApiError("evaluation_not_found", "The selected evaluation could not be found.", status_code=404)
        return _read_json(path)

    def get_evaluation_report(self, project_id: str, evaluation_id: str) -> dict[str, Any]:
        self.get_evaluation(project_id, evaluation_id)
        path = self._evaluation_dir(project_id, evaluation_id) / "report.json"
        if not path.exists():
            raise WorkspaceApiError("evaluation_report_not_found", "The evaluation report is not available yet.", status_code=404)
        return _read_json(path)

    def get_evaluation_events(self, project_id: str, evaluation_id: str, limit: int = 200) -> list[dict[str, Any]]:
        self.get_evaluation(project_id, evaluation_id)
        return _read_jsonl(self._evaluation_dir(project_id, evaluation_id) / "events.jsonl", limit)

    def cancel_evaluation(self, project_id: str, evaluation_id: str) -> dict[str, Any]:
        evaluation = self.get_evaluation(project_id, evaluation_id)
        with self._lock:
            active = self._active_evaluations.get(evaluation_id)
            if active is None:
                if evaluation["status"] not in TERMINAL_STATUSES:
                    evaluation["status"] = "interrupted"
                    evaluation["error"] = {"code": "evaluation_interrupted", "message": "No active worker exists for this evaluation."}
                    self._write_evaluation(project_id, evaluation)
                return evaluation
            evaluation["status"] = "cancelling"
            evaluation["updated_at"] = time.time()
            self._write_evaluation(project_id, evaluation)
            active.cancel_event.set()
            self._append_evaluation_event(project_id, evaluation_id, "cancellation_requested", "Cancellation requested.")
            return evaluation

    def compare_evaluations(self, project_id: str, evaluation_ids: Sequence[str]) -> dict[str, Any]:
        """Compare completed reports only when configuration identity matches."""
        if not evaluation_ids:
            raise WorkspaceApiError("evaluation_configuration_invalid", "At least one evaluation ID is required.", status_code=400)
        rows = []
        identities = []
        warnings = []
        for evaluation_id in evaluation_ids[:20]:
            evaluation = self.get_evaluation(project_id, evaluation_id)
            if evaluation["status"] != "completed":
                warnings.append(f"{evaluation_id} is not completed.")
                continue
            report = self.get_evaluation_report(project_id, evaluation_id)
            config = evaluation["configuration"]
            identities.append(_comparison_identity(config))
            metrics = report.get("metrics", {})
            rows.append({
                "evaluation_id": evaluation_id,
                "checkpoint_id": evaluation["checkpoint_id"],
                "loss": metrics.get("loss"),
                "perplexity": metrics.get("perplexity"),
                "accuracy": metrics.get("accuracy"),
                "examples": report.get("num_examples"),
                "tokens": report.get("num_tokens"),
            })
        compatible = len({json.dumps(identity, sort_keys=True) for identity in identities}) <= 1
        if not compatible:
            warnings.append("Selected evaluations use different datasets, tokenizers, splits, limits or metrics.")
        return {"compatible": compatible, "warnings": warnings, "rows": rows, "csv": _comparison_csv(rows)}

    def generate(self, project_id: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        """Run one bounded synchronous native generation and persist history."""
        config = self._validate_generation_payload(project_id, payload)
        if self._resource_busy() or self.compute_lock.locked():
            raise WorkspaceApiError("generation_resource_busy", "The selected compute resource is busy.", status_code=409)
        started = time.time()
        loaded = None
        with self.compute_lock:
            try:
                loaded = self._load_native_checkpoint(project_id, config["checkpoint_id"], device=config["device"])
                _set_seed(config.get("seed"))
                tokenizer = loaded["tokenizer"]
                model = loaded["model"]
                generator = Generator(
                    model,
                    tokenizer.stoi,
                    tokenizer.itos,
                    int(loaded["model_config"]["block_size"]),
                    loaded["device"],
                    tokenizer=tokenizer,
                )
                generated_text = generator.generate_string(
                    config["prompt"],
                    max_new_tokens=config["max_new_tokens"],
                    temperature=config["temperature"],
                    top_k=config["top_k"],
                    top_p=config["top_p"],
                )
                elapsed = max(time.time() - started, 0.000001)
                input_tokens = tokenizer.encode_text(config["prompt"])
                output_tokens = tokenizer.encode_text(generated_text)
                record = {
                    "id": _new_id("generation"),
                    "project_id": project_id,
                    "checkpoint_id": config["checkpoint_id"],
                    "prompt": config["prompt"],
                    "generated_text": generated_text,
                    "input_token_count": len(input_tokens),
                    "generated_token_count": max(0, len(output_tokens) - len(input_tokens)),
                    "settings": {k: config[k] for k in ("max_new_tokens", "temperature", "top_k", "top_p")},
                    "seed": config.get("seed"),
                    "device": str(loaded["device"]),
                    "dtype": str(next(model.parameters()).dtype),
                    "elapsed_seconds": elapsed,
                    "tokens_per_second": max(0, len(output_tokens) - len(input_tokens)) / elapsed,
                    "created_at": time.time(),
                    "warnings": loaded["warnings"],
                    "status": "completed",
                }
                self._write_generation(project_id, record)
                return record
            except (ValueError, RuntimeError, CheckpointError) as exc:
                raise WorkspaceApiError("generation_failed", _safe_message(exc), status_code=400) from exc
            finally:
                if loaded is not None:
                    self._cleanup_loaded(loaded)

    def list_generations(self, project_id: str) -> list[dict[str, Any]]:
        self.workspace.get_project(project_id)
        items = []
        for path in self._generations_dir(project_id).glob("generation_*.json"):
            try:
                items.append(_read_json(path))
            except (OSError, ValueError):
                continue
        return sorted(items, key=lambda item: float(item.get("created_at") or 0), reverse=True)

    def get_generation(self, project_id: str, generation_id: str) -> dict[str, Any]:
        _validate_generation_id(generation_id)
        path = self._generations_dir(project_id) / f"{generation_id}.json"
        self.workspace._ensure_inside(path)
        if not path.exists():
            raise WorkspaceApiError("generation_not_found", "The selected generation could not be found.", status_code=404)
        return _read_json(path)

    def delete_generation(self, project_id: str, generation_id: str, *, confirm: bool) -> dict[str, Any]:
        record = self.get_generation(project_id, generation_id)
        if not confirm:
            raise WorkspaceApiError("request_invalid", "Generation deletion requires confirmation.", status_code=400)
        path = self._generations_dir(project_id) / f"{generation_id}.json"
        self.workspace._ensure_inside(path)
        path.unlink(missing_ok=True)
        return record

    def inspect_checkpoint(self, project_id: str, checkpoint_id: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        """Inspect one checkpoint by calling canonical arclm.inspect_text."""
        text = str(payload.get("text") or "")
        if not text.strip():
            raise WorkspaceApiError("inspection_text_empty", "text must contain at least one non-whitespace character.", status_code=400)
        if len(text) > 2_000:
            raise WorkspaceApiError("inspection_text_too_long", "text must be at most 2000 characters.", status_code=413)
        max_values = int(payload.get("max_values", 20))
        if max_values < 1 or max_values > 50:
            raise WorkspaceApiError("inspection_values_limit_invalid", "max_values must be between 1 and 50.", status_code=400)
        if self._resource_busy() or self.compute_lock.locked():
            raise WorkspaceApiError("compute_resource_busy", "The selected compute resource is busy.", status_code=409)
        loaded = None
        with self.compute_lock:
            try:
                loaded = self._load_native_checkpoint(project_id, checkpoint_id, device="cpu")
                trace = arclm.inspect_text(
                    model=loaded["model"],
                    tokenizer=loaded["tokenizer"],
                    text=text,
                    include_values=bool(payload.get("include_values", False)),
                    max_values=max_values,
                )
                return trace.to_dict()
            finally:
                if loaded is not None:
                    self._cleanup_loaded(loaded)

    def mark_stale_evaluations_interrupted(self) -> None:
        for project in self.workspace.list_projects():
            for evaluation in self.list_evaluations(project.id):
                if evaluation.get("status") in ACTIVE_STATUSES:
                    evaluation["status"] = "interrupted"
                    evaluation["completed_at"] = time.time()
                    evaluation["error"] = {
                        "code": "evaluation_interrupted",
                        "message": "This evaluation was interrupted when ArcLM Studio stopped.",
                    }
                    self._write_evaluation(project.id, evaluation)

    def has_active_evaluation(self) -> bool:
        """Return whether this app instance is currently evaluating."""
        with self._lock:
            self._drop_finished_evaluations_locked()
            return bool(self._active_evaluations)

    def _evaluation_worker(self, evaluation_id: str, cancel_event: threading.Event) -> None:
        evaluation: dict[str, Any] | None = None
        loaded = None
        try:
            project_id = self._active_evaluations[evaluation_id].project_id
            evaluation = self.get_evaluation(project_id, evaluation_id)
            evaluation["status"] = "starting"
            evaluation["started_at"] = time.time()
            self._write_evaluation(project_id, evaluation)
            self._append_evaluation_event(project_id, evaluation_id, "evaluation_started", "Evaluation started.")
            if cancel_event.is_set():
                raise RuntimeError("Evaluation cancellation was requested.")
            with self.compute_lock:
                loaded = self._load_native_checkpoint(project_id, evaluation["checkpoint_id"], device=evaluation["device"])
                dataset = self._evaluation_dataset(project_id, evaluation["configuration"], loaded)
                metrics = _metrics(evaluation["configuration"].get("selected_metrics") or ["loss", "perplexity", "accuracy"])
                evaluator = Evaluator(
                    loaded["model"],
                    dataset=dataset,
                    metrics=metrics,
                    config=EvaluationConfig(batch_size=int(evaluation["configuration"]["batch_size"]), device=str(loaded["device"])),
                    loss_fn=_causal_loss,
                )
                evaluation["status"] = "running"
                evaluation["updated_at"] = time.time()
                self._write_evaluation(project_id, evaluation)
                result = evaluator.evaluate()
                num_tokens = _count_dataset_tokens(dataset)
                report = build_evaluation_report(
                    result,
                    model=loaded["model"],
                    checkpoint_identity=evaluation["checkpoint_id"],
                    dataset_identity=evaluation["dataset_id"],
                    num_tokens=num_tokens,
                    warnings=loaded["warnings"],
                ).to_dict()
                _atomic_json(self._evaluation_dir(project_id, evaluation_id) / "report.json", report)
                evaluation["status"] = "completed"
                evaluation["completed_at"] = time.time()
                evaluation["metrics"] = report["metrics"]
                evaluation["example_count"] = report["num_examples"]
                evaluation["token_count"] = report["num_tokens"]
                evaluation["warnings"] = list(report.get("warnings") or [])
                self._append_evaluation_event(project_id, evaluation_id, "evaluation_completed", "Evaluation completed.")
        except Exception as exc:
            if evaluation is not None:
                evaluation["status"] = "cancelled" if cancel_event.is_set() else "failed"
                evaluation["completed_at"] = time.time()
                evaluation["error"] = {
                    "code": "evaluation_cancelled" if cancel_event.is_set() else "evaluation_failed",
                    "message": _safe_message(exc),
                }
                self._append_evaluation_event(evaluation["project_id"], evaluation_id, evaluation["error"]["code"], evaluation["error"]["message"])
        finally:
            if evaluation is not None:
                evaluation["updated_at"] = time.time()
                self._write_evaluation(evaluation["project_id"], evaluation)
            with self._lock:
                self._active_evaluations.pop(evaluation_id, None)
            if loaded is not None:
                self._cleanup_loaded(loaded)

    def _load_native_checkpoint(self, project_id: str, checkpoint_id: str, *, device: str) -> dict[str, Any]:
        checkpoint = self.get_checkpoint(project_id, checkpoint_id)
        if checkpoint["reload_status"] != "compatible":
            raise WorkspaceApiError("checkpoint_incompatible", "The checkpoint is not compatible with native ArcLM loading.", status_code=409)
        resolved_device = _resolve_device(device)
        run = self.workspace.get_run(project_id, checkpoint["run_id"])
        model_meta = self.workspace.get_model(project_id, checkpoint["model_id"])
        tokenizer_meta = self.workspace.get_ready_tokenizer(project_id, checkpoint["tokenizer_id"])
        if int(model_meta.configuration["vocab_size"]) != int(tokenizer_meta.vocab_size):
            raise WorkspaceApiError("evaluation_tokenizer_mismatch", "Checkpoint tokenizer vocabulary does not match the model.", status_code=400)
        payload = load_trusted_checkpoint(self._checkpoint_path(project_id, run.id, checkpoint["name"]), map_location=resolved_device)
        model = ArcLM(**model_meta.configuration)
        model.load_state_dict(payload["model_state_dict"])
        model.to(resolved_device)
        model.eval()
        tokenizer = self.workspace._load_tokenizer(project_id, tokenizer_meta)
        return {
            "checkpoint": checkpoint,
            "model": model,
            "tokenizer": tokenizer,
            "model_config": model_meta.configuration,
            "device": resolved_device,
            "warnings": list(checkpoint.get("warnings") or []),
        }

    def _checkpoint_summary(self, project_id: str, run_id: str, path: Path, *, include_details: bool = False) -> dict[str, Any]:
        checkpoint_file = path / "training.pt"
        base = {
            "id": _checkpoint_id(run_id, path.name),
            "project_id": project_id,
            "run_id": run_id,
            "name": path.name,
            "created_at": path.stat().st_mtime if path.exists() else None,
            "size_bytes": checkpoint_file.stat().st_size if checkpoint_file.exists() else 0,
            "reload_status": "not_tested",
            "warnings": [],
        }
        try:
            run = self.workspace.get_run(project_id, run_id)
            info = inspect_checkpoint(path)
            model = self.workspace.get_model(project_id, run.model_id)
            tokenizer = self.workspace.get_tokenizer(project_id, run.tokenizer_id)
            dataset = self.workspace.get_dataset(project_id, run.dataset_id)
            base.update({
                "epoch": info.epoch,
                "step": info.global_step,
                "metrics": run.latest_metrics,
                "model_source": "native_arclm",
                "model_task": "causal_language_modeling",
                "architecture": "ArcLM",
                "model_id": model.id,
                "dataset_id": dataset.id,
                "tokenizer_id": tokenizer.id,
                "training_mode": getattr(run, "training_mode", "legacy_native_training"),
                "fine_tuning_method": getattr(run, "fine_tuning_method", None),
                "base_checkpoint_id": getattr(run, "base_checkpoint_id", None),
                "fine_tuning_format": run.configuration.get("fine_tuning_format"),
                "has_optimizer_state": info.has_optimizer_state,
                "has_scheduler_state": info.has_scheduler_state,
                "has_rng_state": info.has_rng_state,
                "reload_status": "compatible",
            })
            if include_details:
                base.update({
                    "model": model.to_dict(),
                    "tokenizer": tokenizer.to_dict(),
                    "dataset": dataset.to_dict(),
                    "training_configuration": run.configuration,
                    "checkpoint_info": info.to_dict(),
                    "related_evaluations": [
                        item for item in self.list_evaluations(project_id) if item.get("checkpoint_id") == base["id"]
                    ],
                    "related_generations": [
                        item for item in self.list_generations(project_id) if item.get("checkpoint_id") == base["id"]
                    ],
                })
        except CheckpointError:
            base["reload_status"] = "corrupted" if checkpoint_file.exists() else "metadata_incomplete"
            base["warnings"] = ["Checkpoint metadata or tensor payload could not be read."]
        except WorkspaceApiError:
            base["reload_status"] = "metadata_incomplete"
            base["warnings"] = ["Project metadata for this checkpoint is incomplete."]
        return base

    def _checkpoint_path(self, project_id: str, run_id: str, checkpoint_name: str) -> Path:
        if not re.fullmatch(r"checkpoint-[0-9]+", checkpoint_name):
            raise WorkspaceApiError("checkpoint_not_found", "The selected checkpoint could not be found.", status_code=404)
        path = self.workspace._run_dir(project_id, run_id) / "checkpoints" / checkpoint_name
        self.workspace._ensure_inside(path)
        if not path.exists():
            raise WorkspaceApiError("checkpoint_not_found", "The selected checkpoint could not be found.", status_code=404)
        return path

    def _validate_evaluation_payload(self, project_id: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        checkpoint = self.get_checkpoint(project_id, str(payload.get("checkpoint_id", "")))
        if checkpoint["reload_status"] != "compatible":
            raise WorkspaceApiError("checkpoint_incompatible", "Select a compatible checkpoint before evaluating.", status_code=409)
        dataset_id = str(payload.get("dataset_id") or checkpoint["dataset_id"])
        tokenizer_id = str(payload.get("tokenizer_id") or checkpoint["tokenizer_id"])
        self.workspace.get_dataset(project_id, dataset_id)
        tokenizer = self.workspace.get_ready_tokenizer(project_id, tokenizer_id)
        if tokenizer.id != checkpoint["tokenizer_id"]:
            raise WorkspaceApiError("evaluation_tokenizer_mismatch", "Evaluation tokenizer must match the checkpoint tokenizer.", status_code=400)
        batch_size = int(payload.get("batch_size", 1))
        maximum_sequence_length = int(payload.get("maximum_sequence_length") or 0)
        maximum_examples = int(payload.get("maximum_examples") or self.workspace.config.max_evaluation_examples)
        if batch_size <= 0:
            raise WorkspaceApiError("evaluation_configuration_invalid", "batch_size must be positive.", status_code=400)
        if maximum_examples <= 0 or maximum_examples > self.workspace.config.max_evaluation_examples:
            raise WorkspaceApiError("evaluation_configuration_invalid", "maximum_examples is outside the configured bounds.", status_code=400)
        if maximum_sequence_length <= 1 or maximum_sequence_length > int(checkpoint.get("model", {}).get("configuration", {}).get("block_size", 4096)):
            maximum_sequence_length = int(self.workspace.get_model(project_id, checkpoint["model_id"]).configuration["block_size"])
        metrics = [str(metric) for metric in payload.get("selected_metrics", ["loss", "perplexity", "accuracy"])]
        if any(metric not in SUPPORTED_METRICS for metric in metrics):
            raise WorkspaceApiError("evaluation_configuration_invalid", "selected_metrics contains an unsupported metric.", status_code=400)
        device = _validate_device(str(payload.get("device") or "auto"), "evaluation_configuration_invalid")
        precision = str(payload.get("precision") or "fp32")
        if precision != "fp32":
            raise WorkspaceApiError("evaluation_configuration_invalid", "Web Studio evaluation currently supports fp32 only.", status_code=400)
        return {
            "checkpoint_id": checkpoint["id"],
            "dataset_id": dataset_id,
            "tokenizer_id": tokenizer_id,
            "split": str(payload.get("split") or "all"),
            "batch_size": batch_size,
            "maximum_sequence_length": maximum_sequence_length,
            "maximum_examples": maximum_examples,
            "device": device,
            "precision": precision,
            "seed": int(payload.get("seed", 42)),
            "selected_metrics": metrics,
        }

    def _validate_generation_payload(self, project_id: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        checkpoint = self.get_checkpoint(project_id, str(payload.get("checkpoint_id", "")))
        if checkpoint["reload_status"] != "compatible":
            raise WorkspaceApiError("generation_checkpoint_incompatible", "Select a compatible native checkpoint before generating.", status_code=409)
        prompt = str(payload.get("prompt") or "")
        if not prompt.strip():
            raise WorkspaceApiError("generation_prompt_empty", "prompt must not be empty.", status_code=400)
        if len(prompt) > self.workspace.config.max_generation_prompt_chars:
            raise WorkspaceApiError("generation_configuration_invalid", "prompt exceeds the configured length limit.", status_code=413)
        max_new_tokens = int(payload.get("max_new_tokens", 32))
        if max_new_tokens < 0 or max_new_tokens > self.workspace.config.max_generation_new_tokens:
            raise WorkspaceApiError("generation_configuration_invalid", "max_new_tokens is outside the configured bounds.", status_code=400)
        temperature = float(payload.get("temperature", 1.0))
        top_k = payload.get("top_k")
        top_p = payload.get("top_p")
        top_k_value = None if top_k is None else int(top_k)
        top_p_value = None if top_p is None else float(top_p)
        if temperature <= 0:
            raise WorkspaceApiError("generation_configuration_invalid", "temperature must be greater than zero.", status_code=400)
        device = _validate_device(str(payload.get("device") or "auto"), "generation_configuration_invalid")
        precision = str(payload.get("precision") or "fp32")
        if precision != "fp32":
            raise WorkspaceApiError("generation_configuration_invalid", "Web Studio generation currently supports fp32 only.", status_code=400)
        tokenizer = self.workspace.get_ready_tokenizer(project_id, checkpoint["tokenizer_id"])
        prompt_tokens = self.workspace._load_tokenizer(project_id, tokenizer).encode_text(prompt)
        block_size = int(self.workspace.get_model(project_id, checkpoint["model_id"]).configuration["block_size"])
        if len(prompt_tokens) > block_size:
            raise WorkspaceApiError("generation_context_exceeded", "Prompt token count exceeds the checkpoint context window.", status_code=400)
        return {
            "checkpoint_id": checkpoint["id"],
            "prompt": prompt,
            "max_new_tokens": max_new_tokens,
            "temperature": temperature,
            "top_k": top_k_value,
            "top_p": top_p_value,
            "seed": payload.get("seed"),
            "device": device,
            "precision": precision,
            "include_token_details": bool(payload.get("include_token_details", False)),
        }

    def _evaluation_dataset(self, project_id: str, config: Mapping[str, Any], loaded: Mapping[str, Any]):
        dataset_meta = self.workspace.get_dataset(project_id, str(config["dataset_id"]))
        records = self.workspace._load_dataset_records(dataset_meta)
        maximum_examples = int(config["maximum_examples"])
        dataset = _tensor_dataset(records[:maximum_examples], loaded["tokenizer"], dataset_meta.text_fields, int(config["maximum_sequence_length"]))
        if len(dataset) == 0:
            raise WorkspaceApiError("evaluation_dataset_incompatible", "The selected dataset produced no evaluable token windows.", status_code=400)
        return Subset(dataset, range(min(len(dataset), maximum_examples)))

    def _create_evaluation_record(self, project_id: str, config: Mapping[str, Any]) -> dict[str, Any]:
        evaluation_id = _new_id("evaluation")
        now = time.time()
        evaluation = {
            "id": evaluation_id,
            "project_id": project_id,
            "checkpoint_id": config["checkpoint_id"],
            "dataset_id": config["dataset_id"],
            "tokenizer_id": config["tokenizer_id"],
            "status": "queued",
            "created_at": now,
            "updated_at": now,
            "started_at": None,
            "completed_at": None,
            "device": config["device"],
            "precision": config["precision"],
            "example_count": 0,
            "token_count": 0,
            "metrics": {},
            "warnings": [],
            "error": None,
            "configuration": dict(config),
        }
        path = self._evaluation_dir(project_id, evaluation_id, create=True)
        _atomic_json(path / "configuration.json", dict(config))
        self._write_evaluation(project_id, evaluation)
        self._append_evaluation_event(project_id, evaluation_id, "evaluation_queued", "Evaluation queued.")
        return evaluation

    def _resource_busy(self) -> bool:
        return bool(getattr(self.training_coordinator, "has_active_job", lambda: False)())

    def _checkpoint_in_active_evaluation(self, checkpoint_id: str) -> bool:
        for active in self._active_evaluations.values():
            try:
                evaluation = self.get_evaluation(active.project_id, active.evaluation_id)
            except WorkspaceApiError:
                continue
            if evaluation.get("checkpoint_id") == checkpoint_id:
                return True
        return False

    def _drop_finished_evaluations_locked(self) -> None:
        for evaluation_id, active in list(self._active_evaluations.items()):
            if not active.thread.is_alive():
                self._active_evaluations.pop(evaluation_id, None)

    def _write_evaluation(self, project_id: str, evaluation: Mapping[str, Any]) -> None:
        _atomic_json(self._evaluation_dir(project_id, str(evaluation["id"]), create=True) / "evaluation.json", dict(evaluation))

    def _append_evaluation_event(self, project_id: str, evaluation_id: str, code: str, message: str) -> None:
        _append_jsonl(self._evaluation_dir(project_id, evaluation_id, create=True) / "events.jsonl", {
            "timestamp": time.time(),
            "code": code,
            "message": message,
        })

    def _write_generation(self, project_id: str, record: Mapping[str, Any]) -> None:
        generations_dir = self._generations_dir(project_id)
        _atomic_json(generations_dir / f"{record['id']}.json", dict(record))
        items = sorted(generations_dir.glob("generation_*.json"), key=lambda path: path.stat().st_mtime, reverse=True)
        for stale in items[self.workspace.config.max_generation_history:]:
            stale.unlink(missing_ok=True)

    def _evaluations_dir(self, project_id: str) -> Path:
        path = self.workspace._project_dir(project_id) / "evaluations"
        path.mkdir(parents=True, exist_ok=True)
        self.workspace._ensure_inside(path)
        return path

    def _evaluation_dir(self, project_id: str, evaluation_id: str, create: bool = False) -> Path:
        _validate_evaluation_id(evaluation_id)
        path = self._evaluations_dir(project_id) / evaluation_id
        self.workspace._ensure_inside(path)
        if not path.exists():
            if create:
                path.mkdir(parents=True, exist_ok=True)
            else:
                raise WorkspaceApiError("evaluation_not_found", "The selected evaluation could not be found.", status_code=404)
        return path

    def _generations_dir(self, project_id: str) -> Path:
        path = self.workspace._project_dir(project_id) / "generations"
        path.mkdir(parents=True, exist_ok=True)
        self.workspace._ensure_inside(path)
        return path

    def _cleanup_loaded(self, loaded: Mapping[str, Any]) -> None:
        device = str(loaded.get("device") or "cpu")
        del loaded
        gc.collect()
        if device.startswith("cuda") and torch.cuda.is_available():
            torch.cuda.empty_cache()


def _checkpoint_id(run_id: str, checkpoint_name: str) -> str:
    step = checkpoint_name.split("-", 1)[1]
    return f"ckpt_{run_id.removeprefix('run_')}_{step}"


def _parse_checkpoint_id(checkpoint_id: str) -> tuple[str, str]:
    match = CHECKPOINT_ID_RE.fullmatch(checkpoint_id)
    if not match:
        raise WorkspaceApiError("checkpoint_not_found", "The selected checkpoint could not be found.", status_code=404)
    run_suffix, step = match.groups()
    return f"run_{run_suffix}", f"checkpoint-{step}"


def _new_id(prefix: str) -> str:
    return f"{prefix}_{secrets.token_hex(6)}"


def _validate_evaluation_id(evaluation_id: str) -> None:
    if not EVALUATION_ID_RE.fullmatch(evaluation_id):
        raise WorkspaceApiError("evaluation_not_found", "The selected evaluation could not be found.", status_code=404)


def _validate_generation_id(generation_id: str) -> None:
    if not GENERATION_ID_RE.fullmatch(generation_id):
        raise WorkspaceApiError("generation_not_found", "The selected generation could not be found.", status_code=404)


def _validate_device(device: str, code: str) -> str:
    if device not in {"auto", "cpu", "cuda"}:
        raise WorkspaceApiError(code, "device must be one of: auto, cpu, cuda.", status_code=400)
    if device == "cuda" and not torch.cuda.is_available():
        raise WorkspaceApiError(code, "CUDA was requested but is not available.", status_code=400)
    return device


def _resolve_device(device: str) -> str:
    if device == "auto":
        return "cuda" if torch.cuda.is_available() else "cpu"
    return device


def _metrics(names: Sequence[str]):
    selected = []
    for name in names:
        if name == "loss":
            selected.append(LossMetric())
        elif name == "perplexity":
            selected.append(Perplexity())
        elif name == "accuracy":
            selected.append(Accuracy())
    return selected


def _causal_loss(logits, targets, batch=None):
    return F.cross_entropy(logits.reshape(-1, logits.size(-1)), targets.reshape(-1), ignore_index=-100)


def _count_dataset_tokens(dataset) -> int:
    total = 0
    for _, labels in dataset:
        total += int((labels != -100).sum().item())
    return total


def _set_seed(seed: Any) -> None:
    if seed is None:
        return
    seed_value = int(seed)
    random.seed(seed_value)
    torch.manual_seed(seed_value)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed_value)


def _comparison_identity(config: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "dataset_id": config.get("dataset_id"),
        "tokenizer_id": config.get("tokenizer_id"),
        "split": config.get("split"),
        "maximum_sequence_length": config.get("maximum_sequence_length"),
        "maximum_examples": config.get("maximum_examples"),
        "selected_metrics": config.get("selected_metrics"),
    }


def _comparison_csv(rows: Sequence[Mapping[str, Any]]) -> str:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=["evaluation_id", "checkpoint_id", "loss", "perplexity", "accuracy", "examples", "tokens"])
    writer.writeheader()
    for row in rows:
        writer.writerow(dict(row))
    return buffer.getvalue()


def _atomic_json(path: Path, payload: Mapping[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as file:
            json.dump(dict(payload), file, indent=2, sort_keys=True)
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


def _append_jsonl(path: Path, payload: Mapping[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as file:
        file.write(json.dumps(dict(payload), sort_keys=True) + "\n")


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _read_jsonl(path: Path, limit: int) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    limit = min(max(int(limit), 1), 500)
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines()[-limit:]:
        if line.strip():
            rows.append(json.loads(line))
    return rows


def _safe_message(exc: Exception) -> str:
    if isinstance(exc, WorkspaceApiError):
        return exc.message
    return str(exc)[:500] or "Request failed."
