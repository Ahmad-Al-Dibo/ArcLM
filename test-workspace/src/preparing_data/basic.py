from pathlib import Path
import json


def prepare_sample_dataset() -> None:
    """Create starter text and conversation files for a new project."""
    root = Path(__file__).resolve().parents[2]
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    (data_dir / "plain.txt").write_text("ArcLM starter dataset.
", encoding="utf-8")
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
