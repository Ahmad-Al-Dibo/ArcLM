# Warning Inventory

Last updated: Milestone 1, after CLI and public API stabilization.

Environment:

- Python: 3.12.10
- PyTorch: 2.13.0+cpu
- CUDA: unavailable
- Command: `python -m pytest`
- Result after fixes: `200 passed, 2 skipped, 3 warnings`

| Warning message | Source | Owner | Triggering test | User impact | Recommended action | Milestone |
| --------------- | ------ | ----- | --------------- | ----------- | ------------------ | --------- |
| `arclm.pipeline is deprecated and will be removed in a future release. Use 'from arclm.training import train_model' instead.` | `src/arclm/pipeline.py` compatibility shim | ArcLM-owned, intentional | `tests/unit/test_package_structure.py` | Users of the old import get a clear migration path. | Keep until a removal milestone is approved. Do not filter globally. | 1 |
| `arclm.sft is deprecated and will be removed in a future release. Use 'from arclm.finetuning import train_sft' instead.` | `src/arclm/sft.py` compatibility shim | ArcLM-owned, intentional | `tests/unit/test_sft_api.py`; compatibility tests | Users of the old SFT import get a clear migration path. | Keep until a removal milestone is approved. Do not filter globally. | 1 |
| `arclm.loaders is deprecated and will be removed in a future release. Use 'from arclm.checkpoints import SmartLoader' instead.` | `src/arclm/loaders/__init__.py` compatibility shim | ArcLM-owned, intentional | `tests/unit/test_smart_loader.py` | Users of the old loader import get a clear migration path. | Keep until a removal milestone is approved. Do not filter globally. | 1 |
| `You are using torch.load with weights_only=False...` | `src/arclm/training/trainer.py`; some tests reading checkpoints directly | ArcLM-owned call sites plus test call sites | GPU validation suite with PyTorch `2.5.1+cu121` | Users may see future security/deprecation warnings when loading trusted local checkpoints. | Review checkpoint loading policy in a future hardening task; do not change during GPU validation unless approved. | GPU validation / future security |
| ``torch.cuda.amp.GradScaler(args...)` is deprecated. Please use `torch.amp.GradScaler('cuda', args...)` instead.` | `src/arclm/training/precision.py` | ArcLM-owned, fixed | Previously many training tests | PyTorch users saw noisy FutureWarnings during normal CPU tests. | Fixed by using `torch.amp.GradScaler("cuda", ...)` with a fallback for older PyTorch. | 1 |

## Notes

The remaining warnings are expected compatibility warnings. They are useful
because the tests prove old imports still work and still tell users where to
migrate. They should not be suppressed globally.
