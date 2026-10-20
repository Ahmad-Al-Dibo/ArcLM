# 02 — خريطة البنية الدقيقة (Structure)

## 2.1 جذر المستودع

```text
ArcLM/
├── src/arclm/           # الكود المصدر (المرجع الوحيد)
├── tests/               # pytest
├── examples/            # أمثلة مُتحقَّق منها (00–12)
├── lab/                 # منهجية تعليمية (32 تحدي)
├── distributions/       # Blocks مولّدة + manifests
├── tools/               # build_arclm_distributions.py
├── docs/                # دليل طويل المدى
├── framework-site/      # موقع التقديم + API reference
├── presentation/        # شرائح اجتماع
├── local-articles/      # مسودات مقالات (gitignored)
├── web/                 # واجهة Next.js للـ Studio
└── pyproject.toml
```

## 2.2 `src/arclm/` — ملفات الجذر

| الملف | المسؤولية | رموز مهمة |
|---|---|---|
| `__init__.py` | API عام كسول | `_EXPORTS`, `__getattr__`, `get_version`, `get_device`, `list_available_models`, `load_training_checkpoint`, `report_environment` |
| `__init__.pyi` | نموذج أنواع | نفس الأسماء |
| `_version.py` | الإصدار | `__version__`, `__api_version__` |
| `__main__.py` | `python -m arclm` | `main` |
| `cli.py` | CLI كامل | `main`, `train_command`, `eval_command`, `chat_command`, `doctor_command`, `resolve_cli_device`, `create_*_parser` |
| `tracking.py` | تتبع التجارب | `create_run`, `RunTracker`, `RunConfig`, `set_reproducible_seed`, `list_runs`, `compare_runs`, `_redact_paths` |
| `inspection.py` | تتبع خطوة توليد | `inspect_text`, `PipelineTrace` |
| `diagnostics_runtime.py` | تقرير آمن لـ CLI | `build_runtime_diagnostics` |
| `distributed.py` | عقود DDP/FSDP (تجريبي) | `DistributedConfig`, `resolve_process_device` |
| `schemas.py` | سجلات مُتحقَّق منها | `TextRecord`, `PromptCompletionRecord`, … |
| `data_sources.py` | مصادر بيانات | `DatasetSource` |
| `data_quality.py` | جودة/تقسيم/تقطيع | `DataQualityReport`, `SplitResult`, `ShardResult` |
| `runs.py`, `events.py`, `workflow.py` | مسارات مساندة | `run_workflow`, … |
| `config_schema.py`, `config_validation.py`, `stability.py` | تحقق إعدادات موسّع | `normalize_device`, … |
| `cache.py`, `reproducibility.py`, `tokenization.py`, `report_schemas.py`, `simple_chat.py` | أدوات مساندة | انظر المصدر |

## 2.3 حزم النواة (Core)

```text
configs/       base.py (Config, create_config), serialization.py
tokenizers/    base.py (Tokenizer, SentencePieceTokenizer), auto.py
datasets/      base, loader, validation, pipeline, processing,
               cleaning/, deduplication/, streaming/, instruction.py
security/      redaction, paths, network, hashing, signatures, status,
               policy, configuration, crypto/, keys/, artifacts/, web/
agents/        agent, tool, runner, model, session, permissions,
               approvals, schema, tracing, builtins/, integrations/
tracking.py    (ملف جذر)
search/        __init__.py (~1700 سطر) — بحث معاملات فرط
logics/        symbol, sentence, connectives, knowledge, model_check
exceptions/    base.py — شجرة ArcLMError
registry/      base.py — Registry عام
utils/         imports.py (require_torch), formatting.py
```

## 2.4 حزمة التدريب (Training stack)

```text
models/        text/causal_lm.py (ArcLM, GPTBlock, SelfAttention), auto.py, capabilities.py
training/      trainer.py, unified.py, pipeline.py, config.py, base.py,
               regularization.py, precision.py, schedulers.py, optimizers.py,
               callbacks.py, logging.py, state.py
inference/     engine.py, generation.py, external.py, _external_loading.py (~1780 سطر)
finetuning/    sft.py, workflow.py, config.py, adapters.py, collator.py,
               formatting.py, labels.py, packing.py, full.py, base.py
checkpoints/   training.py, loaders/ (base, smart_loader, adapters, hf, safetensors, state_dict, arclm_checkpoint, registry)
evaluation/    evaluator.py, metrics.py, diagnostics.py, config.py, result.py, base.py, callbacks.py
peft/          lora.py, quantization.py, artifacts.py, config.py, runtime_validation.py
lifecycle/     artifacts.py, metadata.py
web/           app.py, workspace.py, studio_training.py, studio3.py, schemas.py, …
```

## 2.5 قواعد وضع الملفات

| ضع الملف في | لا تضعه في |
|---|---|
| حزمة نطاق مناسبة | ملف جذر مسطّح جديد بدون داعي |
| `tests/unit/<منطقة>/` | اختبارات شبكة/ GPU في unit |
| `examples/NN_*/` | تجارب مؤقتة غير مُتحقَّق منها |
| `distributions/manifests/` | تعديل يدوي لأشجار Blocks المولّدة |
