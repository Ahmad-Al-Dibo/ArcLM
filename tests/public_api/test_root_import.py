import os
import subprocess
import sys


def test_root_import_is_lightweight():
    env = dict(os.environ)
    env["PYTHONPATH"] = "src"
    result = subprocess.run(
        [
            sys.executable,
            "-c",
            "import sys; import arclm; print(arclm.__version__); "
            "raise SystemExit(1 if 'torch' in sys.modules else 0)",
        ],
        env=env,
        text=True,
        capture_output=True,
        check=False,
    )

    assert result.returncode == 0, result.stderr
