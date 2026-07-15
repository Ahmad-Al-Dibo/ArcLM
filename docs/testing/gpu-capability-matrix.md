# GPU Capability Matrix

Last tested: 2026-07-15

Local GPU environment:

- Environment: `.venv-gpu-validation`
- OS: Windows 11
- Python: 3.12.10
- PyTorch: `2.5.1+cu121`
- CUDA runtime: `12.1`
- NVIDIA driver: `546.01`
- GPU: NVIDIA GeForce GTX 1050 Ti
- Compute capability: `(6, 1)`
- PyTorch architectures: `sm_50`, `sm_60`, `sm_61`, `sm_70`, `sm_75`, `sm_80`, `sm_86`, `sm_90`
- VRAM: 4096 MiB

| Feature | Implementation status | Local runtime status | Cloud runtime status | Hardware requirement | Test command | Evidence | Limitations |
| ------- | --------------------- | -------------------- | -------------------- | -------------------- | ------------ | -------- | ----------- |
| CUDA device discovery | Implemented | Locally verified | Not required for basic correctness | CUDA-capable NVIDIA GPU | `python -c "import torch; ..."` | CUDA available, 1 GTX 1050 Ti, `sm_61` present | Single GPU only |
| CUDA FP32 training | Implemented | Locally verified | Not required for basic correctness | CUDA GPU | `python -m pytest tests/gpu -v -m "cuda and not multi_gpu"` | `test_cuda_fp32.py` passed | Tiny model correctness only |
| CUDA FP32 evaluation | Implemented | Locally verified | Not required for basic correctness | CUDA GPU | same as above | Evaluation loss finite | Tiny dataset only |
| CUDA FP16 training | Implemented | Locally verified | Recommended on modern GPU | CUDA GPU with FP16 ops | `python -m pytest tests/gpu -v -m "cuda and fp16"` | `test_cuda_fp16.py` passed | Correctness only, no tensor-core claim |
| CUDA FP16 GradScaler | Implemented | Locally verified | Recommended on modern GPU | CUDA GPU | same as above | `GradScaler.is_enabled()` true; scaler checkpoint state saved | Tiny model only |
| CUDA BF16 training | Implemented | Locally verified by PyTorch runtime path | Required on modern BF16 hardware for release confidence | CUDA GPU reporting BF16 support | `python -m pytest tests/gpu -v -m "cuda and bf16"` | `test_cuda_bf16.py` passed; BF16 output dtype observed | Native acceleration is not proven |
| Gradient accumulation on CUDA | Implemented | Locally verified | Not required for basic correctness | CUDA GPU | GPU suite | `global_step=3`, `optimizer_step=2` | Tiny batch count only |
| Gradient clipping on CUDA | Implemented | Locally verified | Not required for basic correctness | CUDA GPU | GPU suite | clipping saw CUDA parameters and finite gradients | Tiny gradients only |
| CUDA checkpoint save | Implemented | Locally verified | Recommended for larger configs | CUDA GPU | GPU suite | checkpoint files saved for FP32/FP16/BF16 | Local filesystem only |
| CUDA resume with new objects | Implemented | Locally verified | Recommended for larger configs | CUDA GPU | GPU suite | new model/trainer resumed and global step continued | Tiny model only |
| CUDA-created checkpoint CPU inspection | Implemented | Locally verified | Not required for basic correctness | CPU plus CUDA checkpoint | GPU suite | `torch.load(..., map_location="cpu")` passed | PyTorch 2.5 emits `weights_only=False` warning |
| CUDA inference | Implemented | Locally verified | Recommended for larger configs | CUDA GPU | GPU suite | `arclm.inference.load_model(..., device="cuda")` generated output | Tiny native checkpoint only |
| CUDA OOM behavior | Implemented by propagation | Locally verified with safe simulated OOM | Recommended with real low-memory cases | CUDA GPU | GPU suite | no silent CPU fallback; process recoverable | Simulated OOM, not real memory pressure |
| Multi-GPU DDP | Not implemented | Hardware unavailable locally | Pending | At least two CUDA GPUs | Not run | One local GPU only | No multi-GPU claim |
| FSDP | Not implemented | Hardware unavailable locally | Pending | Multi-GPU CUDA runner | Not run | No implementation evidence | Future milestone |

## Precision Observations

| Runtime | Capability reported | Training | Evaluation | Checkpoint/resume | Peak VRAM | Status |
| ------- | ------------------- | -------- | ---------- | ----------------- | --------: | ------ |
| CPU FP32 | Yes | Existing CPU suite passed | Existing CPU suite passed | Existing CPU suite passed | N/A | Verified in `.venv-training-core` |
| CUDA FP32 | Yes | Passed | Passed | Passed | 18,097,664 bytes | Locally verified |
| CUDA FP16 | Yes | Passed | Passed | Passed | 18,098,688 bytes | Locally verified |
| CUDA BF16 | PyTorch reports yes | Passed | Passed | Passed | 18,097,664 bytes | Locally verified for correctness |

Observed dtypes:

- FP32: model outputs `torch.float32`; autocast disabled; GradScaler disabled.
- FP16: model outputs included `torch.float16`; autocast enabled; GradScaler enabled.
- BF16: model outputs included `torch.bfloat16`; autocast enabled; GradScaler disabled.

BF16 note: local correctness passed because PyTorch reported support and the tiny runtime path worked. This does not prove native BF16 acceleration on the GTX 1050 Ti. Cloud validation on modern BF16 hardware is still required before broad BF16 release claims.
