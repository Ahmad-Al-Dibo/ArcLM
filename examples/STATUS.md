# ArcLM Examples Status

Last verified: 2026-07-26 on CPU with the local repository environment.

| Status | Count | Meaning |
| --- | ---: | --- |
| `verified` | 27 | Runnable locally by `examples/run_examples.py run-verified`. |
| `verified_with_fake_backend` | 1 | Runnable locally with a deterministic fake backend. |
| `manual_optional` | 3 | Documented boundary requiring a local model, GPU, or optional provider. |

## Verified Coverage

The verified set covers local data loading, dataset validation, dataset
manifests, tokenizers, native model creation, a training step, SFT preparation,
checkpoint save/load, evaluation metrics, local generation, pipeline
inspection, agent tools, Security Core primitives, and six complete projects.

## Optional Boundaries

Manual optional entries intentionally avoid automatic downloads and remote
network calls:

- `05-03`: PEFT/QLoRA adapter training with local model assets and suitable hardware.
- `08-03`: real external Hugging Face local-model loading.
- `10-04`: real Whisper speech-to-text backend with a local model.

Use `examples/manifest.json` for machine-readable status and requirements.
