# 01 — البنية العامة ونموذج التنفيذ

## 1.1 الغرض من الإطار

ArcLM مكتبة Python مدمجة لـ:

1. تحميل وتنظيف والتحقق من بيانات النصوص المحلية.
2. تقطيع النصوص إلى رموز (Tokenization).
3. تدريب نموذج GPT أصلي صغير (اختياري — يتطلب `arclm[train]`).
4. تحميل نماذج Hugging Face وتوليد النصوص.
5. Fine-tuning بإشراف (SFT) مع دعم LoRA اختياري.
6. تشغيل وكلاء (Agents) بأدوات مكتوبة بنوعيات (Type Hints).
7. أمان: إخفاء الأسرار، تشفير، توقيع، سياسات.
8. تتبع التجارب المحلية (Runs) دون سحابة.

## 1.2 المعمارية الحقيقية (لا المثالية)

ArcLM **حزمة واحدة** `arclm` مقسمة حسب النطاق (Domain) إلى حزم فرعية.

### الطبقات

```text
┌─────────────────────────────────────────────────────┐
│ نقاط الدخول: CLI | python -m arclm | import arclm   │
│              arclm.web.create_app (FastAPI)         │
├──────────────────────┬──────────────────────────────┤
│  النواة (لا torch)   │  حزمة التدريب (torch)        │
│  configs             │  models                      │
│  datasets            │  training                    │
│  tokenizers          │  inference                   │
│  security            │  finetuning                  │
│  agents              │  checkpoints                 │
│  tracking            │  evaluation                  │
│  search (HPO)        │  peft                        │
│  logics              │  inspection                  │
│  exceptions/utils    │  lifecycle / distributed*    │
├──────────────────────┴──────────────────────────────┤
│ تبعيات خارجية اختيارية: transformers, cryptography, │
│ flask/fastapi, peft, bitsandbytes, whisper           │
└─────────────────────────────────────────────────────┘
```

\* `distributed` تجريبي (عقود DDP/FSDP).

### حدود الاعتماد (Dependency Direction)

| من | إلى | مسموح؟ |
|---|---|---|
| أي حزمة | `exceptions`, `utils`, `registry` | نعم |
| `datasets` | `configs`, `tokenizers`, `exceptions` | نعم |
| `agents` | `security.configuration` (استيراد دقيق) | نعم |
| حزم النواة | `web` | **لا** |
| حزم خفيفة | `import torch` على مستوى الوحدة | **لا** |
| `training` | `models`, `datasets`, `checkpoints` | نعم (بعد `require_torch`) |

## 1.3 التحميل الكسول (Lazy Loading) <a id="lazy"></a>

**الملف:** `src/arclm/__init__.py`

- `_EXPORTS: dict[str, str]` يربط ~230 اسمًا عامًا بمسار وحدة.
- `__getattr__(name)`:

```python
def __getattr__(name: str) -> Any:
    if name in _EXPORTS:
        module = import_module(_EXPORTS[name])
        value = getattr(module, name)
        globals()[name] = value  # ذاكرة مؤقتة
        return value
    raise AttributeError(...)
```

- `__all__` = أسماء الدوال المساعدة + مفاتيح `_EXPORTS` مرتبة.
- `__init__.pyi` يطابق الخريطة لفحص الأنواع.

**آلية `require_torch`:** الملف `src/arclm/utils/imports.py`

```python
def require_optional_dependency(package_name, feature_name, install_extra):
    try:
        available = importlib.util.find_spec(package_name) is not None
    except (ImportError, ModuleNotFoundError, ValueError):
        available = False
    if available:
        return
    raise OptionalDependencyError(...)

def require_torch(feature_name="This feature"):
    require_optional_dependency("torch", feature_name, "train")
```

كل حزمة ثقيلة (`models`, `training`, `inference`, …) تستدعي `require_torch` **قبل** `import torch`.

**اختبار العقد:** `tests/unit/test_light_imports.py` يحجب `torch` عبر `sys.meta_path` ويطبق استيراد الحزم الخفيفة.

## 1.4 تدفق البيانات الرئيسي — تدريب أصلي

```text
ملف نصي / سجلات (list[dict])
  → datasets.load_dataset / prepare_data
  → tokenizer.build / encode_text  (قائمة معرفات)
  → DataLoader (torch) أو نوافذ انزلاق TextDataset
  → Trainer.train_dataset  أو  train_model(mode=...)
  → حلقة: forward → loss → backward → optimizer.step
  → callbacks (checkpoint, logging, tracking)
  → atomic_save_checkpoint / Trainer.save
  → (اختياري) safe_load_training_checkpoint للاستئناف
  → (اختياري) Evaluator.evaluate
```

## 1.5 تدفق استدلال Hugging Face

```text
load_any_model(source, device, trust_remote_code=False)
  → فحص المصدر (محلي / Hub / safetensors)
  → بناء ExternalLoadedModel
  → .predict / .generate
       ├─ مسار أصلي: native generate (إذا كان ArcLM)
       └─ مسار HF: tokenizer → model.generate
  → .chat(messages)
       ├─ إذا tokenizer.chat_template: apply_chat_template
       └─ وإلا: نص بسيط "role: content\n...assistant:"
```

**مصدر المنطق:** `src/arclm/inference/_external_loading.py`  
دوال: `_render_prompt`, `_prompt_to_messages`, `_messages_to_simple_text`, `ExternalLoadedModel.chat`.

## 1.6 تدفق الوكيل (Agent)

```text
User intent
  → Agent / AgentRunner
  → model adapter (Callable / JSONToolCalling / ArcLM)
  → استدعاء أداة: Tool.invoke(args, context)
       → فحص Schema من type hints
       → صلاحيات + SideEffectLevel + موافقات
       → تنفيذ الدالة
  → نتائج تُضاف إلى الجلسة
  → تكرار حتى رد نهائي أو max_steps
  → Trace (مع redact اختياري)
```

## 1.7 نقاط الدخول

| الدخول | الملف | ملاحظات |
|---|---|---|
| سطر الأوامر | `cli.py` → `main()` | معالجة streams لـ Windows |
| الوحدة | `__main__.py` | يستدعي `cli.main` |
| المكتبة | `import arclm` | كسول |
| الويب | `web.app.create_app` | FastAPI + optional deps |

## 1.8 ملفات الإعداد المهمة

| الملف | الدور |
|---|---|
| `pyproject.toml` | التبعيات، extras، entry point، pytest markers |
| `src/arclm/_version.py` | `__version__="2.0.0"` و`__api_version__` |
| `distributions/manifests/*.json` | تعريفات Blocks |
| `.github/workflows/ci.yml` | وظائف CI (خفيف + torch) |
