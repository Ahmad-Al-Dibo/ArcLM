# ArcLM Core Overview

The Core track covers the Python framework: public APIs, configuration, models,
tokenizers, datasets, training, checkpoints, evaluation, fine-tuning, inference,
hardware validation, packaging, and dependency boundaries.

The Web track is paused after Web Milestone 2 / Feature 4. Web code remains
available, but new Web product features are not active until the owner
explicitly reactivates that track.

Core Milestone 1 completed the lifecycle foundation: model source metadata,
versioned/reproducible checkpoints, and final model artifacts. Core Milestone 2
/ Feature 1 stabilizes full fine-tuning and SFT on top of those contracts.
Core Milestone 2 / Feature 2 adds built-in LoRA and adapter artifacts. Core
Milestone 2 / Feature 3 adds the QLoRA configuration, optional bitsandbytes
backend boundary, capability inspection, and QLoRA adapter metadata. Core
Milestone 2 / Feature 4 adds the Hugging Face and QLoRA runtime validation
matrix. Core Milestone 2 / Feature 5 adds local experiment tracking and
reproducible run manifests. Core Milestone 2 / Feature 6 adds local
sequential hyperparameter search.

ArcLM is strongest as a local PyTorch framework for datasets, single-device
training, checkpoints, basic evaluation, full fine-tuning/SFT, built-in LoRA
on native and tiny Hugging Face models, QLoRA boundary/configuration, final
model artifacts, PEFT adapter artifacts, native causal-LM inference, and local
run manifests and search manifests.

The next recommended Core feature is Core Milestone 3 / Feature 2:
Distributed Config Validation. It is not approved automatically.

Use [current-capabilities.md](current-capabilities.md) as the canonical Core
matrix.

Search details:

- [hyperparameter-search.md](hyperparameter-search.md)
- [search-manifests.md](search-manifests.md)
