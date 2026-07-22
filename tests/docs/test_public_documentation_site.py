import ast
import importlib
import json
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "documentation-site"

DATA_FILES = {
    "docs": SITE / "docs-data.js",
    "navigation": SITE / "data" / "site-navigation.js",
    "api": SITE / "data" / "api-catalog.js",
    "modules": SITE / "data" / "module-catalog.js",
    "examples": SITE / "data" / "examples-catalog.js",
    "models": SITE / "data" / "supported-models.js",
    "datasets": SITE / "data" / "dataset-formats.js",
    "configuration": SITE / "data" / "configuration-catalog.js",
    "errors": SITE / "data" / "errors-catalog.js",
    "search": SITE / "data" / "search-index.js",
}

ASSIGNMENTS = {
    "docs": "ARCLM_DOCS",
    "navigation": "ARCLM_NAVIGATION",
    "api": "ARCLM_API_CATALOG",
    "modules": "ARCLM_MODULE_CATALOG",
    "examples": "ARCLM_EXAMPLES",
    "models": "ARCLM_SUPPORTED_MODELS",
    "datasets": "ARCLM_DATASET_FORMATS",
    "configuration": "ARCLM_CONFIGURATION_CATALOG",
    "errors": "ARCLM_ERRORS",
    "search": "ARCLM_SEARCH_INDEX",
}

FORBIDDEN_PUBLIC_PATTERNS = [
    r"\btests[\\/]",
    r"\bsrc[\\/]",
    r"\.\.[\\/]src",
    r"\.\.[\\/]tests",
    r"\bdocs[\\/]",
    r"github\.com",
    r"Verified by",
    r"Evidence",
    r"Implementation reference",
    r"Source file",
    r"test cases",
    r"evidenceId",
    r"testPaths",
    r"sourceFile",
]

FORBIDDEN_KEYS = {
    "tests",
    "evidence",
    "evidenceId",
    "implementation",
    "sourceFile",
    "testPaths",
    "examplePaths",
}

ALLOWED_STATUSES = {"Stable", "Beta", "Experimental", "Deprecated", "Internal", "Unsupported"}
ALLOWED_MODEL_STATUSES = {"native", "tested", "compatible", "experimental", "unsupported"}


def _js_data(name: str):
    text = DATA_FILES[name].read_text(encoding="utf-8")
    assignment = ASSIGNMENTS[name]
    match = re.search(rf"window\.{assignment}\s*=\s*(.*?);\s*$", text, re.S)
    assert match, f"{DATA_FILES[name]} must assign window.{assignment}"
    return json.loads(match.group(1))


def _all_public_text() -> str:
    return "\n".join(
        path.read_text(encoding="utf-8")
        for path in SITE.rglob("*")
        if path.is_file() and path.suffix in {".html", ".css", ".js", ".py", ".json", ".jsonl", ".txt", ".csv"}
    )


def _walk(value):
    if isinstance(value, dict):
        assert not (set(value) & FORBIDDEN_KEYS)
        for child in value.values():
            _walk(child)
    elif isinstance(value, list):
        for child in value:
            _walk(child)


def _href_to_path(href: str, *, base: Path | None = None) -> Path:
    root = base if base is not None else SITE
    return (root / href.split("#", 1)[0]).resolve()


def test_public_documentation_site_has_required_static_files():
    required = [
        "index.html",
        "installation.html",
        "getting-started.html",
        "architecture.html",
        "workflows.html",
        "styles.css",
        "app.js",
        "docs-data.js",
        "data/site-navigation.js",
        "data/api-catalog.js",
        "data/module-catalog.js",
        "data/examples-catalog.js",
        "data/supported-models.js",
        "data/dataset-formats.js",
        "data/configuration-catalog.js",
        "data/errors-catalog.js",
        "data/search-index.js",
    ]
    for relative in required:
        assert (SITE / relative).exists(), relative


def test_navigation_pages_and_assets_resolve():
    navigation = _js_data("navigation")
    docs = _js_data("docs")
    pages = {page["id"]: page for page in docs["pages"]}
    assert len(pages) >= 30

    seen_ids = set()
    seen_hrefs = set()
    for group in navigation:
        assert group["group"]
        for item in group["items"]:
            assert item["id"] not in seen_ids
            seen_ids.add(item["id"])
            seen_hrefs.add(item["href"])
            assert item["id"] in pages
            assert _href_to_path(item["href"]).is_file(), item["href"]

    assert seen_ids == set(pages)
    assert len(seen_hrefs) == len(pages)

    for page in pages.values():
        html_path = _href_to_path(page["href"])
        html = html_path.read_text(encoding="utf-8")
        assert "styles.css" in html
        assert "app.js" in html
        for key in DATA_FILES:
            if key != "docs":
                assert f"data/{DATA_FILES[key].name}" in html

        for attr in ["data-prev-href", "data-next-href"]:
            match = re.search(rf'{attr}="([^"]+)"', html)
            if match:
                assert _href_to_path(match.group(1), base=html_path.parent).is_file()

    examples = _js_data("examples")
    for item in examples["examples"]:
        assert (SITE / item["download"]).is_file(), item["download"]
    for project in examples["projects"]:
        assert (SITE / project["download"]).is_file(), project["download"]

    for dataset in _js_data("datasets"):
        assert (SITE / dataset["sample"]).is_file(), dataset["sample"]


def test_public_site_contains_no_internal_verification_or_repo_references():
    text = _all_public_text()
    for pattern in FORBIDDEN_PUBLIC_PATTERNS:
        assert not re.search(pattern, text), pattern

    for name in DATA_FILES:
        _walk(_js_data(name))


def test_public_data_explains_current_apis_and_modules_without_internal_paths():
    docs = _js_data("docs")
    assert docs["version"] == "0.10.0"
    assert set(docs["statuses"]) == ALLOWED_STATUSES

    api_catalog = _js_data("api")
    api_names = {entry["name"] for entry in api_catalog}
    for name in [
        "inspect_text",
        "validate_records",
        "build_dataset_report",
        "validate_sft_records",
        "build_evaluation_report",
        "model_support_matrix",
    ]:
        assert name in api_names

    for entry in api_catalog:
        assert entry["status"] in ALLOWED_STATUSES
        assert entry["summary"]
        assert entry["signature"]
        assert entry["usage"]
        module_name = entry["importPath"].rsplit(".", 1)[0]
        importlib.import_module(module_name)

    module_catalog = _js_data("modules")
    module_paths = {entry["importPath"] for entry in module_catalog}
    for import_path in [
        "arclm.datasets",
        "arclm.tokenizers",
        "arclm.models",
        "arclm.training",
        "arclm.checkpoints",
        "arclm.evaluation",
        "arclm.inference",
        "arclm.inspection",
        "arclm.web",
    ]:
        assert import_path in module_paths

    for entry in module_catalog:
        assert entry["status"] in ALLOWED_STATUSES
        assert entry["purpose"]
        assert entry["whenToUse"]
        assert "implementation" not in entry


def test_supported_models_are_honest_and_filterable():
    models = _js_data("models")
    families = {model["family"] for model in models}
    providers = {model["provider"] for model in models}
    assert "ArcLM" in providers
    assert "GPT-2" in families
    assert "Qwen3" in families

    for model in models:
        assert model["status"] in ALLOWED_MODEL_STATUSES
        assert model["name"]
        assert model["provider"]
        assert model["tasks"]
        assert isinstance(model["optionalDependencies"], list)
        assert model["limitations"]
        if model["status"] in {"compatible", "experimental"}:
            assert model["limitations"]


def test_embedded_examples_are_self_contained_and_syntactically_valid():
    examples = _js_data("examples")
    assert len(examples["examples"]) >= 8

    for item in examples["examples"]:
        assert item["code"].strip()
        assert "from arclm" in item["code"] or "import arclm" in item["code"]
        ast.parse(item["code"])

    for path in (SITE / "assets" / "examples").glob("*.py"):
        ast.parse(path.read_text(encoding="utf-8"))


def test_search_index_points_to_existing_public_pages():
    pages = {page["href"] for page in _js_data("docs")["pages"]}
    search = _js_data("search")
    assert len(search) >= len(pages)
    for item in search:
        assert item["page"] in pages
        assert item["title"]
        assert item["description"]


def test_site_can_be_copied_outside_repository(tmp_path):
    target = tmp_path / "documentation-site"
    shutil.copytree(SITE, target)

    required = [
        "index.html",
        "styles.css",
        "app.js",
        "docs-data.js",
        "data/site-navigation.js",
        "data/api-catalog.js",
        "assets/examples",
        "assets/datasets",
    ]
    for relative in required:
        assert (target / relative).exists(), relative

    copied_text = "\n".join(
        path.read_text(encoding="utf-8")
        for path in target.rglob("*")
        if path.is_file() and path.suffix in {".html", ".css", ".js", ".py", ".json", ".jsonl", ".txt", ".csv"}
    )
    for pattern in FORBIDDEN_PUBLIC_PATTERNS:
        assert not re.search(pattern, copied_text), pattern

    assert "window.ARCLM_DOCS" in (target / "docs-data.js").read_text(encoding="utf-8")
