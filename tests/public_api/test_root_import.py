import ast
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


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


def test_root_stub_matches_runtime_public_exports():
    source = ast.parse((ROOT / "src" / "arclm" / "__init__.py").read_text(encoding="utf-8"))
    export_assignment = next(
        node
        for node in source.body
        if isinstance(node, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "_EXPORTS" for target in node.targets)
    )
    export_modules = ast.literal_eval(export_assignment.value)

    all_assignment = next(
        node
        for node in source.body
        if isinstance(node, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "__all__" for target in node.targets)
    )
    public_names = set()
    for item in all_assignment.value.args[0].elts:
        if isinstance(item, ast.Constant) and isinstance(item.value, str):
            public_names.add(item.value)
        elif isinstance(item, ast.Starred) and isinstance(item.value, ast.Name):
            if item.value.id == "_EXPORTS":
                public_names.update(export_modules)

    stub = ast.parse((ROOT / "src" / "arclm" / "__init__.pyi").read_text(encoding="utf-8"))
    stub_modules = {}
    for node in stub.body:
        if isinstance(node, ast.ImportFrom) and node.level == 1 and node.module:
            module = f"arclm.{node.module}"
            for alias in node.names:
                name = alias.asname or alias.name
                if not name.startswith("_") or name == "__version__":
                    stub_modules[name] = module
        elif isinstance(node, ast.FunctionDef):
            stub_modules[node.name] = None

    assert set(stub_modules) == public_names
    assert {name: stub_modules[name] for name in export_modules} == export_modules
