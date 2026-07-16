# PEFT Foundation

Core Milestone 2 / Feature 2 added a small ArcLM-owned PEFT foundation. Core
Milestone 2 / Feature 3 adds the QLoRA configuration and quantized-backend
boundary. Other adapter methods, distributed PEFT, and external `peft` package
automation are not part of these features.

## Public API

```python
from arclm.peft import (
    PeftMethod,
    PeftConfig,
    LoRAConfig,
    QLoRAConfig,
    QuantizationConfig,
    LoRALinear,
    inspect_lora_targets,
    apply_lora,
    apply_peft,
    get_peft_parameter_report,
    save_adapter_artifact,
    inspect_adapter_artifact,
    validate_adapter_artifact,
    load_adapter_artifact,
    inspect_quantization_capabilities,
)
```

`import arclm` remains lightweight and does not import `peft`, Transformers, or
CUDA runtime objects.

## Method Status

| Method | Status | Runtime evidence | Notes |
| ------ | ------ | ---------------- | ----- |
| `none` | Implemented | Config path only | No PEFT mutation. |
| `lora` | Implemented and verified | CPU native workflow plus tiny Hugging Face CPU/CUDA runtime | Built-in ArcLM LoRA, no external PEFT dependency. |
| `qlora` | Implemented foundation | CPU boundary, fixture tests, and optional-runtime matrix | Real bitsandbytes/GPU QLoRA training pending. |
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

The adapter payload stores only LoRA tensors. QLoRA adapter artifacts record
quantization metadata but still do not contain the quantized base model.
It does not contain optimizer,
scheduler, scaler, RNG state, dataset contents, raw prompts, or executable
Python code.

## Checkpoint and Final Artifact Boundary

Training checkpoints continue to save the full runtime state needed for resume,
including adapter wrappers, optimizer state, scheduler state, scaler state, and
RNG state. PEFT checkpoint metadata records the active PEFT config, but adapter
artifacts remain the portable adapter format.

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

QLoRA quantized runtime models cannot be merged directly into final model
artifacts. Load the adapter on a compatible full-precision base model first,
then merge and save the final artifact.

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
- QLoRA config round trip
- QLoRA capability inspection
- QLoRA optional-dependency boundary
- QLoRA adapter artifact metadata
- full-precision adapter reload and merge path for QLoRA metadata
- inference equality after adapter reload
- merge/unmerge output equality
- merged final model artifact save/load/evaluate/infer

Core Milestone 2 / Feature 4 adds Hugging Face CPU runtime and CUDA LoRA runtime
tests. Real bitsandbytes 4-bit loading remains pending because bitsandbytes is
not installed in the validation environments.

Canonical runtime evidence: [runtime-validation-matrix.md](runtime-validation-matrix.md).

Core Milestone 2 / Feature 6 allows local search over approved LoRA fields such
as `lora.rank`, `lora.alpha`, `lora.dropout`, `lora.target_match`, and
`lora.freeze_base_model`. Search does not add new PEFT methods or external PEFT
automation.

## Limitations

- Built-in LoRA currently wraps `torch.nn.Linear`.
- Default native targets are `query` and `value`.
- Bias adaptation is not implemented.
- QLoRA real GPU runtime validation is pending on an environment with
  bitsandbytes installed and supported by the CUDA stack.
- External PEFT package integration remains legacy/optional and is not the new
  stable ArcLM PEFT contract.

See also: [qlora.md](qlora.md).
