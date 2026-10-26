"""
ArcLM Example: Local EvalSet (torch-free evaluation harness)

What you'll learn
-----------------
- Write JSONL eval cases with match modes
- Score any callable with run_evalset
- Save a JSON report for CI or external tools

When to use this
----------------
- Repeatable quality checks for prompts, rules, or models

Requirements
------------
    pip install arclm

Run
---
    python examples/17_evalharness/01_evalset.py

Expected output
---------------
    JSON report with pass_rate and saved file name

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

from arclm.evalharness import Case, run_evalset


def main() -> None:
    cases = [
        Case(input="2+2", expected="4", match="exact", id="math-1"),
        Case(input="hello", expected="hello", match="icontains", id="greet-1"),
        Case(input="capital-of-france", expected="paris", match="icontains", id="fact-1"),
    ]

    # Stand-in "model": a tiny rules function (swap for model.predict later)
    def rules_fn(question: str) -> str:
        table = {
            "2+2": "4",
            "hello": "Hello there!",
            "capital-of-france": "The answer is Paris.",
        }
        return table.get(question, "unknown")

    report = run_evalset(
        cases,
        rules_fn,
        metadata={"system": "rules-stub", "arclm_example": "17-01"},
    )
    assert report.total == 3
    assert report.passed == 3, [r.to_dict() for r in report.failed_cases()]

    with tempfile.TemporaryDirectory(prefix="arclm-eval-") as d:
        out = report.save(Path(d) / "eval_report.json")
        saved = json.loads(out.read_text(encoding="utf-8"))

    print(
        json.dumps(
            {
                "total": report.total,
                "passed": report.passed,
                "pass_rate": report.pass_rate,
                "saved_keys": sorted(saved.keys()),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
