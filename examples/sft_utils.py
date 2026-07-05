"""Small helpers shared by the SFT example scripts."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, Iterable, List, Tuple

from arclm import DataProcessor


def read_instruction_pairs(path: str | Path) -> Tuple[List[str], List[str]]:
    """Load common SFT record formats into instruction/response pairs."""
    dataset = DataProcessor.load(path).clean()
    instructions = []
    responses = []

    for row in dataset.samples:
        pair = _row_to_pair(row)
        if pair is None:
            continue
        instruction, response = pair
        if instruction and response:
            instructions.append(instruction)
            responses.append(response)

    if not instructions:
        raise ValueError(f"No instruction/response pairs found in {path}.")

    return instructions, responses


def _row_to_pair(row: Dict) -> Tuple[str, str] | None:
    if isinstance(row.get("messages"), list):
        return _messages_to_pair(row["messages"], role_key="role", text_key="content")

    if isinstance(row.get("conversations"), list):
        return _messages_to_pair(
            row["conversations"],
            role_key="from",
            text_key="value",
            user_roles={"human", "user"},
            assistant_roles={"gpt", "assistant"},
        )

    instruction = (
        row.get("instruction")
        or row.get("prompt")
        or row.get("question")
        or row.get("input")
        or ""
    )
    extra_input = row.get("input") if row.get("instruction") else ""
    response = (
        row.get("output")
        or row.get("response")
        or row.get("completion")
        or row.get("answer")
        or ""
    )

    if extra_input:
        instruction = f"{instruction}\n{extra_input}".strip()

    return str(instruction).strip(), str(response).strip()


def _messages_to_pair(
    messages: Iterable[Dict],
    role_key: str,
    text_key: str,
    user_roles=None,
    assistant_roles=None,
) -> Tuple[str, str] | None:
    user_roles = user_roles or {"user"}
    assistant_roles = assistant_roles or {"assistant"}
    turns = [
        (str(message.get(role_key, "")).lower(), str(message.get(text_key, "")).strip())
        for message in messages
    ]
    assistant_indexes = [
        index for index, (role, text) in enumerate(turns)
        if role in assistant_roles and text
    ]
    if not assistant_indexes:
        return None

    answer_index = assistant_indexes[-1]
    response = turns[answer_index][1]
    prompt_parts = [
        text
        for role, text in turns[:answer_index]
        if role in user_roles and text
    ]
    return "\n".join(prompt_parts).strip(), response
