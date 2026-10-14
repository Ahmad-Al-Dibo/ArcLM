"""Cryptographic hashing helpers."""

from __future__ import annotations

import hashlib
import hmac
from pathlib import Path

from .errors import SecurityPolicyError


ALLOWED_HASHES = {"sha256", "sha512"}


def hash_bytes(data: bytes, *, algorithm: str = "sha256") -> str:
    """Hash bytes with an allowlisted algorithm."""

    digest = _hash(algorithm)
    digest.update(data)
    return f"{algorithm}:{digest.hexdigest()}"


def hash_file(path: str | Path, *, algorithm: str = "sha256", chunk_size: int = 1024 * 1024) -> str:
    """Hash a file without loading it all into memory."""

    digest = _hash(algorithm)
    with Path(path).open("rb") as handle:
        while True:
            chunk = handle.read(chunk_size)
            if not chunk:
                break
            digest.update(chunk)
    return f"{algorithm}:{digest.hexdigest()}"


def verify_file_hash(path: str | Path, expected: str) -> bool:
    """Verify a trusted expected file hash."""

    algorithm, _, _ = expected.partition(":")
    if not algorithm:
        raise SecurityPolicyError("expected hash must include an algorithm prefix")
    actual = hash_file(path, algorithm=algorithm)
    return hmac.compare_digest(actual, expected)


def _hash(algorithm: str):
    name = algorithm.lower()
    if name not in ALLOWED_HASHES:
        raise SecurityPolicyError("hash algorithm is not allowed")
    return hashlib.new(name)
