# Templates and file contents used by the `arclm init` CLI command.

README_TEMPLATE = """# {project_name}

Welcome to your new ArcLM project workspace.

This starter structure is designed for developers who want to go from idea to first training run quickly.

## Project structure

- `README.md` - project overview and onboarding notes
- `main.py` - entry point that demonstrates the recommended workflow
- `output/` - generated checkpoints, reports, and artifacts
- `models/` - local model checkpoints and weights
- `data/` - datasets for pretraining and fine-tuning
- `tests/` - validation and regression checks
- `src/preparing_data/` - dataset preparation helpers
- `src/pretraining/` - minimal pretraining examples
- `src/finetuning/` - fine-tuning examples
- `src/agents/` - agent-oriented helpers
- `src/security/` - safety and security examples
- `src/logic/` - custom project logic

## Prepare datasets

1. Put raw training text into `data/plain.txt` for pretraining style experiments.
2. Add supervised examples to `data/conversation.json` using the schema below:
   ```json
   [
     {
       "question": "What would you like the model to answer?",
       "answer": "Provide the expected response here."
     }
   ]
   ```
3. Extend the schema with extra fields when your workflow needs them.

## Run the starter app

```bash
python main.py
```

## Explore the modules

- `src/preparing_data/basic.py` prepares starter datasets.
- `src/pretraining/basic.py` shows a minimal pretraining placeholder.
- `src/finetuning/basic.py` shows a simple fine-tuning placeholder.
- `src/agents/basic.py` demonstrates an agent-style workflow.
- `src/security/basic.py` shows one security-oriented pattern.
- `src/logic/basic.py` contains custom logic helpers.

## ArcLM documentation

- ArcLM repository: https://github.com/ahmad-al-dibo/arclm
- ArcLM overview: https://github.com/ahmad-al-dibo/arclm#readme

## Recommended next steps

- Review the ArcLM documentation and examples.
- Replace placeholder data with your own corpora.
- Add tests for each workflow step as the project grows.
- Move from the starter examples to real training scripts once your data is ready.
"""

MAIN_PY = '''"""Starter entry point for an ArcLM project."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from preparing_data.basic import prepare_sample_dataset
from pretraining.basic import run_pretraining_example
from finetuning.basic import run_finetuning_example
from agents.basic import run_agent_example
from security.basic import run_security_example
from logic.basic import run_logic_example


def main() -> None:
    print(f"Welcome to {ROOT.name}!")
    print("Preparing starter datasets...")
    prepare_sample_dataset()
    print("Running starter examples...")
    run_pretraining_example()
    run_finetuning_example()
    run_agent_example()
    run_security_example()
    run_logic_example()


if __name__ == "__main__":
    main()
'''

CONVERSATION_JSON = "[\n  {\n    \"question\": \"What would you like the model to answer?\",\n    \"answer\": \"Provide the expected response here.\"\n  }\n]\n"

MODULE_INIT = '"""Starter module for ArcLM project components."""\n'

BASIC_MODULES = {
    "src/preparing_data/__init__.py": MODULE_INIT,
    "src/pretraining/__init__.py": MODULE_INIT,
    "src/finetuning/__init__.py": MODULE_INIT,
    "src/agents/__init__.py": MODULE_INIT,
    "src/security/__init__.py": MODULE_INIT,
    "src/logic/__init__.py": MODULE_INIT,
    "README.md": README_TEMPLATE,
    "main.py": MAIN_PY,
    "data/plain.txt": "",
    "data/conversation.json": CONVERSATION_JSON,
    "src/preparing_data/basic.py": '''\
from pathlib import Path
import json


def prepare_sample_dataset() -> None:
    """Create starter text and conversation files for a new project."""
    root = Path(__file__).resolve().parents[2]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    (data_dir / "plain.txt").write_text("ArcLM starter dataset.\n", encoding="utf-8")
    payload = [
        {
            "question": "What is ArcLM?",
            "answer": "ArcLM is a compact toolkit for training and fine-tuning language models.",
        }
    ]
    (data_dir / "conversation.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print("Prepared starter datasets in data/")


if __name__ == "__main__":
    prepare_sample_dataset()
''',
    "src/pretraining/basic.py": '''\
from pathlib import Path


def run_pretraining_example() -> None:
    """Show a minimal placeholder for a pretraining workflow."""
    print("Pretraining example ready. Add a corpus to data/plain.txt to begin.")


if __name__ == "__main__":
    run_pretraining_example()
''',
    "src/finetuning/basic.py": '''\
from pathlib import Path


def run_finetuning_example() -> None:
    """Show a minimal placeholder for a fine-tuning workflow."""
    print("Fine-tuning example ready. Add examples to data/conversation.json to begin.")


if __name__ == "__main__":
    run_finetuning_example()
''',
    "src/agents/basic.py": '''\
from pathlib import Path


def run_agent_example() -> None:
    """Show a very small agent-style pattern."""
    print("Agent example ready. Use this module to wrap tool or planning logic.")


if __name__ == "__main__":
    run_agent_example()
''',
    "src/security/basic.py": '''\
from pathlib import Path


def run_security_example() -> None:
    """Show a minimal security reminder for project workflows."""
    print("Security example ready. Review prompts, secrets, and data handling before deployment.")


if __name__ == "__main__":
    run_security_example()
''',
    "src/logic/basic.py": '''\
from pathlib import Path


def run_logic_example() -> None:
    """Show a tiny custom-logic pattern for project-specific rules."""
    result = sum(value for value in range(3))
    print(f"Logic example ready. Sum={result}")


if __name__ == "__main__":
    run_logic_example()
''',
}
