"""Build the self-contained public ArcLM documentation website.

The generator keeps maintainer verification concerns out of the generated
website. Public output contains explanations, imports, examples, limitations
and status labels only.
"""

from __future__ import annotations

import json
import inspect
import re
import shutil
import sys
from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "documentation-site"
SRC = ROOT / "src"

if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

STATUSES = ["Stable", "Validated", "Beta", "Experimental", "Integration-compatible", "Internal", "Deprecated", "Planned", "Unsupported"]
MODEL_STATUSES = ["native", "tested", "compatible", "experimental", "unsupported"]

PUBLIC_MODULE_SPECS = {
    "arclm": ("Stable", "Root lazy public API for common ArcLM names.", "Use for short imports and compatibility aliases.", "None"),
    "arclm.datasets": ("Stable", "Dataset loading, validation, reporting, cleaning and streaming helpers.", "Use for local records and dataset preparation.", "Optional preprocess helpers for HTML/YAML paths."),
    "arclm.tokenizers": ("Stable", "Native word and SentencePiece tokenizer public API.", "Use to build vocabularies and encode/decode text.", "sentencepiece"),
    "arclm.models": ("Stable", "Native ArcLM model and model capability reporting.", "Use to create compact causal language models.", "None"),
    "arclm.training": ("Stable", "Native training configuration, trainer, callbacks and compatibility helpers.", "Use for CPU/CUDA bounded native training.", "torch"),
    "arclm.finetuning": ("Beta", "Supervised fine-tuning formatting, validation, labels and trainer helpers.", "Use for SFT preview and execution.", "Optional Hugging Face/PEFT for external paths."),
    "arclm.checkpoints": ("Stable", "Checkpoint loading, inspection, adaptation and compatibility helpers.", "Use for trusted local checkpoint workflows.", "None"),
    "arclm.evaluation": ("Stable", "Metrics, evaluation reports, diagnostics and small benchmark helpers.", "Use for local metrics and comparison reports.", "None"),
    "arclm.inference": ("Beta", "Generation plus native/external model loading boundaries.", "Use for bounded local generation and inspected loading.", "Optional Hugging Face stack for external models."),
    "arclm.inspection": ("Beta", "Pipeline trace helpers for one native model step.", "Use to explain token IDs, shapes and generated text.", "None"),
    "arclm.agents": ("Beta", "Provider-independent Agent Runtime with tools, sessions, tracing and permissions.", "Use for deterministic local tool loops and adapters.", "Optional audio/web integrations."),
    "arclm.security": ("Beta", "Security Core policies, hashing, signatures, encryption envelopes and redaction.", "Use for local secure metadata and artifact policy.", "cryptography"),
    "arclm.web": ("Beta", "Local Web Studio backend app and settings.", "Use for the optional local visual workflow.", "fastapi, uvicorn"),
    "arclm.peft": ("Experimental", "Native and optional PEFT adapter utilities.", "Use only with validated model/hardware combinations.", "peft, transformers, bitsandbytes for QLoRA paths."),
    "arclm.plugins": ("Experimental", "Plugin metadata and extension helpers.", "Use for advanced extension planning.", "None"),
    "arclm.registry": ("Experimental", "Registry helper surfaces.", "Use for advanced extension points.", "None"),
    "arclm.configs": ("Deprecated", "Compatibility configuration exports.", "Prefer domain configuration objects.", "None"),
    "arclm.exceptions": ("Stable", "Public exception compatibility namespace.", "Use for catching documented ArcLM errors.", "None"),
}

CATEGORY_BY_MODULE = {
    "arclm": "root",
    "arclm.datasets": "datasets",
    "arclm.tokenizers": "tokenizers",
    "arclm.models": "models",
    "arclm.training": "training",
    "arclm.finetuning": "finetuning",
    "arclm.checkpoints": "checkpoints",
    "arclm.evaluation": "evaluation",
    "arclm.inference": "inference",
    "arclm.inspection": "inspection",
    "arclm.agents": "agents",
    "arclm.security": "security",
    "arclm.web": "web",
    "arclm.peft": "peft",
    "arclm.plugins": "plugins",
    "arclm.registry": "registry",
    "arclm.configs": "configuration",
    "arclm.exceptions": "errors",
}

DEPRECATED_NAMES = {
    "MiniGPT",
    "checkpoint_is_compatible_for_tuining",
    "arclm.configs",
}

INTERNAL_VERIFICATION = {
    "datasets": {"status": "verified"},
    "tokenizers": {"status": "verified"},
    "native-model": {"status": "verified"},
    "training": {"status": "verified"},
    "inspection": {"status": "verified"},
    "studio": {"status": "verified"},
}


def clean() -> None:
    if SITE.exists():
        for child in SITE.iterdir():
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
    for path in [
        SITE / "guides",
        SITE / "api",
        SITE / "examples",
        SITE / "reference",
        SITE / "data",
        SITE / "assets" / "examples",
        SITE / "assets" / "datasets",
        SITE / "assets" / "diagrams",
        SITE / "assets" / "icons",
    ]:
        path.mkdir(parents=True, exist_ok=True)


def page(id_: str, title: str, group: str, href: str, summary: str, sections: list[dict], *, status: str = "Stable") -> dict:
    return {"id": id_, "title": title, "group": group, "href": href, "summary": summary, "sections": sections, "status": status}


def text_section(title: str, body: str) -> dict:
    return {"title": title, "body": dedent(body).strip()}


def code_section(title: str, code: str, language: str = "python", filename: str | None = None) -> dict:
    section = {"title": title, "body": "", "code": dedent(code).strip(), "language": language}
    if filename:
        section["filename"] = filename
    return section


def table_section(title: str, columns: list[str], rows: list[list[str]]) -> dict:
    return {"title": title, "body": "", "table": {"columns": columns, "rows": rows}}


def list_section(title: str, items: list[str]) -> dict:
    return {"title": title, "body": "", "items": items}


def api_usage(name: str) -> str:
    for entry in API_CATALOG:
        if entry["name"] == name:
            return entry["usage"]
    raise KeyError(f"Unknown API entry: {name}")


def _first_sentence(text: str | None, fallback: str) -> str:
    clean = " ".join((text or "").strip().split())
    if not clean:
        return fallback
    match = re.match(r"(.+?[.!?])(?:\s|$)", clean)
    return match.group(1) if match else clean[:220]


def _safe_signature(obj) -> str:
    try:
        return f"{getattr(obj, '__name__', type(obj).__name__)}{inspect.signature(obj)}"
    except (TypeError, ValueError):
        return f"{getattr(obj, '__name__', type(obj).__name__)}(...)"


def _kind(obj) -> str:
    if inspect.isclass(obj):
        return "exception" if issubclass(obj, BaseException) else "class"
    if inspect.iscoroutinefunction(obj):
        return "async function"
    if inspect.isfunction(obj):
        return "function"
    return "constant"


def _parameter_rows(obj) -> list[list[str]]:
    try:
        signature = inspect.signature(obj)
    except (TypeError, ValueError):
        return []
    rows: list[list[str]] = []
    for name, param in signature.parameters.items():
        annotation = "Any" if param.annotation is inspect._empty else getattr(param.annotation, "__name__", str(param.annotation))
        default = "required" if param.default is inspect._empty else repr(param.default)
        rows.append([name, annotation, default])
    return rows


def _class_members(obj) -> list[list[str]]:
    rows: list[list[str]] = []
    if not inspect.isclass(obj):
        return rows
    for name, member in inspect.getmembers(obj):
        if name.startswith("_"):
            continue
        if inspect.isfunction(member) or inspect.ismethod(member):
            rows.append([f"{name}{_member_signature(member)}", _first_sentence(getattr(member, "__doc__", ""), "Public method.")])
        if len(rows) >= 12:
            break
    return rows


def _member_signature(member) -> str:
    try:
        return str(inspect.signature(member))
    except (TypeError, ValueError):
        return "(...)"


def _usage_for(module_name: str, symbol_name: str, kind: str) -> str:
    if kind == "class":
        return f"from {module_name} import {symbol_name}\n\nprint({symbol_name})"
    if kind == "exception":
        return f"from {module_name} import {symbol_name}\n\ntry:\n    raise {symbol_name}(\"example\")\nexcept {symbol_name} as exc:\n    print(type(exc).__name__)"
    if kind == "constant":
        return f"from {module_name} import {symbol_name}\n\nprint({symbol_name})"
    return f"from {module_name} import {symbol_name}\n\nprint({symbol_name})"


def _status_for(module_name: str, symbol_name: str, obj) -> str:
    if symbol_name in DEPRECATED_NAMES or "deprecated" in (inspect.getdoc(obj) or "").lower():
        return "Deprecated"
    return PUBLIC_MODULE_SPECS.get(module_name, ("Beta", "", "", ""))[0]


def _category_for(module_name: str) -> str:
    return CATEGORY_BY_MODULE.get(module_name, module_name.rsplit(".", 1)[-1])


def build_api_catalog() -> list[dict]:
    entries: list[dict] = []
    seen: set[tuple[str, str]] = set()
    for module_name in PUBLIC_MODULE_SPECS:
        try:
            module = __import__(module_name, fromlist=["__all__"])
        except Exception:
            continue
        for symbol_name in getattr(module, "__all__", []):
            key = (module_name, symbol_name)
            if key in seen:
                continue
            seen.add(key)
            try:
                obj = getattr(module, symbol_name)
            except Exception:
                continue
            kind = _kind(obj)
            summary = _first_sentence(inspect.getdoc(obj), f"Public {kind} exported by {module_name}.")
            qualified_name = f"{module_name}.{symbol_name}"
            entries.append(
                {
                    "name": symbol_name,
                    "qualifiedName": qualified_name,
                    "importPath": qualified_name,
                    "canonicalImport": f"from {module_name} import {symbol_name}",
                    "alternativeImport": f"from arclm import {symbol_name}" if module_name != "arclm" and hasattr(__import__("arclm"), symbol_name) else "",
                    "kind": kind,
                    "category": _category_for(module_name),
                    "status": _status_for(module_name, symbol_name, obj),
                    "signature": _safe_signature(obj) if kind != "constant" else symbol_name,
                    "summary": summary,
                    "parameters": _parameter_rows(obj),
                    "returns": "See the function or class docstring and type annotations.",
                    "errors": ["Raises documented subsystem errors for invalid inputs or missing optional dependencies."],
                    "sideEffects": "May allocate tensors, read local files or mutate configured local state depending on the API.",
                    "optionalDependencies": PUBLIC_MODULE_SPECS.get(module_name, ("", "", "", "None"))[3],
                    "threadAsync": "Synchronous unless the symbol name or signature explicitly indicates async behavior.",
                    "security": "Use local trusted paths and documented Security Core policies for sensitive data.",
                    "limitations": "Status label and subsystem guide describe the stable boundary.",
                    "usage": _usage_for(module_name, symbol_name, kind),
                    "members": _class_members(obj),
                }
            )
    return sorted(entries, key=lambda item: (item["category"], item["kind"], item["name"].lower(), item["qualifiedName"]))


def build_module_catalog() -> list[dict]:
    rows: list[dict] = []
    for module_name, (status, purpose, when_to_use, optional) in PUBLIC_MODULE_SPECS.items():
        try:
            module = __import__(module_name, fromlist=["__all__"])
            exports = sorted(getattr(module, "__all__", []))
        except Exception:
            exports = []
        rows.append(
            {
                "importPath": module_name,
                "status": status,
                "purpose": purpose,
                "whenToUse": when_to_use,
                "optionalDependencies": optional,
                "exports": exports,
                "exportCount": len(exports),
                "examples": examples_for_category(_category_for(module_name)),
                "limitations": "Documented as public only through package exports, public tests, verified examples or explicit policy.",
            }
        )
    return rows


def examples_for_category(category: str) -> list[str]:
    mapping = {
        "datasets": ["01_data"],
        "tokenizers": ["02_tokenizers"],
        "models": ["03_models"],
        "training": ["04_training"],
        "finetuning": ["05_finetuning"],
        "checkpoints": ["06_checkpoints"],
        "evaluation": ["07_evaluation_benchmarks"],
        "inference": ["08_inference_local_models"],
        "inspection": ["09_pipelines_inspection"],
        "agents": ["10_agents_tools"],
        "security": ["11_security"],
    }
    prefixes = mapping.get(category, [])
    return [entry.get("title", "") for entry in read_examples_manifest() if any(str(entry.get("path") or "").startswith(prefix) for prefix in prefixes)]


def read_examples_manifest() -> list[dict]:
    manifest_path = ROOT / "examples" / "manifest.json"
    if not manifest_path.exists():
        return []
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    return data.get("entries", data if isinstance(data, list) else [])


def _difficulty(entry: dict) -> str:
    category = entry.get("category", "")
    if category in {"quick_start", "data", "tokenizers", "models"}:
        return "Beginner"
    if category in {"training", "finetuning", "checkpoints", "evaluation_benchmarks", "inference_local_models"}:
        return "Intermediate"
    return "Advanced"


def _tags(entry: dict) -> list[str]:
    tags = [entry.get("category", "").replace("_", " ").title()]
    title = entry.get("title", "")
    for word in ["Dataset", "Tokenizer", "Model", "Training", "Fine-Tuning", "Checkpoint", "Evaluation", "Benchmark", "Generation", "Inspection", "Agent", "Security", "Project"]:
        if word.lower().replace("-", " ") in title.lower().replace("-", " "):
            tags.append(word)
    return sorted(set(tag for tag in tags if tag))


def build_examples_catalog() -> tuple[list[dict], list[dict]]:
    examples: list[dict] = []
    projects: list[dict] = []
    for entry in read_examples_manifest():
        path = str(entry.get("path") or "")
        source = ROOT / "examples" / path
        code = source.read_text(encoding="utf-8") if source.exists() and source.suffix == ".py" else ""
        download = "assets/examples/current/" + (path.replace("\\", "/") if path else f"{entry.get('id', 'manual-optional')}.py")
        item = {
            "id": entry.get("id", slug(path)),
            "title": entry.get("title", path),
            "difficulty": _difficulty(entry),
            "status": entry.get("status", "manual_optional"),
            "category": entry.get("category", ""),
            "teaches": entry.get("title", "ArcLM example."),
            "runtime": f"about {entry.get('estimated_seconds', 10)} seconds",
            "device": "CPU" if not entry.get("requires_gpu") else "GPU",
            "network": "required" if entry.get("requires_network") else "not required",
            "downloadRequired": bool(entry.get("requires_download")),
            "optionalDependencies": entry.get("optional_dependencies", []),
            "command": f"python examples/run_examples.py run {entry.get('id')}",
            "tags": _tags(entry),
            "download": download,
            "code": code or f"import arclm\n\n# Manual optional example: {entry.get('title', path)}\nprint(arclm.__version__)",
            "expectedOutput": "JSON or text summary printed by the example runner.",
        }
        examples.append(item)
        if entry.get("category") == "complete_projects":
            projects.append(
                {
                    "id": item["id"],
                    "title": item["title"],
                    "difficulty": item["difficulty"],
                    "goal": item["teaches"],
                    "files": [path],
                    "dataset": "Tiny local fixture or inline synthetic data.",
                    "tokenizer": "Native tokenizer unless the example states otherwise.",
                    "modelConfiguration": "Tiny native ArcLM configuration for verified projects.",
                    "trainingConfiguration": "Bounded CPU/local run when runnable.",
                    "expectedOutput": item["expectedOutput"],
                    "download": download,
                }
            )
    return examples, projects


def public_api_summary(api_catalog: list[dict]) -> dict:
    return {
        "modules": len(PUBLIC_MODULE_SPECS),
        "classes": sum(1 for item in api_catalog if item["kind"] == "class"),
        "functions": sum(1 for item in api_catalog if item["kind"] in {"function", "async function"}),
        "configuration": sum(1 for item in api_catalog if "Config" in item["name"] or item["name"].endswith("Policy")),
        "errors": sum(1 for item in api_catalog if item["kind"] == "exception"),
        "deprecated": sum(1 for item in api_catalog if item["status"] == "Deprecated"),
    }


NAVIGATION = [
    {
        "group": "Start",
        "items": [
            {"id": "overview", "title": "Overview", "href": "index.html"},
            {"id": "installation", "title": "Installation", "href": "installation.html"},
            {"id": "getting-started", "title": "Quick Start", "href": "getting-started.html"},
            {"id": "architecture", "title": "Architecture", "href": "architecture.html"},
            {"id": "workflows", "title": "Workflows", "href": "workflows.html"},
        ],
    },
    {
        "group": "Learn",
        "items": [
            {"id": "guide-datasets", "title": "Datasets", "href": "guides/datasets.html"},
            {"id": "guide-tokenizers", "title": "Tokenizers", "href": "guides/tokenizers.html"},
            {"id": "guide-models", "title": "Models", "href": "guides/models.html"},
            {"id": "guide-training", "title": "Training", "href": "guides/training.html"},
            {"id": "guide-fine-tuning", "title": "Fine-Tuning", "href": "guides/fine-tuning.html"},
            {"id": "guide-peft-lora", "title": "PEFT and LoRA", "href": "guides/peft-lora.html"},
            {"id": "guide-checkpoints", "title": "Checkpoints", "href": "guides/checkpoints.html"},
            {"id": "guide-evaluation", "title": "Evaluation", "href": "guides/evaluation.html"},
            {"id": "guide-inference", "title": "Inference", "href": "guides/inference.html"},
            {"id": "guide-generation", "title": "Generation", "href": "guides/generation.html"},
            {"id": "guide-inspection", "title": "Inspection", "href": "guides/inspection.html"},
            {"id": "guide-pipelines", "title": "Pipelines", "href": "guides/pipelines.html"},
            {"id": "guide-agents", "title": "Agent Runtime", "href": "guides/agent-runtime.html"},
            {"id": "guide-agent-tools", "title": "Agent Tools", "href": "guides/agent-tools.html"},
            {"id": "guide-security", "title": "Security", "href": "guides/security.html"},
            {"id": "guide-external-models", "title": "External Models", "href": "guides/external-models.html"},
        ],
    },
    {
        "group": "Use",
        "items": [
            {"id": "guide-cli", "title": "CLI", "href": "guides/cli.html"},
            {"id": "guide-web-studio", "title": "ArcLM Studio", "href": "guides/web-studio.html"},
            {"id": "supported-models", "title": "Supported Models", "href": "reference/supported-models.html"},
            {"id": "dataset-formats", "title": "Dataset Formats", "href": "reference/dataset-formats.html"},
            {"id": "guide-lab", "title": "Lab", "href": "guides/lab.html"},
        ],
    },
    {
        "group": "Examples",
        "items": [
            {"id": "examples-index", "title": "Example Index", "href": "examples/index.html"},
            {"id": "examples-datasets", "title": "Dataset Examples", "href": "examples/dataset-examples.html"},
            {"id": "examples-tokenizers", "title": "Tokenizer Examples", "href": "examples/tokenizer-examples.html"},
            {"id": "examples-models", "title": "Model Examples", "href": "examples/model-examples.html"},
            {"id": "examples-training", "title": "Training Examples", "href": "examples/training-examples.html"},
            {"id": "examples-evaluation", "title": "Evaluation Examples", "href": "examples/evaluation-examples.html"},
            {"id": "examples-generation", "title": "Generation Examples", "href": "examples/generation-examples.html"},
            {"id": "examples-agents", "title": "Agent Examples", "href": "examples/agent-examples.html"},
            {"id": "examples-security", "title": "Security Examples", "href": "examples/security-examples.html"},
            {"id": "examples-complete", "title": "Complete Projects", "href": "examples/complete-projects.html"},
        ],
    },
    {
        "group": "Reference",
        "items": [
            {"id": "api-index", "title": "Public API", "href": "api/index.html"},
            {"id": "api-root", "title": "Root API", "href": "api/root.html"},
            {"id": "api-datasets", "title": "Dataset API", "href": "api/datasets.html"},
            {"id": "api-tokenizers", "title": "Tokenizer API", "href": "api/tokenizers.html"},
            {"id": "api-models", "title": "Model API", "href": "api/models.html"},
            {"id": "api-training", "title": "Training API", "href": "api/training.html"},
            {"id": "api-finetuning", "title": "Fine-Tuning API", "href": "api/finetuning.html"},
            {"id": "api-checkpoints", "title": "Checkpoint API", "href": "api/checkpoints.html"},
            {"id": "api-evaluation", "title": "Evaluation API", "href": "api/evaluation.html"},
            {"id": "api-inference", "title": "Inference API", "href": "api/inference.html"},
            {"id": "api-inspection", "title": "Inspection API", "href": "api/inspection.html"},
            {"id": "api-agents", "title": "Agent API", "href": "api/agents.html"},
            {"id": "api-security", "title": "Security API", "href": "api/security.html"},
            {"id": "api-peft", "title": "PEFT API", "href": "api/peft.html"},
            {"id": "api-web", "title": "Web API", "href": "api/web.html"},
            {"id": "api-plugins", "title": "Plugins API", "href": "api/plugins.html"},
            {"id": "api-registry", "title": "Registry API", "href": "api/registry.html"},
            {"id": "api-configuration", "title": "Configuration API", "href": "api/configuration.html"},
            {"id": "api-errors", "title": "Errors API", "href": "api/errors.html"},
            {"id": "api-utilities", "title": "Utilities API", "href": "api/utilities.html"},
            {"id": "modules", "title": "Module Explorer", "href": "reference/modules.html"},
            {"id": "classes", "title": "Class Index", "href": "reference/classes.html"},
            {"id": "functions", "title": "Function Index", "href": "reference/functions.html"},
            {"id": "configuration", "title": "Configuration", "href": "reference/configuration.html"},
            {"id": "errors", "title": "Errors", "href": "reference/errors.html"},
            {"id": "optional-dependencies", "title": "Optional Dependencies", "href": "reference/optional-dependencies.html"},
            {"id": "compatibility", "title": "Compatibility", "href": "reference/compatibility.html"},
            {"id": "deprecated-apis", "title": "Deprecated APIs", "href": "reference/deprecated-apis.html"},
            {"id": "status-legend", "title": "Status Legend", "href": "reference/status-legend.html"},
            {"id": "limitations", "title": "Limitations", "href": "reference/limitations.html"},
        ],
    },
    {
        "group": "Contributing",
        "items": [
            {"id": "contributing-architecture", "title": "Architecture", "href": "contributing/architecture.html"},
            {"id": "contributing-testing", "title": "Testing", "href": "contributing/testing.html"},
            {"id": "contributing-docs", "title": "Docs Build", "href": "contributing/docs-build.html"},
        ],
    },
    {
        "group": "Releases",
        "items": [
            {"id": "version-current", "title": "Current Version", "href": "releases/current.html"},
            {"id": "version-history", "title": "Version History", "href": "releases/version-history.html"},
            {"id": "migration", "title": "Migration Guides", "href": "releases/migration.html"},
        ],
    },
]


INSTALL_COMMANDS = [
    ["Base native", "pip install arclm", "Datasets, tokenizers, native model, training, checkpoints, evaluation, generation and inspection."],
    ["Web Studio", 'pip install "arclm[web]"', "Adds FastAPI, Uvicorn and Flask compatibility for the local web surfaces."],
    ["External model integration", 'pip install "arclm[hf]"', "Adds optional Hugging Face, Accelerate, Datasets and PEFT packages for external paths."],
    ["PEFT only", 'pip install "arclm[peft]"', "Adds optional PEFT for external adapter workflows."],
    ["Preprocess tools", 'pip install "arclm[preprocess]"', "Adds optional HTML/YAML/tqdm preprocessing helpers."],
    ["Development", 'pip install -e ".[dev]"', "Installs local development tools such as pytest, build and twine."],
]


API_CATALOG = [
    {
        "name": "load_dataset",
        "importPath": "arclm.datasets.load_dataset",
        "kind": "function",
        "category": "datasets",
        "status": "Stable",
        "signature": "load_dataset(source, **kwargs)",
        "summary": "Load in-memory records or supported local dataset files.",
        "parameters": [["source", "Any", "Python records, text path, JSON, JSONL, CSV or TXT source."]],
        "returns": "A list or iterable of dictionaries depending on configuration.",
        "errors": ["Unsupported format", "Malformed JSON or CSV", "Missing required text fields"],
        "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset([{\"text\": \"ArcLM\"}])\nprint(records)",
    },
    {
        "name": "validate_records",
        "importPath": "arclm.datasets.validate_records",
        "kind": "function",
        "category": "datasets",
        "status": "Stable",
        "signature": "validate_records(records, *, required_fields, field_types=None, allow_empty=False, strict=True, record_id_field=None)",
        "summary": "Validate required dataset fields and return structured issues.",
        "parameters": [["records", "Iterable[Mapping]", "Input records."], ["required_fields", "Sequence[str]", "Fields each valid record must contain."], ["strict", "bool", "Raise on invalid records when true."]],
        "returns": "DatasetValidationResult.",
        "errors": ["Missing field", "Wrong field type", "Empty field value"],
        "usage": "from arclm.datasets import validate_records\n\nresult = validate_records([{\"instruction\": \"Hi\", \"response\": \"Hello\"}], required_fields=[\"instruction\", \"response\"])\nprint(result.valid_count)",
    },
    {
        "name": "build_dataset_report",
        "importPath": "arclm.datasets.build_dataset_report",
        "kind": "function",
        "category": "datasets",
        "status": "Stable",
        "signature": "build_dataset_report(records, *, tokenizer=None, text_fields=('text',), validation_result=None, manifest=None, split_information=None, duplicates_removed=0, empty_records_removed=None, truncated_record_count=0, max_token_length=None)",
        "summary": "Create JSON-safe dataset and token statistics.",
        "parameters": [["records", "Iterable[Mapping]", "Input records."], ["tokenizer", "Any", "Tokenizer used for token statistics."], ["text_fields", "Sequence[str]", "Fields to measure."]],
        "returns": "DatasetReport with to_dict, to_json and summary helpers.",
        "errors": ["Tokenizer cannot encode selected fields", "Selected fields missing"],
        "usage": "from arclm.datasets import build_dataset_report\nfrom arclm.tokenizers import Tokenizer\n\nrecords = [{\"text\": \"ArcLM trains locally\"}]\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(records[0][\"text\"])\nreport = build_dataset_report(records, tokenizer=tokenizer)\nprint(report.summary())",
    },
    {
        "name": "Tokenizer",
        "importPath": "arclm.tokenizers.Tokenizer",
        "kind": "class",
        "category": "tokenizers",
        "status": "Beta",
        "signature": "Tokenizer(max_vocab=50000, default_token='<UNK>', user_defined_symbols=None)",
        "summary": "Simple native word tokenizer.",
        "parameters": [["max_vocab", "int", "Maximum vocabulary size."], ["default_token", "str", "Token used for unknown words."]],
        "members": [["build(texts)", "Build vocabulary from text."], ["encode_text(text)", "Return token IDs."], ["decode(ids)", "Return text from token IDs."], ["get_vocab_size()", "Return vocabulary size."]],
        "returns": "Tokenizer instance.",
        "errors": ["Vocabulary too small", "Unknown token rate high"],
        "usage": "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"Hello ArcLM\")\nids = tokenizer.encode_text(\"Hello\")\nprint(ids)",
    },
    {
        "name": "SentencePieceTokenizer",
        "importPath": "arclm.tokenizers.SentencePieceTokenizer",
        "kind": "class",
        "category": "tokenizers",
        "status": "Beta",
        "signature": "SentencePieceTokenizer(max_vocab=50000, model_type='bpe', character_coverage=1.0, default_token='<UNK>', model_name=None, user_defined_symbols=None)",
        "summary": "Native wrapper for SentencePiece BPE, unigram, character and word modes.",
        "parameters": [["model_type", "str", "One of bpe, unigram, char or word."], ["max_vocab", "int", "Vocabulary size target."]],
        "returns": "SentencePieceTokenizer instance.",
        "errors": ["SentencePiece unavailable", "Invalid model type", "Input corpus too small"],
        "usage": "from arclm.tokenizers import SentencePieceTokenizer\n\ntokenizer = SentencePieceTokenizer(max_vocab=64, model_type=\"bpe\")\nprint(tokenizer.model_type)",
    },
    {
        "name": "ArcLM",
        "importPath": "arclm.models.ArcLM",
        "kind": "class",
        "category": "models",
        "status": "Stable",
        "signature": "ArcLM(vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0)",
        "summary": "Compact native causal language model.",
        "parameters": [["vocab_size", "int", "Must match tokenizer vocabulary."], ["embed_dim", "int", "Embedding width."], ["block_size", "int", "Context length."], ["num_blocks", "int", "Transformer block count."]],
        "returns": "PyTorch module.",
        "errors": ["Invalid dimensions", "Context overflow", "Vocabulary mismatch"],
        "usage": "from arclm.models import ArcLM\n\nmodel = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)\nprint(type(model).__name__)",
    },
    {
        "name": "model_support_matrix",
        "importPath": "arclm.model_support_matrix",
        "kind": "function",
        "category": "models",
        "status": "Stable",
        "signature": "model_support_matrix()",
        "summary": "Return the public model support table as JSON-safe rows.",
        "parameters": [],
        "returns": "List of model support rows.",
        "errors": [],
        "usage": "from arclm import model_support_matrix\n\nfor row in model_support_matrix():\n    print(row[\"Model\"], row[\"Status\"])",
    },
    {
        "name": "TrainingConfig",
        "importPath": "arclm.training.TrainingConfig",
        "kind": "class",
        "category": "training",
        "status": "Stable",
        "signature": "TrainingConfig(epochs=3, batch_size=8, learning_rate=2e-5, weight_decay=0.0, gradient_accumulation_steps=1, precision='fp32', output_dir='outputs', device=None, shuffle=True)",
        "summary": "Configuration for native training.",
        "parameters": [["epochs", "int", "Epoch count."], ["batch_size", "int", "Batch size."], ["learning_rate", "float", "Optimizer learning rate."], ["device", "str | None", "cpu, cuda or automatic selection."]],
        "returns": "TrainingConfig dataclass instance.",
        "errors": ["Invalid optimizer", "Invalid precision", "Invalid batch size"],
        "usage": "from arclm.training import TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, learning_rate=1e-3, device=\"cpu\")\nprint(config)",
    },
    {
        "name": "Trainer",
        "importPath": "arclm.training.Trainer",
        "kind": "class",
        "category": "training",
        "status": "Stable",
        "signature": "Trainer(model, optimizer=None, criterion=None, config=None, *, train_dataset=None, validation_dataset=None, callbacks=None, collate_fn=None)",
        "summary": "Canonical native training loop.",
        "parameters": [["model", "torch.nn.Module", "Model to train."], ["config", "TrainingConfig", "Training settings."], ["train_dataset", "Dataset", "Training examples."]],
        "returns": "Trainer object with train and checkpoint helpers.",
        "errors": ["Empty dataset", "Invalid device", "Checkpoint save failure"],
        "usage": "from arclm.training import Trainer, TrainingConfig\n\nconfig = TrainingConfig(epochs=1, batch_size=1, device=\"cpu\")\n# trainer = Trainer(model=model, config=config, train_dataset=dataset)\n# trainer.train()",
    },
    {
        "name": "LoRAConfig",
        "importPath": "arclm.peft.LoRAConfig",
        "kind": "class",
        "category": "peft",
        "status": "Stable",
        "signature": "LoRAConfig(...)",
        "summary": "Configuration for native LoRA adapter experiments.",
        "parameters": [["r", "int", "Adapter rank."], ["alpha", "float", "Scaling value."], ["dropout", "float", "Adapter dropout."]],
        "returns": "LoRAConfig instance.",
        "errors": ["No matching linear modules", "Adapter shape mismatch"],
        "usage": "from arclm.peft import LoRAConfig\n\nconfig = LoRAConfig(r=2, alpha=4, dropout=0.0)\nprint(config)",
    },
    {
        "name": "validate_sft_records",
        "importPath": "arclm.validate_sft_records",
        "kind": "function",
        "category": "training",
        "status": "Beta",
        "signature": "validate_sft_records(records, *, strict=True)",
        "summary": "Validate supervised fine-tuning records before formatting.",
        "parameters": [["records", "Iterable[Mapping]", "Instruction/response, prompt/completion or chat-style records."], ["strict", "bool", "Raise on invalid records when true."]],
        "returns": "SFT validation result with valid records and issues.",
        "errors": ["Missing instruction or response", "Empty completion", "Unsupported message shape"],
        "usage": "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())",
    },
    {
        "name": "inspect_checkpoint",
        "importPath": "arclm.checkpoints.inspect_checkpoint",
        "kind": "function",
        "category": "checkpoints",
        "status": "Stable",
        "signature": "inspect_checkpoint(path, *, validate=False)",
        "summary": "Read safe checkpoint metadata and compatibility information.",
        "parameters": [["path", "str | Path", "Trusted local checkpoint path."], ["validate", "bool", "Whether to perform additional validation."]],
        "returns": "CheckpointInfo.",
        "errors": ["Checkpoint not found", "Unsupported checkpoint version", "Incompatible checkpoint"],
        "usage": "from arclm.checkpoints import inspect_checkpoint\n\n# info = inspect_checkpoint(\"local-checkpoint-directory\")\n# print(info)",
    },
    {
        "name": "Evaluator",
        "importPath": "arclm.evaluation.Evaluator",
        "kind": "class",
        "category": "evaluation",
        "status": "Stable",
        "signature": "Evaluator(model, dataset=None, metrics=None, config=None, dataloader=None, callbacks=None, collate_fn=None, loss_fn=None)",
        "summary": "Evaluate a model with canonical metrics.",
        "parameters": [["model", "torch.nn.Module", "Model to evaluate."], ["metrics", "list", "Metric objects."], ["dataset", "Dataset", "Examples to evaluate."]],
        "returns": "EvaluationResult.",
        "errors": ["Empty evaluation data", "Metric not applicable", "Device mismatch"],
        "usage": "from arclm.evaluation import Evaluator, LossMetric, Perplexity\n\n# evaluator = Evaluator(model, dataset=dataset, metrics=[LossMetric(), Perplexity()])\n# result = evaluator.evaluate()",
    },
    {
        "name": "build_evaluation_report",
        "importPath": "arclm.evaluation.build_evaluation_report",
        "kind": "function",
        "category": "evaluation",
        "status": "Stable",
        "signature": "build_evaluation_report(result, *, model=None, checkpoint_identity=None, dataset_identity=None, num_tokens=None, warnings=())",
        "summary": "Wrap evaluation metrics in a JSON-safe report.",
        "parameters": [["result", "EvaluationResult", "Canonical evaluation result."], ["checkpoint_identity", "str | None", "Checkpoint label."], ["dataset_identity", "str | None", "Dataset label."]],
        "returns": "EvaluationReport.",
        "errors": ["Invalid result object"],
        "usage": "from arclm.evaluation import EvaluationReport\n\nreport = EvaluationReport(metrics={\"loss\": 1.0}, num_examples=1, num_batches=1, num_tokens=None, model_identity=None, checkpoint_identity=None, dataset_identity=None, evaluation_timestamp=0.0, device=\"cpu\", dtype=\"float32\")\nprint(report.summary())",
    },
    {
        "name": "Generator",
        "importPath": "arclm.inference.Generator",
        "kind": "class",
        "category": "inference",
        "status": "Stable",
        "signature": "Generator(model, stoi, itos, block_size, device, tokenizer=None)",
        "summary": "Generate bounded text from a native model.",
        "parameters": [["model", "ArcLM", "Native model."], ["stoi", "dict", "String to ID vocabulary."], ["itos", "dict", "ID to string vocabulary."], ["block_size", "int", "Context length."]],
        "returns": "Generated text from generate_string.",
        "errors": ["Empty prompt", "Context too long", "Invalid sampling options"],
        "usage": "from arclm.inference import Generator\n\n# generator = Generator(model, tokenizer.stoi, tokenizer.itos, 8, \"cpu\", tokenizer=tokenizer)\n# print(generator.generate_string(\"Hello\", max_new_tokens=4))",
    },
    {
        "name": "inspect_text",
        "importPath": "arclm.inspect_text",
        "kind": "function",
        "category": "inspection",
        "status": "Beta",
        "signature": "inspect_text(*, model, tokenizer, text, max_new_tokens=1, temperature=1.0, repetition_penalty=1.0, top_k=None, top_p=None, include_values=False, max_values=20)",
        "summary": "Return a PipelineTrace for one native generation step.",
        "parameters": [["model", "ArcLM", "Native ArcLM model."], ["tokenizer", "Tokenizer", "Native tokenizer."], ["text", "str", "Input prompt."]],
        "returns": "PipelineTrace.",
        "errors": ["Empty text", "Unsupported tokenizer", "Unsupported model"],
        "usage": "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello\")\nprint(trace.to_dict())",
    },
    {
        "name": "WebConfig",
        "importPath": "arclm.web.WebConfig",
        "kind": "class",
        "category": "web",
        "status": "Beta",
        "signature": "WebConfig(host='127.0.0.1', port=8765, workspace_root='workspace', expose_docs=True, ...)",
        "summary": "Configuration for the optional local Web API.",
        "parameters": [["host", "str", "Bind host."], ["port", "int", "Bind port."], ["workspace_root", "str | Path", "Local workspace root."]],
        "returns": "WebConfig instance.",
        "errors": ["Unsafe origin", "Invalid port", "Invalid workspace root"],
        "usage": "from arclm.web import WebConfig, create_app\n\nconfig = WebConfig(host=\"127.0.0.1\", port=8765)\napp = create_app(config)",
    },
]


MODULE_CATALOG = [
    ["arclm.datasets", "Stable", "Dataset loading, validation, manifests, reports and local processing.", "Use at the start of data workflows.", "Core dependencies only."],
    ["arclm.tokenizers", "Beta", "Native word and SentencePiece tokenizers.", "Use before model creation and generation.", "SentencePiece for subword modes."],
    ["arclm.models", "Stable", "Native ArcLM causal model and capability reports.", "Use for local causal language modeling.", "torch."],
    ["arclm.training", "Stable", "Canonical Trainer and TrainingConfig.", "Use for native training and checkpoints.", "torch."],
    ["arclm.finetuning", "Stable", "Full fine-tuning and SFT data contracts.", "Use for instruction/response workflows.", "External paths may need HF extras."],
    ["arclm.peft", "Stable", "Native LoRA and optional PEFT helpers.", "Use for adapter experiments.", "torch; optional peft for external adapters."],
    ["arclm.checkpoints", "Stable", "Checkpoint inspection and loading boundaries.", "Use for trusted local checkpoint workflows.", "Optional safetensors."],
    ["arclm.evaluation", "Stable", "Evaluator, metrics and report objects.", "Use after training or reload.", "torch."],
    ["arclm.inference", "Stable", "Native generation and optional external causal-LM boundaries.", "Use for bounded text generation.", "External paths may need transformers."],
    ["arclm.inspection", "Beta", "Transparent native pipeline traces.", "Use for learning and debugging.", "torch."],
    ["arclm.web", "Beta", "Optional local FastAPI backend.", "Use for ArcLM Studio.", "web extra."],
    ["arclm.tracking", "Beta", "Local run metadata and reproducibility helpers.", "Use for experiment records.", "Core dependencies."],
    ["arclm.registry", "Experimental", "Lightweight extension registry surfaces.", "Use only for advanced extension work.", "Core dependencies."],
    ["arclm.plugins", "Experimental", "Plugin interfaces.", "Use only when integrating extension metadata.", "Core dependencies."],
    ["Legacy shims", "Deprecated", "Old import paths kept for compatibility.", "Avoid in new code.", "Same as replacements."],
]


SUPPORTED_MODELS = [
    {
        "id": "native-arclm",
        "name": "Native ArcLM",
        "provider": "ArcLM",
        "modelId": None,
        "family": "ArcLM",
        "status": "native",
        "parameterCount": "Configurable",
        "tasks": ["causal-language-modeling", "training", "fine-tuning", "generation", "evaluation", "inspection"],
        "testedOperations": ["create", "forward", "train", "checkpoint", "reload", "evaluate", "generate", "inspect"],
        "optionalDependencies": [],
        "external": False,
        "url": None,
        "notes": "Implemented directly by ArcLM as a compact causal language model.",
        "limitations": ["Small educational and research model, not a production-scale serving architecture."],
    },
    {
        "id": "gpt2-tiny-reference",
        "name": "Tiny GPT-2 reference",
        "provider": "Hugging Face",
        "modelId": "hf-internal-testing/tiny-random-gpt2",
        "family": "GPT-2",
        "status": "compatible",
        "parameterCount": "Tiny test configuration",
        "tasks": ["causal-language-modeling", "external-loading", "generation"],
        "testedOperations": ["source-detection", "optional-dependency-boundary", "generation-boundary"],
        "optionalDependencies": ["transformers"],
        "external": True,
        "url": "https://huggingface.co/hf-internal-testing/tiny-random-gpt2",
        "notes": "Compatibility reference only; not a claim about full GPT-2 family coverage.",
        "limitations": ["Runtime depends on optional Transformers assets and local availability."],
    },
    {
        "id": "qwen3-0-6b",
        "name": "Qwen3 0.6B",
        "provider": "Qwen",
        "modelId": "Qwen/Qwen3-0.6B",
        "family": "Qwen3",
        "status": "experimental",
        "parameterCount": "0.6B",
        "tasks": ["causal-language-modeling", "external-loading"],
        "testedOperations": ["source-recognition", "configuration-boundary"],
        "optionalDependencies": ["transformers"],
        "external": True,
        "url": "https://huggingface.co/Qwen/Qwen3-0.6B",
        "notes": "Exact model path is recognized; complete load, training, SFT, LoRA and CUDA behavior are not guaranteed.",
        "limitations": ["Experimental exact-model path; no universal Qwen support claim."],
    },
    {
        "id": "native-bert-t5-diffusion",
        "name": "Native BERT, T5, diffusion and multimodal models",
        "provider": "ArcLM",
        "modelId": None,
        "family": "Unsupported native families",
        "status": "unsupported",
        "parameterCount": "N/A",
        "tasks": ["masked-language-modeling", "seq2seq", "diffusion", "multimodal"],
        "testedOperations": [],
        "optionalDependencies": [],
        "external": False,
        "url": None,
        "notes": "ArcLM does not currently provide these native model families.",
        "limitations": ["Unsupported by native ArcLM."],
    },
]


DATASET_FORMATS = [
    {
        "id": "python-records",
        "name": "Python list of dictionaries",
        "status": "Stable",
        "structure": "[{\"text\": \"ArcLM trains locally.\"}]",
        "requiredFields": "Depends on workflow; plain causal LM commonly uses text.",
        "whenToUse": "Small scripts, tests and notebooks.",
        "commonMistakes": ["Passing a list of strings when records are expected", "Missing required text fields"],
        "sample": "assets/datasets/tiny-records.json",
        "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset([{\"text\": \"ArcLM trains locally.\"}])",
    },
    {
        "id": "json",
        "name": "JSON",
        "status": "Stable",
        "structure": "A JSON list of objects or a supported object containing records.",
        "requiredFields": "text, instruction/response or prompt/completion depending on workflow.",
        "whenToUse": "Small structured local datasets.",
        "commonMistakes": ["Using invalid JSON", "Mixing unrelated record shapes"],
        "sample": "assets/datasets/tiny-records.json",
        "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-records.json\")",
    },
    {
        "id": "jsonl",
        "name": "JSONL",
        "status": "Stable",
        "structure": "One JSON object per line.",
        "requiredFields": "instruction and response for SFT, or text for plain causal LM.",
        "whenToUse": "Instruction datasets and append-friendly local data.",
        "commonMistakes": ["Trailing commas", "Blank malformed lines", "Missing response fields"],
        "sample": "assets/datasets/tiny-instructions.jsonl",
        "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-instructions.jsonl\")",
    },
    {
        "id": "csv",
        "name": "CSV",
        "status": "Stable",
        "structure": "Header row followed by records.",
        "requiredFields": "Columns named for selected text fields.",
        "whenToUse": "Tabular text data.",
        "commonMistakes": ["Missing header", "Wrong delimiter", "Empty text cells"],
        "sample": "assets/datasets/tiny-table.csv",
        "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-table.csv\")",
    },
    {
        "id": "txt",
        "name": "TXT",
        "status": "Stable",
        "structure": "Plain UTF-8 text.",
        "requiredFields": "No explicit fields; loader converts text into records.",
        "whenToUse": "Tiny causal language modeling experiments.",
        "commonMistakes": ["Very short text", "Unexpected encoding"],
        "sample": "assets/datasets/tiny-causal.txt",
        "usage": "from arclm.datasets import load_dataset\n\nrecords = load_dataset(\"tiny-causal.txt\")",
    },
]


CONFIGURATION_CATALOG = [
    ["Model", "vocab_size", "int", "Required", "Must match tokenizer vocabulary size."],
    ["Model", "embed_dim", "int", "64", "Embedding width for the native model."],
    ["Model", "block_size", "int", "8", "Maximum context length."],
    ["Model", "num_blocks", "int", "2", "Transformer block count."],
    ["Training", "epochs", "int", "3", "Training epochs."],
    ["Training", "batch_size", "int", "8", "Examples per batch."],
    ["Training", "learning_rate", "float", "2e-5", "Optimizer learning rate."],
    ["Training", "gradient_accumulation_steps", "int", "1", "Accumulate gradients before optimizer step."],
    ["Training", "precision", "str", "fp32", "fp32, fp16 or bf16 when available."],
    ["Evaluation", "maximum_examples", "int", "64 in Studio", "Bounded evaluation size for local Studio jobs."],
    ["Generation", "max_new_tokens", "int", "32 in request examples", "Maximum generated tokens."],
    ["Generation", "temperature", "float", "1.0", "Sampling temperature."],
    ["Web", "workspace_root", "str | Path", "workspace", "Local Studio workspace root."],
    ["Web", "max_generation_history", "int", "100", "Bounded stored generation history."],
]


ERRORS = [
    ["dataset_tokenizer_required", "A tokenizer is required for token statistics or token inspection.", "Create or select a tokenizer.", "Dataset reports and Studio Data page."],
    ["tokenizer_vocab_model_mismatch", "Model vocabulary size does not match tokenizer vocabulary size.", "Create the model from the selected tokenizer vocabulary.", "Model Builder and training."],
    ["training_tokenizer_model_mismatch", "The training tokenizer does not match the selected model.", "Select the tokenizer used by the model.", "Training Studio."],
    ["training_job_already_running", "Another local training job is active.", "Wait, cancel or inspect the active run.", "Training Studio."],
    ["checkpoint_not_found", "The selected checkpoint ID is not available in the project.", "Refresh checkpoints or train a model.", "Checkpoint Manager."],
    ["checkpoint_incompatible", "Checkpoint metadata or tensor shapes do not match the expected native model.", "Use a compatible native checkpoint.", "Checkpoint validation."],
    ["evaluation_tokenizer_mismatch", "Evaluation tokenizer differs from checkpoint tokenizer.", "Use the checkpoint tokenizer.", "Evaluation Studio."],
    ["generation_context_exceeded", "Prompt plus requested tokens exceed context length.", "Shorten the prompt or reduce new tokens.", "Generation Playground."],
    ["compute_resource_busy", "A local training or evaluation worker is active.", "Wait for the worker to finish.", "Evaluation and generation."],
]


EXAMPLES = [
    {
        "id": "load-python-records",
        "title": "Load Python records",
        "difficulty": "Beginner",
        "tags": ["Dataset"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "How to start from in-memory data.",
        "download": "assets/examples/load-python-records.py",
        "code": "from arclm.datasets import load_dataset\n\nrecords = load_dataset([{\"text\": \"ArcLM trains locally.\"}])\nprint(records)",
    },
    {
        "id": "word-tokenizer",
        "title": "Create and inspect a Word tokenizer",
        "difficulty": "Beginner",
        "tags": ["Tokenizer"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "Vocabulary, token IDs and decoding.",
        "download": "assets/examples/word-tokenizer.py",
        "code": "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"ArcLM trains locally\")\nids = tokenizer.encode_text(\"ArcLM locally\")\nprint(ids)\nprint(tokenizer.decode(ids))",
    },
    {
        "id": "tiny-native-model",
        "title": "Create a tiny native model",
        "difficulty": "Beginner",
        "tags": ["Model"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "Native ArcLM model configuration.",
        "download": "assets/examples/tiny-native-model.py",
        "code": "from arclm.models import ArcLM\n\nmodel = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)\nprint(model.__class__.__name__)",
    },
    {
        "id": "pipeline-inspection",
        "title": "Inspect a native pipeline step",
        "difficulty": "Beginner",
        "tags": ["Inspection", "Generation"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "Tokens, tensor shapes, selected token and decoded text.",
        "download": "assets/examples/pipeline-inspection.py",
        "code": "from arclm import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=32)\ntokenizer.build(\"Hello ArcLM\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\ntrace = inspect_text(model=model, tokenizer=tokenizer, text=\"Hello\")\nprint(trace.summary())",
    },
    {
        "id": "validate-sft",
        "title": "Validate instruction records",
        "difficulty": "Beginner",
        "tags": ["Fine-Tuning"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "SFT record contract.",
        "download": "assets/examples/validate-sft.py",
        "code": "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())",
    },
    {
        "id": "evaluation-report",
        "title": "Create an evaluation report object",
        "difficulty": "Intermediate",
        "tags": ["Evaluation"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "JSON-safe evaluation report shape.",
        "download": "assets/examples/evaluation-report.py",
        "code": "from arclm.evaluation import EvaluationReport\n\nreport = EvaluationReport(metrics={\"loss\": 1.0}, num_examples=1, num_batches=1, num_tokens=None, model_identity=None, checkpoint_identity=None, dataset_identity=None, evaluation_timestamp=0.0, device=\"cpu\", dtype=\"float32\")\nprint(report.to_json())",
    },
    {
        "id": "dataset-report",
        "title": "Build a dataset report",
        "difficulty": "Beginner",
        "tags": ["Dataset", "Tokenizer"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "Record counts, text lengths and token statistics.",
        "download": "assets/examples/dataset-report.py",
        "code": "from arclm import build_dataset_report\nfrom arclm.tokenizers import Tokenizer\n\nrecords = [{\"text\": \"ArcLM keeps data local.\"}]\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(records[0][\"text\"])\nreport = build_dataset_report(records, tokenizer=tokenizer)\nprint(report.summary())",
    },
    {
        "id": "model-support-matrix",
        "title": "Read the model support matrix",
        "difficulty": "Beginner",
        "tags": ["Model"],
        "runtime": "Instant",
        "device": "CPU",
        "optionalDependencies": [],
        "teaches": "Honest native, compatible and experimental model status.",
        "download": "assets/examples/model-support-matrix.py",
        "code": "from arclm import model_support_matrix\n\nfor row in model_support_matrix():\n    print(row[\"Model\"], row[\"Status\"])",
    },
]


COMPLETE_PROJECTS = [
    {
        "id": "tiny-text-model",
        "title": "Tiny text model",
        "difficulty": "Beginner",
        "goal": "Train a tiny local causal LM on synthetic text.",
        "files": ["data.jsonl", "train.py", "evaluate.py", "generate.py", "configuration.json"],
        "dataset": "Short synthetic causal text records.",
        "tokenizer": "Native word tokenizer.",
        "modelConfiguration": "Small vocabulary, embed_dim 16, block_size 8, one block.",
        "trainingConfiguration": "CPU, one epoch, batch size 1.",
        "expectedOutput": "A checkpoint directory and short generated text.",
        "download": "assets/examples/tiny-text-model/train.py",
    },
    {
        "id": "instruction-finetuning",
        "title": "Instruction fine-tuning project",
        "difficulty": "Intermediate",
        "goal": "Validate instruction/response records and prepare an SFT workflow.",
        "files": ["instructions.jsonl", "validate.py", "configuration.json"],
        "dataset": "Synthetic instruction/response JSONL.",
        "tokenizer": "Native word tokenizer for tiny data.",
        "modelConfiguration": "Native ArcLM tiny causal LM.",
        "trainingConfiguration": "CPU-friendly SFT settings.",
        "expectedOutput": "Validation summary and prepared records.",
        "download": "assets/examples/instruction-finetuning/validate.py",
    },
    {
        "id": "pipeline-inspection-project",
        "title": "Pipeline inspection project",
        "difficulty": "Beginner",
        "goal": "Show token IDs, tensor shapes and selected token from one native step.",
        "files": ["inspect.py", "configuration.json"],
        "dataset": "Inline text.",
        "tokenizer": "Native word tokenizer.",
        "modelConfiguration": "Tiny ArcLM model.",
        "trainingConfiguration": "No training required.",
        "expectedOutput": "PipelineTrace summary and JSON-safe dictionary.",
        "download": "assets/examples/pipeline-inspection-project/inspect.py",
    },
]


def build_pages() -> list[dict]:
    pages: list[dict] = []
    pages.append(page("overview", "ArcLM Documentation", "Start", "index.html", "A native-first library for local language-model learning.", [
        text_section("What ArcLM is", "ArcLM is a compact Python library for local language-model workflows. The main path is dataset, tokenizer, native causal model, training, checkpoint, evaluation, generation and pipeline inspection."),
        list_section("What you can do", ["Load and validate local datasets", "Create native tokenizers", "Train a tiny native ArcLM model", "Save and reload checkpoints", "Evaluate and generate text", "Inspect the pipeline", "Use the optional local Studio"]),
        code_section("Smallest import check", "import arclm\nfrom arclm import inspect_text\n\nprint(arclm.__version__)\nprint(inspect_text)"),
    ], status="Stable"))
    pages.append(page("installation", "Installation", "Start", "installation.html", "Install ArcLM base or optional extras.", [
        text_section("Base install", "The base package contains the native ArcLM workflow and does not require web or Hugging Face packages."),
        table_section("Install variants", ["Variant", "Command", "Adds"], INSTALL_COMMANDS),
        code_section("Verify the install", "import arclm\nfrom arclm.datasets import load_dataset\n\nprint(arclm.__version__)\nprint(load_dataset([{\"text\": \"ArcLM\"}]))"),
        list_section("Optional boundaries", ["Web imports require the web extra.", "External model paths require optional integration packages.", "Base native imports do not load FastAPI, Uvicorn, Transformers, PEFT or Datasets."]),
    ]))
    pages.append(page("getting-started", "Getting Started", "Start", "getting-started.html", "Three quick paths into ArcLM.", [
        text_section("Path 1 - inspect text without training", "Create a tokenizer and tiny native model, then call inspect_text to see token IDs and tensor shapes."),
        code_section("Inspect text", api_usage("inspect_text")),
        text_section("Path 2 - train a tiny native model", "Prepare records, create a tokenizer-compatible model, configure Trainer and save checkpoints. See the training guide for the complete flow."),
        text_section("Path 3 - use ArcLM Studio", "Install the web extra, start the local API and open the existing frontend during development. Studio keeps data and model artifacts local."),
    ]))
    pages.append(page("architecture", "Architecture", "Start", "architecture.html", "How ArcLM pieces fit together.", [
        text_section("Native-first core", "ArcLM keeps the core workflow in local Python and PyTorch. Optional integrations are separate paths."),
        list_section("Core flow", ["Dataset records", "Tokenizer", "Token IDs", "Native ArcLM model", "Trainer", "Checkpoint", "Evaluator", "Generator", "PipelineTrace"]),
        text_section("Optional integrations", "The Web API and Studio are optional local interfaces. Hugging Face and PEFT integrations are optional and should not be mistaken for universal model support."),
    ]))
    pages.append(page("workflows", "Workflows", "Start", "workflows.html", "Common ArcLM workflows.", [
        list_section("Native happy path", ["Load or create records", "Validate schema", "Build tokenizer", "Create native model", "Train", "Save checkpoint", "Evaluate", "Generate", "Inspect"]),
        list_section("SFT path", ["Instruction records", "Validation", "Formatting", "Tokenization", "Labels", "Training", "Checkpoint"]),
        list_section("Studio path", ["Project", "Dataset", "Tokenizer", "Model", "Training run", "Checkpoint", "Evaluation", "Generation", "Inspection"]),
    ]))

    guide_specs = {
        "guide-datasets": ("Datasets", "guides/datasets.html", "Load, validate and report on local data.", [
            text_section("What datasets are", "ArcLM datasets are local records used for tokenization, training, fine-tuning, evaluation and reports."),
            list_section("Supported inputs", ["Python list of dictionaries", "JSON", "JSONL", "CSV", "TXT", "Instruction/response records", "Prompt/completion records"]),
            code_section("Validate instruction records", api_usage("validate_records")),
            code_section("Build a token report", api_usage("build_dataset_report")),
        ]),
        "guide-tokenizers": ("Tokenizers", "guides/tokenizers.html", "Convert text to token IDs and back.", [
            text_section("Core concepts", "Tokenization splits text into tokens, maps them to numeric IDs and provides decoding back to text. Models consume IDs, not raw strings."),
            list_section("Modes", ["Word tokenizer for deterministic tiny examples", "SentencePiece BPE", "SentencePiece unigram", "SentencePiece character", "SentencePiece word mode"]),
            code_section("Create a Word tokenizer", api_usage("Tokenizer")),
            code_section("SentencePiece configuration", api_usage("SentencePieceTokenizer")),
            list_section("Common mistakes", ["Tokenizer vocabulary does not match model vocabulary", "Vocabulary too small", "Unknown-token count is high"]),
        ]),
        "guide-models": ("Models", "guides/models.html", "Create native ArcLM causal language models.", [
            text_section("Native model path", "ArcLM provides a compact GPT-style causal language model. It is the official native model path."),
            code_section("Create a tiny model", api_usage("ArcLM")),
            table_section("Important fields", ["Field", "Meaning"], [["vocab_size", "Must match tokenizer size"], ["embed_dim", "Embedding width"], ["block_size", "Context length"], ["num_blocks", "Transformer block count"]]),
            list_section("Limitations", ["No native BERT/T5/diffusion/multimodal models", "No streaming generation", "No attention-map capture"]),
        ]),
        "guide-training": ("Training", "guides/training.html", "Train native models with Trainer.", [
            text_section("How training works", "The native path batches token IDs, runs the model forward pass, computes loss, backpropagates, steps the optimizer and saves checkpoints."),
            code_section("Create TrainingConfig", api_usage("TrainingConfig")),
            code_section("Create Trainer", api_usage("Trainer")),
            list_section("Supported options", ["CPU", "CUDA when available", "Gradient accumulation", "Checkpoint intervals", "Adam, AdamW and SGD options"]),
        ]),
        "guide-fine-tuning": ("Fine-Tuning", "guides/fine-tuning.html", "Validate and prepare supervised fine-tuning records.", [
            text_section("SFT contract", "SFT accepts instruction/response, prompt/completion and normalized chat-style records. The stable contract validates records before formatting and tokenization."),
            code_section("Validate SFT records", "from arclm import validate_sft_records\n\nrecords = [{\"instruction\": \"Explain ArcLM.\", \"response\": \"ArcLM is native-first.\"}]\nresult = validate_sft_records(records)\nprint(result.summary())"),
            list_section("Limitations", ["External Hugging Face SFT needs optional packages", "Packing is not the stable default", "Native Trainer is not replaced by a separate SFT engine"]),
        ]),
        "guide-peft-lora": ("PEFT and LoRA", "guides/peft-lora.html", "Use lightweight native adapters where validated.", [
            text_section("Native LoRA", "ArcLM validates native LoRA on ArcLM linear layers. External PEFT paths remain optional and model-specific."),
            code_section("Configure LoRA", api_usage("LoRAConfig")),
            list_section("Limitations", ["Native ArcLM Linear layers only for stable validation", "QLoRA runtime depends on CUDA and bitsandbytes", "External adapter behavior is not universal"]),
        ]),
        "guide-checkpoints": ("Checkpoints", "guides/checkpoints.html", "Save, inspect and reload native checkpoints.", [
            text_section("What checkpoints store", "Native checkpoints store model state and training state needed for reload, resume, evaluation, generation and inspection."),
            code_section("Inspect checkpoint metadata", api_usage("inspect_checkpoint")),
            list_section("Common errors", ["Checkpoint not found", "Incompatible checkpoint", "Missing metadata", "Untrusted external file"]),
        ]),
        "guide-evaluation": ("Evaluation", "guides/evaluation.html", "Measure model behavior with structured reports.", [
            text_section("What evaluation returns", "Evaluation returns metrics such as loss, perplexity and accuracy when applicable, plus report metadata such as examples and device."),
            code_section("Create report object", api_usage("build_evaluation_report")),
            list_section("Limitations", ["No large benchmark suite by default", "Diagnostics interpret reports, not recalculate metrics"]),
        ]),
        "guide-inference": ("Inference", "guides/inference.html", "Use a trained or reloaded model for bounded local model use.", [
            text_section("What inference means in ArcLM", "Inference is the model-use side of ArcLM. The stable native path loads a trusted local native model or checkpoint, prepares token IDs with the matching tokenizer and runs a bounded generation or inspection step."),
            list_section("When to use it", ["Generate a short continuation", "Inspect the native pipeline", "Check a checkpoint after training", "Run small CPU-friendly experiments"]),
            code_section("Native generation entry point", api_usage("Generator")),
            list_section("Limitations", ["No streaming generation", "No production serving", "External causal-LM loading is optional and lower-level"]),
        ]),
        "guide-generation": ("Generation", "guides/generation.html", "Generate bounded text from native checkpoints.", [
            text_section("How generation works", "Generation tokenizes a prompt, feeds the model, selects next tokens with supported sampling settings and decodes text."),
            code_section("Generator shape", api_usage("Generator")),
            table_section("Options", ["Option", "Meaning"], [["max_new_tokens", "Bound generated length"], ["temperature", "Sampling sharpness"], ["top_k", "Limit candidate tokens"], ["top_p", "Nucleus sampling threshold"]]),
        ]),
        "guide-inspection": ("Pipeline Inspection", "guides/inspection.html", "Explain one native generation step.", [
            text_section("What inspection shows", "Inspection exposes input text, tokens, IDs, input shape, embedding shape, logits shape, selected token, decoded text, device and dtype."),
            code_section("Inspect text", api_usage("inspect_text")),
            list_section("Limitations", ["One native generation step", "No attention maps", "No external-model tracing"]),
        ]),
        "guide-pipelines": ("Pipelines", "guides/pipelines.html", "Compose the verified native lifecycle.", [
            text_section("Lifecycle", "ArcLM pipelines are the practical sequence that connects records, tokenizer, model, trainer, checkpoint, evaluator, generator and inspection trace."),
            list_section("Native flow", ["Dataset validation", "Tokenizer build", "Model creation", "Training", "Checkpoint save/load", "Evaluation", "Generation", "Inspection"]),
            code_section("Inspect the pipeline", api_usage("inspect_text")),
            list_section("Limits", ["Pipeline helpers are local Python flows, not a production orchestration service.", "External model flows remain optional integration boundaries."]),
        ], "Beta"),
        "guide-agents": ("Agent Runtime", "guides/agent-runtime.html", "Run deterministic provider-independent tool loops.", [
            text_section("Runtime shape", "Agent Runtime separates model responses, tool schemas, sessions, traces, permissions and runner stop conditions. The core runtime does not require a hosted provider."),
            code_section("Create a tool", "from arclm.agents import Agent, AgentRunner, ModelResponse, ToolCall, tool\n\n@tool\ndef add_numbers(a: int, b: int) -> int:\n    \"\"\"Add two integers.\"\"\"\n    return a + b\n\nclass FakeModel:\n    def __init__(self):\n        self.calls = 0\n    def generate_response(self, *, messages, tools, instructions, session):\n        self.calls += 1\n        if self.calls == 1:\n            return ModelResponse(tool_calls=[ToolCall(id=\"call_1\", name=\"add_numbers\", arguments={\"a\": 2, \"b\": 3})])\n        return ModelResponse(content=\"Done.\")\n\nagent = Agent(name=\"calculator\", instructions=\"Use tools when useful.\", model=FakeModel(), tools=[add_numbers])\nresult = AgentRunner(max_steps=2).run(agent, \"Add 2 and 3.\")\nprint(result.output)"),
            list_section("Boundaries", ["No production autonomy claim", "No built-in shell execution", "No unrestricted filesystem tools", "Provider adapters must return ModelResponse objects"]),
        ], "Beta"),
        "guide-agent-tools": ("Agent Tools", "guides/agent-tools.html", "Define typed local tools with validation and permissions.", [
            text_section("Tool contract", "Tools are typed Python callables wrapped with metadata. Arguments are validated before execution and tool calls are recorded in the session trace."),
            code_section("Tool schema", "from arclm.agents import tool\n\n@tool\ndef calculate_total(price: float, quantity: int) -> float:\n    \"\"\"Calculate a total price.\"\"\"\n    return price * quantity\n\nprint(calculate_total.spec.name)"),
            list_section("Security notes", ["Use explicit permissions for side effects.", "Keep secrets out of tool outputs.", "Prefer bounded workspace paths for document tools."]),
        ], "Beta"),
        "guide-security": ("Security", "guides/security.html", "Use Security Core for local policies, redaction, hashing, signatures and encryption.", [
            text_section("Security Core", "Security Core provides typed policy objects, safe status reports, AEAD encryption envelopes, signed manifests, hashing helpers, redaction and Web/Agent boundary helpers."),
            code_section("Encrypt and reject tampering", "import os\nfrom arclm.security import DecryptionError, decrypt_json, encrypt_json\n\nkey = os.urandom(32)\nenvelope = encrypt_json({\"prompt\": \"synthetic\"}, key)\ntampered = envelope.to_dict()\ntampered[\"ciphertext\"] = tampered[\"ciphertext\"][:-2] + \"AA\"\ntry:\n    decrypt_json(tampered, key)\nexcept DecryptionError:\n    print(\"tamper rejected\")"),
            list_section("Boundaries", ["No security certification", "No production auth layer", "Untrusted pickle loading is blocked by policy unless explicitly treated as legacy trusted input"]),
        ], "Beta"),
        "guide-external-models": ("External Models", "guides/external-models.html", "Optional lower-level Hugging Face causal-LM boundaries.", [
            text_section("Honest status", "External model loading exists through optional integration paths. It is not a universal loader and may require internet for first model download."),
            code_section("Inspect source boundary", "from arclm.inference.external import inspect_model_source\n\nsource = inspect_model_source(\"Qwen/Qwen3-0.6B\")\nprint(source)"),
            list_section("Limitations", ["Requires optional packages", "First download may require internet", "Only exact verified operations should be trusted"]),
        ], "Experimental"),
        "guide-cli": ("CLI", "guides/cli.html", "Use ArcLM from the command line.", [
            table_section("Commands", ["Command", "Purpose"], [["arclm train --help", "Show training options"], ["arclm eval --help", "Show evaluation options"], ["arclm generate --help", "Show generation options"], ["arclm doctor", "Print safe local diagnostics"], ["python -m arclm web-api", "Start the local Web API"]]),
            code_section("Doctor JSON", "arclm doctor --json", "bash"),
        ]),
        "guide-web-studio": ("ArcLM Studio", "guides/web-studio.html", "Optional local visual workflow.", [
            text_section("Local workflow", "Studio provides project, dataset, tokenizer, model, training run, checkpoint, evaluation, generation and inspection pages. It remains local and read/write bounded to the configured workspace."),
            list_section("Workflow", ["Project", "Dataset", "Validation/report", "Tokenizer", "Record inspection", "Native model", "Training", "Checkpoint", "Evaluation", "Generation", "Pipeline inspection"]),
            list_section("Limitations", ["No auth", "No cloud", "No external model downloads", "No streaming", "No production serving"]),
        ], "Beta"),
        "guide-lab": ("ArcLM Lab", "guides/lab.html", "Learn ArcLM architecture through four progressive levels.", [
            text_section("Purpose", "The Lab teaches ArcLM concepts through learner exercises. It is educational scaffolding, not proof that every topic is a production feature."),
            table_section("Levels", ["Level", "Focus"], [["Beginner", "Data, cleaning, validation, vocabulary and tokenization"], ["Intermediate", "Manifests, preprocessing, model configuration, forward pass, training loop and checkpoints"], ["Advanced", "Artifacts, SFT formatting, LoRA boundaries, evaluation, generation and inspection"], ["Expert", "Registries, events, dependency injection, distributed planning, fault tolerance and architecture decisions"]]),
            code_section("Run the Lab", "python -m lab.runner list\npython -m lab.runner test-all", "bash"),
        ], "Validated"),
    }
    for id_, (title, href, summary, sections, *rest) in guide_specs.items():
        pages.append(page(id_, title, "Learn", href, summary, sections, status=rest[0] if rest else "Stable"))

    for category, title in [
        ("root", "Root API"),
        ("datasets", "Dataset API"),
        ("tokenizers", "Tokenizer API"),
        ("models", "Model API"),
        ("training", "Training API"),
        ("finetuning", "Fine-Tuning API"),
        ("checkpoints", "Checkpoint API"),
        ("evaluation", "Evaluation API"),
        ("inference", "Inference API"),
        ("inspection", "Inspection API"),
        ("agents", "Agent API"),
        ("security", "Security API"),
        ("peft", "PEFT API"),
        ("web", "Web API"),
        ("plugins", "Plugins API"),
        ("registry", "Registry API"),
        ("configuration", "Configuration API"),
        ("errors", "Errors API"),
    ]:
        entries = [entry for entry in API_CATALOG if entry["category"] == category]
        sections = [text_section("Overview", f"{title} documents the public ArcLM APIs in this category.")]
        for entry in entries:
            sections.append(text_section(entry["name"], f"{entry['summary']} Canonical import: {entry['canonicalImport']}. Fully qualified name: {entry['qualifiedName']}. Status: {entry['status']}."))
            sections.append(table_section(f"{entry['name']} parameters", ["Name", "Type", "Default"], entry.get("parameters", [])))
            sections.append(code_section(f"{entry['name']} example", entry["usage"]))
        pages.append(page(f"api-{category}", title, "Reference", f"api/{category}.html", f"Public {category} APIs.", sections))
    pages.append(page("api-index", "Public API Index", "Reference", "api/index.html", "Searchable public API catalog.", [
        text_section("How to use this page", "Use the search field to find public classes, functions and import paths. Deprecated imports are not recommended."),
    ]))
    pages.append(page("api-utilities", "Utilities API", "Reference", "api/utilities.html", "Small utility helpers.", [
        text_section("Status", "Utility modules are secondary. Prefer documented domain APIs for normal workflows."),
    ]))

    for page_id, href, title, tag in [
        ("examples-index", "examples/index.html", "Examples Hub", None),
        ("examples-datasets", "examples/dataset-examples.html", "Dataset Examples", "Dataset"),
        ("examples-tokenizers", "examples/tokenizer-examples.html", "Tokenizer Examples", "Tokenizer"),
        ("examples-models", "examples/model-examples.html", "Model Examples", "Model"),
        ("examples-training", "examples/training-examples.html", "Training Examples", "Training"),
        ("examples-evaluation", "examples/evaluation-examples.html", "Evaluation Examples", "Evaluation"),
        ("examples-generation", "examples/generation-examples.html", "Generation Examples", "Generation"),
        ("examples-agents", "examples/agent-examples.html", "Agent Examples", "Agent"),
        ("examples-security", "examples/security-examples.html", "Security Examples", "Security"),
    ]:
        sections = [text_section("How examples work", "Each example is embedded in the public site and available as a standalone download inside the site assets.")]
        if tag:
            sections.append(list_section("Included examples", [ex["title"] for ex in EXAMPLES if tag in ex["tags"]]))
        else:
            sections.append(list_section("Filters", ["Beginner", "Intermediate", "Advanced", "Dataset", "Tokenizer", "Model", "Training", "Fine-Tuning", "LoRA", "Checkpoint", "Evaluation", "Generation", "Inspection", "CLI", "Studio"]))
        pages.append(page(page_id, title, "Examples", href, "Self-contained examples.", sections))
    pages.append(page("examples-complete", "Complete Example Projects", "Examples", "examples/complete-projects.html", "Small downloadable public projects.", [
        text_section("What complete projects include", "Each project explains goal, files, dataset, tokenizer, model configuration, training configuration, expected behavior, evaluation and generation notes."),
        list_section("Projects", [project["title"] for project in COMPLETE_PROJECTS]),
    ]))

    pages.extend([
        page("modules", "Module Explorer", "Reference", "reference/modules.html", "Public-facing package organization.", [text_section("Use canonical modules", "Prefer arclm.datasets, arclm.tokenizers, arclm.models, arclm.training, arclm.checkpoints, arclm.evaluation, arclm.inference and arclm.inspection for new code.")]),
        page("classes", "Class Index", "Reference", "reference/classes.html", "Search and filter public classes.", [
            text_section("Coverage", "This page is generated from current public package exports and includes classes and public exceptions. Use the filters to narrow by subsystem or status."),
        ]),
        page("functions", "Function Index", "Reference", "reference/functions.html", "Search and filter public functions.", [
            text_section("Coverage", "This page is generated from current public package exports and includes synchronous and asynchronous public functions."),
        ]),
        page("supported-models", "Supported Models", "Reference", "reference/supported-models.html", "Editable model catalog with honest status labels.", [text_section("Status meanings", "Native means implemented directly by ArcLM. Compatible means handled through an optional integration boundary. Experimental means incomplete behavior. Unsupported means no current ArcLM path.")]),
        page("dataset-formats", "Dataset Formats", "Reference", "reference/dataset-formats.html", "Accepted local dataset shapes and examples.", [text_section("Choosing a format", "Use Python records for scripts, JSONL for instruction data, CSV for tables and TXT for tiny causal text experiments.")]),
        page("configuration", "Configuration Reference", "Reference", "reference/configuration.html", "Configuration fields users commonly set.", [text_section("Scope", "This reference covers public configuration fields for model, training, evaluation, generation and web workflows.")]),
        page("errors", "Errors Reference", "Reference", "reference/errors.html", "Stable user-facing errors and fixes.", [text_section("How to read errors", "Use the error code to find the meaning, common cause and recovery action.")]),
        page("optional-dependencies", "Optional Dependencies", "Reference", "reference/optional-dependencies.html", "Extras and optional integration boundaries.", [
            table_section("Extras", ["Extra", "Purpose"], INSTALL_COMMANDS),
            list_section("Policy", ["Base imports should stay lightweight.", "Hugging Face, PEFT, Web and speech dependencies are optional.", "Missing optional dependencies should fail with clear errors."]),
        ]),
        page("compatibility", "Compatibility", "Reference", "reference/compatibility.html", "Deprecated and compatibility APIs.", [
            text_section("Compatibility policy", "Deprecated imports remain documented with replacements while tests and users need them. New examples prefer canonical domain imports."),
            list_section("Compatibility surfaces", ["Root lazy imports", "MiniGPT alias for ArcLM", "legacy module aliases", "checkpoint compatibility helpers"]),
        ]),
        page("deprecated-apis", "Deprecated APIs", "Reference", "reference/deprecated-apis.html", "Migration notes for compatibility-only names.", [
            text_section("Migration rule", "Prefer canonical domain imports for new code. Deprecated names are compatibility-only and should not appear in new examples."),
            table_section("Known deprecated entries", ["Deprecated", "Replacement"], [["MiniGPT", "ArcLM"], ["arclm.configs compatibility exports", "domain configuration objects"], ["checkpoint_is_compatible_for_tuining", "checkpoint_is_compatible_for_continue_training where applicable"]]),
        ]),
        page("status-legend", "Status Legend", "Reference", "reference/status-legend.html", "Meaning of public status labels.", [table_section("Statuses", ["Status", "Meaning"], [["Stable", "Current reliable path."], ["Validated", "Executed by maintained tests or examples."], ["Beta", "Useful but still maturing."], ["Experimental", "Incomplete or environment-specific."], ["Integration-compatible", "Supported through an optional integration boundary."], ["Internal", "Not stable public API."], ["Deprecated", "Compatibility only."], ["Planned", "Documented future boundary."], ["Unsupported", "No current ArcLM path."]])]),
        page("limitations", "Limitations", "Reference", "reference/limitations.html", "What ArcLM does not currently claim.", [list_section("Current limits", ["No universal Hugging Face support", "No production serving", "No OpenAI-compatible API", "No streaming", "No attention maps", "No native BERT/T5/diffusion/multimodal models", "No RLHF, DPO or GRPO"])]),
        page("contributing-architecture", "Contributor Architecture", "Contributing", "contributing/architecture.html", "Repository structure and extension points.", [
            text_section("Ownership model", "The Python package is the source of truth for public APIs. The documentation site is generated from repository data plus curated guide copy."),
            list_section("Extension areas", ["Registries", "Plugins", "Events", "Dependency injection", "Lab challenges", "Examples suite"]),
        ]),
        page("contributing-testing", "Testing", "Contributing", "contributing/testing.html", "How to validate documentation and code changes.", [
            code_section("Core checks", "python -m compileall -q src tests examples lab\npython -m pytest -q\npython examples/run_examples.py run-verified\npython -m lab.runner test-all", "bash"),
        ]),
        page("contributing-docs", "Docs Build", "Contributing", "contributing/docs-build.html", "Build and validate the static documentation website.", [
            text_section("Docs ownership", "The `tools/build_documentation_site.py` generator owns the static site output in `documentation-site/`. Handwritten project notes remain in `docs/`."),
            code_section("Build docs", "python tools/build_documentation_site.py\npython -m pytest -q", "bash"),
            text_section("Feedback", "Each page exposes a local helpful button, copy-page-id action and optional issue link. No tracking service is used."),
        ]),
        page("version-current", "Current Version", "Releases", "releases/current.html", "Current documentation version and release state.", [
            text_section("Current docs", "This documentation describes the installed package version reported by the current repository. It does not change the package version."),
            list_section("Version strategy", ["Current docs are generated in place.", "Historical docs are included only when an accurate snapshot exists.", "Development docs should be generated from the active branch."]),
        ]),
        page("version-history", "Version History", "Releases", "releases/version-history.html", "Known documentation and package history.", [
            table_section("Artifacts", ["Version", "Status"], [["1.0.0", "Current installed package metadata and built artifact"], ["0.10.0", "Previous release-candidate documentation marker"], ["0.9.0", "Older built artifact retained in dist for comparison"]]),
        ]),
        page("migration", "Migration Guides", "Releases", "releases/migration.html", "Migration notes for current users.", [
            list_section("Recommended migrations", ["Use domain imports instead of legacy modules.", "Use numbered examples as canonical current examples.", "Treat external model and QLoRA paths as optional/manual until verified locally."]),
        ]),
    ])
    return pages


def search_index(pages: list[dict]) -> list[dict]:
    entries = []
    for page_ in pages:
        entries.append({"type": "page", "title": page_["title"], "description": page_["summary"], "page": page_["href"], "section": ""})
        for section in page_["sections"]:
            description = section.get("body") or section["title"]
            entries.append({"type": "section", "title": section["title"], "description": description, "page": page_["href"], "section": slug(section["title"])})
    for entry in API_CATALOG:
        entries.append({"type": "api", "title": entry["name"], "description": f"{entry['qualifiedName']} {entry['canonicalImport']} {entry['summary']}", "page": f"api/{entry['category']}.html", "section": slug(entry["name"])})
    for module in MODULE_CATALOG:
        entries.append({"type": "module", "title": module["importPath"], "description": f"{module['purpose']} {' '.join(module.get('exports', []))}", "page": "reference/modules.html", "section": "module-list"})
    for model in SUPPORTED_MODELS:
        entries.append({"type": "model", "title": model["name"], "description": model["notes"], "page": "reference/supported-models.html", "section": model["id"]})
    for fmt in DATASET_FORMATS:
        entries.append({"type": "dataset format", "title": fmt["name"], "description": fmt["whenToUse"], "page": "reference/dataset-formats.html", "section": fmt["id"]})
    for row in CONFIGURATION_CATALOG:
        area, field, type_, default, meaning = row
        entries.append({"type": "configuration", "title": f"{area}: {field}", "description": meaning or type_ or default, "page": "reference/configuration.html", "section": "configuration-fields"})
    for err in ERRORS:
        entries.append({"type": "error", "title": err[0], "description": err[1], "page": "reference/errors.html", "section": err[0]})
    for example in EXAMPLES:
        entries.append({"type": "example", "title": example["title"], "description": example["teaches"], "page": "examples/index.html", "section": "example-cards"})
    for project in COMPLETE_PROJECTS:
        entries.append({"type": "example project", "title": project["title"], "description": project["goal"], "page": "examples/complete-projects.html", "section": "complete-projects"})
    entries.extend(
        [
            {"type": "alias", "title": "SFT", "description": "Supervised Fine-Tuning guide and APIs", "page": "guides/fine-tuning.html", "section": "sft-contract"},
            {"type": "alias", "title": "checkpoint loading", "description": "Checkpoint load, inspect and validate workflows", "page": "guides/checkpoints.html", "section": "what-checkpoints-store"},
            {"type": "alias", "title": "tool_invalid_arguments", "description": "Agent tool argument validation errors", "page": "reference/errors.html", "section": "error-list"},
            {"type": "alias", "title": "response_only", "description": "Response-only SFT label masking", "page": "guides/fine-tuning.html", "section": "sft-contract"},
        ]
    )
    return entries


def slug(value: str) -> str:
    result = "".join(ch.lower() if ch.isalnum() else "-" for ch in value).strip("-")
    while "--" in result:
        result = result.replace("--", "-")
    return result or "section"


def rel_prefix(href: str) -> str:
    depth = len(Path(href).parts) - 1
    return "../" * depth


def html_page(page_: dict, pages: list[dict]) -> str:
    prefix = rel_prefix(page_["href"])
    page_order = [p["id"] for p in pages]
    index = page_order.index(page_["id"])
    prev_page = pages[index - 1] if index > 0 else None
    next_page = pages[index + 1] if index + 1 < len(pages) else None
    prev_attr = f'data-prev-title="{prev_page["title"]}" data-prev-href="{prefix}{prev_page["href"]}"' if prev_page else ""
    next_attr = f'data-next-title="{next_page["title"]}" data-next-href="{prefix}{next_page["href"]}"' if next_page else ""
    return dedent(
        f"""\
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{page_['title']} - ArcLM Docs</title>
            <link rel="stylesheet" href="{prefix}styles.css" />
          </head>
          <body data-page-id="{page_['id']}" data-page-href="{page_['href']}" {prev_attr} {next_attr}>
            <a class="skip-link" href="#content">Skip to content</a>
            <header class="mobile-bar">
              <button id="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false">Menu</button>
              <a href="{prefix}index.html" class="brand">ArcLM Docs</a>
              <label class="version-label" for="version-select">Version</label>
              <select id="version-select" aria-label="Documentation version"></select>
              <button id="theme-toggle" type="button">Theme</button>
            </header>
            <div class="layout">
              <aside id="site-nav" class="sidebar" aria-label="Documentation navigation"></aside>
              <main id="content" class="doc-main">
                <nav id="breadcrumbs" class="breadcrumbs" aria-label="Breadcrumb"></nav>
                <article id="page-content"></article>
                <section id="feedback" class="feedback" aria-label="Page feedback"></section>
                <nav id="prev-next" class="prev-next" aria-label="Previous and next pages"></nav>
              </main>
              <aside id="toc" class="toc" aria-label="Table of contents"></aside>
            </div>
            <div id="search-panel" class="search-panel" hidden></div>
            <script src="{prefix}data/site-navigation.js"></script>
            <script src="{prefix}data/api-catalog.js"></script>
            <script src="{prefix}data/module-catalog.js"></script>
            <script src="{prefix}data/examples-catalog.js"></script>
            <script src="{prefix}data/supported-models.js"></script>
            <script src="{prefix}data/dataset-formats.js"></script>
            <script src="{prefix}data/configuration-catalog.js"></script>
            <script src="{prefix}data/errors-catalog.js"></script>
            <script src="{prefix}data/search-index.js"></script>
            <script src="{prefix}docs-data.js"></script>
            <script src="{prefix}app.js"></script>
          </body>
        </html>
        """
    )


def write_js(name: str, global_name: str, value) -> None:
    (SITE / "data" / name).write_text(f"window.{global_name} = {json.dumps(value, indent=2)};\n", encoding="utf-8")


def write_assets() -> None:
    datasets = {
        "tiny-causal.txt": "ArcLM trains small native language models locally.\nTokens become ids.\n",
        "tiny-records.json": json.dumps([{"text": "ArcLM trains locally."}, {"text": "Checkpoints reload state."}], indent=2),
        "tiny-records.jsonl": '{"text":"ArcLM trains locally."}\n{"text":"Checkpoints reload state."}\n',
        "tiny-instructions.jsonl": '{"instruction":"Explain ArcLM.","response":"ArcLM is native-first."}\n{"instruction":"Explain tokens.","response":"Tokens become ids."}\n',
        "tiny-table.csv": "text,label\nArcLM trains locally,training\nTokens become ids,tokenization\n",
    }
    for filename, content in datasets.items():
        (SITE / "assets" / "datasets" / filename).write_text(content, encoding="utf-8")
    for ex in EXAMPLES:
        (SITE / ex["download"]).parent.mkdir(parents=True, exist_ok=True)
        (SITE / ex["download"]).write_text(ex["code"] + "\n", encoding="utf-8")
    legacy_assets = {
        "dataset-report.py": "from arclm.datasets import build_dataset_report\n\nprint(build_dataset_report([{\"text\": \"ArcLM trains locally\"}]).summary())\n",
        "evaluation-report.py": "from arclm.evaluation import calculate_perplexity\n\nprint(round(calculate_perplexity(2.0), 4))\n",
        "load-python-records.py": "from arclm.datasets import load_dataset\n\nprint(load_dataset([{\"text\": \"ArcLM\"}]))\n",
        "model-support-matrix.py": "from arclm.models import model_support_matrix\n\nprint(model_support_matrix())\n",
        "pipeline-inspection.py": "from arclm.inspection import inspect_text\nfrom arclm.models import ArcLM\nfrom arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(\"ArcLM trains\")\nmodel = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)\nprint(inspect_text(model=model, tokenizer=tokenizer, text=\"ArcLM\").to_dict())\n",
        "tiny-native-model.py": "from arclm.models import ArcLM\n\nprint(ArcLM(vocab_size=16, embed_dim=8, block_size=8, num_blocks=1))\n",
        "validate-sft.py": "from arclm.finetuning import validate_sft_records\n\nprint(validate_sft_records([{\"instruction\": \"Hi\", \"response\": \"Hello\"}], strict=False).summary())\n",
        "word-tokenizer.py": "from arclm.tokenizers import Tokenizer\n\ntokenizer = Tokenizer(max_vocab=16)\ntokenizer.build(\"ArcLM trains locally\")\nprint(tokenizer.encode_text(\"ArcLM\"))\n",
        "tiny-text-model/train.py": "from arclm.models import ArcLM\n\nprint(ArcLM(vocab_size=16, embed_dim=8, block_size=8, num_blocks=1))\n",
        "tiny-text-model/evaluate.py": "from arclm.evaluation import calculate_perplexity\n\nprint(calculate_perplexity(2.0))\n",
        "tiny-text-model/generate.py": "from arclm.inference import Generator\n\nprint(Generator)\n",
        "instruction-finetuning/validate.py": "from arclm.finetuning import validate_sft_records\n\nprint(validate_sft_records([{\"instruction\": \"Hi\", \"response\": \"Hello\"}], strict=False).valid_count)\n",
        "pipeline-inspection-project/inspect.py": "from arclm.inspection import inspect_text\n\nprint(inspect_text)\n",
    }
    legacy_data = {
        "tiny-text-model/data.jsonl": '{"text":"ArcLM trains locally."}\n{"text":"Tiny models teach the workflow."}\n',
        "tiny-text-model/configuration.json": json.dumps({"vocab_size": 32, "embed_dim": 16, "block_size": 8, "num_blocks": 1}, indent=2),
        "instruction-finetuning/instructions.jsonl": '{"instruction":"Explain ArcLM.","response":"ArcLM is native-first."}\n',
        "instruction-finetuning/configuration.json": json.dumps({"format": "instruction_response", "device": "cpu"}, indent=2),
        "pipeline-inspection-project/configuration.json": json.dumps({"max_new_tokens": 1, "include_values": False}, indent=2),
    }
    for relative, content in {**legacy_assets, **legacy_data}.items():
        path = SITE / "assets" / "examples" / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


def validate_model_catalog() -> None:
    seen_ids: set[str] = set()
    for model in SUPPORTED_MODELS:
        for key in ["id", "name", "provider", "family", "status", "tasks", "testedOperations", "optionalDependencies", "external", "notes"]:
            if key not in model:
                raise ValueError(f"model entry missing {key}: {model}")
        if model["status"] not in MODEL_STATUSES:
            raise ValueError(f"unknown model status: {model['status']}")
        if model["id"] in seen_ids:
            raise ValueError(f"duplicate model id: {model['id']}")
        seen_ids.add(model["id"])


def validate_api_catalog() -> None:
    seen: set[str] = set()
    for entry in API_CATALOG:
        unique_name = entry.get("qualifiedName", entry["importPath"])
        if unique_name in seen:
            raise ValueError(f"duplicate API entry: {unique_name}")
        seen.add(unique_name)
        for key in ["name", "importPath", "kind", "category", "status", "summary", "signature", "usage"]:
            if key not in entry:
                raise ValueError(f"api entry missing {key}: {entry}")
        if entry["status"] not in STATUSES:
            raise ValueError(f"unknown API status: {entry['status']}")


def build() -> None:
    global API_CATALOG, MODULE_CATALOG, EXAMPLES, COMPLETE_PROJECTS
    API_CATALOG = build_api_catalog()
    MODULE_CATALOG = build_module_catalog()
    EXAMPLES, COMPLETE_PROJECTS = build_examples_catalog()
    validate_model_catalog()
    validate_api_catalog()
    clean()
    pages = build_pages()
    page_ids = [p["id"] for p in pages]
    if len(page_ids) != len(set(page_ids)):
        raise ValueError("duplicate page id")

    for page_ in pages:
        path = SITE / page_["href"]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html_page(page_, pages), encoding="utf-8")

    import arclm

    docs_data = {
        "version": arclm.__version__,
        "versions": [
            {"label": f"Current ({arclm.__version__})", "href": "index.html", "current": True},
            {"label": "0.10 documentation marker", "href": "releases/version-history.html", "current": False},
            {"label": "Development strategy", "href": "contributing/docs-build.html", "current": False},
        ],
        "statuses": STATUSES,
        "summary": public_api_summary(API_CATALOG),
        "pages": pages,
    }
    (SITE / "docs-data.js").write_text(f"window.ARCLM_DOCS = {json.dumps(docs_data, indent=2)};\n", encoding="utf-8")
    write_js("site-navigation.js", "ARCLM_NAVIGATION", NAVIGATION)
    write_js("api-catalog.js", "ARCLM_API_CATALOG", API_CATALOG)
    write_js("module-catalog.js", "ARCLM_MODULE_CATALOG", MODULE_CATALOG)
    write_js("examples-catalog.js", "ARCLM_EXAMPLES", {"examples": EXAMPLES, "projects": COMPLETE_PROJECTS})
    write_js("supported-models.js", "ARCLM_SUPPORTED_MODELS", SUPPORTED_MODELS)
    write_js("dataset-formats.js", "ARCLM_DATASET_FORMATS", DATASET_FORMATS)
    write_js("configuration-catalog.js", "ARCLM_CONFIGURATION_CATALOG", CONFIGURATION_CATALOG)
    write_js("errors-catalog.js", "ARCLM_ERRORS", ERRORS)
    write_js("search-index.js", "ARCLM_SEARCH_INDEX", search_index(pages))
    write_assets()
    write_static_files()


def write_static_files() -> None:
    (SITE / "styles.css").write_text(STYLES, encoding="utf-8")
    (SITE / "app.js").write_text(APP_JS, encoding="utf-8")


STYLES = r"""
:root {
  color-scheme: light;
  --bg: #f7f8fb;
  --panel: #ffffff;
  --panel-2: #eef2f7;
  --text: #17202a;
  --muted: #5d6878;
  --border: #d8dee8;
  --accent: #1d6f64;
  --accent-2: #284b8f;
  --code-bg: #101820;
  --code: #f7fafc;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #101418;
  --panel: #171d23;
  --panel-2: #202832;
  --text: #f3f6fa;
  --muted: #b3bfcc;
  --border: #33404d;
  --accent: #61c8b3;
  --accent-2: #8ab4ff;
  --code-bg: #090d12;
  --code: #f7fafc;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.55;
}
a { color: var(--accent-2); }
.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 20;
  background: var(--panel);
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
}
.skip-link:focus { top: 1rem; }
.mobile-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: auto 1fr auto minmax(8rem, auto) auto;
  gap: 0.75rem;
  align-items: center;
  min-height: 3.5rem;
  padding: 0.5rem 1rem;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
}
.brand { color: var(--text); font-weight: 800; text-decoration: none; }
.version-label { color: var(--muted); font-weight: 700; }
button, input, select {
  font: inherit;
  color: var(--text);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
}
button { min-height: 2.3rem; padding: 0.45rem 0.75rem; cursor: pointer; }
button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent) 35%, transparent);
  outline-offset: 2px;
}
.layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 240px;
  gap: 1.25rem;
  max-width: 1560px;
  margin: 0 auto;
  padding: 1rem;
}
.sidebar, .toc {
  position: sticky;
  top: 4.5rem;
  align-self: start;
  max-height: calc(100vh - 5rem);
  overflow: auto;
}
.sidebar {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
}
.nav-search { width: 100%; min-height: 2.4rem; padding: 0.45rem 0.65rem; margin-bottom: 0.75rem; }
.nav-group { margin-bottom: 0.45rem; }
.nav-group summary { cursor: pointer; font-weight: 800; color: var(--muted); }
.nav-link {
  display: block;
  padding: 0.35rem 0.45rem;
  margin: 0.12rem 0;
  border-radius: 6px;
  color: var(--text);
  text-decoration: none;
}
.nav-link[aria-current="page"], .nav-link:hover {
  background: var(--panel-2);
  color: var(--accent);
}
.doc-main {
  min-width: 0;
  max-width: 920px;
  margin: 0 auto;
}
.doc-article {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: clamp(1rem, 3vw, 2rem);
  animation: rise 180ms ease-out both;
}
.breadcrumbs, .prev-next {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 0 0 0.75rem;
  color: var(--muted);
}
h1 { margin: 0; font-size: clamp(2.1rem, 6vw, 4.2rem); line-height: 1.08; }
h2 { margin-top: 2rem; font-size: 1.55rem; }
h3 { margin-top: 1.25rem; }
.summary { color: var(--muted); font-size: 1.1rem; }
.status {
  display: inline-flex;
  width: fit-content;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: var(--panel-2);
  color: var(--accent-2);
  font-size: 0.78rem;
  font-weight: 800;
}
.callout {
  padding: 1rem;
  border-left: 4px solid var(--accent);
  background: var(--panel-2);
  border-radius: 8px;
}
pre {
  position: relative;
  overflow: auto;
  margin: 0.75rem 0;
  padding: 2.4rem 1rem 1rem;
  background: var(--code-bg);
  color: var(--code);
  border-radius: 8px;
}
code { font-family: "Cascadia Mono", "SFMono-Regular", Consolas, monospace; }
.code-tools {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  display: flex;
  gap: 0.35rem;
}
.code-label {
  position: absolute;
  top: 0.55rem;
  left: 0.75rem;
  color: #bcd0e5;
  font-size: 0.78rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  display: block;
  overflow-x: auto;
}
th, td {
  border: 1px solid var(--border);
  padding: 0.55rem;
  text-align: left;
  vertical-align: top;
}
.card-grid, .model-grid, .example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}
.card {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--panel);
}
.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}
.filter-row input, .filter-row select { width: 100%; min-height: 2.4rem; padding: 0.45rem 0.65rem; }
.toc {
  color: var(--muted);
  font-size: 0.9rem;
}
.toc a { display: block; margin: 0.3rem 0; text-decoration: none; }
.prev-next { justify-content: space-between; margin-top: 1rem; }
.search-panel {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: min(520px, calc(100vw - 2rem));
  max-height: 60vh;
  overflow: auto;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 20px 50px rgb(0 0 0 / 20%);
  z-index: 30;
}
.feedback {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--panel);
}
.feedback h2 { margin-top: 0; font-size: 1.1rem; }
.feedback-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.button-link {
  display: inline-flex;
  align-items: center;
  min-height: 2.3rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text);
  background: var(--panel);
}
.external::after { content: " external"; font-size: 0.8em; color: var(--muted); }
@keyframes rise {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 1100px) {
  .mobile-bar { grid-template-columns: auto 1fr auto; }
  .version-label, #version-select { display: none; }
  .layout { grid-template-columns: 1fr; }
  .sidebar {
    position: fixed;
    inset: 3.5rem auto 0 0;
    width: min(340px, 88vw);
    z-index: 15;
    transform: translateX(-105%);
    transition: transform 160ms ease;
    border-radius: 0;
  }
  body.nav-open .sidebar { transform: translateX(0); }
  .toc { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
"""


APP_JS = r"""
(function () {
  const docs = window.ARCLM_DOCS;
  const nav = window.ARCLM_NAVIGATION;
  const api = window.ARCLM_API_CATALOG || [];
  const modules = window.ARCLM_MODULE_CATALOG || [];
  const examplesData = window.ARCLM_EXAMPLES || { examples: [], projects: [] };
  const models = window.ARCLM_SUPPORTED_MODELS || [];
  const datasetFormats = window.ARCLM_DATASET_FORMATS || [];
  const configRows = window.ARCLM_CONFIGURATION_CATALOG || [];
  const errors = window.ARCLM_ERRORS || [];
  const searchIndex = window.ARCLM_SEARCH_INDEX || [];
  const pageId = document.body.dataset.pageId;
  const page = docs.pages.find((item) => item.id === pageId) || docs.pages[0];
  const prefix = relativePrefix(document.body.dataset.pageHref || "index.html");

  function relativePrefix(href) {
    const depth = href.split("/").length - 1;
    return "../".repeat(depth);
  }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  }
  function codeBlock(code, language, filename) {
    const download = filename ? `<a class="download-link" href="${esc(prefix + filename)}" download>Download</a>` : "";
    return `<pre><span class="code-label">${esc(language || "text")}</span><span class="code-tools"><button type="button" class="copy-code">Copy</button>${download}</span><code>${esc(code)}</code></pre>`;
  }
  function table(columns, rows) {
    return `<table><thead><tr>${columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }
  function list(items) {
    return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }
  function renderNav() {
    const container = document.querySelector("#site-nav");
    container.innerHTML = `<input id="site-search" class="nav-search" type="search" placeholder="Search docs" aria-label="Search documentation" />` + nav.map((group) => {
      const open = group.items.some((item) => item.id === pageId) ? " open" : "";
      return `<details class="nav-group"${open}><summary>${esc(group.group)}</summary>${group.items.map((item) => `<a class="nav-link" href="${esc(prefix + item.href)}" ${item.id === pageId ? 'aria-current="page"' : ""}>${esc(item.title)}</a>`).join("")}</details>`;
    }).join("");
    document.querySelector("#site-search").addEventListener("input", handleSearch);
  }
  function renderPage() {
    const article = document.querySelector("#page-content");
    article.className = "doc-article";
    article.innerHTML = `<span class="status">${esc(page.status)}</span><h1>${esc(page.title)}</h1><p class="summary">${esc(page.summary)}</p>${page.sections.map(renderSection).join("")}${specialContent()}`;
    document.querySelector("#breadcrumbs").innerHTML = `<a href="${prefix}index.html">ArcLM Docs</a><span>/</span><span>${esc(page.title)}</span>`;
    renderToc();
    renderPrevNext();
    renderFeedback();
    enhanceCodeBlocks();
  }
  function renderSection(section) {
    const id = slug(section.title);
    let html = `<section id="${id}"><h2>${esc(section.title)}</h2>`;
    if (section.body) html += `<p>${esc(section.body)}</p>`;
    if (section.items) html += list(section.items);
    if (section.table) html += table(section.table.columns, section.table.rows);
    if (section.code) html += codeBlock(section.code, section.language, section.filename);
    html += "</section>";
    return html;
  }
  function specialContent() {
    if (pageId === "api-index") return apiIndex();
    if (pageId.startsWith("api-") && pageId !== "api-index") return apiDetails(pageId.replace("api-", ""));
    if (pageId === "modules") return moduleExplorer();
    if (pageId === "classes") return apiKindIndex("class", "Public classes");
    if (pageId === "functions") return apiKindIndex("function", "Public functions");
    if (pageId === "deprecated-apis") return apiStatusIndex("Deprecated", "Deprecated public APIs");
    if (pageId === "supported-models") return supportedModels();
    if (pageId === "dataset-formats") return datasetFormatsView();
    if (pageId === "configuration") return configurationView();
    if (pageId === "errors") return errorsView();
    if (pageId.startsWith("examples-")) return examplesView();
    return "";
  }
  function apiIndex() {
    return `<section id="api-search"><h2>Search APIs</h2><div class="filter-row"><input id="api-filter" type="search" placeholder="Search API names, imports and categories" /></div><div id="api-results" class="card-grid"></div></section>`;
  }
  function apiCard(entry) {
    return `<article class="card api-card" id="${slug(entry.name)}"><span class="status">${esc(entry.status)}</span><h3>${esc(entry.name)}</h3><p><strong>Fully qualified:</strong> <code>${esc(entry.qualifiedName || entry.importPath)}</code></p><p><strong>Canonical import:</strong> <code>${esc(entry.canonicalImport || entry.importPath)}</code></p>${entry.alternativeImport ? `<p><strong>Alternative import:</strong> <code>${esc(entry.alternativeImport)}</code></p>` : ""}<p>${esc(entry.summary)}</p><p><strong>Signature:</strong> <code>${esc(entry.signature)}</code></p>${table(["Parameter", "Type", "Default"], entry.parameters || [])}${entry.members && entry.members.length ? table(["Member", "Purpose"], entry.members) : ""}<p><strong>Returns:</strong> ${esc(entry.returns || "See docstring.")}</p><p><strong>Raises:</strong> ${esc((entry.errors || []).join(", ") || "No documented public errors.")}</p><p><strong>Optional dependencies:</strong> ${esc(entry.optionalDependencies || "None")}</p><p><strong>Security:</strong> ${esc(entry.security || "Follow subsystem guide.")}</p><p><strong>Limitations:</strong> ${esc(entry.limitations || "None listed.")}</p>${codeBlock(entry.usage, "python")}</article>`;
  }
  function apiDetails(category) {
    const entries = api.filter((entry) => entry.category === category);
    return `<section id="api-members"><h2>API members</h2><div class="card-grid">${entries.map(apiCard).join("") || "<p>No public entries in this category yet.</p>"}</div></section>`;
  }
  function apiKindIndex(kind, title) {
    const entries = api.filter((entry) => entry.kind === kind || (kind === "function" && entry.kind === "async function") || (kind === "class" && entry.kind === "exception"));
    return `<section id="${slug(title)}"><h2>${esc(title)}</h2><div class="filter-row"><input id="kind-filter" type="search" placeholder="Search ${esc(title.toLowerCase())}" /><select id="kind-status"><option value="">All statuses</option>${docs.statuses.map((status) => `<option>${esc(status)}</option>`).join("")}</select></div><div id="kind-results" class="card-grid"></div></section>`;
  }
  function apiStatusIndex(status, title) {
    const entries = api.filter((entry) => entry.status === status);
    return `<section id="${slug(title)}"><h2>${esc(title)}</h2><div class="card-grid">${entries.map(apiCard).join("") || "<p>No deprecated public APIs are documented.</p>"}</div></section>`;
  }
  function moduleExplorer() {
    return `<section id="module-list"><h2>Modules</h2><div class="card-grid">${modules.map((mod) => `<article class="card"><span class="status">${esc(mod.status)}</span><h3><code>${esc(mod.importPath)}</code></h3><p>${esc(mod.purpose)}</p><p><strong>Use when:</strong> ${esc(mod.whenToUse)}</p><p><strong>Public exports:</strong> ${esc(mod.exportCount || 0)}</p><p><strong>Examples:</strong> ${esc((mod.examples || []).join(", ") || "None mapped")}</p><p><strong>Optional dependencies:</strong> ${esc(mod.optionalDependencies)}</p><p><strong>Limitations:</strong> ${esc(mod.limitations || "")}</p></article>`).join("")}</div></section>`;
  }
  function supportedModels() {
    const providers = Array.from(new Set(models.map((m) => m.provider)));
    const families = Array.from(new Set(models.map((m) => m.family)));
    const tasks = Array.from(new Set(models.flatMap((m) => m.tasks || [])));
    const extras = Array.from(new Set(models.flatMap((m) => m.optionalDependencies || [])));
    return `<section id="model-catalog"><h2>Model catalog</h2><div class="filter-row"><input id="model-filter" type="search" placeholder="Search models" /><select id="model-status"><option value="">All statuses</option><option value="native">Native</option><option value="tested">Tested</option><option value="compatible">Compatible by integration</option><option value="experimental">Experimental</option><option value="unsupported">Unsupported</option></select><select id="model-provider"><option value="">All providers</option>${providers.map((p) => `<option>${esc(p)}</option>`).join("")}</select><select id="model-family"><option value="">All families</option>${families.map((f) => `<option>${esc(f)}</option>`).join("")}</select><select id="model-task"><option value="">All tasks</option>${tasks.map((task) => `<option>${esc(task)}</option>`).join("")}</select><select id="model-extra"><option value="">All extras</option>${extras.map((extra) => `<option>${esc(extra)}</option>`).join("")}</select></div><div id="model-results" class="model-grid"></div><h2>Comparison table</h2><div id="model-table"></div></section>`;
  }
  function datasetFormatsView() {
    return `<section id="formats"><h2>Formats</h2>${datasetFormats.map((fmt) => `<article class="card" id="${esc(fmt.id)}"><span class="status">${esc(fmt.status)}</span><h3>${esc(fmt.name)}</h3><p><strong>Structure:</strong> ${esc(fmt.structure)}</p><p><strong>Required fields:</strong> ${esc(fmt.requiredFields)}</p><p><strong>When to use:</strong> ${esc(fmt.whenToUse)}</p>${list(fmt.commonMistakes)}${codeBlock(fmt.usage, "python")}</article>`).join("")}<h2>Downloadable tiny datasets</h2>${list(["assets/datasets/tiny-causal.txt", "assets/datasets/tiny-records.json", "assets/datasets/tiny-records.jsonl", "assets/datasets/tiny-instructions.jsonl", "assets/datasets/tiny-table.csv"].map((href) => `<a href="${prefix + href}" download>${href.split("/").pop()}</a>`))}</section>`;
  }
  function configurationView() {
    return `<section id="configuration-fields"><h2>Fields</h2>${table(["Area", "Field", "Type", "Default", "Meaning"], configRows)}</section>`;
  }
  function errorsView() {
    return `<section id="error-list"><h2>Error codes</h2>${table(["Code", "Meaning", "How to fix", "Where it appears"], errors)}</section>`;
  }
  function examplesView() {
    const isComplete = pageId === "examples-complete";
    if (isComplete) {
      return `<section id="complete-projects"><h2>Projects</h2><div class="card-grid">${examplesData.projects.map((project) => `<article class="card"><h3>${esc(project.title)}</h3><p>${esc(project.goal)}</p>${table(["Part", "Value"], [["Files", project.files.join(", ")], ["Dataset", project.dataset], ["Tokenizer", project.tokenizer], ["Model", project.modelConfiguration], ["Training", project.trainingConfiguration], ["Expected output", project.expectedOutput]])}<a href="${prefix + project.download}" download>Download starter file</a></article>`).join("")}</div></section>`;
    }
    const tags = Array.from(new Set(examplesData.examples.flatMap((example) => example.tags || [])));
    return `<section id="example-cards"><h2>Examples</h2><div class="filter-row"><input id="example-filter" type="search" placeholder="Search examples" /><select id="example-difficulty"><option value="">All difficulties</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><select id="example-tag"><option value="">All topics</option>${tags.map((tag) => `<option>${esc(tag)}</option>`).join("")}</select></div><div id="example-results" class="example-grid"></div></section>`;
  }
  function renderToc() {
    const links = Array.from(document.querySelectorAll("#page-content h2")).map((heading) => `<a href="#${heading.parentElement.id}">${esc(heading.textContent)}</a>`);
    document.querySelector("#toc").innerHTML = links.length ? `<strong>On this page</strong>${links.join("")}` : "";
  }
  function renderPrevNext() {
    const prevTitle = document.body.dataset.prevTitle;
    const prevHref = document.body.dataset.prevHref;
    const nextTitle = document.body.dataset.nextTitle;
    const nextHref = document.body.dataset.nextHref;
    document.querySelector("#prev-next").innerHTML = `${prevTitle ? `<a href="${esc(prevHref)}">Previous: ${esc(prevTitle)}</a>` : "<span></span>"}${nextTitle ? `<a href="${esc(nextHref)}">Next: ${esc(nextTitle)}</a>` : "<span></span>"}`;
  }
  function renderFeedback() {
    const issueTitle = encodeURIComponent(`Docs feedback: ${page.title}`);
    const issueBody = encodeURIComponent(`Page: ${page.title}\nVersion: ${docs.version}\nURL: ${page.href}\n\nDescribe the issue or improvement:\n`);
    document.querySelector("#feedback").innerHTML = `<h2>Page feedback</h2><p>This local widget does not submit or track anything automatically.</p><div class="feedback-actions"><button type="button" id="helpful-yes">Helpful</button><button type="button" id="copy-page-id">Copy page ID</button><a class="button-link external" target="_blank" rel="noopener noreferrer" href="https://github.com/ahmad-al-dibo/arclm/issues/new?title=${issueTitle}&body=${issueBody}">Open issue draft</a></div><p id="feedback-status" role="status"></p>`;
    const status = document.querySelector("#feedback-status");
    document.querySelector("#helpful-yes").addEventListener("click", () => {
      status.textContent = "Thanks. Stored only in this browser session.";
      try { sessionStorage.setItem(`arclm-docs-helpful-${page.id}`, "true"); } catch {}
    });
    document.querySelector("#copy-page-id").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(`${page.id} (${docs.version})`);
        status.textContent = "Page ID copied.";
      } catch {
        status.textContent = `${page.id} (${docs.version})`;
      }
    });
  }
  function enhanceCodeBlocks() {
    document.querySelectorAll(".copy-code").forEach((button) => {
      button.addEventListener("click", async () => {
        const code = button.closest("pre").querySelector("code").textContent;
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copied";
        } catch {
          button.textContent = "Copy unavailable";
        }
        setTimeout(() => { button.textContent = "Copy"; }, 1200);
      });
    });
  }
  function setupSpecialFilters() {
    const apiFilter = document.querySelector("#api-filter");
    if (apiFilter) {
      const results = document.querySelector("#api-results");
      const draw = () => {
        const q = apiFilter.value.toLowerCase();
        results.innerHTML = api.filter((entry) => JSON.stringify(entry).toLowerCase().includes(q)).map(apiCard).join("");
        enhanceCodeBlocks();
      };
      apiFilter.addEventListener("input", draw);
      draw();
    }
    const kindFilter = document.querySelector("#kind-filter");
    if (kindFilter) {
      const results = document.querySelector("#kind-results");
      const status = document.querySelector("#kind-status");
      const wantClass = pageId === "classes";
      const draw = () => {
        const q = kindFilter.value.toLowerCase();
        const s = status.value;
        const filtered = api.filter((entry) => {
          const kindMatches = wantClass ? (entry.kind === "class" || entry.kind === "exception") : (entry.kind === "function" || entry.kind === "async function");
          return kindMatches && (!s || entry.status === s) && (!q || JSON.stringify(entry).toLowerCase().includes(q));
        });
        results.innerHTML = filtered.map(apiCard).join("");
        enhanceCodeBlocks();
      };
      kindFilter.addEventListener("input", draw);
      status.addEventListener("change", draw);
      draw();
    }
    const modelFilter = document.querySelector("#model-filter");
    if (modelFilter) {
      const draw = () => {
        const q = modelFilter.value.toLowerCase();
        const status = document.querySelector("#model-status").value;
        const provider = document.querySelector("#model-provider").value;
        const family = document.querySelector("#model-family").value;
        const task = document.querySelector("#model-task").value;
        const extra = document.querySelector("#model-extra").value;
        const filtered = models.filter((model) => (!q || JSON.stringify(model).toLowerCase().includes(q)) && (!status || model.status === status) && (!provider || model.provider === provider) && (!family || model.family === family) && (!task || (model.tasks || []).includes(task)) && (!extra || (model.optionalDependencies || []).includes(extra)));
        document.querySelector("#model-results").innerHTML = filtered.map((model) => `<article class="card" id="${esc(model.id)}"><span class="status">${esc(model.status)}</span><h3>${esc(model.name)}</h3><p>${model.modelId ? `<code>${esc(model.modelId)}</code> <button type="button" class="copy-model" data-model="${esc(model.modelId)}">Copy</button>` : "Native ArcLM model"}</p><p>${esc(model.notes)}</p><p><strong>Tasks:</strong> ${esc(model.tasks.join(", "))}</p><p><strong>Operations:</strong> ${esc(model.testedOperations.join(", ") || "None")}</p><p><strong>Required extras:</strong> ${esc(model.optionalDependencies.join(", ") || "None")}</p><p><strong>Limitations:</strong> ${esc((model.limitations || []).join(", ") || "None listed")}</p>${model.url ? `<a class="external" target="_blank" rel="noopener noreferrer" href="${esc(model.url)}">Model page</a>` : ""}</article>`).join("");
        document.querySelector("#model-table").innerHTML = table(["Model", "Provider", "Model ID", "Status", "Tasks", "Operations", "Extras"], filtered.map((model) => [model.name, model.provider, model.modelId || "Native", model.status, model.tasks.join(", "), model.testedOperations.join(", ") || "None", model.optionalDependencies.join(", ") || "None"]));
        document.querySelectorAll(".copy-model").forEach((button) => button.addEventListener("click", async () => { try { await navigator.clipboard.writeText(button.dataset.model); button.textContent = "Copied"; } catch { button.textContent = "Copy unavailable"; } }));
      };
      ["input", "change"].forEach((event) => {
        modelFilter.addEventListener(event, draw);
        document.querySelector("#model-status").addEventListener(event, draw);
        document.querySelector("#model-provider").addEventListener(event, draw);
        document.querySelector("#model-family").addEventListener(event, draw);
        document.querySelector("#model-task").addEventListener(event, draw);
        document.querySelector("#model-extra").addEventListener(event, draw);
      });
      draw();
    }
    const exampleFilter = document.querySelector("#example-filter");
    if (exampleFilter) {
      const results = document.querySelector("#example-results");
      const difficulty = document.querySelector("#example-difficulty");
      const tag = document.querySelector("#example-tag");
      const draw = () => {
        const q = exampleFilter.value.toLowerCase();
        const d = difficulty.value;
        const t = tag.value;
        results.innerHTML = examplesData.examples.filter((ex) => (!q || JSON.stringify(ex).toLowerCase().includes(q)) && (!d || ex.difficulty === d) && (!t || (ex.tags || []).includes(t))).map((ex) => `<article class="card"><h3>${esc(ex.title)}</h3><span class="status">${esc(ex.difficulty)}</span><p>${esc(ex.teaches)}</p><p><strong>Runtime:</strong> ${esc(ex.runtime)}. <strong>Device:</strong> ${esc(ex.device)}.</p><p><strong>Tags:</strong> ${esc(ex.tags.join(", "))}</p>${codeBlock(ex.code, "python", ex.download)}</article>`).join("");
        enhanceCodeBlocks();
      };
      exampleFilter.addEventListener("input", draw);
      difficulty.addEventListener("change", draw);
      tag.addEventListener("change", draw);
      draw();
    }
  }
  function handleSearch(event) {
    const q = event.target.value.trim().toLowerCase();
    const panel = document.querySelector("#search-panel");
    if (!q) {
      panel.hidden = true;
      return;
    }
    const results = searchIndex.filter((item) => JSON.stringify(item).toLowerCase().includes(q)).slice(0, 30);
    panel.hidden = false;
    panel.innerHTML = `<h2>Search results</h2>${results.map((item) => `<a class="card" href="${prefix + item.page}${item.section ? "#" + item.section : ""}"><strong>${esc(item.title)}</strong><br /><span>${esc(item.type)} - ${esc(item.description)}</span></a>`).join("") || "<p>No results.</p>"}`;
  }
  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem("arclm-doc-theme"); } catch {}
    if (stored === "dark" || stored === "light") document.documentElement.dataset.theme = stored;
    document.querySelector("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("arclm-doc-theme", next); } catch {}
    });
  }
  function initVersionSelector() {
    const selector = document.querySelector("#version-select");
    const versions = docs.versions || [{ label: `Current (${docs.version})`, href: "index.html", current: true }];
    selector.innerHTML = versions.map((version) => `<option value="${esc(version.href)}" ${version.current ? "selected" : ""}>${esc(version.label)}</option>`).join("");
    selector.addEventListener("change", () => {
      const selected = selector.value;
      if (selected && selected !== "index.html") window.location.href = prefix + selected;
    });
  }
  document.querySelector("#nav-toggle").addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    document.querySelector("#nav-toggle").setAttribute("aria-expanded", String(open));
  });
  initTheme();
  initVersionSelector();
  renderNav();
  renderPage();
  setupSpecialFilters();
})();
"""


if __name__ == "__main__":
    build()
