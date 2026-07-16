# Architecture Audit

Native implementation is currently focused on GPT-style causal language models.

| Architecture | Native implementation | External support | Status |
| ------------ | --------------------- | ---------------- | ------ |
| GPT-style causal LM | `ArcLM`, `MiniGPT` | N/A | Implemented and tested |
| LLaMA | No native implementation | Generic HF path only | External model only |
| Mistral | No native implementation | Generic HF path only | External model only |
| Encoder-only/BERT | No native implementation | Generic HF path only | Not found natively |
| Encoder-decoder/T5 | No native implementation | Generic HF path only | Not found natively |
| MoE | No | No proven path | Not implemented |
| Vision Transformer | No | No proven path | Not implemented |
| Multimodal | No | No proven path | Not implemented |
| Custom PyTorch models | User-provided | Direct/adapters | Partially implemented |

Do not claim native LLaMA, Mistral, BERT, T5, MoE, vision, or multimodal support
until code, tests, and runtime evidence exist.

