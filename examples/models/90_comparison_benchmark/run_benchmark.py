"""Vergelijk modellen zonder ze tegelijk te laden."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

OPERATION_NAMES = ["download", "tokenizer_load", "model_load", "forward", "text_generation"]


def iter_models():
    manifest = json.loads((Path(__file__).resolve().parents[1] / "models.json").read_text(encoding="utf-8"))
    yield from manifest.get("models", [])


def verified_for_core_usage(model):
    accepted = {"verified", "verified_cpu", "verified_gpu", "verified_manual"}
    operations = model.get("operations", {})
    return all(operations.get(name) in accepted for name in OPERATION_NAMES)


def main() -> int:
    parser = argparse.ArgumentParser(description="Draai een begrensde vergelijking.")
    parser.add_argument("--verified-only", action="store_true")
    args = parser.parse_args()
    rows = []
    for model in iter_models():
        if args.verified_only and not verified_for_core_usage(model):
            continue
        rows.append(
            {
                "model_id": model["id"],
                "family": model["family"],
                "load_status": model["operations"]["model_load"],
                "generation_status": model["operations"]["text_generation"],
                "benchmark_status": model["operations"]["benchmark"],
                "note": "Geen runtime-meting beschikbaar in het manifest.",
            }
        )

    payload = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "verified_only": args.verified_only,
        "results": rows,
    }
    here = Path(__file__).resolve().parent
    (here / "benchmark_results.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    lines = ["# Benchmarkresultaten", "", "| Model | Familie | Load | Generatie | Benchmark |", "|---|---|---|---|---|"]
    for row in rows:
        lines.append(f"| {row['model_id']} | {row['family']} | {row['load_status']} | {row['generation_status']} | {row['benchmark_status']} |")
    if not rows:
        lines.append("| Geen | n.v.t. | not_tested | not_tested | not_tested |")
    (here / "benchmark_results.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
