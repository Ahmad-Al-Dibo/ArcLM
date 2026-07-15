# Checkpoints And Resume

Fine-tuning gebruikt de bestaande `Trainer` checkpoints:

```python
checkpoint = fine_tuner.save_checkpoint("outputs/checkpoint")
fine_tuner.load_checkpoint(checkpoint)
```

Een checkpoint bevat model state, optimizer state, scheduler state, scaler state
en training state. `FullFineTuner.save_checkpoint()` schrijft daarnaast
`sft_metadata.json` met datasetformaat, adaptertype en SFT-config.
