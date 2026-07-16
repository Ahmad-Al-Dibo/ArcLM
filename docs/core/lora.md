# LoRA

LoRA is the first stable PEFT method in ArcLM. It is implemented without making
the external `peft` package a required dependency.

## Configuration

```python
from arclm.peft import LoRAConfig

config = LoRAConfig(
    rank=2,
    alpha=4,
    dropout=0.0,
    target_modules=("query", "value"),
)
```

Fields:

| Field | Default | Meaning |
| ----- | ------- | ------- |
| `method` | `lora` | PEFT method identifier. |
| `rank` | `4` | Adapter rank. |
| `alpha` | `8.0` | Adapter scaling value. |
| `dropout` | `0.0` | Dropout before the LoRA A projection. |
| `target_modules` | `("query", "value")` | Module names to wrap. |
| `target_match` | `suffix` | One of `suffix`, `leaf`, or `full`. |
| `bias` | `none` | Bias adaptation is not implemented. |
| `init` | `kaiming_uniform` | A matrix init; B starts at zero. |
| `freeze_base_model` | `True` | Freeze base parameters by default. |

## Target Selection

`inspect_lora_targets(model, config)` returns a dry plan before the model is
mutated. Only `torch.nn.Linear` modules are eligible.

Supported matching:

- `leaf`: the final module-name segment must match.
- `full`: the full dotted module path must match.
- `suffix`: the full path may match the target or end with it.

If no targets match, ArcLM raises a controlled fine-tuning error.

## Runtime Behavior

`LoRALinear` keeps the original linear layer as `base` and adds trainable
`lora_a` and `lora_b` layers. The base layer is frozen by default. Initial LoRA
B weights are zero, so the first forward output matches the base layer.

`merge_lora(model)` adds adapter weights into the base weights in place.
`unmerge_lora(model)` reverses that operation. `merged_lora_model(model)` returns
a copied model with adapters merged and unloaded back to plain linear layers.

## Fine-Tuning

```python
result = fine_tune(
    model=model,
    tokenizer=tokenizer,
    train_dataset=records,
    peft_config=config,
)
```

The result exposes:

- `result.peft_config`
- `result.peft_result`
- `result.save_adapter_artifact(path)`
- `result.save_model_artifact(path, merge_adapter=True)`

## Adapter Save and Load

```python
from arclm.peft import save_adapter_artifact, load_adapter_artifact

save_adapter_artifact(model, "adapter", config=config)
load_adapter_artifact(clean_base_model, "adapter")
```

Loading checks the base-model structure fingerprint before injecting and loading
the adapter. It does not reconstruct the base model by itself.

## Verified Local Scope

Verified on CPU with a tiny native ArcLM model:

- adapter injection
- trainable-only parameter report
- checkpoint/resume with new objects
- adapter artifact save/load
- evaluation after merged final artifact reload
- inference after merged final artifact reload

Not verified in this feature:

- real Hugging Face PEFT runtime
- CUDA LoRA runtime
- QLoRA
- multi-GPU adapter training
- adapter merging for non-linear custom modules
