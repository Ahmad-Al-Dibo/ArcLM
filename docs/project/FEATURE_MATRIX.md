# ArcLM Planning Feature Matrix

Every feature from the planning protocol appears once in this primary matrix. Evidence is summarized; deeper source evidence lives in `docs/status/feature-matrix.md` and `docs/status/feature-audit.md`.

| Category | Feature | Status | Evidence | Public API | Tests | Runtime Verified | External Models | CPU | CUDA | Dependency | Product | Milestone | Missing Work |
| -------- | ------- | ------ | -------- | ---------- | ----- | ---------------- | --------------- | --- | ---- | ---------- | ------- | --------- | ------------ |
| Training | Single-device training | Implemented | `src/arclm/training/trainer.py`; `tests/gpu/` | `arclm.training.Trainer` | training + smoke + GPU tests | CPU and local CUDA verified | PyTorch contract | Yes | GTX 1050 Ti verified | Torch | Community | 0/GPU | Broader hardware matrix |
| Training | Distributed training | Not Implemented | none | No | No | No | No | No | No | Torch distributed | Pro | 8 | Design and tests |
| Training | DDP | Not Implemented | none | No | No | No | No | No | No | Torch distributed | Pro | 8 | DDP wrapper |
| Training | FSDP | Not Implemented | none | No | No | No | No | No | No | Torch distributed | Pro | 8 | FSDP design |
| Training | Multi-GPU training | Not Implemented | none | No | No | No | No | No | No | CUDA | Pro | 8 | Launcher/orchestration |
| Training | Mixed precision FP16 | Implemented | `training/precision.py`; `tests/gpu/test_cuda_fp16.py` | `precision="fp16"` | precision + GPU tests | Local CUDA FP16 verified | Yes if contract fits | CPU unsupported by design | GTX 1050 Ti verified | CUDA Torch | Shared Core | 0/GPU | Modern GPU performance matrix |
| Training | Mixed precision BF16 | Implemented | `training/precision.py`; `tests/gpu/test_cuda_bf16.py` | `precision="bf16"` | precision + GPU tests | Local CUDA BF16 correctness verified | Yes if contract fits | CPU autocast verified | GTX 1050 Ti correctness verified | Torch | Shared Core | 0/GPU | Cloud BF16 acceleration validation |
| Training | Gradient accumulation | Implemented | `Trainer.train()` | `gradient_accumulation_steps` | trainer tests | Yes | Yes if loss contract fits | Yes | Unverified | Torch | Community | 0 | None |
| Training | Gradient clipping | Implemented | `Trainer._optimizer_step()` | `max_grad_norm` | trainer tests | Yes | Yes | Yes | Unverified | Torch | Community | 0 | None |
| Training | Automatic checkpointing | Implemented | `Trainer.save_checkpoint()` | `save_every_steps` | trainer tests | Yes | PyTorch state dict | Yes | Unverified | Torch | Community | 0 | None |
| Training | Checkpoint retention | Implemented | `Trainer._cleanup_checkpoints()` | `keep_last_checkpoints` | trainer tests | Yes | PyTorch state dict | Yes | Unverified | Torch | Community | 0 | None |
| Training | Resume interrupted training | Implemented | `Trainer.load_checkpoint()` | `resume_from_checkpoint` | trainer tests | Yes | PyTorch state dict | Yes | Unverified | Torch | Community | 0 | None |
| Training | Optimizers | Implemented | `training/optimizers.py` | config/custom optimizer | optimizer tests | Yes | Yes | Yes | Unverified | Torch | Community | 0 | More types only if needed |
| Training | Learning-rate schedulers | Implemented | `training/schedulers.py` | config scheduler | optimizer/trainer tests | Yes | Yes | Yes | Unverified | Torch | Community | 0 | More schedules only if needed |
| Training | Training callbacks | Implemented | `training/callbacks.py` | `BaseCallback` | trainer tests | Yes | N/A | Yes | Unverified | None | Community | 0 | None |
| Training | Training state | Implemented | `training/state.py` | `TrainingState` | state tests | Yes | N/A | Yes | Unverified | None | Community | 0 | None |
| Training | Hyperparameter search | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 17 | Trial engine |
| Training | Curriculum learning | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | Later | Data/training policy |
| Training | Full fine-tuning | Implemented | `finetuning/full.py` | `FullFineTuner` | finetuning + smoke | Yes | PyTorch/HF-style adapter | Yes | Unverified | Torch | Community | 0 | Broader model matrix |
| Training | Supervised Fine-Tuning | Implemented | `finetuning/full.py` | `SFTTrainer`, `SFTConfig` | finetuning + smoke | Yes | Adapter support | Yes | Unverified | Torch | Community | 0 | Broader tokenizers |
| Training | LoRA | Experimental | legacy PEFT path | legacy `train_sft(use_lora=True)` | Limited | No | HF/PEFT intended | No | No | PEFT | Pro | 2 | Stable PEFT API/tests |
| Training | QLoRA | Not Implemented | none | No | No | No | No | No | No | PEFT/bitsandbytes | Pro | After 2 | Quantized adapter training |
| Training | Other PEFT methods | Not Implemented | none | No | No | No | No | No | No | PEFT | Pro | After 2 | PEFT methods |
| Training | RLHF | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | Later | Alignment stack |
| Training | DPO | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | Later | DPO loss/data |
| Training | GRPO | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | Later | GRPO workflow |
| Training | Reward model training | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | Later | Reward model pipeline |
| Training | Experiment tracking | Experimental | `src/arclm/tracking.py` | `ExperimentTracker` | No current tests | No | N/A | Local possible | No | mlflow/wandb optional | Pro | 7 | Tests/docs |
| Training | Training dashboards | Not Implemented | none | No | No | No | N/A | No | No | Web stack | Pro | Web 3 | Planned after Web foundation and monitoring/event contracts |
| Architectures | GPT | Implemented | `models/text/causal_lm.py` | `ArcLM`, `MiniGPT` | smoke/unit | Yes | Native only | Yes | Unverified | Torch | Community | 0 | Larger variants |
| Architectures | LLaMA | Not Implemented | no native LLaMA | No native | No | No | HF generic only | No | No | Transformers optional | Pro | 3/4 | Native or tested HF path |
| Architectures | Mistral | Not Implemented | none | No | No | No | HF generic only | No | No | Transformers optional | Pro | 3/4 | Support/tests |
| Architectures | Mixture of Experts | Not Implemented | none | No | No | No | No | No | No | Torch | Pro | Later | MoE layers/router |
| Architectures | Encoder-only | Not Implemented | none | No | No | No | No | No | No | Torch | Community | 4 | Encoder base/tasks |
| Architectures | BERT | Not Implemented | none | No | No | No | HF generic only | No | No | Transformers optional | Community | 4 | MLM/classification workflow |
| Architectures | Encoder-decoder | Not Implemented | none | No | No | No | No | No | No | Torch | Community | 4 | Seq2seq base |
| Architectures | T5 | Not Implemented | none | No | No | No | HF generic only | No | No | Transformers optional | Community | 4 | Seq2seq tests |
| Architectures | Vision Transformers | Not Implemented | none | No | No | No | No | No | No | Torchvision optional | Pro | 12 | Vision stack |
| Architectures | Multimodal models | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 12 | Multimodal stack |
| Architectures | Custom architecture builder | Partially Implemented | `models/auto.py` | `AutoModel` | import tests | Import only | Limited | Yes | Unverified | Torch | Community | 4 | Registry expansion |
| Architectures | Custom attention layers | Not Implemented | none | No | No | No | No | No | No | Torch | Research | 17 | Layer APIs |
| Architectures | Custom feedforward layers | Not Implemented | none | No | No | No | No | No | No | Torch | Research | 17 | Layer APIs |
| Architectures | Custom normalization | Not Implemented | none | No | No | No | No | No | No | Torch | Research | 17 | Layer APIs |
| Architectures | Custom PyTorch models | Implemented | trainer/finetuning contracts | `Trainer`, `ModelAdapter` | tests | Yes | Yes | Yes | Unverified | Torch | Community | 0 | Contract docs |
| Architectures | Hugging Face models | Experimental | `inference/external.py`, legacy SFT | `load_any_model` | limited/fake | No real local HF runtime | Partial | CPU possible | Unverified | Transformers | Shared Core | 3 | Tiny HF tests |
| Architectures | External model adapters | Partially Implemented | `finetuning/adapters.py` | `ModelAdapter` | adapter tests | Yes for SFT | Yes for SFT | Yes | Unverified | Torch | Community | 3 | Generalize beyond SFT |
| Tokenizers | Native tokenizers | Implemented | `tokenizers/base.py` | `Tokenizer`, `SentencePieceTokenizer` | library tests | Yes | No | Yes | N/A | SentencePiece | Community | 0 | Edge cases |
| Tokenizers | Hugging Face tokenizers | Experimental | HF/external paths | `AutoTokenizer`, adapters | limited fake | No real HF tokenizer runtime | Yes partial | CPU possible | N/A | Transformers | Shared Core | 3 | Local HF tests |
| Tokenizers | Custom tokenizer adapters | Implemented | `finetuning/adapters.py` | `TokenizerAdapter` | adapter tests | Yes | Yes | Yes | N/A | None | Community | 0 | Non-SFT docs |
| Tokenizers | Tokenizer training | Implemented | `tokenizers/base.py` | `build` | library tests | Yes | No | Yes | N/A | SentencePiece | Community | 0 | More fixtures |
| Tokenizers | Encoding | Implemented | tokenizer classes | `encode` | tests | Yes | Adapter partial | Yes | N/A | None | Community | 0 | None |
| Tokenizers | Decoding | Implemented | tokenizer classes | `decode` | tests | Yes | Adapter partial | Yes | N/A | None | Community | 0 | None |
| Tokenizers | Batch encoding | Partially Implemented | collator/HF callable only | No unified API | limited | Limited | HF partial | Yes | N/A | Optional HF | Community | 3/4 | Unified API/tests |
| Tokenizers | Padding | Partially Implemented | `SFTDataCollator` | collator | collator tests | Yes | Adapter dependent | Yes | N/A | Torch | Community | 0 | General tokenizer padding |
| Tokenizers | Truncation | Partially Implemented | SFT config/collator | `SFTConfig.truncation` | collator tests | Yes | Adapter dependent | Yes | N/A | None | Community | 0 | General truncation docs |
| Tokenizers | Special tokens | Partially Implemented | tokenizer/adapters | pad/eos ids | limited | Yes | Partial | Yes | N/A | None | Community | 3 | Unified model |
| Tokenizers | Chat templates | Partially Implemented | formatter/adapters | `apply_chat_template` | fake template tests | Yes fake | HF intended | Yes | N/A | Transformers optional | Community | 3 | Real HF template tests |
| Tokenizers | Save and load | Implemented | tokenizers/checkpoint helpers | `save`, `load` | tests | Yes | Partial | Yes | N/A | SentencePiece | Community | 0 | More formats |
| Tokenizers | Vocabulary statistics | Implemented | tokenizer/preprocess | token stats helpers | limited | Yes indirect | No | Yes | N/A | None | Community | 0 | Dedicated tests |
| Tokenizers | Token analysis | Partially Implemented | preprocess/eval diagnostics | coverage helpers | limited | Yes indirect | No | Yes | N/A | None | Community | 4 | Integrated reports |
| Data | Dataset loading | Implemented | `datasets/loader.py` | `load_dataset` | loader tests | Yes | No HF Dataset | Yes | N/A | None | Community | 0 | More sources |
| Data | JSON | Implemented | loader | `load_dataset` | tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | JSONL | Implemented | loader | `load_dataset` | tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | CSV | Implemented | loader | `load_dataset` | tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | TXT | Implemented | loader | `load_dataset` | tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | Python lists | Implemented | loader | `load_dataset(list)` | tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | Hugging Face Datasets | Not Implemented | none | No | No | No | No | No | N/A | datasets | Shared Core | 3/4 | Optional integration |
| Data | PyTorch Datasets | Partially Implemented | `TextDataset`, trainer accepts datasets | dataset classes | tests | Yes | N/A | Yes | N/A | Torch | Community | 0 | Generic wrapper docs |
| Data | Dataset versioning | Not Implemented | none | No | No | No | N/A | No | N/A | None | Pro | 17 | Manifest/version store |
| Data | Dataset cleaning | Implemented | `datasets/cleaning` | `DataPipeline` steps | cleaning tests | Yes | N/A | Yes | N/A | None | Community | 0 | More cleaners |
| Data | Exact deduplication | Implemented | `datasets/deduplication` | `ExactDeduplicator` | dedup tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | Hash deduplication | Partially Implemented | exact dedup hash internals | hash algorithm | limited | Indirect | N/A | Yes | N/A | None | Community | 0 | Dedicated docs/tests |
| Data | Approximate deduplication | Experimental | `preprocess/duplicate.py` | preprocess only | limited | Limited | N/A | Yes | N/A | None | Pro | Later | Integrate/test |
| Data | Data augmentation | Interface Only | `BaseAugmenter` | base class | base tests | No behavior | N/A | N/A | N/A | None | Community | 4 | Real augmenters |
| Data | Streaming datasets | Implemented | `datasets/streaming` | `StreamingDataset` | tests | Yes | N/A | Yes | N/A | None | Community | 0 | More formats |
| Data | WebDataset | Not Implemented | none | No | No | No | N/A | No | N/A | webdataset | Pro | 6 | Optional loader |
| Data | Dataset statistics | Partially Implemented | `preprocess/statistics.py` | preprocess stats | limited | Yes partial | N/A | Yes | N/A | None | Community | 4 | New API integration |
| Data | Token analysis | Partially Implemented | preprocess/eval | helpers | limited | Yes partial | N/A | Yes | N/A | None | Community | 4 | Reports |
| Data | Synthetic data generation | Interface Only | `BaseSyntheticDataGenerator` | base class | base tests | No behavior | provider needed | No | N/A | provider optional | Pro | Later | Implement generators |
| Data | Data pipelines | Implemented | `datasets/pipeline.py` | `DataPipeline` | pipeline tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | Custom pipeline steps | Implemented | `BaseDataStep`/callables | `DataPipeline` | pipeline tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Data | Dataset validation | Implemented | loader validation | `required_fields` | loader tests | Yes | N/A | Yes | N/A | None | Community | 0 | Schemas later |
| Data | Instruction datasets | Implemented | `datasets/instruction.py` | `InstructionDataset` | tests | Yes | N/A | Yes | N/A | Torch | Community | 0 | More formats |
| Data | Chat datasets | Partially Implemented | SFT messages formatter | `messages_field` | formatting/collator tests | Yes | N/A | Yes | N/A | Torch | Community | 4 | Standalone chat dataset |
| Data | Sequence packing | Implemented | `finetuning/packing.py` | `SFTConfig(packing=True)` | collator tests | Yes | N/A | Yes | N/A | Torch | Community | 0 | Advanced packing |
| NLP Tasks | Text generation | Implemented | native generator | `TextGenerator` | unit/smoke indirect | Yes | Partial HF | Yes | Unverified | Torch/Transformers | Community | 5 | More generation tests |
| NLP Tasks | Text classification | Partially Implemented | accuracy metric only | `Accuracy` | eval tests | Metric only | possible via custom model | Yes | Unverified | Torch | Community | 4 | End-to-end workflow |
| NLP Tasks | Token classification | Partially Implemented | token accuracy only | `Accuracy(ignore_index)` | eval tests | Metric only | possible via custom model | Yes | Unverified | Torch | Community | 4 | Model/data/collator |
| NLP Tasks | Named Entity Recognition | Not Implemented | none | No | No | No | No | No | No | Torch/HF optional | Community | 4 | Token classification workflow |
| NLP Tasks | Question answering | Not Implemented | none | No | No | No | No | No | No | Torch/HF optional | Community | 4 | End-to-end workflow |
| NLP Tasks | Text summarization | Partially Implemented | generic generation only | No task API | No | No task runtime | HF possible | Yes | Unverified | Transformers optional | Community | 4 | Seq2seq workflow |
| NLP Tasks | Machine translation | Not Implemented | none | No | No | No | No | No | No | Transformers optional | Community | 4 | Seq2seq workflow |
| NLP Tasks | Text embeddings | Not Implemented | none | No | No | No | No | No | No | Torch/HF optional | Community | 6 | Embedding model/API |
| NLP Tasks | Semantic similarity | Not Implemented | none | No | No | No | No | No | No | embeddings | Community | 6 | Embeddings/metrics |
| NLP Tasks | Text reranking | Not Implemented | none | No | No | No | No | No | No | embeddings | Pro | 6 | Reranker |
| NLP Tasks | Masked language modeling | Not Implemented | none | No | No | No | No | No | No | Torch/HF optional | Community | 4 | Encoder/MLM loss |
| NLP Tasks | Causal language modeling | Implemented | ArcLM/SFT | `ArcLM`, `SFTTrainer` | tests | Yes | Partial HF | Yes | Unverified | Torch | Community | 0 | Larger model matrix |
| NLP Tasks | Sequence-to-sequence generation | Partially Implemented | generic generation only | No seq2seq API | No | No | HF possible | Yes | Unverified | Transformers optional | Community | 4 | Encoder-decoder |
| NLP Tasks | Text regression | Not Implemented | none | No | No | No | No | No | No | Torch | Community | 4 | Dataset/loss/metric |
| NLP Tasks | Information extraction | Not Implemented | none | No | No | No | No | No | No | Torch/HF optional | Community | Later | Workflow |
| NLP Tasks | Relation extraction | Not Implemented | none | No | No | No | No | No | No | Torch/HF optional | Community | Later | Workflow |
| NLP Tasks | Keyword extraction | Not Implemented | none | No | No | No | No | No | No | TBD | Community | Later | Workflow |
| NLP Tasks | Text clustering | Not Implemented | none | No | No | No | No | No | No | embeddings | Community | 6 | Embeddings/clustering |
| NLP Tasks | Paraphrase detection | Not Implemented | none | No | No | No | No | No | No | embeddings/HF | Community | 4/6 | Workflow |
| Multimodal | Text and image | Not Implemented | none | No | No | No | No | No | No | vision deps | Pro | 12 | Full modality stack |
| Multimodal | Text and audio | Not Implemented | none | No | No | No | No | No | No | audio deps | Pro | 12 | Full modality stack |
| Multimodal | Image and audio | Not Implemented | none | No | No | No | No | No | No | vision/audio deps | Pro | 12 | Full modality stack |
| Multimodal | Vision-language models | Not Implemented | none | No | No | No | No | No | No | vision/HF deps | Pro | 12 | VLM support |
| Multimodal | Document understanding | Not Implemented | none | No | No | No | No | No | No | OCR/vision deps | Pro | 12 | Document pipeline |
| Multimodal | Video understanding | Not Implemented | none | No | No | No | No | No | No | video deps | Pro | 12 | Video pipeline |
| Inference | Basic inference | Implemented | `inference/engine.py` | `predict`, `load_model` | unit tests | Yes | Partial external | Yes | Unverified | Torch | Community | 0 | More contracts |
| Inference | Text generation | Implemented | generator | `TextGenerator` | tests indirect | Yes | Partial | Yes | Unverified | Torch | Community | 5 | Dedicated generation tests |
| Inference | Greedy decoding | Implemented | generator behavior | config | limited | Yes indirect | Partial | Yes | Unverified | Torch | Community | 5 | Explicit tests |
| Inference | Temperature | Implemented | generation config | `temperature` | limited | Yes indirect | Partial | Yes | Unverified | Torch | Community | 5 | Tests |
| Inference | Top-k | Implemented | generator | `top_k` | limited | Yes indirect | Partial | Yes | Unverified | Torch | Community | 5 | Tests |
| Inference | Top-p | Implemented | generator | `top_p` | limited | Yes indirect | Partial | Yes | Unverified | Torch | Community | 5 | Tests |
| Inference | Streaming generation | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 5 | Streaming iterator |
| Inference | Batch inference | Partially Implemented | external loops | `batch_predict` | limited | No | Partial | Yes possible | Unverified | Transformers optional | Pro | 5 | True batching |
| Inference | Model serving | Experimental | Flask simple interface | `run_simple_interface` | import only | No server health check | Native mainly | CPU possible | Unverified | Flask | Pro | Serving later | Production server |
| Inference | REST API | Experimental | Flask routes; read-only Web API | simple interface now; `arclm.web.create_app` for status only | Web API endpoint tests | Local status endpoints verified; no model serving | Native mainly | CPU possible | Unverified | Flask, FastAPI, Uvicorn | Shared Core/Pro | Web 1 / Serving later | Production model serving later |
| Inference | OpenAI-compatible API | Not Implemented | none | No | No | No | No | No | No | web stack | Pro | 9 | Schema/server |
| Inference | Dynamic batching | Not Implemented | none | No | No | No | No | No | No | serving stack | Pro | 9 | Scheduler |
| Inference | KV cache | Not Implemented | none | No | No | No | No | No | No | Torch | Pro | 5/9 | Cache-aware generation |
| Inference | KV-cache optimization | Not Implemented | none | No | No | No | No | No | No | Torch | Pro | 9 | Optimization |
| Inference | Speculative decoding | Not Implemented | none | No | No | No | No | No | No | Torch | Pro | 9 | Draft/target decoding |
| Inference | Continuous batching | Not Implemented | none | No | No | No | No | No | No | serving stack | Pro | 9 | Scheduler |
| Inference | External-model inference | Partially Implemented | `inference/external.py` | `load_any_model` | limited | No real HF runtime | Partial | CPU possible | Unverified | Transformers | Shared Core | 3 | Local HF tests |
| Inference | CPU inference | Implemented | engine | `device="cpu"` | tests | Yes | Partial | Yes | N/A | Torch | Community | 0 | None |
| Inference | GPU inference | Implemented | `src/arclm/inference/engine.py`; `tests/gpu/test_cuda_inference.py` | `load_model(..., device="cuda")` | CUDA inference test | Local CUDA verified | Partial | N/A | GTX 1050 Ti verified | CUDA | Community | GPU | Larger checkpoints/external models |
| Retrieval | Embedding generation | Not Implemented | none | No | No | No | No | No | No | TBD | Community | 6 | Embedding API |
| Retrieval | Vector database integration | Not Implemented | none | No | No | No | No | No | No | vector clients | Pro | 6 | Optional adapters |
| Retrieval | Semantic search | Not Implemented | none | No | No | No | No | No | No | embeddings | Community | 6 | Retriever/search |
| Retrieval | RAG pipeline | Not Implemented | none | No | No | No | No | No | No | retrieval + inference | Pro | 6 | Pipeline |
| Retrieval | Hybrid search | Not Implemented | none | No | No | No | No | No | No | search deps | Pro | 6 | Search fusion |
| Retrieval | Document indexing | Not Implemented | none | No | No | No | No | No | No | storage | Community | 6 | Indexer |
| Retrieval | Retrievers | Not Implemented | none | No | No | No | No | No | No | TBD | Community | 6 | Base/implementation |
| Retrieval | Rerankers | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 6 | Reranker |
| Retrieval | Chunking | Not Implemented | none | No | No | No | No | No | No | None | Community | 6 | Chunker |
| Retrieval | Metadata filtering | Not Implemented | none | No | No | No | No | No | No | storage | Community | 6 | Filter API |
| Retrieval | Retrieval evaluation | Not Implemented | none | No | No | No | No | No | No | eval metrics | Pro | 14 | Metrics |
| Retrieval | Citation tracking | Not Implemented | none | No | No | No | No | No | No | retrieval | Pro | 6 | Provenance |
| Agents | Tool calling | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 13 | Tool contract |
| Agents | Function calling | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 13 | Schema/runtime |
| Agents | MCP support | Not Implemented | none | No | No | No | No | No | No | MCP SDK | Pro | 13 | Client/server adapters |
| Agents | Memory | Not Implemented | none | No | No | No | No | No | No | storage | Pro | 13 | Memory model |
| Agents | Planning | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 13 | Planner |
| Agents | Multi-agent systems | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 13 | Runtime |
| Agents | Code execution | Not Implemented | none | No | No | No | No | No | No | sandbox | Pro | 13 | Secure executor |
| Agents | Browser automation | Not Implemented | none | No | No | No | No | No | No | browser tools | Pro | 13 | Permissions/sandbox |
| Agents | Tool permissions | Not Implemented | none | No | No | No | No | No | No | security | Pro | 13 | Permission model |
| Agents | Sandboxing | Not Implemented | none | No | No | No | No | No | No | sandbox | Pro | 13 | Sandbox |
| Agents | Tool audit logs | Not Implemented | none | No | No | No | No | No | No | logging | Pro | 13 | Audit events |
| Agents | Agent evaluation | Not Implemented | none | No | No | No | No | No | No | evaluation | Pro | 14 | Agent metrics |
| Reasoning | User-visible reasoning summaries | Not Implemented | none | No | No | No | N/A | No | No | TBD | Community | 13 | Safe summary API |
| Reasoning | Structured reasoning outputs | Not Implemented | none | No | No | No | N/A | No | No | TBD | Community | 13 | Structured schema |
| Reasoning | Tree of Thoughts | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | Later | Search reasoning |
| Reasoning | Self-consistency | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | Later | Sampling/eval |
| Reasoning | Reflection | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | Later | Reflection loop |
| Reasoning | Planning algorithms | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | 13 | Planner |
| Reasoning | Search-based reasoning | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | Later | Search runtime |
| Reasoning | Verifier models | Not Implemented | none | No | No | No | No | No | No | Torch/HF | Pro | Later | Verifier training/eval |
| Optimization | INT8 quantization | Experimental | HF load flags | `load_in_8bit` | No | No | HF only | No | No | bitsandbytes/HF | Pro | 10 | Runtime validation |
| Optimization | INT4 quantization | Experimental | HF load flags | `load_in_4bit` | No | No | HF only | No | No | bitsandbytes/HF | Pro | 10 | Runtime validation |
| Optimization | Weight-only quantization | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 10 | Quantizer |
| Optimization | Pruning | Not Implemented | none | No | No | No | No | No | No | Torch | Pro | 10 | Pruning API |
| Optimization | Knowledge distillation | Not Implemented | none | No | No | No | No | No | No | Torch | Pro | 10 | Teacher/student |
| Optimization | Flash Attention | Not Implemented | none | No | No | No | No | No | No | flash-attn | Pro | 10 | Backend integration |
| Optimization | xFormers | Not Implemented | none | No | No | No | No | No | No | xformers | Pro | 10 | Backend integration |
| Optimization | `torch.compile` | Not Implemented | none | No | No | No | PyTorch possible | No | No | Torch | Pro | 10 | Compile option/tests |
| Optimization | ONNX export | Not Implemented | none | No | No | No | No | No | No | onnx/onnxruntime | Pro | 10 | Exporter/artifact tests |
| Optimization | TensorRT export | Not Implemented | none | No | No | No | No | No | No | TensorRT | Pro | 10 | Exporter |
| Optimization | GGUF export | Not Implemented | none | No | No | No | No | No | No | GGUF tools | Pro | 10 | Exporter |
| Optimization | Model-size reporting | Partially Implemented | model params/inspectors | `get_num_parameters` | limited | Yes partial | Partial | Yes | N/A | None | Community | 10 | Public report API |
| Optimization | Memory optimization | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 10 | Strategy |
| Optimization | Inference optimization | Not Implemented | none | No | No | No | No | No | No | TBD | Pro | 10 | Profiling/optimization |
| Deployment | Docker generation | Not Implemented | none | No | No | No | N/A | No | No | Docker | Pro | 11 | Generator |
| Deployment | Dockerfile templates | Not Implemented | none | No | No | No | N/A | No | No | Docker | Pro | 11 | Template |
| Deployment | Docker Compose | Not Implemented | none | No | No | No | N/A | No | No | Docker | Pro | 11 | Compose |
| Deployment | Kubernetes | Not Implemented | none | No | No | No | N/A | No | No | Kubernetes | Pro | 11 | Manifests |
| Deployment | Helm | Not Implemented | none | No | No | No | N/A | No | No | Helm | Pro | 11 | Chart |
| Deployment | Hugging Face deployment | Not Implemented | none | No | No | No | HF loading only | No | No | HF Hub | Pro | 11 | Deploy/push workflow |
| Deployment | AWS | Not Implemented | none | No | No | No | N/A | No | No | AWS SDK | Pro | 11 | Provider |
| Deployment | Azure | Not Implemented | none | No | No | No | N/A | No | No | Azure SDK | Pro | 11 | Provider |
| Deployment | GCP | Not Implemented | none | No | No | No | N/A | No | No | GCP SDK | Pro | 11 | Provider |
| Deployment | RunPod | Not Implemented | none | No | No | No | N/A | No | No | RunPod SDK/API | Pro | 11 | Provider |
| Deployment | Modal | Not Implemented | none | No | No | No | N/A | No | No | Modal | Pro | 11 | Provider |
| Deployment | Local deployment | Experimental | Flask simple interface | `run_simple_interface` | import only | No | Native mainly | CPU possible | Unverified | Flask | Pro | Serving later | Server smoke |
| Deployment | Health checks | Partially Implemented | Flask `/health`; Web `/api/health` | `arclm.web.create_app` | Web endpoint tests | Local Uvicorn smoke verified | N/A | Yes | N/A | Flask, FastAPI, Uvicorn | Shared Core | Web 1 | Production serving health checks later |
| Deployment | Environment configuration | Partially Implemented | env vars in simple UI; Web config and environment endpoint | `WebConfig`; `/api/environment` | Web endpoint tests | Local Uvicorn smoke verified | N/A | Yes | Runtime-dependent | Flask, FastAPI, Uvicorn | Shared Core | Web 1 | Production config and secrets policy later |
| Deployment | Secret handling | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | 15 | Secret manager |
| Deployment | Rollback | Not Implemented | none | No | No | No | N/A | No | No | deployment stack | Pro | 11 | Release model |
| Deployment | Deployment status | Not Implemented | none | No | No | No | N/A | No | No | deployment stack | Pro | 11 | Status model |
| Evaluation | Basic evaluator | Implemented | `evaluation/evaluator.py` | `Evaluator`, `evaluate` | eval + smoke | Yes | PyTorch contract | Yes | Unverified | Torch | Community | 0 | More outputs |
| Evaluation | Validation loss | Implemented | `LossMetric` | `loss` metric | eval tests | Yes | PyTorch contract | Yes | Unverified | Torch | Community | 0 | None |
| Evaluation | Perplexity | Implemented | `Perplexity` | `Perplexity` | metrics tests | Yes | Any loss source | Yes | N/A | None | Community | 0 | None |
| Evaluation | Classification accuracy | Implemented | `Accuracy` | `Accuracy` | metrics tests | Yes | logits contract | Yes | N/A | Torch | Community | 0 | Task workflow |
| Evaluation | Token accuracy | Implemented | `Accuracy(ignore_index)` | `Accuracy` | metrics tests | Yes | logits contract | Yes | N/A | Torch | Community | 0 | None |
| Evaluation | Custom metrics | Implemented | `BaseMetric` | custom metrics | eval tests | Yes | Yes | Yes | N/A | None | Community | 0 | None |
| Evaluation | Evaluation callbacks | Implemented | `callbacks.py` | `BaseEvaluationCallback` | eval tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Evaluation | Trainer integration | Implemented | trainer evaluate | `Trainer.evaluate()` | integration test | Yes | PyTorch contract | Yes | Unverified | Torch | Community | 0 | None |
| Evaluation | Benchmark suite | Not Implemented | no stable suite | No | No | No | No | No | No | datasets optional | Pro | 14 | Framework |
| Evaluation | MMLU | Not Implemented | none | No | No | No | No | No | No | datasets/network | Pro | 14 | Dataset/cache |
| Evaluation | GSM8K | Not Implemented | none | No | No | No | No | No | No | datasets/network | Pro | 14 | Dataset/cache |
| Evaluation | Human evaluation | Not Implemented | none | No | No | No | N/A | No | No | UI/server | Pro | 14 | Annotation workflow |
| Evaluation | Custom benchmark framework | Partially Implemented | diagnostics only | concept diagnostics | limited | Partial | No | Yes | N/A | None | Pro | 14 | General benchmark API |
| Evaluation | LLM-as-a-judge | Not Implemented | none | No | No | No | No | No | No | provider APIs | Pro | 14 | Judge adapters |
| Evaluation | Accuracy dashboards | Not Implemented | none | No | No | No | N/A | No | No | web stack | Pro | 14 | Dashboard |
| Evaluation | Model comparison | Not Implemented | examples only | No stable API | No | No | N/A | No | No | TBD | Pro | 14 | Comparison reports |
| Evaluation | Evaluation reports | Partially Implemented | diagnostics exporters | export helpers | limited | Partial | N/A | Yes | N/A | None | Community | 14 | Evaluator report docs |
| Evaluation | External benchmark downloads | Not Implemented | none | No | No | No | N/A | No | No | datasets/network | Pro | 14 | Download/cache policy |
| Evaluation | Distributed evaluation | Not Implemented | none | No | No | No | No | No | No | Torch distributed | Pro | 14 | Distributed evaluator |
| Evaluation | Retrieval evaluation | Not Implemented | none | No | No | No | No | No | No | retrieval | Pro | 14 | Metrics |
| Evaluation | Agent evaluation | Not Implemented | none | No | No | No | No | No | No | agents | Pro | 14 | Metrics |
| Evaluation | Multimodal evaluation | Not Implemented | none | No | No | No | No | No | No | multimodal deps | Pro | 12/14 | Metrics |
| Monitoring | Training metrics | Implemented | Trainer state/logs | state metrics | tests | Yes | N/A | Yes | Unverified | None | Community | 0 | Structured schema |
| Monitoring | Evaluation metrics | Implemented | `EvaluationResult` | metrics dict | tests | Yes | N/A | Yes | N/A | None | Community | 0 | None |
| Monitoring | GPU monitoring | Partially Implemented | utility formatting only | helper | No direct tests | No | N/A | No | No | CUDA | Pro | 7 | Collector |
| Monitoring | VRAM monitoring | Partially Implemented | utility formatting only | helper | No direct tests | No | N/A | No | No | CUDA | Pro | 7 | Collector |
| Monitoring | CPU monitoring | Not Implemented | none | No | No | No | N/A | No | N/A | psutil optional | Pro | 7 | Collector |
| Monitoring | RAM monitoring | Not Implemented | none | No | No | No | N/A | No | N/A | psutil optional | Pro | 7 | Collector |
| Monitoring | Training speed | Partially Implemented | trainer logs ETA/speed | console/logs | indirect | Yes partial | N/A | Yes | Unverified | None | Community | 7 | Structured metric |
| Monitoring | Samples per second | Not Implemented | none | No | No | No | N/A | No | No | None | Pro | 7 | Metric |
| Monitoring | Tokens per second | Partially Implemented | formatting helper | helper | No direct tests | No | N/A | No | No | None | Pro | 7 | Integrated metric |
| Monitoring | Cost estimation | Not Implemented | none | No | No | No | N/A | No | No | pricing data | Pro | 7 | Cost model |
| Monitoring | Memory profiling | Not Implemented | none | No | No | No | N/A | No | No | profiler deps | Pro | 7 | Profiler |
| Monitoring | Performance profiling | Not Implemented | none | No | No | No | N/A | No | No | profiler deps | Pro | 7 | Profiler |
| Monitoring | Callback monitoring | Implemented | callbacks | training/eval callbacks | tests | Yes | N/A | Yes | N/A | None | Community | 0 | More events |
| Monitoring | Experiment logs | Partially Implemented | async logger/tracking | metrics logs | limited | Partial | N/A | Yes | N/A | None | Community | 7 | Docs/retention |
| Monitoring | External tracking integrations | Experimental | `tracking.py` | mlflow/wandb backends | No tests | No | N/A | No | No | mlflow/wandb | Pro | 7 | Optional CI |
| Monitoring | Dashboard events | Not Implemented | none | No | No | No | N/A | No | No | web stack | Pro | 7 | Event contract |
| Monitoring | Alerting | Not Implemented | none | No | No | No | N/A | No | No | monitoring stack | Pro | 7 | Alert rules |
| Developer Experience | Public Python API | Implemented | lazy root/domain exports | domain imports | public API tests | Yes | N/A | Yes | N/A | None | Community | 0/1 | Milestone 1 contract tests added for domain exports and duplicate names |
| Developer Experience | CLI | Implemented | `src/arclm/cli.py`; `docs/architecture/cli.md` | `python -m arclm` | help/error/runtime tests | Tiny CPU train/eval/generate flow verified | N/A | Yes | N/A | Torch | Community | 1 | Broader real-world CLI fixtures |
| Developer Experience | CLI training | Implemented | CLI train command uses `train_model` | CLI | runtime smoke | Tiny CPU config-file training verified | N/A | Yes | N/A | Torch | Community | 1 | More formats/long runs |
| Developer Experience | CLI evaluation | Implemented | CLI eval command | CLI | runtime smoke | Tiny CPU checkpoint eval verified | N/A | Yes | N/A | Torch | Community | 1 | More metric fixtures |
| Developer Experience | CLI inference | Implemented | CLI generate command | CLI | runtime smoke | Tiny CPU checkpoint generation verified | N/A | Yes | N/A | Torch | Community | 1 | Sampling edge cases |
| Developer Experience | CLI export | Not Implemented | none | No | No | No | N/A | No | No | export deps | Pro | 10 | Export CLI |
| Developer Experience | Web UI | Partially Implemented | legacy simple Flask interface; `web/`; `src/arclm/web` | `run_simple_interface`; `arclm.web.create_app` | frontend and backend tests | Web Milestone 1 dashboards and local API verified | N/A | Yes | Runtime-dependent | Flask, Next, FastAPI, Uvicorn | Shared Core | Web 1 | Data Pipeline Studio and later workflow pages remain planned |
| Developer Experience | Web frontend foundation | Implemented | `web/package.json`; `web/src/app/page.tsx`; `web/src/app/globals.css` | `web/` root route | `npm run lint`; `npm run typecheck`; `npm run test`; `npm run build` | Local dev smoke and production build verified | N/A | Yes | N/A | npm, Next, React, TypeScript, Tailwind, Vitest | Shared Core | Web 1 Feature 1 | None for Feature 1 |
| Developer Experience | Web design system | Implemented | `web/src/components/ui/`; `web/src/app/design-system/page.tsx` | source-owned UI components | component tests, lint, typecheck, build | Production start smoke for `/design-system` verified | N/A | Yes | N/A | Existing web deps only | Shared Core | Web 1 Feature 2 | None for Feature 2 |
| Developer Experience | Web application shell | Implemented | `web/src/components/shell/`; `web/src/config/navigation.ts`; route pages under `web/src/app/` | Next.js app routes | shell tests, lint, typecheck, build | Production start smoke for all shell routes verified | N/A | Yes | N/A | Existing web deps only | Shared Core | Web 1 Feature 3 | None for shell foundation |
| Developer Experience | ArcLM Local Web Backend | Implemented | `src/arclm/web/`; `tests/web/` | `from arclm.web import create_app, WebConfig`; `python -m arclm web-api` | backend endpoint, CORS, CLI, public API, compatibility tests | Local Uvicorn smoke verified | N/A | Yes | Runtime-dependent | FastAPI 0.139.0, Uvicorn 0.51.0 | Shared Core | Web 1 Feature 4 | None for read-only backend foundation |
| Developer Experience | Frontend API client | Implemented | `web/src/lib/api/` | `createApiClient` internal frontend API | client and dashboard tests, lint, typecheck, build | Fetch behavior tested with local fixtures and dashboard smoke | N/A | N/A | N/A | Existing web deps only | Shared Core | Web 1 Feature 4 | Future workflow clients pending later milestones |
| Developer Experience | Simple Dashboard | Implemented | `web/src/features/dashboard/`; `web/src/app/page.tsx`; safe project-status schema fields | root `/` route | dashboard component tests, backend project-status tests, lint, typecheck, build | Real frontend-to-backend smoke verified | N/A | Yes | Runtime-dependent | Existing web deps only | Shared Core | Web 1 Feature 5 | None for Simple Dashboard |
| Developer Experience | Advanced Dashboard | Implemented | `web/src/features/dashboard/advanced-dashboard.tsx`; `src/arclm/web/schemas.py`; `src/arclm/web/services.py` | root `/` route in Advanced mode | dashboard component tests, backend project-status tests, lint, typecheck, build | Real frontend-to-backend smoke verified for CPU; CUDA rendering covered by fixtures | N/A | Yes | Runtime-dependent | Existing web deps only | Shared Core | Web 1 Feature 6 | Future workflow pages remain planned |
| Developer Experience | Data Pipeline Studio planning/API audit | Implemented | `docs/web/data-pipeline-studio.md`; `docs/web/data-pipeline-api.md`; `docs/web/dataset-upload-security.md`; `docs/web/dataset-storage.md`; `docs/web/pipeline-events.md` | Documentation only | Docs reviewed with full regression suite | N/A, docs-only | N/A | N/A | N/A | None | Shared Core | Web 2 Feature 1 | Implementation still pending |
| Developer Experience | Data Pipeline Studio | Partially Implemented | Planning docs and read-only backend | `/api/datasets`; `/api/datasets/{dataset_id}/inspection` | backend tests | Backend runtime smoke verified | N/A | Yes | N/A | FastAPI optional web stack | Shared Core | Web 2 | Build UI, step registry, preview, manifest, dry run |
| Developer Experience | Dataset Inspector Backend | Implemented | `src/arclm/web/datasets.py`; `src/arclm/web/app.py`; `src/arclm/web/config.py` | `GET /api/datasets`; `GET /api/datasets/{dataset_id}/inspection`; `DatasetRoot` | `tests/web/datasets/test_dataset_inspector.py` | Runtime smoke verified with TXT/CSV/JSON/JSONL fixtures | N/A | Yes | N/A | FastAPI optional web stack | Shared Core | Web 2 Feature 2 | Dataset Inspector UI pending |
| Developer Experience | Dataset Inspector UI | Not Implemented | none | No route behavior | No | No | N/A | No | N/A | Existing web frontend | Shared Core | Web 2 Feature 3 | Awaiting explicit approval |
| Developer Experience | Visual training dashboard | Not Implemented | none | No | No | No | N/A | No | No | web stack | Pro | Web 3 | Dashboard/event backend after foundation |
| Developer Experience | Model registry | Partially Implemented | registry + AutoModel | `Registry`, `AutoModel` | limited | Import/partial | N/A | Yes | N/A | None | Community | 4 | Wiring/docs |
| Developer Experience | Dataset registry | Not Implemented | none | No | No | No | N/A | No | N/A | None | Community | 4 | Registry |
| Developer Experience | Plugin system | Interface Only | `plugins/interfaces.py` | `PluginProtocol` | No | No behavior | N/A | N/A | N/A | None | Community | Web 5 / Agents later | Discovery/permissions before UI management |
| Developer Experience | Plugin discovery | Not Implemented | none | No | No | No | N/A | No | No | plugin tooling | Pro | 13 | Discovery |
| Developer Experience | Extension marketplace | Not Implemented | none | No | No | No | N/A | No | No | marketplace | Pro | Web 5 / Research later | Marketplace after plugin security model |
| Developer Experience | Project templates | Not Implemented | examples only | No generator | No | No | N/A | No | No | None | Community | Web 4 | Template command/wizard after project model |
| Developer Experience | Example projects | Partially Implemented | `examples/` | examples | not all tested | Limited | N/A | Partial | N/A | optional deps | Community | 1 | Keep current |
| Developer Experience | YAML configs | Implemented | config serialization | YAML helpers | limited | Yes import | N/A | Yes | N/A | PyYAML | Community | 0 | Dedicated tests |
| Developer Experience | JSON configs | Implemented | config serialization | JSON helpers | limited | Yes import | N/A | Yes | N/A | None | Community | 0 | Dedicated tests |
| Developer Experience | Documentation | Partially Implemented | `docs/` | docs | no docs tests | N/A | N/A | N/A | N/A | None | Community | 0/1 | Milestone 0 README accuracy pass done; keep docs current |
| Developer Experience | Migration guides | Implemented | `docs/migration` | docs | N/A | N/A | N/A | N/A | N/A | None | Community | 0 | Keep current |
| Developer Experience | Type hints | Partially Implemented | annotations + `py.typed` | type hints | compileall | Partial | N/A | Yes | N/A | None | Community | Later | Type checking |
| Developer Experience | `py.typed` | Implemented | package data | marker file | compileall | Yes | N/A | Yes | N/A | None | Community | 0 | Type quality |
| Developer Experience | Helpful errors | Partially Implemented | exception hierarchy | exceptions | tests indirect | Partial | N/A | Yes | N/A | None | Community | 1 | Consistency |
| Developer Experience | Optional-dependency errors | Implemented | import guards | helpful errors | limited | Yes import | N/A | Yes | N/A | optional deps | Community | 0 | More tests |
| Developer Experience | Auto documentation | Not Implemented | none | No | No | No | N/A | No | No | doc tools | Community | 17 | Autodoc |
| Developer Experience | Version management | Implemented | `_version.py` | `__version__` | import tests | Yes | N/A | Yes | N/A | None | Community | 0 | Release process |
| Security | Model encryption | Not Implemented | none | No | No | No | N/A | No | No | crypto | Pro | 15 | Encryption |
| Security | Prompt injection detection | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | 15 | Detection/eval |
| Security | PII detection | Partially Implemented | `preprocess/pii.py` | `pii_reasons`, `redact_pii` | limited/indirect | Partial | N/A | Yes | N/A | None | Shared Core | 15 | Tests/docs |
| Security | Content moderation | Partially Implemented | `preprocess/toxicity.py` | toxicity helpers | limited | Partial | N/A | Yes | N/A | None | Shared Core | 15 | Real moderation |
| Security | Safety guardrails | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | 15 | Guardrail system |
| Security | Rate limiting | Not Implemented | none | No | No | No | N/A | No | No | server stack | Pro | 9/15 | Middleware |
| Security | Input validation | Partially Implemented | configs/datasets validate | validators | tests | Yes partial | N/A | Yes | N/A | None | Community | 1/15 | Broader validation |
| Security | Output validation | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | 15 | Output schema checks |
| Security | Secret redaction | Not Implemented | none | No | No | No | N/A | No | No | TBD | Pro | 15 | Redaction |
| Security | Tool permissions | Not Implemented | none | No | No | No | N/A | No | No | agent stack | Pro | 13 | Permission model |
| Security | Sandboxing | Not Implemented | none | No | No | No | N/A | No | No | sandbox | Pro | 13 | Sandbox |
| Security | Audit events | Not Implemented | none | No | No | No | N/A | No | No | logging/server | Pro | 13/16 | Audit model |
| Security | Secure defaults | Partially Implemented | no hidden optional imports; local-first | package behavior | tests | Partial | N/A | Yes | N/A | None | Community | 0/15 | Formal policy |
| Security | Dependency scanning | Not Implemented | none | No | No | No | N/A | No | No | scan tooling | Pro | 15 | CI policy |
| Security | Model artifact verification | Partially Implemented | checkpoint inspectors | `SmartLoader` | loader tests | Partial | Partial | Yes | N/A | safetensors optional | Shared Core | 10/15 | Checksums/signatures |
| Integrations | Hugging Face Hub | Partially Implemented | HF loading paths, no hub deploy | HF loaders | limited | No real hub runtime | Yes partial | Possible | Unverified | Transformers/HF Hub | Shared Core | 3/11 | Local tests/hub policy |
| Integrations | OpenAI API | Not Implemented | none | No | No | No | N/A | No | No | OpenAI SDK | Pro | Later | Provider adapter |
| Integrations | Ollama | Not Implemented | none | No | No | No | N/A | No | No | Ollama | Pro | Later | Adapter |
| Integrations | vLLM | Not Implemented | none | No | No | No | N/A | No | No | vLLM | Pro | 9 | Serving backend |
| Integrations | llama.cpp | Not Implemented | none | No | No | No | N/A | No | No | llama.cpp | Pro | 10 | Runtime/export |
| Integrations | MLflow | Experimental | `tracking.py` | backend | No | No | N/A | No | No | mlflow | Pro | 7 | Optional tests |
| Integrations | Weights & Biases | Experimental | `tracking.py` | backend | No | No | N/A | No | No | wandb | Pro | 7 | Optional tests |
| Integrations | Comet ML | Not Implemented | docstring mention only | No | No | No | N/A | No | No | comet | Pro | 7 | Adapter |
| Integrations | TensorBoard | Not Implemented | none | No | No | No | N/A | No | No | tensorboard | Pro | 7 | Adapter |
| Integrations | MCP clients and servers | Not Implemented | none | No | No | No | N/A | No | No | MCP SDK | Pro | 13 | MCP layer |
| Integrations | Vector databases | Not Implemented | none | No | No | No | N/A | No | No | vector clients | Pro | 6 | Adapters |
| Integrations | Cloud object storage | Not Implemented | none | No | No | No | N/A | No | No | cloud SDKs | Pro | 11 | Storage adapters |
| Research | New architecture prototyping | Partially Implemented | AutoModel/basic modules | `AutoModel` | limited | Partial | No | Yes | Unverified | Torch | Research | 17 | Prototyping guide |
| Research | Custom attention | Not Implemented | none | No | No | No | No | No | No | Torch | Research | 17 | Layers/tests |
| Research | Custom optimizers | Not Implemented | config selects built-ins only | No custom API | No | No | N/A | No | No | Torch | Research | 17 | Optimizer interface if needed |
| Research | Custom loss functions | Not Implemented | model-provided loss only | No | No | No | N/A | No | No | Torch | Research | 17 | Loss hooks |
| Research | Ablation studies | Not Implemented | none | No | No | No | N/A | No | No | tracking | Pro | 17 | Experiment comparison |
| Research | Reproducibility tools | Partially Implemented | seed/config/checkpoints | config/seed | limited | Partial | N/A | Yes | Unverified | None | Community | 17 | Formal metadata |
| Research | Experiment comparison | Not Implemented | none | No | No | No | N/A | No | No | tracking | Pro | 17 | Comparison reports |
| Research | Seed control | Partially Implemented | config/SFT seed helpers | `set_seed` legacy | limited | Partial | N/A | Yes | Unverified | Torch | Community | 17 | Central API/tests |
| Research | Dataset-version tracking | Not Implemented | none | No | No | No | N/A | No | No | storage | Pro | 17 | Dataset manifests |
| Research | Config snapshots | Partially Implemented | checkpoints/tracking config | config save | limited | Partial | N/A | Yes | N/A | None | Community | 17 | Snapshot schema |
| Research | Code-version tracking | Not Implemented | none | No | No | No | N/A | No | No | git | Pro | 17 | Git metadata |
| Utilities | Configuration management | Implemented | configs serialization/base | config APIs | tests/imports | Yes | N/A | Yes | N/A | PyYAML optional | Community | 0 | More tests |
| Utilities | Model conversion | Not Implemented | none | No | No | No | No | No | No | export deps | Pro | 10 | Converter |
| Utilities | Checkpoint conversion | Partially Implemented | smart loaders/adapters | `SmartLoader` | loader tests | Partial | Partial | Yes | N/A | safetensors optional | Shared Core | 10 | Conversion API |
| Utilities | Seed management | Partially Implemented | config/SFT seed | `set_seed` legacy | limited | Partial | N/A | Yes | Unverified | Torch | Community | 17 | Central helper |
| Utilities | Logging | Implemented | async training logger | `AsyncTrainingLogger` | tests indirect | Yes partial | N/A | Yes | N/A | None | Community | 7 | Docs |
| Utilities | Profiling | Not Implemented | none | No | No | No | N/A | No | No | profiler deps | Pro | 7/10 | Profiler |
| Utilities | Auto documentation | Not Implemented | none | No | No | No | N/A | No | No | doc tools | Community | 17 | Autodoc |
| Utilities | Version management | Implemented | `_version.py` | `__version__` | import tests | Yes | N/A | Yes | N/A | None | Community | 0 | Release policy |
| Utilities | Optional dependency checks | Implemented | import guards | optional errors | limited | Yes | N/A | Yes | N/A | optional deps | Community | 0 | More coverage |
| Utilities | Device detection | Implemented | root helper + CUDA diagnostics | `get_device` | import + GPU env checks | CPU and CUDA verified | N/A | Yes | GTX 1050 Ti verified | Torch | Community | 0/GPU | Multi-GPU matrix |
| Utilities | Serialization | Implemented | config/checkpoints/results | to/from dict/files | tests | Yes | N/A | Yes | N/A | PyYAML optional | Community | 0 | Format matrix |
| Utilities | Artifact metadata | Partially Implemented | checkpoints/source info | metadata dicts | limited | Partial | Partial | Yes | N/A | None/safetensors | Shared Core | 10 | Standard schema |
| Utilities | Reproducibility metadata | Partially Implemented | config/checkpoint state | state/config | limited | Partial | N/A | Yes | N/A | None | Community | 17 | Code/data versions |
| Enterprise | User authentication | Not Implemented | none | No | No | No | N/A | No | No | auth stack | Pro | 16 | Auth |
| Enterprise | Team workspaces | Not Implemented | none | No | No | No | N/A | No | No | database/server | Pro | 16 | Workspace model |
| Enterprise | Role-based permissions | Not Implemented | none | No | No | No | N/A | No | No | auth stack | Pro | 16 | RBAC |
| Enterprise | Audit logs | Not Implemented | none | No | No | No | N/A | No | No | logging/server | Pro | 16 | Audit log |
| Enterprise | API keys | Not Implemented | none | No | No | No | N/A | No | No | auth stack | Pro | 16 | Key management |
| Enterprise | Billing | Not Implemented | none | No | No | No | N/A | No | No | billing stack | Pro | 16 | Billing |
| Enterprise | License management | Not Implemented | none | No | No | No | N/A | No | No | licensing | Pro | 16 | License system |
| Enterprise | Usage tracking | Not Implemented | none | No | No | No | N/A | No | No | server/logging | Pro | 16 | Usage metering |
| Enterprise | Organizations | Not Implemented | none | No | No | No | N/A | No | No | database/server | Pro | 16 | Org model |
| Enterprise | Project isolation | Not Implemented | none | No | No | No | N/A | No | No | server/security | Pro | 16 | Isolation |
| Enterprise | Secret management | Not Implemented | none | No | No | No | N/A | No | No | secret store | Pro | 16 | Secret manager |
| Enterprise | Enterprise server | Not Implemented | none | No | No | No | N/A | No | No | server stack | Pro | 16 | Server |
| Enterprise | Pro license checks | Not Implemented | none | No | No | No | N/A | No | No | licensing | Pro | 16 | License checks |
| Enterprise | Data retention policies | Not Implemented | none | No | No | No | N/A | No | No | server/storage | Pro | 16 | Retention policy |
