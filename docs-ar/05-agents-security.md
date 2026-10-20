# 05 — الوكلاء والأمان (تفصيل داخلي)

---

## 5.1 هيكل الوكيل

### `class Agent` — `agents/agent.py`

يحمل:
- model adapter
- tools / registry
- `AgentConfig`
- `SecurityPolicy` (من `security.configuration` — استيراد دقيق)

خاصية `config` تُرجع `AgentConfig` مع قيم افتراضية آمنة.

### `class Tool` — `agents/tool.py`

| العنصر | المصدر |
|---|---|
| الاسم | `name` أو اسم الدالة |
| الوصف | docstring |
| المخطط | `schema_for_callable` من type hints |
| `side_effect` | `SideEffectLevel` |
| `permission` | `ToolPermission` |
| `invoke(args, context)` | تحقق + تنفيذ → `ToolResult` |

الديكوريتر:

```python
def tool(function=None, **options):
    def decorate(target):
        return Tool.from_callable(target, **options)
    ...
```

### `class AgentRunner` — `agents/runner.py`

حلقة مقيدة:

```text
while step < max_steps and not done:
    response = model_adapter(messages, tools, instructions)
    if no tool calls: final answer; break
    for each tool_call:
        validate args against schema
        check permission / approval
        result = tool.invoke(...)
        append tool result to messages
```

الجلسات: `AgentSession` مع `max_messages` (افتراض 100).

### Adapters — `agents/model.py`

| الفئة | السلوك |
|---|---|
| `CallableModelAdapter` | يستدعي أي callable |
| `JSONToolCallingAdapter` | بروتوكول JSON للأدوات |
| `ArcLMJSONToolAdapter` | تكامل ArcLM |

### التتبع — `agents/tracing.py`, `context.py`

- `ToolContext.check_cancelled()`, `safe_metadata()`
- إمكان تطبيق `redact_mapping` على تتبع الأداة

### مدمجات — `builtins/documents.py`

`read_text_file` + أمان مسارات (workspace root + امتدادات).  
محولات: `markdown_to_text/document/json`, `html_to_*` عبر `_SafeHTMLParser`.

### `builtins/web.py` — `SafeWebReader`

- `read(url)` — HTTP مع تحويلات محدودة
- يحجب أسماء مضيفين خاصة (localhost, 127.*, 10.*, 192.168.*, etc.)

---

## 5.2 الأمان — تفصيل

### طبقات `arclm.security`

| الطبقة | الملفات | الدور |
|---|---|---|
| إخفاء | `redaction.py` | أنماط سرية → `[REDACTED]` |
| مسارات | `paths.py` | `resolve_under_root` |
| شبكة | `network.py` | التحقق من URLs |
| تجزئة | `hashing.py` | `hash_bytes`, `hash_file` |
| توقيع | `signatures.py` | manifests |
| سياسة | `configuration.py`, `policy.py` | `SecurityPolicy`, `SecurityMode` |
| تشفير | `crypto/` | AEAD, Argon2id, HKDF |
| مفاتيح | `keys/` | `InMemoryKeyProvider`, `PasswordKeyProvider` |
| artifacts | `artifacts/` | `EncryptedArtifactStore` |
| web | `web/` | CORS, CSRF, headers, transport |
| تدقيق | `audit.py` | inventory + threat model |

### `SecurityPolicy` — `configuration.py`

يُستخدم من agents و web. خصائص مثل `redact_traces`.  
**لا** يُصدَّر من جذر security في مسار agents (استيراد submodule فقط).

### fail-closed

عند غياب `cryptography` أو مفتاح: رمي `SecurityDependencyError` / `EncryptionError` — لا يتخطى بصمت.

### `crypto/aead.py` (منطقي)

1. اشتقاق/استخدام مفتاح
2. توليد nonce عشوائي
3. تشفير AEAD (AES-GCM أو ما يعادل)
4. غلاف `EncryptedEnvelope` (خوارزمية، إصدار، nonce، ciphertext)

---

## 5.6 تكامل agents ↔ security

| النقطة | الآلية |
|---|---|
| سياسة الوكيل | `Agent.security_policy` |
| إخفاء سجلات الأدوات | عبر policy + `redact_mapping` |
| قراءة ملفات | `create_read_text_file_tool` + فحص workspace |
| ويب آمن | `SafeWebReader` + تحقق URL |
