"""Manifest- en configuratiehulpen voor de modelvoorbeelden."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping


EXAMPLE_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = EXAMPLE_ROOT / "models.json"
RESULTS_DIR = EXAMPLE_ROOT / ".local_results"

OPERATION_NAMES = [
    "metadata_access",
    "download",
    "tokenizer_load",
    "model_load",
    "forward",
    "text_generation",
    "chat_template",
    "dataset_preparation",
    "full_sft",
    "peft_sft",
    "save",
    "reload",
    "evaluation",
    "benchmark",
    "agent_adapter",
    "structured_tool_calling",
    "web_application",
    "security_inspection",
    "offline_reload",
]

STATUS_VALUES = {
    "verified",
    "verified_cpu",
    "verified_gpu",
    "verified_manual",
    "experimental",
    "dependency_missing",
    "gated",
    "resource_blocked",
    "unsupported",
    "failed",
    "not_tested",
}


def load_manifest(path: Path = MANIFEST_PATH) -> Dict[str, Any]:
    """Laad het modelmanifest als gestructureerde data."""

    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, payload: Mapping[str, Any]) -> None:
    """Schrijf JSON deterministisch en leesbaar weg."""

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def models_by_id(manifest: Mapping[str, Any] | None = None) -> Dict[str, Dict[str, Any]]:
    """Indexeer manifestmodellen op stabiele model-ID."""

    data = manifest or load_manifest()
    return {str(item["id"]): dict(item) for item in data.get("models", [])}


def get_model(model_id: str, manifest: Mapping[str, Any] | None = None) -> Dict[str, Any]:
    """Zoek een model op en geef een duidelijke fout bij onbekende IDs."""

    models = models_by_id(manifest)
    if model_id not in models:
        raise ValueError(f"Onbekend model-id: {model_id!r}. Gebruik de IDs uit models.json.")
    return models[model_id]


def validate_manifest(manifest: Mapping[str, Any] | None = None) -> List[str]:
    """Controleer model-ID's, statuswaarden en verplichte operatievelden."""

    data = manifest or load_manifest()
    errors: List[str] = []
    seen = set()
    for item in data.get("models", []):
        model_id = item.get("id")
        if not model_id:
            errors.append("Een model mist een id.")
            continue
        if model_id in seen:
            errors.append(f"Dubbele model-id: {model_id}.")
        seen.add(model_id)
        operations = item.get("operations") or {}
        for name in OPERATION_NAMES:
            if name not in operations:
                errors.append(f"{model_id}: operatie {name} ontbreekt.")
        for name, status in operations.items():
            if status not in STATUS_VALUES:
                errors.append(f"{model_id}: onbekende status {status!r} voor {name}.")
        if item.get("requires_remote_code") is True:
            errors.append(f"{model_id}: remote code is niet toegestaan in deze suite.")
    return errors


def verified_for_core_usage(model: Mapping[str, Any]) -> bool:
    """Bepaal of een model echt telt als kern-geverifieerd."""

    operations = model.get("operations") or {}
    accepted = {"verified", "verified_cpu", "verified_gpu", "verified_manual"}
    return all(
        operations.get(name) in accepted
        for name in ["download", "tokenizer_load", "model_load", "forward", "text_generation"]
    ) and operations.get("reload") in accepted.union({"not_tested"})


def iter_models(manifest: Mapping[str, Any] | None = None) -> Iterable[Dict[str, Any]]:
    """Itereer over manifestmodellen in vaste volgorde."""

    yield from (manifest or load_manifest()).get("models", [])

