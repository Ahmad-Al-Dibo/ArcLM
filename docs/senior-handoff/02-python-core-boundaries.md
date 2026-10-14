# 02 - Python Core Boundaries

## Root package is een lazy compatibility gateway

`src/arclm/__init__.py` bevat een grote `_EXPORTS` mapping. Dat is bewust:
`import arclm` moet licht blijven en optionele dependencies zoals FastAPI,
Transformers of datasets mogen niet per import geladen worden.

Gevolgen:

- Voeg root exports alleen toe voor echte public API.
- Test root exports apart, want fouten verschijnen pas bij attribute access.
- Plaats geen runtime side effects in modules die via root lazy geladen worden.
- Domain imports blijven de voorkeur voor interne code.

## Er zijn twee API-generaties

Oude generatie:

- `arclm.configs.Config`
- `arclm.training.pipeline.train_model`
- `arclm.datasets.prepare_data`
- `Trainer.save()` met oud checkpointpad `model_path`

Nieuwe generatie:

- `arclm.training.TrainingConfig`
- `Trainer(..., train_dataset=..., config=TrainingConfig(...))`
- lifecycle/checkpoint metadata
- typed data/config/workflow modules uit de Open Source sync

Compatibiliteit is bewust, maar fragiel. De Trainer accepteert beide config-
vormen door `getattr(config, "epochs", getattr(config, "num_epochs", None))`
achtige patronen. Bij nieuwe velden moet je dus controleren of zowel de oude
`Config` als de nieuwe `TrainingConfig` ze kan negeren of verwerken.

## Canonicale modules per domein

- Dataset IO en oude trainingdata: `src/arclm/datasets`
- Data-scale/productie helpers: `src/arclm/data_sources.py`,
  `src/arclm/schemas.py`, `src/arclm/data_quality.py`
- Training loop: `src/arclm/training/trainer.py`
- High-level native training facade: `src/arclm/training/pipeline.py`
- SFT/fine-tuning formatting en masking: `src/arclm/finetuning/workflow.py`
- Checkpoint loading/adaptation: `src/arclm/checkpoints`
- External/native inference boundary: `src/arclm/inference`
- Web Studio persistence: `src/arclm/web/workspace.py`
- Web Studio orchestration: `src/arclm/web/studio_training.py`,
  `src/arclm/web/studio3.py`

## Dependency boundaries

Core dependencies are small: PyTorch, NumPy, SentencePiece. Optional stacks are
kept behind imports:

- FastAPI/Uvicorn/Pydantic only in Web API runtime.
- Transformers/datasets/accelerate/peft behind optional HF/PEFT paths.
- Cryptography/keyring behind security extras.
- Whisper behind audio agent extras.

When adding imports, preserve this boundary. A single top-level `transformers`
import in a public module can make `import arclm` fail for CPU/minimal installs.

## Exception model

Public errors are centralized in `src/arclm/exceptions`. Some subpackages also
define narrow safe errors, for example `WorkspaceApiError` and `InspectionApiError`
inside web modules. The FastAPI layer translates these to stable error payloads:

```json
{"error": {"code": "...", "message": "...", "details": {...}}}
```

For new backend APIs, prefer stable codes over leaking raw exception strings.
Use raw exception messages only after truncation/sanitization.

## Hidden coupling to tests

Many tests assert import contracts and public API names. Breaking a name in
`__all__`, `_EXPORTS`, `web/src/lib/api/client.ts`, or a Pydantic schema can
fail tests far from the module you changed. Run the smallest matching public API
and web API tests after any facade change.

