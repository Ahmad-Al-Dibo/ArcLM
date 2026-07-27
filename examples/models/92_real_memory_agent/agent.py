"""Begrensde lokale Agent met configureerbare memory."""

from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path
from typing import Dict


def _load_memory_module():
    path = Path(__file__).resolve().parents[1] / "shared" / "memory.py"
    spec = importlib.util.spec_from_file_location("arclm_examples_memory", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


_memory_module = _load_memory_module()
ConversationMemory = _memory_module.ConversationMemory
MemoryConfig = _memory_module.MemoryConfig


def calculator(expression: str) -> str:
    allowed = set("0123456789+-*/(). ")
    if any(ch not in allowed for ch in expression):
        raise ValueError("Alleen eenvoudige rekenexpressies zijn toegestaan.")
    return str(eval(expression, {"__builtins__": {}}, {}))


def text_statistics(text: str) -> Dict[str, int]:
    return {"characters": len(text), "words": len(text.split())}


class FakeLocalModelAdapter:
    """Deterministische adapter voor orchestration-tests."""

    def generate(self, messages):
        joined = "\n".join(message["content"] for message in messages)
        if "projectkleur" in joined.lower():
            return "Je eerdere projectfeit was dat de projectkleur groen is."
        return "Ik heb de veilige lokale Agent-stap verwerkt."


def run_demo(persist: bool = False) -> Dict[str, object]:
    storage = Path(__file__).resolve().parent / ".local_memory"
    memory = ConversationMemory(
        MemoryConfig(
            enabled=True,
            mode="json_persistent" if persist else "in_memory",
            max_messages=20,
            max_context_tokens=2048,
            summary_threshold=14,
            persist=persist,
            storage_path=str(storage) if persist else None,
            encrypt_persistent_memory=True,
        ),
        session_id="demo",
    )
    model = FakeLocalModelAdapter()
    memory.add("user", "Onthoud dat de projectkleur groen is.")
    memory.add("assistant", "Ik onthoud de zichtbare projectkleur.")
    memory.add("user", "Bereken 2 + 3.")
    tool_result = calculator("2 + 3")
    memory.add("tool", f"calculator: {tool_result}")
    recall = memory.recall("Welke projectkleur noemde ik eerder?")
    answer = model.generate(recall)
    memory.add("assistant", answer)
    return {
        "fake_model_orchestration": "verified_manual",
        "real_local_model_run": "not_tested",
        "tool_result": tool_result,
        "recall": recall,
        "answer": answer,
        "compactions": memory.compactions,
    }


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Demonstreer lokale Agent-memory.")
    parser.add_argument("--persist", action="store_true")
    args = parser.parse_args()
    print(json.dumps(run_demo(persist=args.persist), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
