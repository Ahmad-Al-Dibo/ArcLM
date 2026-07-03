from pathlib import Path
import json
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from arclm.preprocess import PreprocessConfig, PreprocessPipeline


def write_demo_input(path: Path):
    # rows = [
    #     {
    #         "text": "<p>ArcLM cleans useful dataset rows for language model training. Contact: demo@example.com</p>"
    #     },
    #     {
    #         "text": "too short"
    #     },
    #     {
    #         "text": "ArcLM cleans useful dataset rows for language model training. Contact: demo@example.com"
    #     },
    # ]
    with open(".../../data/wikitext.json", "r", encoding="utf-8") as f:
        rows = [json.loads(line) for line in f if line.strip()]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "\n".join(json.dumps(row, ensure_ascii=False) for row in rows),
        encoding="utf-8",
    )


def main():
    input_path = Path("data/preprocess_demo.jsonl")
    output_path = Path("data/preprocess_demo.cleaned.jsonl")
    report_dir = Path("reports/preprocess_demo")

    if not input_path.exists():
        write_demo_input(input_path)

    config = PreprocessConfig(
        min_chars=20,
        min_words=4,
        min_entropy=1.0,
        max_entropy=8.0,
        allowed_languages=["en"],
        min_language_confidence=0.1,
        drop_emails=True,
        redact_pii=True,
        near_dedup=False,
        report_html=True,
        report_json=True,
    )

    report = PreprocessPipeline(config).run(input_path, output_path, report_dir)

    print(f"Wrote {report['written']} cleaned rows to {output_path}")
    print(f"Dropped {report['dropped']} rows: {report['reasons']}")
    print(f"Reports saved in {report_dir}")


if __name__ == "__main__":
    main()
