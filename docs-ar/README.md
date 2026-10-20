# التقرير التقني الشامل لإطار عمل ArcLM

**الإصدار:** 2.0.0  
**تاريخ التقرير:** 2026-10-16  
**فرع الكود:** `cleanup-2.0`  
**الرخصة:** Apache-2.0  
**اللغة:** تقرير تقني بالعربية — أسماء الرموز البرمجية تبقى بالإنجليزية كما في الكود

---

## فهرس التقرير

| الملف | المحتوى |
|---|---|
| [01-architecture.md](01-architecture.md) | البنية العامة، نموذج التنفيذ، تدفق البيانات |
| [02-structure.md](02-structure.md) | خريطة الملفات والحزم الدقيقة |
| [03-core.md](03-core.md) | الحزم الأساسية (بدون PyTorch) |
| [04-training.md](04-training.md) | حزمة التدريب والنماذج والاستدلال |
| [05-agents-security.md](05-agents-security.md) | الوكلاء والأمان |
| [06-cli-web.md](06-cli-web.md) | سطر الأوامر والويب والأدوات |
| [07-algorithms.md](07-algorithms.md) | الخوارزميات والمنطق الداخلي |
| [08-lifecycle.md](08-lifecycle.md) | دورة الحياة والتنفيذ خطوة بخطوة |
| [09-errors.md](09-errors.md) | معالجة الأخطاء والتحقق |
| [10-coverage.md](10-coverage.md) | تغطية التوثيق والحالات غير المؤكدة |

---

## 1. نظرة عامة تقنية

ArcLM إطار عمل Python مدمج لأتمتة سير عمل النماذج اللغوية:

- **الحزم المطلوبة فقط:** `numpy` و`sentencepiece` (~50 ميغابايت).
- **PyTorch اختياري** عبر extra الاسم `train`.
- **نقطة الدخول:** `arclm.cli:main` أو `import arclm` (تحميل كسول).

### نموذج التنفيذ

1. المستخدم يستورد `arclm` → يُحمَّل `__init__.py` فقط مع خريطة تصدير كسولة (`_EXPORTS`).
2. أول وصول لاسم عام → `__getattr__(name)` → `import_module` للوحدة الفرعية.
3. الحزم الثقيلة تستدعي `require_torch()` قبل `import torch` وإلا تُرمي `OptionalDependencyError`.

### إحصائية تقريبية للمصدر (بدون `__pycache__`)

| الحزمة/المجلد | عدد الملفات | أسطر تقريبية |
|---|---|---|
| ملفات جذر `src/arclm/*.py` | 21 | ~10,100 |
| `web` | — | ~5,700 |
| `training` | — | ~2,970 |
| `finetuning` | — | ~2,510 |
| `inference` | — | ~2,040 |
| `agents` | 25 | ~2,640 |
| `datasets` | 16 | ~2,120 |
| `security` | — | ~1,670 |
| `search` | 1 | ~1,505 |
| `checkpoints` | 11 | ~1,470 |
| `peft` | — | ~1,340 |
| `lifecycle` | — | ~1,150 |
| `evaluation` | — | ~970 |
| `configs` | 2 | ~270 |
| `models` | — | ~380 |
| `tokenizers` | — | ~520 |
| `logics` | — | ~530 |
| `utils` | — | ~330 |
| `exceptions` | — | ~134 |

---

## 2. روابط سريعة

- [التحميل الكسول و`require_torch`](01-architecture.md#lazy)
- [خريطة الحزم](02-structure.md)
- [`ExternalLoadedModel` وقوالب المحادثة](04-training.md#hf)
- [إخفاء المسارات في `tracking`](07-algorithms.md#redact)
- [توافق الـ checkpoints](07-algorithms.md#compat)
