# Speciale ArcLM Versie

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

Drie officiele beginner examples:

```text
examples/22_beginner_data_tokenization.py
examples/23_beginner_train_tiny_native_model.py
examples/24_beginner_reload_generate_inspect.py
```

Deze examples zijn CPU-vriendelijk, gebruiken geen externe downloads en tonen
alleen de native happy path. Advanced Qwen/GPT-2 examples blijven optionele
integraties en zijn geen bewijs voor universele modelondersteuning.

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

Official 0.9 example:

```text
examples/25_data_sft_evaluation_workflow.py
```

It runs on CPU without external downloads and writes a local
`examples/_outputs/arclm_09_data_sft_eval/reproducibility_report.json` when
executed. The generated output directory is runtime data and is not part of the
package.

## Canonical Feature Status

| Feature | Canonical module | Public API | Status | Tests | Example | Dependencies | Known limitations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dataset loading | `arclm.datasets.loader` | `load_dataset`, `DatasetLoader`, `StreamingDataset` | Stable | `tests/unit/datasets`, `tests/public_api/test_datasets_api.py` | `examples/03_data_processing.py` | Required core deps | Local files/lists only; no HF Dataset/WebDataset integration. |
| Dataset validation, manifests and reports | `arclm.datasets.validation` | `validate_records`, `create_dataset_manifest`, `build_dataset_report` | Stable | `tests/unit/test_data_sft_evaluation_09.py` | `examples/25_data_sft_evaluation_workflow.py` | Required core deps | Lightweight local metadata only; no remote dataset registry and no full record contents in manifests. |
| Dataset processing | `arclm.datasets.processing`, `arclm.datasets.pipeline` | `DataProcessor`, `ProcessedDataset`, `DataPipeline` | Stable | `tests/unit/test_data_processor.py`, `tests/unit/datasets` | `examples/03_data_processing.py` | Required core deps | `DataProcessor.load` delegates loading to `DatasetLoader`; processing stays in-memory and local. |
| Dataset cleaning and dedup | `arclm.datasets.cleaning`, `arclm.datasets.deduplication` | `NormalizeWhitespace`, `ExactDeduplicator` | Stable | `tests/unit/datasets` | `examples/03_data_processing.py` | Required core deps | Exact/local rules only; no dataset version store. |
| Native model | `arclm.models` | `ArcLM`, `AutoModel` | Stable | `tests/models`, smoke tests | `examples/01_quickstart.py` | `torch` | Native support is GPT-style causal LM only. |
| Transparent pipeline inspection | `arclm.inspection` | `inspect_text`, `PipelineTrace` | Beta | `tests/unit/test_inspection.py` | `examples/21_native_happy_path_inspection.py` | `torch` | One native generation step only; no attention maps, web streaming or external HF tracing. |
| `MiniGPT` alias | `arclm.models` | `MiniGPT` | Deprecated | lifecycle/model tests | None for new code | `torch` | Alias to `ArcLM` for compatibility; do not use in new docs/examples. |
| Tokenizers | `arclm.tokenizers` | `Tokenizer`, `SentencePieceTokenizer`, `AutoTokenizer` | Beta | public/import and smoke tests | `examples/02_tokenization.py` | `sentencepiece` | HF tokenizer behavior is optional/external-path dependent. |
| Training | `arclm.training` | `Trainer`, `TrainingConfig`, `train_model` | Stable | `tests/unit/training`, `tests/smoke`, CLI tests | `examples/04_pretraining.py` | `torch` | Single-device core; real multi-GPU training is not stable. |
| Checkpoints and artifacts | `arclm.checkpoints`, `arclm.lifecycle` | `SmartLoader`, `inspect_checkpoint`, `save_model_artifact` | Stable | `tests/checkpoints`, `tests/models` | `examples/12_smart_loader.py` | `torch`, optional `safetensors` | Trusted local checkpoint boundary; external matrix incomplete. |
| Fine-tuning and SFT | `arclm.finetuning` | `FullFineTuner`, `SFTTrainer`, `train_sft`, `fine_tune`, `validate_sft_records` | Stable | `tests/unit/finetuning`, smoke tests, `tests/unit/test_data_sft_evaluation_09.py` | `examples/07_native_sft.py`, `examples/25_data_sft_evaluation_workflow.py` | `torch`, optional HF stack | Native CPU verified; external/HF runtime remains optional and model-specific. |
| External inference | `arclm.inference.external` facade, `arclm.inference._external_loading` implementation | `inspect_model_source`, `load_any_model`, `predict_external`, `save_loaded_model` | Beta | `tests/unit/test_external_engine.py`, integration tests | `examples/11_inference.py` | `torch`, optional `transformers`/`peft` | Flow is source validation -> optional deps -> tokenizer -> causal LM -> device -> generation; supports native ArcLM and HF causal LM/LoRA paths, not universal model loading. |
| Native inference | `arclm.inference.engine`, `arclm.inference.generation` | `load_model`, `predict`, `Generator` | Stable | smoke, public API tests | `examples/11_inference.py` | `torch` | Native checkpoint generation only. |
| Evaluation and diagnostics | `arclm.evaluation` | `Evaluator`, `EvaluationReport`, `build_evaluation_report`, `Accuracy`, `Perplexity`, diagnostic report helpers | Stable | `tests/unit/evaluation`, smoke tests, `tests/unit/test_data_sft_evaluation_09.py` | `examples/13_diagnostics.py`, `examples/25_data_sft_evaluation_workflow.py` | `torch` | Reports wrap canonical metrics; diagnostics interpret reports and should not recalculate metrics independently. |
| LoRA | `arclm.peft` | `LoRAConfig`, `apply_lora`, `save_adapter_artifact` | Stable | `tests/peft/test_lora_finetuning_runtime.py` | `examples/09_lora_sft.py` | `torch`, optional `peft` for external adapters | Native ArcLM Linear-layer LoRA runtime verified; external PEFT and QLoRA remain model/hardware-specific. |
| QLoRA and quantization | `arclm.peft` | `QLoRAConfig`, `QuantizationConfig`, `load_quantized_model` | Experimental | `tests/peft`, `tests/quantization` | Advanced examples | Optional `transformers`, `bitsandbytes` | Boundary and skips verified; real bitsandbytes GPU runtime pending. |
| Distributed runtime | `arclm.distributed` | `DistributedConfig`, DDP/FSDP capability helpers | Experimental | `tests/distributed`, GPU skip gates | `examples/20_ddp_cpu_trainer.py` | `torch.distributed` | CPU/Gloo boundary verified; real CUDA DDP/FSDP not complete. |
| Tracking | `arclm.tracking` | `RunTracker`, `create_run`, `inspect_run` | Beta | `tests/tracking` | None dedicated | Required core deps | Local manifests only; external services are compatibility-only. |
| Hyperparameter search | `arclm.search` | `create_search`, `SearchSpace`, `compare_trials` | Beta | `tests/search` | None dedicated | Required core deps | Sequential local trials; no parallel/Bayesian/pruning engine. |
| Preprocess pipeline | `arclm.preprocess` | preprocess config/pipeline helpers | Experimental | `tests/unit/test_preprocess_pipeline.py` | `examples/10_preprocess_pipeline.py` | Optional preprocess deps | Older JSONL pipeline; not the main dataset API. |
| FastAPI Web API | `arclm.web` | `create_app`, `WebConfig`, dataset endpoints, `POST /api/inspection/text` | Beta | `tests/web`, public API tests | `python -m arclm web-api` | Optional `fastapi`, `uvicorn` | Local API/status/dataset/native inspection; not production serving. |
| Next.js frontend | `web/` | `/learn/pipeline`, npm scripts | Experimental | frontend tests exist in repo | `web/` | Node/npm stack | Optional UI foundation; local backend must provide a native model/tokenizer for inspection. |
| Flask simple interface | `arclm.simple_interface` | `run_simple_interface` | Deprecated | compatibility/web tests | `python -m arclm --run simple-interface` | Optional `flask` | Compatibility-only; not canonical. |
| Legacy import shims | `arclm.data`, `arclm.dataset`, `arclm.model`, `arclm.tokenizer`, `arclm.trainer`, `arclm.pipeline`, `arclm.pipeline_v2`, `arclm.diagnostics`, `arclm.generator`, `arclm.external_inference`, `arclm.loaders` | Old import paths | Deprecated | `tests/compatibility`, package-structure tests | None for new code | Same deps as canonical modules | Keep small re-export shims; `pipeline_v2` is compatibility-only, not a second pipeline. |
| Native BERT/T5/LLaMA/Mistral/MoE/vision/multimodal | None | None | Unsupported | Absence recorded in status/tests | None | N/A | Use external HF causal LM paths where compatible; no native implementation. |
| RLHF/DPO/GRPO/production serving/OpenAI-compatible API/GGUF/ONNX/TensorRT | None | None | Unsupported | Absence recorded in status/docs | None | N/A | Out of current baseline scope. |
