from arclm.agents import Agent, AgentRunner, ModelResponse, tool


@tool
def add_one(value: int) -> int:
    return value + 1


class Model:
    def generate_response(self, *, messages, tools, instructions, session):
        return ModelResponse(content="Done.")


agent = Agent("example", "Answer directly.", Model(), tools=[add_one])
print(AgentRunner(max_steps=1).run(agent, "Say done.").output)
