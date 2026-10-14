"""Maak een eerlijk meertalig benchmarkrapport."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    here = Path(__file__).resolve().parent
    tasks = [json.loads(line) for line in (here / "tasks.jsonl").read_text(encoding="utf-8").splitlines() if line.strip()]
    report = {
        "status": "not_tested",
        "automated_metrics": ["keyword_presence_when_generation_exists", "format_compliance_manual_review_needed"],
        "human_review_required": True,
        "tasks": tasks,
    }
    (here / "multilingual_results.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
