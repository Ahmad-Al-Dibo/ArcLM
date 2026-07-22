# ArcLM Speciale Versie

ArcLM is een compacte, native-first Python library voor taalmodellen. De kern is bedoeld om LLM-workflows begrijpelijk te maken: data laden, tekst tokenizen, een klein causal language model trainen, checkpoints bewaren, evalueren, fine-tunen en lokaal genereren.

Deze werkmap is een private/speciale editie voor onderzoek en ontwikkeling. De primaire gebruikers zijn studenten, beginnende onderzoekers en developers die willen begrijpen hoe een LLM-library werkt zonder een grote productstack eromheen.

## Wat Werkt Nu

- Dataset loading voor JSON, JSONL, CSV, TXT, Python lists en streaming-basis.
- Dataset cleaning, pipelines en exacte deduplicatie.
- Native GPT-achtige `ArcLM` modellen met PyTorch.
- Single-device training, checkpoints, resume, callbacks, schedulers en mixed-precision gates.
- Full fine-tuning en supervised fine-tuning.
- Basic lokale inference en evaluation metrics.
- LoRA/QLoRA foundations, tracking, search en distributed-runtime boundaries met duidelijke beperkingen.
- Een FastAPI lokale Web API en een optionele Next.js frontend foundation.

Gebruik bij voorkeur domain imports:

```python
from arclm.datasets import DataPipeline, load_dataset
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.training import Trainer, train_model
from arclm.finetuning import train_sft
from arclm.inference import load_model, predict
from arclm.checkpoints import SmartLoader
from arclm.evaluation import Evaluator
```

## Installatie

Voor lokaal ontwikkelen:

```bash
pip install -e .
```

Voor tests en builds:

```bash
pip install -e ".[dev]"
```

Optionele integraties blijven optioneel:

```bash
pip install -e ".[web]"
pip install -e ".[preprocess]"
pip install -e ".[hf]"
pip install -e ".[peft]"
pip install -e ".[qlora]"
```

## CLI

```bash
python -m arclm --help
python -m arclm train --help
python -m arclm eval --help
python -m arclm generate --help
python -m arclm web-api --help
```

The installed console entry point is also `arclm`.

## Niet Ondersteund Als Stabiele Feature

ArcLM claimt nu geen native LLaMA/Mistral/BERT/T5/MoE/vision/multimodal support, geen RLHF/DPO/GRPO, geen productie-serving, geen OpenAI-compatible API, geen GGUF/ONNX/TensorRT export, en geen volledig gevalideerde multi-GPU/FSDP/real bitsandbytes QLoRA runtime.

## Status

De compacte status- en API-tabel staat in [`docs/special-version.md`](docs/special-version.md). Gebruik die tabel als bron van waarheid voor stable, beta, experimental, deprecated, planned en unsupported gebieden.

## Testen

Gebruik de projectomgeving, niet system Python:

```bash
.venv-training-core\Scripts\python.exe -m pytest
.venv-training-core\Scripts\python.exe -m build
```

Deze speciale editie is private/niet-open-source. Deel de code of geavanceerde onderdelen niet publiek zonder toestemming van de projecteigenaar.
