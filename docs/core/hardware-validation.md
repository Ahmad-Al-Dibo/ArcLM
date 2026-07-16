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
296 passed, 10 skipped, 4 warnings
```

Core Milestone 1 / Feature 3 verified final model artifacts on CPU only. GPU
artifact runtime validation was not executed during this feature. CUDA-created
artifact portability remains prepared by design because artifact weights are
saved as CPU state dictionaries, but that path still needs a real GPU rerun.

GPU checkpoint and inference tests remain available under `tests/gpu` and skip
cleanly in `.venv-training-core`.

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
| Native CUDA LoRA | Not executed in this feature | Run in `.venv-gpu-validation` as a separate optional pass |
| CUDA FP16 LoRA | Not executed in this feature | Depends on CUDA PEFT runtime validation |
| CUDA BF16 LoRA | Pending suitable hardware validation | GTX 1050 Ti is not a native BF16 validation platform |
| Hugging Face PEFT runtime | Not executed in this feature | External `peft` package remains optional |
| QLoRA | Not implemented | Requires Feature 3 approval and quantization decisions |
| Multi-GPU PEFT | Not implemented | Requires later distributed milestones |

See also:

- `docs/testing/gpu-capability-matrix.md`
- `docs/testing/local-gtx-1050-ti.md`
- `docs/testing/external-gpu-validation.md`
