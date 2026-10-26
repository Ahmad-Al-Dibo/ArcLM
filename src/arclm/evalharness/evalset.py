"""Local evaluation sets: JSONL cases → runnable reports (torch-free).

Design: you write cases once, plug in ANY callable that maps input → output
(a model, a prompt template, a rule function), and get a structured report.
Export as JSON for comparison with external tools (DeepEval, Ragas, etc.).
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Iterable, Literal, Mapping, Sequence

from ..exceptions import EvalHarnessError

MatchMode = Literal["exact", "contains", "icontains", "callable"]


@dataclass
class Case:
    """One evaluation example."""

    input: str
    expected: str | None = None
    id: str = ""
    match: MatchMode = "exact"
    metadata: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: Mapping[str, Any]) -> "Case":
        if "input" not in data:
            raise EvalHarnessError("case_missing_input", "each case needs an 'input' field")
        mode = str(data.get("match", "exact"))
        if mode not in {"exact", "contains", "icontains", "callable"}:
            raise EvalHarnessError("case_bad_match", f"unknown match mode: {mode!r}")
        return cls(
            input=str(data["input"]),
            expected=None if data.get("expected") is None else str(data["expected"]),
            id=str(data.get("id", "")),
            match=mode,  # type: ignore[arg-type]
            metadata=dict(data.get("metadata", {})),
        )


@dataclass
class CaseResult:
    """Outcome for a single case."""

    id: str
    passed: bool
    input: str
    expected: str | None
    actual: str
    match: str
    error: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "passed": self.passed,
            "input": self.input,
            "expected": self.expected,
            "actual": self.actual,
            "match": self.match,
            "error": self.error,
        }


@dataclass
class EvalReport:
    """Aggregate result of an eval run."""

    total: int
    passed: int
    failed: int
    errors: int
    results: list[CaseResult] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def pass_rate(self) -> float:
        return self.passed / self.total if self.total else 0.0

    def to_dict(self) -> dict[str, Any]:
        return {
            "total": self.total,
            "passed": self.passed,
            "failed": self.failed,
            "errors": self.errors,
            "pass_rate": round(self.pass_rate, 4),
            "results": [r.to_dict() for r in self.results],
            "metadata": dict(self.metadata),
        }

    def save(self, path: str | Path) -> Path:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(self.to_dict(), indent=2, ensure_ascii=False), encoding="utf-8")
        return p

    def failed_cases(self) -> list[CaseResult]:
        return [r for r in self.results if not r.passed]


def _check(mode: str, expected: str | None, actual: str) -> bool:
    if mode == "exact":
        return actual.strip() == (expected or "").strip()
    if mode == "contains":
        return (expected or "") in actual
    if mode == "icontains":
        return (expected or "").lower() in actual.lower()
    raise EvalHarnessError("case_bad_match", f"mode {mode!r} needs a custom checker")


def load_cases(path: str | Path) -> list[Case]:
    """Load cases from a JSONL file (one JSON object per line)."""
    p = Path(path)
    if not p.exists():
        raise EvalHarnessError("evalset_missing_file", f"case file not found: {p}")
    cases: list[Case] = []
    for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
        line = line.strip()
        if not line:
            continue
        try:
            data = json.loads(line)
        except json.JSONDecodeError as exc:
            raise EvalHarnessError("evalset_bad_json", f"line {i}: {exc}") from exc
        if not isinstance(data, dict):
            raise EvalHarnessError("evalset_bad_row", f"line {i}: expected object")
        cases.append(Case.from_dict(data))
    if not cases:
        raise EvalHarnessError("evalset_empty", "no cases found")
    return cases


def run_evalset(
    cases: Sequence[Case] | str | Path,
    fn: Callable[[str], str],
    *,
    checkers: Mapping[str, Callable[[Case, str], bool]] | None = None,
    metadata: Mapping[str, Any] | None = None,
) -> EvalReport:
    """Run *fn* over every case and score the outputs.

    Args:
        cases: Sequence of :class:`Case` or a JSONL path.
        fn: Callable ``input -> output string`` (model, template, rules).
        checkers: Optional custom matchers keyed by ``case.match`` mode
            (use mode ``"callable"`` in cases for a named checker).
        metadata: Extra info stored on the report (version, model id, …).

    Returns:
        :class:`EvalReport`. Exceptions inside *fn* are captured per-case
        as errors, not raised.
    """
    if isinstance(cases, (str, Path)):
        cases = load_cases(cases)
    if not callable(fn):
        raise EvalHarnessError("evalset_bad_fn", "fn must be callable")

    checkers = dict(checkers or {})
    results: list[CaseResult] = []
    passed = failed = errors = 0

    for i, case in enumerate(cases):
        cid = case.id or f"case-{i + 1}"
        try:
            actual = fn(case.input)
            if not isinstance(actual, str):
                actual = str(actual)
            if case.match == "callable":
                checker = checkers.get(case.id) or checkers.get("callable")
                if checker is None:
                    raise EvalHarnessError(
                        "evalset_missing_checker",
                        f"case {cid} uses match='callable' but no checker was provided",
                    )
                ok = bool(checker(case, actual))
            else:
                ok = _check(case.match, case.expected, actual)
            if ok:
                passed += 1
            else:
                failed += 1
            results.append(
                CaseResult(
                    id=cid, passed=ok, input=case.input,
                    expected=case.expected, actual=actual, match=case.match,
                )
            )
        except EvalHarnessError:
            errors += 1
            results.append(
                CaseResult(
                    id=cid, passed=False, input=case.input,
                    expected=case.expected, actual="", match=case.match,
                    error="eval configuration error",
                )
            )
        except Exception as exc:  # noqa: BLE001 — record model failures
            errors += 1
            results.append(
                CaseResult(
                    id=cid, passed=False, input=case.input,
                    expected=case.expected, actual="", match=case.match,
                    error=f"{type(exc).__name__}: {exc}",
                )
            )

    return EvalReport(
        total=len(cases),
        passed=passed,
        failed=failed,
        errors=errors,
        results=results,
        metadata=dict(metadata or {}),
    )
