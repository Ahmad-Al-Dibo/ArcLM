# 01 Data

Purpose: load, validate, clean, and report small local datasets.

Prerequisites: base ArcLM installation.

Concepts: JSONL records, validation issues, dataset manifests, token-aware
reports, and local website fixtures.

Examples in order:
- `01_load_validate_report.py`
- `02_local_website_dataset.py`

Installation requirements: none beyond base dependencies.

Commands:

```powershell
python examples/01_data/01_load_validate_report.py
python examples/01_data/02_local_website_dataset.py
```

Expected outputs: JSON summaries with validation and token counts.

Verification status: automated.

Current limitations: live web fetching is intentionally omitted from verified
examples.

Related ArcLM APIs: `validate_records`, `create_dataset_manifest`,
`build_dataset_report`, `Tokenizer`.

Next category: `02_tokenizers`.

