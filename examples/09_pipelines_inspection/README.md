# 09 Pipelines and Inspection

Purpose: compose local data/tokenizer/model steps and inspect native token
flow.

Prerequisites: base ArcLM installation.

Concepts: data pipeline composition, deduplication, token reports, model
inspection, tensor shape summaries.

Examples in order:
- `01_data_pipeline.py`
- `02_pipeline_inspection.py`

Installation requirements: base dependencies only.

Commands:

```powershell
python examples/09_pipelines_inspection/01_data_pipeline.py
python examples/09_pipelines_inspection/02_pipeline_inspection.py
```

Expected outputs: pipeline and trace summaries.

Verification status: automated.

Current limitations: no attention maps or gradient traces are claimed.

Related ArcLM APIs: `DataPipeline`, `RemoveDuplicates`, `build_dataset_report`,
`inspect_text`.

Next category: `10_agents_tools`.

