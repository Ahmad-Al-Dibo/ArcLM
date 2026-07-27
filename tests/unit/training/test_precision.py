import pytest
import torch

if not hasattr(torch, "device"):
    pytest.skip("complete torch is required", allow_module_level=True)

from arclm.exceptions import PrecisionError
from arclm.training.precision import PrecisionHelper


def test_fp32_precision_has_no_scaler():
    helper = PrecisionHelper("fp32", torch.device("cpu"))

    assert helper.enabled is False
    assert helper.state_dict() == {}


def test_bf16_precision_works_on_cpu_autocast():
    helper = PrecisionHelper("bf16", torch.device("cpu"))

    with helper.autocast():
        value = torch.ones(1)

    assert value is not None


def test_fp16_precision_rejects_cpu():
    with pytest.raises(PrecisionError, match="fp16 precision requires a CUDA device"):
        PrecisionHelper("fp16", torch.device("cpu"))


def test_fp16_precision_uses_scaler_on_cuda_when_available():
    if not torch.cuda.is_available():
        pytest.skip("CUDA is not available for FP16 runtime test")

    helper = PrecisionHelper("fp16", torch.device("cuda"))

    assert helper.scaler.is_enabled()
    assert isinstance(helper.state_dict(), dict)


def test_bf16_precision_checks_cuda_support_when_available():
    if not torch.cuda.is_available():
        pytest.skip("CUDA is not available for BF16 runtime test")
    if hasattr(torch.cuda, "is_bf16_supported") and not torch.cuda.is_bf16_supported():
        with pytest.raises(PrecisionError, match="bf16 precision is not supported"):
            PrecisionHelper("bf16", torch.device("cuda"))
        return

    helper = PrecisionHelper("bf16", torch.device("cuda"))

    assert helper.dtype is torch.bfloat16
