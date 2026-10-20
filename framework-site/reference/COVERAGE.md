# Documentation coverage report

**Date:** 2026-10-16  
**ArcLM version documented:** 2.0.0  
**Method:** Manual inventory against `src/arclm` public packages and `__init__` exports (session knowledge of the codebase).

## Documented pages

| Area | Page | Depth |
|---|---|---|
| Install / extras / CPU / CUDA | `install.html` | Full |
| Quick start (3 paths) | `quickstart.html` | Full + verified snippets |
| Architecture / optional torch / blocks | `architecture.html` | Full |
| arclm.configs | `modules/configs.html` | Full (Config, create_config, YAML/JSON) |
| arclm.tokenizers | `modules/tokenizers.html` | Full (Tokenizer, SentencePiece, factory) |
| arclm.datasets | `modules/datasets.html` | Full (load, validate, dedupe, pipeline) |
| arclm.security | `modules/security.html` | Full (redact, status, paths, crypto API) |
| arclm.agents | `modules/agents.html` | Full (tool, runner, permissions, builtins) |
| arclm.tracking | `modules/tracking.html` | Full (seed, create_run, list/compare) |
| arclm.search | `modules/search-hp.html` | Overview + naming warning |
| arclm.logics | `modules/logics.html` | Overview |
| arclm.exceptions | `modules/exceptions.html` | Hierarchy table + OptionalDependencyError |
| arclm.models | `modules/models.html` | Full (ArcLM, AutoModel) |
| arclm.training | `modules/training.html` | Full (TrainingConfig, Trainer, train_model, compat) |
| arclm.inference | `modules/inference.html` | Full (load_any_model, predict, chat) |
| arclm.finetuning | `modules/finetuning.html` | Full (train_sft, contract) |
| arclm.checkpoints | `modules/checkpoints.html` | Solid (save/load, SmartLoader) |
| arclm.evaluation | `modules/evaluation.html` | Solid (Evaluator, metrics, export) |
| arclm.peft | `modules/peft.html` | Solid |
| arclm.inspection | `modules/inspection.html` | Solid |
| CLI (all commands) | `cli.html` | Full table + examples |
| Errors | `errors.html` | Handling patterns |
| Troubleshooting | `troubleshooting.html` | Common failures |
| Examples catalogue | `examples-index.html` | Folder map + runner |

## Intentionally thin / not fully expanded

| Item | Reason |
|---|---|
| Every method of every large class (e.g. all 200+ root exports) | Size; prioritize high-traffic APIs |
| `arclm.web` (FastAPI Studio) | Separate stack; linked conceptually only |
| `arclm.distributed` | Experimental contracts |
| `arclm.registry`, `arclm.utils` | Internal helpers |
| Hyperparameter search full trial API | Pointer to tests + guide |
| Environment variables | Only HF token mentioned in passing |

## Undocumented public surface (explicit gaps)

- Full signature list of `RunTracker` methods (only main flow shown)
- `arclm.web` endpoints
- `arclm.distributed` classes
- Every exception subclass constructor
- Lifecycle artifact format fields
- Blocks builder CLI flags (only git install shown)

## How to extend coverage

1. Pick a package `__init__` export list.
2. Add or expand the module page with the standard API block template.
3. Add 3+ distinct examples per important function.
4. Update this file and VERIFICATION.md.
