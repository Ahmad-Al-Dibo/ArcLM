# Contribution Checklists

Use these checklists before changing ArcLM. They are intentionally practical and short.

## Before Any Feature

- Confirm the approved feature in `docs/project/PROJECT_MAP.md`.
- Read the relevant milestone in `docs/project/MILESTONES.md`.
- Inspect the existing code before designing new code.
- Identify current public APIs.
- Identify compatibility imports.
- Run the relevant baseline tests.
- Define measurable success criteria.
- Keep the implementation small.
- Add focused tests.
- Run regression tests.
- Update only the required documentation.
- Stop after the approved feature is complete.

## Public API Checklist

- Root import remains lightweight.
- New public APIs are exported from the correct subpackage.
- `__all__` is updated where the project uses it.
- Old imports keep working unless removal is explicitly approved.
- Compatibility tests cover legacy imports.
- Optional dependencies are imported lazily.
- Errors are clear and written in simple English.

## Training Checklist

- Loss is finite.
- Parameters change.
- Optimizer steps occur.
- Gradient accumulation works where configured.
- Gradient clipping works where configured.
- Mixed precision uses the documented path.
- Checkpoints save and load.
- Resume works with new model, optimizer, and trainer objects.
- Rank-zero behavior is correct in distributed runs.
- No silent CPU fallback occurs for explicit CUDA requests.

## Checkpoint and Artifact Checklist

- Checkpoint and final artifact are not confused.
- Checkpoint includes resume state.
- Artifact excludes optimizer, scheduler, scaler, and RNG resume state.
- Artifact inspection does not construct the model.
- Artifact validation checks safe paths and hashes.
- Artifact loading uses explicit device and precision behavior.
- CPU loading works for portable artifacts.

## Distributed Checklist

- Process group initializes and shuts down cleanly.
- Launcher reports rank failures.
- Rank and world size are correct.
- Distributed sampler is used when required.
- Rank zero alone writes files.
- CPU process-group tests are not reported as multi-GPU validation.
- Multi-GPU tests are marked and gated by real hardware.
- External validation commands are documented.

## Data Checklist

- Dataset IDs are safe.
- Paths are not exposed through public catalogue responses.
- Path inputs are validated.
- Symlink and traversal behavior is tested.
- Recursive scanning is bounded.
- Unsupported files are ignored safely.
- Dataset contents are not logged accidentally.
- Source removal does not delete user files.

## Inference Checklist

- Model loads from a supported source.
- Tokenizer is available when required.
- Device is explicit and verified.
- No gradients are created.
- Batch and single prompt behavior are tested.
- No hidden internet request occurs.
- Errors distinguish missing model, missing tokenizer, and unsupported source.

## Optional Dependency Checklist

- Feature works only when the optional dependency is installed.
- Missing dependency message includes the right extra.
- Core imports work without the optional dependency.
- Tests prove the lazy-import boundary.
- Documentation lists the dependency as optional.

## Security Checklist

- No secrets in responses.
- No environment variables exposed.
- No absolute private paths in public output.
- No arbitrary Python code loading.
- No shell execution from web or config input.
- No broad CORS or remote binding by default.
- No raw stack traces in user-facing API responses.

## Documentation Checklist

- Document what is implemented.
- Document what is not implemented.
- Separate local verification from cloud validation.
- Add known limitations.
- Keep roadmap status evidence-based.
- Do not duplicate large sections from other docs.
- Link to the canonical spec when one exists.

