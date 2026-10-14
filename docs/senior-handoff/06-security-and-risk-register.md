# 06 - Security And Risk Register

## Security posture

ArcLM Special is designed as a local secure workbench, not a multi-tenant remote
service. The defaults reflect that:

- Web API binds to `127.0.0.1`.
- CORS origins are explicit local origins, never wildcard.
- Dataset source management is blocked for remote binding.
- Browser-facing dataset access uses generated IDs, not raw paths.
- Security policy defaults disallow untrusted pickle and remote model code.
- Secrets are redacted in typed config output by default.

If someone wants remote deployment, treat that as a new product requirement, not
as "change host to 0.0.0.0".

## High-risk surfaces

- Checkpoint loading: PyTorch serialization can be dangerous. Use safe loader
  APIs and keep `allow_untrusted_pickle=False` defaults meaningful.
- `trust_remote_code=True`: allowed for trusted local use, but should never
  become silent default.
- Workspace deletes: project/tokenizer/dataset/checkpoint deletes require explicit
  confirmation patterns. Preserve that.
- Dataset root management: paths are server-local and must remain guarded by
  origin/local binding checks.
- In-process background jobs: no cross-process locking means shared workspace
  with multiple servers is unsafe.
- Generated model text: bounded in config, but future streaming endpoints must
  keep max prompt and max new token limits.

## Technical debt that matters

- `config_schema.py` currently contains both copied legacy `Config` code and
  typed config dataclasses. It works, but long-term it should be split so typed
  config does not shadow historical meaning.
- Some compatibility shims export old and new names from one place. This is good
  for users but makes accidental import cycles more likely.
- `distributions/*` are snapshots. Source changes do not automatically mean
  packaged distributions have the same behavior.
- Several large-data APIs materialize iterables. They are production-shaped, but
  not yet production-scale for very large corpora.
- Web client types are handwritten. Backend schema drift can pass Python tests
  but fail frontend runtime validators.
- Tracked `__pycache__` files exist under tests. Test/compile runs can dirty the
  working tree unexpectedly.

## Business risks

- Overclaiming external model support. Capability reports distinguish
  `Validated`, `Compatible`, `Experimental`, and `Unsupported`; preserve that
  honesty in UI/docs.
- Confusing final artifacts with resumable checkpoints. Users can lose resume
  ability if feature copy says "save model" but implementation saves only final
  artifact metadata.
- Starting SFT from stale preview. The format fingerprint guard exists to prevent
  this; do not bypass it in UI shortcuts.
- Letting Studio become a general job queue. Current code is intentionally one
  local job; broader orchestration needs locks, recovery and process management.

## Safe defaults to preserve

- Localhost binding by default.
- `max_active_training_jobs == 1`.
- Explicit confirmation for destructive workspace operations.
- Bounded previews, logs and generation.
- Optional dependencies loaded lazily.
- Privacy-aware reports with redacted samples unless explicitly requested.

