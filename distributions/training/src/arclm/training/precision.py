"""Helpers voor mixed precision."""

from __future__ import annotations

from contextlib import nullcontext

import torch

from ..exceptions import PrecisionError


class PrecisionHelper:
    """Maakt autocast en gradient scaling klaar.

    Alleen `fp32`, `fp16` en `bf16` worden ondersteund. FP16 gebruikt een
    scaler op CUDA, omdat kleine gradients anders snel kunnen verdwijnen.
    """

    def __init__(self, precision: str = "fp32", device: torch.device | None = None):
        """Maakt de precision helper.

        Args:
            precision: `fp32`, `fp16` of `bf16`.
            device: Het apparaat waarop getraind wordt.

        Raises:
            PrecisionError: Als de precision niet op het apparaat kan.
        """
        self.precision = precision
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.enabled = precision != "fp32"
        self.dtype = None

        if precision == "fp16":
            if self.device.type != "cuda":
                raise PrecisionError("fp16 precision requires a CUDA device")
            self.dtype = torch.float16
        elif precision == "bf16":
            if self.device.type == "cuda":
                if hasattr(torch.cuda, "is_bf16_supported") and not torch.cuda.is_bf16_supported():
                    raise PrecisionError("bf16 precision is not supported by this CUDA device")
            elif self.device.type != "cpu":
                raise PrecisionError("bf16 precision is only supported on CPU or CUDA")
            self.dtype = torch.bfloat16
        elif precision != "fp32":
            raise PrecisionError("precision must be one of: fp32, fp16, bf16")

        scaler_enabled = precision == "fp16" and self.device.type == "cuda"
        try:
            # Nieuwe PyTorch versies willen het device als eerste argument.
            self.scaler = torch.amp.GradScaler("cuda", enabled=scaler_enabled)
        except (AttributeError, TypeError):
            self.scaler = torch.cuda.amp.GradScaler(enabled=scaler_enabled)

    def autocast(self):
        """Geeft de juiste autocast context terug."""
        if not self.enabled:
            return nullcontext()
        return torch.autocast(device_type=self.device.type, dtype=self.dtype)

    def state_dict(self) -> dict:
        """Geeft de scaler state terug voor checkpoints."""
        if not self.scaler.is_enabled():
            return {}
        return self.scaler.state_dict()

    def load_state_dict(self, state: dict | None) -> None:
        """Laadt de scaler state als die bestaat."""
        if state and self.scaler.is_enabled():
            self.scaler.load_state_dict(state)
