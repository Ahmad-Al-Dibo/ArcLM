# External GPU Validation

Local validation currently uses one NVIDIA GeForce GTX 1050 Ti. That is enough
for local CUDA correctness checks, but not enough for every ArcLM hardware
claim.

## Required External Runners

| Runner | Required hardware | Purpose | Status |
| ------ | ----------------- | ------- | ------ |
| Modern BF16 CUDA runner | CUDA GPU where `torch.cuda.is_bf16_supported()` is true | Confirm BF16 on modern hardware and compare behavior beyond the local GTX path | Pending |
| Two-GPU CUDA runner | At least two CUDA GPUs | DDP, synchronization, multi-GPU checkpoints, multi-GPU resume | Pending |
| FSDP runner | Multi-GPU CUDA with enough VRAM | FSDP sharding and optimizer-state handling after implementation | Pending |
| Larger-memory CUDA runner | CUDA GPU with more VRAM than 4 GB | Larger batch/sequence smoke tests and lower-risk OOM checks | Pending |

## Release Policy

ArcLM may claim:

```text
CUDA FP32 locally verified on GTX 1050 Ti.
CUDA FP16 locally verified on GTX 1050 Ti.
CUDA BF16 correctness locally verified on the tested PyTorch runtime.
```

ArcLM may not claim:

```text
Multi-GPU runtime verified.
DDP world-size-two verified.
FSDP verified.
Native BF16 acceleration verified.
Production GPU performance verified.
```

Those claims require matching external hardware and passing runtime tests.

## Planned Commands

```bash
python -m pytest tests/gpu -v -m "cuda and bf16"
python -m pytest tests/gpu -v -m "multi_gpu"
python -m pytest tests/distributed -v -m "distributed"
```

Paths may change when distributed and multi-GPU implementations are added.
