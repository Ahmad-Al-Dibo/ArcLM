"""CLI-runner voor de geavanceerde ArcLM modelvoorbeelden.

example usage:
    python examples/models/run_model_examples.py list
    python examples/models/run_model_examples.py preflight
    python examples/models/run_model_examples.py status
    python examples/models/run_model_examples.py verify --model <model_id>

"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from shared.configuration import get_model, iter_models, load_manifest, validate_manifest
from shared.hardware import collect_preflight
from shared.output import print_json, print_table
from shared.verification import prepare_dataset_preview, verify_model, write_result


DEFAULT_MODEL_ROOT = Path("models") / "external"
DEFAULT_CACHE_ROOT = Path.home() / ".cache" / "huggingface"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="ArcLM voorbeelden voor echte lokale modellen.")
    parser.add_argument("--model-root", default=str(DEFAULT_MODEL_ROOT))
    parser.add_argument("--cache-root", default=str(DEFAULT_CACHE_ROOT))
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--dtype", default="auto")
    parser.add_argument("--max-disk-gb", type=float, default=None)
    parser.add_argument("--max-ram-gb", type=float, default=None)
    parser.add_argument("--max-vram-gb", type=float, default=None)
    parser.add_argument("--offline", action="store_true")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list")
    sub.add_parser("preflight")
    sub.add_parser("status")

    verify = sub.add_parser("verify")
    verify.add_argument("--model", required=True)
    verify.add_argument("--allow-download", action="store_true")

    verify_all = sub.add_parser("verify-all")
    verify_all.add_argument("--allow-download", action="store_true")

    sft = sub.add_parser("sft")
    sft.add_argument("--model", required=True)
    sft.add_argument("--allow-download", action="store_true")

    benchmark = sub.add_parser("benchmark")
    benchmark.add_argument("--verified-only", action="store_true")

    operation = sub.add_parser("operation")
    operation.add_argument("--model", required=True)
    operation.add_argument("--operation", required=True)
    operation.add_argument("--model-root", default=str(DEFAULT_MODEL_ROOT))
    operation.add_argument("--cache-root", default=str(DEFAULT_CACHE_ROOT))
    operation.add_argument("--device", default="cpu")
    operation.add_argument("--dtype", default="auto")
    operation.add_argument("--offline", action="store_true")
    operation.add_argument("--allow-download", action="store_true")
    operation.add_argument("--max-disk-gb", type=float, default=None)
    operation.add_argument("--max-ram-gb", type=float, default=None)
    operation.add_argument("--max-vram-gb", type=float, default=None)
    return parser


def list_models() -> None:
    rows = [
        {
            "id": item["id"],
            "familie": item["family"],
            "soort": item["model_kind"],
            "gated": item["gated"],
            "load": item["operations"]["model_load"],
        }
        for item in iter_models()
    ]
    print_table(rows, ["id", "familie", "soort", "gated", "load"])


def print_status() -> None:
    errors = validate_manifest()
    manifest = load_manifest()
    rows = []
    for item in iter_models(manifest):
        operations = item["operations"]
        rows.append(
            {
                "model": item["id"],
                "download": operations["download"],
                "load": operations["model_load"],
                "generate": operations["text_generation"],
                "sft": operations["full_sft"] if operations["full_sft"] != "not_tested" else operations["peft_sft"],
                "reload": operations["reload"],
            }
        )
    print_table(rows, ["model", "download", "load", "generate", "sft", "reload"])
    if errors:
        print("\nManifestproblemen:")
        for error in errors:
            print(f"- {error}")


def run_sft_preview(args) -> None:
    result = prepare_dataset_preview(
        get_model(args.model),
        allow_download=args.allow_download,
        offline=args.offline,
        model_root=Path(args.model_root),
    )
    write_result(args.model, "sft_preview", result)
    print_json(result)


def run_benchmark(verified_only: bool) -> None:
    script = Path(__file__).parent / "90_comparison_benchmark" / "run_benchmark.py"
    command = [sys.executable, str(script)]
    if verified_only:
        command.append("--verified-only")
    subprocess.run(command, check=True, timeout=1800)


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.command == "list":
        list_models()
        return 0
    if args.command == "preflight":
        print_json(collect_preflight(Path(args.model_root), Path(args.cache_root)))
        return 0
    if args.command == "status":
        print_status()
        return 0
    if args.command == "verify":
        print_json(verify_model(args))
        return 0
    if args.command == "verify-all":
        for item in iter_models():
            args.model = item["id"]
            print_json(verify_model(args))
        return 0
    if args.command == "sft":
        run_sft_preview(args)
        return 0
    if args.command == "benchmark":
        run_benchmark(args.verified_only)
        return 0
    if args.command == "operation":
        from shared.model_script import run_model_operation

        forwarded = [
            "--model-root",
            args.model_root,
            "--cache-root",
            args.cache_root,
            "--device",
            args.device,
            "--dtype",
            args.dtype,
        ]
        if args.offline:
            forwarded.append("--offline")
        if getattr(args, "allow_download", False):
            forwarded.append("--allow-download")
        if args.max_disk_gb is not None:
            forwarded.extend(["--max-disk-gb", str(args.max_disk_gb)])
        if args.max_ram_gb is not None:
            forwarded.extend(["--max-ram-gb", str(args.max_ram_gb)])
        if args.max_vram_gb is not None:
            forwarded.extend(["--max-vram-gb", str(args.max_vram_gb)])
        return run_model_operation(args.model, args.operation, argv=forwarded)
    parser.error("Onbekend commando.")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
