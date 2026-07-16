# Runtime Validation Matrix

This is the canonical runtime evidence file for Hugging Face, LoRA, QLoRA,
CUDA, and optional quantization checks.

Date: 2026-07-16

## Environments

| Environment | Python | PyTorch | CUDA | GPU | Optional packages |
| ----------- | ------ | ------- | ---- | --- | ----------------- |
| Core CPU baseline | 3.12.10 | 2.13.0+cpu | Not available | None | Transformers 5.13.1; bitsandbytes not installed; external peft not installed |
| Local GPU validation | 3.12.10 | 2.5.1+cu121 | 12.1 | NVIDIA GeForce GTX 1050 Ti, compute capability 6.1, one GPU | Transformers 5.13.1; bitsandbytes not installed; external peft not installed |

The GPU command was run with `PYTHONPATH=src` so the validation used the current
workspace code instead of an older installed copy.

## Validation Results

| Capability | Implementation status | CPU runtime | Local CUDA runtime | Cloud/runtime status | Evidence |
| ---------- | --------------------- | ----------- | ------------------ | -------------------- | -------- |
| Hugging Face local model artifact | Implemented | Verified | Not required | Complete for tiny local fixture | `tests/integration/test_huggingface_runtime_validation.py::test_huggingface_lifecycle_artifact_cpu_runtime` |
| Hugging Face full fine-tuning | Implemented | Verified | Not executed | CUDA optional | `tests/integration/test_huggingface_runtime_validation.py::test_huggingface_full_fine_tuning_checkpoint_resume_and_artifact` |
| Hugging Face evaluation adapter | Implemented | Verified | Not required | Complete for tiny local fixture | `tests/integration/test_huggingface_runtime_validation.py::test_huggingface_evaluator_with_model_adapter` |
| Built-in LoRA on Hugging Face model | Implemented | Verified | Verified | Complete for tiny local fixture | `tests/integration/test_huggingface_runtime_validation.py::test_huggingface_lora_runtime_adapter_reload_merge_and_artifact`; `tests/gpu/test_huggingface_cuda_runtime.py` |
| CUDA full-precision Hugging Face forward | Implemented | Not applicable | Verified on GTX 1050 Ti | Complete for tiny local fixture | `tests/gpu/test_huggingface_cuda_runtime.py::test_huggingface_cuda_forward_uses_cuda_device` |
| CUDA LoRA training step | Implemented | Not applicable | Verified on GTX 1050 Ti | Complete for tiny local fixture | `tests/gpu/test_huggingface_cuda_runtime.py::test_huggingface_lora_cuda_training_step` |
| CUDA checkpoint/resume RNG restore | Implemented and hardened | CPU regression verified | Verified on GTX 1050 Ti | Complete for local single GPU | `tests/checkpoints`; `tests/gpu/test_cuda_checkpoint_resume.py` |
| QLoRA configuration and boundary | Implemented | Verified | Verified boundary only | Complete for API boundary | `tests/peft/test_qlora.py`; `tests/quantization/test_runtime_matrix.py` |
| bitsandbytes import/runtime | Optional | Missing dependency detected | Missing dependency detected | Pending environment with bitsandbytes | `tests/quantization/test_runtime_matrix.py` |
| bitsandbytes 4-bit load | Implemented boundary | Hardware/dependency unavailable | Dependency unavailable | Pending cloud or local optional env | `python -m pytest tests/quantization -v -m "bitsandbytes and qlora"` |
| Real QLoRA forward/backward/optimizer step | Implemented boundary | Hardware/dependency unavailable | Dependency unavailable | Pending cloud or local optional env | `python -m pytest tests/quantization -v -m "bitsandbytes and qlora"` |
| QLoRA checkpoint/resume on real quantized model | Not runtime-verified | Not executed | Not executed | Pending after bitsandbytes runtime passes | Future focused test |
| QLoRA adapter artifact from real quantized model | Not runtime-verified | Not executed | Not executed | Pending after bitsandbytes runtime passes | Future focused test |
| Multi-GPU QLoRA | Not implemented | Hardware unavailable | Hardware unavailable | Pending later DDP/FSDP milestones | No passing runtime evidence |

## Commands

Default CPU gate:

```bash
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Focused optional CPU/HF validation:

```bash
python -m pytest tests/integration/test_huggingface_runtime_validation.py -v
python -m pytest tests/quantization -v
```

Local CUDA validation:

```powershell
$env:PYTHONPATH = (Join-Path (Get-Location) "src")
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests\gpu -v -m "cuda and not multi_gpu"
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests\quantization -v
```

Provider-independent QLoRA runtime gate:

```bash
python -m pytest tests/quantization -v -m "bitsandbytes and qlora"
```

This gate requires:

- CUDA-enabled PyTorch
- `transformers`
- `bitsandbytes`
- a CUDA GPU supported by the installed bitsandbytes wheel
- local model fixtures only; no internet download

Expected result when the environment is suitable:

- real local 4-bit load succeeds
- QLoRA preparation freezes the quantized base
- LoRA adapter parameters receive finite gradients
- optimizer step changes adapter parameters only
- no silent CPU fallback occurs

## Release Gates

| Claim | Required evidence |
| ----- | ----------------- |
| Hugging Face CPU runtime verified | CPU integration tests pass with local tiny HF fixture |
| Hugging Face CUDA runtime verified | CUDA HF tests pass on real CUDA device |
| CUDA LoRA verified | CUDA LoRA test passes on real CUDA device |
| QLoRA implemented | Config, capability, boundary, and fixture tests pass |
| QLoRA runtime verified | bitsandbytes QLoRA runtime gate passes on supported CUDA hardware |
| QLoRA production-ready | runtime gate, checkpoint/resume, adapter artifact reload, merge-to-full-precision, evaluation, and inference pass |
| Multi-GPU PEFT verified | real two-or-more-GPU tests pass; CPU or one-GPU simulation is not enough |

## Known Limits

- bitsandbytes is not installed in either current validation environment.
- The GTX 1050 Ti is useful for CUDA FP32, FP16, single-GPU LoRA, checkpoint,
  resume, and inference checks, but it is not a complete modern quantization or
  multi-GPU validation platform.
- A skip caused by missing bitsandbytes or missing hardware is recorded as
  pending validation, not as a pass.
