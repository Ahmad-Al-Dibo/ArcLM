# Fine-Tuning Overview

ArcLM ondersteunt nu een kleine basis voor full fine-tuning en supervised
fine-tuning. Deze laag bereidt data, tokenization en labels voor en gebruikt
daarna de bestaande Training Core.

Geïmplementeerd:

- `FullFineTuner`
- `SFTTrainer`
- `SFTConfig`
- `ModelAdapter`
- `TokenizerAdapter`
- `SFTDataCollator`
- plain text, instruction, prompt-response en chat data
- assistant-only loss masking
- padding, truncation en eenvoudige sequence packing
- evaluatie via `Trainer.evaluate()`
- checkpoints en resume via de bestaande `Trainer`

Nog niet geïmplementeerd:

- LoRA, QLoRA en PEFT
- DPO, GRPO, RLHF en reward models
- distributed fine-tuning
- dashboards, cloud training en benchmark suites
