# 12 Complete Projects

Purpose: combine earlier examples into small practical workflows.

Prerequisites: base ArcLM installation, plus `arclm[security]` for the secure
workspace project.

Concepts: local language-model workflow, SFT assistant preparation, website
dataset pipeline, document Agent, benchmark lab, and secure local workspace.

Examples in order:
- `01_local_language_model/main.py`
- `02_domain_sft_assistant/main.py`
- `03_website_knowledge_pipeline/main.py`
- `04_local_document_agent/main.py`
- `05_model_benchmark_lab/main.py`
- `06_secure_local_ai_workspace/main.py`

Installation requirements: base dependencies for projects 1-5; security extra
for project 6.

Commands:

```powershell
python examples/12_complete_projects/01_local_language_model/main.py
python examples/12_complete_projects/02_domain_sft_assistant/main.py
```

Expected outputs: JSON reports with generated artifacts in temporary
directories only.

Verification status: projects 1 and 2 are automated; the remaining projects are
documented/manual or deferred in the manifest.

Current limitations: no downloads, live websites, production serving, or real
speech models are used.

Related ArcLM APIs: all previous categories.

Next category: return to `00_quick_start` or adapt a project to your data.

