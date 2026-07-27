# Project 03: Website Knowledge Pipeline

Goal: turn local website fixtures into a small dataset and tokenizer report.

Architecture: local HTML -> text extraction -> validation -> JSONL-style
records -> token report.

Command:

```powershell
python examples/12_complete_projects/03_website_knowledge_pipeline/main.py
```

Expected behavior: prints record and token counts. Live internet mode is not
implemented in this verified suite.

Generated files: none.

Tests: manual/structural only in this phase.

Limitations: local fixture extraction only.

Cleanup: no persistent files.

Replace tiny components by pointing the extraction stage at approved local HTML
exports.

