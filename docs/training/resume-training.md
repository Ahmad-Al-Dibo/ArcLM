# Resume Training

Gebruik `resume_from_checkpoint` om verder te trainen vanaf een checkpoint.

```python
trainer.train(resume_from_checkpoint="outputs/run-1/checkpoint-1000")
```

Of laad eerst handmatig:

```python
trainer.load_checkpoint("outputs/run-1/checkpoint-1000")
trainer.train()
```

ArcLM herstelt:

- model weights
- optimizer
- scheduler als die bestaat
- `TrainingState`
- gradient scaler als FP16 gebruikt wordt

Als verplichte checkpoint-data ontbreekt, geeft ArcLM een duidelijke fout.
