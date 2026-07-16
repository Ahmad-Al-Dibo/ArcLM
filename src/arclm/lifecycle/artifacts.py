"""Finale modelartifacts voor evaluatie en inference."""

from __future__ import annotations

import hashlib
import json
import math
import os
import platform
import shutil
import tempfile
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Mapping

import torch

from .._version import __version__
from ..configs import Config
from ..exceptions import ModelLoadError, OptionalDependencyError
from ..models import ArcLM, AutoModel, MiniGPT
from ..tokenizers import SentencePieceTokenizer, Tokenizer


ARTIFACT_FORMAT = "arclm-model-artifact"
ARTIFACT_VERSION = 1
MODEL_ARTIFACT_MANIFEST = "manifest.json"

MODEL_CONFIG_PATH = "model/config.json"
MODEL_WEIGHTS_PATH = "model/weights.pt"
TOKENIZER_CONFIG_PATH = "tokenizer/tokenizer.json"
TRAINING_SUMMARY_PATH = "metadata/training-summary.json"
EVALUATION_SUMMARY_PATH = "metadata/evaluation-summary.json"
HF_MODEL_DIR = "model/huggingface"

MODEL_SOURCE_TYPES_FOR_ARTIFACTS = {
    "native_checkpoint",
    "pytorch_module",
    "huggingface_folder",
}


class ArtifactError(ModelLoadError):
    """Fout voor een ongeldig of onbruikbaar modelartifact."""


@dataclass
class ArtifactFile:
    """Beschrijft een bestand in een modelartifact."""

    path: str
    size_bytes: int
    sha256: str
    role: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Zet de bestandsinfo om naar een JSON-vriendelijke dict."""
        return _json_safe(asdict(self))

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "ArtifactFile":
        """Leest bestandsinfo uit de manifest data."""
        return cls(
            path=str(values["path"]),
            size_bytes=int(values["size_bytes"]),
            sha256=str(values["sha256"]),
            role=str(values["role"]) if values.get("role") is not None else None,
        )


@dataclass
class ModelArtifactManifest:
    """Manifest voor een finale ArcLM modelartifact."""

    artifact_format: str
    artifact_version: int
    artifact_id: str
    created_at: str
    created_with: dict[str, Any]
    model: dict[str, Any]
    tokenizer: dict[str, Any] = field(default_factory=dict)
    training: dict[str, Any] = field(default_factory=dict)
    evaluation: dict[str, Any] = field(default_factory=dict)
    provenance: dict[str, Any] = field(default_factory=dict)
    files: list[ArtifactFile] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Zet het manifest om naar gewone JSON-data."""
        data = asdict(self)
        data["files"] = [item.to_dict() for item in self.files]
        return _json_safe(data)

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "ModelArtifactManifest":
        """Maakt een manifest vanuit JSON-data."""
        for key in ("artifact_format", "artifact_version", "artifact_id", "created_at"):
            if key not in values:
                raise ArtifactError(f"Artifact manifest is missing required field: {key}")
        if values.get("artifact_format") != ARTIFACT_FORMAT:
            raise ArtifactError("Artifact format is not supported")
        version = values.get("artifact_version")
        if not isinstance(version, int) or version <= 0:
            raise ArtifactError("Artifact version must be a positive integer")
        if version > ARTIFACT_VERSION:
            raise ArtifactError("Artifact version is newer than this ArcLM version supports")
        files = values.get("files", [])
        if not isinstance(files, list):
            raise ArtifactError("Artifact files must be a list")
        model = values.get("model")
        if not isinstance(model, Mapping):
            raise ArtifactError("Artifact manifest is missing model metadata")
        source_type = model.get("source_type")
        if source_type not in MODEL_SOURCE_TYPES_FOR_ARTIFACTS:
            raise ArtifactError("Artifact model source type is not supported")
        return cls(
            artifact_format=str(values["artifact_format"]),
            artifact_version=int(version),
            artifact_id=str(values["artifact_id"]),
            created_at=str(values["created_at"]),
            created_with=dict(values.get("created_with") or {}),
            model=dict(model),
            tokenizer=dict(values.get("tokenizer") or {}),
            training=dict(values.get("training") or {}),
            evaluation=dict(values.get("evaluation") or {}),
            provenance=dict(values.get("provenance") or {}),
            files=[ArtifactFile.from_dict(item) for item in files],
            metadata=dict(values.get("metadata") or {}),
        )


@dataclass
class LoadedModel:
    """Runtime bundel voor een geladen finale modelartifact."""

    model: torch.nn.Module
    tokenizer: Any | None
    config: dict[str, Any]
    manifest: ModelArtifactManifest
    artifact_path: Path
    device: torch.device
    precision: str
    source_type: str


@dataclass
class ModelArtifactInfo:
    """Korte inspectie-info zonder het model te bouwen."""

    artifact_id: str
    artifact_format: str
    artifact_version: int
    source_type: str
    architecture: str | None
    task: str | None
    tokenizer_present: bool
    file_count: int
    total_size_bytes: int
    training_summary_present: bool
    evaluation_summary_present: bool
    integrity_verified: bool | None
    arclm_version: str | None
    pytorch_version: str | None
    created_at: str
    model_config: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Zet inspectie-info om naar een JSON-vriendelijke dict."""
        return _json_safe(asdict(self))


def save_model_artifact(
    model: torch.nn.Module,
    path: str | Path,
    *,
    config: Mapping[str, Any] | Config | None = None,
    tokenizer: Any | None = None,
    source_type: str | None = None,
    training_summary: Mapping[str, Any] | None = None,
    evaluation_summary: Mapping[str, Any] | None = None,
    provenance: Mapping[str, Any] | None = None,
    overwrite: bool = False,
) -> ModelArtifactManifest:
    """Bewaart een finale modelartifact in een nieuwe map.

    Deze functie bewaart alleen inference- en evaluatiegegevens. Optimizer,
    scheduler, scaler en actieve training-state horen in checkpoints.
    """
    if not isinstance(model, torch.nn.Module):
        raise ArtifactError("model must be a torch.nn.Module")
    destination = Path(path)
    _validate_destination(destination, overwrite=overwrite)
    artifact_id = _make_artifact_id()
    parent = destination.parent if destination.parent != Path("") else Path(".")
    parent.mkdir(parents=True, exist_ok=True)
    staging = Path(
        tempfile.mkdtemp(
            prefix=f".{destination.name}.tmp-",
            dir=str(parent),
        )
    )
    try:
        resolved_source = source_type or _infer_artifact_source_type(model)
        if resolved_source not in MODEL_SOURCE_TYPES_FOR_ARTIFACTS:
            raise ArtifactError("Artifact model source type is not supported")
        if resolved_source == "native_checkpoint" and not isinstance(model, (ArcLM, MiniGPT)):
            raise ArtifactError("Native ArcLM artifacts require an ArcLM model")
        if resolved_source == "huggingface_folder":
            model_info = _save_huggingface_model(model, staging)
            config_data = _read_json(staging / model_info["config_file"])
        else:
            config_data = _model_config_dict(model, config)
            _write_json(staging / MODEL_CONFIG_PATH, config_data)
            _save_state_dict(model, staging / MODEL_WEIGHTS_PATH)
            model_info = {
                "source_type": resolved_source,
                "task": "causal_language_modeling",
                "architecture": _architecture_name(model, resolved_source),
                "config_file": MODEL_CONFIG_PATH,
                "weights_file": MODEL_WEIGHTS_PATH,
                "state_format": "torch_state_dict",
            }

        tokenizer_info = _save_tokenizer(tokenizer, staging)
        training_info = _write_optional_summary(
            staging,
            TRAINING_SUMMARY_PATH,
            training_summary,
            "training_summary",
        )
        evaluation_info = _write_optional_summary(
            staging,
            EVALUATION_SUMMARY_PATH,
            evaluation_summary,
            "evaluation_summary",
        )
        files = _inventory_files(staging)
        manifest = ModelArtifactManifest(
            artifact_format=ARTIFACT_FORMAT,
            artifact_version=ARTIFACT_VERSION,
            artifact_id=artifact_id,
            created_at=datetime.now(timezone.utc).isoformat(),
            created_with=_created_with(),
            model=model_info,
            tokenizer=tokenizer_info,
            training=training_info,
            evaluation=evaluation_info,
            provenance=_json_safe(dict(provenance or {})),
            files=files,
            metadata={
                "model_class": type(model).__name__,
                "config_schema": "arclm-config-v1",
            },
        )
        _write_json(staging / MODEL_ARTIFACT_MANIFEST, manifest.to_dict())
        validate_model_artifact(staging)
        _commit_staging_directory(staging, destination, overwrite=overwrite)
        staging = None
        return manifest
    except Exception as error:
        if isinstance(error, ArtifactError):
            raise
        raise ArtifactError(f"Artifact save failed: {error}") from error
    finally:
        if staging is not None and staging.exists():
            shutil.rmtree(staging, ignore_errors=True)


def inspect_model_artifact(
    path: str | Path,
    *,
    verify_integrity: bool = False,
) -> ModelArtifactInfo:
    """Inspecteert een finale modelartifact zonder het model te laden."""
    artifact_path = Path(path)
    manifest = _read_manifest(artifact_path)
    if verify_integrity:
        validate_model_artifact(artifact_path)
    total_size = sum(item.size_bytes for item in manifest.files)
    config = _read_json(artifact_path / manifest.model["config_file"])
    return ModelArtifactInfo(
        artifact_id=manifest.artifact_id,
        artifact_format=manifest.artifact_format,
        artifact_version=manifest.artifact_version,
        source_type=str(manifest.model.get("source_type")),
        architecture=manifest.model.get("architecture"),
        task=manifest.model.get("task"),
        tokenizer_present=bool(manifest.tokenizer.get("present")),
        file_count=len(manifest.files),
        total_size_bytes=total_size,
        training_summary_present=bool(manifest.training.get("summary_file")),
        evaluation_summary_present=bool(manifest.evaluation.get("summary_file")),
        integrity_verified=True if verify_integrity else None,
        arclm_version=manifest.created_with.get("arclm"),
        pytorch_version=manifest.created_with.get("pytorch"),
        created_at=manifest.created_at,
        model_config=config,
        metadata={"provenance": manifest.provenance},
    )


def validate_model_artifact(path: str | Path) -> ModelArtifactManifest:
    """Valideert manifest, paden en hashes zonder het model te bouwen."""
    artifact_path = Path(path)
    if not artifact_path.is_dir():
        raise ArtifactError("Artifact path must be a directory")
    manifest = _read_manifest(artifact_path)
    seen = set()
    for item in manifest.files:
        relative = _safe_relative_path(item.path)
        if item.path in seen:
            raise ArtifactError("Artifact manifest contains duplicate file entries")
        seen.add(item.path)
        file_path = artifact_path / relative
        _validate_payload_file(artifact_path, file_path)
        actual_size = file_path.stat().st_size
        if actual_size != item.size_bytes:
            raise ArtifactError(f"Artifact file size mismatch: {item.path}")
        actual_hash = _sha256(file_path)
        if actual_hash != item.sha256:
            raise ArtifactError(f"Artifact file hash mismatch: {item.path}")
    _require_manifest_file(manifest, manifest.model.get("config_file"), "model config")
    if manifest.model.get("source_type") != "huggingface_folder":
        _require_manifest_file(manifest, manifest.model.get("weights_file"), "model weights")
    if manifest.tokenizer.get("required") and not manifest.tokenizer.get("present"):
        raise ArtifactError("Artifact tokenizer is required but missing")
    return manifest


def load_model_artifact(
    path: str | Path,
    *,
    model_factory: Callable[[Mapping[str, Any]], torch.nn.Module] | None = None,
    model: torch.nn.Module | None = None,
    device: str | torch.device = "cpu",
    precision: str = "fp32",
    strict: bool = True,
    trust_remote_code: bool = False,
) -> LoadedModel:
    """Laadt een finale modelartifact voor evaluatie of inference."""
    artifact_path = Path(path)
    manifest = validate_model_artifact(artifact_path)
    resolved_device = _resolve_device(device)
    resolved_precision = _resolve_precision(precision, resolved_device)
    source_type = str(manifest.model.get("source_type"))
    config_data = _read_json(artifact_path / manifest.model["config_file"])

    if source_type == "native_checkpoint":
        runtime_model = _build_native_model(config_data)
    elif source_type == "pytorch_module":
        runtime_model = _build_pytorch_model(config_data, model_factory, model)
    elif source_type == "huggingface_folder":
        runtime_model = _load_huggingface_model(
            artifact_path / str(manifest.model["directory"]),
            resolved_device,
            resolved_precision,
            trust_remote_code=trust_remote_code,
        )
        runtime_tokenizer = _load_tokenizer_from_manifest(artifact_path, manifest)
        return LoadedModel(
            model=runtime_model,
            tokenizer=runtime_tokenizer,
            config=config_data,
            manifest=manifest,
            artifact_path=artifact_path,
            device=resolved_device,
            precision=resolved_precision,
            source_type=source_type,
        )
    else:
        raise ArtifactError("Artifact source type is not supported")

    state_dict = _load_state_dict(artifact_path / manifest.model["weights_file"])
    try:
        runtime_model.load_state_dict(state_dict, strict=strict)
    except RuntimeError as error:
        raise ArtifactError(f"Model reconstruction failed: {error}") from error
    runtime_model.to(device=resolved_device, dtype=_precision_dtype(resolved_precision))
    runtime_model.eval()
    runtime_tokenizer = _load_tokenizer_from_manifest(artifact_path, manifest)
    return LoadedModel(
        model=runtime_model,
        tokenizer=runtime_tokenizer,
        config=config_data,
        manifest=manifest,
        artifact_path=artifact_path,
        device=resolved_device,
        precision=resolved_precision,
        source_type=source_type,
    )


def _validate_destination(path: Path, *, overwrite: bool) -> None:
    """Controleert of de doelmap veilig gebruikt kan worden."""
    if path.exists() and not overwrite:
        raise ArtifactError("Artifact destination already exists")
    if path.exists() and not path.is_dir():
        raise ArtifactError("Artifact destination exists and is not a directory")


def _make_artifact_id() -> str:
    """Maakt een korte veilige artifact-id."""
    return f"model_{uuid.uuid4().hex[:16]}"


def _infer_artifact_source_type(model: torch.nn.Module) -> str:
    """Bepaalt het artifact-brontype zonder optionele imports."""
    if isinstance(model, (ArcLM, MiniGPT)):
        return "native_checkpoint"
    if hasattr(model, "save_pretrained") and hasattr(model, "config"):
        return "huggingface_folder"
    return "pytorch_module"


def _architecture_name(model: torch.nn.Module, source_type: str) -> str:
    """Geeft de ondersteunde architectuurnaam terug."""
    if source_type == "native_checkpoint":
        return "arclm"
    return type(model).__name__


def _model_config_dict(
    model: torch.nn.Module,
    config: Mapping[str, Any] | Config | None,
) -> dict[str, Any]:
    """Maakt JSON-config vanuit echte runtime waarden."""
    if config is not None:
        if hasattr(config, "to_dict"):
            values = dict(config.to_dict())
        else:
            values = dict(config)
    elif isinstance(model, (ArcLM, MiniGPT)):
        values = _infer_native_config(model)
    else:
        values = {}
    return _json_safe(values)


def _infer_native_config(model: torch.nn.Module) -> dict[str, Any]:
    """Leest de huidige ArcLM architectuur uit het model."""
    token_embedding = getattr(model, "token_embedding", None)
    position_embedding = getattr(model, "position_embedding", None)
    blocks = getattr(model, "blocks", [])
    dropout = getattr(model, "dropout", None)
    if token_embedding is None or position_embedding is None:
        raise ArtifactError("Native ArcLM model is missing expected embeddings")
    return {
        "vocab_size": int(token_embedding.num_embeddings),
        "embed_dim": int(token_embedding.embedding_dim),
        "block_size": int(position_embedding.num_embeddings),
        "num_blocks": len(blocks),
        "dropout": float(getattr(dropout, "p", 0.0)),
    }


def _save_state_dict(model: torch.nn.Module, path: Path) -> None:
    """Bewaart modelgewichten als portable CPU state dict."""
    path.parent.mkdir(parents=True, exist_ok=True)
    state_dict = {
        key: value.detach().cpu().clone()
        for key, value in model.state_dict().items()
        if torch.is_tensor(value)
    }
    torch.save(state_dict, path)


def _save_huggingface_model(model: torch.nn.Module, staging: Path) -> dict[str, Any]:
    """Bewaart een lokaal Hugging Face model zonder downloads."""
    target = staging / HF_MODEL_DIR
    target.mkdir(parents=True, exist_ok=True)
    try:
        model.save_pretrained(target)
    except Exception as error:
        raise ArtifactError(f"Hugging Face model save failed: {error}") from error
    config_file = Path(HF_MODEL_DIR) / "config.json"
    if not (staging / config_file).exists():
        raise ArtifactError("Hugging Face artifact is missing config.json")
    return {
        "source_type": "huggingface_folder",
        "task": "causal_language_modeling",
        "architecture": type(model).__name__,
        "directory": HF_MODEL_DIR,
        "config_file": str(config_file).replace("\\", "/"),
    }


def _save_tokenizer(tokenizer: Any | None, staging: Path) -> dict[str, Any]:
    """Bewaart tokenizerbestanden als de tokenizer aanwezig is."""
    if tokenizer is None:
        return {"present": False, "required": False}
    target_dir = staging / "tokenizer"
    target_dir.mkdir(parents=True, exist_ok=True)
    if hasattr(tokenizer, "save_pretrained"):
        tokenizer.save_pretrained(target_dir)
        vocab_size = getattr(tokenizer, "vocab_size", None)
        return {
            "present": True,
            "required": False,
            "source_type": "huggingface",
            "directory": "tokenizer",
            "vocab_size": vocab_size,
        }
    if isinstance(tokenizer, (Tokenizer, SentencePieceTokenizer)):
        data = tokenizer.to_json()
        _write_json(staging / TOKENIZER_CONFIG_PATH, data)
        return {
            "present": True,
            "required": False,
            "source_type": data.get("tokenizer_type", "native"),
            "directory": "tokenizer",
            "config_file": TOKENIZER_CONFIG_PATH,
            "vocab_size": data.get("vocab_size"),
        }
    raise ArtifactError("Tokenizer type is not supported for model artifacts")


def _write_optional_summary(
    staging: Path,
    relative_path: str,
    summary: Mapping[str, Any] | None,
    role: str,
) -> dict[str, Any]:
    """Bewaart een optionele JSON-samenvatting."""
    if summary is None:
        return {"present": False}
    data = _reject_non_finite(_json_safe(dict(summary)), role)
    _write_json(staging / relative_path, data)
    return {"present": True, "summary_file": relative_path}


def _inventory_files(root: Path) -> list[ArtifactFile]:
    """Maakt een hash-inventaris van artifactbestanden."""
    records: list[ArtifactFile] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if path.name == MODEL_ARTIFACT_MANIFEST:
            continue
        _validate_payload_file(root, path)
        relative = path.relative_to(root).as_posix()
        records.append(
            ArtifactFile(
                path=relative,
                size_bytes=path.stat().st_size,
                sha256=_sha256(path),
                role=_role_for_path(relative),
            )
        )
    return records


def _role_for_path(path: str) -> str | None:
    """Geeft een eenvoudige rol voor bekende artifactbestanden."""
    roles = {
        MODEL_CONFIG_PATH: "model_config",
        MODEL_WEIGHTS_PATH: "model_weights",
        TOKENIZER_CONFIG_PATH: "tokenizer_config",
        TRAINING_SUMMARY_PATH: "training_summary",
        EVALUATION_SUMMARY_PATH: "evaluation_summary",
    }
    if path.startswith(HF_MODEL_DIR):
        return "huggingface_model_file"
    return roles.get(path)


def _commit_staging_directory(staging: Path, destination: Path, *, overwrite: bool) -> None:
    """Verplaatst de staging-map naar de finale artifactlocatie."""
    if destination.exists() and not overwrite:
        raise ArtifactError("Artifact destination already exists")
    backup: Path | None = None
    try:
        if destination.exists():
            backup = destination.with_name(f".{destination.name}.backup-{uuid.uuid4().hex}")
            os.replace(destination, backup)
        os.replace(staging, destination)
        if backup is not None:
            shutil.rmtree(backup, ignore_errors=True)
    except Exception as error:
        if backup is not None and backup.exists() and not destination.exists():
            os.replace(backup, destination)
        raise ArtifactError(f"Artifact directory commit failed: {error}") from error


def _read_manifest(path: Path) -> ModelArtifactManifest:
    """Leest en valideert het manifest."""
    manifest_path = path / MODEL_ARTIFACT_MANIFEST
    if not manifest_path.is_file():
        raise ArtifactError("Artifact manifest is missing")
    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ArtifactError("Artifact manifest is not valid JSON") from error
    if not isinstance(data, dict):
        raise ArtifactError("Artifact manifest must contain a JSON object")
    return ModelArtifactManifest.from_dict(data)


def _require_manifest_file(
    manifest: ModelArtifactManifest,
    relative_path: Any,
    label: str,
) -> None:
    """Controleert dat een verplicht bestand in de inventaris staat."""
    if not relative_path:
        raise ArtifactError(f"Artifact is missing {label}")
    wanted = str(relative_path).replace("\\", "/")
    if not any(item.path == wanted for item in manifest.files):
        raise ArtifactError(f"Artifact inventory is missing {label}")


def _validate_payload_file(root: Path, path: Path) -> None:
    """Controleert dat een payloadbestand binnen de artifactmap blijft."""
    if not path.exists():
        raise ArtifactError("Artifact payload file is missing")
    if not path.is_file():
        raise ArtifactError("Artifact payload entry is not a file")
    if path.is_symlink():
        raise ArtifactError("Artifact payload files may not be symlinks")
    try:
        resolved_root = root.resolve()
        resolved_path = path.resolve()
        resolved_path.relative_to(resolved_root)
    except ValueError as error:
        raise ArtifactError("Artifact file escapes the artifact directory") from error


def _safe_relative_path(value: str) -> Path:
    """Controleert dat manifestpaden relatief en veilig zijn."""
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        raise ArtifactError("Artifact manifest contains an unsafe file path")
    return path


def _sha256(path: Path) -> str:
    """Berekent de SHA-256 hash van een bestand."""
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _write_json(path: Path, data: Mapping[str, Any]) -> None:
    """Schrijft JSON deterministisch weg."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(_json_safe(data), indent=2, sort_keys=True),
        encoding="utf-8",
    )


def _read_json(path: Path) -> dict[str, Any]:
    """Leest een JSON object uit een bestand."""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ArtifactError(f"Invalid artifact JSON file: {path.name}") from error
    if not isinstance(data, dict):
        raise ArtifactError("Artifact JSON file must contain an object")
    return data


def _created_with() -> dict[str, Any]:
    """Geeft veilige runtime-versies terug."""
    return {
        "arclm": __version__,
        "python": platform.python_version(),
        "pytorch": str(torch.__version__),
    }


def _build_native_model(config: Mapping[str, Any]) -> torch.nn.Module:
    """Bouwt een native ArcLM model vanuit config."""
    try:
        return AutoModel.from_config(Config(**dict(config)))
    except Exception as error:
        raise ArtifactError(f"Native model reconstruction failed: {error}") from error


def _build_pytorch_model(
    config: Mapping[str, Any],
    model_factory: Callable[[Mapping[str, Any]], torch.nn.Module] | None,
    model: torch.nn.Module | None,
) -> torch.nn.Module:
    """Bouwt een PyTorch model met een expliciete provider."""
    if model is not None:
        if not isinstance(model, torch.nn.Module):
            raise ArtifactError("model must be a torch.nn.Module")
        return model
    if model_factory is None:
        raise ArtifactError("A model_factory or model is required for PyTorch artifacts")
    try:
        built = model_factory(config)
    except TypeError:
        built = model_factory()
    if not isinstance(built, torch.nn.Module):
        raise ArtifactError("model_factory must return a torch.nn.Module")
    return built


def _load_state_dict(path: Path) -> dict[str, torch.Tensor]:
    """Laadt alleen een tensor-state-dict uit artifactgewichten."""
    try:
        payload = torch.load(path, map_location="cpu", weights_only=True)
    except TypeError:
        payload = torch.load(path, map_location="cpu")
    if not isinstance(payload, Mapping):
        raise ArtifactError("Artifact weights must contain a state dictionary")
    if not all(isinstance(key, str) and torch.is_tensor(value) for key, value in payload.items()):
        raise ArtifactError("Artifact weights must contain only tensor state values")
    return dict(payload)


def _load_tokenizer_from_manifest(
    artifact_path: Path,
    manifest: ModelArtifactManifest,
) -> Any | None:
    """Laadt een tokenizer als het artifact die bevat."""
    info = manifest.tokenizer
    if not info.get("present"):
        return None
    source_type = info.get("source_type")
    if source_type == "word":
        return Tokenizer.from_json(_read_json(artifact_path / info["config_file"]))
    if source_type == "sentencepiece":
        return SentencePieceTokenizer.from_json(_read_json(artifact_path / info["config_file"]))
    if source_type == "huggingface":
        try:
            from transformers import AutoTokenizer
        except ImportError as error:
            raise OptionalDependencyError(
                "Hugging Face tokenizer loading requires transformers. "
                "Install it with: pip install transformers"
            ) from error
        return AutoTokenizer.from_pretrained(
            artifact_path / str(info["directory"]),
            local_files_only=True,
            trust_remote_code=False,
        )
    raise ArtifactError("Artifact tokenizer source type is not supported")


def _load_huggingface_model(
    folder: Path,
    device: torch.device,
    precision: str,
    *,
    trust_remote_code: bool,
) -> torch.nn.Module:
    """Laadt een lokale Hugging Face map via optionele Transformers."""
    try:
        from transformers import AutoModelForCausalLM
    except ImportError as error:
        raise OptionalDependencyError(
            "Hugging Face artifact loading requires transformers. "
            "Install it with: pip install transformers"
        ) from error
    model = AutoModelForCausalLM.from_pretrained(
        folder,
        local_files_only=True,
        trust_remote_code=trust_remote_code,
        torch_dtype=_precision_dtype(precision),
    )
    model.to(device)
    model.eval()
    return model


def _resolve_device(device: str | torch.device) -> torch.device:
    """Lost het gewenste runtime-apparaat op."""
    text = str(device)
    if text == "auto":
        return torch.device("cuda" if torch.cuda.is_available() else "cpu")
    resolved = torch.device(text)
    if resolved.type == "cuda":
        if not torch.cuda.is_available():
            raise ArtifactError("CUDA was requested but is not available")
        if resolved.index is not None and resolved.index >= torch.cuda.device_count():
            raise ArtifactError("Requested CUDA device index is not available")
    return resolved


def _resolve_precision(precision: str, device: torch.device) -> str:
    """Controleert de gevraagde precision."""
    normalized = str(precision).lower()
    if normalized not in {"fp32", "fp16", "bf16"}:
        raise ArtifactError("precision must be one of: fp32, fp16, bf16")
    if normalized == "fp16" and device.type == "cpu":
        raise ArtifactError("FP16 loading on CPU is not supported")
    return normalized


def _precision_dtype(precision: str) -> torch.dtype:
    """Zet precision om naar torch dtype."""
    return {
        "fp32": torch.float32,
        "fp16": torch.float16,
        "bf16": torch.bfloat16,
    }[precision]


def _reject_non_finite(value: Any, label: str) -> Any:
    """Weigert NaN en Infinity in metadata."""
    if isinstance(value, float) and not math.isfinite(value):
        raise ArtifactError(f"{label} contains a non-finite number")
    if isinstance(value, dict):
        return {key: _reject_non_finite(item, label) for key, item in value.items()}
    if isinstance(value, list):
        return [_reject_non_finite(item, label) for item in value]
    return value


def _json_safe(value: Any) -> Any:
    """Maakt waarden veilig voor JSON zonder objecten te bewaren."""
    if callable(value):
        raise ArtifactError("Artifact metadata may not contain callables")
    if isinstance(value, Mapping):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)
