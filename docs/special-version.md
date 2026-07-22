# Speciale ArcLM Versie

Release candidate: `0.10.0`.

Deze repository is een private/speciale ArcLM-editie. De baseline is native-first: eigen ArcLM/PyTorch code vormt de kern; Hugging Face, PEFT, Web en preprocessing zijn optionele integraties.

Gebruik nieuwe code bij voorkeur via deze publieke domeinen:

```text
arclm.datasets
arclm.models
arclm.tokenizers
arclm.training
arclm.finetuning
arclm.inference
arclm.checkpoints
arclm.evaluation
arclm.peft
arclm.search
arclm.web
```

Legacy modules blijven compatibility-only zolang tests en gebruikers ze nodig hebben. `MiniGPT` blijft voorlopig een deprecated alias naar `ArcLM`; er is geen tweede implementatie. `arclm.pipeline_v2` is geen tweede pipeline meer, maar alleen een deprecated re-export pad.

## ArcLM 1.0 Readiness Pass 1

Status: stabilisatie richting publieke release, geen versie bump. Web Studio
1-3 heeft de native visuele workflow compleet gemaakt:

```text
Project -> Dataset -> Validation/report -> Tokenizer -> Token inspection
-> Native model -> Training run -> Checkpoint -> Evaluation
-> Generation -> Pipeline inspection
```

Readiness beleid:

| Area | Status | Basis | Remaining limitation |
| --- | --- | --- | --- |
| Native public APIs | Stable candidate | Public API, smoke and full-suite tests pass for datasets, tokenizers, model, training, checkpoints, evaluation, generation and inspection. | Root exports blijven breed; post-release root API trim blijft technical debt. |
| Web Studio workflow | Beta | Local FastAPI and Next.js tests cover project, data, tokenizer, model, run, checkpoint, evaluation, generation and inspection paths. | Single-process local app; no auth, database, streaming or production serving. |
| Diagnostics | Beta | `/api/system/status` and `arclm doctor` share safe runtime diagnostics. | Hardware-specific CUDA/multi-GPU paths blijven afhankelijk van lokale hardware. |
| Optional integrations | Beta/Experimental | Availability is detected without importing heavy optional packages. | Hugging Face/PEFT/QLoRA runtime claims blijven model- and hardware-specific. |
| Deprecated compatibility paths | Deprecated but retained | Compatibility tests cover old imports. | Retain through 1.x; removal should only be considered for 2.0 with migration notes. |
| Workspace/privacy safety | Stable candidate | Workspace IDs are backend-generated, path traversal is rejected, browser responses hide internal paths, and `workspace/` is ignored by Git. | Local generated prompts/generation records are intentionally stored under the configured workspace with bounded retention. |

`arclm doctor` is native-only and reports ArcLM version, import path, Python
executable/version, PyTorch/CUDA/GPU status, optional integration availability
and warnings. The browser-facing system endpoint does not expose user paths,
environment variables, secrets, command-line arguments, dataset contents,
checkpoint binaries, tokenizer binaries, embeddings or logits.

Public API stability inventory:

| Classification | APIs |
| --- | --- |
| Stable candidate | `ArcLM`, `TrainingConfig`, `Trainer`, `load_dataset`, `validate_records`, `create_dataset_manifest`, `build_dataset_report`, `Tokenizer`, `SentencePieceTokenizer`, `Generator`, `Evaluator`, `build_evaluation_report`, `SmartLoader`, native checkpoint helpers |
| Beta | `inspect_text`, `PipelineTrace`, `ModelCapabilityReport`, `model_support_matrix`, `RunTracker`, local FastAPI `create_app`, Web Studio endpoints |
| Experimental | External HF causal-LM loading boundaries, QLoRA/quantization runtime helpers, distributed runtime helpers, advanced preprocessing/search surfaces |
| Deprecated | `arclm.data`, `arclm.dataset`, `arclm.model`, `arclm.tokenizer`, `arclm.trainer`, `arclm.pipeline`, `arclm.pipeline_v2`, `arclm.diagnostics`, `arclm.generator`, `arclm.external_inference`, `arclm.loaders`, `MiniGPT`, Flask simple interface |
| Unsupported | Native BERT/T5/LLaMA/Mistral/Qwen implementations, diffusion, multimodal, RLHF/DPO/GRPO, OpenAI-compatible APIs, production serving, attention-map capture, WebSockets/streaming generation |

Release recommendation after this pass should prefer `0.10.0` unless a final
manual release review decides Web Studio 1-3 are small enough to remain under
the original `0.9.0` release candidate. A `1.0.0 RC` should wait until clean
wheel workflow, Studio journey, docs and deprecation policy are manually
reviewed together.

## ArcLM 0.10.0 Release Candidate

ArcLM `0.10.0` is the honest release line for the completed native Studio
workflow. It is not a `1.0.0` claim. The release gate uses a clean installed
wheel, `arclm[web]`, a temporary workspace and real Uvicorn HTTP requests for:

```text
Project -> Dataset -> Validation/report -> Word tokenizer -> Record inspection
-> Native model config -> CPU training -> Checkpoint -> Evaluation
-> Generation -> Checkpoint pipeline inspection
```

Project progress is derived from real artifacts only. There is no editable
progress percentage. The release smoke verifies the stages become Ready as
their dataset, tokenizer, model, completed run, compatible checkpoint,
completed evaluation, generation record and inspection trace appear.

Privacy and workspace behavior:

- `workspace/` is ignored by Git and must not be packaged.
- Studio responses and diagnostics do not expose internal workspace paths,
  environment variables, secrets, checkpoint tensor binaries, tokenizer
  binaries, embeddings or logits.
- Studio does not download external models or upload data to remote services.
- Checkpoint metadata and evaluation reports are exportable as safe JSON
  payloads through existing read endpoints.

Release recommendation: ship this work as `0.10.0` after manual review. Keep
`1.0.0 RC` for a later pass after the full Studio journey, docs, deprecation
policy and clean-install gates have been reviewed together.

## Transparent Pipeline Inspection

ArcLM heeft een native inspectiepad voor studenten en ontwikkelaars die een
enkele generatie-stap willen begrijpen zonder de interne code te lezen:

```python
from arclm import inspect_text

trace = inspect_text(model=model, tokenizer=tokenizer, text="Hello ArcLM")
print(trace.summary())
print(trace.to_dict())
```

De trace toont: inputtekst, tokens, token ids, input tensor shape,
embedding shape, logits shape, gekozen token, gedecodeerde tekst, device,
dtype en model/tokenizer classes. Standaard bewaart de trace geen embeddings
of logits. Gebruik `include_values=True, max_values=20` alleen voor kleine,
begrensde samples. De eerste versie inspecteert één native ArcLM
generatie-stap; attention maps, web streaming en externe Hugging Face traces
zijn nog niet geimplementeerd.

## Local Web Pipeline Inspection

De lokale weblaag kan dezelfde native trace read-only tonen:

```text
Next.js /learn/pipeline -> POST /api/inspection/text -> arclm.inspect_text -> PipelineTrace.to_dict()
```

Endpoint: `POST /api/inspection/text`.

Requestvelden:

```json
{
  "text": "Hello ArcLM",
  "include_values": false,
  "max_values": 20
}
```

De FastAPI app gebruikt alleen een expliciet geinjecteerd native model en
tokenizer uit `app.state`; de request accepteert geen checkpointpaden, model
IDs, Python classes, devices of dtypes. Als er geen model/tokenizer is
geconfigureerd, geeft de API `native_model_not_configured` terug. De Next.js
leerpagina staat op `/learn/pipeline` en visualiseert input, tokens, token
IDs, input tensor, embedding shape, logits shape, geselecteerde token en
gegenereerde tekst. Attention maps, streaming en externe-model tracing zijn
niet geimplementeerd.

## ArcLM Studio Web 1

ArcLM Studio is de optionele lokale webapp voor project-, data- en tokenizer
voorbereiding. De frontend blijft een client van de FastAPI laag, en de
backend gebruikt ArcLM publieke APIs voor datasets, validatie, reports en
tokenizers.

Actieve routes:

```text
/
/projects
/projects/new
/projects/[projectId]
/projects/[projectId]/data
/projects/[projectId]/tokenizer
/system
/learn/pipeline
```

Actieve API endpoints:

```text
GET    /api/system/status
GET    /api/projects
POST   /api/projects
GET    /api/projects/{project_id}
PATCH  /api/projects/{project_id}
DELETE /api/projects/{project_id}
GET    /api/projects/{project_id}/datasets
POST   /api/projects/{project_id}/datasets/upload
POST   /api/projects/{project_id}/datasets/paste
GET    /api/projects/{project_id}/datasets/{dataset_id}
GET    /api/projects/{project_id}/datasets/{dataset_id}/preview
DELETE /api/projects/{project_id}/datasets/{dataset_id}
POST   /api/projects/{project_id}/datasets/{dataset_id}/validate
POST   /api/projects/{project_id}/datasets/{dataset_id}/report
GET    /api/projects/{project_id}/datasets/{dataset_id}/manifest
GET    /api/projects/{project_id}/datasets/{dataset_id}/report
GET    /api/projects/{project_id}/tokenizers
POST   /api/projects/{project_id}/tokenizers/native
GET    /api/projects/{project_id}/tokenizers/{tokenizer_id}
POST   /api/projects/{project_id}/tokenizers/{tokenizer_id}/inspect
DELETE /api/projects/{project_id}/tokenizers/{tokenizer_id}
```

Workspace storage is confined to the configured `WebConfig.workspace_root`.
Project, dataset and tokenizer IDs are generated server-side and validated
before filesystem access. Browser requests never provide absolute paths,
checkpoint paths or model IDs. Path traversal, encoded traversal and symlink
escapes are rejected where practical. Uploaded filenames are sanitized and
stored only as metadata/display names. JSON writes use atomic replacement.

Data Studio supports bounded JSON, JSONL, CSV and TXT upload/paste flows.
Preview responses are limited, large cells are truncated, validation uses
`validate_records` and `validate_sft_records`, and report generation uses
`create_dataset_manifest` and `build_dataset_report`. Token statistics come
from the canonical tokenizer path used by the report.

Tokenizer Lab supports creating a native ArcLM tokenizer from a project
dataset and inspecting text through that tokenizer. It reports tokens, token
IDs, token count, unknown-token count, decoded text and round-trip status. The
SentencePiece creation endpoint is not exposed in this phase because the
current safe Studio flow only covers the native tokenizer.

Web Studio 1 blijft de basis voor projecten, data en tokenizers.

## ArcLM Web Studio 2

Web Studio 2 voegt een lokale native model- en training flow toe bovenop de
bestaande ArcLM core:

```text
Project -> Dataset -> Tokenizer -> Native model config -> Training config -> Run -> Checkpoints
```

Publieke web API:

| Area | Endpoints | Behavior | Limitations |
| --- | --- | --- | --- |
| Native Model Builder | `GET/POST/PATCH/DELETE /api/projects/{project_id}/models...`, `POST /models/native/validate`, `POST /models/native/estimate` | Slaat native ArcLM configuratie en metadata op, valideert via echte `ArcLM` constructie, vereist een ready project-tokenizer, telt parameters via tijdelijke modelinstantie en labelt memory estimates als approximate. | Geen externe model families, geen downloads, geen willekeurige Python classes, geen modelgewichten opslaan bij configuratie. |
| Explicit dataset tokenization | `POST /api/projects/{project_id}/datasets/{dataset_id}/report`, `POST /api/projects/{project_id}/datasets/{dataset_id}/inspect` | Browser kiest expliciet een project-tokenizer; backend valideert eigenaarschap/status, report identity bevat dataset/tokenizer/max sequence length, record inspectie is begrensd en gebruikt canonical tokenizer encode/decode. | Geen remote tokenizers, geen volledige dataset dumps, geen embeddings/logits, schema-validatie blijft mogelijk zonder tokenizer. |
| Training jobs | `GET/POST /api/projects/{project_id}/runs`, `GET /runs/{run_id}`, metrics/events/cancel/checkpoints endpoints | In-process background thread start canonical native `Trainer`; run metadata, configuration, `metrics.jsonl`, `events.jsonl` en checkpoint metadata blijven onder de project workspace. | Maximaal 1 actieve job per app-instantie; geen queue, automatische resume, subprocess-isolatie, Evaluation Studio of Generation Playground. |
| Run lifecycle | `queued`, `starting`, `running`, `cancelling`, `cancelled`, `completed`, `failed`, `interrupted` | Stale active runs worden bij app start `interrupted`; cancellation is cooperatief en stopt op een veilige Trainer callback boundary. | Cancellation is niet instant; browser krijgt geen raw tracebacks en geen checkpoint binaries. |

Frontend routes:

```text
/projects/[projectId]/model
/projects/[projectId]/train
/projects/[projectId]/runs
/projects/[projectId]/runs/[runId]
```

De Training Studio exposeert alleen `native_causal_lm` als Web Studio 2 job
type. Native full fine-tuning, SFT en LoRA blijven Python APIs, maar zijn nog
geen afzonderlijk gevalideerde web-job workflows. Deferred: WebSockets/streaming
logs, attention maps, authentication, database, cloud storage, shell execution,
external downloads and arbitrary filesystem browsing.

## ArcLM Web Studio 3

Web Studio 3 sluit de native projectloop af met read-only checkpoint,
evaluation en generation tools bovenop bestaande ArcLM APIs:

```text
Project -> Runs -> Checkpoints -> Validate/Inspect/Evaluate/Generate
```

Geverifieerde web API:

| Area | Endpoints | Behavior | Limitations |
| --- | --- | --- | --- |
| Checkpoint Manager | `GET /api/projects/{project_id}/checkpoints`, `GET/DELETE /checkpoints/{checkpoint_id}`, `POST /checkpoints/{checkpoint_id}/validate`, `POST /checkpoints/{checkpoint_id}/inspect` | Toont project-brede native checkpoints uit run outputs, valideert via canonical checkpoint reload, verwijdert alleen met expliciete bevestiging en inspecteert via `arclm.inspect_text`. | Geen willekeurige checkpointpaden, downloads, tensor dumps of externe model tracing. |
| Evaluation Studio | `GET/POST /api/projects/{project_id}/evaluations`, report/events/cancel/compare endpoints | Start bounded native evaluation jobs in-process, bewaart metadata/events/reports onder de project workspace en gebruikt canonical `Evaluator` plus `EvaluationReport.to_dict()`. | Geen queue, distributed evaluation, fake metrics of custom metric upload vanuit de browser. |
| Generation Playground | `GET/POST /api/projects/{project_id}/generations`, `GET/DELETE /generations/{generation_id}` | Genereert tekst uit compatible native checkpoints met begrensde prompt en token limits, bewaart bounded local history en gebruikt canonical native `Generator`. | Geen streaming, attention maps, externe modellen, modelbeheer of browser-side model loading. |

Frontend routes:

```text
/projects/[projectId]/checkpoints
/projects/[projectId]/checkpoints/[checkpointId]
/projects/[projectId]/checkpoints/[checkpointId]/inspect
/projects/[projectId]/evaluate
/projects/[projectId]/evaluations
/projects/[projectId]/evaluations/[evaluationId]
/projects/[projectId]/generate
```

Native model/tokenizer/checkpoint ownership blijft server-side in de lokale
workspace. Browser requests sturen alleen project IDs, backend-generated
checkpoint/evaluation/generation IDs en bounded form fields. De Studio 3 UI
voegt geen training features, externe model downloads, WebSockets, streaming,
attention capture, auth of databases toe.

## ArcLM 0.8 Causal LM Workbench

De officiele modelroute is native ArcLM causal language modeling:

```text
Config/build_model or ArcLM(...) -> Tokenizer -> Trainer -> checkpoint -> load_model/Generator -> Evaluator -> inspect_text
```

Native checkpoints gebruiken het bestaande `arclm.checkpoints` formaat en
moeten metadata bevatten voor ArcLM-versie, checkpoint-format versie,
`model_source`, `model_task`, architectuur, modelconfiguratie,
tokenizerinformatie en trainingconfiguratie. Externe causal-LM modellen lopen
via `arclm.inference.inspect_model_source` en `load_any_model`; ze zijn Hugging
Face/PEFT integraties en geen native ArcLM checkpoints.

| Model | Exact version | Source | Task | Load | Forward | Generate | Train | SFT | LoRA | Save/Reload | CPU | CUDA | Status | Limitations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ArcLM Native Tiny | ArcLM native tiny causal LM | Native ArcLM | causal LM | Passed | Passed | Passed | Passed | Passed | Passed | Passed | Passed | Not tested | Validated | Compact single ArcLM architecture; native LoRA is validated on ArcLM Linear layers; no KV cache, streaming, attention capture or quantization. |
| GPT-2 reference | `hf-internal-testing/tiny-random-gpt2` | External Hugging Face | causal LM | Passed | Not tested | Passed | Not supported | Not tested | Not tested | Passed | Passed | Not tested | Compatible | Boundary/mocked tiny path only; no large weight download or real runtime claim. |
| Selected Qwen | `Qwen/Qwen3-0.6B` | External Hugging Face | causal LM | Not tested | Not tested | Not tested | Not supported | Not tested | Not tested | Not tested | Not tested | Not tested | Experimental | Exact model path is recognized; real load/forward/generation/SFT/LoRA/CUDA are unvalidated unless locally available. |

ArcLM bevat drie CPU-vriendelijke beginner workflows voor data/tokenization,
tiny native training en checkpoint reload/generation/inspection. Ze gebruiken
geen externe downloads en tonen alleen het native happy path. Advanced
Qwen/GPT-2 workflows blijven optionele integraties en zijn geen bewijs voor
universele modelondersteuning.

## ArcLM 0.9 Data, SFT and Evaluation

De 0.9 happy path is:

```text
dataset -> validation -> cleaning -> tokenization statistics -> SFT formatting -> native fine-tuning -> checkpoint -> evaluation report -> generation -> reproducibility report
```

Nieuwe compacte APIs:

| Area | Public API | Verified behavior | Limitations |
| --- | --- | --- | --- |
| Dataset schema validation | `arclm.datasets.validate_records`, `DatasetValidationResult`, `DatasetValidationIssue` | Missing fields, type errors, empty strings, valid/invalid counts, indexes and optional record IDs; strict mode raises, non-strict returns valid records plus issues. | Small field-schema validation only; no external schema dependency or nested validation framework. |
| Dataset manifest | `create_dataset_manifest`, `DatasetManifest` | Records source type/files, before/after counts, invalid records, duplicates removed, text fields, transformations, split sizes, timestamp and ArcLM version without storing data contents. | Local JSON-safe provenance only; no remote registry or dataset catalog. |
| Dataset/token report | `build_dataset_report`, `DatasetReport` | Reports record counts, valid/invalid counts, split sizes, text length stats, token length stats, token count, unknown-token rate and truncation count when configured. | Uses the provided tokenizer once for report statistics; does not persist full tokenized dataset. |
| SFT data contract | `get_sft_record_contract`, `validate_sft_records`, `prepare_fine_tuning_dataset` | Supports plain text, prompt/completion, instruction/response with output/completion/answer aliases, and chat messages through the existing normalizer/tokenizer/label path. | Packing remains disabled in stable `FineTuningConfig`; external HF SFT still needs optional dependencies. |
| Fine-tuning entry points | `fine_tune`, `train_sft`, `FullFineTuner`, `SFTTrainer` | Native full fine-tuning and native SFT share validation, formatting, tokenization, labels, prompt masking, collation and checkpoint metadata concepts. | Native Trainer is unchanged; external/HF helpers remain optional integration paths. |
| Native LoRA validation | `LoRAConfig`, `apply_lora`, `fine_tune(..., peft_config=LoRAConfig(...))`, adapter artifact APIs | Tiny native ArcLM model passes adapter creation, trainable parameter selection, one training run, checkpoint resume, adapter save/reload, forward after reload, merge/unmerge and generation after merged artifact reload. | Validated on native ArcLM Linear layers only; QLoRA runtime remains unvalidated without CUDA/bitsandbytes. |
| Evaluation report | `build_evaluation_report`, `EvaluationReport` | Wraps canonical `EvaluationResult` metrics with examples, batches, token count, model/checkpoint/dataset identity, timestamp, device, dtype and warnings; supports `to_dict()`, `to_json()`, `summary()`. | Does not recalculate metrics; diagnostics should interpret the report rather than duplicate metrics. |
| Reproducibility metadata | `arclm.tracking.set_reproducible_seed`, `build_reproducibility_metadata` | Records seed coverage for Python, NumPy, Torch CPU and CUDA when available, plus dataset/tokenizer/model fingerprints and checkpoint/run format versions. | Deterministic equality is not guaranteed across hardware, PyTorch builds, CUDA kernels or optional backends. |

The official 0.9 workflow runs on CPU without external downloads and produces a
local reproducibility report when executed. Generated output directories are
runtime data and are not part of the package.

## Canonical Feature Status

| Feature | Canonical module | Public API | Status | Dependencies | Known limitations |
| --- | --- | --- | --- | --- | --- |
| Dataset loading | `arclm.datasets` | `load_dataset`, `DatasetLoader`, `StreamingDataset` | Stable | Required core deps | Local files/lists only; no HF Dataset/WebDataset integration. |
| Dataset validation, manifests and reports | `arclm.datasets` | `validate_records`, `create_dataset_manifest`, `build_dataset_report` | Stable | Required core deps | Lightweight local metadata only; no remote dataset registry and no full record contents in manifests. |
| Dataset processing | `arclm.datasets` | `DataProcessor`, `ProcessedDataset`, `DataPipeline` | Stable | Required core deps | `DataProcessor.load` delegates loading to `DatasetLoader`; processing stays in-memory and local. |
| Dataset cleaning and dedup | `arclm.datasets.cleaning`, `arclm.datasets.deduplication` | `NormalizeWhitespace`, `ExactDeduplicator` | Stable | Required core deps | Exact/local rules only; no dataset version store. |
| Native model | `arclm.models` | `ArcLM`, `AutoModel` | Stable | `torch` | Native support is GPT-style causal LM only. |
| Transparent pipeline inspection | `arclm.inspection` | `inspect_text`, `PipelineTrace` | Beta | `torch` | One native generation step only; no attention maps, web streaming or external HF tracing. |
| `MiniGPT` alias | `arclm.models` | `MiniGPT` | Deprecated | `torch` | Alias to `ArcLM` for compatibility; do not use in new projects. |
| Tokenizers | `arclm.tokenizers` | `Tokenizer`, `SentencePieceTokenizer`, `AutoTokenizer` | Beta | `sentencepiece` | HF tokenizer behavior is optional/external-path dependent. |
| Training | `arclm.training` | `Trainer`, `TrainingConfig`, `train_model` | Stable | `torch` | Single-device core; real multi-GPU training is not stable. |
| Checkpoints and artifacts | `arclm.checkpoints`, `arclm.lifecycle` | `SmartLoader`, `inspect_checkpoint`, `save_model_artifact` | Stable | `torch`, optional `safetensors` | Trusted local checkpoint boundary; external matrix incomplete. |
| Fine-tuning and SFT | `arclm.finetuning` | `FullFineTuner`, `SFTTrainer`, `train_sft`, `fine_tune`, `validate_sft_records` | Stable | `torch`, optional HF stack | Native CPU verified; external/HF runtime remains optional and model-specific. |
| External inference | `arclm.inference.external` | `inspect_model_source`, `load_any_model`, `predict_external`, `save_loaded_model` | Beta | `torch`, optional `transformers`/`peft` | Supports native ArcLM and HF causal LM/LoRA paths, not universal model loading. |
| Native inference | `arclm.inference` | `load_model`, `predict`, `Generator` | Stable | `torch` | Native checkpoint generation only. |
| Evaluation and diagnostics | `arclm.evaluation` | `Evaluator`, `EvaluationReport`, `build_evaluation_report`, `Accuracy`, `Perplexity`, diagnostic helpers | Stable | `torch` | Reports wrap canonical metrics; diagnostics interpret reports and should not recalculate metrics independently. |
| LoRA | `arclm.peft` | `LoRAConfig`, `apply_lora`, `save_adapter_artifact` | Stable | `torch`, optional `peft` for external adapters | Native ArcLM Linear-layer LoRA runtime verified; external PEFT and QLoRA remain model/hardware-specific. |
| QLoRA and quantization | `arclm.peft` | `QLoRAConfig`, `QuantizationConfig`, `load_quantized_model` | Experimental | Optional `transformers`, `bitsandbytes` | Boundary behavior exists; real bitsandbytes GPU runtime pending. |
| Distributed runtime | `arclm.distributed` | `DistributedConfig`, DDP/FSDP capability helpers | Experimental | `torch.distributed` | CPU/Gloo boundary exists; real CUDA DDP/FSDP is not complete. |
| Tracking | `arclm.tracking` | `RunTracker`, `create_run`, `inspect_run` | Beta | Required core deps | Local manifests only; external services are compatibility-only. |
| Hyperparameter search | `arclm.search` | `create_search`, `SearchSpace`, `compare_trials` | Beta | Required core deps | Sequential local trials; no parallel/Bayesian/pruning engine. |
| Preprocess pipeline | `arclm.preprocess` | preprocess config/pipeline helpers | Experimental | Optional preprocess deps | Older JSONL pipeline; not the main dataset API. |
| FastAPI Web API | `arclm.web` | `create_app`, `WebConfig`, `/api/system/status`, `/api/projects`, project dataset/tokenizer/model/run endpoints, `POST /api/inspection/text` | Beta | Optional `fastapi`, `uvicorn` | Local Studio API only; native training jobs are single-process/threaded and not production serving. |
| Next.js frontend | Optional Studio frontend | Project, data, tokenizer, model, train, runs, checkpoints, evaluation, generation, system and pipeline-learning pages | Experimental | Node/npm stack | Optional Studio UI; streaming logs, attention maps, auth, database, external downloads and production serving are deferred. |
| Flask simple interface | `arclm.simple_interface` | `run_simple_interface` | Deprecated | Optional `flask` | Compatibility-only; not canonical. |
| Legacy import shims | `arclm.data`, `arclm.dataset`, `arclm.model`, `arclm.tokenizer`, `arclm.trainer`, `arclm.pipeline`, `arclm.pipeline_v2`, `arclm.diagnostics`, `arclm.generator`, `arclm.external_inference`, `arclm.loaders` | Old import paths | Deprecated | Same deps as canonical modules | Keep small re-export shims; `pipeline_v2` is compatibility-only, not a second pipeline. |
| Native BERT/T5/LLaMA/Mistral/MoE/vision/multimodal | None | None | Unsupported | N/A | Use external HF causal LM paths where compatible; no native implementation. |
| RLHF/DPO/GRPO/production serving/OpenAI-compatible API/GGUF/ONNX/TensorRT | None | None | Unsupported | N/A | Out of current baseline scope. |
