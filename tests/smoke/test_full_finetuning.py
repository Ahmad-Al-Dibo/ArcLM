import torch

from arclm.finetuning import FullFineTuner, SFTConfig

from tests.unit.finetuning._helpers import TinyCausalLM, TinyTokenizer, instruction_dataset


def test_full_finetuning_cpu_smoke(tmp_path):
    tokenizer = TinyTokenizer()
    model = TinyCausalLM()
    before = [parameter.detach().clone() for parameter in model.parameters()]
    config = SFTConfig(
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
    )
    fine_tuner = FullFineTuner(
        model=model,
        tokenizer=tokenizer,
        train_dataset=instruction_dataset(),
        validation_dataset=instruction_dataset(),
        config=config,
    )

    state = fine_tuner.train()
    metrics = fine_tuner.evaluate()
    checkpoint = fine_tuner.save_checkpoint(tmp_path / "checkpoint")

    resumed = FullFineTuner(
        model=TinyCausalLM(),
        tokenizer=tokenizer,
        train_dataset=instruction_dataset(),
        config=SFTConfig(
            epochs=2,
            batch_size=2,
            learning_rate=1e-2,
            max_length=24,
            output_dir=str(tmp_path / "resume"),
            log_every_steps=0,
            save_every_steps=0,
            instruction_field="instruction",
            input_field="input",
            response_field="output",
            assistant_only_loss=True,
        ),
    )
    resumed.load_checkpoint(checkpoint)

    assert state.global_step > 0
    assert metrics["loss"] is not None
    assert (checkpoint / "training.pt").exists()
    assert (checkpoint / "sft_metadata.json").exists()
    assert resumed.trainer.global_step == fine_tuner.trainer.global_step
    assert any(
        not torch.allclose(old, new.detach().cpu())
        for old, new in zip(before, model.parameters())
    )
