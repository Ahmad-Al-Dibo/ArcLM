# 08 — دورة الحياة والتنفيذ خطوة بخطوة

---

## 8.1 دورة حياة الاستيراد

```text
1. import arclm
   → __init__.py: import_module فقط + _EXPORTS dict
   → sys.modules لا يحتوي torch

2. from arclm.tokenizers import Tokenizer
   → import_module("arclm.tokenizers")
   → tokenizers/__init__ → base.py → (sentencepiece إن لزم)
   → لا torch

3. from arclm.models import ArcLM
   → models/__init__.py
   → require_torch("arclm.models")
   → import torch
   → causal_lm.py
```

---

## 8.2 دورة حياة Run (تتبع)

```text
create_run(RunConfig)     # إنشاء مجلد + manifest (status=created)
  .start()                # status=running
  .record_config(...)     # config section محفوظ
  .record_dataset(...)    # مع redact paths
  .record_metric(...)     # metrics.jsonl append
  .record_checkpoint(...) # outputs.checkpoints += 1
  .record_event(...)      # events + payload redacted
  .complete(summary)      # status=completed
  .close()                # كتابة نهائية + fingerprint
load_run_manifest(dir)    # قراءة manifest.json
validate_run(dir)         # فحص بنية
list_runs / compare_runs  # استعلام
```

**القفل:** `load_run` على run مفتوح → `RunTrackingError` "already open".

---

## 8.3 دورة حياة checkpoint

```text
# الحفظ
atomic_save_checkpoint(state, path)
  → tempfile في نفس المجلد
  → torch.save(payload, temp)
  → load_trusted_checkpoint(temp) للتحقق
  → os.replace(temp, path)   # ذري على POSIX/Windows الحديث

# الاستئناف
checkpoint = safe_load_training_checkpoint(path, map_location=...)
if checkpoint_is_compatible_for_continue_training(ckpt, config, vocab, tok):
    trainer.load(path)
else:
    retrain
```

---

## 8.4 دورة حياة تحميل HF

```text
load_any_model("org/model", device="cpu", trust_remote_code=False)
  → ExternalModelConfig
  → inspect / resolve source
  → transformers AutoModelForCausalLM.from_pretrained(...)
  → wrap ExternalLoadedModel(model, tokenizer, config, source_info, device)
  → .predict / .chat
  → (اختياري) save_loaded_model / export
```

**ملاحظة:** أول تحميل يملأ HF cache. `trust_remote_code=False` يمنع تنفيذ كود مخصص من الـ repo.

---

## 8.5 دورة حياة SFT

```text
JSONL records
  → get_sft_record_contract()
  → validate_sft_records(...)
  → train_sft(model=..., dataset=..., backend="huggingface")
       → تحميل base model (Hub)
       → بناء dataset (messages/prompt/instruction)
       → LoRA إن طُلب
       → Trainer داخلي HF
       → حفظ في output_dir
  → SFTTrainingResult
```

---

## 8.6 دورة حياة وكيل الأدوات

```text
@tool → Tool (schema + metadata)
ToolRegistry([...])
Agent(tools=..., model_adapter=..., config=...)
AgentRunner.run(session, prompt)
  loop:
    adapter → ModelResponse (ممكن tool_calls)
    for call in tool_calls:
        Tool.invoke → ToolResult
    until final or max_steps
Trace + session.messages
```

---

## 8.7 دورة حياة Web Studio

```text
WebConfig(host, port, dataset_roots)
  → validate transport إذا remote
create_app(config)
  → FastAPI app + routes
  → StudioWorkspace(JSON store)
  → StudioTrainingCoordinator / Studio3Coordinator
uvicorn.run / arclm web-api
```

التدريب: طلب HTTP → طابور في thread → Trainer → callbacks → حالة workspace.

---

## 8.8 دورة حياة Blocks

```text
manifests/<id>.json
  → analyze()   # AST + حدود
  → build()     # نسخ + توليد
  → distributions/<id>/
       src/arclm/...  (نسخ)
       pyproject.toml, README, INSTALLATION
       source-inventory.json (SHA-256)
  → check-drift  # مقارنة مع canonical
  → pip install distributions/<id>
```

---

## 8.9 دورة حياة الإصدار (PyPI)

```text
_version.py bump
  → CHANGELOG.md
  → python -m build
  → twine check
  → GitHub Release (trusted publishing)
     أو twine upload
```
