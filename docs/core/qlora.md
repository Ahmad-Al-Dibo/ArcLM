# QLoRA and Quantized Fine-Tuning

Core Milestone 2 / Feature 3 adds the first ArcLM quantized fine-tuning
foundation. It implements the QLoRA configuration and backend boundary without
creating a second training engine.

## Status

Implemented and verified at the CPU boundary. Core Milestone 2 / Feature 4 adds
the first runtime matrix for local Hugging Face and CUDA LoRA checks. Real
bitsandbytes QLoRA runtime validation remains pending because bitsandbytes is
not installed in the current CPU or GPU validation environments.

Evidence:

- Implementation: `src/arclm/peft/config.py` and
  `src/arclm/peft/quantization.py`
- Public API:
  - `PeftMethod.QLORA`
  - `QuantizationBackend`
  - `QuantizationConfig`
  - `QLoRAConfig`
  - `inspect_quantization_capabilities`
  - `load_quantized_model`
  - `prepare_model_for_qlora`
  - `validate_quantized_base_model`
- Focused tests: `tests/peft/test_qlora.py` and `tests/quantization`
- Validation level: configuration verified, backend boundary verified, fixture
  verified.

Canonical runtime evidence: [runtime-validation-matrix.md](runtime-validation-matrix.md).

Core Milestone 2 / Feature 6 preserves QLoRA as a configuration and capability
boundary for search. Real bitsandbytes QLoRA search runtime is pending optional
validation and must not be reported as passed from fixture-only tests.

## Supported Backend

| Backend | Status | Runtime evidence | Notes |
| ------- | ------ | ---------------- | ----- |
| `bitsandbytes_4bit` | Implemented boundary | CPU boundary and fixture tests | Uses Transformers `BitsAndBytesConfig` lazily. |
| Other backends | Not implemented | None | GPTQ, AWQ, HQQ, TorchAO, TensorRT, GGUF, ONNX, and INT8 training are outside this feature. |

## Configuration

```python
from arclm.peft import (
    LoRAConfig,
    QLoRAConfig,
    QuantizationConfig,
    QuantizedComputeDType,
)

config = QLoRAConfig(
    quantization=QuantizationConfig(
        bits=4,
        quant_type="nf4",
        use_double_quant=True,
        compute_dtype=QuantizedComputeDType.FP16,
    ),
    lora=LoRAConfig(rank=8, alpha=16),
)
```

`QLoRAConfig` is JSON-safe through `to_dict()` and `from_dict()`. It contains no
runtime objects, callables, device handles, import paths, or secrets.

## Loading Boundary

QLoRA runtime loading is explicit:

```python
from arclm.peft import load_quantized_model

model = load_quantized_model(
    "local-hf-model-folder",
    config,
    device="cuda:0",
)
```

Rules:

- The model source must be a local folder.
- No hidden model download is performed.
- `local_files_only=True` is used.
- `trust_remote_code=False` is the default.
- CUDA must be explicitly available for real 4-bit runtime loading.
- `device_map="auto"` training sharding is not used in this feature.

## Capability Inspection

```python
from arclm.peft import inspect_quantization_capabilities

report = inspect_quantization_capabilities(config)
```

The report separates:

- optional dependency presence
- CUDA availability
- device capability
- 4-bit loading readiness
- QLoRA training readiness
- reasons when a capability is unavailable

This report is evidence, not a runtime training pass.

## Training Flow

QLoRA still uses the normal fine-tuning flow:

```text
dataset
-> prepare_fine_tuning_dataset
-> load quantized base model
-> prepare_model_for_qlora
-> apply LoRA adapters
-> FullFineTuner
-> Trainer
-> checkpoint / adapter artifact
```

There is still one training loop: `Trainer`.

`prepare_model_for_qlora()` rejects unquantized `torch.nn.Linear` models. It
requires a genuinely quantized 4-bit base model, then freezes the base before
LoRA adapters are attached.

## Adapter Artifacts

QLoRA adapter artifacts use the existing PEFT adapter artifact format:

```text
artifact_format = "arclm-peft-adapter"
artifact_version = 1
method = "qlora"
```

The artifact stores LoRA adapter weights plus QLoRA metadata. It does not store
the quantized base model.

The same adapter can be loaded onto a compatible full-precision base model and
merged there for a final model artifact. ArcLM rejects direct merge from a
quantized runtime model:

```text
QLoRA adapters cannot be merged from a quantized runtime model.
Load the adapter on a compatible full-precision base model first.
```

## Optional Dependencies

The base ArcLM install does not require QLoRA dependencies.

```bash
pip install "arclm[qlora]"
```

The optional extra includes:

- `torch>=2.4,<3`
- `transformers>=4.51,<6`
- `bitsandbytes>=0.49,<1` on Python 3.10+

Ordinary `import arclm`, built-in LoRA, SFT, checkpoints, final artifacts, and
evaluation remain available without these dependencies.

## Security

QLoRA loading treats model folders as untrusted local input.

ArcLM does not:

- import arbitrary Python paths from QLoRA config
- serialize Python factories
- use `eval` or `exec`
- download models implicitly
- enable `trust_remote_code` by default
- pretend an FP32 fixture is real 4-bit runtime training

## Evidence Levels

| Evidence level | Status |
| -------------- | ------ |
| Configuration verified | Passed |
| Backend boundary verified | Passed |
| Fixture verified | Passed |
| Hugging Face local CPU runtime | Passed for tiny local fixture |
| Hugging Face CUDA LoRA runtime | Passed on GTX 1050 Ti |
| Real bitsandbytes 4-bit load verified | Pending; bitsandbytes unavailable |
| Real QLoRA GPU training verified | Pending; bitsandbytes unavailable |
| Checkpoint/resume verified | Pending real runtime |
| Artifact/reload verified | Adapter metadata and full-precision reload path verified; real QLoRA runtime pending |

## Limitations

- Real bitsandbytes 4-bit loading was not executed because bitsandbytes is not
  installed in `.venv-training-core` or `.venv-gpu-validation`.
- Real QLoRA GPU training was not executed for the same dependency reason.
- Multi-GPU QLoRA is not implemented.
- Quantized model artifacts are not implemented.
- General quantized inference is not implemented.
- GPTQ, AWQ, HQQ, TorchAO, TensorRT, GGUF, ONNX, and INT8 training are not
  implemented.
