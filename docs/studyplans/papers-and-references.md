# Papers and References

This file lists stable references that are useful for engineers working on ArcLM. It is intentionally selective. Read papers for the design ideas, then verify ArcLM behavior in code and tests.

## Transformer and LLM Foundations

| Topic | Reference | Why it matters for ArcLM |
| --- | --- | --- |
| Transformer architecture | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | Attention, positional encoding, encoder-decoder design, parallel sequence modeling. |
| Encoder-only pretraining | [BERT](https://arxiv.org/abs/1810.04805) | Masked-language-modeling concepts and encoder-style evaluation. |
| Decoder-only scaling | [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) | Autoregressive language modeling, prompt behavior, and scaling tradeoffs. |
| Open foundation models | [LLaMA](https://arxiv.org/abs/2302.13971) | Efficient training choices and decoder-only model conventions. |
| Efficient decoder models | [Mistral 7B](https://arxiv.org/abs/2310.06825) | Sliding-window attention, grouped-query attention, and practical inference design. |

## Fine-Tuning and Adapter Methods

| Topic | Reference | Why it matters for ArcLM |
| --- | --- | --- |
| Full fine-tuning baseline | PyTorch training docs and ArcLM trainer tests | Full parameter updates remain the correctness baseline. |
| LoRA | [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) | Adapter injection, frozen base weights, trainable low-rank matrices. |
| QLoRA | [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314) | Quantized base models plus adapter training; useful for memory-limited systems. |
| PEFT tooling | [Hugging Face PEFT documentation](https://huggingface.co/docs/peft/index) | Optional integration reference; keep optional dependencies lazy. |

## Training, Optimization, and Reproducibility

| Topic | Reference | Why it matters for ArcLM |
| --- | --- | --- |
| AdamW | [Decoupled Weight Decay Regularization](https://arxiv.org/abs/1711.05101) | Common optimizer behavior and checkpoint state. |
| Mixed precision | [PyTorch AMP documentation](https://docs.pytorch.org/docs/stable/amp.html) | FP16, BF16, autocast, gradient scaling, and device-specific support. |
| Model reporting | [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) | Safe model metadata, intended use, limitations, and evaluation summaries. |
| Data documentation | [Data Cards](https://arxiv.org/abs/2204.01075) | Dataset provenance and responsible data reporting. |

## Distributed and Multi-GPU Runtime

| Topic | Reference | Why it matters for ArcLM |
| --- | --- | --- |
| DistributedDataParallel | [PyTorch DDP documentation](https://docs.pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html) | Process-group training, rank behavior, gradient synchronization. |
| FSDP | [PyTorch FSDP documentation](https://docs.pytorch.org/docs/stable/fsdp.html) | Parameter sharding and future large-model training. |
| ZeRO | [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054) | Optimizer-state partitioning concepts behind large-scale training. |
| Process launch | [PyTorch distributed documentation](https://docs.pytorch.org/docs/stable/distributed.html) | Rendezvous, backend selection, lifecycle, and platform differences. |

## Inference and Optimization

| Topic | Reference | Why it matters for ArcLM |
| --- | --- | --- |
| FlashAttention | [FlashAttention](https://arxiv.org/abs/2205.14135) | IO-aware attention and hardware-gated optimization. |
| FlashAttention 2 | [FlashAttention-2](https://arxiv.org/abs/2307.08691) | Newer GPU optimization concepts; cloud validation required. |
| Transformers library | [Hugging Face Transformers documentation](https://huggingface.co/docs/transformers/index) | Optional external-model loading, tokenizers, and local-folder behavior. |
| ONNX | [ONNX documentation](https://onnx.ai/onnx/) | Future export target; not part of the current core feature unless approved. |

## Security and Artifact Safety

| Topic | Reference | Why it matters for ArcLM |
| --- | --- | --- |
| PyTorch serialization | [PyTorch serialization notes](https://docs.pytorch.org/docs/stable/notes/serialization.html) | State dictionaries, pickle risk, and safe loading boundaries. |
| Python packaging | [Python packaging user guide](https://packaging.python.org/) | Extras, wheels, dependency isolation, and reproducible installs. |
| OWASP local app security | [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | Useful background for local web API and path-handling boundaries. |

## Reading Rule

Do not turn a paper into an implementation claim. For ArcLM, a capability is real only when the repository contains:

- Working implementation.
- Public or internal API contract.
- Focused tests.
- Integration or runtime validation.
- Documentation that matches actual behavior.

