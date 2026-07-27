"""Expert tasks for ArcLM architecture decisions."""

from __future__ import annotations


def classify_feature_boundary(feature_name: str) -> str:
    """Classify a feature as Community, Pro, Web, or External validation.

    Example input:
        "Dataset cleaning"

    Expected output:
        "Community"

    Example input:
        "Team permissions"

    Expected output:
        "Pro"
    """
    pass


def design_optional_dependency_error(package_name: str, extra_name: str) -> str:
    """Return a helpful install message for a missing optional dependency.

    Example input:
        package_name="transformers"
        extra_name="hf"

    Expected output:
        "This feature requires transformers. Install it with: pip install arclm[hf]"
    """
    pass


def review_public_api_change(old_api: str, new_api: str) -> dict[str, object]:
    """Plan compatibility, deprecation, tests, and documentation for an API move.

    Example input:
        old_api="from arclm.sft import train_sft"
        new_api="from arclm.finetuning import train_sft"

    Expected output:
        {
            "keep_alias": True,
            "deprecation_warning": True,
            "tests": ["old import", "new import"],
        }
    """
    pass


class ArchitectureDecisionRecord:
    """Create a small architecture decision record.

    The worker should include context, decision, consequences, status, and the
    exact tests needed to prove the decision later.

    Example input:
        title="Keep FastAPI optional"

    Expected output:
        Markdown with Context, Decision, Consequences, Status, and Tests.
    """

    def __init__(self, title: str):
        pass

    def render_markdown(self) -> str:
        pass
