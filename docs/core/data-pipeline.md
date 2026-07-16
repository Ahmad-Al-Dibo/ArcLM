# Python Data Pipeline Audit

The Python Core data pipeline is separate from the paused Web Data Pipeline
Studio.

Implemented Core behavior:

- file loading for JSON, JSONL, CSV, TXT
- Python-list loading
- `TextDataset`
- `InstructionDataset`
- `DataPipeline`
- custom callable and `BaseDataStep` steps
- text cleaning steps
- exact deduplication
- streaming dataset basics
- SFT formatting and packing support through fine-tuning modules

Evidence:

- Implementation: `src/arclm/datasets`, `src/arclm/preprocess`
- Tests: `tests/unit/datasets`, fine-tuning tests

Limitations:

- Dataset manifests and versioning are not implemented.
- Provenance tracking is partial.
- Hugging Face Datasets integration is not implemented.
- Approximate deduplication and rich statistics are partial/preprocess-only.
- The Web Dataset Source Manager is paused with the Web track and should not be
  extended during Core work.

## Fine-Tuning Dataset Preparation

Core Milestone 2 / Feature 1 adds a Python-only fine-tuning preparation layer in
`arclm.finetuning`.

It supports:

- plain text
- prompt/completion
- instruction/input/response
- chat messages
- deterministic tokenized features
- bounded validation reports
- safe dataset fingerprints

This is separate from the paused Web Data Pipeline Studio. It does not implement
dataset upload, manifests, versioning, or visual pipeline execution.
