# Quantization

ArcLM currently provides a small optional quantization boundary for QLoRA. It is
not a general quantized inference or export system.

Canonical runtime evidence lives in
[runtime-validation-matrix.md](runtime-validation-matrix.md).

## Current Scope

Implemented:

- `QuantizationConfig`
- `QuantizationBackend.BITSANDBYTES_4BIT`
- `QuantizationType.NF4` and `QuantizationType.FP4`
- `QuantizedComputeDType`
- `inspect_quantization_capabilities()`
- `load_quantized_model()` for local Hugging Face folders when optional
  dependencies and CUDA are available
- `prepare_model_for_qlora()` for already quantized local models

Not implemented:

- general INT8 training
- quantized final model artifacts
- GPTQ, AWQ, HQQ, TorchAO, TensorRT, GGUF, ONNX, or vLLM backends
- hidden model downloads
- remote-code loading by default
- multi-GPU quantized training

## Optional Dependencies

The base package does not require quantization dependencies.

```bash
pip install "arclm[qlora]"
```

The optional extra contains Transformers and bitsandbytes. The current CPU and
GPU validation environments do not have bitsandbytes installed, so real 4-bit
runtime validation remains pending.

## Security Rules

Quantized loading uses local paths only. ArcLM does not store arbitrary Python
import paths, call `eval`, call `exec`, download models implicitly, or enable
`trust_remote_code` by default.

## Evidence Status

| Area | Status |
| ---- | ------ |
| Configuration | Implemented and verified |
| Capability reporting | Implemented and verified |
| Missing dependency handling | Implemented and verified |
| CUDA capability detection | Implemented and verified through real CUDA and monkeypatch tests |
| bitsandbytes 4-bit load | Implemented boundary; pending runtime validation |
| real QLoRA training | Implemented boundary; pending runtime validation |
| multi-GPU quantization | Not implemented |
