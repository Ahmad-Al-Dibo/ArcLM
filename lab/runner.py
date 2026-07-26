from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path
from typing import Iterable

from lab.common.metadata import (
    LAB_ROOT,
    REPO_ROOT,
    challenge_path,
    level_entries,
    load_manifest,
    manifest_entry_by_id,
    validate_manifest,
)


def _print_entry(entry: dict[str, object]) -> None:
    print(f'{entry["id"]}: {entry["title"]}')
    print(f'  level: {entry["level"]}')
    print(f'  category: {entry["category"]}')
    print(f'  type: {entry["type"]}')
    print(f'  status: {entry["status"]}')
    print(f'  points: {entry["points"]}')
    print(f'  path: {entry["path"]}')
    prereqs = entry.get("prerequisites") or []
    print(f'  prerequisites: {", ".join(prereqs) if prereqs else "none"}')


def _run_pytest(paths: Iterable[Path]) -> int:
    args = [sys.executable, "-m", "pytest", "-q", "--import-mode=importlib"]
    args.extend(str(path) for path in paths)
    completed = subprocess.run(args, cwd=REPO_ROOT)
    return int(completed.returncode)


def cmd_list(_: argparse.Namespace) -> int:
    manifest = load_manifest()
    for entry in manifest["challenges"]:
        print(f'{entry["id"]}\t{entry["level"]}\t{entry["status"]}\t{entry["title"]}')
    return 0


def cmd_show(args: argparse.Namespace) -> int:
    manifest = load_manifest()
    entry = manifest_entry_by_id(manifest, args.challenge_id)
    _print_entry(entry)
    return 0


def cmd_test(args: argparse.Namespace) -> int:
    manifest = load_manifest()
    entry = manifest_entry_by_id(manifest, args.challenge_id)
    return _run_pytest([challenge_path(entry) / "test_challenge.py"])


def cmd_test_level(args: argparse.Namespace) -> int:
    manifest = load_manifest()
    entries = level_entries(manifest, args.level)
    if not entries:
        print(f"Unknown or empty Lab level: {args.level}", file=sys.stderr)
        return 2
    return _run_pytest([challenge_path(entry) / "test_challenge.py" for entry in entries])


def cmd_test_all(_: argparse.Namespace) -> int:
    manifest = load_manifest()
    return _run_pytest([challenge_path(entry) / "test_challenge.py" for entry in manifest["challenges"]])


def cmd_progress(_: argparse.Namespace) -> int:
    manifest = load_manifest()
    counts: dict[str, dict[str, int]] = {}
    for entry in manifest["challenges"]:
        level = str(entry["level"])
        status = str(entry["status"])
        counts.setdefault(level, {})
        counts[level][status] = counts[level].get(status, 0) + 1
    for level in manifest["levels"]:
        status_counts = counts.get(level, {})
        total = sum(status_counts.values())
        parts = ", ".join(f"{status}={count}" for status, count in sorted(status_counts.items()))
        print(f"{level}: {total} challenges ({parts})")
    return 0


def cmd_validate(_: argparse.Namespace) -> int:
    errors = validate_manifest()
    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1
    print(f"manifest valid: {LAB_ROOT / 'manifest.json'}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="python -m lab.runner")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("list").set_defaults(func=cmd_list)
    show = subparsers.add_parser("show")
    show.add_argument("challenge_id")
    show.set_defaults(func=cmd_show)
    test = subparsers.add_parser("test")
    test.add_argument("challenge_id")
    test.set_defaults(func=cmd_test)
    test_level = subparsers.add_parser("test-level")
    test_level.add_argument("level", choices=["beginner", "intermediate", "advanced", "expert"])
    test_level.set_defaults(func=cmd_test_level)
    subparsers.add_parser("test-all").set_defaults(func=cmd_test_all)
    subparsers.add_parser("progress").set_defaults(func=cmd_progress)
    subparsers.add_parser("validate").set_defaults(func=cmd_validate)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
