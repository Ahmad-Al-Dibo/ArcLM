# CLI

ArcLM currently exposes its command line through:

```bash
python -m arclm
```

`pyproject.toml` does not currently define a console script such as `arclm`.
Users should treat `python -m arclm` as the verified entry point until a console
script is explicitly added and tested.

## Current Commands

| Command | Status | Notes |
| ------- | ------ | ----- |
| `python -m arclm --help` | Verified | Lists the current command set. |
| `python -m arclm --version` | Verified | Prints the package version. |
| `python -m arclm train --help` | Verified | Help and argument discovery. |
| `python -m arclm eval --help` | Verified | Help and argument discovery. |
| `python -m arclm generate --help` | Verified | Help and argument discovery. |
| `python -m arclm train --config config.json --data data.txt --output model.pth --epochs 1` | Verified | Tiny CPU smoke test uses the existing `train_model` Python API. |
| `python -m arclm eval --model model.pth --data data.txt --output metrics.json` | Verified | Tiny CPU smoke test writes JSON and Markdown metrics. |
| `python -m arclm generate --model model.pth --prompt "alpha beta" --length 2` | Verified | Tiny CPU smoke test loads the same checkpoint and prints generated text. |
| `python -m arclm --run simple-interface` | Partial | Requires the optional Flask dependency. It is not a production server. |

## Error Behavior

Invalid commands and missing required arguments use argparse and return a
non-zero exit code. Missing model files for `eval` and `generate` return a clear
English error without a traceback.

## Compatibility Notes

The CLI reuses the public Python API where practical. `train` uses
`arclm.training.train_model`, while `eval` and `generate` reuse the inference
loader and existing diagnostics/generation helpers. Default help and command
discovery should not require unrelated optional packages.
