"""Configuratie voor parameter-efficient fine-tuning."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any, Mapping

from ..exceptions import FineTuningError


class PeftMethod(str, Enum):
    """Bekende PEFT-methodes."""

    NONE = "none"
    LORA = "lora"
    QLORA = "qlora"


class QuantizationBackend(str, Enum):
    """Bekende quantization backends voor fine-tuning."""

    NONE = "none"
    BITSANDBYTES_4BIT = "bitsandbytes_4bit"


class QuantizationType(str, Enum):
    """4-bit quantization types die ArcLM accepteert."""

    NF4 = "nf4"
    FP4 = "fp4"


class QuantizedComputeDType(str, Enum):
    """Compute dtype voor quantized training."""

    FP16 = "fp16"
    BF16 = "bf16"
    FP32 = "fp32"


@dataclass(frozen=True)
class PeftConfig:
    """Kleine basisconfig voor PEFT."""

    method: PeftMethod = PeftMethod.NONE
    enabled: bool = True
    config_version: int = 1

    def validate(self) -> None:
        """Controleert de gedeelde PEFT-velden."""
        if not isinstance(self.method, PeftMethod):
            raise FineTuningError("PEFT method is not supported")
        if self.config_version <= 0:
            raise FineTuningError("PEFT config version must be positive")

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke configdata terug."""
        self.validate()
        data = asdict(self)
        data["method"] = self.method.value
        return data


@dataclass(frozen=True)
class LoRAConfig(PeftConfig):
    """Configuratie voor ArcLM LoRA adapters."""

    method: PeftMethod = PeftMethod.LORA
    rank: int = 4
    alpha: float = 8.0
    dropout: float = 0.0
    target_modules: tuple[str, ...] = field(default_factory=lambda: ("query", "value"))
    target_match: str = "suffix"
    bias: str = "none"
    init: str = "kaiming_uniform"
    freeze_base_model: bool = True

    def validate(self) -> None:
        """Controleert LoRA-waarden voordat we het model muteren."""
        super().validate()
        if self.method != PeftMethod.LORA:
            raise FineTuningError("LoRAConfig method must be lora")
        if self.rank <= 0:
            raise FineTuningError("LoRA rank must be greater than zero")
        if self.alpha <= 0:
            raise FineTuningError("LoRA alpha must be greater than zero")
        if not 0.0 <= self.dropout < 1.0:
            raise FineTuningError("LoRA dropout must be between 0 and 1")
        if not self.target_modules:
            raise FineTuningError("LoRA target_modules must not be empty")
        if self.target_match not in {"suffix", "leaf", "full"}:
            raise FineTuningError("LoRA target_match must be one of: suffix, leaf, full")
        if self.bias != "none":
            raise FineTuningError("LoRA bias policy must be none")
        if self.init not in {"kaiming_uniform", "zeros"}:
            raise FineTuningError("LoRA init must be one of: kaiming_uniform, zeros")

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "LoRAConfig":
        """Leest een LoRAConfig uit veilige manifestdata."""
        data = dict(values)
        method = data.get("method", PeftMethod.LORA)
        if not isinstance(method, PeftMethod):
            method = PeftMethod(str(method))
        targets = data.get("target_modules", ("query", "value"))
        if isinstance(targets, list):
            targets = tuple(str(item) for item in targets)
        data["method"] = method
        data["target_modules"] = targets
        config = cls(**data)
        config.validate()
        return config


@dataclass(frozen=True)
class QuantizationConfig:
    """Kleine JSON-veilige config voor 4-bit quantization."""

    backend: QuantizationBackend = QuantizationBackend.BITSANDBYTES_4BIT
    bits: int = 4
    quant_type: QuantizationType = QuantizationType.NF4
    use_double_quant: bool = True
    compute_dtype: QuantizedComputeDType = QuantizedComputeDType.FP16
    config_version: int = 1

    def validate(self) -> None:
        """Controleert de quantization-keuzes zonder backend te laden."""
        if not isinstance(self.backend, QuantizationBackend):
            raise FineTuningError("Quantization backend is not supported")
        if self.backend == QuantizationBackend.NONE:
            raise FineTuningError("QLoRA requires a quantization backend")
        if self.backend != QuantizationBackend.BITSANDBYTES_4BIT:
            raise FineTuningError("Only bitsandbytes 4-bit quantization is supported")
        if int(self.bits) != 4:
            raise FineTuningError("QLoRA quantization bits must be 4")
        if not isinstance(self.quant_type, QuantizationType):
            raise FineTuningError("Quantization type must be nf4 or fp4")
        if not isinstance(self.use_double_quant, bool):
            raise FineTuningError("use_double_quant must be a boolean")
        if not isinstance(self.compute_dtype, QuantizedComputeDType):
            raise FineTuningError("Quantization compute dtype is not supported")
        if self.config_version <= 0:
            raise FineTuningError("Quantization config version must be positive")

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke quantizationdata terug."""
        self.validate()
        return {
            "backend": self.backend.value,
            "bits": int(self.bits),
            "quant_type": self.quant_type.value,
            "use_double_quant": bool(self.use_double_quant),
            "compute_dtype": self.compute_dtype.value,
            "config_version": int(self.config_version),
        }

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "QuantizationConfig":
        """Leest quantizationdata uit veilige manifestdata."""
        data = dict(values)
        backend = data.get("backend", QuantizationBackend.BITSANDBYTES_4BIT)
        quant_type = data.get("quant_type", QuantizationType.NF4)
        compute_dtype = data.get("compute_dtype", QuantizedComputeDType.FP16)
        if not isinstance(backend, QuantizationBackend):
            backend = QuantizationBackend(str(backend))
        if not isinstance(quant_type, QuantizationType):
            quant_type = QuantizationType(str(quant_type))
        if not isinstance(compute_dtype, QuantizedComputeDType):
            compute_dtype = QuantizedComputeDType(str(compute_dtype))
        data["backend"] = backend
        data["quant_type"] = quant_type
        data["compute_dtype"] = compute_dtype
        config = cls(**data)
        config.validate()
        return config


@dataclass(frozen=True)
class QLoRAConfig(PeftConfig):
    """Configuratie voor QLoRA: 4-bit basis plus LoRA adapters."""

    method: PeftMethod = PeftMethod.QLORA
    quantization: QuantizationConfig = field(default_factory=QuantizationConfig)
    lora: LoRAConfig = field(default_factory=LoRAConfig)
    adapter_dtype: QuantizedComputeDType = QuantizedComputeDType.FP32

    def validate(self) -> None:
        """Controleert QLoRA zonder een model of backend te laden."""
        super().validate()
        if self.method != PeftMethod.QLORA:
            raise FineTuningError("QLoRAConfig method must be qlora")
        if not isinstance(self.quantization, QuantizationConfig):
            raise FineTuningError("QLoRA quantization must be a QuantizationConfig")
        if not isinstance(self.lora, LoRAConfig):
            raise FineTuningError("QLoRA lora must be a LoRAConfig")
        if not isinstance(self.adapter_dtype, QuantizedComputeDType):
            raise FineTuningError("QLoRA adapter dtype is not supported")
        self.quantization.validate()
        self.lora.validate()

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-veilige QLoRA-config terug."""
        self.validate()
        return {
            "method": self.method.value,
            "enabled": bool(self.enabled),
            "config_version": int(self.config_version),
            "quantization": self.quantization.to_dict(),
            "lora": self.lora.to_dict(),
            "adapter_dtype": self.adapter_dtype.value,
        }

    @classmethod
    def from_dict(cls, values: Mapping[str, Any]) -> "QLoRAConfig":
        """Leest QLoRA-config uit veilige manifestdata."""
        data = dict(values)
        method = data.get("method", PeftMethod.QLORA)
        adapter_dtype = data.get("adapter_dtype", QuantizedComputeDType.FP32)
        if not isinstance(method, PeftMethod):
            method = PeftMethod(str(method))
        if not isinstance(adapter_dtype, QuantizedComputeDType):
            adapter_dtype = QuantizedComputeDType(str(adapter_dtype))
        quantization_values = data.get("quantization") or {}
        lora_values = data.get("lora") or {}
        data["method"] = method
        data["adapter_dtype"] = adapter_dtype
        data["quantization"] = (
            quantization_values
            if isinstance(quantization_values, QuantizationConfig)
            else QuantizationConfig.from_dict(quantization_values)
        )
        data["lora"] = (
            lora_values if isinstance(lora_values, LoRAConfig) else LoRAConfig.from_dict(lora_values)
        )
        config = cls(**data)
        config.validate()
        return config
