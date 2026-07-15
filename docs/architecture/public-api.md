# Publieke API

Gebruik bij nieuwe code vooral domain imports. Dat houdt imports duidelijk en voorkomt dat de root package te groot wordt.

## Configs

```python
from arclm.configs import Config, create_config, load_config
```

## Modellen

```python
from arclm.models import ArcLM, AutoModel, MiniGPT
```

## Tokenizers

```python
from arclm.tokenizers import AutoTokenizer, SentencePieceTokenizer, Tokenizer
```

## Datasets

```python
from arclm.datasets import (
    BaseDataStep,
    BaseDataset,
    DataPipeline,
    DatasetLoader,
    ExactDeduplicator,
    StreamingDataset,
    load_dataset,
)
```

Speciale cleaning stappen:

```python
from arclm.datasets.cleaning import NormalizeWhitespace, RemoveEmptyText, StripText
```

## Training

```python
from arclm.training import (
    BaseCallback,
    BaseTrainer,
    Trainer,
    TrainingConfig,
    TrainingResult,
    TrainingState,
    build_model,
    build_trainer,
    train_model,
)
```

`arclm.training.TrainingConfig` is de aanbevolen configuratie voor de nieuwe
training core. Deze class is niet hetzelfde als `arclm.configs.TrainingConfig`.

## Fine-Tuning

```python
from arclm.finetuning import (
    FullFineTuner,
    ModelAdapter,
    SFTConfig,
    SFTDataCollator,
    SFTTrainer,
    SFTTrainingResult,
    TokenizerAdapter,
    train_sft,
)
```

Nieuwe code gebruikt `FullFineTuner` of `SFTTrainer`. `train_sft` blijft
bestaan voor compatibiliteit met de oudere Hugging Face SFT helper.

`arclm.finetuning.ModelAdapter` is de aanbevolen adapter voor SFT en
fine-tuning. `arclm.training.ModelAdapter` hoort bij de oudere unified training
helpers en blijft bestaan voor compatibiliteit.

## Inference

```python
from arclm.inference import TextGenerator, load_model, load_any_model, predict
```

## Evaluatie

```python
from arclm.evaluation import (
    Accuracy,
    BaseEvaluator,
    BaseMetric,
    EvaluationConfig,
    EvaluationResult,
    Evaluator,
    MetricsReport,
    Perplexity,
    calculate_metrics,
    calculate_perplexity,
    evaluate,
)
```

## Logic Hulpmiddelen

```python
from arclm.logics import KnowledgeBase, Symbol, create_symbols, model_check
```

## Checkpoints

```python
from arclm.checkpoints import SmartLoader, LoadedCheckpoint, load_external_model
```

## Compatibility Imports

Oude flat imports blijven voorlopig bestaan met deprecation warnings waar dat kan:

- `arclm.config`
- `arclm.config_loader`
- `arclm.model`
- `arclm.tokenizer`
- `arclm.dataset`
- `arclm.data`
- `arclm.data_processor`
- `arclm.instruction_dataset`
- `arclm.trainer`
- `arclm.pipeline`
- `arclm.regularization`
- `arclm.logging`
- `arclm.generator`
- `arclm.external_inference`
- `arclm.diagnostics`
- `arclm.sft`
- `arclm.loaders`

Gebruik deze oude paden alleen voor bestaande code. Nieuwe code moet de domain packages gebruiken.

## Dubbele Namen

Sommige namen bestaan bewust op meer dan een plek. Dat is zo gehouden om oude
code niet te breken.

| Naam | Aanbevolen API | Legacy/API met ander gedrag | Zelfde implementatie? | Migratie |
| --- | --- | --- | --- | --- |
| `TrainingConfig` | `from arclm.training import TrainingConfig` | `from arclm.configs import TrainingConfig` en `from arclm import TrainingConfig` wijzen naar de brede `Config` alias | Nee | Gebruik de training-core config voor `Trainer`; gebruik `Config` voor oude pipeline helpers |
| `ModelAdapter` | `from arclm.finetuning import ModelAdapter` voor SFT | `from arclm.training import ModelAdapter` hoort bij de oudere unified pipeline | Nee | Gebruik de adapter uit het domain waarin je werkt |
| `train_sft` | `from arclm.finetuning import train_sft` | `from arclm.sft import train_sft` | Ja, via compatibility shim | Nieuwe code gebruikt `arclm.finetuning` |
| `Trainer` | `from arclm.training import Trainer` | `from arclm.trainer import Trainer` | Ja, via compatibility shim | Nieuwe code gebruikt `arclm.training` |
