"""Output helpers for examples."""

from __future__ import annotations

import json
from typing import Any


def print_json(value: Any) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def print_heading(title: str) -> None:
    print(title)
    print("=" * len(title))

