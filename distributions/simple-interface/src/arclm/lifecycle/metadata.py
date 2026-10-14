"""Modelbronnen en artifact-metadata voor ArcLM."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Mapping

from .._version import __version__
from ..exceptions import ConfigurationError, ModelLoadError


MODEL_SOURCE_TYPES = {
    "native_checkpoint",
    "state_dict",
    "huggingface_folder",
    "huggingface_id",
    "pytorch_module",
    "unknown",
}

ARTIFACT_KINDS = {
    "training_checkpoint",
    "inference_artifact",
    "state_dict",
    "huggingface_model",
    "pytorch_module",
    "unknown",
}

MANIFEST_NAME = "arclm-artifact.json"
MODEL_ARTIFACT_MANIFEST = "manifest.json"


@dataclass
class TokenizerInfo:
    """Beschrijft welke tokenizer bij een model hoort."""

    tokenizer_type: str | None = None
    source: str | None = None
    vocab_size: int | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Zet tokenizer metadata om naar een gewone dict."""
        return _json_safe(asdict(self))

    @classmethod
    def from_dict(cls, values: Mapping[str, Any] | None) -> "TokenizerInfo":
        """Maakt tokenizer metadata vanuit bestaande checkpoint-data."""
        if not values:
            return cls()
        metadata = dict(values)
        tokenizer_type = metadata.pop("tokenizer_type", metadata.pop("type", None))
        source = metadata.pop("source", metadata.pop("model_id", None))
        vocab_size = metadata.pop("vocab_size", None)
        return cls(
            tokenizer_type=str(tokenizer_type) if tokenizer_type is not None else None,
            source=str(source) if source is not None else None,
            vocab_size=int(vocab_size) if vocab_size is not None else None,
            metadata=_json_safe(metadata),
        )


@dataclass
class ModelSource:
    """Beschrijft waar een model vandaan komt."""

    source: str
    source_type: str = "unknown"
    exists: bool = False
    path: str | None = None

    def __post_init__(self) -> None:
        """Controleert dat het brontype bekend is."""
        if self.source_type not in MODEL_SOURCE_TYPES:
            raise ValueError("source_type must be a known ArcLM model source type")

    def to_dict(self) -> dict[str, Any]:
        """Zet de modelbron om naar een gewone dict."""
        return _json_safe(asdict(self))

    @classmethod
    def from_source(cls, source: Any) -> "ModelSource":
        """Maakt een bronbeschrijving zonder zware modellen te laden."""
        source_type = infer_model_source_type(source)
        if _is_torch_module(source):
            return cls(source=type(source).__name__, source_type=source_type, exists=True)
        path = Path(str(source))
        return cls(
            source=str(source),
            source_type=source_type,
            exists=path.exists(),
            path=str(path) if path.exists() else None,
        )


@dataclass
class ModelArtifactInfo:
    """Beschrijft een modelartifact of training checkpoint.

    Dit object is bewust JSON-vriendelijk zodat checkpoints, manifests en
    toekomstige tools dezelfde metadata kunnen lezen.
    """

    artifact_kind: str = "unknown"
    source_type: str = "unknown"
    model_type: str | None = None
    architecture: str | None = None
    precision: str | None = None
    device: str | None = None
    arclm_version: str = __version__
    pytorch_version: str | None = None
    model_config: dict[str, Any] = field(default_factory=dict)
    tokenizer: TokenizerInfo = field(default_factory=TokenizerInfo)
    training_state: dict[str, Any] = field(default_factory=dict)
    compatibility: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        """Controleert dat de vaste statusvelden bekend zijn."""
        if self.artifact_kind not in ARTIFACT_KINDS:
            raise ValueError("artifact_kind must be a known ArcLM artifact kind")
        if self.source_type not in MODEL_SOURCE_TYPES:
            raise ValueError("source_type must be a known ArcLM model source type")

    def to_dict(self) -> dict[str, Any]:
        """Zet artifact metadata om naar een gewone dict."""
        data = asdict(self)
        data["tokenizer"] = self.tokenizer.to_dict()
        return _json_safe(data)

    @classmethod
    def from_dict(cls, values: Mapping[str, Any] | None) -> "ModelArtifactInfo":
        """Maakt artifact metadata vanuit een dict."""
        if not values:
            return cls()
        data = dict(values)
        tokenizer = TokenizerInfo.from_dict(data.pop("tokenizer", None))
        return cls(
            artifact_kind=data.pop("artifact_kind", "unknown"),
            source_type=data.pop("source_type", "unknown"),
            model_type=data.pop("model_type", None),
            architecture=data.pop("architecture", None),
            precision=data.pop("precision", None),
            device=data.pop("device", None),
            arclm_version=data.pop("arclm_version", __version__),
            pytorch_version=data.pop("pytorch_version", None),
            model_config=dict(data.pop("model_config", {}) or {}),
            tokenizer=tokenizer,
            training_state=dict(data.pop("training_state", {}) or {}),
            compatibility=dict(data.pop("compatibility", {}) or {}),
            metadata=dict(data.pop("metadata", {}) or {}),
        )


def infer_model_source_type(source: Any) -> str:
    """Bepaalt het modelbrontype zonder optionele packages te laden."""
    if _is_torch_module(source):
        return "pytorch_module"
    source_text = str(source).strip()
    path = Path(source_text)
    if path.is_dir():
        if (
            (path / MODEL_ARTIFACT_MANIFEST).exists()
            or (path / MANIFEST_NAME).exists()
            or (path / "config.json").exists()
        ):
            return "huggingface_folder"
        return "unknown"
    if path.is_file():
        if path.suffix.lower() == ".safetensors":
            return "state_dict"
        if path.suffix.lower() in {".pth", ".pt", ".ckpt", ".bin"}:
            return _source_type_from_checkpoint(path)
    if _looks_like_huggingface_id(source_text):
        return "huggingface_id"
    return "unknown"


def inspect_model_artifact(
    source: Any,
    map_location: str = "cpu",
    *,
    verify_integrity: bool = False,
) -> ModelArtifactInfo:
    """Inspecteert een modelbron en geeft ArcLM lifecycle metadata terug."""
    if _is_torch_module(source):
        return ModelArtifactInfo(
            artifact_kind="pytorch_module",
            source_type="pytorch_module",
            model_type=type(source).__name__,
            pytorch_version=_torch_version(),
        )

    path = Path(str(source))
    if path.is_dir():
        if (path / MODEL_ARTIFACT_MANIFEST).exists():
            from .artifacts import inspect_model_artifact as inspect_final_model_artifact

            return inspect_final_model_artifact(path, verify_integrity=verify_integrity)
        manifest = path / MANIFEST_NAME
        if manifest.exists():
            return load_artifact_manifest(manifest)
        if (path / "config.json").exists():
            config = _read_json(path / "config.json")
            architectures = config.get("architectures") or []
            return ModelArtifactInfo(
                artifact_kind="huggingface_model",
                source_type="huggingface_folder",
                model_type=config.get("model_type"),
                architecture=architectures[0] if architectures else None,
                precision=_normalize_precision(config.get("torch_dtype")),
                pytorch_version=_torch_version(),
                model_config=config,
                tokenizer=TokenizerInfo(
                    tokenizer_type="huggingface",
                    source=str(path),
                ),
            )
    if path.is_file():
        checkpoint = _load_torch_checkpoint(path, map_location=map_location)
        return _metadata_from_checkpoint(checkpoint, source=str(path))
    if _looks_like_huggingface_id(str(source)):
        return ModelArtifactInfo(
            artifact_kind="huggingface_model",
            source_type="huggingface_id",
            model_type=_infer_model_type_from_name(str(source)),
            pytorch_version=_torch_version(),
            tokenizer=TokenizerInfo(tokenizer_type="huggingface", source=str(source)),
            metadata={"source": str(source)},
        )
    raise ModelLoadError(f"Unsupported model source: {source}")


def build_training_checkpoint_metadata(
    *,
    model: Any,
    config: Mapping[str, Any],
    training_state: Mapping[str, Any],
    precision: str,
    device: str,
    tokenizer_metadata: Mapping[str, Any] | None = None,
    extra: Mapping[str, Any] | None = None,
) -> ModelArtifactInfo:
    """Maakt lifecycle metadata voor een training checkpoint."""
    return ModelArtifactInfo(
        artifact_kind="training_checkpoint",
        source_type="native_checkpoint",
        model_type=type(model).__name__,
        architecture=f"{type(model).__module__}.{type(model).__name__}",
        precision=precision,
        device=device,
        arclm_version=__version__,
        pytorch_version=_torch_version(),
        model_config=dict(config),
        tokenizer=TokenizerInfo.from_dict(tokenizer_metadata),
        training_state=dict(training_state),
        compatibility={
            "trainer": "arclm.training.Trainer",
            "checkpoint_format": "arclm-training-core",
        },
        metadata=dict(extra or {}),
    )


def save_artifact_manifest(path: str | Path, metadata: ModelArtifactInfo) -> Path:
    """Bewaart lifecycle metadata als JSON manifest."""
    target = Path(path)
    if target.suffix:
        target.parent.mkdir(parents=True, exist_ok=True)
        manifest_path = target
    else:
        target.mkdir(parents=True, exist_ok=True)
        manifest_path = target / MANIFEST_NAME
    manifest_path.write_text(
        json.dumps(metadata.to_dict(), indent=2, sort_keys=True),
        encoding="utf-8",
    )
    return manifest_path


def load_artifact_manifest(path: str | Path) -> ModelArtifactInfo:
    """Leest lifecycle metadata uit een JSON manifest."""
    manifest_path = Path(path)
    if manifest_path.is_dir():
        manifest_path = manifest_path / MANIFEST_NAME
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ModelLoadError("Artifact manifest must contain a JSON object")
    return ModelArtifactInfo.from_dict(data)


def load_model_config(source: Any, map_location: str = "cpu") -> dict[str, Any]:
    """Leest modelconfiguratie uit een modelbron."""
    metadata = inspect_model_artifact(source, map_location=map_location)
    if not metadata.model_config:
        raise ConfigurationError("Model source does not contain model configuration")
    return dict(metadata.model_config)


def _metadata_from_checkpoint(checkpoint: Any, source: str) -> ModelArtifactInfo:
    """Haalt lifecycle metadata uit bestaande of nieuwe checkpoint-data."""
    if not isinstance(checkpoint, Mapping):
        raise ModelLoadError("Checkpoint must contain a dictionary")
    existing = checkpoint.get("lifecycle_metadata")
    if isinstance(existing, Mapping):
        metadata = ModelArtifactInfo.from_dict(existing)
        metadata.metadata.setdefault("source", source)
        return metadata

    config = dict(checkpoint.get("config") or {})
    tokenizer = TokenizerInfo.from_dict(checkpoint.get("tokenizer_metadata"))
    has_training_state = any(
        key in checkpoint
        for key in ("training_state", "optimizer_state_dict", "scheduler_state_dict")
    )
    has_arclm_shape = any(key in checkpoint for key in ("model_state_dict", "model"))
    artifact_kind = "training_checkpoint" if has_training_state else "state_dict"
    source_type = "native_checkpoint" if has_arclm_shape and config else "state_dict"
    metadata = dict(checkpoint.get("metadata") or {})
    return ModelArtifactInfo(
        artifact_kind=artifact_kind,
        source_type=source_type,
        model_type=metadata.get("model_type"),
        architecture=metadata.get("architecture"),
        precision=metadata.get("precision"),
        device=metadata.get("device"),
        pytorch_version=metadata.get("pytorch_version") or _torch_version(),
        model_config=config,
        tokenizer=tokenizer,
        training_state=dict(checkpoint.get("training_state") or {}),
        compatibility={
            "legacy_checkpoint": True,
            "has_optimizer": checkpoint.get("optimizer_state_dict") is not None,
            "has_scheduler": checkpoint.get("scheduler_state_dict") is not None,
        },
        metadata={"source": source, **metadata},
    )


def _source_type_from_checkpoint(path: Path) -> str:
    """Inspecteert alleen genoeg om native en state_dict te scheiden."""
    try:
        checkpoint = _load_torch_checkpoint(path, map_location="cpu")
    except Exception:
        return "unknown"
    if isinstance(checkpoint, Mapping) and any(
        key in checkpoint for key in ("model_state_dict", "model")
    ):
        return "native_checkpoint"
    return "state_dict"


def _load_torch_checkpoint(path: Path, map_location: str = "cpu") -> Any:
    """Laadt een vertrouwd PyTorch checkpoint voor metadata-inspectie."""
    try:
        import torch

        return torch.load(path, map_location=map_location, weights_only=False)
    except TypeError:
        import torch

        return torch.load(path, map_location=map_location)


def _torch_version() -> str | None:
    """Geeft de PyTorch versie terug als Torch beschikbaar is."""
    try:
        import torch

        return str(torch.__version__)
    except Exception:
        return None


def _is_torch_module(value: Any) -> bool:
    """Controleert licht of iets een PyTorch module is."""
    try:
        import torch

        return isinstance(value, torch.nn.Module)
    except Exception:
        return False


def _read_json(path: Path) -> dict[str, Any]:
    """Leest een JSON object en geeft anders een duidelijke fout."""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ModelLoadError(f"Invalid JSON metadata: {path}") from error
    if not isinstance(data, dict):
        raise ModelLoadError(f"JSON metadata must be an object: {path}")
    return data


def _looks_like_huggingface_id(value: str) -> bool:
    """Herkent een Hugging Face id zonder netwerk te gebruiken."""
    if not value or any(part in value for part in ("\\", ":", " ")):
        return False
    path = Path(value)
    if path.suffix.lower() in {".pth", ".pt", ".ckpt", ".bin", ".safetensors"}:
        return False
    return not value.startswith((".", "/"))


def _infer_model_type_from_name(value: str) -> str | None:
    """Raadt een modeltype uit een naam voor metadata alleen."""
    text = value.lower()
    for name in ("llama", "mistral", "qwen", "gpt", "bert", "t5"):
        if name in text:
            return name
    return None


def _normalize_precision(value: Any) -> str | None:
    """Normaliseert veelvoorkomende precision namen."""
    if value is None:
        return None
    text = str(value).lower().replace("torch.", "")
    aliases = {
        "float32": "fp32",
        "float": "fp32",
        "float16": "fp16",
        "half": "fp16",
        "bfloat16": "bf16",
    }
    return aliases.get(text, text)


def _json_safe(value: Any) -> Any:
    """Maakt metadata veilig voor JSON zonder grote objecten te bewaren."""
    if isinstance(value, dict):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)
