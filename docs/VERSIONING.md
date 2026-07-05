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
0.3.1
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

## Current Unreleased Public Changes

The working tree currently includes public changes that should be mentioned in
the next release notes:

- `train_sft()` public API for Hugging Face SFT.
- `SFTTrainingResult`.
- Hugging Face assistant-only SFT labels.
- Optional PEFT LoRA adapters through `train_sft(..., use_lora=True)`.
- `examples/qwen3_0_6b_sft/` complete Qwen3-0.6B example.
- Native `Trainer` support for dict batches with `mask`.
- `tokenizer_from_checkpoint()`.

These are feature additions, so the next release should be at least a minor
version unless the maintainer intentionally keeps them in a patch release.

## Suggested Next Version

For a feature release after `0.3.1`, use:

```text
0.4.0
```

For a docs-only or bug-fix release, use:

```text
0.3.2
```

## Release Command

The release helper is:

```bash
python setup.py release --version 0.4.0
```

It updates `arclm/_version.py`, keeps `pyproject.toml` pointed at
`README.md`, runs tests, builds distributions, and checks them with Twine.
It does not upload unless `--upload` is passed.

Examples:

```bash
python setup.py --version
python setup.py release --version 0.4.0 --readme README.md
python setup.py release --version 0.4.0 --repository testpypi --upload
python setup.py release --version 0.4.0 --tag --push --upload
```

## Manual Release Checklist

1. Confirm the README and docs match the code.
2. Run `python -m pytest tests`.
3. Run `git diff --check`.
4. Update `arclm/_version.py`.
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
