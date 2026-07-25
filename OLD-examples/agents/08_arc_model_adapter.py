"""Wrap an ArcLM-style generation callable with a strict JSON tool protocol."""

from arclm.agents import ArcLMJSONToolAdapter
from arclm.agents.model import parse_json_model_response


def generate_text(prompt: str) -> str:
    return '{"type": "tool_call", "tool": "calculate_total", "arguments": {"price": 12.5, "quantity": 3}}'


if __name__ == "__main__":
    adapter = ArcLMJSONToolAdapter(generate_text=generate_text)
    response = adapter.generate_response(messages=[], tools=[], instructions="Use strict JSON.", session=None)
    print(response.to_dict())
    print(parse_json_model_response("not json").to_dict())
    print("Limitation: constrained JSON depends on model output quality and malformed responses are rejected.")
