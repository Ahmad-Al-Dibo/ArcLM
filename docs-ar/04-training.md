# 04 — حزمة التدريب والنماذج والاستدلال

جميع الحزم هنا تتطلب `pip install "arclm[train]"` (torch) ما لم يُذكر غير ذلك.

---

## 4.1 `arclm.models`

### `class ArcLM` — `models/text/causal_lm.py`

نموذج GPT قاعدي سببية (Causal LM).

```python
ArcLM(vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0)
```

**البنية الداخلية:**

1. `token_embedding = nn.Embedding(vocab_size, embed_dim)`
2. `position_embedding = nn.Embedding(block_size, embed_dim)`
3. `dropout`
4. `blocks = nn.Sequential(*[GPTBlock(...) for _ in range(num_blocks)])`
5. `ln = nn.LayerNorm(embed_dim)`
6. `head = nn.Linear(embed_dim, vocab_size)`

### `class GPTBlock`

```python
x = x + self.attn(self.norm1(x))   # pre-norm attention
x = x + self.ff(self.norm2(x))    # pre-norm FFN
```

FFN: `Linear → GELU → Linear → Dropout`.

### `class SelfAttention`

- Query/Key/Value: `nn.Linear(embed_dim, embed_dim)`
- `scores = (Q @ K.T) / sqrt(C)`
- قناع سببي: `torch.tril(ones(T,T))` — mask==0 → `-inf`
- `softmax` ثم `weights @ V`

### `forward(idx)`

| الإدخال | `(batch, time)` tensor صحي |
|---|---|
| التحقق | rank==2، batch/time > 0، T ≤ `block_size`، ids ∈ [0, vocab) |
| الإخراج | logits `(batch, time, vocab_size)` |

دوال أخرى: `get_input_embeddings()`, `get_num_parameters()`.

**ملاحظة:** `MiniGPT` حُذف في 2.0 — استخدم `ArcLM` فقط.

### `AutoModel`

- `from_config(config)` — يقرأ `vocab_size` (إلزامي) وقيم اختيارية.
- `from_name(name, **kwargs)` — `"arclm"` أو `"causal_lm"` فقط.

---

## 4.2 `arclm.training`

### `class TrainingConfig` — `training/config.py`

Dataclass مُتحقَّق منه (مختلف عن `arclm.configs.Config`):

| الحقل | الافتراضي | التحقق |
|---|---|---|
| `epochs` | 3 | > 0 |
| `batch_size` | 8 | > 0 |
| `precision` | `"fp32"` | ∈ {fp32, fp16, bf16} |
| `optimizer` | `"adamw"` | ∈ {adamw, adam, sgd} |
| `scheduler` | `"cosine"` | ∈ {constant, linear, cosine} |
| `max_grad_norm` | — | ≥ 0 إن حُدد |

الدوال: `to_dict()`, `from_dict(values)`. الأخطاء: `TrainingConfigError`.

### `class Trainer` — `training/trainer.py` (~1382 سطر)

```python
Trainer(model, config=None, callbacks=None)
```

- واجهة قديمة: `train(loader, epochs)`
- واجهة حديثة: `train_dataset(train_loader, val_loader=None)`
- `save(...)`, `load(...)`, `add_callback`

يستورد `DistributedDataParallel` من `torch.nn.parallel` مباشرة.

### `train_model(...)` — `training/pipeline.py`

```python
train_model(mode, data, output, checkpoint=None, config=None, ...)
```

- الأوضاع: `pre_training` | `fine_tuning` | `instruction_tuning`
- يعيد نتيجة تاريخ (`history["train_losses"]`) و`model_path`

### توافق checkpoints

| الدالة | الشروط | config فارغ |
|---|---|---|
| `checkpoint_is_compatible_for_continue_training` | vocab + shape + tokenizer + learning_rate/weight_decay/dropout/validation_split | **False** |
| `checkpoint_is_compatible_for_tuning` | shape + tokenizer (LR مسموح مختلف) | **False** |

منطق مشترك: `_checkpoint_base_compatible` — بدون config مسجل لا تُعتبر متوافقة.

### `load_compatible_checkpoint(trainer, config, vocab_size, tokenizer=None)`

يُحمّل من `config.model_path` إذا كان متوافقًا؛ وإلا تحذير وإعادة تدريب.

### Regularization — `training/regularization.py`

`L1Regularization`, `L2Regularization`, `EarlyStopping`, `LearningRateScheduler`, `LabelSmoothing`, `MixupAugmentation`, `GeneralizationMonitor`, `Dropout`.

---

## 4.3 `arclm.inference`

### `load_model(path, device=...)`

تحميل checkpoint أصلي → `LoadedModel` مع `.predict`.

### `load_any_model(source, **kwargs)` — `_external_loading.py`

```python
load_any_model(source: PathLike, **kwargs) -> ExternalLoadedModel
```

- `device="cpu"`، `trust_remote_code=False` (افتراض آمن)
- يدعم مسارات محلية + معرفات Hub

### `class ExternalLoadedModel`

| الطريقة | الوصف |
|---|---|
| `predict(prompt, **kw)` | توليد نص |
| `generate(prompt, **kw)` | نفس المسار (أصلي أو HF) |
| `chat(messages, **kw)` | رسائل OpenAI-style |
| `batch_predict(prompts)` | دفعة |
| `to(device)` | نقل الجهاز |
| `save` / `save_pretrained` / `export` | تصدير |

### منطق `_render_prompt` (محادثة)

1. تحويل إلى `messages` (`_prompt_to_messages`)
2. إذا كان للتوكنizer `chat_template` → `apply_chat_template(messages, tokenize=False, add_generation_prompt=...)`
3. عند TypeError: إعادة محاولة بدون `enable_thinking`
4. وإلا: `_messages_to_simple_text` — `"role: content\n"` + `"assistant:"`

**مُتحقَّق على:** `sshleifer/tiny-gpt2` — load ~39s أول مرة، generate ~1–2s.

---

## 4.4 `arclm.finetuning`

### `train_sft(...)` — `finetuning/sft.py`

```python
train_sft(model, dataset, output_dir, *, backend="huggingface", use_lora=False, lora_r=8, trust_remote_code=False, ...)
```

- صيغ JSONL: `messages` | `prompt`/`completion` | `instruction`/`output`
- `trust_remote_code` افتراض False
- عائد: `SFTTrainingResult` مع `output_dir` وغيره

### عقد السجلات

- `get_sft_record_contract()`
- `validate_sft_records(records, contract=...)`
- `prepare_fine_tuning_dataset(records, config=FineTuningConfig())`

### `FineTuningConfig` / `SFTConfig`

`finetuning/config.py` — `SFTConfig` يرث `TrainingConfig`. `FineTuningMode`: `CAUSAL_LM`, `SFT`.

---

## 4.5 `arclm.checkpoints`

### حفظ/تحميل — `training.py`

| الدالة | السلوك |
|---|---|
| `atomic_save_checkpoint(state, path, …)` | كتابة ملف مؤقت → تحقق → `os.replace` |
| `safe_load_training_checkpoint(path, map_location=…)` | مسار تحميل موثوق |
| `inspect_checkpoint`, `validate_checkpoint` | فحص |

### SmartLoader — `loaders/smart_loader.py`

| الفئة | الدور |
|---|---|
| `SmartLoader` | فحص المصدر ثم التحميل |
| `LoadPlan` | خطة تحميل + `apply_overrides` |
| `DefaultModelInspector` | كشف نوع الأوزان/الموديل |
| `ModelInspector` | واجهة قابلة للتوسعة |

### Loaders مسجلة

`ArcLMCheckpointLoader`, `HuggingFaceLoader`, `SafetensorsLoader`, `StateDictLoader` عبر `LoaderRegistry`.

### توافق التوكنizer — `adapters.py`

`adapt_for_training`, `validate_tokenizer_compatibility`, `config_from_checkpoint`.

---

## 4.6 `arclm.evaluation`

### `Evaluator`

```python
Evaluator(model, metrics=[Accuracy(), Perplexity()], config=...)
result = evaluator.evaluate(loader)
```

مقاييس: `Accuracy`, `LossMetric`, `Perplexity`. تصدير: `export_metrics_to_json`, `export_metrics_to_markdown`.

تشخيص: `predict_top_k`, `build_training_diagnostics_report`, `score_concept_relationships`, …

---

## 4.7 `arclm.peft`

| الرمز | الوصف |
|---|---|
| `LoRAConfig`, `apply_lora`, `merge_lora`, `unmerge_lora` | LoRA |
| `get_lora_state_dict` | حالة adapters |
| `save_adapter_artifact`, `load_adapter_artifact` | ملفات adapter |
| `QLoRAConfig`, `prepare_model_for_qlora`, `load_quantized_model` | QLoRA (يحتاج `[qlora]`) |

`peft/__init__.py` تحميل كسول — أنواع config من `peft.config` بدون torch.

---

## 4.8 `arclm.inspection`

```python
inspect_text(model, tokenizer, text, **kwargs) -> PipelineTrace
```

يتتبع: token ids → embeddings → forward → logits → decode. بيانات وصفية (shapes) لا tensors كاملة.

---

## 4.9 `arclm.lifecycle`

حفظ/تحميل artifacts نموذج مع metadata: `save_model_artifact`, `load_model_artifact`, `inspect_model_artifact`.
