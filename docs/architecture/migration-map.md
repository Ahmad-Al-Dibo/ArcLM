# Migratiekaart

Deze tabel laat zien waar oude modules nu logisch thuishoren.

| Oude module | Nieuwe plek | Nieuwe import |
| --- | --- | --- |
| `arclm/config.py` | `src/arclm/configs/` | `from arclm.configs import Config` |
| `arclm/config_loader.py` | `src/arclm/configs/serialization.py` | `from arclm.configs import load_config` |
| `arclm/model.py` | `src/arclm/models/` | `from arclm.models import ArcLM` |
| `arclm/tokenizer.py` | `src/arclm/tokenizers/` | `from arclm.tokenizers import Tokenizer` |
| `arclm/dataset.py` | `src/arclm/datasets/` | `from arclm.datasets import TextDataset` |
| `arclm/data.py` | `src/arclm/datasets/` | `from arclm.datasets import prepare_data` |
| `arclm/data_processor.py` | `src/arclm/datasets/processing.py` | `from arclm.datasets import DataProcessor` |
| `arclm/instruction_dataset.py` | `src/arclm/datasets/instruction.py` | `from arclm.datasets import InstructionDataset` |
| `arclm/trainer.py` | `src/arclm/training/` | `from arclm.training import Trainer` |
| `arclm/pipeline.py` | `src/arclm/training/pipeline.py` | `from arclm.training import train_model` |
| `arclm/sft.py` | `src/arclm/finetuning/` | `from arclm.finetuning import train_sft` |
| `arclm/external_inference.py` | `src/arclm/inference/` | `from arclm.inference import load_any_model` |
| `arclm/diagnostics.py` | `src/arclm/evaluation/` | `from arclm.evaluation import calculate_metrics` |

## Compatibility

De oude modules bestaan nog als shims. Ze importeren de nieuwe plek en geven waar mogelijk een deprecation warning.

Voor nieuwe code gebruik je altijd de nieuwe imports.
