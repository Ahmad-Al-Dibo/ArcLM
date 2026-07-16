# Core Dependency Audit

Current package metadata:

- Python: `>=3.9,<3.13`
- Required core: `torch>=2.1,<3`, `numpy>=1.24,<3`,
  `sentencepiece>=0.2,<0.3`
- Optional Web: Flask, FastAPI, Uvicorn
- Optional preprocess: BeautifulSoup, PyYAML, tqdm
- Optional HF/PEFT/QLoRA: transformers, accelerate, datasets, peft,
  bitsandbytes, safetensors

Current baseline environment:

| Dependency | Version or status | Classification |
| ---------- | ----------------- | -------------- |
| Python | `3.12.10` | Required core runtime |
| torch | `2.13.0+cpu` | Required core |
| numpy | Installed | Required core |
| sentencepiece | Installed | Required core tokenizer |
| Flask | Installed | Optional Web legacy |
| FastAPI | Installed through Web extra | Optional Web |
| Uvicorn | Installed through Web extra | Optional Web |
| transformers | Installed | Optional HF |
| safetensors | Installed | Optional artifact support |
| datasets | Not installed | Optional future HF datasets |
| accelerate | Not installed | Optional HF/distributed helper |
| peft | Not installed | Optional external PEFT automation |
| bitsandbytes | Not installed | Optional QLoRA 4-bit backend |

Recommendations:

- Do not upgrade dependencies during the audit.
- Decide whether Python 3.9 remains realistic before future dependency changes.
- Keep Web dependencies optional and out of `import arclm`.
- Add optional dependency matrix jobs before marking HF PEFT, export, tracking,
  or serving integrations stable.

## Model Artifact Dependencies

Core Milestone 1 / Feature 3 added no required dependencies.

- Native ArcLM artifact save/load uses required core dependencies only:
  PyTorch, NumPy transitively through the runtime, and the standard library.
- Word and SentencePiece tokenizer artifacts use existing tokenizer code.
- Hugging Face artifact save/load remains optional and uses Transformers only
  when a Hugging Face artifact is actually saved or loaded.
- Artifact inspection and validation do not import Transformers and do not
  initialize CUDA.

## Fine-Tuning Dependencies

Core Milestone 2 / Feature 1 adds no required dependency.

Core Milestone 2 / Feature 6 adds no dependency. Local search uses standard
library storage and existing ArcLM training, fine-tuning, PEFT, and tracking
APIs. External sweep providers remain uninstalled and deferred.

- Native full fine-tuning and SFT use PyTorch plus existing ArcLM tokenizer,
  trainer, evaluator, checkpoint, and lifecycle code.
- `import arclm` remains lightweight.
- Hugging Face SFT remains optional and uses Transformers only when the
  Hugging Face path is explicitly requested.
- Built-in ArcLM LoRA from Core Milestone 2 / Feature 2 uses PyTorch directly
  and adds no external `peft` dependency.
- QLoRA runtime uses the optional `arclm[qlora]` extra, which includes
  `torch>=2.4,<3`, Transformers, and bitsandbytes. The current validation
  verifies the QLoRA boundary and missing-bitsandbytes behavior, not real
  bitsandbytes training.
- Hugging Face runtime validation now uses local tiny fixtures with
  Transformers only. The external `peft` package remains optional future work.

See [runtime-validation-matrix.md](runtime-validation-matrix.md) for the exact
runtime evidence and pending gates.
