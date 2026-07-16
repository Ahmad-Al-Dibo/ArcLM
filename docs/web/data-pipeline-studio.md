# Data Pipeline Studio Planning and API Audit

Status: Web Milestone 2 / Feature 4 implemented the Dataset Source Manager on
top of the read-only Dataset Inspector Backend and UI. Upload, pipeline
execution, manifest storage, and training handoff are still not implemented.

This document records what ArcLM already has, what can be reused, and what is
missing before a safe browser-based Data Pipeline Studio can be built.

## Scope

Included in this feature:

- audit the existing dataset, preprocessing, fine-tuning, and web APIs
- define the first safe API contracts for future work
- document security, storage, preview, provenance, and event needs
- choose the next implementation feature

Excluded from the current implemented inspector:

- upload support
- visual graph UI
- pipeline execution from the browser
- training controls
- model registry or project workflows

## Implemented Dataset Inspector Backend

Feature 2 adds:

- server-side `DatasetRoot` configuration
- safe dataset IDs
- read-only dataset catalogue
- `GET /api/datasets`
- `GET /api/datasets/{dataset_id}/inspection`
- bounded TXT, CSV, JSON, and JSONL inspection
- sample-based schema inference
- bounded preview rows
- basic statistics
- warning metadata
- dataset-specific error codes
- `arclm web-api --dataset-root NAME=PATH`

The catalogue is refreshed per listing/inspection request with bounded work. It
does not watch the filesystem, cache inspection results, or read full file
contents during listing.

## Implemented Dataset Inspector UI

Feature 3 turns `/data` into a read-only inspector.

The UI:

- lists only backend-approved datasets
- stores selection only as a safe `dataset_...` URL query value
- shows summary, inspection scope, fields, bounded preview rows, statistics,
  warnings, and supported formats
- keeps advanced metadata behind Advanced mode
- renders dataset values as untrusted plain text
- clears invalid path-like query values instead of requesting them
- never uploads, edits, deletes, maps fields, or runs pipeline steps

Manual initial selection is used. The page does not auto-inspect every dataset.
Users choose a dataset, and refresh preserves the selected safe ID when it still
exists.

## Implemented Dataset Source Manager

Feature 4 lets the local user manage multiple dataset folders from `/data`.

Implemented behavior:

- add local folder paths with readable names
- store roots in a local JSON config file
- list persisted and session-only CLI roots
- enable and disable individual roots
- remove root configuration without deleting files
- validate roots before saving
- optionally enable recursive scanning in Advanced mode
- refresh the active catalogue
- keep dataset catalogue responses path-free
- block source mutation when the backend is not bound to loopback

The browser still cannot browse arbitrary server folders. Users type or paste
absolute local paths into the manager.

## Existing Pipeline Inventory

| Area | Implemented | Public API | Tested | Web-ready | Main limitation |
| ---- | ----------- | ---------- | ------ | --------- | --------------- |
| Dataset loading | Yes | `load_dataset`, `DatasetLoader`, `DataProcessor.load` | Yes | Partial | No safe web resource IDs, quotas, or provenance |
| JSON | Yes | `load_dataset(path)` | Yes | Partial | Full in-memory load |
| JSONL | Yes | `load_dataset(path)`, `StreamingDataset.from_jsonl` | Yes | Partial | Streaming exists, but no web preview contract |
| CSV | Yes | `load_dataset(path)`, `StreamingDataset.from_csv` | Yes | Partial | Schema inference is basic |
| TXT | Yes | `load_dataset(path)`, `StreamingDataset.from_txt` | Yes | Partial | Non-empty line records only |
| Python lists | Yes | `load_dataset(list)` | Yes | No | Browser cannot pass arbitrary Python objects |
| Python iterables | Partial | `DatasetLoader.load(iterable)` | Yes | No | Non-path iterables are converted to lists unless streaming path is used |
| Hugging Face Datasets | No | No stable dataset API | No | No | Optional integration not implemented |
| PyTorch Dataset | Partial | Training can consume datasets | Partial | No | No generic web inspection adapter |
| Cleaning | Yes | `StripText`, `NormalizeWhitespace`, `RemoveControlCharacters`, `RemoveEmptyText`, `ProcessedDataset.clean` | Yes | Partial | No step metadata or preview delta |
| Filtering | Yes | `FilterByLength`, `SelectFields`, `RenameFields`, `DropFields` | Yes | Partial | No web schema or safe step config |
| Exact deduplication | Yes | `ExactDeduplicator`, `deduplicate` | Yes | Partial | `DataPipeline.run` discards detailed dedup stats |
| Approximate deduplication | Experimental | `DuplicateIndex`, simhash helpers through preprocess code | Limited | No | Not connected to modern dataset pipeline |
| Tokenization | Partial | `ProcessedDataset.tokenize`, `prepare_data`, SFT collators | Partial | No | Tokenizer contract is not safe or consistent for web preview |
| Statistics | Partial | `DatasetStats`, `whitespace_token_stats` | Limited | No | No unified dataset stats schema |
| Composition | Yes | `DataPipeline` | Yes | Partial | No named steps, serialized graph, dry run, cancellation, or step result objects |
| Serialization | Partial | `PreprocessConfig.from_yaml`, `to_dict` | Limited | No | `DataPipeline` has no stable config format |
| Preview | Partial | `GET /api/datasets/{dataset_id}/inspection` | Yes | Partial | Read-only bounded source preview only; no before/after step preview |
| Provenance | Partial | `ProcessedDataset.source`, preprocess report counts, safe dataset ID | Limited | Partial | Needs dataset manifest, row lineage, step IDs, and config hash |

## Existing Data Flows

Modern dataset flow:

```text
file/list/iterable -> DatasetLoader/load_dataset -> list or StreamingDataset
-> DataPipeline.run -> list or StreamingDataset
```

Preprocess flow:

```text
JSONL path -> PreprocessPipeline.run -> cleaned JSONL + JSON/HTML report
```

SFT data flow:

```text
record -> SFT formatter -> tokenizer adapter -> SFTDataCollator -> Trainer
```

These flows are useful. Feature 2 now provides the first safe web inspection
flow:

```text
configured dataset root -> dataset catalogue -> safe dataset ID
-> bounded inspection -> validated response -> browser
```

Feature 4 adds the source-management flow:

```text
typed local folder path -> validate root -> save root config
-> refresh catalogue -> safe dataset IDs -> Dataset Inspector
```

ArcLM still does not provide the complete Studio flow:

```text
browser -> local Web API -> safe dataset reference -> bounded preview
-> step configuration -> dry run -> step results -> saved pipeline manifest
```

## Dataset Formats

| Format | Current support | Studio recommendation |
| ------ | --------------- | --------------------- |
| TXT | Implemented as one non-empty line per record | Implemented in Dataset Inspector Backend |
| JSON | Implemented for lists, dict collections, and scalar values | Implemented for lists, single objects, and `data`/`samples`/`records` arrays |
| JSONL | Implemented and streamable | Implemented in Dataset Inspector Backend |
| CSV | Implemented and streamable | Implemented in Dataset Inspector Backend |
| Python list | Implemented in Python API | Use only in tests or internal adapters |
| Python iterable | Partial | Not a browser input format |
| Hugging Face Dataset | Not implemented | Future optional integration |
| WebDataset | Not implemented | Future optional integration |
| Pickle | Not supported | Keep blocked for security |
| Archives | Not supported | Keep blocked until extraction policy exists |

## Field Mapping Audit

| Use case | Current evidence | Missing for Studio |
| -------- | ---------------- | ------------------ |
| Plain language modeling | `text` field, `ProcessedDataset.transform(format="pretraining")`, SFT `text_field` | UI field selector and validation |
| Instruction data | SFT fields `instruction`, `input`, `output` | Safe mapping preview and missing-field report |
| Prompt-response data | SFT `prompt_field` and `response_field` | UI mapping preset |
| Chat data | SFT `messages_field`, chat formatter and tokenizer adapter | Message schema validation and role summary |
| Classification | Accuracy metric exists | End-to-end data schema not implemented |
| Token classification | Token accuracy exists | Data schema and collator not implemented |
| Evaluation datasets | Evaluator accepts model contract data | No dataset-type presets |

## Proposed Provenance Model

The Studio should record provenance before it allows save, execution, or
training handoff.

| Field | Purpose |
| ----- | ------- |
| dataset_id | Stable local ID, not an absolute path |
| dataset_name | User-visible name |
| source_kind | `uploaded`, `local_file`, `inline`, or future source |
| source_hash | Content hash where practical |
| row_id | Stable row ID inside the dataset |
| original_row | Original row before transformations, stored only where allowed |
| pipeline_id | Stable local pipeline ID |
| pipeline_version | Monotonic local version |
| step_id | Stable step ID |
| step_type | Loader, cleaner, filter, dedup, formatter, tokenizer, stats |
| config_hash | Hash of normalized step configuration |
| input_count | Rows seen by the step |
| output_count | Rows produced by the step |
| removed_count | Rows dropped by the step |
| changed_count | Rows changed by the step |
| warnings | Bounded warning list |
| errors | Bounded error list |
| created_with | ArcLM version |

## Proposed Step Result Contract

Future pipeline steps should return a small result object instead of only a
dataset.

```text
PipelineStepResult
- step_id
- step_name
- status
- input_count
- output_count
- changed_count
- removed_count
- warnings
- errors
- preview_before
- preview_after
- metrics
- duration_ms
```

This is not implemented yet. It is the recommended backend contract for later
Data Pipeline Studio features.

## Implemented Preview Contract

The first preview backend is read-only and bounded.

Current behavior:

- loads only server-configured dataset roots
- cap bytes, rows, and displayed cells
- infer fields without exposing absolute paths
- show parse errors with safe messages and warning/error codes
- preserve original values in memory only for preview unless saved later
- return first N records, not random samples

Preview does not:

- execute arbitrary Python functions
- read arbitrary paths from browser input
- upload files before the upload security milestone
- start training
- mutate datasets

## Simple and Advanced Studio Modes

Simple mode should show:

- source type
- detected fields
- first rows
- suggested text/instruction/chat mapping
- plain-language quality warnings

Advanced mode may show later:

- encoding
- null counts
- field type guesses
- row-level parse warnings
- transformation config
- token statistics
- provenance and manifest details

The same backend data should power both modes.

## Visual Graph Direction

The first Studio implementation should start with an accessible ordered step
list. A visual graph can be added after the backend contracts are stable.

Recommended order:

```text
Dataset source -> Inspect -> Clean -> Deduplicate -> Map fields -> Preview
-> Save pipeline -> Future training handoff
```

Do not add a graph library until a real interactive graph is approved.

## Gap Matrix

| Gap | Current status | Risk | Recommended action |
| --- | -------------- | ---- | ------------------ |
| Safe dataset references | Implemented for local roots | Needs manifests later | Extend to manifests before upload |
| Persistent source roots | Implemented | No dataset manifests yet | Keep source config separate from uploaded dataset storage |
| Upload limits | Missing | Large or unsafe files | Define size/type limits before upload |
| Preview endpoint | Implemented for source inspection | No step preview yet | Add pipeline preview after step registry |
| Step registry | Missing | UI cannot list real operations safely | Add typed list of approved steps |
| Pipeline serialization | Missing | Pipelines cannot be saved/reloaded | Define JSON manifest after inspector |
| Step result metadata | Missing | No before/after comparison | Add result contract before dry run |
| Provenance | Partial | Reproducibility gaps | Add manifest fields before training handoff |
| Token stats | Partial | Tokenization preview is incomplete | Add bounded stats after basic preview |
| Sequence packing preview | Existing collator only | Hard to explain packed data | Defer until training handoff |
| Web execution | Missing | Risky if added early | Add only after dry run and cancellation design |

## Recommended Web Milestone 2 Order

1. Feature 2: Dataset Inspector Backend - implemented and verified
2. Feature 3: Dataset Inspector UI - implemented and verified
3. Feature 4: Dataset Source Manager - implemented and verified
4. Feature 5: Approved Pipeline Step Registry
5. Feature 6: Pipeline Preview and Step Result Contract
6. Feature 7: Pipeline Save/Load Manifest
7. Feature 8: Dry Run Execution
8. Feature 9: Upload Security and Local Dataset Store
9. Feature 10: Token and SFT Mapping Preview
10. Feature 11: Training Handoff Planning

The next recommended feature is:

```text
Web Milestone 2 / Feature 5: Approved Pipeline Step Registry
```

Feature 5 should list approved real ArcLM pipeline steps. It must not implement
upload, arbitrary code execution, training controls, or a visual graph editor.

## Feature 2 Success Criteria

- A backend service or endpoint can inspect approved local fixture data without
  arbitrary path access.
- TXT, JSONL, CSV, and JSON shape inspection are covered by tests.
- Returned metadata includes row count where safe, field names, sample rows,
  parse warnings, and detected format.
- Response schemas expose no absolute paths, usernames, environment variables,
  or raw project files.
- Size and row limits are enforced.
- CPU Python tests, web backend tests, frontend tests, compileall, and package
  wheel continue to pass.
