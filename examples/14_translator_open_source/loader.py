"""Load a small open-source instruct model via ArcLM inference."""

from __future__ import annotations

import os
from typing import Any

from arclm.inference import load_any_model

import config as project


def load_translator_model() -> Any:
    model_id = os.environ.get("TRANSLATOR_MODEL", project.MODEL_ID)
    return load_any_model(
        model_id,
        device=project.DEVICE,
        trust_remote_code=project.TRUST_REMOTE_CODE,
    )
