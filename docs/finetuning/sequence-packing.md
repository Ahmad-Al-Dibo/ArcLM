# Sequence Packing

Sequence packing staat standaard uit:

```python
SFTConfig(packing=False)
```

Als `packing=True`, combineert ArcLM korte voorbeelden binnen één batch tot
reeksen van maximaal `max_length`.

Deze eerste versie is bewust simpel. Ze doet geen distributed packing en geen
geavanceerde voorbeeldweging.
