"""Automatic model construction helpers."""

from __future__ import annotations

from .text.causal_lm import ArcLM


class AutoModel:
    """Factory for ArcLM model classes supported by the current package."""

    @classmethod
    def from_config(cls, config):
        """Build the native causal language model from a Config-like object."""
        vocab_size = getattr(config, "vocab_size", None)
        if vocab_size is None:
            raise ValueError("config.vocab_size is required to build an ArcLM model.")
        return ArcLM(
            vocab_size=vocab_size,
            embed_dim=getattr(config, "embed_dim", 64),
            block_size=getattr(config, "block_size", 8),
            num_blocks=getattr(config, "num_blocks", 2),
            dropout=getattr(config, "dropout", 0.0),
        )

    @classmethod
    def from_name(cls, name: str, **kwargs):
        """Build a supported model by name."""
        normalized = name.lower().replace("-", "_")
        if normalized in {"arclm", "minigpt", "causal_lm"}:
            return ArcLM(**kwargs)
        raise ValueError(f"Unknown model name: {name!r}. Supported: 'arclm'.")
