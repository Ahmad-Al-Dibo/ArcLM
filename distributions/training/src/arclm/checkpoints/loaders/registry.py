"""Loader registry and public external-model loading helpers."""

from typing import Any, Iterable, List, Optional

from .arclm_checkpoint import ArcLMCheckpointLoader
from .base import CheckpointLoader, LoadedCheckpoint
from .hf_loader import HuggingFaceLoader
from .safetensors_loader import SafetensorsLoader
from .state_dict_loader import StateDictLoader


class LoaderRegistry:
    """Ordered registry that picks the first loader matching a source."""

    def __init__(self, loaders: Optional[Iterable[CheckpointLoader]] = None):
        """Maakt dit object klaar voor gebruik."""
        self.loaders: List[CheckpointLoader] = list(loaders or [])

    def register(self, loader: CheckpointLoader) -> None:
        """Registreert een item voor later gebruik."""
        self.loaders.append(loader)

    def get_loader(self, source: Any) -> CheckpointLoader:
        """Haalt de juiste loader op voor een bron."""
        for loader in self.loaders:
            if loader.can_load(source):
                return loader
        raise ValueError(
            f"Unsupported model source: {source}. "
            "Expected an ArcLM checkpoint, raw PyTorch state dict, safetensors file, "
            "or Hugging Face folder/model ID."
        )

    def load(self, source: Any, map_location: str = "cpu") -> LoadedCheckpoint:
        """Laadt de opgegeven bron."""
        loader = self.get_loader(source)
        return loader.load(source, map_location=map_location)


def create_default_registry() -> LoaderRegistry:
    """Maakt de standaard registry met loaders."""
    return LoaderRegistry(
        [
            ArcLMCheckpointLoader(),
            SafetensorsLoader(),
            StateDictLoader(),
            HuggingFaceLoader(),
        ]
    )


_DEFAULT_REGISTRY = create_default_registry()


def load_external_model(source: Any, map_location: str = "cpu") -> LoadedCheckpoint:
    """Load any supported external source into a normalized checkpoint bundle."""

    return _DEFAULT_REGISTRY.load(source, map_location=map_location)
