# Supervised Fine-Tuning

This page links the SFT-specific behavior to the canonical fine-tuning spec in
[fine-tuning.md](fine-tuning.md).

## Stable API

Use:

```python
from arclm.finetuning import (
    FineTuningConfig,
    FineTuningMode,
    fine_tune,
    prepare_fine_tuning_dataset,
)
```

Existing APIs remain supported:

```python
from arclm.finetuning import SFTConfig, FullFineTuner, SFTTrainer
```

The legacy compatibility import also remains available:

```python
from arclm.sft import train_sft
```

It emits the documented deprecation warning and points users to
`arclm.finetuning`.

## Default SFT Behavior

- Mode: `supervised_fine_tuning`
- Prompt loss: masked by default
- Chat loss: assistant text is trainable; system and user text are masked
- Empty response: rejected
- Unknown chat role: rejected
- Dataset reports: bounded and do not include raw text
- Final artifact: saved through `FineTuningResult.save_model_artifact()`

## Runtime Evidence

The native CPU SFT flow is verified by
`tests/smoke/test_finetuning_workflow.py`.

Optional Hugging Face and GPU runtime validation are pending separate
environments.

