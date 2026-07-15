# External Models

ArcLM is niet beperkt tot ArcLM-modellen.

Ondersteund in deze fase:

- native ArcLM modellen
- standaard `torch.nn.Module` modellen
- Hugging Face-achtige modellen met `.loss` en `.logits`
- custom modellen via `ModelAdapter`

Een model moet trainbare parameters hebben, naar een device kunnen, en logits
of loss teruggeven. Niet elk willekeurig model is automatisch compatibel.

Transformers is optioneel. Installeer de HF extra alleen wanneer je echte
Hugging Face modellen of tokenizers wilt laden.
