# ArcLM Lab

This folder contains small implementation exercises for testing engineers,
agents, and future workers before they touch ArcLM production code.

The exercises are intentionally written as stubs:

```python
def example_task(...):
    """Explains what the worker should implement."""
    pass
```

Use them to check whether a worker can understand the ArcLM flow:

```text
data -> tokenizer -> model -> training -> checkpoint -> artifact -> evaluation -> inference -> distributed runtime
```

## Levels

| Level | Folder | Purpose |
| ----- | ------ | ------- |
| Beginner | `beginner/` | Basic data, model, and training concepts |
| Intermediate | `intermediate/` | Reusable pipeline, lifecycle, and trainer pieces |
| Advanced | `advanced/` | Checkpoints, artifacts, fine-tuning, evaluation, and inference |
| Expert | `expert/` | Distributed runtime, FSDP policy, and architecture decisions |

## Rules For Workers

- Do not modify ArcLM production code while solving lab tasks.
- Add tests next to the lab solution when a task asks for behavior.
- Keep imports lightweight.
- Do not download models or datasets.
- Prefer tiny local fixtures.
- Do not claim hardware validation from mocks.

