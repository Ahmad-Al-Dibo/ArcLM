# Project 01: Local Language Model

Goal: run a complete tiny local workflow from raw text to generation.

Architecture: local text -> tokenizer -> native model -> one training step ->
checkpoint-like state -> evaluation metric -> bounded generation.

Folder structure: `main.py` contains the workflow; data comes from shared
fixtures.

Data flow: all generated files are written to a temporary directory.

Setup:

```powershell
pip install -e .
```

Command:

```powershell
python examples/12_complete_projects/01_local_language_model/main.py
```

Expected behavior: prints a JSON report with token count, parameter count,
loss, checkpoint file name, and generated text.

Generated files: temporary `model_state.pt`.

Tests: automated through the example runner.

Limitations: one tiny optimization step is educational, not a useful model.

Cleanup: temporary files are removed automatically.

Replace tiny components with larger real ones by using your own local corpus,
larger tokenizer vocabulary, and longer training loop.

