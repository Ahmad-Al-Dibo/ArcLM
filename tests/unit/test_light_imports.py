"""Guard the light-install contract: torch-free modules must import without torch."""

import subprocess
import sys
import textwrap
from pathlib import Path

import pytest

_SRC = Path(__file__).resolve().parents[2] / "src"

_LIGHT_MODULES = [
    "arclm",
    "arclm.security",
    "arclm.agents",
    "arclm.logics",
    "arclm.tokenizers",
    "arclm.registry",
    "arclm.tracking",
    "arclm.configs",
    "arclm.datasets",
    "arclm.exceptions",
    "arclm.utils",
    "arclm.search",
    "arclm.cli",
]

_TORCH_BACKED = [
    "arclm.models",
    "arclm.training.trainer",
    "arclm.inference",
    "arclm.evaluation",
    "arclm.peft.lora",
]


def _run_without_torch(body: str) -> subprocess.CompletedProcess:
    script = textwrap.dedent(
        """
        import sys

        class _BlockTorch:
            def find_spec(self, name, path=None, target=None):
                if name == "torch" or name.startswith("torch."):
                    raise ModuleNotFoundError("No module named %r" % name)
                return None

        sys.meta_path.insert(0, _BlockTorch())
        """
    ) + textwrap.dedent(body)
    import os

    env = os.environ.copy()
    env["PYTHONPATH"] = str(_SRC)
    return subprocess.run(
        [sys.executable, "-c", script],
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


def test_light_modules_import_without_torch():
    imports = "\n".join(f"import {name}" for name in _LIGHT_MODULES)
    result = _run_without_torch(imports + "\nprint('ok')\n")
    assert result.returncode == 0, result.stderr
    assert "ok" in result.stdout


def test_torch_backed_modules_fail_clearly_without_torch():
    for name in _TORCH_BACKED:
        result = _run_without_torch(
            f"""
            try:
                import {name}
            except Exception as exc:
                assert "arclm[train]" in str(exc), str(exc)
                print("clear")
            else:
                raise SystemExit("expected failure for {name}")
            print("ok")
            """
        )
        assert result.returncode == 0, f"{name}: {result.stderr}"
        assert "clear" in result.stdout


def test_config_and_tracking_work_without_torch():
    result = _run_without_torch(
        """
        from arclm.configs import Config
        assert Config().embed_dim == 64
        from arclm.tracking import set_reproducible_seed
        report = set_reproducible_seed(7)
        assert report["python_seeded"] is True
        assert report["torch_cpu_seeded"] is False
        print("ok")
        """
    )
    assert result.returncode == 0, result.stderr
    assert "ok" in result.stdout
