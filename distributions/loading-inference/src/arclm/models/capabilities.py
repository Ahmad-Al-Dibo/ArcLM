"""Small, code-backed capability reports for ArcLM model paths.

The reports are intentionally descriptive rather than magical. They separate
the validated native ArcLM causal-LM path from external Hugging Face-compatible
boundaries, and they record what the current test suite actually exercises.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Literal


CapabilityStatus = Literal["Validated", "Compatible", "Experimental", "Unsupported"]
OperationStatus = Literal["Passed", "Failed", "Not tested", "Not supported"]


@dataclass(frozen=True)
class ModelCapabilityReport:
    """Describes supported operations for one exact model path."""

    model_source: str
    model_family: str
    exact_model: str
    task: str
    status: CapabilityStatus
    can_forward: bool
    can_generate: bool
    can_train: bool
    can_full_finetune: bool
    can_sft: bool
    can_lora: bool
    can_save_reload: bool
    supports_cpu: bool
    supports_cuda: bool
    supports_quantization: bool
    supports_structured_output: bool
    validated_operations: tuple[str, ...] = field(default_factory=tuple)
    unvalidated_operations: tuple[str, ...] = field(default_factory=tuple)
    limitations: tuple[str, ...] = field(default_factory=tuple)
    operations: dict[str, OperationStatus] = field(default_factory=dict)

    def to_dict(self) -> dict[str, object]:
        """Return a JSON-safe representation."""

        return asdict(self)


_NATIVE_TINY = ModelCapabilityReport(
    model_source="native",
    model_family="ArcLM",
    exact_model="ArcLM native tiny causal LM",
    task="causal_language_modeling",
    status="Validated",
    can_forward=True,
    can_generate=True,
    can_train=True,
    can_full_finetune=True,
    can_sft=True,
    can_lora=True,
    can_save_reload=True,
    supports_cpu=True,
    supports_cuda=True,
    supports_quantization=False,
    supports_structured_output=False,
    validated_operations=(
        "configure",
        "create",
        "tokenize",
        "forward",
        "loss",
        "train",
        "checkpoint_save",
        "checkpoint_reload",
        "evaluate",
        "generate",
        "inspect",
        "cli_train",
        "cli_eval",
        "cli_generate",
        "native_lora_adapter_runtime",
    ),
    unvalidated_operations=("cuda_runtime", "quantization", "structured_output"),
    limitations=(
        "The native model is a compact single ArcLM causal-LM architecture.",
        "Native LoRA is validated on ArcLM linear layers, not on every possible external model.",
        "CUDA support depends on the local PyTorch installation and hardware.",
        "No KV cache, streaming generation, or attention-map capture is implemented.",
    ),
    operations={
        "Load": "Passed",
        "Tokenize": "Passed",
        "Forward": "Passed",
        "Generate": "Passed",
        "Train": "Passed",
        "SFT": "Passed",
        "LoRA": "Passed",
        "Save/Reload": "Passed",
        "CPU": "Passed",
        "CUDA": "Not tested",
    },
)

_GPT2_REFERENCE = ModelCapabilityReport(
    model_source="external_huggingface",
    model_family="GPT-2",
    exact_model="hf-internal-testing/tiny-random-gpt2",
    task="causal_language_modeling",
    status="Compatible",
    can_forward=True,
    can_generate=True,
    can_train=False,
    can_full_finetune=False,
    can_sft=True,
    can_lora=True,
    can_save_reload=True,
    supports_cpu=True,
    supports_cuda=True,
    supports_quantization=False,
    supports_structured_output=False,
    validated_operations=(
        "source_detection",
        "optional_dependency_boundary",
        "mocked_load",
        "mocked_generate",
    ),
    unvalidated_operations=("real_weight_forward", "real_weight_generation", "real_save_reload"),
    limitations=(
        "GPT-2 is an external Hugging Face compatibility reference, not a native ArcLM model.",
        "The repository tests validate the boundary with tiny/mocked objects and do not download weights.",
    ),
    operations={
        "Load": "Passed",
        "Tokenize": "Passed",
        "Forward": "Not tested",
        "Generate": "Passed",
        "Train": "Not supported",
        "SFT": "Not tested",
        "LoRA": "Not tested",
        "Save/Reload": "Passed",
        "CPU": "Passed",
        "CUDA": "Not tested",
    },
)

_QWEN_REFERENCE = ModelCapabilityReport(
    model_source="external_huggingface",
    model_family="Qwen",
    exact_model="Qwen/Qwen3-0.6B",
    task="causal_language_modeling",
    status="Experimental",
    can_forward=True,
    can_generate=True,
    can_train=False,
    can_full_finetune=False,
    can_sft=True,
    can_lora=True,
    can_save_reload=True,
    supports_cpu=True,
    supports_cuda=True,
    supports_quantization=False,
    supports_structured_output=True,
    validated_operations=("source_detection", "example_contract", "optional_dependency_boundary"),
    unvalidated_operations=(
        "real_weight_load",
        "forward",
        "generation",
        "save_reload",
        "sft_runtime",
        "lora_runtime",
        "cuda_runtime",
    ),
    limitations=(
        "Only the exact Qwen/Qwen3-0.6B external path is recorded for this phase.",
        "Runtime validation is not claimed unless the model is already available locally.",
        "No Qwen-specific native model, trainer, or inference path exists.",
    ),
    operations={
        "Load": "Not tested",
        "Tokenize": "Not tested",
        "Forward": "Not tested",
        "Generate": "Not tested",
        "Train": "Not supported",
        "SFT": "Not tested",
        "LoRA": "Not tested",
        "Save/Reload": "Not tested",
        "CPU": "Not tested",
        "CUDA": "Not tested",
    },
)

_REPORTS = (_NATIVE_TINY, _GPT2_REFERENCE, _QWEN_REFERENCE)


def get_model_capability(model: str) -> ModelCapabilityReport:
    """Return the capability report for a known exact model path."""

    normalized = model.strip().lower()
    aliases = {
        "arclm": _NATIVE_TINY,
        "native": _NATIVE_TINY,
        "arclm native tiny": _NATIVE_TINY,
        "hf-internal-testing/tiny-random-gpt2": _GPT2_REFERENCE,
        "gpt2": _GPT2_REFERENCE,
        "qwen/qwen3-0.6b": _QWEN_REFERENCE,
    }
    if normalized in aliases:
        return aliases[normalized]
    raise ValueError(
        "Unknown model capability target. Supported: native, "
        "hf-internal-testing/tiny-random-gpt2, Qwen/Qwen3-0.6B."
    )


def model_support_matrix() -> list[dict[str, object]]:
    """Return the compact support matrix for the official 0.8 model set."""

    return [report.to_dict() for report in _REPORTS]
