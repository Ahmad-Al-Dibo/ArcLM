"""Public PEFT API for ArcLM.

Config types load without torch; LoRA/quantization modules require the
``train`` extra.
"""

from __future__ import annotations

from importlib import import_module
from typing import Any

_EXPORTS = {
    "LoRAConfig": "arclm.peft.config",
    "PeftConfig": "arclm.peft.config",
    "PeftMethod": "arclm.peft.config",
    "QLoRAConfig": "arclm.peft.config",
    "QuantizationBackend": "arclm.peft.config",
    "QuantizationConfig": "arclm.peft.config",
    "QuantizationType": "arclm.peft.config",
    "QuantizedComputeDType": "arclm.peft.config",
    "ADAPTER_ARTIFACT_FORMAT": "arclm.peft.artifacts",
    "ADAPTER_ARTIFACT_VERSION": "arclm.peft.artifacts",
    "PeftAdapterInfo": "arclm.peft.artifacts",
    "PeftAdapterManifest": "arclm.peft.artifacts",
    "inspect_adapter_artifact": "arclm.peft.artifacts",
    "load_adapter_artifact": "arclm.peft.artifacts",
    "save_adapter_artifact": "arclm.peft.artifacts",
    "validate_adapter_artifact": "arclm.peft.artifacts",
    "LoRALinear": "arclm.peft.lora",
    "PeftApplicationResult": "arclm.peft.lora",
    "PeftParameterReport": "arclm.peft.lora",
    "PeftTarget": "arclm.peft.lora",
    "apply_lora": "arclm.peft.lora",
    "apply_peft": "arclm.peft.lora",
    "fingerprint_base_model": "arclm.peft.lora",
    "get_lora_state_dict": "arclm.peft.lora",
    "get_peft_parameter_report": "arclm.peft.lora",
    "inspect_lora_targets": "arclm.peft.lora",
    "is_lora_model": "arclm.peft.lora",
    "load_lora_state_dict": "arclm.peft.lora",
    "merge_lora": "arclm.peft.lora",
    "merged_lora_model": "arclm.peft.lora",
    "unmerge_lora": "arclm.peft.lora",
    "QuantizationCapabilityReport": "arclm.peft.quantization",
    "QuantizedModelReport": "arclm.peft.quantization",
    "create_quantized_load_config": "arclm.peft.quantization",
    "get_quantization_backend": "arclm.peft.quantization",
    "inspect_quantization_capabilities": "arclm.peft.quantization",
    "is_quantized_runtime_model": "arclm.peft.quantization",
    "load_quantized_model": "arclm.peft.quantization",
    "prepare_model_for_qlora": "arclm.peft.quantization",
    "validate_quantized_base_model": "arclm.peft.quantization",
}

__all__ = sorted(_EXPORTS)


def __getattr__(name: str) -> Any:
    """Load a PEFT attribute only when it is requested."""
    if name in _EXPORTS:
        module = import_module(_EXPORTS[name])
        value = getattr(module, name)
        globals()[name] = value
        return value
    raise AttributeError(f"module 'arclm.peft' has no attribute {name!r}")
