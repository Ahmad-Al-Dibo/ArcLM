# Translator from Zero (ArcLM real project)

Train a **tiny** English→Dutch translator with only public `arclm.*` APIs.
No Hugging Face model download. No GPU required.

## What this is

| | |
|---|---|
| **Goal** | Full local loop: data → train → checkpoint → translate → evaluate |
| **Model** | Native ArcLM causal LM (~thousands of parameters) |
| **Quality** | **Educational only** — will not match production NMT |
| **Time** | ~seconds on CPU |

## Layout

```text
14_translator_from_scratch/
├── README.md
├── main.py           # orchestrator
├── config.py         # paths, hyperparameters
├── data_prep.py      # pairs → causal training text
├── train.py          # train_model()
├── translate.py      # load_model().predict()
├── evaluate.py       # contains/substring metric
└── data/
    └── en_nl_pairs.jsonl
```

## Run

```bash
pip install "arclm[train]"
python examples/14_translator_from_scratch/main.py
```

## Prompt format

```text
translate english to dutch: hello > hallo
```

The causal model learns to continue after `>`.

## Honest limitations

- 20-word parallel corpus — the model will mostly memorize, not generalize.
- Generation may include leftover prompt text; parsing is naive.
- For real translation quality use
  [`14_translator_open_source`](../14_translator_open_source/).

## Extend

- Add more pairs in `data/en_nl_pairs.jsonl`
- Change languages in `config.py`
- Swap metrics in `evaluate.py` for BLEU-style scoring if you add a dependency
