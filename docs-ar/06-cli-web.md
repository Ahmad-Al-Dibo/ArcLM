# 06 — سطر الأوامر والويب والأدوات

---

## 6.1 `arclm.cli` — `src/arclm/cli.py`

### نقطة الدخول

```python
def main() -> int:
    configure_cli_streams()  # errors="replace" على Windows
    parser = argparse.ArgumentParser(prog="arclm", ...)
    # --version
    subparsers = parser.add_subparsers(...)
    create_train_parser(...); create_eval_parser(...); ...
    args = parser.parse_args()
    return args.func(args)
```

### أوامر مُتحقَّق منها (`arclm --help`)

| الأمر | الدالة | torch؟ |
|---|---|---|
| `version` | `version_command` | لا |
| `info` | `info_command` | لا |
| `doctor` | `doctor_command` | لا |
| `config validate\|show\|migrate` | `config_*_command` | لا |
| `data validate\|analyze\|split\|…` | `data_*_command` | لا |
| `runs` | — | لا |
| `cache` | — | لا |
| `security status\|audit` | `security_status_command`, `security_audit_command` | جزئي |
| `train` | `train_command` | نعم |
| `eval` | `eval_command` | نعم |
| `generate` | `generate_command` | نعم |
| `chat` | `chat_command` | نعم |
| `run` | workflow | عادة |
| `web-api` | `web_api_command` | extra web |

### `_require_torch()`

في أوامر torch: استدعاء قبل الاستيراد الثقيل → `SystemExit` مع رسالة `pip install "arclm[train]"`.

### `resolve_cli_device(device)`

- `"auto"` → cuda إذا متاح وإلا cpu
- `"cuda"` بدون CUDA → `ValueError`

### `chat_command` — منطق المحادثة

```python
messages = []
if system_prompt: messages.append({"role": "system", ...})
loop:
    prompt = input("You: ")
    messages.append({"role": "user", "content": prompt})
    response = model.chat(messages, max_new_tokens=..., temperature=...)
    messages.append({"role": "assistant", "content": response})
    print(f"ArcLM: {response}")
```

النماذج تُنسخ قبل `chat` (لا تعديل mutable غير مقصود).

---

## 6.2 `arclm.web` — FastAPI Studio

### `create_app(config: WebConfig)`

- `WebConfig`: host, port, expose_docs, dataset_roots
- يتحقق من سياسة النقل عند الربط البعيد (security fail-closed)
- `DatasetRoot` — جذر بيانات آمن مع معرّفات

### `workspace.py` — `StudioWorkspace`

حالة JSON على القرص: مشاريع، datasets، tokenizers، models، runs.

### `studio_training.py` — `StudioTrainingCoordinator`

- وظائف خلفية مع إلغاء تعاوني
- يستخدم `Trainer` + `TrainingConfig` (يحتاج torch)
- callbacks لحفظ metrics/events

### `studio3.py` — `Studio3Coordinator`

فحص checkpoints، تقييم، توليد، مقارنة — ينسق مع evaluation/inference.

### أمان الويب

`security/web/`: CORS, CSRF, headers, transport validation.

---

## 6.3 Blocks — `tools/build_arclm_distributions.py`

### خوارزمية `analyze(manifest)`

1. توسيع `include_modules` (حزم → ملفات)
2. حلقة BFS على `module_import_edges` (AST)
3. استيراد داخل دالة/فئة = **optional** edge
4. استيراد module-level إلى `excluded_module_prefixes` = **خطأ حظر**
5. هدف غير محلّي غير محل = unresolved

### `build(edition)`

1. تنظيف مجلد الإخراج
2. نسخ الوحدات + assets + examples
3. توليد `__init__.py`, `__main__.py`, `cli.py`, `_distribution.py`
4. كتابة pyproject, README, INSTALLATION (بما فيها git+subdirectory), inventories

### أوامر

```text
list | graph | inspect | build <id> | build-all | verify | test-all | check-drift
```

**7 Blocks:** core, training, finetuning, loading-inference, evaluation-benchmarks, agents-tools, security.

---

## 6.4 أمثلة وLab

### `examples/run_examples.py`

- `list`, `run <id>`, `run-category`, `run-verified`, `status`
- `manifest.json` = مصدر الحقيقة للحالات

### `lab/runner.py`

```text
python -m lab.runner list|show|test|test-level|test-all
```

32 تحدٍّ: beginner → expert.

---

## 6.5 تتبع التجارب من CLI/Python

مرجع سريع:

```python
from arclm.tracking import create_run, RunConfig, RunOperation, RunStorageConfig
from arclm.tracking import set_reproducible_seed, list_runs, compare_runs
```

انظر [03-core.md § tracking](03-core.md#36-arclmtracking).
