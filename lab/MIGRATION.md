# ArcLM Lab Migration Record

The original Lab contained 12 flat exercise files. Their useful concepts were
preserved in the new progressive challenge tree.

| Old path | Classification | New path(s) | Reason |
| -------- | -------------- | ----------- | ------ |
| `lab/beginner/01_data_basics.py` | Split and expand | `beginner/01_data_loading`, `beginner/02_text_cleaning`, `beginner/03_dataset_validation`, `beginner/08_beginner_capstone` | The original mixed loading, cleaning, splitting, and dataset wrapper tasks. These now become smaller prerequisite challenges plus the Dataset Inspector capstone. |
| `lab/beginner/02_model_basics.py` | Split and expand | `beginner/04_vocabulary`, `beginner/05_word_tokenizer`, `intermediate/04_model_configuration` | Vocabulary and tiny model concepts now have separate contracts. |
| `lab/beginner/03_training_basics.py` | Split and expand | `beginner/07_training_counters`, `intermediate/06_training_loop` | Counter behavior is beginner-level; training loop behavior is intermediate-level. |
| `lab/intermediate/01_data_pipeline.py` | Split and expand | `intermediate/01_dataset_manifest`, `intermediate/02_preprocessing_pipeline` | Statistics and ordered pipeline behavior now have distinct tests and metadata. |
| `lab/intermediate/02_model_lifecycle.py` | Split and expand | `intermediate/03_tokenizer_persistence`, `intermediate/04_model_configuration`, `intermediate/07_checkpoint_lifecycle` | Persistence and lifecycle boundaries are now explicit. |
| `lab/intermediate/03_training_loop.py` | Move and expand | `intermediate/06_training_loop`, `intermediate/08_intermediate_capstone` | The tiny loop becomes a focused challenge and feeds the Workbench capstone. |
| `lab/advanced/01_artifacts_and_checkpoints.py` | Split and expand | `advanced/01_artifacts_and_tracking`, `intermediate/07_checkpoint_lifecycle` | Checkpoint lifecycle and artifact metadata are separate concepts. |
| `lab/advanced/02_finetuning_and_peft.py` | Split and expand | `advanced/02_finetuning_formatting`, `advanced/03_sft_dataset_preparation`, `advanced/04_peft_and_lora` | Fine-tuning formatting, SFT labels, and PEFT/LoRA boundaries now have separate challenge contracts. |
| `lab/advanced/03_evaluation_inference.py` | Split and expand | `advanced/05_evaluation`, `advanced/06_inference_and_generation`, `advanced/07_pipeline_inspection` | Evaluation, bounded generation, and transparent inspection are distinct skills. |
| `lab/expert/01_distributed_runtime.py` | Split and expand | `expert/03_distributed_runtime`, `expert/04_ddp_planning` | Runtime planning and DDP partitioning are separate simulations. |
| `lab/expert/02_fsdp_checkpoint_policy.py` | Move and expand | `expert/05_fsdp_checkpoint_policy` | Preserved as a policy/simulation challenge without claiming multi-GPU validation. |
| `lab/expert/03_system_design.py` | Split and expand | `expert/01_registry_and_plugins`, `expert/02_events_and_dependency_injection`, `expert/07_architecture_decisions` | Architecture design tasks now cover registries, DI/events, and decision records. |

The original flat files remain in place for compatibility and historical
reference. The canonical progressive Lab is defined by `lab/manifest.json`.

The LoRA exercise is Lab-only scaffolding. It is not evidence that LoRA,
QLoRA, or every PEFT path is production-ready in Web Studio or ArcLM.
