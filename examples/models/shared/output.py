"""Kleine uitvoerhulpen voor de voorbeelden."""

from __future__ import annotations

import json
import sys
from typing import Any, Mapping


def print_json(payload: Mapping[str, Any]) -> None:
    """Print compacte, UTF-8-vriendelijke JSON."""

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps(payload, indent=2, ensure_ascii=False, default=str))


def print_table(rows: list[Mapping[str, Any]], columns: list[str]) -> None:
    """Print een eenvoudige tabel zonder extra afhankelijkheden."""

    widths = {
        column: max(len(column), *(len(str(row.get(column, ""))) for row in rows))
        for column in columns
    }
    print(" | ".join(column.ljust(widths[column]) for column in columns))
    print("-+-".join("-" * widths[column] for column in columns))
    for row in rows:
        print(" | ".join(str(row.get(column, "")).ljust(widths[column]) for column in columns))
