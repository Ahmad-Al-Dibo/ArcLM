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
| Checkpoints/resume | Implemented | Community | Torch | Reliability requirement | Low |
| Basic evaluation | Implemented | Community | Torch | Required to validate models | Low |
| Full fine-tuning/SFT | Implemented | Community | Torch | Core LLM workflow | Low |
| Basic inference | Implemented | Community | Torch | Expected local usage | Low |
| Public API/compatibility | Implemented | Community | None | Protects users | Low |
| Plugin interfaces | Interface Only | Community | None | Lightweight extension point | Medium if loaded unsafely |
| Hugging Face loading/tokenizers | Partial/Experimental | Shared Core | Transformers | Common external model bridge | Medium |
| Mixed precision | Partial | Shared Core | CUDA/Torch | Useful locally, hardware-sensitive | Low |
| LoRA/PEFT | Experimental | Pro | PEFT/Transformers | Advanced automation and matrix testing | Medium |
| QLoRA/quant PEFT | Not Implemented | Pro | PEFT/bitsandbytes | Hardware-sensitive advanced training | Medium |
| DDP/FSDP/Multi-GPU | Not Implemented | Pro | Torch distributed | Operational orchestration | Low |
| Experiment tracking services | Experimental | Pro | MLflow/W&B/etc. | Team/external-service workflows | Medium |
| Dashboards | Not Implemented | Pro | Web stack | Product UI | Medium |
| Production serving | Not Implemented | Pro | FastAPI/vLLM/etc. | Operational reliability | Medium |
| Cloud deployment | Not Implemented | Pro | Cloud SDKs | Provider automation | Medium |
| Export/quant automation | Not Implemented/Experimental | Pro | ONNX/TensorRT/GGUF tools | Artifact validation burden | Medium |
| Large benchmarks | Not Implemented | Pro | datasets/network | Dataset and report operations | Medium |
| Security governance | Partial/Not Implemented | Pro | varies | Enterprise concern | High |
| Auth/RBAC/audit/billing/license | Not Implemented | Pro | server/payment/auth stack | Commercial platform layer | High |

## What Remains Open Source

Community should include everything required to build, prepare data, train, fine-tune, evaluate, checkpoint, resume, and run local inference on small models.

## What Pro Adds

Pro adds scale and operations: multi-GPU orchestration, PEFT automation, production serving, dashboards, cloud deployment, advanced evaluation suites, team governance, and enterprise controls.

## Discovery

Optional Pro features should be discoverable through docs and optional imports. Community imports must not fail when Pro dependencies are missing.

## License Checks

Do not implement license checks in this planning phase. If added later, they should live in a Pro package/server boundary and must not wrap or disable Community core code.
