"""Helpers om automatisch de juiste tokenizer te maken."""

from __future__ import annotations

from .base import TokenizerFactory


class AutoTokenizer:
    """Maakt ondersteunde ArcLM tokenizers vanuit config of type-naam."""

    @classmethod
    def from_config(cls, config):
        """Maakt een tokenizer vanuit een config-achtig object."""
        return TokenizerFactory.from_config(config)

    @classmethod
    def from_type(cls, tokenizer_type: str = "word", **kwargs):
        """Maakt een tokenizer met een geregistreerde type-naam."""
        return TokenizerFactory.create(tokenizer_type, **kwargs)
