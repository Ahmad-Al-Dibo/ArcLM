"""Run and inspect the numbered ArcLM examples suite."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Iterable


EXAMPLES_ROOT = Path(__file__).resolve().parent
REPO_ROOT = EXAMPLES_ROOT.parent
MANIFEST_PATH = EXAMPLES_ROOT / "manifest.json"
RUNNABLE_STATUSES = {"verified", "verified_with_fake_backend"}


def load_manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def iter_entries(manifest: dict) -> list[dict]:
    return list(manifest.get("entries", []))


def find_entry(manifest: dict, example_id: str) -> dict:
    for entry in iter_entries(manifest):
        if entry["id"] == example_id:
            return entry
    raise SystemExit(f"Unknown example id: {example_id}")


def runnable(entries: Iterable[dict]) -> list[dict]:
    return [entry for entry in entries if entry.get("status") in RUNNABLE_STATUSES and entry.get("path")]


def command_env() -> dict[str, str]:
    env = dict(os.environ)
    src_dir = REPO_ROOT / "src"
    if src_dir.exists():
        old = env.get("PYTHONPATH")
        env["PYTHONPATH"] = str(src_dir) if not old else str(src_dir) + os.pathsep + old
    return env


def run_entry(entry: dict, *, timeout: int = 120) -> dict:
    relative = entry.get("path")
    if not relative:
        return {"id": entry["id"], "status": "skipped", "reason": "manual or optional entry"}

    script = EXAMPLES_ROOT / relative
    started = time.perf_counter()
    process = subprocess.run(
        [sys.executable, str(script)],
        cwd=str(REPO_ROOT),
        env=command_env(),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    elapsed = round(time.perf_counter() - started, 2)
    result = {
        "id": entry["id"],
        "title": entry["title"],
        "path": relative,
        "status": "passed" if process.returncode == 0 else "failed",
        "returncode": process.returncode,
        "seconds": elapsed,
    }
    if process.stdout:
        result["stdout_tail"] = process.stdout[-1200:]
    if process.stderr:
        result["stderr_tail"] = process.stderr[-1200:]
    return result


def print_table(entries: Iterable[dict]) -> None:
    for entry in entries:
        marker = "run" if entry.get("status") in RUNNABLE_STATUSES and entry.get("path") else "skip"
        print(f"{entry['id']:>5}  {marker:<4}  {entry['status']:<22}  {entry['category']:<24}  {entry['title']}")


def run_many(entries: list[dict], *, timeout: int) -> int:
    failures = 0
    for entry in entries:
        result = run_entry(entry, timeout=timeout)
        print(json.dumps(result, indent=2, sort_keys=True))
        if result["status"] == "failed":
            failures += 1
    print(f"Summary: {len(entries) - failures} passed, {failures} failed")
    return 1 if failures else 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("list", help="List all manifest entries")
    subparsers.add_parser("status", help="Show verification status summary")

    run_parser = subparsers.add_parser("run", help="Run one example by id")
    run_parser.add_argument("example_id")
    run_parser.add_argument("--timeout", type=int, default=120)

    category_parser = subparsers.add_parser("run-category", help="Run all runnable examples in one category")
    category_parser.add_argument("category")
    category_parser.add_argument("--timeout", type=int, default=120)

    verified_parser = subparsers.add_parser("run-verified", help="Run every verified runnable example")
    verified_parser.add_argument("--timeout", type=int, default=120)

    args = parser.parse_args(argv)
    manifest = load_manifest()
    entries = iter_entries(manifest)

    if args.command == "list":
        print_table(entries)
        return 0

    if args.command == "status":
        counts: dict[str, int] = {}
        for entry in entries:
            counts[entry["status"]] = counts.get(entry["status"], 0) + 1
        print(json.dumps({"entries": len(entries), "statuses": counts}, indent=2, sort_keys=True))
        return 0

    if args.command == "run":
        result = run_entry(find_entry(manifest, args.example_id), timeout=args.timeout)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["status"] in {"passed", "skipped"} else 1

    if args.command == "run-category":
        selected = runnable(entry for entry in entries if entry["category"] == args.category)
        if not selected:
            raise SystemExit(f"No runnable examples found for category: {args.category}")
        return run_many(selected, timeout=args.timeout)

    if args.command == "run-verified":
        return run_many(runnable(entries), timeout=args.timeout)

    return 2


if __name__ == "__main__":
    raise SystemExit(main())
