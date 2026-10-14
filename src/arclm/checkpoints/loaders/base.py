"""Shared types and helpers for external checkpoint loading."""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Mapping, Optional

from ...utils.imports import require_torch

require_torch("ArcLM checkpoints")
import torch


TensorDict = Mapping[str, torch.Tensor]


@dataclass
class LoadedCheckpoint:
    """Normalized representation of a model source that ArcLM can inspect."""

    source: str
    source_type: str
    state_dict: Dict[str, torch.Tensor]
    config: Dict[str, Any] = field(default_factory=dict)
    vocab_size: Optional[int] = None
    tokenizer_metadata: Dict[str, Any] = field(default_factory=dict)
    vocab: Optional[list] = None
    stoi: Optional[Dict[str, int]] = None
    itos: Optional[Dict[int, str]] = None
    optimizer_state_dict: Optional[Dict[str, Any]] = None
    train_history: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def is_arclm_checkpoint(self) -> bool:
        """Controleert of checkpointdata op een ArcLM checkpoint lijkt."""
        return self.source_type == "arclm"

    def require_state_dict(self) -> Dict[str, torch.Tensor]:
        """Haalt de state dict op of geeft een duidelijke fout."""
        if not self.state_dict:
            raise ValueError(f"No model weights were found in source: {self.source}")
        return self.state_dict


@dataclass
class AdaptedModelBundle:
    """ArcLM model and metadata produced from a normalized checkpoint."""

    model: torch.nn.Module
    config: Any
    checkpoint: LoadedCheckpoint
    missing_keys: list
    unexpected_keys: list
    tokenizer_metadata: Dict[str, Any] = field(default_factory=dict)


class CheckpointLoader:
    """Base class for source-specific checkpoint loaders."""

    source_type = "unknown"

    def can_load(self, source: Any) -> bool:
        """Controleert of deze loader de bron kan laden."""
        raise NotImplementedError

    def load(self, source: Any, map_location: str = "cpu") -> LoadedCheckpoint:
        """Laadt de opgegeven bron."""
        raise NotImplementedError


def load_torch_checkpoint(path: Path, map_location: str = "cpu") -> Any:
    """Load a PyTorch checkpoint while supporting older torch versions."""

    try:
        return torch.load(path, map_location=map_location, weights_only=False)
    except TypeError:
        return torch.load(path, map_location=map_location)


def normalize_itos(itos: Optional[Mapping[Any, Any]]) -> Optional[Dict[int, str]]:
    """Normaliseert een index-naar-token mapping."""
    if itos is None:
        return None
    return {int(index): str(token) for index, token in itos.items()}


def normalize_stoi(stoi: Optional[Mapping[Any, Any]]) -> Optional[Dict[str, int]]:
    """Normaliseert een token-naar-index mapping."""
    if stoi is None:
        return None
    return {str(token): int(index) for token, index in stoi.items()}


def looks_like_state_dict(value: Any) -> bool:
    """Controleert of een object op een state dict lijkt."""
    return (
        isinstance(value, Mapping)
        and bool(value)
        and all(torch.is_tensor(tensor) for tensor in value.values())
    )
