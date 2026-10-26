"""Lightweight local evaluation harness (torch-free)."""

from __future__ import annotations

from .evalset import (
    Case,
    CaseResult,
    EvalReport,
    load_cases,
    run_evalset,
)

__all__ = [
    "Case",
    "CaseResult",
    "EvalReport",
    "load_cases",
    "run_evalset",
]
