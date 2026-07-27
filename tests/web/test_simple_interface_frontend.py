import shutil
import subprocess
from pathlib import Path

import pytest


pytestmark = pytest.mark.filterwarnings("ignore::DeprecationWarning")


def test_simple_interface_frontend_state_machine_jsdom():
    """Exercise the Flask Simple Interface HTML in jsdom, not just as static text."""

    root = Path(__file__).resolve().parents[2]
    node = shutil.which("node")
    if node is None:
        pytest.skip("Node.js is required for the jsdom frontend behavior test.")
    if not (root / "web" / "node_modules" / "jsdom").exists():
        pytest.skip("web/node_modules/jsdom is required for the frontend behavior test.")

    result = subprocess.run(
        [node, str(root / "tests" / "web" / "simple_interface_frontend_test.mjs")],
        cwd=root,
        text=True,
        capture_output=True,
        timeout=60,
        check=False,
    )

    assert result.returncode == 0, result.stdout + result.stderr
