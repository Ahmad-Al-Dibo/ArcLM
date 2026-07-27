from arclm.finetuning import ModelAdapter, SFTConfig, SFTTrainer

from tests.unit.finetuning._helpers import (
    TinyExternalModel,
    TinyTokenizer,
    instruction_dataset,
)


def test_sft_training_with_custom_external_adapter_cpu(tmp_path):
    model = TinyExternalModel()
    adapter = ModelAdapter(
        model,
        input_map={
            "input_ids": "tokens",
            "attention_mask": "mask",
            "labels": "targets",
        },
        output_map={"loss": "training_loss", "logits": "scores"},
    )
    trainer = SFTTrainer(
        model=model,
        model_adapter=adapter,
        tokenizer=TinyTokenizer(),
        train_dataset=instruction_dataset(),
        validation_dataset=instruction_dataset(),
        config=SFTConfig(
            epochs=1,
            batch_size=2,
            learning_rate=1e-2,
            max_length=24,
            output_dir=str(tmp_path),
            log_every_steps=0,
            save_every_steps=0,
            instruction_field="instruction",
            input_field="input",
            response_field="output",
            assistant_only_loss=True,
        ),
    )

    state = trainer.train()
    metrics = trainer.evaluate()

    assert state.optimizer_step > 0
    assert metrics["loss"] is not None
