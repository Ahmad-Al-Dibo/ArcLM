"""
ArcLM Command-Line Interface (CLI)

Provides command-line tools for training, evaluation, and generation.

Available Commands:
  - arclm train    : Train a model from scratch or fine-tune
  - arclm eval     : Evaluate model performance
  - arclm generate : Generate text from a trained model
  - arclm web-api  : Start the modern local Web API
  - arclm --run simple-interface : Start the simple web interface

Usage:
  arclm train --config config.yaml --data data.txt
  arclm eval --model models/model.pth --data test.txt
  arclm generate --model models/model.pth --prompt "Hello"
  python -m arclm web-api
  python -m arclm --run simple-interface
"""

import argparse
import json
import sys
from pathlib import Path

import torch

from arclm import (
    Config,
    calculate_metrics,
    export_metrics_to_json,
    export_metrics_to_markdown,
    load_model,
)
from arclm.configs import load_config_json, load_config_yaml
from arclm.datasets import create_dataloader
from arclm.diagnostics_runtime import build_runtime_diagnostics, format_runtime_diagnostics, runtime_diagnostics_json
from arclm.training import train_model


def _json_default(value):
    """Return a simple JSON fallback for CLI payloads."""

    return str(value)


def _print_json(payload):
    """Print deterministic JSON for CLI commands."""

    print(json.dumps(payload, indent=2, sort_keys=True, default=_json_default))


def resolve_cli_device(device):
    """Zet `auto` om naar een echt torch device voor CLI commands."""
    if device == "auto":
        return "cuda" if torch.cuda.is_available() else "cpu"
    if device == "cuda" and not torch.cuda.is_available():
        raise ValueError("CUDA was requested but is not available")
    return device


def load_cli_config(path):
    """Laadt een YAML of JSON config voor de CLI."""
    if path.endswith(".yaml") or path.endswith(".yml"):
        return load_config_yaml(path)
    if path.endswith(".json"):
        return load_config_json(path)
    raise ValueError(f"Unknown config format: {path}")


def encode_text_for_loaded_model(loaded_model, text):
    """Zet evaluatietekst om naar token ids met de checkpoint-tokenizer."""
    tokenizer = getattr(loaded_model.generator, "tokenizer", None)
    if tokenizer is not None and hasattr(tokenizer, "encode_text"):
        return tokenizer.encode_text(text.lower())

    stoi = getattr(loaded_model.generator, "stoi", {})
    unk_idx = stoi.get("<UNK>", stoi.get("<unk>", 0))
    return [stoi.get(token, unk_idx) for token in text.lower().split() if token]


def configure_cli_streams():
    """Maakt terminaluitvoer minder kwetsbaar voor lokale encodings."""
    # Sommige Windows terminals kunnen niet elk modelteken schrijven.
    # Met replacement blijft de CLI draaien en krijgt de gebruiker toch output.
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(errors="replace")
from arclm.cli_utils import create_init_workspace
from arclm._data.init_cli import BASIC_MODULES


def init_command(args: argparse.Namespace) -> int:
    """Create a starter ArcLM workspace."""
    project_dir = getattr(args, "project_dir", None) or "."
    project_name = getattr(args, "name", None) or Path(project_dir).expanduser().resolve().name or "arcml-project"
    try:
        create_init_workspace(project_dir, project_name, BASIC_MODULES)
    except Exception as exc:  # pragma: no cover - defensive path
        print(f"Error creating workspace: {exc}", file=sys.stderr)
        return 1

    print(f"Initialized ArcLM workspace at: {Path(project_dir).expanduser().resolve()}")
    return 0


    # the `init` scaffolding templates and writer live in
    # `arclm._data.init_cli` and `arclm.cli_utils` respectively.


def create_init_parser(subparsers: argparse._SubParsersAction) -> None:
    parser = subparsers.add_parser(
        "init",
        help="Create a starter ArcLM development workspace",
        description="Scaffold a beginner-friendly project layout for ArcLM development",
    )
    parser.add_argument(
        "--project-dir",
        default=".",
        help="Directory to create the new ArcLM workspace in",
    )
    parser.add_argument(
        "--name",
        default=None,
        help="Project name to use in the generated README and entry point",
    )
    parser.set_defaults(func=init_command)


def create_train_parser(subparsers):
    """Maakt de parser voor het train commando."""
    parser = subparsers.add_parser(
        "train",
        help="Train a model from scratch or fine-tune",
        description="Train ArcLM model with configuration file or CLI arguments",
    )

    parser.add_argument(
        "--config",
        type=str,
        default=None,
        help="Path to config file (YAML or JSON) - overrides CLI args",
    )

    parser.add_argument("--embed-dim", type=int, default=128, help="Embedding dimension")
    parser.add_argument("--num-blocks", type=int, default=4, help="Number of transformer blocks")
    parser.add_argument("--block-size", type=int, default=512, help="Context window size")
    parser.add_argument("--num-heads", type=int, default=4, help="Number of attention heads")
    parser.add_argument("--learning-rate", type=float, default=1e-3, help="Learning rate")

    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--epochs", type=int, default=5, help="Number of epochs")
    parser.add_argument(
        "--mode",
        type=str,
        default="pre_training",
        choices=["pre_training", "fine_tuning", "instruction_tuning"],
        help="Training mode",
    )

    parser.add_argument("--data", type=str, required=True, help="Path to training data file")
    parser.add_argument(
        "--output",
        type=str,
        default="models/trained_model.pth",
        help="Output model checkpoint path",
    )
    parser.add_argument(
        "--pretrained",
        type=str,
        default=None,
        help="Path to pre-trained model (for fine-tuning)",
    )

    parser.add_argument(
        "--experiment",
        type=str,
        default=None,
        help="Experiment name (for tracking)",
    )
    parser.add_argument(
        "--log-dir",
        type=str,
        default="logs",
        help="Directory for logs and reports",
    )

    parser.set_defaults(func=train_command)
    return parser


def create_eval_parser(subparsers):
    """Maakt de parser voor het eval commando."""
    parser = subparsers.add_parser(
        "eval",
        help="Evaluate model performance",
        description="Evaluate trained model on validation/test data",
    )

    parser.add_argument("--model", type=str, required=True, help="Path to trained model checkpoint")
    parser.add_argument("--data", type=str, required=True, help="Path to evaluation data")
    parser.add_argument(
        "--config",
        type=str,
        default=None,
        help="Path to config file (if not in model checkpoint)",
    )
    parser.add_argument("--output", type=str, default="metrics_report.json", help="Output metrics file")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size for evaluation")
    parser.add_argument(
        "--device",
        type=str,
        default="auto",
        choices=["cpu", "cuda", "auto"],
        help="Device to use for evaluation",
    )

    parser.set_defaults(func=eval_command)
    return parser


def create_generate_parser(subparsers):
    """Maakt de parser voor het generate commando."""
    parser = subparsers.add_parser(
        "generate",
        help="Generate text from trained model",
        description="Use trained model to generate text",
    )

    parser.add_argument("--model", type=str, required=True, help="Path to trained model checkpoint")
    parser.add_argument("--prompt", type=str, required=True, help="Prompt to generate from")
    parser.add_argument("--length", type=int, default=100, help="Number of tokens to generate")
    parser.add_argument(
        "--temperature",
        type=float,
        default=1.0,
        help="Sampling temperature (higher = more random)",
    )
    parser.add_argument("--num-samples", type=int, default=1, help="Number of samples to generate")
    parser.add_argument(
        "--device",
        type=str,
        default="auto",
        choices=["cpu", "cuda", "auto"],
        help="Device to use for generation",
    )

    parser.set_defaults(func=generate_command)
    return parser


def create_web_api_parser(subparsers):
    """Maakt de parser voor het moderne web-api commando."""
    parser = subparsers.add_parser(
        "web-api",
        help="Start the modern local ArcLM Web API",
        description="Start the optional FastAPI backend for the ArcLM Web UI",
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="Host for the Web API, defaults to 127.0.0.1",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8765,
        help="Port for the Web API, defaults to 8765",
    )
    parser.add_argument(
        "--no-docs",
        action="store_true",
        help="Disable /docs and /openapi.json",
    )
    parser.add_argument(
        "--dataset-root",
        action="append",
        default=[],
        metavar="NAME=PATH",
        help="Approved local dataset root for read-only inspection. Can be repeated.",
    )
    parser.set_defaults(func=web_api_command)
    return parser


def create_security_parser(subparsers):
    """Create parser for safe security commands."""

    parser = subparsers.add_parser(
        "security",
        help="Inspect ArcLM Security Core status",
        description="Run safe local Security Core status and audit commands.",
    )
    security_subparsers = parser.add_subparsers(dest="security_command")
    status = security_subparsers.add_parser("status", help="Print safe security status")
    status.add_argument("--json", action="store_true", help="Print JSON output")
    status.set_defaults(func=security_status_command)
    audit = security_subparsers.add_parser("audit", help="Print security inventory and threat model")
    audit.add_argument("--json", action="store_true", help="Print JSON output")
    audit.set_defaults(func=security_audit_command)
    parser.set_defaults(func=security_status_command)
    return parser


def create_doctor_parser(subparsers):
    """Maakt de parser voor veilige lokale diagnostics."""
    parser = subparsers.add_parser(
        "doctor",
        help="Show safe local ArcLM diagnostics",
        description="Inspect the local ArcLM installation without downloads or optional imports.",
    )
    parser.add_argument("--json", action="store_true", help="Print a JSON-safe diagnostic report.")
    parser.set_defaults(func=doctor_command)
    return parser


def parse_dataset_roots(values):
    """Zet CLI dataset-root waarden om naar WebConfig roots."""
    from arclm.web import DatasetRoot

    roots = []
    for value in values or []:
        if "=" not in value:
            raise ValueError("dataset roots must use NAME=PATH")
        name, path = value.split("=", 1)
        if not name or not path:
            raise ValueError("dataset roots must use NAME=PATH")
        roots.append(DatasetRoot(name=name, path=path))
    return tuple(roots)


def train_command(args):
    """Voert het train commando uit."""
    print("\n" + "=" * 70)
    print("ArcLM Training")
    print("=" * 70)

    # We gebruiken ASCII-tekst, zodat de CLI ook werkt in Windows terminals
    # die geen brede Unicode-codepage gebruiken.
    if args.config:
        print(f"\nLoading config from: {args.config}")
        try:
            config = load_cli_config(args.config)
        except ValueError as exc:
            print(f"Error: {exc}")
            return 1
    else:
        print("\nCreating config from CLI arguments")
        config = Config(
            embed_dim=args.embed_dim,
            num_blocks=args.num_blocks,
            block_size=args.block_size,
            num_heads=args.num_heads,
            learning_rate=args.learning_rate,
            batch_size=args.batch_size,
        )

    print(f"Config loaded: {config.embed_dim}D, {config.num_blocks} blocks")

    print(f"\nStarting training ({args.epochs} epochs)...")
    try:
        config.num_epochs = args.epochs
        result = train_model(
            mode=args.mode,
            data=args.data,
            output=args.output,
            checkpoint=args.pretrained,
            config=config,
        )
        print("Training complete")
        losses = result.history.get("train_losses", [])
        if losses:
            print(f"  - Final loss: {losses[-1]:.4f}")
    except Exception as exc:
        print(f"Training error: {exc}")
        return 1

    if args.experiment:
        log_dir = Path(args.log_dir) / args.experiment
        log_dir.mkdir(parents=True, exist_ok=True)

        log_file = log_dir / "training_log.json"
        with open(log_file, "w") as f:
            json.dump(
                {
                    "model_path": str(result.model_path),
                    "final_loss": float(result.history.get("train_losses", [0.0])[-1]),
                    "epochs": args.epochs,
                },
                f,
                indent=2,
            )
        print(f"Experiment logged: {log_file}")

    print("\n" + "=" * 70 + "\n")
    return 0


def eval_command(args):
    """Voert het eval commando uit."""
    print("\n" + "=" * 70)
    print("ArcLM Evaluation")
    print("=" * 70)

    try:
        print(f"\nLoading model from: {args.model}")
        device_name = resolve_cli_device(args.device)
        model = load_model(args.model, device=device_name)
        print("Model loaded")
    except ValueError as exc:
        print(f"Error: {exc}")
        return 1
    except FileNotFoundError:
        print(f"Error: Model file not found: {args.model}")
        return 1
    except Exception as exc:
        print(f"Error loading model: {exc}")
        return 1

    if args.config:
        try:
            config = load_cli_config(args.config)
        except ValueError as exc:
            print(f"Error: {exc}")
            return 1
    else:
        config_path = Path(args.model).parent / "config.json"
        if config_path.exists():
            config = load_config_json(str(config_path))
        else:
            config = model.config

    try:
        print(f"\nLoading data from: {args.data}")
        with open(args.data, "r") as f:
            text = f.read()

        encoded = encode_text_for_loaded_model(model, text)
        if len(encoded) <= config.block_size:
            raise ValueError(
                "Evaluation data must contain more tokens than the model block size"
            )
        val_loader = create_dataloader(encoded, config.block_size, args.batch_size, shuffle=False)
        print(f"Data loaded: {len(encoded)} tokens")
    except Exception as exc:
        print(f"Error loading data: {exc}")
        return 1

    print("\nEvaluating...")
    try:
        device = torch.device(device_name)
        metrics = calculate_metrics(model.model, val_loader, config, device)

        print("Evaluation complete")
        print(f"  - Perplexity: {metrics.perplexity:.4f}")
        print(f"  - Loss: {metrics.avg_loss:.4f}")
        print(f"  - Accuracy: {metrics.accuracy:.4%}")
        print(f"  - Tokens: {metrics.total_tokens}")
    except Exception as exc:
        print(f"Evaluation error: {exc}")
        return 1

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    export_metrics_to_json(metrics, str(output_path))
    print(f"\nMetrics saved to: {output_path}")

    report_path = output_path.with_suffix(".md")
    export_metrics_to_markdown(metrics, str(report_path))
    print(f"Report saved to: {report_path}")

    print("\n" + "=" * 70 + "\n")
    return 0


def generate_command(args):
    """Voert het generate commando uit."""
    print("\n" + "=" * 70)
    print("ArcLM Text Generation")
    print("=" * 70)

    try:
        print(f"\nLoading model from: {args.model}")
        device_name = resolve_cli_device(args.device)
        model = load_model(args.model, device=device_name)
        print("Model loaded")
    except ValueError as exc:
        print(f"Error: {exc}")
        return 1
    except FileNotFoundError:
        print(f"Error: Model file not found: {args.model}")
        return 1
    except Exception as exc:
        print(f"Error loading model: {exc}")
        return 1

    print(f"\nPrompt: {args.prompt}")
    print(f"Generating {args.length} tokens (temperature={args.temperature})...")

    try:
        for index in range(args.num_samples):
            result = model.predict(
                args.prompt,
                max_new_tokens=args.length,
                temperature=args.temperature,
            )

            if args.num_samples > 1:
                print(f"\n--- Sample {index + 1} ---")
            print(result)
    except Exception as exc:
        print(f"Generation error: {exc}")
        return 1

    print("\n" + "=" * 70 + "\n")
    return 0


def web_api_command(args):
    """Start de moderne lokale Web API."""
    try:
        import uvicorn
        from arclm.web import WebConfig, create_app
    except ModuleNotFoundError as exc:
        if exc.name in {"uvicorn", "fastapi", "starlette", "pydantic"}:
            print(
                "ArcLM Web API requires the optional web dependencies.\n\n"
                "Install them with:\n\n"
                '    pip install "arclm[web]"'
            )
            return 1
        raise

    try:
        config = WebConfig(
            host=args.host,
            port=args.port,
            expose_docs=not args.no_docs,
            dataset_roots=parse_dataset_roots(getattr(args, "dataset_root", ())),
        )
    except Exception as exc:
        print(f"Error: {exc}")
        return 1

    if config.is_remote_binding:
        from arclm.security.configuration import SecurityMode
        from arclm.security.web import WebTransportPolicy, validate_transport_policy

        try:
            validate_transport_policy(
                WebTransportPolicy(mode=SecurityMode.LOCAL_SECURE, host=config.host, tls_enabled=False)
            )
        except Exception as exc:
            print(f"Error: {exc}")
            return 1

    app = create_app(config)
    uvicorn.run(app, host=config.host, port=config.port)
    return 0


def security_status_command(args):
    """Print safe Security Core status."""

    from arclm.security import security_status

    status = security_status()
    if getattr(args, "json", False):
        print(json.dumps(status, indent=2, sort_keys=True))
    else:
        print(f"Security mode: {status['mode']}")
        print(f"Encryption available: {status['encryption']['available']}")
        print(f"Signing available: {status['signing']['available']}")
        for warning in status.get("warnings", []):
            print(f"Warning: {warning}", file=sys.stderr)
    return 0


def security_audit_command(args):
    """Print safe security inventory and threat model."""

    from arclm.security import security_inventory, threat_model

    payload = {
        "inventory": [item.to_dict() for item in security_inventory()],
        "threat_model": [item.to_dict() for item in threat_model()],
    }
    if getattr(args, "json", False):
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        print("Security inventory")
        for item in payload["inventory"]:
            print(f"- {item['asset']}: {item['sensitivity']} ({item['owner_subsystem']})")
        print("Threat model")
        for item in payload["threat_model"]:
            print(f"- {item['threat']}: {item['mitigation']}")
    return 0


def doctor_command(args):
    """Print safe native diagnostics for release-readiness checks."""
    report = build_runtime_diagnostics(include_paths=True)
    if args.json:
        print(runtime_diagnostics_json(report))
    else:
        print(format_runtime_diagnostics(report))
    return 0


def version_command(_args):
    """Print the installed ArcLM version."""

    import arclm

    print(arclm.__version__)
    return 0


def info_command(args):
    """Print safe package and runtime information."""

    report = build_runtime_diagnostics(include_paths=True)
    payload = report.to_dict()
    if args.json:
        _print_json(payload)
    else:
        print(format_runtime_diagnostics(report))
    return 0


def config_validate_command(args):
    """Validate a typed ArcLM JSON/TOML config."""

    from arclm.config_schema import validate_arclm_config

    config = validate_arclm_config(
        args.config,
        permissive=args.permissive,
        allow_env=args.allow_env,
    )
    payload = {
        "valid": True,
        "schema_version": config.schema_version,
        "config": config.to_dict(redact=True),
    }
    _print_json(payload) if args.json else print(f"valid schema_version={config.schema_version}")
    return 0


def config_show_command(args):
    """Show the effective typed ArcLM config."""

    from arclm.config_schema import load_arclm_config

    config = load_arclm_config(
        args.config,
        permissive=args.permissive,
        allow_env=args.allow_env,
    )
    _print_json(config.to_dict(redact=not args.show_secrets))
    return 0


def config_migrate_command(args):
    """Migrate an older ArcLM config to the current schema."""

    from arclm.config_schema import migrate_config

    report = migrate_config(
        args.config,
        target_version=args.target_version,
        output=args.output,
        permissive=args.permissive,
    )
    _print_json(report.to_dict()) if args.json else print(
        f"{report.source_schema_version} -> {report.target_schema_version}"
    )
    return 0


def _load_records(path, format_name):
    from arclm.data_sources import open_dataset

    return list(open_dataset(path, format=format_name, streaming=True, malformed="raise"))


def data_validate_command(args):
    """Validate records with the schema-backed Phase 3 validator."""

    from arclm.schemas import validate_records

    records = _load_records(args.input, args.format)
    report = validate_records(
        records,
        schema=args.schema,
        strict=args.strict,
        allow_empty=args.allow_empty,
        check_duplicates=args.check_duplicates,
        duplicate_field=args.duplicate_field,
    )
    if args.json:
        _print_json(report.to_dict())
    else:
        print(report.summary())
        for issue in report.errors[:10]:
            print(f"error record={issue.index} field={issue.field} category={issue.category}: {issue.message}")
        for issue in report.warnings[:10]:
            print(f"warning record={issue.index} field={issue.field} category={issue.category}: {issue.message}")
    return 0 if report.is_valid else 1


def data_analyze_command(args):
    """Analyze dataset quality without exposing raw samples by default."""

    from arclm.data_quality import analyze_dataset
    from arclm.data_sources import open_dataset

    dataset = open_dataset(args.input, format=args.format, streaming=True, malformed=args.malformed)
    report = analyze_dataset(
        dataset,
        schema=args.schema,
        checks=args.checks,
        include_samples=args.include_samples,
        redact_samples=not args.no_redact_samples,
        max_sample_chars=args.max_sample_chars,
    )
    _print_json(report.to_dict()) if args.json else print(report.summary())
    return 0 if not report.errors else 1


def data_split_command(args):
    """Split records deterministically."""

    from arclm.data_quality import split_dataset
    from arclm.data_sources import open_dataset

    dataset = open_dataset(args.input, format=args.format, streaming=True, malformed=args.malformed)
    result = split_dataset(
        dataset,
        train=args.train,
        validation=args.validation,
        test=args.test,
        seed=args.seed,
        strategy=args.strategy,
        key=args.key,
        group_key=args.group_key,
        split_field=args.split_field,
    )
    _print_json(result.to_dict()) if args.json else print(result.report.to_dict())
    return 0


def data_shard_command(args):
    """Shard records deterministically."""

    from arclm.data_quality import shard_dataset
    from arclm.data_sources import open_dataset

    dataset = open_dataset(args.input, format=args.format, streaming=True, malformed=args.malformed)
    result = shard_dataset(
        dataset,
        num_shards=args.num_shards,
        strategy=args.strategy,
        key=args.key,
        seed=args.seed,
    )
    _print_json(result.to_dict()) if args.json else print(result.report.to_dict())
    return 0


def data_fingerprint_command(args):
    """Fingerprint a dataset file or directory."""

    from arclm.reproducibility import fingerprint

    report = fingerprint(Path(args.input), mode=args.mode)
    _print_json(report.to_dict()) if args.json else print(report.value)
    return 0


def workflow_run_command(args):
    """Run a configuration-driven workflow."""

    from arclm.workflow import run_workflow

    result = run_workflow(args.config, dry_run=args.dry_run, stages=args.stage)
    _print_json(result.to_dict()) if args.json else print(f"{result.status}: {result.run_dir}")
    return 0 if result.status in {"completed", "dry_run"} else 1


def runs_list_command(args):
    """List local run directories."""

    from arclm.runs import list_runs

    rows = list_runs(args.output_dir)
    _print_json(rows) if args.json else print("\n".join(row.get("path", "") for row in rows))
    return 0


def runs_inspect_command(args):
    """Inspect one run directory."""

    from arclm.runs import inspect_run

    _print_json(inspect_run(args.path))
    return 0


def cache_inspect_command(args):
    """Inspect the JSON tokenization cache."""

    from arclm.cache import inspect_cache

    _print_json(inspect_cache(args.cache_dir).to_dict())
    return 0


def cache_clear_command(args):
    """Clear the JSON tokenization cache."""

    from arclm.cache import clear_cache

    _print_json(clear_cache(args.cache_dir, key=args.key).to_dict())
    return 0


def _add_data_common(parser):
    parser.add_argument("input")
    parser.add_argument("--format", default=None, choices=["json", "jsonl", "csv", "txt"])
    parser.add_argument("--json", action="store_true")
    return parser


def _add_validation_options(parser):
    parser.add_argument("--schema", required=True, choices=["text", "prompt_completion", "instruction", "conversation"])
    parser.add_argument("--strict", action="store_true")
    parser.add_argument("--allow-empty", action="store_true")
    parser.add_argument("--check-duplicates", action="store_true")
    parser.add_argument("--duplicate-field")
    return parser


def create_version_parser(subparsers):
    parser = subparsers.add_parser("version", help="Print ArcLM version")
    parser.set_defaults(func=version_command)
    return parser


def create_info_parser(subparsers):
    parser = subparsers.add_parser("info", help="Print safe runtime information")
    parser.add_argument("--json", action="store_true")
    parser.set_defaults(func=info_command)
    return parser


def create_config_schema_parser(subparsers):
    parser = subparsers.add_parser("config", help="Validate, show, and migrate typed ArcLM configs")
    config_sub = parser.add_subparsers(dest="config_command", required=True)

    validate = config_sub.add_parser("validate", help="Validate an ArcLM JSON/TOML config")
    validate.add_argument("config")
    validate.add_argument("--json", action="store_true")
    validate.add_argument("--permissive", action="store_true")
    validate.add_argument("--allow-env", action="store_true")
    validate.set_defaults(func=config_validate_command)

    show = config_sub.add_parser("show", help="Show effective typed configuration")
    show.add_argument("config")
    show.add_argument("--permissive", action="store_true")
    show.add_argument("--allow-env", action="store_true")
    show.add_argument("--show-secrets", action="store_true")
    show.set_defaults(func=config_show_command)

    migrate = config_sub.add_parser("migrate", help="Migrate an older ArcLM config")
    migrate.add_argument("config")
    migrate.add_argument("--output")
    migrate.add_argument("--target-version", default="1")
    migrate.add_argument("--json", action="store_true")
    migrate.add_argument("--permissive", action="store_true")
    migrate.set_defaults(func=config_migrate_command)
    return parser


def create_data_tools_parser(subparsers):
    parser = subparsers.add_parser("data", help="Dataset validation, analysis, split, shard, and fingerprint tools")
    data_sub = parser.add_subparsers(dest="data_command", required=True)

    validate = _add_data_common(data_sub.add_parser("validate", help="Validate records"))
    _add_validation_options(validate)
    validate.set_defaults(func=data_validate_command)

    analyze = _add_data_common(data_sub.add_parser("analyze", help="Analyze dataset quality"))
    analyze.add_argument("--schema", choices=["text", "prompt_completion", "instruction", "conversation"])
    analyze.add_argument("--checks", nargs="*")
    analyze.add_argument("--malformed", default="raise", choices=["raise", "report"])
    analyze.add_argument("--include-samples", action="store_true")
    analyze.add_argument("--no-redact-samples", action="store_true")
    analyze.add_argument("--max-sample-chars", type=int, default=120)
    analyze.set_defaults(func=data_analyze_command)

    split = _add_data_common(data_sub.add_parser("split", help="Deterministically split records"))
    split.add_argument("--malformed", default="raise", choices=["raise", "report"])
    split.add_argument("--train", type=float, default=0.8)
    split.add_argument("--validation", type=float, default=0.1)
    split.add_argument("--test", type=float, default=0.1)
    split.add_argument("--strategy", default="hash", choices=["hash", "random", "chronological"])
    split.add_argument("--key")
    split.add_argument("--group-key")
    split.add_argument("--split-field")
    split.add_argument("--seed", type=int, default=42)
    split.set_defaults(func=data_split_command)

    shard = _add_data_common(data_sub.add_parser("shard", help="Deterministically shard records"))
    shard.add_argument("--malformed", default="raise", choices=["raise", "report"])
    shard.add_argument("--num-shards", type=int, required=True)
    shard.add_argument("--strategy", default="contiguous", choices=["contiguous", "round_robin", "hash"])
    shard.add_argument("--key")
    shard.add_argument("--seed", type=int, default=0)
    shard.set_defaults(func=data_shard_command)

    fingerprint_parser = data_sub.add_parser("fingerprint", help="Fingerprint a dataset file or directory")
    fingerprint_parser.add_argument("input")
    fingerprint_parser.add_argument("--mode", default="content", choices=["content", "metadata", "sampled"])
    fingerprint_parser.add_argument("--json", action="store_true")
    fingerprint_parser.set_defaults(func=data_fingerprint_command)
    return parser


def create_workflow_parser(subparsers):
    parser = subparsers.add_parser("run", help="Run a configuration-driven ArcLM workflow")
    parser.add_argument("config")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--stage", action="append")
    parser.add_argument("--json", action="store_true")
    parser.set_defaults(func=workflow_run_command)
    return parser


def create_runs_parser(subparsers):
    parser = subparsers.add_parser("runs", help="Inspect local ArcLM runs")
    runs_sub = parser.add_subparsers(dest="runs_command", required=True)
    runs_list = runs_sub.add_parser("list")
    runs_list.add_argument("--output-dir", default="runs")
    runs_list.add_argument("--json", action="store_true")
    runs_list.set_defaults(func=runs_list_command)
    runs_inspect = runs_sub.add_parser("inspect")
    runs_inspect.add_argument("path")
    runs_inspect.set_defaults(func=runs_inspect_command)
    return parser


def create_cache_parser(subparsers):
    parser = subparsers.add_parser("cache", help="Inspect and clear ArcLM caches")
    cache_sub = parser.add_subparsers(dest="cache_command", required=True)
    inspect_parser = cache_sub.add_parser("inspect")
    inspect_parser.add_argument("cache_dir")
    inspect_parser.set_defaults(func=cache_inspect_command)
    clear_parser = cache_sub.add_parser("clear")
    clear_parser.add_argument("cache_dir")
    clear_parser.add_argument("--key")
    clear_parser.set_defaults(func=cache_clear_command)
    return parser


def run_command(args):
    """Voert package runtime helpers uit."""
    if args.run in {"simple-interface", "simple_interface"}:
        try:
            from arclm.simple_interface import run_simple_interface
        except ModuleNotFoundError as exc:
            if exc.name == "flask":
                print(
                    "The simple interface requires Flask. "
                    "Install it with: pip install arclm[web]"
                )
                return 1
            raise

        run_simple_interface(
            host=args.host,
            port=args.port,
            debug=args.debug,
        )
        return 0

    print(f"Unknown runtime target: {args.run}")
    return 1


def main():
    """Start de CLI en geeft de exitcode terug."""
    configure_cli_streams()

    parser = argparse.ArgumentParser(
        prog="arclm",
        description="ArcLM - command-line tools for training and inference",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  arclm train --config config.yaml --data data.txt --output models/model.pth
  arclm eval --model models/model.pth --data test.txt
  arclm generate --model models/model.pth --prompt "The future is"
  arclm doctor
  python -m arclm web-api
  python -m arclm --run simple-interface
        """,
    )

    parser.add_argument(
        "--version",
        action="version",
        version="{} ArcLM".format(__import__("arclm").__version__),
    )
    parser.add_argument(
        "--run",
        choices=["simple-interface", "simple_interface"],
        help="Run an ArcLM runtime helper such as the simple web interface",
    )
    parser.add_argument(
        "--host",
        default=None,
        help="Host for --run simple-interface, defaults to HOST or 127.0.0.1",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=None,
        help="Port for --run simple-interface, defaults to PORT or 5000",
    )
    debug_group = parser.add_mutually_exclusive_group()
    debug_group.add_argument(
        "--debug",
        dest="debug",
        action="store_true",
        default=None,
        help="Enable Flask debug mode for --run simple-interface",
    )
    debug_group.add_argument(
        "--no-debug",
        dest="debug",
        action="store_false",
        help="Disable Flask debug mode for --run simple-interface",
    )

    subparsers = parser.add_subparsers(title="commands", dest="command")

    create_version_parser(subparsers)
    create_init_parser(subparsers)
    create_info_parser(subparsers)
    create_train_parser(subparsers)
    create_eval_parser(subparsers)
    create_generate_parser(subparsers)
    create_web_api_parser(subparsers)
    create_security_parser(subparsers)
    create_doctor_parser(subparsers)
    create_config_schema_parser(subparsers)
    create_data_tools_parser(subparsers)
    create_workflow_parser(subparsers)
    create_runs_parser(subparsers)
    create_cache_parser(subparsers)

    args = parser.parse_args()

    if args.run:
        return run_command(args)

    if not hasattr(args, "func"):
        parser.print_help()
        return 0

    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
