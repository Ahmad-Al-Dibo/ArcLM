# Translator with an Open-Source Model (ArcLM real project)

Translate using a **pretrained open-source instruct model** loaded through
ArcLM (`load_any_model` → `.chat` / `.predict`).

## What this is

| | |
|---|---|
| **Goal** | Real-ish translation via a small multilingual instruct LM |
| **Model default** | `HuggingFaceTB/SmolLM2-135M-Instruct` (~135M params) |
| **API** | `arclm.inference.load_any_model` |
| **Quality** | Model-dependent — not a translation benchmark |

> ArcLM’s HF path loads **causal** LMs (`AutoModelForCausalLM`), not MarianMT
> seq2seq translators. Instruct models with a chat template work best via
> `.chat()`.

## Layout

```text
14_translator_open_source/
├── README.md
├── main.py        # load → translate samples → JSON report
├── config.py      # model id, device, languages, samples
├── loader.py      # load_any_model wrapper
├── prompts.py     # chat + plain translation prompts
├── translate.py   # .chat() with .predict() fallback + cleanup
└── evaluate.py    # run sample translations
```

## Run

```bash
pip install "arclm[hf]"
python examples/14_translator_open_source/main.py
```

Use another model:

```bash
set TRANSLATOR_MODEL=Qwen/Qwen2.5-0.5B-Instruct   # Windows
export TRANSLATOR_MODEL=Qwen/Qwen2.5-0.5B-Instruct  # Unix
```

## Notes

- First run downloads weights into the Hugging Face cache.
- `trust_remote_code=False` (safe default).
- Prompt engineering lives in `prompts.py` — easy to swap.
- Compare with [`../14_translator_from_scratch`](../14_translator_from_scratch/)
  to see the difference between training from zero and using a pretrained model.
