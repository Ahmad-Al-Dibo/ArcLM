# Mixed Precision

ArcLM ondersteunt in de training core:

- `fp32`
- `fp16`
- `bf16`

```python
config = TrainingConfig(precision="bf16")
```

`fp16` werkt alleen op CUDA. Op CPU geeft ArcLM een fout, omdat CPU FP16 training niet de normale veilige route is.

`bf16` werkt op CPU en op CUDA apparaten die BF16 ondersteunen.

De trainer gebruikt gradient scaling voor FP16 op CUDA.
