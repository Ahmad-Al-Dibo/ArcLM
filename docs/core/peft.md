# PEFT Foundation

Core Milestone 2 / Feature 2 adds a small ArcLM-owned PEFT foundation. The
first implemented method is LoRA. QLoRA, other adapter methods, distributed
PEFT, and external `peft` package automation are not part of this feature.

## Public API

```python
from arclm.peft import (
    PeftMethod,
    PeftConfig,
    LoRAConfig,
    LoRALinear,
    inspect_lora_targets,
    apply_lora,
    apply_peft,
    get_peft_parameter_report,
    save_adapter_artifact,
    inspect_adapter_artifact,
    validate_adapter_artifact,
    load_adapter_artifact,
)
```

`import arclm` remains lightweight and does not import `peft`, Transformers, or
CUDA runtime objects.

## Method Status

| Method | Status | Runtime evidence | Notes |
| ------ | ------ | ---------------- | ----- |
| `none` | Implemented | Config path only | No PEFT mutation. |
| `lora` | Implemented and verified | CPU native fine-tuning workflow | Built-in ArcLM LoRA, no external PEFT dependency. |
| QLoRA | Not implemented | None | Next recommended feature. |
| Other PEFT methods | Not implemented | None | Require separate approval. |

## Fine-Tuning Flow

```python
from arclm.finetuning import fine_tune
from arclm.peft import LoRAConfig

result = fine_tune(
    model=model,
    tokenizer=tokenizer,
    train_dataset=records,
    peft_config=LoRAConfig(rank=2, alpha=4),
)
```

The workflow remains:

```text
records
-> prepare_fine_tuning_dataset
-> apply PEFT to the runtime model
-> FullFineTuner
-> Trainer
-> checkpoint/evaluation/adapter artifact/final artifact
```

There is still one training loop: `Trainer`.

## Adapter Artifacts

PEFT adapter artifacts are separate from final model artifacts and training
checkpoints.

```text
adapter/
|-- manifest.json
`-- adapter/
    `-- adapter.pt
```

Format:

```text
artifact_format = "arclm-peft-adapter"
artifact_version = 1
```

The manifest records:

- adapter id
- method
- LoRA config
- adapted module paths
- base-model structure fingerprint
- parameter report
- payload file inventory with size and SHA-256 hash
- ArcLM, Python, and PyTorch versions

The adapter payload stores only LoRA tensors. It does not contain optimizer,
scheduler, scaler, RNG state, dataset contents, raw prompts, or executable
Python code.

## Checkpoint and Final Artifact Boundary

Training checkpoints continue to save the full runtime state needed for resume,
including LoRA wrappers, optimizer state, scheduler state, scaler state, and RNG
state.

Adapter artifacts save only trainable adapter weights for applying to a
compatible base model.

Final model artifacts save complete inference/evaluation weights. A LoRA model
must be explicitly merged before saving as a final model artifact:

```python
result.save_model_artifact(
    "outputs/final-model",
    config=model_config,
    merge_adapter=True,
)
```

Unmerged LoRA models are rejected by `FineTuningResult.save_model_artifact()` to
avoid writing native artifacts that cannot be reconstructed from native config
alone.

## Security

Adapter artifact loading treats the artifact directory as untrusted input.
Validation rejects:

- missing manifests
- unsupported format or future version
- absolute payload paths
- path traversal
- symlink payloads
- missing files
- size mismatch
- SHA-256 hash mismatch
- wrong base-model structure
- non-tensor adapter payloads

ArcLM never loads a Python import path from an adapter manifest, and it does not
pickle arbitrary modules for PEFT.

## Runtime Evidence

CPU tests verify:

- LoRA config validation
- dry target planning
- deterministic target selection by leaf, full path, and suffix
- transactional injection
- base parameter freezing
- optimizer receives trainable parameters
- checkpoint save and resume with new model/trainer objects
- adapter artifact save/inspect/validate/load
- adapter integrity checks
- wrong-base rejection
- inference equality after adapter reload
- merge/unmerge output equality
- merged final model artifact save/load/evaluate/infer

GPU runtime and Hugging Face PEFT runtime were not executed in this feature.

## Limitations

- Built-in LoRA currently wraps `torch.nn.Linear`.
- Default native targets are `query` and `value`.
- Bias adaptation is not implemented.
- QLoRA and quantized adapters are not implemented.
- External PEFT package integration remains legacy/optional and is not the new
  stable ArcLM PEFT contract.
