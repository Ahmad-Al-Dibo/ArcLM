"""Build standalone ArcLM editions from canonical source manifests.

The builder intentionally uses AST import discovery instead of importing ArcLM
modules during analysis. Generated editions live under ``distributions/<id>``
and can be rebuilt from ``src/arclm`` at any time.
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = ROOT / "src"
PACKAGE_ROOT = SRC_ROOT / "arclm"
DISTRIBUTIONS_ROOT = ROOT / "distributions"
MANIFEST_ROOT = DISTRIBUTIONS_ROOT / "manifests"
GENERATED_NOTICE = "This directory is generated from canonical ArcLM source. Do not edit generated source files directly."
CONTROLLED_MODULE_ERROR = (
    "This ArcLM edition does not include '{module}'. Install full ArcLM or build an edition that includes this capability."
)


@dataclass
class ImportEdge:
    source: str
    target: str
    optional: bool = False


@dataclass
class AnalysisResult:
    manifest: dict[str, Any]
    modules: set[str] = field(default_factory=set)
    assets: set[str] = field(default_factory=set)
    required_edges: list[ImportEdge] = field(default_factory=list)
    optional_edges: list[ImportEdge] = field(default_factory=list)
    excluded_hits: list[ImportEdge] = field(default_factory=list)
    unresolved: list[ImportEdge] = field(default_factory=list)
    cycles: list[list[str]] = field(default_factory=list)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def load_manifest(edition: str) -> dict[str, Any]:
    path = MANIFEST_ROOT / f"{edition}.json"
    if not path.exists():
        raise SystemExit(f"Unknown edition {edition!r}. Use 'list' to see available manifests.")
    manifest = json.loads(read_text(path))
    if manifest.get("schema_version") != 1:
        raise SystemExit(f"{path} has unsupported schema_version {manifest.get('schema_version')!r}")
    return manifest


def all_manifests() -> list[dict[str, Any]]:
    return [json.loads(read_text(path)) for path in sorted(MANIFEST_ROOT.glob("*.json"))]


def module_to_path(module: str) -> Path | None:
    if not module.startswith("arclm"):
        return None
    parts = module.split(".")
    if parts == ["arclm"]:
        return PACKAGE_ROOT / "__init__.py"
    package_path = SRC_ROOT.joinpath(*parts)
    if (package_path / "__init__.py").exists():
        return package_path / "__init__.py"
    module_path = package_path.with_suffix(".py")
    if module_path.exists():
        return module_path
    return None


def path_to_module(path: Path) -> str:
    rel = path.relative_to(PACKAGE_ROOT).with_suffix("")
    parts = ("arclm", *rel.parts)
    if parts[-1] == "__init__":
        parts = parts[:-1]
    return ".".join(parts)


def is_package_module(module: str) -> bool:
    path = module_to_path(module)
    return bool(path and path.name == "__init__.py")


def expand_package(module: str) -> set[str]:
    path = module_to_path(module)
    if not path:
        return set()
    if path.name != "__init__.py":
        return {module}
    package_dir = path.parent
    modules = set()
    for py in package_dir.rglob("*.py"):
        if "__pycache__" in py.parts:
            continue
        modules.add(path_to_module(py))
    return modules


def local_module_candidates(target: str) -> list[str]:
    if not target.startswith("arclm"):
        return []
    parts = target.split(".")
    candidates = []
    for index in range(len(parts), 0, -1):
        candidate = ".".join(parts[:index])
        if module_to_path(candidate):
            candidates.append(candidate)
            break
    return candidates


def resolve_relative_module(current: str, current_is_package: bool, level: int, module: str | None) -> str:
    package = current if current_is_package else current.rsplit(".", 1)[0]
    parts = package.split(".")
    if level > 1:
        parts = parts[: -(level - 1)]
    if module:
        parts.extend(module.split("."))
    return ".".join(parts)


class ImportVisitor(ast.NodeVisitor):
    def __init__(self, module: str, current_is_package: bool):
        self.module = module
        self.current_is_package = current_is_package
        self.edges: list[ImportEdge] = []
        self._scope_depth = 0

    def visit_FunctionDef(self, node: ast.FunctionDef) -> Any:
        self._scope_depth += 1
        self.generic_visit(node)
        self._scope_depth -= 1

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_ClassDef(self, node: ast.ClassDef) -> Any:
        self._scope_depth += 1
        self.generic_visit(node)
        self._scope_depth -= 1

    def visit_Import(self, node: ast.Import) -> Any:
        for alias in node.names:
            for candidate in local_module_candidates(alias.name):
                self.edges.append(ImportEdge(self.module, candidate, optional=self._scope_depth > 0))

    def visit_ImportFrom(self, node: ast.ImportFrom) -> Any:
        if node.level:
            target = resolve_relative_module(self.module, self.current_is_package, node.level, node.module)
        else:
            target = node.module or ""
        for candidate in local_module_candidates(target):
            self.edges.append(ImportEdge(self.module, candidate, optional=self._scope_depth > 0))


def module_import_edges(module: str) -> list[ImportEdge]:
    path = module_to_path(module)
    if not path:
        return []
    tree = ast.parse(read_text(path), filename=str(path))
    visitor = ImportVisitor(module, path.name == "__init__.py")
    visitor.visit(tree)
    return visitor.edges


def is_excluded(module: str, manifest: dict[str, Any]) -> bool:
    return any(module == prefix or module.startswith(prefix + ".") for prefix in manifest.get("excluded_module_prefixes", []))


def analyze(manifest: dict[str, Any]) -> AnalysisResult:
    result = AnalysisResult(manifest=manifest)
    pending: list[str] = []
    for module in manifest.get("include_modules", []):
        expanded = expand_package(module) if is_package_module(module) else {module}
        for item in expanded:
            if item not in result.modules:
                result.modules.add(item)
                pending.append(item)
    for prefix in manifest.get("include_module_prefixes", []):
        for item in expand_package(prefix):
            if item not in result.modules:
                result.modules.add(item)
                pending.append(item)
    result.assets.update(manifest.get("include_assets", []))

    while pending:
        module = pending.pop(0)
        for edge in module_import_edges(module):
            target = edge.target
            if target in {"arclm", "arclm.cli"}:
                continue
            if is_excluded(target, manifest):
                result.excluded_hits.append(edge)
                continue
            if edge.optional:
                result.optional_edges.append(edge)
                continue
            if not module_to_path(target):
                result.unresolved.append(edge)
                continue
            result.required_edges.append(edge)
            if target not in result.modules:
                result.modules.add(target)
                pending.append(target)
    result.cycles = find_cycles(result.required_edges)
    return result


def find_cycles(edges: list[ImportEdge]) -> list[list[str]]:
    graph: dict[str, set[str]] = {}
    for edge in edges:
        graph.setdefault(edge.source, set()).add(edge.target)
    cycles: list[list[str]] = []
    visiting: set[str] = set()
    visited: set[str] = set()
    stack: list[str] = []

    def visit(node: str) -> None:
        if node in visiting:
            if node in stack:
                cycles.append(stack[stack.index(node) :] + [node])
            return
        if node in visited:
            return
        visiting.add(node)
        stack.append(node)
        for target in graph.get(node, set()):
            visit(target)
        stack.pop()
        visiting.remove(node)
        visited.add(node)

    for node in sorted(graph):
        visit(node)
    unique = []
    seen = set()
    for cycle in cycles:
        key = tuple(cycle)
        if key not in seen:
            unique.append(cycle)
            seen.add(key)
    return unique[:25]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def clean_output_dir(path: Path) -> None:
    resolved = path.resolve()
    allowed_parent = DISTRIBUTIONS_ROOT.resolve()
    if allowed_parent not in (resolved, *resolved.parents):
        raise SystemExit(f"Refusing to clean outside distributions/: {resolved}")
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def write_generated_root(package_dir: Path, manifest: dict[str, Any], source_version: str, modules: list[str]) -> None:
    info = {
        "edition": manifest["id"],
        "edition_name": manifest["name"],
        "source_version": source_version,
        "manifest_schema_version": manifest["schema_version"],
        "capabilities": manifest.get("capabilities", []),
        "excluded": manifest.get("excluded_apis", []),
        "included_modules": modules,
        "required_dependencies": manifest.get("python_dependencies", []),
        "optional_dependencies": manifest.get("optional_dependencies", {}),
    }
    (package_dir / "_distribution.py").write_text(
        "# Generated by tools/build_arclm_distributions.py\n"
        "import json\n\n"
        f"DISTRIBUTION_INFO = json.loads({json.dumps(info, sort_keys=True)!r})\n",
        encoding="utf-8",
    )
    (package_dir / "__init__.py").write_text(
        '"""ArcLM generated standalone edition root."""\n\n'
        "from __future__ import annotations\n\n"
        "from importlib import import_module\n"
        "from typing import Any\n\n"
        "from ._version import __api_version__, __version__\n"
        "from ._distribution import DISTRIBUTION_INFO\n\n"
        "__author__ = 'Ahmad Al Dibo'\n"
        "LICENSE = 'Apache-2.0'\n\n"
        "def get_distribution_info() -> dict[str, Any]:\n"
        "    return dict(DISTRIBUTION_INFO)\n\n"
        "def get_version() -> str:\n"
        "    return __version__\n\n"
        "def get_api_version() -> str:\n"
        "    return __api_version__\n\n"
        "def __getattr__(name: str) -> Any:\n"
        "    raise AttributeError("
        "\"This ArcLM edition does not export %r from the root namespace. Import an included submodule or install full ArcLM.\" % name"
        ")\n\n"
        "__all__ = ['__version__', '__api_version__', 'get_version', 'get_api_version', 'get_distribution_info']\n",
        encoding="utf-8",
    )
    (package_dir / "cli.py").write_text(
        '"""Distribution-aware ArcLM CLI."""\n\n'
        "from __future__ import annotations\n\n"
        "import argparse\n"
        "from ._distribution import DISTRIBUTION_INFO\n\n"
        "def main(argv=None):\n"
        "    parser = argparse.ArgumentParser(prog='arclm', description=DISTRIBUTION_INFO['edition_name'])\n"
        "    parser.add_argument('--version', action='store_true')\n"
        "    parser.add_argument('--run', choices=['simple-interface', 'simple_interface'], default=None)\n"
        "    parser.add_argument('--host', default='127.0.0.1')\n"
        "    parser.add_argument('--port', type=int, default=5000)\n"
        "    parser.add_argument('--debug', action='store_true')\n"
        "    parser.add_argument('--no-debug', action='store_true')\n"
        "    args = parser.parse_args(argv)\n"
        "    if args.version:\n"
        "        from ._version import __version__\n"
        "        print(__version__)\n"
        "        return 0\n"
        "    if args.run in {'simple-interface', 'simple_interface'}:\n"
        "        if 'simple_interface' not in DISTRIBUTION_INFO.get('capabilities', []):\n"
        f"            raise SystemExit({CONTROLLED_MODULE_ERROR!r}.format(module='simple_interface'))\n"
        "        from .simple_interface import run_simple_interface\n"
        "        return run_simple_interface(host=args.host, port=args.port, debug=args.debug and not args.no_debug)\n"
        "    parser.print_help()\n"
        "    return 0\n",
        encoding="utf-8",
    )
    (package_dir / "__main__.py").write_text(
        '"""Run a generated ArcLM edition with ``python -m arclm``."""\n\n'
        "from .cli import main\n\n"
        "if __name__ == '__main__':\n"
        "    raise SystemExit(main())\n",
        encoding="utf-8",
    )


def copy_module(module: str, output_src: Path) -> dict[str, Any]:
    source = module_to_path(module)
    if not source:
        raise SystemExit(f"Cannot copy unresolved module {module}")
    rel = source.relative_to(SRC_ROOT)
    target = output_src / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    return {"module": module, "source": str(source.relative_to(ROOT)), "path": str(target.relative_to(output_src.parent)), "sha256": sha256(source), "bytes": source.stat().st_size}


def copy_asset(asset: str, output_src: Path) -> list[dict[str, Any]]:
    source = PACKAGE_ROOT.parent / asset
    if not source.exists():
        raise SystemExit(f"Asset does not exist: {asset}")
    copied = []
    if source.is_dir():
        for path in source.rglob("*"):
            if path.is_file() and "__pycache__" not in path.parts and path.suffix not in {".pyc", ".pyo"}:
                rel = path.relative_to(SRC_ROOT)
                target = output_src / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(path, target)
                copied.append({"asset": asset, "source": str(path.relative_to(ROOT)), "path": str(target.relative_to(output_src.parent)), "sha256": sha256(path), "bytes": path.stat().st_size})
    else:
        rel = source.relative_to(SRC_ROOT)
        target = output_src / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        copied.append({"asset": asset, "source": str(source.relative_to(ROOT)), "path": str(target.relative_to(output_src.parent)), "sha256": sha256(source), "bytes": source.stat().st_size})
    return copied


def copy_example(example: str, output: Path) -> dict[str, Any]:
    source = ROOT / example
    if not source.exists() or not source.is_file():
        raise SystemExit(f"Example does not exist: {example}")
    target = output / "examples" / source.name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    return {"example": example, "source": str(source.relative_to(ROOT)), "path": str(target.relative_to(output)), "sha256": sha256(source), "bytes": source.stat().st_size}


def current_version() -> str:
    namespace: dict[str, Any] = {}
    exec(read_text(PACKAGE_ROOT / "_version.py"), namespace)
    return str(namespace["__version__"])


def write_project_files(output: Path, manifest: dict[str, Any], inventory: list[dict[str, Any]], source_version: str) -> None:
    package_name = "arclm-" + manifest["id"].replace("_", "-")
    deps = manifest.get("python_dependencies", [])
    optional = manifest.get("optional_dependencies", {})
    optional_text = "\n".join(
        f'{extra} = {json.dumps(values)}' for extra, values in sorted(optional.items())
    )
    (output / "pyproject.toml").write_text(
        "[build-system]\n"
        'requires = ["setuptools>=69", "wheel"]\n'
        'build-backend = "setuptools.build_meta"\n\n'
        "[project]\n"
        f'name = "{package_name}"\n'
        f'version = "{source_version}"\n'
        f'description = "{manifest["description"]}"\n'
        'readme = "README.md"\n'
        'requires-python = ">=3.9,<3.13"\n'
        'license = "Apache-2.0"\n'
        'authors = [{ name = "Ahmad Al Dibo" }]\n'
        f"dependencies = {json.dumps(deps, indent=2)}\n\n"
        + ("[project.optional-dependencies]\n" + optional_text + "\n\n" if optional_text else "")
        + "[project.scripts]\n"
        'arclm = "arclm.cli:main"\n\n'
        "[tool.setuptools]\n"
        'package-dir = { "" = "src" }\n\n'
        "[tool.setuptools.packages.find]\n"
        'where = ["src"]\n'
        'include = ["arclm*"]\n\n'
        "[tool.setuptools.package-data]\n"
        'arclm = ["templates/*.html", "py.typed"]\n',
        encoding="utf-8",
    )
    (output / "MANIFEST.in").write_text(
        "include LICENSE\ninclude NOTICE.md\ninclude distribution-manifest.json\ninclude source-inventory.json\nrecursive-include src/arclm/templates *.html\nglobal-exclude __pycache__ *.py[cod]\n",
        encoding="utf-8",
    )
    license_source = ROOT / "LICENSE"
    if license_source.exists():
        shutil.copy2(license_source, output / "LICENSE")
    else:
        (output / "LICENSE").write_text("Apache-2.0\n", encoding="utf-8")
    (output / "NOTICE.md").write_text(
        f"# {manifest['name']} Notice\n\n{GENERATED_NOTICE}\n\nSource ArcLM version: `{source_version}`.\n",
        encoding="utf-8",
    )
    docs = {
        "README.md": [
            f"# {manifest['name']}",
            "",
            manifest["description"],
            "",
            GENERATED_NOTICE,
            "",
            "## Contains",
            "",
            *[f"- {item}" for item in manifest.get("capabilities", [])],
            "",
            "## Excludes",
            "",
            *[f"- {item}" for item in manifest.get("excluded_apis", [])],
            "",
            "## Quick Start",
            "",
            "```bash",
            *(manifest.get("commands") or ["python -c \"import arclm; print(arclm.get_distribution_info())\""]),
            "```",
            "",
            "## Relationship To Full ArcLM",
            "",
            "This edition preserves the `arclm` namespace for independent installation. Do not install multiple partial ArcLM editions together unless composition is explicitly supported.",
        ],
        "INSTALLATION.md": ["# Installation", "", f"Build from the canonical repository with `python tools/build_arclm_distributions.py build {manifest['id']}` and install the produced wheel from this directory."],
        "USAGE.md": ["# Usage", "", "Commands:", "", "```bash", *(manifest.get("commands") or []), "```"],
        "API.md": ["# API", "", *[f"- `{item}`" for item in manifest.get("public_api", [])]],
        "LIMITATIONS.md": ["# Limitations", "", "This is a smaller source edition, not a smaller model-weight package.", "", *[f"- Excludes `{item}`." for item in manifest.get("excluded_apis", [])]],
    }
    for name, lines in docs.items():
        (output / name).write_text("\n".join(lines) + "\n", encoding="utf-8")
    (output / "distribution-manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8")
    (output / "source-inventory.json").write_text(
        json.dumps(
            {
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "source_version": source_version,
                "edition": manifest["id"],
                "notice": GENERATED_NOTICE,
                "files": sorted(inventory, key=lambda item: item["path"]),
            },
            indent=2,
            sort_keys=True,
        ),
        encoding="utf-8",
    )


def build(edition: str) -> Path:
    manifest = load_manifest(edition)
    result = analyze(manifest)
    blocking_excluded = [edge for edge in result.excluded_hits if not edge.optional]
    if blocking_excluded:
        details = "\n".join(f"{edge.source} -> {edge.target}" for edge in blocking_excluded[:20])
        raise SystemExit(f"{edition} has excluded dependency hits:\n{details}")
    if result.unresolved:
        details = "\n".join(f"{edge.source} -> {edge.target}" for edge in result.unresolved[:20])
        raise SystemExit(f"{edition} has unresolved local imports:\n{details}")
    output = DISTRIBUTIONS_ROOT / edition
    clean_output_dir(output)
    output_src = output / "src"
    package_dir = output_src / "arclm"
    inventory: list[dict[str, Any]] = []
    modules = sorted(result.modules)
    for module in modules:
        if module in {"arclm", "arclm.cli"}:
            continue
        inventory.append(copy_module(module, output_src))
    for asset in sorted(result.assets):
        inventory.extend(copy_asset(asset, output_src))
    for example in sorted(manifest.get("examples", [])):
        inventory.append(copy_example(example, output))
    source_version = current_version()
    package_dir.mkdir(parents=True, exist_ok=True)
    write_generated_root(package_dir, manifest, source_version, modules)
    for generated in ("__init__.py", "__main__.py", "cli.py", "_distribution.py"):
        path = package_dir / generated
        inventory.append({"module": f"arclm.{generated[:-3]}", "source": "generated", "path": str(path.relative_to(output)), "sha256": sha256(path), "bytes": path.stat().st_size})
    write_project_files(output, manifest, inventory, source_version)
    return output


def inspect(edition: str) -> dict[str, Any]:
    manifest = load_manifest(edition)
    result = analyze(manifest)
    module_files = [module_to_path(module) for module in result.modules if module_to_path(module)]
    return {
        "id": manifest["id"],
        "name": manifest["name"],
        "capabilities": manifest.get("capabilities", []),
        "modules": sorted(result.modules),
        "module_count": len(result.modules),
        "source_file_count": len(module_files),
        "source_size_bytes": sum(path.stat().st_size for path in module_files if path),
        "required_edges": [edge.__dict__ for edge in result.required_edges],
        "optional_edges": [edge.__dict__ for edge in result.optional_edges],
        "excluded_hits": [edge.__dict__ for edge in result.excluded_hits],
        "unresolved": [edge.__dict__ for edge in result.unresolved],
        "cycles": result.cycles,
        "dependencies": manifest.get("python_dependencies", []),
        "optional_dependencies": manifest.get("optional_dependencies", {}),
    }


def verify(edition: str) -> dict[str, Any]:
    output = DISTRIBUTIONS_ROOT / edition
    if not output.exists():
        output = build(edition)
    manifest = json.loads(read_text(output / "distribution-manifest.json"))
    inventory = json.loads(read_text(output / "source-inventory.json"))
    missing = []
    changed = []
    for item in inventory.get("files", []):
        path = output / item["path"]
        if not path.exists():
            missing.append(item["path"])
        elif sha256(path) != item["sha256"] and item.get("source") != "generated":
            changed.append(item["path"])
    compile_result = subprocess.run([sys.executable, "-m", "compileall", "-q", str(output / "src")], cwd=output, text=True, capture_output=True)
    approved = {item["path"] for item in inventory.get("files", [])}
    extra = []
    for path in (output / "src").rglob("*"):
        if path.is_file() and "__pycache__" not in path.parts and path.suffix not in {".pyc", ".pyo"}:
            rel = str(path.relative_to(output))
            if rel not in approved:
                extra.append(rel)
    return {
        "edition": manifest["id"],
        "ok": not missing and not changed and not extra and compile_result.returncode == 0,
        "missing": missing,
        "changed": changed,
        "unexpected_extra": extra,
        "compile_returncode": compile_result.returncode,
        "compile_stderr": compile_result.stderr,
    }


def check_drift() -> dict[str, Any]:
    results = {}
    for manifest in all_manifests():
        edition = manifest["id"]
        output = DISTRIBUTIONS_ROOT / edition
        if not output.exists():
            results[edition] = {"built": False, "ok": False, "reason": "edition has not been built"}
            continue
        inventory = json.loads(read_text(output / "source-inventory.json"))
        drift = []
        for item in inventory.get("files", []):
            if item.get("source") in {"generated", None}:
                continue
            source = ROOT / item["source"]
            if not source.exists() or sha256(source) != item["sha256"]:
                drift.append(item["source"])
        results[edition] = {"built": True, "ok": not drift, "drifted_sources": drift}
    return results


def print_json(value: Any) -> None:
    print(json.dumps(value, indent=2, sort_keys=True))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build standalone ArcLM distributions.")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("list")
    graph_parser = sub.add_parser("graph")
    graph_parser.add_argument("edition")
    inspect_parser = sub.add_parser("inspect")
    inspect_parser.add_argument("edition")
    build_parser = sub.add_parser("build")
    build_parser.add_argument("edition")
    verify_parser = sub.add_parser("verify")
    verify_parser.add_argument("edition")
    sub.add_parser("build-all")
    sub.add_parser("test-all")
    sub.add_parser("check-drift")
    args = parser.parse_args(argv)

    if args.command == "list":
        for manifest in all_manifests():
            print(f"{manifest['id']}: {manifest['name']}")
        return 0
    if args.command == "inspect":
        print_json(inspect(args.edition))
        return 0
    if args.command == "graph":
        data = inspect(args.edition)
        for edge in data["required_edges"]:
            print(f"{edge['source']} -> {edge['target']}")
        return 0
    if args.command == "build":
        print(build(args.edition))
        return 0
    if args.command == "verify":
        print_json(verify(args.edition))
        return 0
    if args.command == "build-all":
        for manifest in all_manifests():
            print(build(manifest["id"]))
        return 0
    if args.command == "test-all":
        results = {manifest["id"]: verify(manifest["id"]) for manifest in all_manifests()}
        print_json(results)
        return 0 if all(item["ok"] for item in results.values()) else 1
    if args.command == "check-drift":
        results = check_drift()
        print_json(results)
        return 0 if all(item["ok"] for item in results.values()) else 1
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
