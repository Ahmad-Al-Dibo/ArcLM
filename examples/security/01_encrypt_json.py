"""Encrypt JSON and reject tampered ciphertext."""

import json
import os

from arclm.security import decrypt_json, encrypt_json


key = os.urandom(32)
envelope = encrypt_json({"message": "hello security"}, key, associated_data={"artifact_type": "demo"})
print(decrypt_json(envelope, key))

tampered = envelope.to_dict()
tampered["ciphertext"] = tampered["ciphertext"][:-2] + "AA"
try:
    decrypt_json(tampered, key)
except Exception as exc:
    print(type(exc).__name__, "tamper rejected")

print(json.dumps(envelope.to_dict(), indent=2)[:120] + "...")
