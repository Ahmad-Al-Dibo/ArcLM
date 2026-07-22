"""Training checkpoint helpers voor ArcLM."""

from __future__ import annotations

import os
import random
import tempfile
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Mapping

import torch

from .._version import __version__
from ..exceptions import CheckpointError


CHECKPOINT_FORMAT = "arclm-training-checkpoint"
CHECKPOINT_VERSION = 1
LEGACY_CHECKPOINT_FORMAT = "arclm-training-core"
TRAINING_STATE_VERSION = 1


@dataclass
class CheckpointInfo:
    """Beschrijft een training checkpoint zonder training te starten."""

    path: str
    format: str
    version: int | None
    legacy: bool
    epoch: int
    global_step: int
    optimizer_step: int
    precision: str | None = None
    device: str | None = None
    arclm_version: str | None = None
    pytorch_version: str | None = None
    created_at: float | None = None
    has_model_state: bool = False
    has_optimizer_state: bool = False
    has_scheduler_state: bool = False
    has_scaler_state: bool = False
    has_rng_state: bool = False
    has_lifecycle_metadata: bool = False
    training_state: dict[str, Any] = field(default_factory=dict)
    config_snapshot: dict[str, Any] = field(default_factory=dict)
    lifecycle_metadata: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Zet checkpoint-info om naar een gewone dict."""
        return _json_safe(asdict(self))


def checkpoint_file(path: str | Path) -> Path:
    """Geeft het echte checkpointbestand terug voor een map of bestand."""
    target = Path(path)
    if target.suffix:
        return target
    return target / "training.pt"


def load_trusted_checkpoint(path: str | Path, map_location: str | torch.device = "cpu") -> dict[str, Any]:
    """Laadt een vertrouwd PyTorch training checkpoint.

    PyTorch training checkpoints kunnen pickle-gebaseerde state bevatten.
    Gebruik deze helper daarom alleen voor checkpoints uit een vertrouwde bron.
    """
    checkpoint_path = checkpoint_file(path)
    if not checkpoint_path.exists():
        raise CheckpointError(f"Checkpoint not found: {checkpoint_path}")
    if not checkpoint_path.is_file():
        raise CheckpointError(f"Checkpoint path is not a file: {checkpoint_path}")
    if checkpoint_path.stat().st_size <= 0:
        raise CheckpointError(f"Checkpoint is empty: {checkpoint_path}")
    try:
        try:
            checkpoint = torch.load(
                checkpoint_path,
                map_location=map_location,
                weights_only=False,
            )
        except TypeError:
            checkpoint = torch.load(checkpoint_path, map_location=map_location)
    except Exception as error:
        raise CheckpointError(f"Could not load checkpoint: {checkpoint_path}") from error
    if not isinstance(checkpoint, dict):
        raise CheckpointError("Checkpoint must contain a dictionary payload")
    return checkpoint


def validate_checkpoint_payload(
    checkpoint: Mapping[str, Any],
    *,
    allow_legacy: bool = True,
) -> None:
    """Controleert de minimale checkpointvorm voordat state wordt hersteld."""
    if not isinstance(checkpoint, Mapping):
        raise CheckpointError("Checkpoint must contain a dictionary payload")

    checkpoint_format = checkpoint.get("checkpoint_format")
    checkpoint_version = checkpoint.get("checkpoint_version")
    if checkpoint_format is None and checkpoint_version is None:
        if allow_legacy:
            _validate_required_training_state(checkpoint)
            return
        raise CheckpointError("Checkpoint is missing checkpoint_format")

    if checkpoint_format != CHECKPOINT_FORMAT:
        raise CheckpointError(
            f"Unsupported checkpoint format: {checkpoint_format!r}"
        )
    if not isinstance(checkpoint_version, int) or checkpoint_version <= 0:
        raise CheckpointError("checkpoint_version must be a positive integer")
    if checkpoint_version > CHECKPOINT_VERSION:
        raise CheckpointError(
            f"Unsupported checkpoint version: {checkpoint_version}"
        )
    _validate_required_training_state(checkpoint)


def validate_checkpoint(path: str | Path) -> CheckpointInfo:
    """Valideert een checkpoint en geeft de veilige inspectie-info terug."""
    return inspect_checkpoint(path, validate=True)


def inspect_checkpoint(path: str | Path, *, validate: bool = False) -> CheckpointInfo:
    """Inspecteert een vertrouwd training checkpoint zonder objects te maken."""
    checkpoint_path = checkpoint_file(path)
    checkpoint = load_trusted_checkpoint(checkpoint_path, map_location="cpu")
    if validate:
        validate_checkpoint_payload(checkpoint)
    return info_from_payload(checkpoint, checkpoint_path)


def info_from_payload(checkpoint: Mapping[str, Any], path: str | Path = "") -> CheckpointInfo:
    """Maakt inspectie-info vanuit een al geladen checkpoint."""
    validate_checkpoint_payload(checkpoint)
    metadata = dict(checkpoint.get("checkpoint_metadata") or {})
    old_metadata = dict(checkpoint.get("metadata") or {})
    training_state = dict(checkpoint.get("training_state") or {})
    lifecycle = dict(checkpoint.get("lifecycle_metadata") or {})
    legacy = checkpoint.get("checkpoint_format") is None
    precision = (
        metadata.get("precision")
        or old_metadata.get("precision")
        or lifecycle.get("precision")
    )
    return CheckpointInfo(
        path=str(path),
        format=checkpoint.get("checkpoint_format") or old_metadata.get("format") or LEGACY_CHECKPOINT_FORMAT,
        version=checkpoint.get("checkpoint_version"),
        legacy=legacy,
        epoch=int(checkpoint.get("current_epoch", training_state.get("epoch", 0)) or 0),
        global_step=int(
            checkpoint.get("global_step", training_state.get("global_step", 0)) or 0
        ),
        optimizer_step=int(
            checkpoint.get(
                "optimizer_step",
                training_state.get("optimizer_step", 0),
            )
            or 0
        ),
        precision=str(precision) if precision is not None else None,
        device=metadata.get("device") or old_metadata.get("device") or lifecycle.get("device"),
        arclm_version=metadata.get("arclm_version") or old_metadata.get("arclm_version"),
        pytorch_version=metadata.get("pytorch_version") or old_metadata.get("pytorch_version"),
        created_at=metadata.get("created_at") or old_metadata.get("saved_at"),
        has_model_state="model_state_dict" in checkpoint or "model" in checkpoint,
        has_optimizer_state=checkpoint.get("optimizer_state_dict") is not None,
        has_scheduler_state=checkpoint.get("scheduler_state_dict") is not None,
        has_scaler_state=bool(checkpoint.get("scaler_state_dict")),
        has_rng_state=bool(checkpoint.get("rng_state")),
        has_lifecycle_metadata=bool(lifecycle),
        training_state=_json_safe(training_state),
        config_snapshot=_json_safe(dict(checkpoint.get("config") or {})),
        lifecycle_metadata=_json_safe(lifecycle),
        metadata=_json_safe({**old_metadata, **metadata}),
    )


def build_checkpoint_metadata(
    *,
    trainer: Any,
    config: Mapping[str, Any],
    training_state: Mapping[str, Any],
    lifecycle_metadata: Mapping[str, Any],
) -> dict[str, Any]:
    """Maakt JSON-vriendelijke metadata voor een training checkpoint."""
    optimizer_type = type(trainer.optimizer).__name__
    scheduler_type = type(trainer.scheduler).__name__ if trainer.scheduler is not None else None
    dataset = getattr(trainer, "train_dataset", None)
    dataloader = getattr(trainer, "train_dataloader", None)
    model = trainer._raw_model() if hasattr(trainer, "_raw_model") else trainer.model
    tokenizer_info = dict(lifecycle_metadata.get("tokenizer") or {})
    model_configuration = {
        **dict(config),
        "vocab_size": getattr(model, "vocab_size", config.get("vocab_size")),
        "embed_dim": getattr(model, "embed_dim", config.get("embed_dim")),
        "block_size": getattr(model, "block_size", config.get("block_size")),
        "num_blocks": getattr(model, "num_blocks", config.get("num_blocks")),
    }
    return _json_safe(
        {
            "checkpoint_format": CHECKPOINT_FORMAT,
            "checkpoint_version": CHECKPOINT_VERSION,
            "arclm_version": __version__,
            "pytorch_version": str(torch.__version__),
            "model_source": "native_arclm",
            "model_task": "causal_language_modeling",
            "architecture": type(model).__name__,
            "model_configuration": model_configuration,
            "tokenizer_information": tokenizer_info,
            "training_configuration": dict(config),
            "created_at": time.time(),
            "run_id": getattr(trainer, "run_id", None),
            "global_step": getattr(trainer, "global_step", 0),
            "optimizer_step": getattr(trainer, "optimizer_step", 0),
            "epoch": getattr(trainer, "current_epoch", 0),
            "current_batch": getattr(trainer, "current_batch", 0),
            "precision": getattr(trainer.config, "precision", "fp32"),
            "device": str(getattr(trainer, "device", "cpu")),
            "optimizer_type": optimizer_type,
            "scheduler_type": scheduler_type,
            "gradient_accumulation_steps": config.get("gradient_accumulation_steps"),
            "max_grad_norm": config.get("max_grad_norm", config.get("grad_clip")),
            "training_state_version": TRAINING_STATE_VERSION,
            "training_state": dict(training_state),
            "config_snapshot": dict(config),
            "dataset": {
                "dataset_type": type(dataset).__name__ if dataset is not None else None,
                "dataset_length": _safe_len(dataset),
                "dataloader_length": _safe_len(dataloader),
                "shuffle": config.get("shuffle"),
                "batch_size": config.get("batch_size"),
                "num_workers": config.get("num_workers"),
            },
            "lifecycle": dict(lifecycle_metadata),
        }
    )


def capture_rng_state(*, include_cuda: bool = False) -> dict[str, Any]:
    """Bewaart ondersteunde RNG state voor training-resume."""
    state: dict[str, Any] = {
        "python": random.getstate(),
        "torch_cpu": torch.get_rng_state(),
    }
    try:
        import numpy as np

        numpy_state = np.random.get_state()
        state["numpy"] = (
            str(numpy_state[0]),
            numpy_state[1].tolist(),
            int(numpy_state[2]),
            int(numpy_state[3]),
            float(numpy_state[4]),
        )
    except Exception:
        state["numpy"] = None

    if include_cuda and torch.cuda.is_available():
        state["torch_cuda"] = torch.cuda.get_rng_state_all()
    else:
        state["torch_cuda"] = []
    return state


def restore_rng_state(state: Mapping[str, Any] | None, *, restore_cuda: bool = False) -> None:
    """Herstelt ondersteunde RNG state wanneer die aanwezig is."""
    if not state:
        return
    if state.get("python") is not None:
        random.setstate(state["python"])
    if state.get("torch_cpu") is not None:
        torch.set_rng_state(state["torch_cpu"].cpu())
    if state.get("numpy") is not None:
        try:
            import numpy as np

            algorithm, keys, position, has_gauss, cached_gaussian = state["numpy"]
            np.random.set_state(
                (
                    algorithm,
                    np.asarray(keys, dtype="uint32"),
                    int(position),
                    int(has_gauss),
                    float(cached_gaussian),
                )
            )
        except Exception:
            pass
    cuda_state = state.get("torch_cuda")
    if restore_cuda and cuda_state and torch.cuda.is_available():
        torch.cuda.set_rng_state_all(_normalize_cuda_rng_state(cuda_state))


def atomic_save_checkpoint(payload: Mapping[str, Any], path: str | Path) -> Path:
    """Schrijft een checkpoint via een tijdelijk bestand en vervangt daarna pas."""
    checkpoint_path = checkpoint_file(path)
    checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=checkpoint_path.parent,
            prefix=f".{checkpoint_path.name}.",
            suffix=".tmp",
            delete=False,
        ) as temp_file:
            temp_path = Path(temp_file.name)
        torch.save(dict(payload), temp_path)
        validate_checkpoint_payload(
            load_trusted_checkpoint(temp_path, map_location="cpu")
        )
        os.replace(temp_path, checkpoint_path)
        return checkpoint_path
    except Exception as error:
        raise CheckpointError(f"Could not save checkpoint: {checkpoint_path}") from error
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink()


def safe_load_training_checkpoint(
    path: str | Path,
    *,
    map_location: str | torch.device = "cpu",
) -> dict[str, Any]:
    """Laadt en valideert een vertrouwd training checkpoint."""
    checkpoint = load_trusted_checkpoint(path, map_location=map_location)
    validate_checkpoint_payload(checkpoint)
    return checkpoint


def _validate_required_training_state(checkpoint: Mapping[str, Any]) -> None:
    """Controleert velden die nodig zijn om training te hervatten."""
    if "model_state_dict" not in checkpoint and "model" not in checkpoint:
        raise CheckpointError("Checkpoint is missing model_state_dict")
    if "optimizer_state_dict" not in checkpoint:
        raise CheckpointError("Checkpoint is missing optimizer_state_dict")
    training_state = checkpoint.get("training_state")
    if training_state is not None and not isinstance(training_state, Mapping):
        raise CheckpointError("training_state must be a dictionary")
    metadata = checkpoint.get("checkpoint_metadata")
    if metadata is not None and not isinstance(metadata, Mapping):
        raise CheckpointError("checkpoint_metadata must be a dictionary")


def _safe_len(value: Any) -> int | None:
    """Geeft lengte terug zonder generators of iterators leeg te trekken."""
    if value is None:
        return None
    try:
        return int(len(value))
    except Exception:
        return None


def _normalize_cuda_rng_state(state: Any) -> list[torch.Tensor]:
    """Zet CUDA RNG state terug naar CPU ByteTensors voor PyTorch."""
    normalized: list[torch.Tensor] = []
    for item in state:
        if not torch.is_tensor(item):
            raise CheckpointError("CUDA RNG state must contain tensors")
        if item.dtype != torch.uint8:
            raise CheckpointError("CUDA RNG state tensors must use torch.uint8")
        normalized.append(item.detach().cpu())
    return normalized


def _json_safe(value: Any) -> Any:
    """Maakt metadata JSON-vriendelijk zonder tensors te bewaren."""
    if isinstance(value, dict):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if torch.is_tensor(value):
        return {
            "tensor": True,
            "shape": list(value.shape),
            "dtype": str(value.dtype),
            "device": str(value.device),
        }
    return str(value)
