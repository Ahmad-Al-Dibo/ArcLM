# Project 02: Domain SFT Assistant

Goal: prepare tiny ArcLM documentation Q&A records and run one SFT-style update.

Architecture: instruction records -> canonical SFT preview -> native model ->
one response-label update -> benchmark-style prompt check.

Folder structure: `main.py` contains the workflow.

Data flow: synthetic records are kept in memory; no real assistant is claimed.

Setup:

```powershell
pip install -e .
```

Command:

```powershell
python examples/12_complete_projects/02_domain_sft_assistant/main.py
```

Expected behavior: prints a JSON report with SFT fingerprint, trainable tokens,
loss, and a bounded generation sample.

Generated files: none.

Tests: automated through the example runner.

Limitations: one update is not enough to create a production assistant.

Cleanup: no persistent files are created.

Replace tiny components with larger real ones by using a real local
instruction dataset and longer training.

