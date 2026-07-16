# Inference Audit

ArcLM has basic native checkpoint inference and a broader but less verified
external inference layer.

Evidence:

- Implementation: `src/arclm/inference/engine.py`,
  `src/arclm/inference/generation.py`, `src/arclm/inference/external.py`
- Public API: `load_model`, `predict`, `TextGenerator`, `load_any_model`,
  `predict_external`
- Tests: import/CLI/loader tests; no dedicated inference suite was found beyond
  GPU and CLI coverage

Implemented:

- native ArcLM checkpoint loading for inference
- final model artifact loading through `arclm.lifecycle.load_model_artifact`
- cached `predict`
- text generation with temperature, top-k, top-p, and repetition penalty
- external model inspection/loading paths behind optional dependencies

Limitations:

- No focused deterministic generation suite for all sampling settings.
- No true batch inference API.
- No streaming generation API.
- No KV-cache support.
- No serving/OpenAI-compatible API.
- External model inference needs local tiny HF runtime tests.

## Model Artifact Compatibility

Core Milestone 1 / Feature 3 verified a CPU forward-pass inference flow:

```text
save native ArcLM final artifact
→ inspect and validate
→ load artifact on CPU
→ run model forward pass without gradients
```

The existing checkpoint `load_model()` API is preserved. Final artifact loading
is a separate lifecycle API and does not reinterpret training checkpoints as
artifacts.

## Fine-Tuned Artifact Inference

Core Milestone 2 / Feature 1 verifies:

```text
fine-tune native ArcLM model
-> save final model artifact
-> load artifact on CPU
-> run generation helper
```

This is local inference only. Model serving, streaming, OpenAI-compatible APIs,
KV-cache, and batch generation remain future milestones.

## PEFT Inference

Core Milestone 2 / Feature 2 verifies that a LoRA adapter can be reloaded onto a
compatible clean base model and produce matching local inference output. It also
verifies a merged final model artifact can be loaded on CPU and used with the
existing generation helper.
