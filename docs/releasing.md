# Releasing ArcLM

How to publish a new version to PyPI.

## One-time setup (PyPI trusted publishing)

Trusted publishing is the recommended, token-free way to publish.

1. Create an account on [PyPI](https://pypi.org) (and optionally
   [TestPyPI](https://test.pypi.org)).
2. On PyPI: **Account settings → Publishing → Add a new pending publisher**
   - **PyPI Project Name:** `arclm`
   - **Owner:** `Ahmad-Al-Dibo`
   - **Repository name:** `ArcLM`
   - **Workflow name:** `publish.yml`
   - **Environment name:** `pypi` (and repeat with `testpypi` for TestPyPI)
3. On GitHub: repo **Settings → Environments** → create `pypi` and `testpypi`
   (optional protection rules).

No API tokens are stored in GitHub secrets when using trusted publishing.

## Release flow

1. Bump the version in `src/arclm/_version.py` (and `__api_version__` if the
   web API changed).
2. Update `CHANGELOG.md` with the new version section.
3. Commit and push:

   ```bash
   git add -A
   git commit -m "Release arclm X.Y.Z"
   git push origin cleanup-2.0
   ```

4. Create a GitHub release (tag `vX.Y.Z`) targeting `cleanup-2.0`.
   Publishing the release triggers `.github/workflows/publish.yml`.

### Manual / dry-run publish

From the Actions tab: **Publish to PyPI → Run workflow → environment:
testpypi**. This builds and uploads to TestPyPI only.

### Local publish (fallback)

```bash
pip install build twine
python -m build
twine check dist/*
# Requires a PyPI API token in TWINE_USERNAME=__token__ TWINE_PASSWORD=...
twine upload dist/*
```

## What gets published

| Artifact | Contents |
|---|---|
| Wheel (`arclm-X.Y.Z-py3-none-any.whl`) | `src/arclm` only (no examples/tests) |
| Sdist | Source + LICENSE + README + CHANGELOG (lean) |

Install after publish:

```bash
pip install arclm
pip install "arclm[train]"
```

## Blocks (optional)

ArcLM Blocks under `distributions/` are **not** published to PyPI as separate
packages yet. Users install them from git:

```bash
pip install "git+https://github.com/Ahmad-Al-Dibo/ArcLM.git#subdirectory=distributions/core"
```

## Checklist

- [ ] Version bumped in `_version.py`
- [ ] `CHANGELOG.md` updated
- [ ] `pytest` green locally (`run-verified` + unit suite)
- [ ] `python -m build && twine check dist/*` clean
- [ ] GitHub environments `pypi` / `testpypi` exist
- [ ] PyPI trusted publisher configured for `publish.yml`
- [ ] Release tag pushed / release published
