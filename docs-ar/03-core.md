# 03 — الحزم الأساسية (بدون PyTorch)

جميع الحزم في هذا القسم تعمل بعد `pip install arclm` فقط (numpy + sentencepiece).

---

## 3.1 `arclm.configs`

### `class Config` — `configs/base.py`

**الغرض:** كيس إعدادات شامل لمسارات العمل (حجم النموذج، المسارات، الجهاز، نوع المقطّع).

**البناء:**

```python
Config(**kwargs)
```

حقول افتراضية رئيسية (من `create_config` و`__init__`):

| الحقل | الافتراضي | الدور |
|---|---|---|
| `embed_dim` | 64 | بُعد التضمين |
| `block_size` | 8 | طول السياق |
| `batch_size` | 64 | حجم الدفعة |
| `num_epochs` | 100 | العصور |
| `vocab_size` | `None` | يُضبط بعد بناء المقطّع |
| `learning_rate` | 1e-3 | معدل التعلم |
| `device` | `"cpu"` | الجهاز |
| `seed` | 42 | قيمة البذرة (لا تُزرع تلقائيًا) |
| `tokenizer_type` | `"word"` | نوع المقطّع |
| `model_path` | `output/model.pth` | مسار checkpoint |
| `data_path` | `data/data.txt` | مسار البيانات |

**دوال مهمة:**

| الدالة | الوصف |
|---|---|
| `get_device()` | يُحوِّل `self.device` إلى `torch.device` — **يتطلب torch** |
| `set_safe(**kwargs)` | ضبط خصائص مع تجاهل مفاتيح مجهولة (تحذير) وقص `vocab_size` |
| `to_dict()` | لقطة JSON-able |
| `load_config_from_model(path)` | دمج من artifact عبر `lifecycle.load_model_config` |

**ملاحظة تصميم (مُتحقَّق):** `create_config()` **لا** يستدعي `torch.manual_seed`. البذرة عبر `arclm.tracking.set_reproducible_seed`.

### دوال التسلسل — `configs/serialization.py`

| الدالة | البارامترات | الإرجاع | الأخطاء |
|---|---|---|---|
| `load_config_yaml(filepath: str)` | مسار | `Config` | `FileNotFoundError`, `ValueError` |
| `load_config_json(filepath: str)` | مسار | `Config` | نفس ذلك |
| `save_config_yaml(config, filepath)` | — | `None` | أخطاء IO |
| `save_config_json(config, filepath)` | — | `None` | |
| `load_config(filepath)` | حسب الامتداد | `Config` | |
| `create_example_configs()` | — | قاموس تكوينات | |

---

## 3.2 `arclm.tokenizers`

### `class Tokenizer` — `tokenizers/base.py`

```python
Tokenizer(max_vocab=50000, default_token="<UNK>", user_defined_symbols=None)
```

**المنطق الداخلي لـ `build(text)`:**

1. `text.split()` — تقسيم بالمسافات فقط (لا تحويل لحالة الأحرف).
2. `Counter` لعدد التكرارات.
3. الاحتفاظ بـ `max_vocab` الأكثر تكرارًا.
4. ملء: `vocab` (قائمة)، `stoi` (قاموس token→id)، `itos`، `token_counts`.

**دوال:**

| الدالة | الإدخال | الإرجاع |
|---|---|---|
| `encode_text(text)` | نص | `list[int]` — مجهول → فهرس `default_token` |
| `encode(tokens)` | قائمة رموز | `list[int]` |
| `decode(indices)` | قائمة | `list[str]` |
| `decode_string(indices)` | | `str` |
| `get_vocab_size()` | | `int` |
| `get_unknown_index()` | | `int` |
| `to_checkpoint()` | | dict للاستعادة |
| `analyze_coverage(tokens)` | | إحصاءات تغطية |

### `class SentencePieceTokenizer`

يغلّف مكتبة `sentencepiece`. الإعداد: `model_type` (مثل `"bpe"`)، `vocab_size`، `character_coverage`.

### `TokenizerFactory` / `AutoTokenizer`

- `TokenizerFactory.create(kind, **kwargs)`
- `TokenizerFactory.register(name, cls)`
- `create_tokenizer(kind, **kwargs)`
- `AutoTokenizer.from_config(config)` حسب `config.tokenizer_type`

---

## 3.3 `arclm.datasets`

### `load_dataset(source, **kwargs)`

| المصدر | السلوك |
|---|---|
| `list[dict]` | نسخ/تطبيع كسجلات |
| مسار `json/jsonl/csv/txt` | قراءة حسب الصيغة |
| `DatasetConfig` | تكوين مسبق |

**السجل (Record):** `dict` عادي، الحقل النصي المعتاد `"text"`.

### `validate_records(records, *, required_fields, ...)`

```python
validate_records(
    records,
    *,
    required_fields: Sequence[str],  # إلزامي
    field_types=None,
    allow_empty=False,
    strict=True,
    record_id_field=None,
) -> DatasetValidationResult
```

النتيجة تحمل `valid_count` وقائمة مشكلات.

### `deduplicate(dataset, *, return_result=False, **kwargs)`

مع `return_result=True` يُرجع `DeduplicationResult`:

- `dataset` — السجلات بعد الإزالة
- `kept` / `removed` — عدادان
- `duplicate_keys` — مفاتيح التكرار

الخوارزمية: `ExactDeduplicator` مع مفتاح نصي/تجزئة SHA من حقول السجل.

### `DataPipeline(steps)`

سلسلة `BaseDataStep`؛ `process(example)` تُرجع `None` لحذف السجل.

خطوات التنظيف (`cleaning/`): `StripText`, `NormalizeWhitespace`, `RemoveControlCharacters`, `RemoveEmptyText`, `FilterByLength`, `SelectFields`, `RenameFields`, `DropFields`, `TextCleaner`, `FilterStep`.

### `TextDataset` و`create_dataloader`

يحتاجان torch (مع fallback اختياري في `base.py`). `TextDataset` يبني نوافذ انزلاق `(x, y)` للمدرّة التنبؤية.

---

## 3.4 `arclm.security`

### إخفاء الأسرار — `redaction.py`

```python
redact_sensitive_text(text: str) -> str
redact_mapping(data: Mapping) -> dict
```

يحلّل أنماط مفاتيح API/tokens ويستبدلها بـ `[REDACTED]`.

**مُتحقَّق:**
```text
api_key=sk-test-1234567890 → api_key=[REDACTED]
token=ghp_abcdefghijklmnop → token=[REDACTED]
```

### المسارات — `paths.py`

```python
resolve_under_root(root, user_path) -> Path
```

يرفض الهروب بـ `..` عبر سياسة أمان.

### التشفير — `crypto/` (يتطلب `[security]`)

| الدالة | الوصف |
|---|---|
| `encrypt_bytes` / `decrypt_bytes` | AEAD |
| `encrypt_json` / `decrypt_json` | JSON + تشفير |
| `derive_key_argon2id` | اشتقاق مفتاح من كلمة مرور |
| `derive_subkey_hkdf` | مفتاح فرعي |

### التوقيع — `signatures.py`

`sign_manifest`, `verify_manifest`, `generate_signing_keypair`.

### `security_status()`

قاموس JSON عن إمكانات الأمان (توقيع، تشفير، web).

### CLI

```bash
arclm security status [--json]
arclm security audit
```

---

## 3.5 `arclm.agents`

### `@tool` — `agents/tool.py`

```python
@tool(category="utilities", **options)
def add_numbers(left: float, right: float) -> float:
    """Add two numbers."""
    return left + right
```

- الـ docstring = وصف الأداة للنموذج.
- type hints → JSON Schema عبر `schema_for_callable`.
- `Tool.from_callable(...)` مع خيارات: `name`, `side_effect`, `permission`, `timeout_seconds`, …

### `ToolRegistry`

تسجيل واسترجاع أدوات بالاسم.

### `Agent` / `AgentRunner` — `agent.py`, `runner.py`

- الحلقة محدودة بـ `max_steps`.
- النماذج عبر adapters في `model.py` (Callable, JSONToolCalling, ArcLMJSONToolAdapter).
- الصلاحيات: `permissions.py` + `SideEffectLevel`.
- الموافقات: `approvals.py` — `AutoApprovalHandler`, `DenyApprovalHandler`.
- الجلسات: `session.py` مع حد `max_messages`.
- الأخطاء: `errors.py` — `ToolError`, `ToolValidationError`, …

### أدوات مدمجة — `builtins/`

| الملف | الأدوات |
|---|---|
| `documents.py` | `read_text_file`, `create_read_text_file_tool`, محولات Markdown/HTML |
| `utilities.py` | `add`, `subtract`, `multiply`, `divide`, `power`, `current_datetime`, `text_statistics`, `parse_json`, `format_json` |
| `web.py` | `SafeWebReader`, `read_webpage` — يحجب المضيفين الخاصين |

### استيراد أمان دقيق (مُتحقَّق)

`agents/agent.py`:
```python
from arclm.security.configuration import SecurityPolicy
```
**لا** `from arclm.security import …` — حتى لا تنجذب حزمة agents إلى كل crypto.

---

## 3.6 `arclm.tracking`

### `set_reproducible_seed(seed, *, deterministic=False) -> dict`

1. `random.seed(seed)`
2. NumPy إن وُجد
3. torch إن وُجد (`manual_seed`, CUDA إن متاح)
4. يُرجع: `python_seeded`, `numpy_seeded`, `torch_cpu_seeded`, `torch_cuda_seeded`

بدون torch: `torch_cpu_seeded=False` ولا يرمي خطأ.

### `create_run(RunConfig) -> RunTracker`

```python
tracker = create_run(RunConfig(
    name="...",
    operation=RunOperation.TRAINING,
    storage=RunStorageConfig(root_directory=..., fsync=False),
))
tracker.start()
tracker.record_metric(metrics={"loss": 1.0}, step=1)
tracker.record_dataset(report, private_path=...)  # المسارات تُحجب
tracker.complete({...})
tracker.close()
```

### إخفاء المسارات — `_redact_paths`

أي مفتاح يحتوي `path|dir|directory|root|file` وقيمته نص → `"<path omitted>"`.

**مُتحقَّق:** `record_dataset` يستخدم `_redact_paths(metadata)` وليس `_json_safe` فقط (إصلاح تسريب).

### دوال أخرى

- `load_run_manifest(run_dir)`
- `list_runs(root, status=..., limit=100)`
- `validate_run(run_dir)`
- `compare_runs(paths, metric_name="loss")`

---

## 3.7 `arclm.search` (بحث معاملات فرط)

**ليس** بحث BM25/دلالي. يبني على tracking:

- `create_search`, `SearchSpace`, معاملات Choice/Integer/Float
- محاكم JSONL + `compare_trials`
- يستورد أنواع Training/FineTuning config من وحدات خفيفة

---

## 3.8 `arclm.logics`

تعليمي: `Symbol`, `Sentence`, `Not`, `And`, `Or`, `Implication`, `Biconditional`, `model_check`, `KnowledgeBase`.

---

## 3.9 `arclm.exceptions`

شجرة `ArcLMError` مع نحوًا من 28 فرعًا: `DatasetError`, `TrainingError`, `CheckpointError`, `OptionalDependencyError`, `FineTuningError`, …
