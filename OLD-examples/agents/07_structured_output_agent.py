"""Validate final JSON only when a model marks it as structured output."""

from arclm.agents import Agent, AgentRunner, ModelResponse


OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "confidence": {"type": "number"},
    },
    "required": ["answer", "confidence"],
    "additionalProperties": False,
}


class StructuredModel:
    def generate_response(self, *, messages, tools, instructions, session):
        return ModelResponse(
            content='{"answer": "ArcLM Agent Runtime is available.", "confidence": 1.0}',
            metadata={"structured_output": True},
        )


if __name__ == "__main__":
    agent = Agent(
        name="structured_agent",
        instructions="Return JSON matching the schema.",
        model=StructuredModel(),
        output_schema=OUTPUT_SCHEMA,
    )
    result = AgentRunner().run(agent, "Status?")
    print(result.success, result.output)
