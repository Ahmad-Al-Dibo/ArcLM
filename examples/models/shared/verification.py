"""Veilige uitvoeringslogica voor modelverificatie."""

from __future__ import annotations

import gc
import json
import time
from pathlib import Path
from typing import Any, Dict

from .configuration import EXAMPLE_ROOT, RESULTS_DIR, get_model, save_json
from .hardware import collect_preflight
from .model_paths import example_dataset_path, model_storage_path


def write_result(model_id: str, operation: str, payload: Dict[str, Any]) -> Path:
    """Bewaar lokale resultaten buiten het manifest."""

    path = RESULTS_DIR / model_id / f"{operation}.json"
    save_json(path, payload)
    return path


def check_resource_limits(preflight: Dict[str, Any], max_disk_gb: float | None) -> None:
    """Stop vooraf als de schijfgrens te krap is."""

    if max_disk_gb is None:
        return
    cache_disk = preflight.get("disk", {}).get("cache_root", {})
    free = cache_disk.get("free_bytes")
    if free is not None and free < max_disk_gb * 1024**3:
        raise RuntimeError("Onvoldoende vrije cache-schijf volgens --max-disk-gb.")


def download_model(record: Dict[str, Any], model_root: Path, cache_root: Path, allow_download: bool) -> Dict[str, Any]:
    """Download alleen wanneer de gebruiker dit expliciet toestaat."""

    if not allow_download:
        return {"status": "not_tested", "reason": "--allow-download ontbreekt"}
    if record.get("gated"):
        return {"status": "gated", "reason": "Model vereist gated of handmatige toegang."}
    try:
        from huggingface_hub import snapshot_download
    except ImportError as exc:
        return {"status": "dependency_missing", "reason": str(exc)}

    target = model_storage_path(model_root, record["id"])
    start = time.perf_counter()
    local_path = snapshot_download(
        repo_id=record["repository_id"],
        revision=record["revision"],
        cache_dir=str(cache_root),
        local_dir=str(target),
        local_dir_use_symlinks=False,
        allow_patterns=[
            "*.json",
            "*.model",
            "*.txt",
            "*.safetensors",
            "tokenizer.*",
            "vocab.*",
            "merges.txt",
            "generation_config.json",
            "special_tokens_map.json",
        ],
        ignore_patterns=["*.bin", "*.pt", "*.pth", "*.ckpt", "*.msgpack", "*.h5"],
    )
    return {
        "status": "verified_manual",
        "local_path": str(local_path),
        "elapsed_seconds": round(time.perf_counter() - start, 3),
    }


def resolve_dtype(dtype: str):
    """Kies dtype zonder stille fallback."""

    import torch

    normalized = (dtype or "auto").lower()
    if normalized == "auto":
        return torch.float32 if not torch.cuda.is_available() else "auto"
    mapping = {
        "float32": torch.float32,
        "fp32": torch.float32,
        "float16": torch.float16,
        "fp16": torch.float16,
        "bfloat16": torch.bfloat16,
        "bf16": torch.bfloat16,
    }
    if normalized not in mapping:
        raise ValueError("dtype moet auto, float32, float16 of bfloat16 zijn.")
    if mapping[normalized] in {torch.float16, torch.bfloat16} and not torch.cuda.is_available():
        raise RuntimeError("float16/bfloat16 is hier niet veilig gekozen: CUDA ontbreekt.")
    return mapping[normalized]


def verify_load_and_generate(
    record: Dict[str, Any],
    model_root: Path,
    device: str,
    dtype: str,
    offline: bool,
) -> Dict[str, Any]:
    """Laad tokenizer/model, draai forward en begrensde generatie."""

    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer

    if device.startswith("cuda") and not torch.cuda.is_available():
        raise RuntimeError("CUDA is gevraagd, maar niet beschikbaar.")
    source = model_storage_path(model_root, record["id"]) if offline else record["repository_id"]
    load_kwargs = {
        "revision": record["revision"],
        "trust_remote_code": False,
        "local_files_only": offline,
    }
    start = time.perf_counter()
    tokenizer = AutoTokenizer.from_pretrained(str(source), **load_kwargs)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token or tokenizer.unk_token
    model = AutoModelForCausalLM.from_pretrained(
        str(source),
        torch_dtype=resolve_dtype(dtype),
        **load_kwargs,
    )
    model.to(device)
    model.eval()
    prompt = "Leg ArcLM kort uit."
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        generated = model.generate(
            **inputs,
            max_new_tokens=12,
            do_sample=False,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )
    result = {
        "status": "verified_cpu" if str(device) == "cpu" else "verified_gpu",
        "model_id": record["id"],
        "device": str(device),
        "dtype": dtype,
        "parameter_count": sum(param.numel() for param in model.parameters()),
        "vocabulary_size": len(tokenizer),
        "context_length": record.get("context_length"),
        "input_shape": list(inputs["input_ids"].shape),
        "output_logit_shape": list(outputs.logits.shape),
        "generated_text": tokenizer.decode(generated[0][inputs["input_ids"].shape[-1] :], skip_special_tokens=True),
        "elapsed_seconds": round(time.perf_counter() - start, 3),
    }
    del outputs, generated, inputs, model, tokenizer
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    return result


def prepare_dataset_preview(
    record: Dict[str, Any],
    max_length: int = 256,
    allow_download: bool = False,
    offline: bool = False,
    model_root: Path | None = None,
) -> Dict[str, Any]:
    """Valideer en tokeniseer een kleine datasetpreview via ArcLM SFT-hulpen."""

    dataset_dir = example_dataset_path(EXAMPLE_ROOT, record["dataset_path"])
    dataset_file = dataset_dir / ("train_messages.jsonl" if (dataset_dir / "train_messages.jsonl").exists() else "train_prompt_completion.jsonl")
    lines = [json.loads(line) for line in dataset_file.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not allow_download and not offline:
        return {
            "status": "not_tested",
            "reason": "Tokenisatiepreview vereist --allow-download of --offline om verborgen tokenizerdownloads te vermijden.",
            "dataset_file": str(dataset_file),
            "records_seen": len(lines),
            "schema_preview": sorted(lines[0].keys()) if lines else [],
        }

    from arclm.sft import HuggingFaceSFTDataset, load_sft_records
    from transformers import AutoTokenizer

    records = load_sft_records(str(dataset_file))
    source = model_storage_path(model_root or Path("models") / "external", record["id"]) if offline else record["repository_id"]
    tokenizer = AutoTokenizer.from_pretrained(
        str(source),
        revision=record["revision"],
        trust_remote_code=False,
        local_files_only=offline,
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token or tokenizer.unk_token
    dataset = HuggingFaceSFTDataset(
        records=records[:2],
        tokenizer=tokenizer,
        max_length=max_length,
        assistant_only_loss=True,
        enable_thinking=False,
    )
    sample = dataset[0]
    return {
        "status": "verified_manual",
        "dataset_file": str(dataset_file),
        "records_seen": len(records),
        "preview": {
            "token_count": len(sample["input_ids"]),
            "input_id_shape": [len(sample["input_ids"])],
            "label_shape": [len(sample["labels"])],
            "ignored_label_count": sum(1 for value in sample["labels"] if value == -100),
            "truncated": len(sample["input_ids"]) >= max_length,
        },
    }


def run_security_check(record: Dict[str, Any]) -> Dict[str, Any]:
    """Controleer manifestregels voor veilig laden."""

    warnings = []
    if record.get("requires_remote_code"):
        warnings.append("Remote code is vereist; dit model mag niet automatisch laden.")
    if record.get("preferred_weight_format") != "safetensors":
        warnings.append("Safetensors is niet het voorkeursformaat of niet beschikbaar.")
    if record.get("gated"):
        warnings.append("Gated model: credentials mogen nooit in broncode of logs staan.")
    return {
        "status": "verified_manual" if not warnings else "experimental",
        "trust_remote_code": False,
        "preferred_weight_format": record.get("preferred_weight_format"),
        "warnings": warnings,
    }


def verify_model(args: Any) -> Dict[str, Any]:
    """Voer de veilige kernverificatie voor één model uit."""

    record = get_model(args.model)
    preflight = collect_preflight(Path(args.model_root), Path(args.cache_root))
    check_resource_limits(preflight, args.max_disk_gb)
    result: Dict[str, Any] = {
        "model_id": record["id"],
        "repository_id": record["repository_id"],
        "preflight": preflight,
        "download": download_model(record, Path(args.model_root), Path(args.cache_root), args.allow_download),
        "security": run_security_check(record),
    }
    if result["download"]["status"] in {"verified", "verified_cpu", "verified_gpu", "verified_manual"} or args.offline:
        try:
            result["load_generate"] = verify_load_and_generate(
                record=record,
                model_root=Path(args.model_root),
                device=args.device,
                dtype=args.dtype,
                offline=args.offline,
            )
        except Exception as exc:
            result["load_generate"] = {"status": "failed", "error": str(exc)}
    else:
        result["load_generate"] = {"status": "not_tested", "reason": "Download of lokale cache ontbreekt."}
    write_result(record["id"], "verify", result)
    return result
