# ArcLM Implementation Status

This status matrix compares the long-term ArcLM product plan with repository
evidence as of July 16, 2026.

The machine-readable source is
[`docs/implementation_status.json`](implementation_status.json). This Markdown
file summarizes the same counts and highlights the most important gaps.

## Status Definitions

| Status | Definition |
| --- | --- |
| `Implemented` | Works through a public API, has meaningful tests, and has documentation or an example. |
| `Partially implemented` | A meaningful part works, but important validation, tests, integrations, or runtime evidence are missing. |
| `Prototype` | Demonstrates a concept but is not yet a stable reusable feature. |
| `Example only` | The repository contains usage material, but ArcLM does not yet provide a reusable implementation. |
| `Planned` | Part of the roadmap with no stable working implementation yet. |
| `Not implemented` | No meaningful implementation evidence was found. |
| `Blocked` | Depends on unresolved hardware, dependency, or architecture decisions. |
| `Deprecated` | Exists only for compatibility or should no longer be used for new code. |

## Reviewed Scope

| Area | Reviewed features |
| --- | ---: |
| Training | 20 |
| Model architecture | 12 |
| Data pipeline | 17 |
| Tokenization | 8 |
| Inference | 12 |
| Optimization | 12 |
| Evaluation | 8 |
| Deployment | 8 |
| Monitoring and dashboard | 8 |
| Developer experience | 12 |
| Enterprise and product | 10 |
| **Total** | **127** |

## Summary by Status

| Status | Number of features | Percentage |
| --- | ---: | ---: |
| Implemented | 31 | 24.4% |
| Partially implemented | 43 | 33.9% |
| Prototype | 6 | 4.7% |
| Example only | 9 | 7.1% |
| Planned | 4 | 3.1% |
| Not implemented | 33 | 26.0% |
| Blocked | 1 | 0.8% |

## Summary by Area

| Area | Implemented | Partial | Prototype | Example only | Planned | Not implemented | Blocked | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Training | 8 | 6 | 0 | 1 | 1 | 4 | 0 | 20 |
| Model architecture | 1 | 3 | 0 | 2 | 1 | 5 | 0 | 12 |
| Data pipeline | 9 | 5 | 2 | 0 | 1 | 0 | 0 | 17 |
| Tokenization | 4 | 4 | 0 | 0 | 0 | 0 | 0 | 8 |
| Inference | 2 | 5 | 0 | 3 | 0 | 2 | 0 | 12 |
| Optimization | 0 | 3 | 0 | 0 | 1 | 7 | 1 | 12 |
| Evaluation | 3 | 2 | 0 | 2 | 0 | 1 | 0 | 8 |
| Deployment | 1 | 0 | 2 | 0 | 0 | 5 | 0 | 8 |
| Monitoring and dashboard | 0 | 4 | 1 | 0 | 0 | 3 | 0 | 8 |
| Developer experience | 3 | 8 | 1 | 0 | 0 | 0 | 0 | 12 |
| Enterprise and product | 0 | 3 | 0 | 1 | 0 | 6 | 0 | 10 |

## High-Priority Evidence Rows

| Area | Feature | Status | Evidence | Missing work | Priority |
| --- | --- | --- | --- | --- | --- |
| Training | Distributed Data Parallel | Partially implemented | `src/arclm/distributed.py`, `src/arclm/training/trainer.py`, `tests/distributed`, `examples/20_ddp_cpu_trainer.py` | External CUDA DDP pass | High |
| Training | Fully Sharded Data Parallel | Partially implemented | `src/arclm/distributed.py`, `tests/distributed`, `docs/core/distributed-runtime.md` | Real FSDP wrapping/checkpoint runtime on multi-GPU | High |
| Training | QLoRA | Partially implemented | `src/arclm/peft/quantization.py`, `tests/peft/test_qlora.py`, `docs/core/qlora.md` | Real bitsandbytes GPU runtime validation | High |
| Model architecture | Qwen-compatible models | Example only | `examples/qwen3_0_6b_sft`, `tests/regression/test_qwen_structured_output_example.py` | Runtime validation with selected Qwen model | High |
| Inference | Structured output | Example only | `examples/qwen3_0_6b_sft`, `tests/regression/test_qwen_structured_output_example.py` | Reusable constrained/validated output API | High |
| Optimization | BF16 | Partially implemented | `src/arclm/training/trainer.py`, `tests/gpu/test_cuda_bf16.py` | Modern-GPU native BF16 validation | High |
| Optimization | INT4 quantization | Partially implemented | `src/arclm/peft/quantization.py`, `tests/peft/test_qlora.py` | bitsandbytes GPU runtime | High |
| Data pipeline | PII detection or redaction | Prototype | `src/arclm/preprocess/pii.py` | Security-grade validation and docs | High |
| Developer experience | Basic examples | Partially implemented | `examples/01_quickstart.py`, `examples/02_tokenization.py`, `examples/11_inference.py` | Requested folder-based example layout | High |
| Developer experience | CI | Partially implemented | `pyproject.toml`, current pytest markers | Workflow verification in `.github/workflows` | High |

## Recommended Next Work

| Priority | Feature | Reason | Main dependency | Estimated complexity |
| --- | --- | --- | --- | --- |
| High | Folder-based runnable examples | The current examples are useful but not organized in the requested beginner/fine-tuning/Hugging Face/advanced folder layout. | Existing public APIs and Qwen example | Medium |
| High | Qwen structured-output runtime validation | Customer-facing use case needs real base/fine-tuned output evidence, not only helper regression tests. | Optional Hugging Face dependencies, model access, hardware decision | Medium |
| High | Reusable structured-output validation API | The Qwen example validates JSON in example code; library users need a reusable, tested Core helper. | Inference API boundary decision | Medium |
| High | QLoRA bitsandbytes GPU runtime | QLoRA is implemented as a boundary but not fully hardware-verified. | CUDA GPU with bitsandbytes support | Large |
| High | CI workflow hardening | Default fast tests should run reliably and optional GPU/internet tests should be gated. | Repository workflow policy | Medium |

## Notes

- This file does not claim every Hugging Face model is fully supported.
- GPU, multi-GPU, Flash Attention, and bitsandbytes statuses remain separated
  from CPU and fixture-only evidence.
- Web code remains present, but the Web track is paused by project direction.
- The full row-level feature evidence is in
  [`docs/implementation_status.json`](implementation_status.json).
