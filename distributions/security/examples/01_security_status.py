"""
ArcLM Example: Security Status

What you'll learn
-----------------
- Read the Security Core status report for encryption, signing, and
  model-loading policy
- Check that a local environment is hardened before running artifacts

When to use this
----------------
- Auditing a machine's security posture before training or sharing models

Requirements
------------
    pip install "arclm[security]"

Run
---
    python examples/11_security/01_security_status.py

Expected output
---------------
    "encryption": {"available": true, "required_for": [...]}
    "mode": "local_secure"
    "warnings": []

Runtime
-------
    Under 5 seconds on CPU.
"""

from __future__ import annotations

import json

from arclm.security import security_status


# --- 1. Pretty-print helper ---
def print_json(value) -> None:
    print(json.dumps(value, indent=2, sort_keys=True, default=str))


# --- 2. Print the security status report ---
def main() -> None:
    print_json(security_status())


if __name__ == "__main__":
    main()
