"""Quantization helpers voor QLoRA fine-tuning."""

from __future__ import annotations

import importlib
import importlib.metadata
import importlib.util
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Protocol

import torch
from torch import nn

from ..exceptions import FineTuningError
from .config import (
    QLoRAConfig,
    QuantizationBackend,
    QuantizationConfig,
    QuantizedComputeDType,
)
from .lora import PeftApplicationResult, apply_lora, fingerprint_base_model, get_peft_parameter_report


@dataclass(frozen=True)
class QuantizationCapabilityReport:
    """Leesbare status van de lokale QLoRA-mogelijkheden."""

    backend: str
    dependency_installed: bool
    cuda_available: bool
    device_supported: bool
    four_bit_loading_supported: bool
    qlora_training_supported: bool
    evidence_level: str
    backend_version: str | None = None
    reasons: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke capabilitydata terug."""
        return asdict(self)


@dataclass(frozen=True)
class QuantizedModelReport:
    """Samenvatting van een quantized QLoRA-runtime model."""

    backend: str
    quantized_module_count: int
    trainable_base_parameter_count: int
    trainable_adapter_parameter_count: int
    prepared: bool
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke modeldata terug."""
        return asdict(self)


class QuantizationBackendAdapter(Protocol):
    """Klein backendcontract zonder trainingsengine."""

    name: QuantizationBackend

    def inspect_capabilities(self, config: QuantizationConfig) -> QuantizationCapabilityReport:
        """Inspecteert lokale backendmogelijkheden."""

    def create_load_configuration(self, config: QuantizationConfig) -> Any:
        """Maakt backend-specifieke laadconfiguratie."""

    def load_local_model(
        self,
        model_path: str | Path,
        config: QuantizationConfig,
        *,
        device: str,
        trust_remote_code: bool = False,
    ) -> nn.Module:
        """Laadt een lokaal 4-bit model."""


class BitsAndBytes4BitBackend:
    """bitsandbytes 4-bit backend via Transformers."""

    name = QuantizationBackend.BITSANDBYTES_4BIT

    def inspect_capabilities(self, config: QuantizationConfig) -> QuantizationCapabilityReport:
        """Inspecteert dependencies en lokale CUDA-mogelijkheden."""
        config.validate()
        reasons: list[str] = []
        transformers_present = _has_module("transformers")
        bnb_present = _has_module("bitsandbytes")
        dependency_installed = transformers_present and bnb_present
        if not transformers_present:
            reasons.append("Transformers is required for bitsandbytes 4-bit model loading")
        if not bnb_present:
            reasons.append("bitsandbytes is required for QLoRA 4-bit training")
        cuda_available = bool(torch.cuda.is_available())
        device_supported = False
        if cuda_available:
            capability = torch.cuda.get_device_capability(0)
            device_supported = capability >= (6, 0)
            if not device_supported:
                reasons.append("bitsandbytes QLoRA requires an NVIDIA CUDA device with SM60 or newer")
        else:
            reasons.append("QLoRA runtime training requires a CUDA device")
        supported = dependency_installed and cuda_available and device_supported
        return QuantizationCapabilityReport(
            backend=config.backend.value,
            dependency_installed=dependency_installed,
            cuda_available=cuda_available,
            device_supported=device_supported,
            four_bit_loading_supported=supported,
            qlora_training_supported=supported,
            evidence_level="backend_boundary_verified",
            backend_version=_package_version("bitsandbytes") if bnb_present else None,
            reasons=tuple(reasons),
        )

    def create_load_configuration(self, config: QuantizationConfig) -> Any:
        """Maakt een Transformers BitsAndBytesConfig."""
        config.validate()
        BitsAndBytesConfig = _load_transformers_bitsandbytes_config()
        return BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type=config.quant_type.value,
            bnb_4bit_use_double_quant=config.use_double_quant,
            bnb_4bit_compute_dtype=_torch_dtype(config.compute_dtype),
        )

    def load_local_model(
        self,
        model_path: str | Path,
        config: QuantizationConfig,
        *,
        device: str,
        trust_remote_code: bool = False,
    ) -> nn.Module:
        """Laadt een lokaal HF-model in 4-bit zonder netwerkfallback."""
        config.validate()
        resolved = _resolve_quantized_device(device)
        source = Path(model_path)
        if not source.is_dir():
            raise FineTuningError("QLoRA model_path must be a local directory")
        AutoModelForCausalLM = _load_transformers_causal_lm()
        quantization_config = self.create_load_configuration(config)
        try:
            model = AutoModelForCausalLM.from_pretrained(
                str(source),
                quantization_config=quantization_config,
                local_files_only=True,
                trust_remote_code=bool(trust_remote_code),
                device_map={"": str(resolved)},
            )
        except Exception as error:
            raise FineTuningError(f"Could not load local 4-bit model for QLoRA: {error}") from error
        setattr(model, "_arclm_quantized_runtime", True)
        setattr(model, "_arclm_quantization_backend", self.name.value)
        return model


def inspect_quantization_capabilities(
    config: QuantizationConfig | QLoRAConfig | None = None,
) -> QuantizationCapabilityReport:
    """Inspecteert QLoRA-mogelijkheden zonder een model te laden."""
    quantization = _resolve_quantization_config(config)
    backend = get_quantization_backend(quantization.backend)
    return backend.inspect_capabilities(quantization)


def get_quantization_backend(
    backend: QuantizationBackend | str,
) -> QuantizationBackendAdapter:
    """Geeft de goedgekeurde backendadapter terug."""
    if not isinstance(backend, QuantizationBackend):
        backend = QuantizationBackend(str(backend))
    if backend == QuantizationBackend.BITSANDBYTES_4BIT:
        return BitsAndBytes4BitBackend()
    raise FineTuningError("Quantization backend is not implemented")


def create_quantized_load_config(config: QuantizationConfig | QLoRAConfig) -> Any:
    """Maakt backend-specifieke laadconfig voor tests en integraties."""
    quantization = _resolve_quantization_config(config)
    backend = get_quantization_backend(quantization.backend)
    return backend.create_load_configuration(quantization)


def load_quantized_model(
    model_path: str | Path,
    config: QLoRAConfig,
    *,
    device: str = "cuda:0",
    trust_remote_code: bool = False,
) -> nn.Module:
    """Laadt een lokaal 4-bit model voor QLoRA."""
    config.validate()
    backend = get_quantization_backend(config.quantization.backend)
    return backend.load_local_model(
        model_path,
        config.quantization,
        device=device,
        trust_remote_code=trust_remote_code,
    )


def validate_quantized_base_model(model: nn.Module, config: QLoRAConfig) -> QuantizedModelReport:
    """Controleert dat QLoRA echt op een quantized basis draait."""
    if not isinstance(model, nn.Module):
        raise FineTuningError("model must be a torch.nn.Module")
    config.validate()
    modules = _quantized_module_names(model)
    if not modules:
        raise FineTuningError("QLoRA requires a genuinely quantized 4-bit base model")
    trainable_base = sum(
        parameter.numel()
        for name, parameter in model.named_parameters()
        if parameter.requires_grad and "lora_" not in name
    )
    return QuantizedModelReport(
        backend=config.quantization.backend.value,
        quantized_module_count=len(modules),
        trainable_base_parameter_count=trainable_base,
        trainable_adapter_parameter_count=sum(
            parameter.numel()
            for name, parameter in model.named_parameters()
            if parameter.requires_grad and "lora_" in name
        ),
        prepared=bool(getattr(model, "_arclm_qlora_prepared", False)),
        metadata={"quantized_modules": tuple(modules)},
    )


def prepare_model_for_qlora(model: nn.Module, config: QLoRAConfig) -> QuantizedModelReport:
    """Bevriest de quantized basis voordat LoRA wordt toegevoegd."""
    report = validate_quantized_base_model(model, config)
    for name, parameter in model.named_parameters():
        if "lora_" not in name:
            parameter.requires_grad = False
    setattr(model, "_arclm_qlora_prepared", True)
    setattr(model, "_arclm_quantization_backend", config.quantization.backend.value)
    return QuantizedModelReport(
        backend=report.backend,
        quantized_module_count=report.quantized_module_count,
        trainable_base_parameter_count=0,
        trainable_adapter_parameter_count=report.trainable_adapter_parameter_count,
        prepared=True,
        metadata=report.metadata,
    )


def apply_qlora(model: nn.Module, config: QLoRAConfig) -> PeftApplicationResult:
    """Past QLoRA toe op een al quantized model."""
    config.validate()
    prepare_model_for_qlora(model, config)
    result = apply_lora(model, config.lora)
    report = get_peft_parameter_report(model, include_names=True)
    return PeftApplicationResult(
        method=config.method.value,
        adapted_modules=result.adapted_modules,
        config=config.to_dict(),
        parameter_report=report,
        base_model_fingerprint=fingerprint_base_model(model),
    )


def is_quantized_runtime_model(model: nn.Module) -> bool:
    """Controleert of een model als ArcLM quantized runtime is gemarkeerd."""
    return bool(getattr(model, "_arclm_quantized_runtime", False)) or bool(_quantized_module_names(model))


def _resolve_quantization_config(
    config: QuantizationConfig | QLoRAConfig | None,
) -> QuantizationConfig:
    """Normaliseert config-input voor backendhelpers."""
    if config is None:
        quantization = QuantizationConfig()
    elif isinstance(config, QLoRAConfig):
        quantization = config.quantization
    elif isinstance(config, QuantizationConfig):
        quantization = config
    else:
        raise FineTuningError("quantization config is not supported")
    quantization.validate()
    return quantization


def _quantized_module_names(model: nn.Module) -> tuple[str, ...]:
    """Herkent echte bitsandbytes 4-bit modules zonder bnb te importeren."""
    names: list[str] = []
    for name, module in model.named_modules():
        module_type = type(module)
        if module_type.__name__ == "Linear4bit" and module_type.__module__.startswith("bitsandbytes."):
            names.append(name)
    return tuple(names)


def _resolve_quantized_device(value: str) -> torch.device:
    """QLoRA runtime gebruikt in deze feature een expliciet CUDA-device."""
    if value == "auto":
        value = "cuda:0"
    device = torch.device(value)
    if device.type != "cuda":
        raise FineTuningError("QLoRA 4-bit runtime loading requires an explicit CUDA device")
    if not torch.cuda.is_available():
        raise FineTuningError("CUDA was requested for QLoRA but is not available")
    if device.index is not None and device.index >= torch.cuda.device_count():
        raise FineTuningError("Requested CUDA device is not available")
    return device


def _torch_dtype(value: QuantizedComputeDType) -> torch.dtype:
    """Mapt ArcLM dtype-namen naar torch dtypes."""
    mapping = {
        QuantizedComputeDType.FP16: torch.float16,
        QuantizedComputeDType.BF16: torch.bfloat16,
        QuantizedComputeDType.FP32: torch.float32,
    }
    return mapping[value]


def _load_transformers_bitsandbytes_config() -> Any:
    """Laadt BitsAndBytesConfig pas wanneer de backend nodig is."""
    if not _has_module("bitsandbytes"):
        raise FineTuningError(
            "QLoRA requires the optional bitsandbytes dependency. "
            'Install it with: pip install "arclm[qlora]"'
        )
    try:
        module = importlib.import_module("transformers")
        return getattr(module, "BitsAndBytesConfig")
    except Exception as error:
        raise FineTuningError(
            "QLoRA requires Transformers with BitsAndBytesConfig. "
            'Install it with: pip install "arclm[qlora]"'
        ) from error


def _load_transformers_causal_lm() -> Any:
    """Laadt AutoModelForCausalLM pas bij echt model laden."""
    try:
        module = importlib.import_module("transformers")
        return getattr(module, "AutoModelForCausalLM")
    except Exception as error:
        raise FineTuningError(
            "QLoRA model loading requires Transformers. "
            'Install it with: pip install "arclm[qlora]"'
        ) from error


def _has_module(name: str) -> bool:
    """Controleert een optionele dependency zonder te importeren."""
    return importlib.util.find_spec(name) is not None


def _package_version(name: str) -> str | None:
    """Leest optionele packageversie als die beschikbaar is."""
    try:
        return importlib.metadata.version(name)
    except importlib.metadata.PackageNotFoundError:
        return None
