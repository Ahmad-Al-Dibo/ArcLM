from pathlib import Path
from typing import Dict


def write_text_file(path: Path, content: str) -> None:
    """Write a UTF-8 text file, creating parent directories as needed."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def create_init_workspace(project_dir: str | Path, project_name: str, templates: Dict[str, str]) -> None:
    """Create a starter project layout from a templates mapping.

    `templates` should map workspace-relative paths (str) to file content (str).
    """
    root = Path(project_dir).expanduser().resolve()
    root.mkdir(parents=True, exist_ok=True)

    # Ensure common directories exist by scanning template keys.
    dirs = set()
    for rel_path in templates.keys():
        parent = Path(rel_path).parent
        if str(parent) == ".":
            continue
        dirs.add(root / parent)

    for d in sorted(dirs):
        d.mkdir(parents=True, exist_ok=True)

    # Write files
    for rel_path, content in templates.items():
        dest = root / rel_path
        if isinstance(content, str):
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(content, encoding="utf-8")
        else:
            # Fallback: coerce to string
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(str(content), encoding="utf-8")
