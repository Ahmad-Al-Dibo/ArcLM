# 09 — معالجة الأخطاء والتحقق والأمان والأداء

---

## 9.1 شجرة الاستثناءات — `arclm.exceptions`

```text
ArcLMError
├── ConfigurationError
├── OptionalDependencyError
├── TokenizerError
├── DatasetError
│   ├── DatasetLoadError
│   ├── DatasetValidationError
│   ├── DatasetFormatError (ValueError)
│   ├── PipelineError
│   ├── CleaningError
│   ├── DeduplicationError
│   ├── DatasetVersionError
│   └── StreamingError
├── TrainingError
│   ├── TrainingConfigError
│   └── PrecisionError
├── CheckpointError
├── ModelError
│   ├── UnsupportedModelError (ValueError)
│   └── ModelCompatibilityError (ValueError)
├── EvaluationError
│   ├── EvaluationConfigError
│   └── MetricError
├── FineTuningError
│   ├── SFTConfigError
│   ├── ModelAdapterError
│   ├── TokenizerAdapterError
│   ├── FormattingError
│   └── DataCollatorError
└── InferenceError
```

أخطاء agents منفصلة في `agents/errors.py`: `AgentRuntimeError`, `ToolError`, `ToolSchemaError`, `ToolValidationError`, `ApprovalError`, `ModelResponseError`.

أخطاء security في `security/errors.py`: `SecurityError`, `EncryptionError`, `DecryptionError`, `SignatureError`, `ManifestError`, …

---

## 9.2 `OptionalDependencyError` — العقد

**السبب الرئيسي:** `require_torch` / `require_optional_dependency`.

**الرسالة تحتوي:**
1. اسم الميزة
2. اسم حزمة PyPI
3. أمر التثبيت: `pip install "arclm[train]"`

**الاختبار:** `tests/unit/test_light_imports.py` يحجب torch ويطبق استيراد الحزم الخفيفة + يتحقق أن الحزم الثقيلة تفشل بالرسالة الصحيحة.

---

## 9.3 التحقق من المدخلات

| الموقع | الآلية |
|---|---|
| `ArcLM.forward` | rank, dims, block_size, token range |
| `TrainingConfig.__post_init__` | epochs, precision, optimizer, … |
| `validate_records` | حقول إلزامية وأنواع |
| `validate_sft_records` | عقد SFT |
| `_metric_values` | مقاييس رقمية محدودة، ت finitie |
| `_bounded_payload` | حد عدد مفاتيح الحدث |
| security paths | `resolve_under_root` |
| agents schema | تحقق الأنواع قبل invoke |

---

## 9.4 سيناريوهات فشل

| الحالة | النتيجة |
|---|---|
| استيراد models بدون torch | `OptionalDependencyError` |
| device="cuda" بدون CUDA | `ValueError` / ConfigurationError |
| checkpoint config فارغ | دوال التوافق False → إعادة تدريب |
| JSONL تالف | `DatasetLoadError` / FormatError |
| مفتاح تشفير مفقود | `EncryptionError` / KeyManagementError |
| run مفتوح مرتين | `RunTrackingError` "already open" |
| حدث > MAX_EVENT_PAYLOAD_KEYS | `RunTrackingError` |
| sequence > block_size | `ValueError` من `ArcLM.forward` |
| approval مرفوض | `ApprovalError` / رفض الأداة |

---

## 9.5 حدود الأمان

| الضابط | التنفيذ |
|---|---|
| `trust_remote_code=False` | افتراض في `load_any_model` |
| Path sandbox | `resolve_under_root` |
| Redaction | نصوص + مسارات run manifests |
| Web remote bind | فحص سياسة transport |
| Agents builtins | حظر مضيفين خاصين |
| Checkpoint load | مسار trusted فقط |
| Secrets | لا تُسجل مفاتيح؛ `.env` gitignored |

---

## 9.6 الأداء وإدارة الموارد

| المنطقة | ملاحظة |
|---|---|
| Lazy imports | `import arclm` سريع |
| Streaming datasets | `BaseStreamingDataset` لملفات كبيرة |
| Data sharding | تقسيم deterministic |
| Cache | `cache.py` — JSON على القرص |
| Atomic save | تجنّب نصف الكتابة |
| Dropout/precision | إعدادات `TrainingConfig` |
| Batch / block_size | أكبر = ذاكرة أكبر |
| tiny-gpt2 | fixture للاختبار لا للجودة |

---

## 9.7 التسجيل (Logging)

- CLI: `print` مع reconfigure streams
- Agents: traces قابلة للإخفاء
- Tracking: JSONL events (ليس logging نصي حر)
- لا يوجد نظام logging مركزي مفرض — تطبيقات المستخدم تربط output
