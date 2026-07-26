"""Provider-onafhankelijke gates voor externe GPU-validatie.

Deze tests zijn expres skips totdat de implementatie en hardware bestaan. Ze
zorgen wel dat de gedocumenteerde marker-commands echte testselecties hebben.
"""

from __future__ import annotations

import pytest


pytestmark = [pytest.mark.gpu]


@pytest.mark.cuda
@pytest.mark.bf16
def test_cuda_bf16_modern_gpu_external_gate():
    pytest.skip("BF16 CUDA validation requires a CUDA device with native BF16 support.")


@pytest.mark.multi_gpu
@pytest.mark.fp16
def test_multi_gpu_fp16_external_gate():
    pytest.skip("Multi-GPU FP16 validation requires an approved distributed trainer and at least two CUDA GPUs.")


@pytest.mark.multi_gpu
@pytest.mark.bf16
def test_multi_gpu_bf16_external_gate():
    pytest.skip("Multi-GPU BF16 validation requires native BF16-capable multi-GPU hardware.")


@pytest.mark.multi_gpu
@pytest.mark.fsdp
def test_fsdp_runtime_external_gate():
    pytest.skip("FSDP runtime validation requires an approved FSDP implementation and at least two CUDA GPUs.")


@pytest.mark.cuda
@pytest.mark.optimization
def test_flash_attention_newer_gpu_external_gate():
    pytest.skip("Newer-GPU optimization validation requires an approved backend and suitable CUDA hardware.")
