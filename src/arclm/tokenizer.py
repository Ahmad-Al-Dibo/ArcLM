"""Deprecated compatibility shim for ``arclm.tokenizer``."""

import warnings

warnings.warn(
    "arclm.tokenizer is deprecated and will be removed in a future release. "
    "Use 'from arclm.tokenizers import AutoTokenizer, Tokenizer' instead.",
    DeprecationWarning,
    stacklevel=2,
)

from .tokenizers import (
    AutoTokenizer,
    SentencePieceTokenizer,
    Tokenizer,
    TokenizerFactory,
    create_tokenizer,
    get_tokenizer_from_config,
)

__all__ = [
    "AutoTokenizer",
    "SentencePieceTokenizer",
    "Tokenizer",
    "TokenizerFactory",
    "create_tokenizer",
    "get_tokenizer_from_config",
]
