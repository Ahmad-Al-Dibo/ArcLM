import ast
import json
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "documentation-site"
DATA = SITE / "docs-data.js"

FORBIDDEN_PUBLIC_PATTERNS = [
    "tests/",
    "tests\\",
    "src/",
    "src\\",
    "examples/",
    "examples\\",
    "docs/",
    "docs\\",
    "GitHub",
    "github.com",
    "Verified by",
    "Evidence",
    "Implementation reference",
    "Source file",
    "test cases",
    "evidenceId",
    "implementation",
    "testPaths",
    "examplePaths",
]


def _public_data() -> dict:
    text = DATA.read_text(encoding="utf-8")
    match = re.search(r"window\.ARCLM_DOCS\s*=\s*(\{.*\});\s*$", text, re.S)
    assert match, "docs-data.js must assign a self-contained object"
    js_object = match.group(1)
    json_like = re.sub(r'([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', js_object)
    return json.loads(json_like)


def test_documentation_site_files_are_self_contained():
    required = ["index.html", "styles.css", "app.js", "docs-data.js", "assets"]
    for name in required:
        assert (SITE / name).exists(), name


def test_public_docs_data_has_no_internal_verification_fields_or_repo_paths():
    text = "\n".join(path.read_text(encoding="utf-8") for path in SITE.rglob("*") if path.is_file())
    for pattern in FORBIDDEN_PUBLIC_PATTERNS:
        assert pattern not in text

    data = _public_data()
    forbidden_keys = {"tests", "evidence", "evidenceId", "implementation", "sourceFile", "testPaths", "examplePaths"}

    def walk(value):
        if isinstance(value, dict):
            assert not (set(value) & forbidden_keys)
            for child in value.values():
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(data)


def test_public_documentation_explains_current_api_with_embedded_examples():
    data = _public_data()
    assert data["version"] == "0.10.0"
    features = {item["id"]: item for item in data["features"]}
    for key in ["datasets", "tokenizers", "native-model", "training", "evaluation", "generation", "inspection", "sft"]:
        item = features[key]
        assert item["summary"]
        assert item["explanation"]
        assert item["importPath"].startswith("from arclm") or item["importPath"].startswith("arclm.")
        assert item["usage"]
        compile(item["usage"], f"<docs snippet {key}>", "exec")


def test_module_explorer_is_public_facing():
    data = _public_data()
    modules = data["modules"]
    assert any(item["importPath"] == "arclm.datasets" for item in modules)
    assert any(item["importPath"] == "arclm.web" for item in modules)
    for item in modules:
        assert item["purpose"]
        assert item["whenToUse"]
        assert item["status"] in data["statuses"]


def test_site_can_be_copied_outside_repository(tmp_path):
    target = tmp_path / "documentation-site"
    shutil.copytree(SITE, target)
    for name in ["index.html", "styles.css", "app.js", "docs-data.js", "assets"]:
        assert (target / name).exists()
    copied_text = "\n".join(path.read_text(encoding="utf-8") for path in target.rglob("*") if path.is_file())
    for pattern in FORBIDDEN_PUBLIC_PATTERNS:
        assert pattern not in copied_text
    assert "window.ARCLM_DOCS" in (target / "docs-data.js").read_text(encoding="utf-8")
