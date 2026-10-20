# 10 — تغطية التوثيق والتحقق

**تاريخ:** 2026-10-16  
**إصدار المرجع:** ArcLM 2.0.0

---

## 10.1 ما تم فحصه من الكود (مُتحقَّق)

| المنطقة | الأدلة |
|---|---|
| بنية الحزم وعدد الأسطر | عدّ Python AST على `src/arclm/**/*.py` |
| التحميل الكسول و`require_torch` | قراءة `__init__.py`, `utils/imports.py`, اختبارات light-import |
| Tokenizer build/encode | تنفيذ ميداني (T02) + قراءة `tokenizers/base.py` |
| Config / YAML | قراءة `configs/base.py` + serialization + T15 |
| datasets validate/dedupe | قراءة + تنفيذ T20 |
| Security redaction/status | قراءة + تنفيذ T07/T08/T21 |
| Agents @tool/runner | قراءة + تنفيذ T06 + مثال المستودع |
| tracking create_run/redact | قراءة + اختبارات `tests/tracking` + إصلاح `_redact_paths` |
| ArcLM forward | قراءة `causal_lm.py` + تنفيذ T04 |
| TrainingConfig/Trainer/train_model | قراءة source + T10 smoke |
| Compatibility functions | قراءة + منطق config فارغ → False |
| load_any_model/chat | قراءة `_external_loading.py` + T17/T19 |
| train_sft API | قراءة `sft.py` + manifest |
| Checkpoints/SmartLoader | قراءة `checkpoints/` |
| CLI commands | `arclm --help` + `cli.py` |
| Blocks builder | قراءة `build_arclm_distributions.py` + بناء ناجح سابق |
| Exceptions tree | قراءة `exceptions/base.py` |
| Distributed | قراءة `distributed.py` (تجريبي) |
| Web Studio | فحص وجود `create_app`/workspace/studio_* (لم يُشغَّل HTTP كاملاً في هذا التقرير) |
| Python 3.9–3.14 | 6 venvs محلية PASS على light smoke |

---

## 10.2 ما لم يُفحص بعمق في هذا التقرير

| البند | السبب |
|---|---|
| كل endpoint في `web/app.py` | حجم كبير؛ فُحص الهيكل فقط |
| واجهة Next.js `web/` | frontend منفصل |
| تفاصيل `workflow.py` / `config_schema.py` / `runs.py` | وحدات مساندة من lineage خاصة |
| QLoRA bitsandbytes فعلي | يتطلب hardware/إضافات |
| Studio HTTP تحت الحمل | اختبارات أداء غير منفذة هنا |
| أرقام benchmark | لا تُوجد نتائج مُقاسة منشورة — **لا تُختلق** |

---

## 10.3 تغطية رموز API الرئيسية

| الرمز | موثق في |
|---|---|
| Config, create_config, YAML/JSON | 03-core |
| Tokenizer, SentencePiece, Factory | 03-core |
| load_dataset, validate_records, deduplicate, DataPipeline | 03-core |
| redact_*, security_status, resolve_under_root, crypto | 03-core |
| tool, Agent, AgentRunner, SafeWebReader | 03+05 |
| create_run, set_reproducible_seed, list_runs, _redact_paths | 03-core |
| ArcLM, GPTBlock, SelfAttention, AutoModel | 04-training |
| TrainingConfig, Trainer, train_model, compat fns | 04-training |
| load_any_model, ExternalLoadedModel, _render_prompt | 04-training |
| train_sft, SFT contract | 04-training |
| atomic_save_checkpoint, SmartLoader | 04-training |
| Evaluator, metrics | 04-training |
| LoRA/QLoRA APIs | 04-training |
| inspect_text | 04-training |
| CLI main + أوامر | 06-cli-web |
| Blocks builder | 06-cli-web |
| OptionalDependencyError وشجرة الأخطاء | 09-errors |

---

## 10.4 ادعاءات لم تُختبر بالكامل

1. توافق **كل** نماذج Hub مع `load_any_model`.
2. جودة توليد SFT/LoRA على موديلات إرشادية حقيقية.
3. سلوك قوالب محادثة instruction-tuned (فقط tiny-gpt2 فُحص).
4. إنتاجية multi-GPU.

---

## 10.5 خاتمة التحقق

هذا التقرير يعتمد على:

- فحص AST ومقارنة رموز فعلية
- تنفيذ أمثلة مسجّلة في جلسة التطوير
- اختبارات الوحدة والـ smoke في المستودع

**لا يُدّعي 100% تغطية** لكل سطر في ~40 ألف سطر بايثون. المكونات غير المذكورة أعلاه غير موثقة هنا حتى تُفحص.

---

## 10.6 كيف تُحدَّث هذه الوثيقة

1. عند إضافة حزمة: أضف قسمًا في 03 أو 04.
2. عند تغيير `_EXPORTS` أو CLI: حدّث 01/06.
3. عند تغيير خوارزمية: حدّث 07.
4. سجّل دائمًا: مُتحقَّق vs مُستنتج vs غير متاح.
