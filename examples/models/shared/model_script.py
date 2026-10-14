"""Entry points voor model-specifieke scripts."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any, Dict

from .configuration import get_model
from .hardware import collect_preflight
from .output import print_json
from .verification import prepare_dataset_preview, run_security_check, verify_model, write_result


def build_operation_parser(description: str) -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument("--model-root", default=str(Path("models") / "external"))
    parser.add_argument("--cache-root", default=str(Path.home() / ".cache" / "huggingface"))
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--dtype", default="auto")
    parser.add_argument("--offline", action="store_true")
    parser.add_argument("--allow-download", action="store_true")
    parser.add_argument("--max-disk-gb", type=float, default=None)
    parser.add_argument("--max-ram-gb", type=float, default=None)
    parser.add_argument("--max-vram-gb", type=float, default=None)
    return parser


def run_model_operation(model_id: str, operation: str, argv: list[str] | None = None) -> int:
    """Voer één modeloperatie uit met gedeelde veiligheidsregels."""

    parser = build_operation_parser(f"{model_id}: {operation}")
    args = parser.parse_args(argv)
    args.model = model_id
    record = get_model(model_id)

    if operation == "requirements":
        result = collect_preflight(Path(args.model_root), Path(args.cache_root))
    elif operation in {"download", "load", "generate", "save", "reload"}:
        result = verify_model(args)
        result["requested_operation"] = operation
        if operation in {"save", "reload"}:
            result["note_nl"] = "Save/reload wordt door de verificatierunner pas echt bewezen na een geslaagde lokale modelrun."
    elif operation == "prepare_dataset":
        result = prepare_dataset_preview(
            record,
            allow_download=args.allow_download,
            offline=args.offline,
            model_root=Path(args.model_root),
        )
        write_result(model_id, operation, result)
    elif operation == "finetune_sft":
        result = {
            "status": "dependency_missing" if record["operations"].get("peft_sft") == "dependency_missing" else "not_tested",
            "method": "preparation-only",
            "note_nl": "Deze entry point gebruikt eerst datasetvoorbereiding. Een echte tiny SFT-run vereist lokaal geladen gewichten en voldoende RAM/VRAM.",
            "preview": prepare_dataset_preview(
                record,
                allow_download=args.allow_download,
                offline=args.offline,
                model_root=Path(args.model_root),
            ),
        }
        write_result(model_id, operation, result)
    elif operation == "evaluate":
        result = {
            "status": "not_tested",
            "note_nl": "Evaluatie vereist een lokaal geladen model. Gebruik eerst 03_load_model.py en 04_generate_text.py.",
            "benchmark_file": str(Path(__file__).resolve().parents[1] / record["dataset_path"] / "benchmark.jsonl"),
        }
        write_result(model_id, operation, result)
    elif operation == "benchmark":
        result = {
            "status": "not_tested",
            "note_nl": "Benchmarkmeting wordt pas gevuld na echte download/load/generation.",
            "model_id": model_id,
        }
        write_result(model_id, operation, result)
    elif operation == "security":
        result = run_security_check(record)
        write_result(model_id, operation, result)
    elif operation == "chat":
        result = {
            "status": record["operations"].get("chat_template", "not_tested"),
            "note_nl": "Chat gebruikt de tokenizer-chattemplate wanneer deze lokaal geverifieerd beschikbaar is.",
            "example_messages": [
                {"role": "system", "content": "Je bent een lokale ArcLM-assistent."},
                {"role": "user", "content": "Vat veilige modelverificatie samen."},
            ],
        }
        write_result(model_id, operation, result)
    else:
        raise ValueError(f"Onbekende operatie: {operation}")

    print_json(result if isinstance(result, Dict) else {"result": result})
    return 0
