# Hardware Validation Audit

The default Core validation environment is CPU-only:

```text
Python: 3.12.10
PyTorch: 2.13.0+cpu
CUDA available: False
```

GPU validation is tracked separately:

```text
Local GPU: NVIDIA GeForce GTX 1050 Ti
VRAM: about 4 GB
Compute capability: 6.1
GPU count: 1
Validation environment: .venv-gpu-validation
PyTorch: 2.5.1+cu121
```

Current rules:

- CPU tests are the default gate.
- CUDA tests must skip before execution when CUDA is unavailable.
- A skip is not a pass.
- GTX 1050 Ti validation does not prove native BF16 acceleration, multi-GPU,
  DDP, FSDP, or modern-GPU optimization behavior.
- Multi-GPU and modern BF16 validation require cloud or external hardware.

Current CPU command result:

```text
python -m pytest
326 passed, 13 skipped, 4 warnings
```

Core Milestone 1 / Feature 3 verified final model artifacts on CPU only. GPU
artifact runtime validation was not executed during this feature. CUDA-created
artifact portability remains prepared by design because artifact weights are
saved as CPU state dictionaries, but that path still needs a real GPU rerun.

GPU checkpoint and inference tests remain available under `tests/gpu` and skip
cleanly in `.venv-training-core`. The current local CUDA pass used
`.venv-gpu-validation` with `PYTHONPATH=src` and produced:

```text
python -m pytest tests/gpu -v -m "cuda and not multi_gpu"
10 passed
```

The canonical hardware and optional-runtime evidence is
[runtime-validation-matrix.md](runtime-validation-matrix.md).

## Fine-Tuning Hardware Status

Core Milestone 2 / Feature 1 was verified in the CPU baseline environment.

| Fine-tuning path | Local status | Evidence |
| ---------------- | ------------ | -------- |
| Native CPU SFT | Verified | `tests/smoke/test_finetuning_workflow.py` |
| Native CUDA SFT | Not executed in this feature | Use `.venv-gpu-validation` in a separate GPU pass |
| CUDA FP16 SFT | Not executed in this feature | Prepared by Training Core precision support |
| CUDA BF16 SFT | Pending suitable hardware validation | GTX 1050 Ti is not a native BF16 validation platform |
| Multi-GPU SFT | Not implemented | Requires later DDP/FSDP milestones |
| Hugging Face SFT runtime | Not executed in this feature | Optional local HF fixture needed |

## PEFT Hardware Status

Core Milestone 2 / Feature 2 was verified in the CPU baseline environment.

| PEFT path | Local status | Evidence |
| --------- | ------------ | -------- |
| Native CPU LoRA | Verified | `tests/peft/test_finetuning_workflow.py` |
| Native CUDA LoRA | Verified on GTX 1050 Ti | `tests/gpu/test_huggingface_cuda_runtime.py` |
| CUDA FP16 LoRA | Not separately executed | Training Core FP16 is verified; LoRA CUDA smoke used the default runtime precision |
| CUDA BF16 LoRA | Pending suitable hardware validation | GTX 1050 Ti is not a native BF16 validation platform |
| Hugging Face PEFT runtime | Verified for built-in ArcLM LoRA on tiny local HF model | No external `peft` package required |
| QLoRA configuration/backend boundary | Implemented | `tests/peft/test_qlora.py` |
| QLoRA real bitsandbytes model loading | Pending runtime validation | Requires `arclm[qlora]`, local HF folder, CUDA, and bitsandbytes support |
| QLoRA real GPU training | Pending runtime validation | Requires supported CUDA GPU and optional QLoRA dependencies |
| Multi-GPU PEFT | Not implemented | Requires later distributed milestones |

Feature 4 does not mark QLoRA as locally GPU-runtime-verified. The validation
matrix verifies Hugging Face CPU runtime, CUDA Hugging Face forward, CUDA LoRA,
and missing bitsandbytes detection. Real 4-bit loading and QLoRA training remain
separate runtime gates.

See also:

- `docs/testing/gpu-capability-matrix.md`
- `docs/testing/local-gtx-1050-ti.md`
- `docs/testing/external-gpu-validation.md`

Core Milestone 2 / Feature 5 is not GPU-specific. Its local run manifests record
bounded environment summaries, but they do not convert skipped hardware gates
into passing runtime evidence. Real bitsandbytes QLoRA and multi-GPU validation
remain pending.

Core Milestone 2 / Feature 6 is not GPU-specific. CPU search runtime is
verified with tiny local training trials. Optional CUDA search runtime and real
bitsandbytes QLoRA search runtime remain pending separate validation.

Core Milestone 3 / Feature 1 is not a GPU runtime validation. It verifies
process/runtime inspection in the CPU baseline:

| Distributed path | Local status | Evidence |
| ---------------- | ------------ | -------- |
| `torch.distributed` availability | Verified in CPU baseline | `tests/distributed` |
| Gloo backend capability | Verified in CPU baseline | `tests/distributed` |
| NCCL backend capability | Reported unavailable in CPU baseline | `tests/distributed` |
| Process-group lifecycle | Not implemented in Feature 1 | Planned for Core Milestone 3 / Feature 3 |
| DDP world-size-two | Not implemented | Requires later DDP milestone and at least two GPUs for CUDA validation |
| FSDP | Not implemented | Requires later FSDP milestone and external hardware |
