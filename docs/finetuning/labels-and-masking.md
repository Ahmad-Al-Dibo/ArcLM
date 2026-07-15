# Labels And Masking

Voor gewone causal-lm SFT maakt ArcLM:

```python
labels = input_ids.copy()
```

Padding krijgt `ignore_index`, standaard `-100`. Daardoor telt padding niet mee
in de loss.

Als het model zelf loss berekent, worden labels ongewijzigd aan het model
gegeven. Als de `ModelAdapter` loss berekent uit logits, gebruikt hij standaard
shifted causal-lm loss.
