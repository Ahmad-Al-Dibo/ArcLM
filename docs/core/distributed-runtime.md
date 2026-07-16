# Distributed Runtime

ArcLM now has a small distributed runtime abstraction for future DDP and FSDP
work. This feature does not implement distributed training.

## Public API

Use domain imports:

```python
from arclm.distributed import (
    DistributedConfig,
    get_distributed_info,
    validate_distributed_config,
    resolve_process_device,
)
```

The root `import arclm` remains lightweight and does not import PyTorch or
distributed helpers eagerly.

## What Is Implemented

- `DistributedConfig` for backend, rank, world size, local rank, device, and
  launcher environment values.
- `DistributedConfig.from_env()` for `RANK`, `WORLD_SIZE`, `LOCAL_RANK`,
  `MASTER_ADDR`, and `MASTER_PORT`.
- `DistributedRuntimeInfo` for safe runtime inspection.
- `DistributedValidationResult` and `DistributedValidationIssue` for structured
  config errors and warnings.
- Gloo/NCCL backend availability checks through `torch.distributed`.
- Device resolution for `cpu`, `cuda`, `cuda:<index>`, and `auto`.
- No silent CPU fallback when CUDA is explicitly requested.
- Launcher environment creation through `build_distributed_env()`.
- `validate_distributed_setup()` for rendezvous, CUDA, NCCL, local-rank, and
  single-process warning checks.
- `init_process_group()`, `destroy_process_group()`, and
  `process_group_context()` for safe Gloo process-group lifecycle validation.
- `launch_processes()` for bounded local multiprocessing with structured worker
  results.
- `SingleGpuBoundaryInfo`, `inspect_single_gpu_boundary()`, and
  `validate_single_gpu_boundary()` for honest local CUDA boundary checks.
- A CUDA-marked single-GPU smoke test that initializes one worker process group
  and runs a tiny CUDA backward pass when a CUDA runtime is available.
- `ExternalValidationTarget` and
  `get_external_multi_gpu_validation_matrix()` for provider-independent cloud
  validation commands and release gates.
- Skipped external gate tests for multi-GPU DDP, multi-GPU FP16/BF16,
  distributed checkpoint/resume, FSDP, and newer-GPU optimizations.
- `Trainer(..., distributed_config=...)` for explicit DDP trainer integration.
- DDP model wrapping through PyTorch `DistributedDataParallel`.
- `DistributedSampler` for dataset splitting across ranks.
- Rank-zero-only checkpoint writes for the DDP trainer path.
- `Trainer.save_checkpoint(..., synchronize=True)` for all-rank synchronized
  checkpoint saves around rank-zero writes.
- Distributed checkpoint metadata in training checkpoints.
- Distributed `load_checkpoint()` rank synchronization before and after load.
- CPU/Gloo DDP resume with new model and trainer objects.
- `tests/gpu/test_two_gpu_ddp_runtime.py` as the provider-independent external
  two-GPU CUDA/NCCL DDP gate.
- `FSDPCapabilityInfo`, `inspect_fsdp_capability()`, and
  `validate_fsdp_capability()` for FSDP capability checks without model
  wrapping or process-group initialization.
- `FSDPWrapConfig`, `FSDPWrapInfo`, `FSDPWrappedModel`, and
  `wrap_fsdp_model()` for explicit FSDP wrapping after capability checks and
  active process-group validation.
- `FSDPCheckpointPolicy`, `FSDPCheckpointPlan`,
  `plan_fsdp_sharded_checkpoint()`, and
  `validate_fsdp_checkpoint_policy()` for the future sharded checkpoint and
  optimizer-state contract plus synchronized resume and rank-zero final-artifact
  handoff intent. This is a policy and per-rank plan only; it does not write
  shard files or final artifacts.

## What Is Not Implemented

- Automatic Trainer FSDP integration
- FSDP sharded checkpoint file writing or loading
- FSDP optimizer-state file writing
- FSDP final artifact writing
- Multi-GPU runtime validation
- A completed real two-GPU CUDA DDP runtime pass
- A completed real two-GPU CUDA distributed checkpoint/resume pass
- A claim that single-GPU smoke equals DDP or multi-GPU validation
- A claim that skipped external gates are runtime validation

## Validation

Run:

```bash
python -m pytest tests/distributed -v
python -m pytest tests/public_api -v
```

The first verified baseline for this feature used:

```text
Python: 3.12.10
PyTorch: 2.13.0+cpu
Backend evidence: torch.distributed available, gloo available, nccl unavailable
Focused distributed tests: 19 passed
Public API tests: 26 passed
```

After Feature 2:

```text
Focused distributed tests: 29 passed
Public API tests: 26 passed
```

After Feature 3:

```text
Focused distributed tests: 35 passed
Public API tests: 26 passed
Compatibility tests: 15 passed, 1 known warning
```

After Feature 4:

```text
Focused distributed tests: 40 passed
Public API tests: 26 passed
Example `examples/17_multiprocessing_launcher.py`: passed
```

After Feature 5:

```text
Focused distributed tests: 43 passed
CPU CUDA/distributed marker gate: 2 skipped, 10 deselected
GTX 1050 Ti single-GPU distributed smoke: 2 passed
Public API tests: 26 passed
Example `examples/18_single_gpu_distributed_smoke.py`: passed in CPU and GPU environments
Full Python suite: 390 passed, 15 skipped, 4 warnings
```

The GPU example produced a non-failing PyTorch socket warning after the worker
completed. The worker still initialized the process group and ran on `cuda:0`.

After Feature 6:

```text
Focused distributed tests: 46 passed
Public API tests: 26 passed
External marker gate: 6 skipped, 13 deselected
Full Python suite: 393 passed, 22 skipped, 4 warnings
```

External gate skips are not passes. They record exact future commands and
release gates for hardware that is unavailable locally or for features that are
not implemented yet.

After Feature 7:

```text
Focused distributed tests: 47 passed
Training tests: 28 passed, 2 skipped
Public API tests: 26 passed
External two-GPU DDP gate: 1 skipped, 18 deselected
Example `examples/20_ddp_cpu_trainer.py`: passed
Full Python suite: 394 passed, 22 skipped, 4 warnings
```

Feature 7 validates DDP on two CPU/Gloo processes. It does not claim real
two-GPU CUDA DDP validation.

After Feature 8:

```text
Focused distributed tests: 48 passed
Checkpoint tests: 11 passed
Training tests: 28 passed, 2 skipped
Public API tests: 26 passed
Compatibility tests: 15 passed, 1 known warning
```

Feature 8 validates distributed checkpoint/resume on two CPU/Gloo processes.
It adds rank synchronization for distributed loads and an opt-in synchronized
save path for checkpoint calls made by all ranks. It does not claim real
two-GPU CUDA checkpoint/resume validation.

After Feature 9:

```text
Two-GPU CUDA DDP gate: 1 skipped, 18 deselected
Two-GPU skip reason: Two-GPU CUDA DDP validation requires CUDA.
Focused distributed tests: 48 passed
```

Feature 9 adds the real external gate. On hardware with at least two CUDA GPUs
and NCCL, the gate runs CUDA DDP training, rank-zero checkpoint save,
new-object checkpoint load, and resumed training. The local CPU environment only
proves that the gate selects and skips honestly.

After Core Milestone 4 / Feature 1:

```text
Focused distributed tests: 52 passed
Public API tests: 26 passed
FSDP external marker gate: 1 skipped, 17 deselected
Full Python suite: 399 passed, 21 skipped, 4 warnings
```

Feature 1 adds FSDP config and capability checks only. It verifies that ArcLM
requires PyTorch FSDP, CUDA multi-GPU hardware, and NCCL before reporting a
local FSDP runtime as available. It does not wrap a model, shard parameters,
write sharded checkpoints, or claim external FSDP runtime validation.

After Core Milestone 4 / Feature 2:

```text
Focused distributed tests: 57 passed
Public API tests: 26 passed
FSDP external marker gate: 1 skipped, 17 deselected
Full Python suite: 404 passed, 21 skipped, 4 warnings
```

Feature 2 adds the explicit model-wrapping boundary. `wrap_fsdp_model()` requires
world size greater than one, successful FSDP capability validation, an initialized
process group, matching rank/world-size, and CUDA device resolution before it
calls PyTorch FSDP. The CPU baseline covers the rejection paths and a mocked
positive handoff. It does not claim local or external FSDP runtime validation.

After Core Milestone 4 / Feature 3:

```text
Focused distributed tests: 69 passed
Public API tests: 26 passed
Checkpoint tests: 11 passed
FSDP external marker gate: 1 skipped, 17 deselected
```

Feature 3 adds the sharded checkpoint policy contract only.
`FSDPCheckpointPolicy` requires sharded state dictionaries, a rank-zero
manifest, per-rank model shards, safe relative paths, no optimizer-state
support, and no resume support. `plan_fsdp_sharded_checkpoint()` returns a
rank-specific plan that identifies whether the rank writes the manifest and the
future model shard path. It does not write files, save optimizer state, load
checkpoints, or claim FSDP runtime validation.

After Core Milestone 4 / Feature 4:

```text
Focused distributed tests: 71 passed
Public API tests: 26 passed
Checkpoint tests: 11 passed
```

Feature 4 adds optimizer-state planning to the sharded checkpoint contract.
`FSDPCheckpointPolicy` now defaults to `optimizer_state_policy="sharded"` and
validates `optimizer_shard_directory` as a safe relative path.
`FSDPCheckpointPlan` reports whether the rank should write optimizer state and
the future per-rank optimizer shard path. The compatibility value
`optimizer_state_policy="not_supported"` remains accepted and produces no
optimizer shard path. This feature still does not write shard files, load
optimizer state, implement resume, or claim FSDP runtime validation.

After Core Milestone 4 / Feature 5:

```text
Focused distributed tests: 74 passed
Public API tests: 26 passed
Checkpoint tests: 11 passed
```

Feature 5 adds synchronized resume and final-artifact handoff planning to the
FSDP policy contract. `FSDPCheckpointPolicy` now defaults to
`resume_policy="rank_synchronized"` and
`artifact_handoff_policy="rank_zero_metadata"`. `FSDPCheckpointPlan` reports
that all ranks are required for resume and marks rank 0 as the only rank that
should write future artifact handoff metadata. The compatibility values
`resume_policy="not_supported"` and `artifact_handoff_policy="not_supported"`
remain accepted. This feature still does not read checkpoint shards, restore
FSDP state, save final model artifacts, or claim FSDP runtime validation.

## Simple Example

Run:

```bash
python examples/18_single_gpu_distributed_smoke.py
```

On CPU-only machines the example prints the missing CUDA reason and exits
without claiming a pass. On the GTX 1050 Ti validation environment it starts one
worker, initializes a one-process group, runs a tiny CUDA backward pass, and
prints the worker result.

To print the external validation matrix:

```bash
python examples/19_external_multi_gpu_validation_matrix.py
```

The matrix includes these future gates:

| Target | Required hardware | Command | Status |
| ------ | ----------------- | ------- | ------ |
| CUDA BF16 modern GPU | One CUDA GPU where `torch.cuda.is_bf16_supported()` is true | `python -m pytest tests/gpu -v -m "cuda and bf16"` | Implemented, pending cloud runtime validation |
| Two-GPU DDP runtime | At least two CUDA GPUs with NCCL | `python -m pytest tests/gpu -v -m "multi_gpu and distributed"` | Implemented, pending external runtime validation |
| Multi-GPU FP16 | At least two CUDA GPUs with FP16 support | `python -m pytest tests/gpu -v -m "multi_gpu and fp16"` | Not implemented |
| Multi-GPU BF16 | At least two BF16-capable CUDA GPUs | `python -m pytest tests/gpu -v -m "multi_gpu and bf16"` | Not implemented |
| Distributed checkpoint/resume | At least two CUDA GPUs with NCCL | `python -m pytest tests/gpu -v -m "multi_gpu and checkpoint"` | Implemented, pending external runtime validation |
| FSDP runtime | At least two CUDA GPUs with PyTorch FSDP and NCCL support | `python -m pytest tests/gpu -v -m "multi_gpu and fsdp"` | Wrapping boundary plus checkpoint, optimizer, resume, and artifact handoff policies implemented; runtime validation pending |
| Newer-GPU optimizations | Backend-supported CUDA GPU | `python -m pytest tests/gpu -v -m "cuda and optimization"` | Not implemented |

To run the CPU DDP trainer example:

```bash
python examples/20_ddp_cpu_trainer.py
```

It starts two local CPU workers, wraps the model with DDP, trains a tiny model,
and shows that only rank 0 returns a checkpoint path. It may print a non-failing
PyTorch socket warning on Windows after the worker result.

## Windows Rendezvous Note

ArcLM-generated TCP rendezvous URLs add `?use_libuv=0` on Windows. PyTorch
2.5.1 CUDA wheels can otherwise request libuv even when the wheel lacks libuv
support. User-provided `init_method` values are left unchanged.

## Security Boundary

The runtime abstraction does not start workers and does not execute remote code.
It reads only explicit configuration values and standard distributed
environment variables. It does not store secrets and does not expose arbitrary
environment values.

Future launchers must keep this boundary:

- validate rank and world size before launching workers
- avoid logging full environment blocks
- fail clearly when requested CUDA devices are unavailable
- keep single-process training behavior unchanged
- require real multi-GPU hardware before claiming DDP/FSDP validation

## Next Work

Core Milestone 4 / Feature 5 is complete as resume and artifact handoff policy
planning. Real FSDP runtime is still pending checkpoint file writing/loading and
suitable hardware. The next recommended implementation
feature is:

```text
Core Milestone 4 / Feature 6:
External Hardware Validation
```

That feature should run or prepare external hardware validation only. It must
not claim a pass without at least two suitable CUDA GPUs.
