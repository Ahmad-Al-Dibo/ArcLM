# ArcLM Community and Pro Plan

This is a recommendation, not a final licensing decision.

## Product Boundary

- Community should stay a complete local learning and development library.
- Shared Core should contain optional external-model bridges that are broadly useful but dependency-heavy.
- Pro should focus on operational scale, automation, governance, and commercial workflows.
- Pro must extend Community rather than duplicate it.
- License checks and billing must remain outside the Community core.

| Feature | Current Status | Recommended Product | Shared Dependency | Reason | Licensing Risk |
| ------- | -------------- | ------------------- | ----------------- | ------ | -------------- |
| Native ArcLM models | Implemented | Community | Torch | Core educational value | Low |
| Tokenizers | Implemented/Partial | Community | SentencePiece | Needed for local workflows | Low |
| Dataset loading/cleaning/dedup | Implemented | Community | None/Torch | Foundational data work | Low |
| Streaming datasets | Implemented | Community | None | Local scale without services | Low |
| Single-device training | Implemented | Community | Torch | Core library function | Low |
| Checkpoints/resume | Implemented and hardened | Community | Torch | Reliability requirement; includes versioned checkpoint metadata, RNG state, inspection, and atomic writes | Low |
| Basic evaluation | Implemented | Community | Torch | Required to validate models | Low |
| Full fine-tuning/SFT | Implemented | Community | Torch | Core LLM workflow | Low |
| Basic inference | Implemented | Community | Torch | Expected local usage | Low |
| Model lifecycle and configuration contract | Implemented | Community | Torch, optional adapters | Required before advanced Core features can be reliable | Low |
| Final model artifacts | Implemented | Community | Torch; optional Transformers for HF | Required for local evaluation, inference, sharing, export, and future fine-tuning handoff | Medium |
| Public API/compatibility | Implemented | Community | None | Protects users | Low |
| Plugin interfaces | Interface Only | Community | None | Lightweight extension point | Medium if loaded unsafely |
| Hugging Face loading/tokenizers | Partial/Experimental | Shared Core | Transformers | Common external model bridge | Medium |
| Mixed precision | Partial | Shared Core | CUDA/Torch | Useful locally, hardware-sensitive | Low |
| Full fine-tuning/SFT | Implemented | Community | Torch | Local model adaptation should be useful without Pro | Medium if datasets leak |
| Built-in LoRA | Implemented | Shared Core | Torch | Local adapter fine-tuning without external PEFT dependency | Medium |
| External PEFT automation | Not Implemented | Pro | PEFT/Transformers | Advanced automation and matrix testing | Medium |
| QLoRA/quant PEFT boundary | Implemented foundation | Shared Core | Transformers/bitsandbytes optional | Hardware-sensitive advanced training with strict runtime gates | Medium |
| QLoRA production runtime | Pending validation | Pro/Shared Core decision pending | bitsandbytes/CUDA | Needs real 4-bit load, train, checkpoint/resume, and artifact evidence | Medium |
| DDP/FSDP/Multi-GPU | Not Implemented | Pro | Torch distributed | Operational orchestration | Low |
| Local run manifests | Implemented | Community | None beyond Core | Reproducible local training and fine-tuning records | Medium |
| Local hyperparameter search | Implemented | Community | None beyond Core | Reproducible sequential trial orchestration without external services | Medium |
| Experiment tracking services | Compatibility-only | Pro | MLflow/W&B/etc. | Team/external-service workflows | Medium |
| Dashboards | Not Implemented | Pro | Web stack | Product UI | Medium |
| Production serving | Not Implemented | Pro | FastAPI/vLLM/etc. | Operational reliability | Medium |
| Cloud deployment | Not Implemented | Pro | Cloud SDKs | Provider automation | Medium |
| Export/quant automation | Not Implemented/Experimental | Pro | ONNX/TensorRT/GGUF tools | Artifact validation burden | Medium |
| Large benchmarks | Not Implemented | Pro | datasets/network | Dataset and report operations | Medium |
| Security governance | Partial/Not Implemented | Pro | varies | Enterprise concern | High |
| Auth/RBAC/audit/billing/license | Not Implemented | Pro | server/payment/auth stack | Commercial platform layer | High |

## What Remains Open Source

Community should include everything required to build, prepare data, train, fine-tune, evaluate, checkpoint, resume, and run local inference on small models.

Core Milestone 2 / Feature 1 keeps full-parameter fine-tuning and SFT in
Community. Core Milestone 2 / Feature 2 adds built-in local LoRA in Shared Core
without requiring the external PEFT package. Core Milestone 2 / Feature 3 adds
the QLoRA configuration/backend boundary, and Feature 4 verifies local
Hugging Face plus CUDA LoRA runtime. Production QLoRA claims remain gated on
real bitsandbytes runtime validation. Broader external PEFT automation remains
future work and is not approved automatically.

Core Milestone 2 / Feature 5 adds local run manifests to Community. External
tracking services remain Pro-oriented compatibility paths until they receive
focused optional-dependency tests and a product decision.

Core Milestone 2 / Feature 6 adds local sequential hyperparameter search to
Community. Parallel search, distributed search, cloud workers, Web-controlled
tuning, and external sweep providers remain future Shared Core or Pro work.

Core Milestone 3 / Feature 1 adds the small `arclm.distributed` process/runtime
abstraction as Shared Core infrastructure. DDP, FSDP, multi-GPU orchestration,
distributed checkpoints, cloud launchers, and production operations remain
Pro-oriented or separately approved work.

## What Pro Adds

Pro adds scale and operations: multi-GPU orchestration, PEFT automation, production serving, dashboards, cloud deployment, advanced evaluation suites, team governance, and enterprise controls.

## Discovery

Optional Pro features should be discoverable through docs and optional imports. Community imports must not fail when Pro dependencies are missing.

## License Checks

Do not implement license checks in this planning phase. If added later, they should live in a Pro package/server boundary and must not wrap or disable Community core code.
