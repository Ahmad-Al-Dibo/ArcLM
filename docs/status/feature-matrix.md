# Feature Matrix

Status labels: `Implemented`, `Partially Implemented`, `Experimental`, `Interface Only`, `Scaffold Only`, `Documented Only`, `Not Implemented`, `Unknown`.

| Category | Feature | Status | Public API | Source Evidence | Tests | Runtime Verified | Docs | Optional Dependency | Community/Pro | Missing Work |
| -------- | ------- | ------ | ---------- | --------------- | ----- | ---------------- | ---- | ------------------- | ------------- | ------------ |
| Training | Single-device training | Implemented | `arclm.training.Trainer` | `src/arclm/training/trainer.py` | `tests/unit/training/test_trainer.py`, `tests/smoke/test_single_device_training.py` | CPU pytest passed | `docs/training/` | Torch | Community | CUDA runtime evidence |
| Training | Distributed training | Not Implemented | No | No DDP/FSDP orchestration found | None | No | Roadmap only | None | Pro | Full design and implementation |
| Training | DDP | Not Implemented | No | No DDP trainer found | None | No | Roadmap only | Torch distributed | Pro | DDP process launch and tests |
| Training | FSDP | Not Implemented | No | No FSDP code found | None | No | Roadmap only | Torch distributed | Pro | FSDP integration |
| Training | Multi-GPU training | Not Implemented | No | No multi-GPU orchestration found | None | No | Roadmap only | CUDA | Pro | Launcher, device mapping, tests |
| Training | Mixed precision FP16 | Partially Implemented | `TrainingConfig(precision="fp16")` | `src/arclm/training/precision.py` | `tests/unit/training/test_precision.py` | Unsupported CPU path tested; CUDA skipped | `docs/training/mixed-precision.md` | CUDA Torch | Shared Core | CUDA runtime validation |
| Training | Mixed precision BF16 | Partially Implemented | `TrainingConfig(precision="bf16")` | `src/arclm/training/precision.py` | `tests/unit/training/test_precision.py` | CPU/CUDA coverage limited by hardware | `docs/training/mixed-precision.md` | Torch | Shared Core | Broader hardware validation |
| Training | Gradient accumulation | Implemented | `gradient_accumulation_steps` | `Trainer.train()` | `tests/unit/training/test_trainer.py` | CPU pytest passed | `docs/training/gradient-accumulation.md` | Torch | Community | None for core |
| Training | Gradient clipping | Implemented | `max_grad_norm` | `Trainer._optimizer_step()` | `tests/unit/training/test_trainer.py` | CPU pytest passed | `docs/training/configuration.md` | Torch | Community | None for core |
| Training | Automatic checkpointing | Implemented | `save_every_steps`, `save_checkpoint()` | `Trainer.save_checkpoint()` | `tests/unit/training/test_trainer.py` | CPU pytest passed | `docs/training/checkpoints.md` | Torch | Community | None for core |
| Training | Checkpoint retention | Implemented | `keep_last_checkpoints` | `Trainer._cleanup_checkpoints()` | `tests/unit/training/test_trainer.py` | CPU pytest passed | `docs/training/checkpoints.md` | Torch | Community | None for core |
| Training | Resume interrupted training | Implemented | `resume_from_checkpoint`, `load_checkpoint()` | `Trainer.load_checkpoint()` | `tests/unit/training/test_trainer.py` | CPU pytest passed | `docs/training/resume-training.md` | Torch | Community | None for core |
| Training | Optimizer support | Implemented | `optimizer=adamw/adam/sgd` | `src/arclm/training/optimizers.py` | `tests/unit/training/test_optimizers.py` | CPU pytest passed | `docs/training/configuration.md` | Torch | Community | More optimizer types if needed |
| Training | Scheduler support | Implemented | `scheduler=constant/linear/cosine` | `src/arclm/training/schedulers.py` | `tests/unit/training/test_optimizers.py`, trainer tests | CPU pytest passed | `docs/training/configuration.md` | Torch | Community | More schedules if needed |
| Training | Training callbacks | Implemented | `BaseCallback` | `src/arclm/training/callbacks.py` | `tests/unit/training/test_trainer.py` | CPU pytest passed | `docs/training/callbacks.md` | None | Community | None for basic hooks |
| Training | Training state | Implemented | `TrainingState` | `src/arclm/training/state.py` | `tests/unit/training/test_state.py` | CPU pytest passed | `docs/training/overview.md` | None | Community | None for core |
| Training | Hyperparameter search | Not Implemented | No | No search framework found | None | No | Roadmap excludes | None | Pro | Search engine and trials |
| Training | Curriculum learning | Not Implemented | No | No curriculum scheduler/data policy found | None | No | Not active | None | Pro | Curriculum API |
| Training | Full fine-tuning | Implemented | `FullFineTuner` | `src/arclm/finetuning/full.py` | `tests/unit/finetuning/test_finetuners.py`, smoke | CPU pytest passed | `docs/finetuning/full-finetuning.md` | Torch | Community | More real model integrations |
| Training | Supervised Fine-Tuning | Implemented | `SFTTrainer`, `SFTConfig` | `src/arclm/finetuning/` | `tests/unit/finetuning/`, smoke | CPU pytest passed | `docs/finetuning/sft.md` | Torch | Community | Broader tokenizer/model tests |
| Training | LoRA | Experimental | `train_sft(use_lora=True)`, `apply_lora` | `src/arclm/finetuning/sft.py` | No PEFT runtime test | No; PEFT absent | Examples/docs mention | PEFT, Transformers | Pro | Stable PEFT phase, tests |
| Training | QLoRA | Not Implemented | No stable API | Only inference quant flags found | None | No | Roadmap/future | PEFT/bitsandbytes | Pro | QLoRA training stack |
| Training | Other PEFT methods | Not Implemented | No | No prefix/prompt/IA3 training found | None | No | Not active | PEFT | Pro | Adapter abstractions |
| Training | RLHF | Not Implemented | No | Explicitly rejected in external fine-tune wrapper | None | No | Roadmap only | None | Pro | Separate RLHF system |
| Training | DPO | Not Implemented | No | No DPO trainer/loss found | None | No | Roadmap only | None | Pro | DPO data/loss/eval |
| Training | GRPO | Not Implemented | No | No GRPO code found | None | No | Roadmap only | None | Pro | GRPO implementation |
| Training | Reward model training | Not Implemented | No | No reward model workflow found | None | No | Roadmap only | None | Pro | Reward dataset/model/loss |
| Training | Experiment tracking | Experimental | `arclm.tracking.ExperimentTracker` via `arclm.api` | `src/arclm/tracking.py` | No current tests | No | Sparse | mlflow/wandb optional | Pro | Tests, docs, Trainer integration |
| Training | Training dashboards | Not Implemented | No | No dashboard app for training found | None | No | Roadmap only | Web deps | Pro | UI/backend events |
| Architectures | GPT-like causal LM | Implemented | `ArcLM`, `MiniGPT`, `AutoModel` | `src/arclm/models/text/causal_lm.py` | library/training/smoke tests | CPU pytest passed | README, architecture docs | Torch | Community | Larger variants |
| Architectures | LLaMA | Not Implemented | No native API | Only generic HF loading may load external LLaMA-like models | No LLaMA tests | No | Not documented as native | Transformers optional | Pro | Native architecture or integration tests |
| Architectures | Mistral | Not Implemented | No native API | No native Mistral code found | None | No | Not active | Transformers optional | Pro | Native/integration support |
| Architectures | Mixture of Experts | Not Implemented | No | No MoE layers/router found | None | No | Not active | None | Pro | MoE architecture |
| Architectures | Encoder-only models | Not Implemented | No | No encoder-only architecture found | None | No | Not active | None | Community | Encoder base and tasks |
| Architectures | BERT | Not Implemented | No native API | No BERT model found | None | No | Not active | Transformers optional | Community | MLM/classification workflow |
| Architectures | Encoder-decoder models | Not Implemented | No | No encoder-decoder architecture found | None | No | Not active | None | Community | Seq2seq architecture |
| Architectures | T5 | Not Implemented | No native API | No T5 model found | None | No | Not active | Transformers optional | Community | Seq2seq integration |
| Architectures | Vision Transformers | Not Implemented | No | No vision modules found | None | No | Not active | None | Pro | Vision pipeline |
| Architectures | Multimodal models | Not Implemented | No | No multimodal code found | None | No | Roadmap later | None | Pro | Modal data/model APIs |
| Architectures | Custom architecture builder | Partially Implemented | `AutoModel.from_name/from_config` | `src/arclm/models/auto.py` | public import tests | Import verified | architecture docs | Torch | Community | Registry for more architectures |
| Architectures | Custom PyTorch models | Implemented | `Trainer`, `ModelAdapter` | `Trainer.training_step()`, `finetuning.ModelAdapter` | training/finetuning tests | CPU pytest passed | fine-tuning docs | Torch | Community | Broader contracts |
| Architectures | Hugging Face models | Experimental | `load_any_model`, `train_sft(backend="huggingface")` | `src/arclm/inference/external.py`, `finetuning/sft.py` | Mostly fake/local contract tests | No remote/model runtime | examples/docs | Transformers | Shared Core | Real tiny HF integration tests |
| Architectures | External models through adapters | Partially Implemented | `finetuning.ModelAdapter` | `src/arclm/finetuning/adapters.py` | custom adapter tests | CPU pytest passed for SFT | docs/finetuning/model-adapters.md | Torch | Community | General inference/training adapters |
| Tokenizers | Native tokenizer support | Implemented | `Tokenizer`, `SentencePieceTokenizer` | `src/arclm/tokenizers/base.py` | public/library tests | CPU pytest passed | README/docs | SentencePiece | Community | More tests for SP edge cases |
| Tokenizers | External tokenizer support | Partially Implemented | `TokenizerAdapter` | `src/arclm/finetuning/adapters.py` | finetuning adapter tests | CPU pytest passed for SFT | docs/finetuning/tokenizer-adapters.md | Optional backend | Community | General tokenizer API |
| Tokenizers | Hugging Face tokenizer support | Experimental | `AutoTokenizer` via HF loaders | `inference/external.py`, `finetuning/sft.py` | No real HF tokenizer test | No | examples | Transformers | Shared Core | Local tiny HF tokenizer tests |
| Tokenizers | Custom tokenizer adapters | Implemented | `TokenizerAdapter`, `BaseTokenizerAdapter` | `src/arclm/finetuning/adapters.py` | unit tests | CPU pytest passed | docs/finetuning/tokenizer-adapters.md | None | Community | Non-SFT usage |
| Tokenizers | Tokenizer training | Implemented | `Tokenizer.build`, `SentencePieceTokenizer.build` | `src/arclm/tokenizers/base.py` | library/data tests | CPU pytest passed | README | SentencePiece | Community | More SP runtime tests |
| Tokenizers | Encoding | Implemented | `encode`, `encode_text` | `src/arclm/tokenizers/base.py` | unit/library tests | CPU pytest passed | README | None | Community | None |
| Tokenizers | Decoding | Implemented | `decode`, `decode_string` | `src/arclm/tokenizers/base.py` | unit/library tests | CPU pytest passed | README | None | Community | None |
| Tokenizers | Batch tokenization | Partially Implemented | No native batch API | HF callable may batch; native does not | Not directly tested | No | Not documented | Transformers optional | Community | Batch API/tests |
| Tokenizers | Padding | Partially Implemented | `SFTDataCollator` | `src/arclm/finetuning/collator.py` | collator tests | CPU pytest passed | finetuning docs | Torch | Community | General tokenizer padding |
| Tokenizers | Truncation | Partially Implemented | `SFTConfig.truncation` | `collator.py`, `TokenizerAdapter.encode` | collator tests | CPU pytest passed | finetuning docs | None | Community | General tokenizer truncation |
| Tokenizers | Special tokens | Partially Implemented | `user_defined_symbols`, pad/eos adapter ids | tokenizers and finetuning adapters | instruction tests | CPU pytest passed | README/finetuning docs | None | Community | Unified special-token model |
| Tokenizers | Chat templates | Partially Implemented | `TokenizerAdapter.apply_chat_template` | `format_chat_example()` | formatting tests with fake template | CPU pytest passed | docs/finetuning/chat-templates.md | Transformers optional | Community | Real HF template tests |
| Tokenizers | Tokenizer saving | Implemented | `save`, `save_vocab`, checkpoint metadata | `src/arclm/tokenizers/base.py` | instruction checkpoint test | CPU pytest passed | README | None | Community | More format coverage |
| Tokenizers | Tokenizer loading | Implemented | `from_json`, `load`, checkpoint helpers | tokenizers and training pipeline | instruction checkpoint test | CPU pytest passed | migration/docs | SentencePiece | Community | More compatibility cases |
| Tokenizers | Token analysis | Partially Implemented | `analyze_coverage`, `whitespace_token_stats` | tokenizer/preprocess/evaluation diagnostics | limited tests | CPU pytest passed indirectly | roadmap/data docs | None | Community | Integrated token analysis reports |
| Tokenizers | Vocabulary statistics | Implemented | `token_counts`, `get_rare_tokens` | `Tokenizer`, `whitespace_token_stats` | library tests limited | CPU pytest passed | README/data docs | None | Community | Dedicated tests |
| Data Pipeline | Dataset loading | Implemented | `load_dataset`, `DatasetLoader` | `src/arclm/datasets/loader.py` | `tests/unit/datasets/test_loader.py` | CPU pytest passed | `docs/data/loading.md` | None | Community | More external sources |
| Data Pipeline | JSON loading | Implemented | `load_dataset` | loader `_load_json` | dataset tests | CPU pytest passed | data docs | None | Community | None |
| Data Pipeline | JSONL loading | Implemented | `load_dataset` | loader `_load_jsonl` | dataset tests | CPU pytest passed | data docs | None | Community | None |
| Data Pipeline | CSV loading | Implemented | `load_dataset` | loader `_load_csv` | dataset tests | CPU pytest passed | data docs | None | Community | None |
| Data Pipeline | TXT loading | Implemented | `load_dataset` | loader `_load_txt` | dataset tests | CPU pytest passed | data docs | None | Community | None |
| Data Pipeline | Python-list loading | Implemented | `load_dataset(list)` | loader `_normalize_rows` | dataset tests | CPU pytest passed | data docs | None | Community | None |
| Data Pipeline | Hugging Face Dataset support | Not Implemented | No specific API | Iterable may be materialized, no HF Dataset integration | None | No | Not active | datasets optional absent | Community | Optional integration |
| Data Pipeline | PyTorch Dataset support | Partially Implemented | `TextDataset`, `InstructionDataset`, Trainer accepts datasets | datasets base/instruction | tests | CPU pytest passed | docs/training/data | Torch | Community | Generic wrapping docs |
| Data Pipeline | Dataset versioning | Not Implemented | No | No version store/manifest found | None | No | Roadmap only | None | Pro | Version manifests/hashes |
| Data Pipeline | Dataset cleaning | Implemented | `DataPipeline`, cleaning steps | `src/arclm/datasets/cleaning` | cleaning tests | CPU pytest passed | `docs/data/cleaning.md` | None | Community | More cleaners |
| Data Pipeline | Automatic exact deduplication | Implemented | `ExactDeduplicator`, `deduplicate` | `datasets/deduplication/exact.py` | dedup tests | CPU pytest passed | `docs/data/deduplication.md` | None | Community | None |
| Data Pipeline | Hash-based deduplication | Partially Implemented | `hash_algorithm` | `ExactDeduplicator._hash`, preprocess `exact_hash` | partial | CPU pytest indirect | data/preprocess docs | None | Community | Dedicated tests/docs |
| Data Pipeline | Approximate deduplication | Experimental | Preprocess `near_dedup` | `preprocess/duplicate.py` SimHash | limited/disabled in test | Limited | preprocess docs | None | Pro | Dedicated tests and data API integration |
| Data Pipeline | Data augmentation | Interface Only | `BaseAugmenter` | `datasets/base.py` | base tests | Import/class only | roadmap | None | Community | Real augmenters |
| Data Pipeline | Streaming datasets | Implemented | `StreamingDataset`, `streaming=True` | `datasets/streaming/iterable.py` | dataset tests | CPU pytest passed | data docs | None | Community | More streaming formats |
| Data Pipeline | WebDataset support | Not Implemented | No | No WebDataset code found | None | No | Roadmap only | webdataset | Pro | Optional loader |
| Data Pipeline | Dataset statistics | Partially Implemented | `DatasetStats` | `preprocess/statistics.py` | preprocess test | CPU pytest passed for preprocess | preprocess/data mentions | None | Community | New dataset API stats |
| Data Pipeline | Token analysis | Partially Implemented | `whitespace_token_stats`, coverage | preprocess/tokenizer/evaluation diagnostics | limited | CPU pytest indirect | roadmap | None | Community | Integrated reports/tests |
| Data Pipeline | Synthetic data generation | Interface Only | `BaseSyntheticDataGenerator` | `datasets/base.py` | base tests | No behavior | roadmap | Provider optional | Pro | Generator implementations |
| Data Pipeline | Data pipelines | Implemented | `DataPipeline` | `datasets/pipeline.py` | pipeline tests | CPU pytest passed | `docs/data/pipelines.md` | None | Community | None |
| Data Pipeline | Custom pipeline steps | Implemented | `BaseDataStep`, callable steps | `DataPipeline._run_step` | pipeline tests | CPU pytest passed | `docs/data/custom-components.md` | None | Community | None |
| Data Pipeline | Instruction datasets | Implemented | `InstructionDataset` | `datasets/instruction.py` | `test_instruction_sft.py` | CPU pytest passed | examples/docs | Torch | Community | More formats |
| Data Pipeline | Chat datasets | Partially Implemented | `SFTTrainer(messages_field=...)` | finetuning formatting/collator | formatting/collator tests | CPU pytest passed | finetuning docs | Torch | Community | Standalone chat dataset |
| Data Pipeline | Dataset validation | Implemented | `required_fields` | `DatasetLoader._validate_required_fields` | loader tests | CPU pytest passed | data docs | None | Community | Schema validation |
| Data Pipeline | Sequence packing | Implemented | `SFTConfig(packing=True)` | `finetuning/packing.py` | collator tests | CPU pytest passed | `docs/finetuning/sequence-packing.md` | Torch | Community | Advanced packing |
| Fine-Tuning and SFT | Full fine-tuning | Implemented | `FullFineTuner` | `finetuning/full.py` | unit/smoke | CPU pytest passed | docs/finetuning | Torch | Community | Real large model tests |
| Fine-Tuning and SFT | BaseFineTuner | Implemented | `BaseFineTuner` | `finetuning/base.py` | base tests | CPU pytest passed | custom-finetuner docs | None | Community | None |
| Fine-Tuning and SFT | FullFineTuner | Implemented | `FullFineTuner` | `finetuning/full.py` | finetuner tests | CPU pytest passed | full-finetuning docs | Torch | Community | None for basic |
| Fine-Tuning and SFT | SFTTrainer | Implemented | `SFTTrainer` | `finetuning/full.py` | finetuner/smoke tests | CPU pytest passed | sft docs | Torch | Community | Broader models |
| Fine-Tuning and SFT | SFTConfig | Implemented | `SFTConfig` | `finetuning/config.py` | config tests | CPU pytest passed | configuration docs | None | Community | None |
| Fine-Tuning and SFT | Plain-text SFT | Implemented | `text_field` | formatter/collator | formatting/collator tests | CPU pytest passed | dataset docs | Torch | Community | None |
| Fine-Tuning and SFT | Instruction formatting | Implemented | formatter helpers | `format_instruction_example` | formatting tests | CPU pytest passed | docs | None | Community | None |
| Fine-Tuning and SFT | Prompt-response formatting | Implemented | formatter helpers | `format_prompt_response_example` | formatting tests | CPU pytest passed | docs | None | Community | None |
| Fine-Tuning and SFT | Chat formatting | Implemented | `messages_field` | `format_chat_example` | formatting tests | CPU pytest passed | docs | None | Community | More templates |
| Fine-Tuning and SFT | Chat-template support | Partially Implemented | `TokenizerAdapter.apply_chat_template` | formatting adapter | fake-template test | CPU pytest passed | docs | Transformers optional | Community | Real HF template tests |
| Fine-Tuning and SFT | Label creation | Implemented | `create_labels` | `finetuning/labels.py` | collator tests | CPU pytest passed | docs | None | Community | None |
| Fine-Tuning and SFT | Padding-label masking | Implemented | `ignore_index` | `SFTDataCollator` | collator tests | CPU pytest passed | docs | Torch | Community | None |
| Fine-Tuning and SFT | Assistant-only loss | Implemented | `assistant_only_loss` | labels/collator/formatting | collator tests | CPU pytest passed | docs | Torch | Community | More real template tests |
| Fine-Tuning and SFT | Truncation | Implemented | `truncation`, `max_length` | collator/adapter | collator tests | CPU pytest passed | docs | None | Community | Advanced policies |
| Fine-Tuning and SFT | Sequence packing | Implemented | `packing` | `packing.py` | collator tests | CPU pytest passed | docs | None | Community | Cross-batch packing |
| Fine-Tuning and SFT | SFT data collator | Implemented | `SFTDataCollator` | `collator.py` | collator tests | CPU pytest passed | docs | Torch | Community | None |
| Fine-Tuning and SFT | Model adapters | Implemented | `ModelAdapter` | `adapters.py` | adapter tests | CPU pytest passed | docs | Torch | Community | More model families |
| Fine-Tuning and SFT | Tokenizer adapters | Implemented | `TokenizerAdapter` | `adapters.py` | adapter tests | CPU pytest passed | docs | None | Community | More tokenizers |
| Fine-Tuning and SFT | ArcLM model support | Implemented | Direct via adapter | `ModelAdapter` + `ArcLM` | native ArcLM SFT test | CPU pytest passed | docs | Torch | Community | None for basic |
| Fine-Tuning and SFT | Standard PyTorch model support | Implemented | direct/adapter | `ModelAdapter` | tiny PyTorch tests | CPU pytest passed | docs | Torch | Community | More contracts |
| Fine-Tuning and SFT | Hugging Face model support | Partially Implemented | HF-style outputs, legacy HF SFT | `ModelAdapter`, `train_sft` | fake HF-style tests | Limited CPU fake only | docs/examples | Transformers | Shared Core | Real HF local model tests |
| Fine-Tuning and SFT | Custom external model support | Implemented | custom `ModelAdapter` maps | adapter tests | CPU pytest passed | docs | Torch | Community | Save/load adapter contracts |
| Fine-Tuning and SFT | SFT evaluation | Implemented | `fine_tuner.evaluate()` | uses `Trainer.evaluate()` | finetuner tests | CPU pytest passed | docs | Torch | Community | More metrics |
| Fine-Tuning and SFT | SFT checkpointing | Implemented | `save_checkpoint()` | `FullFineTuner.save_checkpoint` | smoke tests | CPU pytest passed | docs | Torch | Community | External save hooks |
| Fine-Tuning and SFT | SFT resume | Implemented | `load_checkpoint`, `resume` | Trainer reuse | smoke/new trainer test | CPU pytest passed | docs | Torch | Community | HF save_pretrained resume |
| Fine-Tuning and SFT | Legacy `arclm.sft` compatibility | Implemented | `arclm.sft` | shim and legacy helpers | compatibility tests | CPU pytest passed | migration/docs | Transformers for legacy HF | Community | Eventual deprecation plan |
| Inference | Basic inference | Implemented | `load_model`, `predict` | `inference/engine.py` | library tests | CPU pytest passed | README | Torch | Community | More checkpoint cases |
| Inference | Text generation | Implemented | `Generator`, `LoadedModel.predict` | `inference/generation.py` | library tests | CPU pytest passed | README | Torch | Community | Greedy option |
| Inference | Sampling | Implemented | `temperature`, multinomial | `Generator.generate` | library tests limited | CPU pytest passed | README | Torch | Community | Deterministic modes |
| Inference | Greedy decoding | Partially Implemented | HF `do_sample`; no native explicit greedy | native generator samples | No direct test | No | Sparse | Torch/Transformers | Community | Native greedy mode |
| Inference | Temperature | Implemented | `temperature` | generator/external config | tests limited | CPU pytest passed | README | Torch | Community | Validation edge cases |
| Inference | Top-k | Implemented | `top_k` | `Generator._apply_top_k` | limited | CPU pytest passed indirectly | README | Torch | Community | Dedicated tests |
| Inference | Top-p | Implemented | `top_p` | `Generator._apply_top_p` | limited | CPU pytest passed indirectly | README | Torch | Community | Dedicated tests |
| Inference | Streaming generation | Not Implemented | No | No token streaming API found | None | No | Not active | None | Pro | Stream callbacks/server |
| Inference | Batch inference | Partially Implemented | `ExternalLoadedModel.batch_predict` | loops over prompts | No direct tests | No | Sparse | Optional HF | Pro | True batched generation |
| Inference | Model serving | Experimental | `run_simple_interface` | Flask app | helper import tests only | Not health-checked | README | Flask | Pro | Production server tests |
| Inference | REST API | Experimental | Flask routes | `simple_interface.py` | no endpoint tests | No | Sparse | Flask | Pro | API tests/auth/docs |
| Inference | OpenAI-compatible API | Not Implemented | No | No OpenAI-compatible server routes | None | No | Not active | None | Pro | API schema/server |
| Inference | Dynamic batching | Not Implemented | No | No scheduler/batcher found | None | No | Not active | None | Pro | Serving batcher |
| Inference | KV-cache use | Not Implemented | No | Native generator recomputes context | None | No | Not active | None | Pro | Cache-aware generation |
| Inference | KV-cache optimization | Not Implemented | No | No optimization code found | None | No | Not active | None | Pro | Cache optimization |
| Inference | Speculative decoding | Not Implemented | No | No draft/target decoding found | None | No | Not active | None | Pro | Spec decoding |
| Inference | Continuous batching | Not Implemented | No | No serving scheduler found | None | No | Not active | None | Pro | Continuous batching engine |
| Inference | External-model inference | Partially Implemented | `load_any_model`, `predict_external` | `inference/external.py` | loader tests; no real HF runtime | CPU native tested indirectly | examples/docs | Transformers/PEFT optional | Shared Core | Real local HF tests |
| Inference | CPU inference | Implemented | `device="cpu"` | engine/external | tests on CPU | CPU pytest passed | README | Torch | Community | None |
| Inference | GPU inference | Partially Implemented | `device`, `device_map` | engine/external | no CUDA tests | No | Sparse | CUDA/Transformers | Pro | GPU runtime tests |
| Optimization and Export | INT8 quantization | Experimental | `load_in_8bit` external config | `ExternalModelConfig` passes flags to HF | No tests | No | Sparse | Transformers/bitsandbytes | Pro | Real quant tests |
| Optimization and Export | INT4 quantization | Experimental | `load_in_4bit` external config | external config/HF kwargs | No tests | No | Sparse | Transformers/bitsandbytes | Pro | QLoRA/quant runtime |
| Optimization and Export | Weight-only quantization | Not Implemented | No | No weight-only quantizer found | None | No | Not active | None | Pro | Quantizer/export |
| Optimization and Export | Pruning | Not Implemented | No | No pruning code found | None | No | Not active | None | Pro | Pruning API |
| Optimization and Export | Knowledge distillation | Not Implemented | No | No distillation workflow found | None | No | Not active | None | Pro | Teacher/student training |
| Optimization and Export | Flash Attention | Not Implemented | No | No Flash Attention integration | None | No | Not active | Optional | Pro | Attention backend |
| Optimization and Export | xFormers support | Not Implemented | No | No xFormers integration | None | No | Not active | xformers | Pro | Backend integration |
| Optimization and Export | `torch.compile` | Not Implemented | No | No compile path found | None | No | Not active | Torch | Pro | Compile option/tests |
| Optimization and Export | ONNX export | Not Implemented | No | No ONNX exporter found | None | No | Not active | onnx | Pro | Exporter and artifact tests |
| Optimization and Export | TensorRT export | Not Implemented | No | No TensorRT exporter found | None | No | Not active | TensorRT | Pro | Exporter |
| Optimization and Export | GGUF export | Not Implemented | No | No GGUF exporter found | None | No | Not active | gguf tools | Pro | Exporter |
| Optimization and Export | Model-size reporting | Partially Implemented | `ArcLM.get_num_parameters`, source info | model and inspector | limited tests | CPU pytest passed | sparse | None | Community | Public report API |
| Optimization and Export | Memory optimization | Not Implemented | No | No memory optimizer found | None | No | Not active | None | Pro | Memory strategy |
| Optimization and Export | Inference-speed optimization | Not Implemented | No | No speed optimizer found | None | No | Not active | None | Pro | Profiling/optimization |
| Deployment | Docker generation | Not Implemented | No | No Docker generator found | None | No | Not active | Docker | Pro | Templates/generator |
| Deployment | Dockerfile templates | Not Implemented | No | No Dockerfile found | None | No | Not active | Docker | Pro | Dockerfile |
| Deployment | Docker Compose | Not Implemented | No | No compose file found | None | No | Not active | Docker | Pro | Compose template |
| Deployment | Kubernetes manifests | Not Implemented | No | No k8s manifests found | None | No | Roadmap only | Kubernetes | Pro | Manifests |
| Deployment | Helm charts | Not Implemented | No | No chart found | None | No | Not active | Helm | Pro | Chart |
| Deployment | Hugging Face deployment | Not Implemented | No | HF loading/saving only, no deploy automation | None | No | examples only | HF Hub optional | Pro | Push/deploy workflow |
| Deployment | AWS deployment | Not Implemented | No | No AWS code found | None | No | Not active | AWS SDK | Pro | Deployment automation |
| Deployment | Azure deployment | Not Implemented | No | No Azure code found | None | No | Not active | Azure SDK | Pro | Deployment automation |
| Deployment | GCP deployment | Not Implemented | No | No GCP code found | None | No | Not active | GCP SDK | Pro | Deployment automation |
| Deployment | RunPod deployment | Not Implemented | No | No RunPod code found | None | No | Not active | RunPod | Pro | Deployment automation |
| Deployment | Modal deployment | Not Implemented | No | No Modal code found | None | No | Not active | Modal | Pro | Deployment automation |
| Deployment | Local server deployment | Experimental | `run_simple_interface` | Flask app | import/helper tests only | No server run | README | Flask | Pro | Server tests/package docs |
| Deployment | Health checks | Experimental | `/health` route | `simple_interface.py` | no endpoint tests | No | Sparse | Flask | Pro | Health-check runtime tests |
| Deployment | Environment configuration | Partially Implemented | env vars in simple interface | `simple_interface.default_load_options` | no direct tests | No | Sparse | Flask | Pro | Documented env schema |
| Deployment | Secret handling | Not Implemented | No | No secret manager found | None | No | Not active | None | Pro | Secret handling |
| Evaluation | Basic evaluator | Implemented | `Evaluator`, `evaluate` | `evaluation/evaluator.py` | unit/smoke | CPU pytest passed | docs/evaluation | Torch | Community | More output contracts |
| Evaluation | Base metric | Implemented | `BaseMetric` | `evaluation/base.py` | base tests | CPU pytest passed | docs | None | Community | None |
| Evaluation | Base evaluator | Implemented | `BaseEvaluator` | `evaluation/base.py` | base tests | CPU pytest passed | docs | None | Community | None |
| Evaluation | Evaluation config | Implemented | `EvaluationConfig` | `evaluation/config.py` | config tests | CPU pytest passed | docs | None | Community | None |
| Evaluation | Evaluation result | Implemented | `EvaluationResult` | `evaluation/result.py` | result tests | CPU pytest passed | docs | None | Community | None |
| Evaluation | Validation loss | Implemented | `LossMetric` | `evaluation/metrics.py` | metrics/evaluator tests | CPU pytest passed | docs | Torch | Community | None |
| Evaluation | Perplexity | Implemented | `Perplexity` | `evaluation/metrics.py` | metrics tests | CPU pytest passed | docs | None | Community | None |
| Evaluation | Classification accuracy | Implemented | `Accuracy` | `evaluation/metrics.py` | metrics tests | CPU pytest passed | docs | Torch | Community | More task workflows |
| Evaluation | Token accuracy | Implemented | `Accuracy(ignore_index)` | metrics | metrics tests | CPU pytest passed | docs | Torch | Community | None |
| Evaluation | Custom metrics | Implemented | `BaseMetric` | evaluator update signature | evaluator tests | CPU pytest passed | docs | None | Community | None |
| Evaluation | Evaluation callbacks | Implemented | `BaseEvaluationCallback` | `evaluation/callbacks.py` | evaluator tests | CPU pytest passed | docs | None | Community | None |
| Evaluation | Trainer integration | Implemented | `Trainer.evaluate()` | training/evaluation integration | unit tests | CPU pytest passed | docs | Torch | Community | None |
| Evaluation | Benchmark suite | Not Implemented | No stable suite | only small concept diagnostics | None | No | Roadmap later | None | Pro | Benchmark framework |
| Evaluation | MMLU | Not Implemented | No | No MMLU code found | None | No | Roadmap later | datasets optional | Pro | Dataset/tasks |
| Evaluation | GSM8K | Not Implemented | No | No GSM8K code found | None | No | Roadmap later | datasets optional | Pro | Dataset/tasks |
| Evaluation | Human evaluation tools | Not Implemented | No | No annotation/eval UI found | None | No | Not active | None | Pro | Human eval workflow |
| Evaluation | Custom benchmark framework | Partially Implemented | concept diagnostics | `evaluation/diagnostics.py` | limited tests | CPU pytest passed indirectly | diagnostics examples | None | Pro | General benchmark API |
| Evaluation | LLM-as-a-judge | Not Implemented | No | No judge model/provider code found | None | No | Not active | provider optional | Pro | Judge adapters |
| Evaluation | Accuracy dashboards | Not Implemented | No | No dashboard found | None | No | Roadmap later | Web deps | Pro | UI |
| Evaluation | Model comparison | Not Implemented | No | Example benchmark script only | None | No | example only | None | Pro | Comparison framework |
| Evaluation | Evaluation reports | Partially Implemented | `export_metrics_to_json/md` | diagnostics exporters | compatibility/public tests | CPU pytest passed | docs partial | None | Community | New evaluator report docs |
| Evaluation | External benchmark downloads | Not Implemented | No | No downloaders found | None | No | Roadmap later | datasets/network | Pro | Download/cache layer |
| Evaluation | Distributed evaluation | Not Implemented | No | No distributed evaluator found | None | No | Roadmap later | Torch distributed | Pro | Distributed eval |
| Monitoring | Training metrics | Implemented | state/history/logger | Trainer state/lists/logger | training tests | CPU pytest passed | training docs | None | Community | More metric registry |
| Monitoring | Evaluation metrics | Implemented | `EvaluationResult.metrics` | evaluation core | evaluation tests | CPU pytest passed | evaluation docs | None | Community | None |
| Monitoring | GPU monitoring | Partially Implemented | utility only | `utils/formatting.py` mentions GPU memory | No direct tests | No CUDA | Sparse | CUDA | Pro | Integrated monitor |
| Monitoring | VRAM monitoring | Partially Implemented | utility only | peak GPU formatting helper | No direct tests | No CUDA | Sparse | CUDA | Pro | Runtime collection |
| Monitoring | CPU monitoring | Not Implemented | No | No CPU monitor found | None | No | Not active | psutil optional | Pro | CPU metrics |
| Monitoring | RAM monitoring | Not Implemented | No | No RAM monitor found | None | No | Not active | psutil optional | Pro | RAM metrics |
| Monitoring | Training speed | Partially Implemented | console/log fields | Trainer prints batches/sec/ETA | indirect | CPU pytest passed | sparse | None | Community | Structured speed metrics |
| Monitoring | Samples per second | Not Implemented | No | No sample/sec metric found | None | No | Not active | None | Pro | Metric |
| Monitoring | Tokens per second | Partially Implemented | formatting helper | `utils/formatting.py` | no direct tests | No | sparse | None | Pro | Integrated generation metrics |
| Monitoring | Cost estimation | Not Implemented | No | No cost code found | None | No | Not active | None | Pro | Cost model |
| Monitoring | Memory profiling | Not Implemented | No | No profiler found | None | No | Not active | None | Pro | Profiler |
| Monitoring | Performance profiling | Not Implemented | No | No profiler found | None | No | Not active | None | Pro | Profiler |
| Monitoring | Callback-based monitoring | Implemented | training/eval callbacks | callback APIs | tests | CPU pytest passed | docs | None | Community | More events |
| Monitoring | Experiment logs | Partially Implemented | `metrics_log_path`, `AsyncTrainingLogger` | training logger | external_engine test writes metrics | CPU pytest passed | sparse | None | Community | Docs and retention |
| Monitoring | External tracking integrations | Experimental | `ExperimentTracker(backend=mlflow/wandb)` | `src/arclm/tracking.py` | No tests | No | sparse | mlflow/wandb | Pro | Tests/optional deps |
| Monitoring | Dashboard event support | Not Implemented | No | No dashboard event bus found | None | No | Roadmap later | Web deps | Pro | Event system |
| Developer Experience | Public Python API | Implemented | domain imports/root lazy exports | `src/arclm/__init__.py` | public_api tests/import checks | CPU pytest passed | public-api docs | None | Community | Resolve duplicate names |
| Developer Experience | CLI | Partially Implemented | `python -m arclm` | `src/arclm/cli.py` | help command run | Help only | README | Torch | Community | Runtime subcommand tests/fixes |
| Developer Experience | CLI training | Partially Implemented | `arclm train` | CLI train command | No current test | No | README | Torch | Community | Update stale data calls |
| Developer Experience | CLI evaluation | Partially Implemented | `arclm eval` | CLI eval command | No current test | No | README | Torch | Community | Runtime tests |
| Developer Experience | CLI inference | Partially Implemented | `arclm generate` | CLI generate command | No current test | No | README | Torch | Community | Runtime tests |
| Developer Experience | CLI export | Not Implemented | No | No export subcommand found | None | No | Not active | None | Pro | Export CLI |
| Developer Experience | Web UI | Experimental | simple interface | Flask app/templates | helper import tests | Not health-checked | README | Flask | Pro | Endpoint tests |
| Developer Experience | Visual training dashboard | Not Implemented | No | No training dashboard found | None | No | Roadmap later | Web deps | Pro | Dashboard |
| Developer Experience | Model registry | Partially Implemented | `Registry`, `AutoModel` | registry base + AutoModel | public registry test | CPU pytest passed | sparse | None | Community | Model registry wiring |
| Developer Experience | Dataset registry | Not Implemented | No | No dataset registry found | None | No | Not active | None | Community | Registry |
| Developer Experience | Plugin system | Interface Only | `PluginProtocol` | `plugins/interfaces.py` | none | No | sparse | None | Community | Discovery/loading |
| Developer Experience | Plugin discovery | Not Implemented | No | No plugin discovery found | None | No | Not active | None | Pro | Discovery |
| Developer Experience | Extension marketplace | Not Implemented | No | No marketplace code found | None | No | Not active | None | Pro | Marketplace |
| Developer Experience | Project templates | Not Implemented | No | No template generator found | None | No | examples only | None | Community | Scaffold command |
| Developer Experience | Example projects | Partially Implemented | examples folder | `examples/` | not all tested | No | examples README | Optional deps | Community | Keep examples current |
| Developer Experience | Configuration files | Implemented | `load_config`, `save_config` | `configs/serialization.py` | public/config tests limited | Import/runtime indirect | docs | PyYAML for YAML | Community | More config tests |
| Developer Experience | YAML config support | Implemented | `load_config_yaml` | serialization | PyYAML installed | Import available | docs | PyYAML | Community | Dedicated tests |
| Developer Experience | JSON config support | Implemented | `load_config_json` | serialization | tests limited | Import/runtime indirect | docs | None | Community | Dedicated tests |
| Developer Experience | Documentation | Partially Implemented | docs folder | `docs/` | not tested | N/A | present | None | Community | Accuracy updates |
| Developer Experience | Migration guides | Implemented | docs/migration | `docs/migration/package-restructure.md` | N/A | N/A | present | None | Community | Keep current |
| Developer Experience | Type hints | Partially Implemented | `py.typed` | many annotations, dynamic `Any` | compileall | CPU compile passed | packaging | None | Community | Type checking |
| Developer Experience | `py.typed` | Implemented | package data | `src/arclm/py.typed`, pyproject | compileall | yes | packaging | None | Community | Type quality |
| Developer Experience | Error messages | Partially Implemented | exception hierarchy | `exceptions/base.py` | many tests | CPU pytest passed | sparse | None | Community | Consistency pass |
| Developer Experience | Optional-dependency errors | Implemented | helpful errors | HF/PEFT/Flask/PyYAML imports | tests limited | Import checks | docs | optional deps | Community | More tests |
| Enterprise | User authentication | Not Implemented | No | No auth code found | None | No | roadmap later | None | Pro | Auth system |
| Enterprise | Team workspaces | Not Implemented | No | No workspace code found | None | No | not active | None | Pro | Workspace model |
| Enterprise | Role-based permissions | Not Implemented | No | No RBAC code found | None | No | not active | None | Pro | Permissions |
| Enterprise | Audit logs | Not Implemented | No | No audit-log system found | None | No | not active | None | Pro | Audit log |
| Enterprise | API keys | Not Implemented | No | No API key system found | None | No | not active | None | Pro | API auth |
| Enterprise | Billing | Not Implemented | No | No billing code found | None | No | roadmap later | None | Pro | Billing |
| Enterprise | License management | Not Implemented | No | only logic examples mention license | logic tests only | No enterprise runtime | docs/logics example | None | Pro | License service |
| Enterprise | Usage tracking | Not Implemented | No | tracking is experiment logs, not usage metering | None | No | not active | None | Pro | Usage metering |
| Enterprise | Organization management | Not Implemented | No | No org code found | None | No | not active | None | Pro | Org model |
| Enterprise | Project isolation | Not Implemented | No | No isolation system found | None | No | not active | None | Pro | Isolation/security |
| Enterprise | Secret management | Not Implemented | No | No secret manager found | None | No | not active | None | Pro | Secrets |
| Enterprise | Enterprise server | Not Implemented | No | only simple Flask UI | None | No | roadmap later | Web deps | Pro | Enterprise backend |
| Enterprise | Pro license checks | Not Implemented | No | no pro license enforcement | None | No | roadmap later | None | Pro | License checks |
