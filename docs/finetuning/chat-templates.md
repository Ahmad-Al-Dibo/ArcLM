# Chat Templates

Als een tokenizer `apply_chat_template()` heeft, kan ArcLM die gebruiken voor
chat formatting. Als assistant-only loss actief is, moet ArcLM assistant-spans
veilig kunnen vinden.

Wanneer dat niet lukt, geeft ArcLM een duidelijke fout in plaats van stil op
alle tokens te trainen.

Zonder native template gebruikt ArcLM een simpele fallback:

```text
system: ...
user: ...
assistant: ...
```
