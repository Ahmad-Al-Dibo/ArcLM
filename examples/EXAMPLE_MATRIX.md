# ArcLM Example Matrix

Run examples from the repository root unless a README says otherwise.

| Example | Difficulty | Task type | Hardware | Internet | Optional dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `01_quickstart.py` | Basic | Tiny native training | CPU | No | None | Runnable local example |
| `02_tokenization.py` | Basic | Native tokenizer usage | CPU | No | None | Runnable local example |
| `03_data_processing.py` | Basic | JSONL data processing | CPU | No | None | Runnable local example |
| `04_pretraining.py` | Intermediate | Continued native pretraining | CPU | No | None | Runnable local example |
| `05_continue_training.py` | Intermediate | Checkpoint resume | CPU | No | None | Runnable local example |
| `06_finetuning.py` | Intermediate | Native fine-tuning | CPU | No | None | Runnable local example |
| `07_native_sft.py` | Intermediate | Native SFT | CPU | No | None | Runnable local example |
| `08_huggingface_sft.py` | Advanced | Hugging Face SFT smoke | CPU/GPU optional | Usually yes | `transformers` | Optional runtime example |
| `09_lora_sft.py` | Advanced | Hugging Face LoRA SFT smoke | CPU/GPU optional | Usually yes | `transformers` | Optional runtime example |
| `10_preprocess_pipeline.py` | Intermediate | Text preprocessing | CPU | No | `arclm[preprocess]` helpers where used | Runnable local example |
| `11_inference.py` | Basic | Native inference | CPU | No | None | Runnable local example |
| `12_smart_loader.py` | Intermediate | Local model inspection/loading | CPU | No | None | Runnable local example |
| `13_diagnostics.py` | Intermediate | Evaluation diagnostics | CPU | No | None | Runnable local example |
| `14_custom_trainer.py` | Advanced | Custom trainer loss | CPU | No | None | Runnable local example |
| `15_custom_hf_sft_loop.py` | Advanced | Custom Hugging Face SFT loop | CPU/GPU optional | Usually yes | `transformers` | Optional runtime example |
| `16_ai_knowledge_base.py` | Basic | Logic/knowledge-base demo | CPU | No | None | Runnable local example |
| `17_multiprocessing_launcher.py` | Advanced | Multiprocessing launcher | CPU | No | PyTorch distributed availability | Runnable local example |
| `18_single_gpu_distributed_smoke.py` | Advanced | Single-GPU distributed boundary | CPU/GPU optional | No | CUDA for GPU path | Optional GPU example |
| `19_external_multi_gpu_validation_matrix.py` | Expert | External multi-GPU validation planning | CPU | No | None | Planning/runtime-gate example |
| `20_ddp_cpu_trainer.py` | Expert | CPU DDP trainer smoke | CPU | No | PyTorch distributed availability | Runnable local example |
| `qwen3_0_6b_sft/` | Advanced | Qwen3 structured-output LoRA SFT | CUDA recommended | Yes for model download | `transformers`, optional PEFT/quantization stack | Customer workflow example |

## Requested Future Folder Layout

The repository still needs a dedicated folder-based example expansion:

```text
examples/
├── basic/
├── fine_tuning/
├── advanced/
└── huggingface/
```

That reorganization should be done as a focused examples milestone. The current
examples above are kept in place for backward compatibility.
