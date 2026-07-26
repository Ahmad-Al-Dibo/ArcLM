# ArcLM Examples

This directory contains the maintained numbered ArcLM examples suite. It is
designed for local, CPU-first verification: no example in the verified runner
requires network access, automatic model downloads, a GPU, or remote services.

The older unnumbered folders remain in place as preserved historical examples.
Use the numbered folders and `manifest.json` as the source of truth for the
current suite.

## Run

Install ArcLM for local development first:

```bash
pip install -e ".[dev,security]"
```

Then run examples directly:

```bash
python examples/00_quick_start/01_first_arclm_workflow.py
python examples/12_complete_projects/01_local_language_model/main.py
```

Or use the suite runner:

```bash
python examples/run_examples.py list
python examples/run_examples.py run 00-01
python examples/run_examples.py run-category data
python examples/run_examples.py run-verified
python examples/run_examples.py status
```

## Categories

| Folder | Purpose |
| --- | --- |
| `00_quick_start` | First native dataset-tokenizer-model-inspection workflows. |
| `01_data` | Local JSONL and HTML fixtures, validation, manifests, reports. |
| `02_tokenizers` | Word tokenizer and SentencePiece BPE examples. |
| `03_models` | Tiny native model construction and state-dict loading. |
| `04_training` | CPU-friendly one-step pretraining. |
| `05_finetuning` | SFT validation and one tiny supervised step. |
| `06_checkpoints` | Native checkpoint lifecycle. |
| `07_evaluation_benchmarks` | Perplexity, accuracy, and top-k diagnostics. |
| `08_inference_local_models` | Local generation and external-model loading policy. |
| `09_pipelines_inspection` | Composed data pipeline and tensor inspection. |
| `10_agents_tools` | Deterministic local agents, tools, documents, fake audio. |
| `11_security` | Security Core status, encryption, hashing, signing, redaction. |
| `12_complete_projects` | Six small end-to-end projects. |

## Status Rules

`verified` examples are run by `run-verified`. `verified_with_fake_backend`
examples are also run, but they intentionally use deterministic fake providers
instead of real external services. `manual_optional` entries document supported
boundaries that require a local model, GPU, or optional dependency and are not
part of the default run.

All runnable examples keep generated artifacts in temporary directories unless
their README states otherwise.
