# ArcLM Test Strategy

## Baseline Gate

Default Community validation must pass on CPU:

```bash
python -m pytest
python -m compileall src/arclm
python -m pip wheel . --no-deps
```

Current CPU result after Web Feature 6: `.venv-training-core` passed with `218 passed, 10 skipped, 4 warnings`; compile passed; `pip wheel . --no-deps` passed. Direct `python -m build` requires the optional `build` package in the active environment.

Current local GPU result: `.venv-gpu-validation` uses PyTorch `2.5.1+cu121` on an NVIDIA GeForce GTX 1050 Ti and passed with `210 passed, 12 warnings`.

## Test Types

| Test Type | Purpose | Default Environment | Required Before Stable |
| --------- | ------- | ------------------- | ---------------------- |
| Unit tests | Validate small functions/classes | CPU | Yes |
| Integration tests | Validate package flow across domains | CPU | Yes for stable workflows |
| Compatibility tests | Protect old imports/APIs | CPU | Yes |
| Public API tests | Verify documented imports | CPU | Yes |
| CPU smoke tests | Prove runtime behavior locally | CPU | Yes |
| CUDA tests | Prove GPU/mixed precision paths | Optional CUDA CI | Required for CUDA claims |
| Multi-GPU tests | Prove DDP/FSDP/multi-device | Optional GPU CI | Required for Pro distributed |
| Optional dependency tests | Prove HF/PEFT/export/tracking paths | Matrix jobs | Required before stable integration |
| Security tests | Validate validation, redaction, auth rules | CPU/server | Required for security claims |
| Export artifact tests | Load exported artifact back | CPU/GPU as needed | Required for exporters |
| Deployment smoke tests | Start server/container and health-check | Optional CI | Required for deployment claims |
| Performance benchmarks | Track speed/regressions | Dedicated env | Not default gate |
| Regression tests | Lock fixed bugs | Same as bug environment | Required after fixes |

## Milestone Gates

- Milestone 0: full pytest, compileall, import checks, packaging check, README/status accuracy pass.
- Milestone 1: CLI help and train/eval/generate smoke tests.
- Web Milestone 1: frontend lint/type/build/unit checks, backend health/environment/capability/project endpoint tests, accessibility smoke checks, no optional dependency import regressions, and legacy simple interface compatibility checks.
- Later ML Milestone: PEFT installed optional job, LoRA save/load/resume tiny-model tests.
- Milestone 3: local tiny Hugging Face model/tokenizer runtime tests.
- Milestone 4: NLP task workflow tests per task.
- Milestone 5: generation behavior tests for greedy, sampling, streaming, batch.
- Milestone 6: local retrieval fixtures and no-network vector adapter tests.
- Milestone 7: local tracker tests and optional MLflow/W&B skipped cleanly.
- Milestone 8: DDP CPU/gloo test and CUDA distributed tests where available.
- Milestone 9: local server starts, `/health` passes, request validation tests.
- Milestone 10: export artifact can be loaded or verified.
- Milestone 11: generated deployment files lint and local container/server smoke where practical.
- Milestone 12: multimodal tiny fixture tests.
- Milestone 13: tool permission, sandbox, and audit-event tests.
- Milestone 14: benchmark fixtures, cache, reporting, and no-network default tests.
- Milestone 15: security redaction, validation, dependency-scan policy tests.
- Milestone 16: enterprise server/auth/RBAC/audit tests in Pro boundary only.

## Web Test Rules

- Web dependencies are optional and must not be required for `import arclm`.
- Frontend tests should use local fixtures and must not download models or datasets.
- Backend tests should call existing ArcLM Python APIs or small service helpers, not shell commands.
- The Web API may expose environment and capability summaries, but tests must verify that secrets and raw `.env` values are not returned.
- Pages for unapproved future milestones may show an honest `Planned` state, but tests must not treat those pages as functional.
- Feature 4 backend smoke must start Uvicorn on `127.0.0.1` and verify `/api/health`, `/api/environment`, `/api/capabilities`, `/api/project/status`, `/docs`, and `/openapi.json`.
- Feature 5 dashboard smoke must start the local backend and production frontend, open `/`, verify connected dashboard data, stop the backend, verify disconnected state, restart the backend, and verify reconnect.
- Feature 6 dashboard smoke must switch to Advanced mode, verify runtime details,
  hardware details, grouped capabilities, validation status, optional
  integrations, limitations, diagnostics, and the safe response-inspector
  trigger, then switch back to Simple mode and verify technical sections are
  hidden.
- Current extra warning: FastAPI `TestClient` emits a dependency-owned `StarletteDeprecationWarning` about future `httpx2` usage.

## Hardware Rules

- CPU is always enough for default Community tests.
- CUDA tests must skip cleanly when hardware is unavailable.
- A skipped CUDA test does not prove CUDA runtime support.
- Local CUDA correctness is validated on the GTX 1050 Ti with tiny fixtures only.
- BF16 correctness passed locally through PyTorch's reported capability, but native BF16 acceleration is not claimed.
- Multi-GPU, DDP world-size-two, FSDP, and distributed checkpoint claims require external multi-GPU validation.

## Local GPU Commands

```powershell
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and not multi_gpu"
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and fp16"
.\.venv-gpu-validation\Scripts\python.exe -m pytest tests/gpu -v -m "cuda and bf16"
```

See:

- [GPU Capability Matrix](../testing/gpu-capability-matrix.md)
- [Local GTX 1050 Ti Validation](../testing/local-gtx-1050-ti.md)
- [External GPU Validation](../testing/external-gpu-validation.md)

## Optional Dependency Rules

- Missing optional dependencies must produce helpful errors or clean skips.
- Optional imports must not break `import arclm`.
- Each optional integration needs at least one installed-dependency CI job before stable status.
## Web Milestone 2 Data Pipeline Studio Tests

Web Milestone 2 / Feature 1 is docs-only. Web Milestone 2 / Feature 2 adds the
read-only Dataset Inspector Backend.

Feature 2 tests cover:

- Dataset Inspector Backend: source allowlist, format detection, bounded rows,
  no absolute path leaks, invalid JSON/CSV/TXT handling, and safe errors.

Future implementation features must add focused tests before they are marked
complete:

- Dataset Inspector UI: loading, partial failure, field preview, warning
  display, keyboard access, and responsive layout.
- Step Registry: only real ArcLM steps listed as available; planned steps stay
  planned.
- Pipeline Preview: before/after rows, changed/removed counts, step warnings,
  and no mutation outside the bounded preview.
- Storage/Manifest: safe IDs, config hash, no private path exposure, load/save
  compatibility.
