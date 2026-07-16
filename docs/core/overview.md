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
Core Milestone 2 / Feature 2 adds built-in LoRA and adapter artifacts.

ArcLM is strongest as a local PyTorch framework for datasets, single-device
training, checkpoints, basic evaluation, full fine-tuning/SFT, built-in CPU
LoRA, final model artifacts, PEFT adapter artifacts, and native causal-LM
inference.

The next recommended Core feature is Core Milestone 2 / Feature 3: QLoRA and
Quantized Fine-Tuning Foundation. It is not approved automatically.

Use [current-capabilities.md](current-capabilities.md) as the canonical Core
matrix.
