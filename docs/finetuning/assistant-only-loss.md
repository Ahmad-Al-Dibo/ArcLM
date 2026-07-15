# Assistant-Only Loss

Met:

```python
SFTConfig(assistant_only_loss=True)
```

tellen alleen response- of assistant-tokens mee voor de loss. Prompt-, user-,
system- en paddingtokens krijgen `ignore_index`.

Dit werkt voor:

- instruction data
- prompt-response data
- chat data met herkenbare assistant content

Als ArcLM geen assistant tokens kan vinden, stopt de collator met een fout.
