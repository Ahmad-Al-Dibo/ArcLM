"""ArcLM 0.9: data validation, native SFT, evaluation, and reproducibility."""

from pathlib import Path
import json
import shutil

import torch

from arclm.datasets import (
    ProcessedDataset,
    build_dataset_report,
    create_dataset_manifest,
    validate_records,
)
from arclm.evaluation import EvaluationResult, build_evaluation_report
from arclm.finetuning import FineTuningConfig, fine_tune, validate_sft_records
from arclm.inference import Generator
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer
from arclm.tracking import build_reproducibility_metadata, set_reproducible_seed
from arclm.training import TrainingConfig


OUTPUT_DIR = Path(__file__).resolve().parent / "_outputs" / "arclm_09_data_sft_eval"


def main():
    seed_info = set_reproducible_seed(9)
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    raw_records = [
        {
            "instruction": "Explain tokenization.",
            "response": "Tokenization converts text into tokens.",
        },
        {
            "instruction": "Explain a checkpoint.",
            "response": "A checkpoint stores model and training state.",
        },
        {
            "instruction": "Explain evaluation.",
            "response": "Evaluation measures model behavior on held-out data.",
        },
    ]

    validation = validate_records(
        raw_records,
        required_fields=["instruction", "response"],
        strict=False,
    )
    sft_validation = validate_sft_records(
        validation.valid_records,
        FineTuningConfig(formatter="instruction_response"),
        strict=False,
    )
    cleaned = ProcessedDataset(sft_validation.valid_records).clean(
        text_keys=["instruction", "response"]
    )
    split = cleaned.split(train=0.67, validation=0.5, test=0.0, seed=9)

    tokenizer_text = " ".join(
        f"Instruction: {row['instruction']} Response: {row['response']}"
        for row in cleaned.samples
    )
    tokenizer = Tokenizer(max_vocab=96)
    tokenizer.build(tokenizer_text)

    manifest = create_dataset_manifest(
        dataset_name="arclm-09-tiny-instruction",
        source_type="memory",
        records_before=len(raw_records),
        records_after=len(cleaned.samples),
        validation_result=validation,
        text_fields=["instruction", "response"],
        transformations_applied=["schema_validation", "sft_validation", "whitespace_cleaning"],
        split_information={key: len(value) for key, value in split.items()},
    )
    dataset_report = build_dataset_report(
        cleaned.samples,
        tokenizer=tokenizer,
        text_fields=["instruction", "response"],
        validation_result=validation,
        manifest=manifest,
        split_information={key: len(value) for key, value in split.items()},
        max_token_length=32,
    )

    model = ArcLM(
        vocab_size=tokenizer.get_vocab_size(),
        embed_dim=12,
        block_size=32,
        num_blocks=1,
        dropout=0.0,
    )
    ft_config = FineTuningConfig(
        formatter="instruction_response",
        max_sequence_length=32,
        train_on_prompt=False,
    )
    training_config = TrainingConfig(
        epochs=1,
        batch_size=1,
        learning_rate=2e-2,
        output_dir=str(OUTPUT_DIR / "run"),
        save_every_steps=0,
        log_every_steps=0,
        shuffle=False,
        device="cpu",
    )
    result = fine_tune(
        model=model,
        tokenizer=tokenizer,
        train_dataset=split["train"],
        eval_dataset=split["validation"],
        training_config=training_config,
        fine_tuning_config=ft_config,
        save_checkpoint=True,
        reproducibility_metadata=seed_info,
    )

    eval_result = EvaluationResult(
        metrics=result.evaluation_result or {},
        num_examples=len(split["validation"]),
        num_batches=1 if split["validation"] else 0,
        metadata={
            "device": "cpu",
            "dataset_identity": manifest.dataset_name,
            "checkpoint_identity": result.checkpoint_path,
            "num_tokens": dataset_report.token_count,
        },
    )
    eval_report = build_evaluation_report(
        eval_result,
        model=model,
        checkpoint_identity=result.checkpoint_path,
        dataset_identity=manifest.dataset_name,
        num_tokens=dataset_report.token_count,
    )
    generated = Generator(
        model,
        tokenizer.stoi,
        tokenizer.itos,
        block_size=32,
        device=torch.device("cpu"),
        tokenizer=tokenizer,
    ).generate_string("Instruction:", max_new_tokens=3, top_k=3)

    reproducibility = build_reproducibility_metadata(
        seed=9,
        dataset_fingerprint=result.dataset_report.dataset_fingerprint,
        tokenizer_fingerprint=f"vocab_{tokenizer.get_vocab_size()}",
        model_config_fingerprint="arclm_tiny_sft_12x32",
    )
    payload = {
        "manifest": manifest.to_dict(),
        "dataset_report": dataset_report.to_dict(),
        "sft_report": result.dataset_report.to_dict(),
        "evaluation_report": eval_report.to_dict(),
        "reproducibility": {**reproducibility, **seed_info},
        "checkpoint": result.checkpoint_path,
        "generated": generated,
    }
    report_path = OUTPUT_DIR / "reproducibility_report.json"
    report_path.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")

    print("ArcLM 0.9 data/SFT/evaluation workflow")
    print(validation.summary())
    print(dataset_report.summary())
    print(eval_report.summary())
    print(f"Checkpoint: {result.checkpoint_path}")
    print(f"Generated: {generated}")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
