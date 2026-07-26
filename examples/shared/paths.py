"""Path helpers for examples."""

from __future__ import annotations

import tempfile
from contextlib import contextmanager
from pathlib import Path


def examples_root() -> Path:
    return Path(__file__).resolve().parents[1]


def asset_path(*parts: str) -> Path:
    return examples_root() / "assets" / Path(*parts)


@contextmanager
def temporary_example_dir(prefix: str):
    with tempfile.TemporaryDirectory(prefix=f"arclm-{prefix}-") as tmp:
        yield Path(tmp)

