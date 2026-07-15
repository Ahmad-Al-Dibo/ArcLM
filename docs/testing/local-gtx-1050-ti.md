# Local GTX 1050 Ti Validation

The GTX 1050 Ti is the local development and CUDA FP32/FP16/BF16 correctness
validation device. It is not a complete ArcLM GPU compatibility platform.

## Environment

```text
Environment: .venv-gpu-validation
Python: 3.12.10
PyTorch: 2.5.1+cu121
CUDA runtime: 12.1
CUDA available: True
GPU: NVIDIA GeForce GTX 1050 Ti
Compute capability: 6.1
VRAM: 4096 MiB
Driver: 546.01
```

PyTorch architecture list:

```text
['sm_50', 'sm_60', 'sm_61', 'sm_70', 'sm_75', 'sm_80', 'sm_86', 'sm_90']
```

## Installed Packages

The GPU validation environment installs the local project editable with
`--no-deps`, then only the small packages needed by the current tests:

- `torch==2.5.1+cu121`
- `numpy`
- `pytest`
- `sentencepiece`
- `PyYAML`
- `tqdm`
- `beautifulsoup4`
- `flask`

It does not install torchvision, torchaudio, Transformers, PEFT, Accelerate, or
large optional integrations.

## Commands Run

```powershell
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/public_api -v
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/compatibility -v
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and not multi_gpu"
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and fp16"
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and bf16"
.\.venv-gpu-validation\Scripts\python.exe -m pytest
```

## Results

- CPU compatibility subset in GPU env: `36 passed, 1 warning`
- Public API in GPU env: `20 passed`
- Compatibility in GPU env: `14 passed, 1 warning`
- Local GPU suite: `8 passed, 3 warnings`
- Full GPU-env suite: `210 passed, 12 warnings`

## Warnings

The remaining warnings are expected deprecation and PyTorch 2.5 checkpoint
warnings. The PyTorch warning is about `torch.load(..., weights_only=False)`.
It should be reviewed in a future checkpoint hardening task, but it did not
block local GPU correctness validation.

## Local Limits

- One GPU only: no multi-GPU claim.
- Tiny fixtures only: no large-model performance claim.
- BF16 correctness passed locally, but native acceleration was not proven.
- No external models or downloads were used.
