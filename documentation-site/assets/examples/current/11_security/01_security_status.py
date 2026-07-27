"""
ArcLM Example: Security Status

This example prints the safe Security Core status report.
"""

from __future__ import annotations

import json

from arclm.security import security_status


def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


def main() -> None:
    print_json(security_status())


if __name__ == "__main__":
    main()

