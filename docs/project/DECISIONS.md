# ArcLM Decision Records

## DEC-001: Community and Pro separation

Status: Proposed

Context:
ArcLM needs a strong local open core and a path for advanced operational features.

Decision:
Keep datasets, training, evaluation, fine-tuning, checkpoints, adapters, and basic inference in Community. Place distributed orchestration, production serving, dashboards, cloud deployment, advanced PEFT automation, large benchmarks, and enterprise controls in Pro or Shared Core as appropriate.

Reasons:
This keeps the library useful without forcing enterprise dependencies into local workflows.

Alternatives:
Put everything in one package; split too early into many packages.

Consequences:
Optional dependency boundaries and compatibility tests become important.

## DEC-002: Model-agnostic support

Status: Proposed

Context:
ArcLM should not only support ArcLM-native models.

Decision:
Support native models directly, standard PyTorch models through documented contracts, Hugging Face models through optional integrations, and custom models through adapters.

Reasons:
This matches current code and avoids claiming universal support.

Alternatives:
Only support native ArcLM models; claim all models work automatically.

Consequences:
Adapters and runtime tests are required for each major model family claim.

## DEC-003: Adapter design

Status: Proposed

Context:
SFT already has useful model and tokenizer adapters.

Decision:
Keep adapters small: input mapping, output mapping, loss/logit extraction, save/load expectations, and capability documentation.

Reasons:
This is enough for current workflows without a heavy framework.

Alternatives:
Build a generic adapter registry now.

Consequences:
General external-model support should grow from tested needs.

## DEC-004: Optional dependencies

Status: Proposed

Context:
ArcLM has optional HF, PEFT, serving, tracking, and export ambitions.

Decision:
Optional dependencies must not be imported on `import arclm`; missing packages must give clear errors or skips.

Reasons:
CPU/local users should not pay for integrations they do not use.

Alternatives:
Install everything by default.

Consequences:
Optional CI jobs are needed before stable integration claims.

## DEC-005: Public API stability

Status: Proposed

Context:
Compatibility shims exist and old users may rely on them.

Decision:
Keep old imports until deprecation warnings, migration docs, and compatibility tests support removal.

Reasons:
This avoids surprise breakage during architecture growth.

Alternatives:
Clean up old APIs immediately.

Consequences:
Some duplicated names remain temporarily.

## DEC-006: Dutch comments and docstrings

Status: Proposed

Context:
Recent code style requires Dutch comments/docstrings and English code names/errors.

Decision:
Future implementation code should keep English identifiers and errors, with simple Dutch comments/docstrings.

Reasons:
This matches project style and user preference.

Alternatives:
Use all English or mixed ad hoc style.

Consequences:
Reviewers need to check language consistency.

## DEC-007: Training and evaluation reuse

Status: Proposed

Context:
Training and evaluation cores are stable and tested.

Decision:
New fine-tuning, PEFT, benchmark, and task workflows should reuse `Trainer`, `Evaluator`, callbacks, configs, and checkpoint behavior where practical.

Reasons:
This avoids duplicated training/evaluation loops.

Alternatives:
Create separate trainers for every feature.

Consequences:
Extension points may need small additions only when tests prove a need.

## DEC-008: Logging strategy

Status: Proposed

Context:
Basic logs exist, tracking code is experimental.

Decision:
Use standard Python logging plus callback events and local structured metrics first. External trackers remain optional.

Reasons:
Simple logs are enough for Community and easy to test.

Alternatives:
Build a dashboard/event platform now.

Consequences:
Dashboards wait until monitoring data contracts are stable.

## DEC-009: Plugin safety

Status: Proposed

Context:
Plugin protocol exists but discovery and permissions do not.

Decision:
Do not make plugin loading stable until discovery, permissions, sandboxing, and audit events are designed and tested.

Reasons:
Plugins can execute untrusted code.

Alternatives:
Load arbitrary plugins from paths.

Consequences:
Plugin system remains interface-only for now.

## DEC-010: Agent sandboxing

Status: Proposed

Context:
Agent features are not implemented.

Decision:
Agents must be split into tool registry, planner, memory, executor, policy, and runtime only when real implementations exist. Code/browser/tool execution requires sandboxing and permissions.

Reasons:
This avoids one giant unsafe `Agent` class.

Alternatives:
Ship a broad agent API first.

Consequences:
Agent milestones depend on security foundations.

## DEC-011: Hidden chain-of-thought handling

Status: Proposed

Context:
Reasoning features are requested.

Decision:
Do not expose or store private hidden chain-of-thought. Support user-visible summaries and structured outputs only.

Reasons:
This keeps reasoning features safe and provider-compatible.

Alternatives:
Store raw reasoning traces.

Consequences:
Reasoning APIs must be explicit about what is user-visible.

## DEC-012: Web Experience priority

Status: Accepted by owner for the current implementation sequence

Context:
After CLI/public API stabilization and local GPU validation, the owner chose to prioritize a modern ArcLM Web Experience before the previously recommended LoRA/PEFT milestone.

Decision:
Implement Web Milestone 1 first: optional frontend foundation, design system, app shell, local ArcLM Web API connection, health/environment/capability/project status, simple/advanced mode, themes, accessibility foundation, tests, and docs. Keep Web Milestones 2-5 and later ML milestones unapproved until Web Milestone 1 is complete and reviewed.

Reasons:
ArcLM needs a local developer experience that helps beginners start quickly while still preserving advanced controls for experienced users. A thin Web API over existing Python APIs avoids duplicate training, evaluation, inference, and dataset logic.

Alternatives:
Continue directly to LoRA/PEFT; expand the legacy Flask page; build a production serving platform first.

Consequences:
Web dependencies must remain optional, `import arclm` must stay lightweight, the legacy Flask simple interface remains a compatibility path, and future dashboard/data/plugin work must show planned states until separately approved.

## DEC-013: Modern Web API backend boundary

Status: Accepted for Web Milestone 1 / Feature 4

Context:
The modern Next.js frontend needs safe local runtime information, while the
legacy Flask simple interface must remain compatible.

Decision:
Add a separate optional FastAPI backend under `arclm.web` with an explicit
`create_app()` factory, localhost defaults, read-only endpoints, strict CORS,
and a small CLI launch command. Keep the legacy Flask interface unchanged.

Reasons:
FastAPI provides typed schemas and OpenAPI for the modern UI without replacing
the compatibility Flask path. A read-only API prevents the first backend feature
from accidentally becoming model serving or dashboard control logic.

Alternatives:
Extend the Flask app, call shell commands from the browser, or expose training
and inference actions immediately.

Consequences:
FastAPI and Uvicorn remain optional web dependencies, Python 3.10+ is required
for the modern web extra, and dashboard presentation starts only after a later
approved feature.
## DEC-014: Data Pipeline Studio Starts With Read-Only Inspection

Status: proposed.

Decision: Web Milestone 2 should start with a read-only Dataset Inspector
Backend before upload, pipeline execution, visual graph editing, or training
handoff.

Reason:

- ArcLM already has useful dataset loaders and pipeline steps.
- These APIs are not yet safe web contracts by themselves.
- Preview, provenance, limits, and safe dataset references are prerequisites
  for browser workflows.

Consequence:

- Feature 2 should inspect approved sources only.
- Upload and execution remain separate future features.
- The UI must not show working-looking controls for planned data actions until
  real backend behavior exists.

Implementation note:

- Web Milestone 2 / Feature 2 implemented the read-only backend as
  `GET /api/datasets` and `GET /api/datasets/{dataset_id}/inspection`.
  The Feature 1 draft `POST /api/data/inspect` was superseded by this safer
  list-then-inspect flow.
