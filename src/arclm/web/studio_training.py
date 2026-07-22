"""Local native training jobs for ArcLM Studio.

The web request creates persistent run metadata and returns immediately. A
single in-process worker thread then calls the canonical ArcLM ``Trainer`` and
uses callbacks to persist metrics, events and checkpoint metadata. This is not a
generic job platform; it is a conservative local Studio runner for tiny native
ArcLM workflows.
"""

from __future__ import annotations

import gc
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping

import torch
from torch.utils.data import TensorDataset

from arclm.finetuning import FineTuningConfig, FineTuningMode, prepare_fine_tuning_dataset
from arclm.models import ArcLM
from arclm.training import BaseCallback, Trainer, TrainingConfig

from .workspace import StudioRunMetadata, StudioWorkspace, WorkspaceApiError


class TrainingCancelled(RuntimeError):
    """Raised by the callback when a cooperative cancellation is requested."""


class StudioTrainingCallback(BaseCallback):
    """Persists progress through the existing Trainer callback hooks."""

    def __init__(self, workspace: StudioWorkspace, run: StudioRunMetadata, cancel_event: threading.Event):
        self.workspace = workspace
        self.run = run
        self.cancel_event = cancel_event
        self.started = time.time()

    def on_train_start(self, trainer) -> None:
        self.run.status = "running"
        self.run.started_at = self.run.started_at or time.time()
        self.workspace.write_run(self.run)
        mode = self.run.training_mode if self.run.training_mode != "legacy_native_training" else "pretraining"
        self.workspace.append_event(
            self.run.project_id,
            self.run.id,
            _event("training_started", f"{_mode_label(mode, self.run.fine_tuning_method)} started."),
        )

    def on_step_end(self, trainer, state) -> None:
        if self.cancel_event.is_set():
            raise TrainingCancelled("Training cancellation was requested.")
        metric = {
            "timestamp": time.time(),
            "epoch": int(state.epoch),
            "step": int(state.global_step),
            "training_loss": float(state.last_loss) if state.last_loss is not None else None,
            "learning_rate": state.learning_rate,
            "elapsed_seconds": time.time() - self.started,
        }
        self.run.current_epoch = int(state.epoch)
        self.run.current_step = int(state.global_step)
        self.run.latest_metrics = {k: v for k, v in metric.items() if v is not None}
        self.workspace.append_metric(self.run.project_id, self.run.id, metric)
        self.workspace.write_run(self.run)

    def on_epoch_end(self, trainer, state) -> None:
        self.run.current_epoch = int(state.epoch)
        self.workspace.append_event(self.run.project_id, self.run.id, _event("epoch_completed", f"Epoch {state.epoch} completed."))
        self.workspace.write_run(self.run)

    def on_checkpoint_save(self, trainer, path) -> None:
        if path is None:
            return
        checkpoint_id = Path(path).name
        self.run.latest_checkpoint_id = checkpoint_id
        self.workspace.append_event(
            self.run.project_id,
            self.run.id,
            _event("checkpoint_saved", f"Checkpoint {checkpoint_id} saved.", {"checkpoint_id": checkpoint_id}),
        )
        self.workspace.write_run(self.run)

    def on_train_end(self, trainer) -> None:
        if self.run.status not in {"cancelled", "failed"}:
            self.workspace.append_event(self.run.project_id, self.run.id, _event("training_finished", "Trainer finished."))


@dataclass
class ActiveJob:
    """In-memory worker bookkeeping."""

    project_id: str
    run_id: str
    thread: threading.Thread
    cancel_event: threading.Event


class StudioTrainingCoordinator:
    """Runs at most one local native training job for a FastAPI app instance."""

    def __init__(self, workspace: StudioWorkspace, max_active_jobs: int = 1):
        self.workspace = workspace
        self.max_active_jobs = max_active_jobs
        self._lock = threading.Lock()
        self._active: dict[str, ActiveJob] = {}
        self.workspace.mark_stale_runs_interrupted()

    def create_run(self, project_id: str, payload: Mapping[str, Any]) -> StudioRunMetadata:
        """Validate, persist, and start one native training run in the background."""
        if str(payload.get("training_type") or "native_causal_lm") != "native_causal_lm":
            raise WorkspaceApiError("training_configuration_invalid", "training_type is not supported by ArcLM Studio.", status_code=400)
        training_mode = str(payload.get("training_mode") or "pretraining")
        if training_mode not in {"pretraining", "fine_tuning"}:
            raise WorkspaceApiError("training_mode_invalid", "training_mode must be pretraining or fine_tuning.", status_code=400)
        if training_mode == "fine_tuning":
            method = str(payload.get("fine_tuning_method") or "sft")
            if method not in {"full", "sft"}:
                raise WorkspaceApiError("fine_tuning_method_unsupported", "Only full and sft are currently supported by Studio training.", status_code=400)
            if not payload.get("model_id") and not payload.get("base_checkpoint_id"):
                raise WorkspaceApiError("fine_tuning_source_required", "Fine-tuning requires a base model or checkpoint.", status_code=400)
        self._validate_payload(project_id, payload)
        with self._lock:
            self._drop_finished_locked()
            if len(self._active) >= self.max_active_jobs:
                raise WorkspaceApiError("training_job_already_running", "Another local training job is already running.", status_code=409)
            run = self.workspace.create_run_metadata(project_id, payload)
            run.status = "starting"
            self.workspace.write_run(run)
            cancel_event = threading.Event()
            thread = threading.Thread(target=self._run_worker, args=(run, cancel_event), daemon=True)
            self._active[run.id] = ActiveJob(project_id=project_id, run_id=run.id, thread=thread, cancel_event=cancel_event)
            thread.start()
            return run

    def cancel(self, project_id: str, run_id: str) -> StudioRunMetadata:
        """Request cooperative cancellation at the next Trainer callback boundary."""
        run = self.workspace.get_run(project_id, run_id)
        with self._lock:
            active = self._active.get(run_id)
            if active is None:
                if run.status not in {"completed", "failed", "cancelled", "interrupted"}:
                    run.status = "interrupted"
                    run.error = {"code": "training_interrupted", "message": "No active worker exists for this run."}
                    self.workspace.write_run(run)
                return run
            run.status = "cancelling"
            run.updated_at = time.time()
            self.workspace.write_run(run)
            active.cancel_event.set()
            self.workspace.append_event(project_id, run_id, _event("cancellation_requested", "Cancellation requested; training will stop at a safe boundary."))
            return run

    def has_active_job(self) -> bool:
        """Return whether this app instance is currently running training."""
        with self._lock:
            self._drop_finished_locked()
            return bool(self._active)

    def _validate_payload(self, project_id: str, payload: Mapping[str, Any]) -> None:
        dataset = self.workspace.get_dataset(project_id, str(payload.get("dataset_id", "")))
        tokenizer = self.workspace.get_ready_tokenizer(project_id, str(payload.get("tokenizer_id", "")))
        model = self.workspace.get_model(project_id, str(payload.get("model_id", "")))
        if model.tokenizer_id != tokenizer.id:
            raise WorkspaceApiError(
                "training_tokenizer_model_mismatch",
                "The training tokenizer must match the selected model tokenizer.",
                status_code=400,
            )
        if int(model.configuration["vocab_size"]) != int(tokenizer.vocab_size):
            raise WorkspaceApiError("tokenizer_vocab_model_mismatch", "Tokenizer vocabulary does not match model vocabulary.", status_code=400)
        if dataset.record_count <= 0:
            raise WorkspaceApiError("training_dataset_invalid", "The selected dataset has no records.", status_code=400)
        device = str(payload.get("device") or "auto")
        if device not in {"auto", "cpu", "cuda"}:
            raise WorkspaceApiError("training_device_unavailable", "device must be one of: auto, cpu, cuda.", status_code=400)
        if device == "cuda" and not torch.cuda.is_available():
            raise WorkspaceApiError("training_device_unavailable", "CUDA was requested but is not available.", status_code=400)
        try:
            TrainingConfig(
                epochs=int(payload.get("epochs", 1)),
                batch_size=int(payload.get("batch_size", 1)),
                learning_rate=float(payload.get("learning_rate", 1e-3)),
                weight_decay=float(payload.get("weight_decay", 0.0)),
                gradient_accumulation_steps=int(payload.get("gradient_accumulation_steps", 1)),
                max_grad_norm=payload.get("gradient_clip_norm", 1.0),
                optimizer=str(payload.get("optimizer", "adamw")),
                scheduler=str(payload.get("scheduler", "constant")),
                warmup_steps=int(payload.get("warmup_steps", 0)),
                precision=str(payload.get("precision", "fp32")),
            )
        except Exception as exc:
            raise WorkspaceApiError("training_configuration_invalid", str(exc), status_code=400) from exc

    def _run_worker(self, run: StudioRunMetadata, cancel_event: threading.Event) -> None:
        model = None
        try:
            payload = dict(run.configuration)
            dataset_meta = self.workspace.get_dataset(run.project_id, run.dataset_id)
            tokenizer_meta = self.workspace.get_ready_tokenizer(run.project_id, run.tokenizer_id)
            model_meta = self.workspace.get_model(run.project_id, run.model_id)
            records = self.workspace._load_dataset_records(dataset_meta)
            tokenizer = self.workspace._load_tokenizer(run.project_id, tokenizer_meta)
            max_length = int(payload.get("maximum_sequence_length") or model_meta.configuration["block_size"])
            if run.training_mode == "fine_tuning":
                dataset = _fine_tuning_tensor_dataset(records, tokenizer, payload, max_length)
            else:
                dataset = _tensor_dataset(records, tokenizer, dataset_meta.text_fields, max_length)
            if len(dataset) == 0:
                raise WorkspaceApiError("training_dataset_invalid", "No records produced trainable token windows.", status_code=400)

            resolved_device = _resolve_device(str(payload.get("device") or "auto"))
            run.device = resolved_device
            run.status = "running"
            run.started_at = time.time()
            run.total_steps = max(1, (len(dataset) + int(payload.get("batch_size", 1)) - 1) // int(payload.get("batch_size", 1))) * int(payload.get("epochs", 1))
            self.workspace.write_run(run)

            output_dir = self.workspace._run_dir(run.project_id, run.id) / "checkpoints"
            config = TrainingConfig(
                epochs=int(payload.get("epochs", 1)),
                batch_size=int(payload.get("batch_size", 1)),
                learning_rate=float(payload.get("learning_rate", 1e-3)),
                weight_decay=float(payload.get("weight_decay", 0.0)),
                gradient_accumulation_steps=int(payload.get("gradient_accumulation_steps", 1)),
                max_grad_norm=payload.get("gradient_clip_norm", 1.0),
                output_dir=str(output_dir),
                save_every_steps=int(payload.get("checkpoint_interval", 1)),
                keep_last_checkpoints=int(payload.get("maximum_checkpoints_to_keep", 3)),
                optimizer=str(payload.get("optimizer", "adamw")),
                scheduler=str(payload.get("scheduler", "constant")),
                warmup_steps=int(payload.get("warmup_steps", 0)),
                precision=str(payload.get("precision", "fp32")),
                device=resolved_device,
                shuffle=False,
            )
            model = ArcLM(**model_meta.configuration)
            callback = StudioTrainingCallback(self.workspace, run, cancel_event)
            trainer = Trainer(model=model, config=config, train_dataset=dataset, callbacks=[callback])
            trainer.train()
            if cancel_event.is_set():
                raise TrainingCancelled("Training cancellation was requested.")
            checkpoint_path = trainer.save_checkpoint()
            if checkpoint_path is not None:
                callback.on_checkpoint_save(trainer, checkpoint_path)
            run.status = "completed"
            run.completed_at = time.time()
            run.current_epoch = int(trainer.current_epoch)
            run.current_step = int(trainer.global_step)
            run.latest_metrics = {"training_loss": float(trainer.state.last_loss or 0.0), "step": int(trainer.global_step)}
            self.workspace.append_event(run.project_id, run.id, _event("training_completed", "Training completed successfully."))
        except TrainingCancelled:
            run.status = "cancelled"
            run.completed_at = time.time()
            run.error = {"code": "training_cancelled", "message": "Training was cancelled at a safe callback boundary."}
            self.workspace.append_event(run.project_id, run.id, _event("training_cancelled", "Training cancelled."))
        except Exception as exc:
            run.status = "failed"
            run.completed_at = time.time()
            run.error = {"code": "training_failed", "message": _safe_message(exc)}
            self.workspace.append_event(run.project_id, run.id, _event("training_failed", "Training failed."))
        finally:
            self.workspace.write_run(run)
            with self._lock:
                self._active.pop(run.id, None)
            del model
            gc.collect()
            if run.device.startswith("cuda") and torch.cuda.is_available():
                torch.cuda.empty_cache()

    def _drop_finished_locked(self) -> None:
        for run_id, job in list(self._active.items()):
            if not job.thread.is_alive():
                self._active.pop(run_id, None)


def _tensor_dataset(records, tokenizer, fields, max_length: int) -> TensorDataset:
    xs = []
    ys = []
    max_length = max(2, int(max_length))
    for record in records:
        text = "\n".join(str(record.get(field, "")) for field in fields if record.get(field) is not None)
        ids = list(tokenizer.encode_text(text))
        if len(ids) < 2:
            ids = ids + [tokenizer.get_unknown_index()]
        ids = ids[:max_length]
        if len(ids) < 2:
            continue
        x = ids[:-1]
        y = ids[1:]
        pad = max_length - 1 - len(x)
        if pad > 0:
            x = x + [0] * pad
            y = y + [-100] * pad
        xs.append(x)
        ys.append(y)
    if not xs:
        return TensorDataset(torch.empty((0, max_length - 1), dtype=torch.long), torch.empty((0, max_length - 1), dtype=torch.long))
    return TensorDataset(torch.tensor(xs, dtype=torch.long), torch.tensor(ys, dtype=torch.long))


class _MaskedTensorDataset(torch.utils.data.Dataset):
    """Adapts prepared SFT features to the existing Trainer ``x/y/mask`` batches."""

    def __init__(self, xs: list[list[int]], ys: list[list[int]], masks: list[list[float]]):
        self.x = torch.tensor(xs, dtype=torch.long)
        self.y = torch.tensor(ys, dtype=torch.long)
        self.mask = torch.tensor(masks, dtype=torch.float32)

    def __len__(self) -> int:
        return int(self.x.shape[0])

    def __getitem__(self, index: int) -> dict[str, torch.Tensor]:
        return {"x": self.x[index], "y": self.y[index], "mask": self.mask[index]}


def _fine_tuning_tensor_dataset(records, tokenizer, payload: Mapping[str, Any], max_length: int):
    formatting = dict(payload.get("fine_tuning_format") or {})
    method = str(payload.get("fine_tuning_method") or "sft")
    dataset_format = str(formatting.get("dataset_format") or "instruction_response")
    config = FineTuningConfig(
        mode=FineTuningMode.SFT if method == "sft" else FineTuningMode.CAUSAL_LM,
        formatter="plain_text" if dataset_format == "plain_text" else dataset_format,
        max_sequence_length=max(2, int(formatting.get("maximum_sequence_length") or max_length)),
        train_on_prompt=not bool(formatting.get("train_on_response_only", True)),
        append_eos_token=str(formatting.get("end_behavior") or "custom_end_tag") == "tokenizer_eos",
        text_field=str(formatting.get("text_field") or "text"),
        prompt_field=str(formatting.get("prompt_field") or "prompt"),
        completion_field=str(formatting.get("completion_field") or "completion"),
        instruction_field=str(formatting.get("instruction_field") or "instruction"),
        input_field=str(formatting.get("context_field") or "input"),
        response_field=str(formatting.get("response_field") or "response"),
        skip_invalid_records=False,
    )
    prepared = prepare_fine_tuning_dataset(records, tokenizer, config)
    target_length = max(2, config.max_sequence_length) - 1
    xs: list[list[int]] = []
    ys: list[list[int]] = []
    masks: list[list[float]] = []
    for feature in prepared.features:
        input_ids = [int(item) for item in feature["input_ids"]]
        labels = [int(item) for item in feature["labels"]]
        if len(input_ids) < 2:
            continue
        x = input_ids[:-1][:target_length]
        y = labels[1:][:target_length]
        mask = [0.0 if label == config.ignore_index else 1.0 for label in y]
        pad = target_length - len(x)
        if pad > 0:
            x.extend([0] * pad)
            y.extend([config.ignore_index] * pad)
            mask.extend([0.0] * pad)
        xs.append(x)
        ys.append(y)
        masks.append(mask)
    return _MaskedTensorDataset(xs, ys, masks)


def _resolve_device(device: str) -> str:
    if device == "auto":
        return "cuda" if torch.cuda.is_available() else "cpu"
    return device


def _event(code: str, message: str, details: Mapping[str, Any] | None = None) -> dict[str, Any]:
    return {"timestamp": time.time(), "code": code, "message": message, "details": dict(details or {})}


def _mode_label(training_mode: str, fine_tuning_method: str | None = None) -> str:
    if training_mode == "fine_tuning":
        method = (fine_tuning_method or "sft").upper()
        return f"Fine-Tuning - {method}"
    return "Pre-Training"


def _safe_message(exc: Exception) -> str:
    if isinstance(exc, WorkspaceApiError):
        return exc.message
    return str(exc)[:500] or "Training failed."
