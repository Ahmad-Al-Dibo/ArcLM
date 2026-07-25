"""Show that untrusted Pickle checkpoint loading is blocked by policy."""

import tempfile
from pathlib import Path

from arclm.security.artifacts import SecureArtifactLoader


with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / "training.pt"
    path.write_bytes(b"pickle-like payload")
    try:
        SecureArtifactLoader().validate_before_load(path, artifact_type="checkpoint", uses_pickle=True)
    except Exception as exc:
        print(type(exc).__name__, "blocked before deserialization")
