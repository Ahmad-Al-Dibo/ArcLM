# ArcLM Study Plans

This folder is for engineers who want to work on ArcLM without guessing where to start.

It is not the product roadmap. The implementation source of truth remains:

- `docs/project/PROJECT_MAP.md`
- `docs/project/MILESTONES.md`
- `docs/project/FEATURE_MATRIX.md`

Use these study plans to build the background needed to contribute safely to the core library, the distributed runtime, the data pipeline, and the later web experience.

## Recommended Order

1. Read `core-engineer-roadmap.md`.
2. Study the core concepts in `concepts.md`.
3. Use `papers-and-references.md` for deeper reading.
4. Before implementing, use `contribution-checklists.md`.

## Who This Is For

- New contributors learning the ArcLM architecture.
- Engineers preparing to work on training, inference, data, or distributed runtime.
- Reviewers checking whether a feature was implemented with enough evidence.
- Future web engineers who need to understand the Python core before building UI on top of it.

## Study Tracks

| Track | Goal | Main files |
| --- | --- | --- |
| Core framework | Understand model lifecycle, config, checkpoints, artifacts, training, evaluation, and inference. | `core-engineer-roadmap.md`, `concepts.md` |
| Fine-tuning | Understand SFT, LoRA, PEFT, QLoRA, and artifact boundaries. | `papers-and-references.md`, `concepts.md` |
| Distributed runtime | Understand process groups, launchers, DDP, FSDP, rank behavior, and hardware validation. | `core-engineer-roadmap.md`, `concepts.md` |
| Data platform | Understand datasets, preprocessing, manifests, provenance, and safe path handling. | `concepts.md`, `contribution-checklists.md` |
| Web readiness | Understand why Web UI must call Python APIs instead of duplicating core logic. | `concepts.md`, `contribution-checklists.md` |

## Contribution Habit

ArcLM features should move from idea to implementation through evidence:

```text
Read project state
-> inspect current code
-> define success criteria
-> run baseline
-> implement one feature
-> add focused tests
-> run regression
-> perform runtime validation
-> update documentation
-> stop for approval
```

Avoid marking a feature complete because a class exists, an import works, or a mock test passes. Completion needs real behavior, tests, and documentation.

