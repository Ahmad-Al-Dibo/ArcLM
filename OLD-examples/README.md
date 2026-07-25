# ArcLM Voorbeelden

Deze voorbeelden horen bij de speciale ArcLM-versie. Ze zijn bedoeld om studenten en developers stap voor stap te laten zien hoe de library werkt.

Voer voorbeelden uit vanaf de projectroot:

```bash
python examples/01_quickstart.py
```

## Lokale Voorbeelden

Deze voorbeelden maken tijdelijke data en kunnen offline draaien:

- `01_quickstart.py`: train een heel klein native checkpoint.
- `02_tokenization.py`: bouw en gebruik de word tokenizer.
- `03_data_processing.py`: laad JSONL records en maak prompttekst.
- `04_pretraining.py`: draai native pretraining.
- `05_continue_training.py`: train verder vanaf een compatible checkpoint.
- `06_finetuning.py`: fine-tune een checkpoint met next-token loss.
- `07_native_sft.py`: native instruction tuning met response-only mask.
- `11_inference.py`: train, laad en genereer tekst.
- `12_smart_loader.py`: inspecteer een lokale modelmap.
- `13_diagnostics.py`: bekijk top-k voorspellingen.
- `14_custom_trainer.py`: overschrijf `Trainer.compute_loss`.
- `16_ai_knowledge_base.py`: controleer een AI workflow met logic regels.

## Optionele Voorbeelden

Deze voorbeelden hebben extra dependencies of modeldownloads nodig:

- `08_huggingface_sft.py`: Hugging Face SFT smoke test.
- `09_lora_sft.py`: Hugging Face LoRA SFT smoke test.
- `10_preprocess_pipeline.py`: JSONL preprocessing met `arclm[preprocess]`.
- `15_custom_hf_sft_loop.py`: custom Hugging Face SFT loop met ArcLM helpers.

## Geavanceerde Workflow

- `qwen3_0_6b_sft/`: Qwen3-0.6B LoRA SFT workflow voor gestructureerde JSON-output.
- `qwen_thinking/`: Qwen thinking-mode usage/training workflow met `enable_thinking`.
- `gemma/`: Gemma usage/training workflow met lokale adapter-fallback via base classes.

## Voorbeeldmatrix

Zie `EXAMPLE_MATRIX.md` voor een overzicht per moeilijkheidsgraad, taaktype,
hardware-eis, internet-eis en optionele dependencies.

## Let Op

Deze voorbeelden zijn leermateriaal. Ze zijn niet bedoeld als volledige benchmark of productieconfiguratie.
