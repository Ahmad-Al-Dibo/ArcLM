# 07 — الخوارزميات والمنطق الداخلي

---

## 7.1 قناع الانتباه السببي (Causal Attention)

**الملف:** `models/text/causal_lm.py` — `SelfAttention.forward`

```text
B, T, C = x.shape
Q, K, V = query(x), key(x), value(x)
scores = (Q @ K^T) / sqrt(C)
mask = tril(ones(T, T))
scores = scores.masked_fill(mask == 0, -inf)
weights = dropout(softmax(scores))
output = weights @ V
```

**التعقيد:** O(T²·C) للانتباه + O(T·C²) للـ projections.  
**القناع:** يمنع التنبؤ بالمستقبل (سببية).

---

## 7.2 بناء المفردات (Tokenizer.build)

```text
tokens = text.split()
counts = Counter(tokens)
top = counts.most_common(max_vocab)
stoi = {tok: i for i, (tok, _) in enumerate(top)}
```

مجهول → `default_token`. لا lowercase.

---

## 7.3 التحقق من السجلات

`validate_records`:

```text
لكل سجل:
  لكل حقل مطلوب:
    إذا غائب → issue
    إذا فارغ و allow_empty=False → issue
    إذا field_types محدد ونوع خاطئ → issue
  عدّ valid_count
```

---

## 7.4 إزالة التكرار الدقيق

`ExactDeduplicator.deduplicate`:

```text
seen = set()
kept = []
for record:
    key = _key(record)   # نص/تجزئة حسب الحقول
    if key not in seen:
        seen.add(key)
        kept.append(record)
    else:
        removed += 1
        duplicate_keys.append(key)
return DeduplicationResult(kept, removed, keys)
```

---

## 7.5 تحليل مسار الحزمة (Blocks AST)

**الملف:** `tools/build_arclm_distributions.py`

`ImportVisitor` يزور `ast.Import` / `ast.ImportFrom`:

- استيراد module-level → edge غير اختياري
- استيراد داخل `FunctionDef`/`ClassDef` (`_scope_depth > 0`) → edge اختياري

`local_module_candidates("arclm.foo.bar")` يبحث أطول مسار موجود على القرص.

`is_excluded(module, manifest)` — مطابقة prefix.

---

## 7.6 إخفاء المسارات

**الملف:** `tracking.py` — `_redact_paths`

```text
إذا Mapping:
    لكل (key, value):
        إذا key يحتوي path|dir|directory|root|file (case-insensitive)
           و value نص/Path:
              redacted[key] = "<path omitted>"
           وإلا:
              recurse
إذا list: recurse
إلا: _json_safe(value)
```

يُستخدم في `_bounded_payload` (أحداث) و`record_dataset` (metadata).

---

## 7.7 توافق Checkpoint

### `_checkpoint_base_compatible`

```text
checkpoint_config = checkpoint.get("config") or {}
if not checkpoint_config:
    return incompatible  # قاعدة 2.0

same_vocab = checkpoint.vocab_size == vocab_size
same_shape = config.embed_dim/block_size/num_blocks تطابق المسجل
same_tokenizer = tokenizer_type + sentencepiece_type (+ stoi/vocab إذا أُمر)
return (ok, config, same_vocab, same_shape, same_tokenizer)
```

### continue_training

يشترط أيضًا: `learning_rate`, `weight_decay`, `dropout`, `validation_split` مساوية للمسجلة.

### tuning

لا يشترط LR مساويًا؛ يشترط weight_decay/dropout/validation_split.

---

## 7.8 بذرة إعادة الإنتاج

`set_reproducible_seed`:

```text
random.seed(seed)
try numpy.random.seed(seed)
try:
    torch.manual_seed(seed)
    if cuda: torch.cuda.manual_seed_all(seed)
    if deterministic: torch.use_deterministic_algorithms(True, warn_only=True)
return { flags... }
```

---

## 7.9 توليد المحادثة — `_render_prompt`

```text
messages = _prompt_to_messages(prompt, default_system)
if tokenizer has chat_template:
    try apply_chat_template(tokenize=False, add_generation_prompt, enable_thinking?)
    except TypeError: retry without enable_thinking
    except Exception: fallback or raise
if prompt is str and no system: return raw string
return _messages_to_simple_text(messages)
```

---

## 7.10 حلقة التدريب (نظرة عامة)

`Trainer.train_dataset` (مسار منطقي):

```text
for epoch in epochs:
    for batch in train_loader:
        optimizer.zero_grad()
        logits = model(x)
        loss = criterion(logits, y)
        loss.backward()
        clip_grad_norm_(max_grad_norm)
        optimizer.step()
        scheduler.step()
        callbacks: on_log / on_step
        tracker.record_metric(loss)
    callbacks: on_epoch_end
    validation optional
    checkpoint callbacks
```

(التفاصيل الدقيقة في `trainer.py` — 1382 سطر.)

---

## 7.11 تجزئة البيانات الشبكية (Sharding)

`data_quality.py`: تقسيم مDeterministic عبر hash للاستعادة والاتساق بين عمليات.

---

## 7.12 تدقيق الأمان

`security/audit.py`:

- inventory أصول
- threat model (تهديد → تخفيف)
- يُعرض عبر `arclm security audit`
