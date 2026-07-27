"""Resource-preflight voor veilige lokale modelruns."""

from __future__ import annotations

import importlib.metadata
import os
import platform
import shutil
import sys
from pathlib import Path
from typing import Any, Dict


def package_version(name: str) -> str | None:
    """Lees een pakketversie zonder het pakket zwaar te importeren."""

    try:
        return importlib.metadata.version(name)
    except importlib.metadata.PackageNotFoundError:
        return None


def collect_preflight(model_root: Path | None = None, cache_root: Path | None = None) -> Dict[str, Any]:
    """Maak een preflight-rapport voordat er modellen worden gedownload."""

    model_root = model_root or Path("models") / "external"
    cache_root = cache_root or Path(os.environ.get("HF_HOME", Path.home() / ".cache" / "huggingface"))
    report: Dict[str, Any] = {
        "operating_system": platform.platform(),
        "python_version": sys.version.split()[0],
        "python_executable": sys.executable,
        "packages": {
            "arclm": package_version("arclm"),
            "torch": package_version("torch"),
            "transformers": package_version("transformers"),
            "huggingface_hub": package_version("huggingface_hub"),
            "safetensors": package_version("safetensors"),
            "peft": package_version("peft"),
            "flask": package_version("flask"),
        },
        "model_root": str(model_root),
        "cache_root": str(cache_root),
        "disk": {},
        "ram": {},
        "gpu": {"cuda_available": False, "devices": []},
        "supported_dtypes": ["float32"],
    }

    for label, path in [("workspace", Path.cwd()), ("model_root", model_root), ("cache_root", cache_root)]:
        probe = path if path.exists() else path.parent
        try:
            usage = shutil.disk_usage(probe)
            report["disk"][label] = {
                "path": str(path),
                "exists": path.exists(),
                "total_bytes": usage.total,
                "free_bytes": usage.free,
                "used_bytes": usage.used,
            }
        except OSError as exc:
            report["disk"][label] = {"path": str(path), "error": str(exc)}

    try:
        import psutil

        memory = psutil.virtual_memory()
        report["ram"] = {"total_bytes": memory.total, "available_bytes": memory.available}
    except Exception as exc:
        report["ram"] = {"available": "unknown", "note": f"psutil ontbreekt of faalde: {exc}"}

    try:
        import torch

        report["gpu"]["cuda_available"] = bool(torch.cuda.is_available())
        report["gpu"]["device_count"] = int(torch.cuda.device_count())
        if torch.cuda.is_available():
            report["supported_dtypes"].append("float16")
            if getattr(torch.cuda, "is_bf16_supported", lambda: False)():
                report["supported_dtypes"].append("bfloat16")
            for index in range(torch.cuda.device_count()):
                props = torch.cuda.get_device_properties(index)
                report["gpu"]["devices"].append(
                    {"index": index, "name": props.name, "memory_bytes": props.total_memory}
                )
    except Exception as exc:
        report["gpu"]["error"] = str(exc)

    return report

