"""Similarity metrics on numpy vectors (torch-free)."""

from __future__ import annotations

from typing import Sequence

import numpy as np


def cosine(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity in [-1, 1]; 0.0 for zero vectors."""
    a = np.asarray(a, dtype=np.float64).ravel()
    b = np.asarray(b, dtype=np.float64).ravel()
    na = float(np.linalg.norm(a))
    nb = float(np.linalg.norm(b))
    if na == 0.0 or nb == 0.0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


def dot(a: np.ndarray, b: np.ndarray) -> float:
    """Plain dot product."""
    return float(np.dot(np.asarray(a, dtype=np.float64).ravel(), np.asarray(b, dtype=np.float64).ravel()))


def euclidean(a: np.ndarray, b: np.ndarray) -> float:
    """L2 distance (smaller = closer)."""
    a = np.asarray(a, dtype=np.float64).ravel()
    b = np.asarray(b, dtype=np.float64).ravel()
    return float(np.linalg.norm(a - b))


def jaccard(tokens_a: Sequence[str], tokens_b: Sequence[str]) -> float:
    """Jaccard index over token sets; 0.0 if both empty."""
    sa, sb = set(tokens_a), set(tokens_b)
    if not sa and not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def top_k_indices(scores: np.ndarray, k: int) -> list[int]:
    """Indices of the k largest scores, descending."""
    arr = np.asarray(scores, dtype=np.float64).ravel()
    k = max(1, min(k, arr.size))
    # argpartition for efficiency, then sort the top-k
    idx = np.argpartition(arr, -k)[-k:]
    return list(idx[np.argsort(arr[idx])[::-1]])
