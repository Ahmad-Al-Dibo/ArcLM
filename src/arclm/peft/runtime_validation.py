"""Runtime reports voor optionele HF en QLoRA validatie."""

from __future__ import annotations

import importlib.metadata
import importlib.util
import platform
from dataclasses import asdict, dataclass, field
from typing import Any

import torch


@dataclass(frozen=True)
class RuntimeEnvironmentReport:
    """Kleine rapportage zonder secrets of volledige package dump."""

    environment: str
    python_version: str
    arclm_version: str
    pytorch_version: str
    cuda_runtime: str | None
    cuda_available: bool
    cuda_device_count: int
    selected_device: str
    gpu_name: str | None = None
    compute_capability: tuple[int, int] | None = None
    transformers_version: str | None = None
    bitsandbytes_version: str | None = None
    peft_version: str | None = None
    supported_validation: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke rapportdata terug."""
        data = asdict(self)
        if self.compute_capability is not None:
            data["compute_capability"] = list(self.compute_capability)
        return data


def inspect_runtime_environment(
    environment: str,
    *,
    selected_device: str = "cpu",
) -> RuntimeEnvironmentReport:
    """Inspecteert alleen de gegevens die de runtime-matrix nodig heeft."""
    from .._version import __version__

    cuda_available = bool(torch.cuda.is_available())
    device_count = int(torch.cuda.device_count()) if cuda_available else 0
    gpu_name = None
    capability = None
    if cuda_available and device_count:
        gpu_name = torch.cuda.get_device_name(0)
        capability = tuple(int(part) for part in torch.cuda.get_device_capability(0))
    supported: list[str] = ["core_cpu_baseline"]
    if _module_exists("transformers"):
        supported.append("huggingface_cpu_runtime")
    if cuda_available:
        supported.append("cuda_runtime")
    if cuda_available and _module_exists("bitsandbytes"):
        supported.append("bitsandbytes_qlora_runtime")
    return RuntimeEnvironmentReport(
        environment=str(environment),
        python_version=platform.python_version(),
        arclm_version=__version__,
        pytorch_version=str(torch.__version__),
        cuda_runtime=torch.version.cuda,
        cuda_available=cuda_available,
        cuda_device_count=device_count,
        selected_device=str(selected_device),
        gpu_name=gpu_name,
        compute_capability=capability,
        transformers_version=_package_version("transformers"),
        bitsandbytes_version=_package_version("bitsandbytes"),
        peft_version=_package_version("peft"),
        supported_validation=tuple(supported),
    )


def _module_exists(name: str) -> bool:
    """Controleert optionele modules zonder ze te importeren."""
    return importlib.util.find_spec(name) is not None


def _package_version(name: str) -> str | None:
    """Leest een optionele packageversie als die bekend is."""
    try:
        return importlib.metadata.version(name)
    except importlib.metadata.PackageNotFoundError:
        return None
