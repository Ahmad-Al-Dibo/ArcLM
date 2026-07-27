"""Safe runtime diagnostics shared by CLI and the optional Web Studio."""

from __future__ import annotations

import json
import platform
import sys
from importlib import import_module, metadata
from pathlib import Path
from typing import Any, Mapping

from ._version import __version__

OPTIONAL_INTEGRATIONS = (
    "transformers",
    "datasets",
    "peft",
    "accelerate",
    "bitsandbytes",
    "fastapi",
    "flask",
    "uvicorn",
    "safetensors",
    "sentencepiece",
)


def optional_dependency_status() -> dict[str, dict[str, Any]]:
    """Return optional package availability without importing those packages."""
    result: dict[str, dict[str, Any]] = {}
    for package in OPTIONAL_INTEGRATIONS:
        try:
            version = metadata.version(package)
            available = True
        except metadata.PackageNotFoundError:
            version = None
            available = False
        result[package] = {"package": package, "available": available, "version": version}
    return result


def build_runtime_diagnostics(
    *,
    include_paths: bool = False,
    workspace: Mapping[str, Any] | None = None,
    active_compute_operation: str = "idle",
) -> dict[str, Any]:
    """Build a JSON-safe local diagnostic report.

    ``include_paths`` is intended for the local CLI. Web responses keep it
    disabled so user paths, executables, and installation locations are not
    exposed to the browser.
    """
    torch = _load_torch()
    cuda_available = False
    cuda_runtime = None
    gpu_count = 0
    gpus: list[dict[str, Any]] = []
    pytorch_version = None

    if torch is not None:
        pytorch_version = str(getattr(torch, "__version__", "unknown"))
        cuda_runtime = getattr(getattr(torch, "version", None), "cuda", None)
        cuda_available = bool(torch.cuda.is_available())
        if cuda_available:
            gpu_count = int(torch.cuda.device_count())
            for index in range(gpu_count):
                props = torch.cuda.get_device_properties(index)
                gpus.append(
                    {
                        "name": str(torch.cuda.get_device_name(index)),
                        "vram_bytes": int(getattr(props, "total_memory", 0)),
                        "compute_capability": tuple(torch.cuda.get_device_capability(index)),
                    }
                )

    report: dict[str, Any] = {
        "arclm_version": __version__,
        "python_version": platform.python_version(),
        "pytorch_version": pytorch_version,
        "operating_system": platform.system(),
        "cpu": platform.processor() or None,
        "cuda_available": cuda_available,
        "cuda_version": cuda_runtime,
        "gpu_count": gpu_count,
        "gpu_name": gpus[0]["name"] if gpus else None,
        "gpus": gpus,
        "current_device": "cuda:0" if cuda_available else "cpu",
        "optional_dependencies": optional_dependency_status(),
        "workspace": dict(workspace or {}),
        "active_compute_operation": active_compute_operation,
        "warnings": _diagnostic_warnings(torch, cuda_available, gpu_count),
    }
    if include_paths:
        report.update(
            {
                "arclm_import_path": _arclm_import_path(),
                "python_executable": sys.executable,
                "package_installation_source": _installation_source(),
            }
        )
    return report


def format_runtime_diagnostics(report: Mapping[str, Any]) -> str:
    """Format runtime diagnostics for ``arclm doctor``."""
    optional = report.get("optional_dependencies", {})
    lines = [
        f"ArcLM version: {report.get('arclm_version')}",
        f"ArcLM import path: {report.get('arclm_import_path', 'hidden')}",
        f"Python executable: {report.get('python_executable', 'hidden')}",
        f"Python version: {report.get('python_version')}",
        f"PyTorch version: {report.get('pytorch_version') or 'not available'}",
        f"Operating system: {report.get('operating_system')}",
        f"CUDA available: {report.get('cuda_available')}",
        f"CUDA version: {report.get('cuda_version') or 'not available'}",
        f"GPU count: {report.get('gpu_count')}",
        f"GPU name: {report.get('gpu_name') or 'none'}",
        f"Current device: {report.get('current_device')}",
        "Optional integrations:",
    ]
    for name in OPTIONAL_INTEGRATIONS:
        item = optional.get(name, {})
        status = "available" if item.get("available") else "missing"
        version = item.get("version")
        lines.append(f"  - {name}: {status}{f' ({version})' if version else ''}")
    warnings = list(report.get("warnings") or [])
    lines.append("Warnings:")
    if warnings:
        lines.extend(f"  - {warning}" for warning in warnings)
    else:
        lines.append("  - none")
    return "\n".join(lines)


def runtime_diagnostics_json(report: Mapping[str, Any]) -> str:
    """Serialize diagnostics for CLI JSON output."""
    return json.dumps(report, indent=2, sort_keys=True)


def _load_torch() -> Any | None:
    try:
        return import_module("torch")
    except ModuleNotFoundError:
        return None


def _diagnostic_warnings(torch: Any | None, cuda_available: bool, gpu_count: int) -> list[str]:
    warnings: list[str] = []
    if torch is None:
        warnings.append("PyTorch is not importable; native ArcLM model workflows require torch.")
    if not cuda_available:
        warnings.append("CUDA is not available; GPU-specific validation remains untested in this environment.")
    if gpu_count < 2:
        warnings.append("Multi-GPU behavior is not locally validated.")
    return warnings


def _arclm_import_path() -> str:
    import arclm

    return str(Path(arclm.__file__).resolve())


def _installation_source() -> str:
    try:
        dist = metadata.distribution("arclm")
    except metadata.PackageNotFoundError:
        return "source-tree-or-editable"
    try:
        return str(Path(dist.locate_file("")).resolve())
    except Exception:
        return "installed"
