"""Embedder protocol and zero-dependency implementations (torch-free core)."""

from __future__ import annotations

import hashlib
from typing import Callable, Protocol, Sequence, runtime_checkable

import numpy as np

from .analyzer import analyze


@runtime_checkable
class Embedder(Protocol):
    """Anything that maps a list of texts to a matrix of shape (n, dim)."""

    @property
    def dim(self) -> int: ...

    def encode(self, texts: Sequence[str]) -> np.ndarray:
        """Return float32 array (len(texts), dim)."""
        ...


class HashingEmbedder:
    """Feature-hashing embedder — deterministic, numpy-only, no model.

    Good for lexical-ish similarity baselines and offline demos.
    Not semantic sentence embeddings.

    Args:
        dim: Output dimensionality (power of two recommended).
        lowercase: Lowercase before hashing.
    """

    def __init__(self, dim: int = 256, *, lowercase: bool = True) -> None:
        if dim <= 0:
            raise ValueError("dim must be > 0")
        self._dim = int(dim)
        self._lowercase = lowercase

    @property
    def dim(self) -> int:
        return self._dim

    def encode(self, texts: Sequence[str]) -> np.ndarray:
        out = np.zeros((len(texts), self._dim), dtype=np.float32)
        for i, text in enumerate(texts):
            tokens = analyze(text, lowercase=self._lowercase)
            for tok in tokens:
                digest = hashlib.md5(tok.encode("utf-8")).digest()
                bucket = int.from_bytes(digest[:4], "little") % self._dim
                sign = 1.0 if digest[4] % 2 == 0 else -1.0
                out[i, bucket] += sign
            norm = float(np.linalg.norm(out[i]))
            if norm > 0:
                out[i] /= norm
        return out


class CallableEmbedder:
    """Wrap any user function ``(list[str]) -> array-like`` as an Embedder.

    Example::

        import numpy as np
        emb = CallableEmbedder(fn=my_model.encode, dim=384)
    """

    def __init__(self, fn: Callable[[Sequence[str]], object], dim: int) -> None:
        if dim <= 0:
            raise ValueError("dim must be > 0")
        if not callable(fn):
            raise TypeError("fn must be callable")
        self._fn = fn
        self._dim = int(dim)

    @property
    def dim(self) -> int:
        return self._dim

    def encode(self, texts: Sequence[str]) -> np.ndarray:
        raw = self._fn(texts)
        arr = np.asarray(raw, dtype=np.float32)
        if arr.ndim == 1:
            arr = arr.reshape(1, -1)
        if arr.shape != (len(texts), self._dim):
            raise ValueError(
                f"embedder returned shape {arr.shape}, expected {(len(texts), self._dim)}"
            )
        return arr
