# Missing Features

## Missing Implementation

- Distributed training
- DDP
- FSDP
- Multi-GPU orchestration
- DeepSpeed-style integration
- Hyperparameter search
- Curriculum learning
- QLoRA
- Prefix tuning, prompt tuning, IA3 and other PEFT methods
- RLHF
- DPO
- GRPO
- Reward model training
- Native LLaMA, Mistral, BERT, T5, encoder-decoder, vision and multimodal architectures
- WebDataset support
- Dataset versioning
- Synthetic data generation implementations
- Streaming generation
- OpenAI-compatible serving API
- Dynamic batching and continuous batching
- KV-cache optimization
- Speculative decoding
- ONNX, TensorRT and GGUF export
- Pruning
- Knowledge distillation
- Flash Attention and xFormers integration
- `torch.compile` integration
- Docker, Docker Compose, Kubernetes and Helm deployment
- Cloud deployment automation
- Production model serving
- Large benchmark suites such as MMLU and GSM8K
- LLM-as-a-judge
- Evaluation dashboards and model comparison dashboards
- CPU/RAM monitoring
- Cost estimation
- Memory/performance profiling
- Plugin discovery and marketplace
- Enterprise authentication, RBAC, billing, license checks and audit logs
- Most task-specific NLP workflows beyond causal language modeling/text generation

## Partial Implementation

- Mixed precision: core code exists, but CUDA FP16/BF16 runtime validation was skipped in the CPU audit environment.
- Hugging Face support: optional loading and SFT helper exist, but standard tests use fake/local contracts rather than real HF models.
- External model support: strong for SFT adapters, partial for general training/inference.
- Chat templates: fake tokenizer template tested; real HF template coverage is still missing.
- Token analysis: helper functions exist, but no integrated token-analysis product.
- Dataset statistics: old preprocess stats exist, but the new dataset API lacks full stats reports.
- Approximate deduplication: SimHash exists in the old preprocess pipeline, but it is not a stable dataset API feature.
- CLI: help works, but train/eval/generate runtime paths are not current-test verified.
- Simple Flask UI: routes exist, but server health and endpoint behavior are not runtime-tested.
- External model save/export: code exists, but valid artifact production is not broadly tested.
- Experiment tracking: local/mlflow/wandb code exists, but no current tests.

## Missing Tests

- Real Hugging Face local model load/generate test
- PEFT/LoRA training test
- LoRA adapter load/save test
- CLI train/eval/generate end-to-end tests
- Flask endpoint tests, including `/health`
- ExperimentTracker tests
- ONNX/TensorRT/GGUF export tests once exporters exist
- Approximate deduplication tests
- Dataset statistics tests for the new data API
- Batch inference tests
- Greedy decoding tests
- Tokenizer batch API tests
- Real chat-template tests
- GPU/CUDA runtime tests

## Missing Runtime Validation

- CUDA FP16
- CUDA BF16
- GPU inference
- Hugging Face full model loading
- PEFT LoRA training and adapter inference
- Quantized loading with `load_in_8bit` or `load_in_4bit`
- Simple web interface server startup and health check
- External save/export artifact reload
- CLI subcommands beyond help

## Missing Documentation

- Current CLI limitations
- Experiment tracking API
- External save/export artifact guarantees
- Quantization status
- Exact distinction between legacy `train_sft` and new `SFTTrainer`
- Token analysis limitations
- Dataset statistics limitations
- Production serving limitations

## Missing Compatibility

- Stable migration story from legacy HF `train_sft` to new `SFTTrainer`
- Clear namespace guidance for `arclm.training.ModelAdapter` versus `arclm.finetuning.ModelAdapter`
- Long-term plan for deprecated `arclm.sft`, `arclm.loaders`, `arclm.pipeline`, `arclm.trainer`

## Missing External-Model Support

- Non-PyTorch models
- Encoder-only external task workflows
- Encoder-decoder external training/evaluation
- Vision/multimodal external models
- Real model-family compatibility matrix
- Adapter save/load contract tests

## Missing CPU Support

- Most implemented Community features work on CPU.
- Missing CPU support is mainly for features not implemented at all, such as export tooling and task-specific NLP workflows.
- Some external/HF workflows may work on CPU but were not runtime-verified with real models.

## Missing CUDA Support

- CUDA mixed precision runtime validation
- CUDA training smoke tests
- CUDA inference smoke tests
- CUDA memory/VRAM monitoring
- Quantized model loading runtime tests
- Multi-GPU/distributed training
