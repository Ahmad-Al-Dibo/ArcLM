"""Adapter-artifacts voor PEFT."""

from __future__ import annotations

import hashlib
import json
import os
import platform
import shutil
import tempfile
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping

import torch
from torch import nn

from .._version import __version__
from ..exceptions import FineTuningError
from .config import LoRAConfig, PeftMethod, QLoRAConfig
from .lora import (
    apply_lora,
    fingerprint_base_model,
    get_lora_state_dict,
    get_peft_parameter_report,
    load_lora_state_dict,
)


ADAPTER_ARTIFACT_FORMAT = "arclm-peft-adapter"
ADAPTER_ARTIFACT_VERSION = 1
ADAPTER_MANIFEST = "manifest.json"
ADAPTER_WEIGHTS_PATH = "adapter/adapter.pt"


@dataclass(frozen=True)
class AdapterArtifactFile:
    """Bestand in een adapterartifact."""

    path: str
    size_bytes: int
    sha256: str
    role: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Zet bestandsinfo om naar JSON-data."""
        return asdict(self)

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "AdapterArtifactFile":
        """Leest bestandsinfo uit manifestdata."""
        return cls(
            path=str(values["path"]),
            size_bytes=int(values["size_bytes"]),
            sha256=str(values["sha256"]),
            role=str(values["role"]) if values.get("role") is not None else None,
        )


@dataclass(frozen=True)
class PeftAdapterManifest:
    """Manifest voor een ArcLM PEFT adapter."""

    artifact_format: str
    artifact_version: int
    adapter_id: str
    created_at: str
    created_with: dict[str, Any]
    method: str
    config: dict[str, Any]
    base_model: dict[str, Any]
    adapted_modules: tuple[str, ...]
    parameter_report: dict[str, Any]
    files: list[AdapterArtifactFile] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke manifestdata terug."""
        data = asdict(self)
        data["adapted_modules"] = list(self.adapted_modules)
        data["files"] = [item.to_dict() for item in self.files]
        return _json_safe(data)

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "PeftAdapterManifest":
        """Valideert en maakt een manifest."""
        if values.get("artifact_format") != ADAPTER_ARTIFACT_FORMAT:
            raise FineTuningError("Adapter artifact format is not supported")
        version = values.get("artifact_version")
        if not isinstance(version, int) or version <= 0:
            raise FineTuningError("Adapter artifact version must be a positive integer")
        if version > ADAPTER_ARTIFACT_VERSION:
            raise FineTuningError("Adapter artifact version is newer than this ArcLM version supports")
        method = str(values.get("method", ""))
        if method not in {PeftMethod.LORA.value, PeftMethod.QLORA.value}:
            raise FineTuningError("Adapter artifact method is not supported")
        config = values.get("config")
        if not isinstance(config, Mapping):
            raise FineTuningError("Adapter artifact config is missing")
        base_model = values.get("base_model")
        if not isinstance(base_model, Mapping):
            raise FineTuningError("Adapter artifact base model metadata is missing")
        files = values.get("files", [])
        if not isinstance(files, list):
            raise FineTuningError("Adapter artifact files must be a list")
        return cls(
            artifact_format=str(values["artifact_format"]),
            artifact_version=int(version),
            adapter_id=str(values["adapter_id"]),
            created_at=str(values["created_at"]),
            created_with=dict(values.get("created_with") or {}),
            method=method,
            config=dict(config),
            base_model=dict(base_model),
            adapted_modules=tuple(str(item) for item in values.get("adapted_modules", [])),
            parameter_report=dict(values.get("parameter_report") or {}),
            files=[AdapterArtifactFile.from_dict(item) for item in files],
            metadata=dict(values.get("metadata") or {}),
        )


@dataclass(frozen=True)
class PeftAdapterInfo:
    """Inspectie-info zonder adaptergewichten te laden in een model."""

    adapter_id: str
    artifact_format: str
    artifact_version: int
    method: str
    target_modules: tuple[str, ...]
    adapted_modules: tuple[str, ...]
    base_model_fingerprint: str | None
    file_count: int
    total_size_bytes: int
    integrity_verified: bool | None
    created_at: str
    arclm_version: str | None
    pytorch_version: str | None
    quantization_backend: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Geeft inspectie-info als dict terug."""
        return asdict(self)


def save_adapter_artifact(
    model: nn.Module,
    path: str | Path,
    *,
    config: LoRAConfig | QLoRAConfig | Mapping[str, Any] | None = None,
    adapted_modules: tuple[str, ...] | None = None,
    overwrite: bool = False,
) -> PeftAdapterManifest:
    """Bewaart alleen LoRA adaptergewichten."""
    if not isinstance(model, nn.Module):
        raise FineTuningError("model must be a torch.nn.Module")
    adapter_config = _resolve_adapter_config(config)
    lora_config = adapter_config["lora_config"]
    state = get_lora_state_dict(model)
    destination = Path(path)
    _validate_destination(destination, overwrite=overwrite)
    parent = destination.parent if destination.parent != Path("") else Path(".")
    parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=f".{destination.name}.tmp-", dir=str(parent)))
    try:
        weights_path = staging / ADAPTER_WEIGHTS_PATH
        weights_path.parent.mkdir(parents=True, exist_ok=True)
        torch.save(state, weights_path)
        files = _inventory_files(staging)
        report = get_peft_parameter_report(model, include_names=True)
        manifest = PeftAdapterManifest(
            artifact_format=ADAPTER_ARTIFACT_FORMAT,
            artifact_version=ADAPTER_ARTIFACT_VERSION,
            adapter_id=f"adapter_{uuid.uuid4().hex[:16]}",
            created_at=datetime.now(timezone.utc).isoformat(),
            created_with=_created_with(),
            method=adapter_config["method"],
            config=adapter_config["config"],
            base_model={"fingerprint": fingerprint_base_model(model)},
            adapted_modules=adapted_modules or tuple(
                key.rsplit(".", 2)[0] for key in state if key.endswith("lora_a.weight")
            ),
            parameter_report=report.to_dict(),
            files=files,
            metadata={
                "state_format": "torch_state_dict",
                "quantization": adapter_config["quantization"],
            },
        )
        _write_json(staging / ADAPTER_MANIFEST, manifest.to_dict())
        validate_adapter_artifact(staging)
        _commit_staging_directory(staging, destination, overwrite=overwrite)
        staging = None
        return manifest
    finally:
        if staging is not None and staging.exists():
            shutil.rmtree(staging, ignore_errors=True)


def inspect_adapter_artifact(
    path: str | Path,
    *,
    verify_integrity: bool = False,
) -> PeftAdapterInfo:
    """Inspecteert adaptermetadata zonder een model te bouwen."""
    manifest = _read_manifest(Path(path))
    if verify_integrity:
        validate_adapter_artifact(path)
    lora_config = _manifest_lora_config(manifest)
    return PeftAdapterInfo(
        adapter_id=manifest.adapter_id,
        artifact_format=manifest.artifact_format,
        artifact_version=manifest.artifact_version,
        method=manifest.method,
        target_modules=tuple(lora_config.target_modules),
        adapted_modules=manifest.adapted_modules,
        base_model_fingerprint=manifest.base_model.get("fingerprint"),
        file_count=len(manifest.files),
        total_size_bytes=sum(item.size_bytes for item in manifest.files),
        integrity_verified=True if verify_integrity else None,
        created_at=manifest.created_at,
        arclm_version=manifest.created_with.get("arclm"),
        pytorch_version=manifest.created_with.get("pytorch"),
        quantization_backend=(manifest.metadata.get("quantization") or {}).get("backend"),
    )


def validate_adapter_artifact(path: str | Path) -> PeftAdapterManifest:
    """Valideert manifest, paden en hashes zonder adapter te laden."""
    artifact_path = Path(path)
    if not artifact_path.is_dir():
        raise FineTuningError("Adapter artifact path must be a directory")
    manifest = _read_manifest(artifact_path)
    seen = set()
    for item in manifest.files:
        relative = _safe_relative_path(item.path)
        if item.path in seen:
            raise FineTuningError("Adapter manifest contains duplicate file entries")
        seen.add(item.path)
        payload = artifact_path / relative
        _validate_payload_file(artifact_path, payload)
        if payload.stat().st_size != item.size_bytes:
            raise FineTuningError(f"Adapter artifact file size mismatch: {item.path}")
        if _sha256(payload) != item.sha256:
            raise FineTuningError(f"Adapter artifact file hash mismatch: {item.path}")
    if not any(item.path == ADAPTER_WEIGHTS_PATH for item in manifest.files):
        raise FineTuningError("Adapter artifact is missing adapter weights")
    return manifest


def load_adapter_artifact(
    model: nn.Module,
    path: str | Path,
    *,
    device: str | torch.device = "cpu",
    strict: bool = True,
) -> PeftAdapterManifest:
    """Past een LoRA adapterartifact toe op een schoon basismodel."""
    if not isinstance(model, nn.Module):
        raise FineTuningError("model must be a torch.nn.Module")
    manifest = validate_adapter_artifact(path)
    expected = manifest.base_model.get("fingerprint")
    actual = fingerprint_base_model(model)
    if expected and expected != actual:
        raise FineTuningError("Adapter artifact does not match the base model")
    config = _manifest_lora_config(manifest)
    apply_lora(model, config)
    state = _load_state_dict(Path(path) / ADAPTER_WEIGHTS_PATH)
    load_lora_state_dict(model, state, strict=strict)
    resolved_device = torch.device(device)
    if resolved_device.type == "cuda" and not torch.cuda.is_available():
        raise FineTuningError("CUDA was requested but is not available")
    model.to(resolved_device)
    return manifest


def _resolve_adapter_config(
    config: LoRAConfig | QLoRAConfig | Mapping[str, Any] | None,
) -> dict[str, Any]:
    """Haalt adapterconfig uit expliciete LoRA of QLoRA data."""
    if config is None:
        raise FineTuningError("LoRA config is required to save an adapter artifact")
    if isinstance(config, LoRAConfig):
        config.validate()
        return {
            "method": PeftMethod.LORA.value,
            "lora_config": config,
            "config": config.to_dict(),
            "quantization": {},
        }
    if isinstance(config, QLoRAConfig):
        config.validate()
        return {
            "method": PeftMethod.QLORA.value,
            "lora_config": config.lora,
            "config": config.to_dict(),
            "quantization": config.quantization.to_dict(),
        }
    values = dict(config)
    method = str(values.get("method", PeftMethod.LORA.value))
    if method == PeftMethod.QLORA.value:
        return _resolve_adapter_config(QLoRAConfig.from_dict(values))
    return _resolve_adapter_config(LoRAConfig.from_dict(values))


def _manifest_lora_config(manifest: PeftAdapterManifest) -> LoRAConfig:
    """Leest de LoRA-laagconfig uit LoRA of QLoRA manifesten."""
    if manifest.method == PeftMethod.QLORA.value:
        return QLoRAConfig.from_dict(manifest.config).lora
    return LoRAConfig.from_dict(manifest.config)


def _validate_destination(path: Path, *, overwrite: bool) -> None:
    """Controleert de doelmap."""
    if path.exists() and not overwrite:
        raise FineTuningError("Adapter artifact destination already exists")
    if path.exists() and not path.is_dir():
        raise FineTuningError("Adapter artifact destination exists and is not a directory")


def _inventory_files(root: Path) -> list[AdapterArtifactFile]:
    """Maakt een bestandsinventaris voor adapterpayload."""
    records: list[AdapterArtifactFile] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.name == ADAPTER_MANIFEST:
            continue
        _validate_payload_file(root, path)
        relative = path.relative_to(root).as_posix()
        records.append(
            AdapterArtifactFile(
                path=relative,
                size_bytes=path.stat().st_size,
                sha256=_sha256(path),
                role="adapter_weights" if relative == ADAPTER_WEIGHTS_PATH else None,
            )
        )
    return records


def _read_manifest(path: Path) -> PeftAdapterManifest:
    """Leest het adaptermanifest."""
    manifest_path = path / ADAPTER_MANIFEST
    if not manifest_path.is_file():
        raise FineTuningError("Adapter artifact manifest is missing")
    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise FineTuningError("Adapter artifact manifest is not valid JSON") from error
    if not isinstance(data, dict):
        raise FineTuningError("Adapter artifact manifest must contain a JSON object")
    return PeftAdapterManifest.from_dict(data)


def _load_state_dict(path: Path) -> dict[str, torch.Tensor]:
    """Laadt alleen tensor-state uit het adapterbestand."""
    try:
        payload = torch.load(path, map_location="cpu", weights_only=True)
    except TypeError:
        payload = torch.load(path, map_location="cpu")
    if not isinstance(payload, Mapping):
        raise FineTuningError("Adapter weights must contain a state dictionary")
    if not all(isinstance(key, str) and torch.is_tensor(value) for key, value in payload.items()):
        raise FineTuningError("Adapter weights must contain only tensors")
    return dict(payload)


def _safe_relative_path(value: str) -> Path:
    """Weigert absolute paden en path traversal."""
    path = Path(value)
    if path.is_absolute() or ".." in path.parts:
        raise FineTuningError("Adapter manifest contains an unsafe file path")
    return path


def _validate_payload_file(root: Path, path: Path) -> None:
    """Controleert dat payload binnen het artifact blijft."""
    if not path.exists() or not path.is_file():
        raise FineTuningError("Adapter payload file is missing")
    if path.is_symlink():
        raise FineTuningError("Adapter payload files may not be symlinks")
    try:
        path.resolve().relative_to(root.resolve())
    except ValueError as error:
        raise FineTuningError("Adapter payload escapes the artifact directory") from error


def _sha256(path: Path) -> str:
    """Berekent SHA-256 voor een bestand."""
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _write_json(path: Path, data: Mapping[str, Any]) -> None:
    """Schrijft deterministische JSON."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(_json_safe(data), indent=2, sort_keys=True),
        encoding="utf-8",
    )


def _json_safe(value: Any) -> Any:
    """Maakt manifestdata veilig voor JSON."""
    if callable(value):
        raise FineTuningError("Adapter metadata may not contain callables")
    if isinstance(value, Mapping):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)


def _created_with() -> dict[str, Any]:
    """Geeft veilige runtime-versies."""
    return {
        "arclm": __version__,
        "python": platform.python_version(),
        "pytorch": str(torch.__version__),
    }


def _commit_staging_directory(staging: Path, destination: Path, *, overwrite: bool) -> None:
    """Verplaatst een gevalideerde staging-map naar het doel."""
    backup: Path | None = None
    try:
        if destination.exists():
            if not overwrite:
                raise FineTuningError("Adapter artifact destination already exists")
            backup = destination.with_name(f".{destination.name}.backup-{uuid.uuid4().hex}")
            os.replace(destination, backup)
        os.replace(staging, destination)
        if backup is not None:
            shutil.rmtree(backup, ignore_errors=True)
    except Exception as error:
        if backup is not None and backup.exists() and not destination.exists():
            os.replace(backup, destination)
        if isinstance(error, FineTuningError):
            raise
        raise FineTuningError(f"Adapter artifact commit failed: {error}") from error
