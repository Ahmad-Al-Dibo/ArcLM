"""Write and read encrypted artifact metadata in a temporary workspace."""

import tempfile
from pathlib import Path

from arclm.security.artifacts import EncryptedArtifactStore
from arclm.security.keys import InMemoryKeyProvider


with tempfile.TemporaryDirectory() as tmp:
    provider = InMemoryKeyProvider()
    provider.create_key(key_id="key_demo")
    store = EncryptedArtifactStore(root=Path(tmp), key_provider=provider)
    record = store.write_json(relative_path="runs/run.json.enc", value={"loss": 0.1}, artifact_type="run_metadata")
    print(record.to_dict())
    print(store.read_json(record.path))
