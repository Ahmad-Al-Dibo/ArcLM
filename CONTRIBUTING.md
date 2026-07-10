# Contributing To ArcLM

Thanks for helping improve ArcLM. This project values small, clear changes that keep the library easy to learn and easy to verify.

## Development Setup

```bash
git clone https://github.com/ahmad-al-dibo/arclm.git
cd arclm
python -m venv .venv
.\.venv\Scripts\activate
pip install -e .[dev]
```

On macOS/Linux, activate with:

```bash
source .venv/bin/activate
```

Install optional extras only when you need them:

```bash
pip install -e .[cpu]
pip install -e .[cuda]
pip install -e .[preprocess]
pip install -e .[peft]
pip install -e .[hf]
```

When you need official PyTorch CPU or CUDA wheels, include the PyTorch index URL:

```bash
pip install -e ".[cpu]" --index-url https://download.pytorch.org/whl/cpu --extra-index-url https://pypi.org/simple
pip install -e ".[cuda]" --index-url https://download.pytorch.org/whl/cu121 --extra-index-url https://pypi.org/simple
```

## Test Before Submitting

Run the core test suite:

```bash
python -m pytest tests
```

For packaging changes, also run:

```bash
python -m build
python -m twine check dist/*
```

## Documentation Rules

Documentation is part of the public API. Update docs in the same change when you:

- add, rename, or remove a public function or class;
- change a training mode, tokenizer, dataset format, or checkpoint field;
- change Hugging Face SFT, LoRA, inference, diagnostics, or preprocessing behavior;
- add, remove, or rename an example.

Do not document planned features as implemented. Mark unfinished work clearly.

## Example Rules

Examples should be:

- short and focused on one concept;
- runnable from a fresh checkout;
- independent of generated files from another example unless the dependency is explicit;
- honest about network, GPU, or Hugging Face model requirements.

Prefer tiny CPU smoke tests for default examples.

## Pull Request Checklist

1. Keep the change scoped.
2. Add or update tests when behavior changes.
3. Update `README.md`, `docs/`, and `examples/` when user-facing behavior changes.
4. Run `python -m pytest tests`.
5. Confirm `arclm.__version__` remains aligned with the release plan.

## Release Baseline

ArcLM 0.5.0 is the public baseline release described by the current docs. Avoid references to unpublished or superseded post-baseline versions in public documentation.
