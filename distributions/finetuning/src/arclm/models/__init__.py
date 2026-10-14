"""Model public API."""

from ..utils.imports import require_torch

require_torch("arclm.models")
from .auto import AutoModel
from .capabilities import ModelCapabilityReport, get_model_capability, model_support_matrix
from .text.causal_lm import ArcLM, GPTBlock, SelfAttention

__all__ = [
    "ArcLM",
    "GPTBlock",
    "SelfAttention",
    "AutoModel",
    "ModelCapabilityReport",
    "get_model_capability",
    "model_support_matrix",
]
