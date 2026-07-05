# ArcLM Versioning And Release Guide

ArcLM uses Git for source history and package versions for installed releases.

## Version Source Of Truth

The package version lives in:

```text
arclm/_version.py
```

`pyproject.toml`, `arclm.__version__`, and `arclm.api.get_version()` read from
that file.

Current repository version:

```text
0.4.0
```

Check it with:

```bash
python -c "import arclm; print(arclm.__version__)"
```

## Semantic Versioning

Use:

```text
MAJOR.MINOR.PATCH
```

- `PATCH`: bug fixes and docs-only corrections.
- `MINOR`: new public features that keep existing user code working.
- `MAJOR`: breaking public API changes.

While ArcLM remains pre-1.0, prefer `0.x.y`.

## ArcLM 0.4.0 Public Changes

ArcLM 0.4.0 includes these public changes:

- `train_sft()` public API for Hugging Face SFT.
- `SFTTrainingResult`.
- Hugging Face assistant-only SFT labels.
- Optional PEFT LoRA adapters through `train_sft(..., use_lora=True)`.
- `examples/qwen3_0_6b_sft/` complete Qwen3-0.6B example.
- Native `Trainer` support for dict batches with `mask`.
- `tokenizer_from_checkpoint()`.

## Suggested Next Version

For a bug-fix or docs release after `0.4.0`, use:

```text
0.4.1
```

For the next feature release after `0.4.0`, use:

```text
0.5.0
```

## Release Command

The release helper is:

```bash
python setup.py release --bump patch
```

It updates `arclm/_version.py`, keeps `pyproject.toml` pointed at
`README.md`, runs tests, builds distributions, and checks them with Twine.
It does not upload unless `--upload` is passed.

PyPI does not allow replacing files for an already published version. To
update the package on PyPI, publish a new version such as `0.4.1`; do not
delete the old release. The helper checks known PyPI repositories before
uploading and stops early if the target version already exists or is older
than the latest published version. If a version was uploaded and then deleted,
PyPI still refuses that same filename later; publish a new version instead.

Examples:

```bash
python setup.py --version
python setup.py release --bump patch --readme README.md
python setup.py release --bump patch --repository testpypi --upload
python setup.py release --version 0.4.1 --upload
python setup.py release --bump minor --tag --push --upload
```

Use `--skip-existing` only when you intentionally want Twine to skip already
published files. It does not update an existing PyPI version.

## Manual Release Checklist

1. Confirm the README and docs match the code.
2. Run `python -m pytest tests`.
3. Run `git diff --check`.
4. Choose a new version number.
5. Update release notes or changelog if one exists.
6. Commit the release.
7. Tag the release.
8. Build and check the package.
9. Upload only when ready.

Example:

```bash
git status
python -m pytest tests
git diff --check
git add arclm/_version.py pyproject.toml README.md docs
git commit -m "Release ArcLM 0.4.0"
git tag -a v0.4.0 -m "ArcLM 0.4.0"
git push
git push origin v0.4.0
```

## Documentation Rule

Any change to a public feature must update documentation in the same work:

- public functions/classes;
- config options;
- dataset formats;
- examples;
- trainer behavior;
- checkpoint behavior;
- masking behavior;
- loader behavior;
- SFT/LoRA behavior.

Do not document planned features as implemented. Mark unfinished work as
planned or not implemented.
