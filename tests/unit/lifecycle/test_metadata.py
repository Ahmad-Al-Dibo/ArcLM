import json

import torch

from arclm.configs import Config
from arclm.lifecycle import (
    MANIFEST_NAME,
    ModelArtifactInfo,
    ModelSource,
    TokenizerInfo,
    inspect_model_artifact,
    load_artifact_manifest,
    load_model_config,
    save_artifact_manifest,
)
from arclm.training import Trainer, TrainingConfig
from tests.unit.training._helpers import TinyTokenDataset, TinyTokenModel


def test_model_source_detects_pytorch_module():
    model = TinyTokenModel()

    source = ModelSource.from_source(model)

    assert source.source_type == "pytorch_module"
    assert source.exists is True


def test_artifact_metadata_round_trip_manifest(tmp_path):
    metadata = ModelArtifactInfo(
        artifact_kind="inference_artifact",
        source_type="native_checkpoint",
        model_type="TinyTokenModel",
        model_config={"vocab_size": 8},
        tokenizer=TokenizerInfo(tokenizer_type="word", vocab_size=8),
    )

    manifest = save_artifact_manifest(tmp_path, metadata)
    loaded = load_artifact_manifest(tmp_path)

    assert manifest.name == MANIFEST_NAME
    assert loaded.artifact_kind == "inference_artifact"
    assert loaded.model_config["vocab_size"] == 8
    assert loaded.tokenizer.tokenizer_type == "word"


def test_training_checkpoint_contains_lifecycle_metadata(tmp_path):
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=2),
        config=TrainingConfig(
            epochs=1,
            batch_size=1,
            output_dir=str(tmp_path),
            save_every_steps=0,
            log_every_steps=0,
        ),
    )
    trainer.train()

    checkpoint_dir = trainer.save_checkpoint()
    checkpoint = torch.load(checkpoint_dir / "training.pt", map_location="cpu")
    metadata = checkpoint["lifecycle_metadata"]

    assert metadata["artifact_kind"] == "training_checkpoint"
    assert metadata["source_type"] == "native_checkpoint"
    assert metadata["model_config"]["batch_size"] == 1
    assert metadata["training_state"]["global_step"] == trainer.global_step
    assert checkpoint["metadata"]["artifact_kind"] == "training_checkpoint"


def test_inspect_model_artifact_reads_new_checkpoint_metadata(tmp_path):
    trainer = Trainer(
        model=TinyTokenModel(),
        train_dataset=TinyTokenDataset(size=2),
        config=TrainingConfig(
            epochs=1,
            batch_size=1,
            output_dir=str(tmp_path),
            save_every_steps=0,
            log_every_steps=0,
        ),
    )
    trainer.train()
    checkpoint_dir = trainer.save_checkpoint()

    metadata = inspect_model_artifact(checkpoint_dir / "training.pt")

    assert metadata.artifact_kind == "training_checkpoint"
    assert metadata.source_type == "native_checkpoint"
    assert metadata.training_state["global_step"] == trainer.global_step


def test_inspect_model_artifact_reads_legacy_checkpoint_without_lifecycle_metadata(tmp_path):
    path = tmp_path / "legacy.pt"
    torch.save(
        {
            "model_state_dict": TinyTokenModel().state_dict(),
            "optimizer_state_dict": {},
            "training_state": {"global_step": 3},
            "config": {"batch_size": 2, "vocab_size": 8},
            "metadata": {"precision": "fp32"},
        },
        path,
    )

    metadata = inspect_model_artifact(path)

    assert metadata.artifact_kind == "training_checkpoint"
    assert metadata.source_type == "native_checkpoint"
    assert metadata.model_config["batch_size"] == 2
    assert metadata.compatibility["legacy_checkpoint"] is True


def test_load_model_config_and_legacy_config_loader(tmp_path):
    path = tmp_path / "legacy.pt"
    torch.save(
        {
            "model_state_dict": TinyTokenModel().state_dict(),
            "config": {"batch_size": 4, "vocab_size": 8, "block_size": 3},
        },
        path,
    )

    values = load_model_config(path)
    config = Config(batch_size=1, vocab_size=1)
    result = config.load_config_from_model(path)

    assert values["batch_size"] == 4
    assert result is config
    assert config.batch_size == 4
    assert config.vocab_size == 8


def test_huggingface_folder_is_inspected_without_transformers(tmp_path):
    folder = tmp_path / "hf-model"
    folder.mkdir()
    (folder / "config.json").write_text(
        json.dumps(
            {
                "model_type": "gpt2",
                "architectures": ["GPT2LMHeadModel"],
                "torch_dtype": "float16",
            }
        ),
        encoding="utf-8",
    )

    metadata = inspect_model_artifact(folder)

    assert metadata.source_type == "huggingface_folder"
    assert metadata.artifact_kind == "huggingface_model"
    assert metadata.model_type == "gpt2"
    assert metadata.architecture == "GPT2LMHeadModel"
    assert metadata.precision == "fp16"


def test_huggingface_model_id_is_metadata_only_without_network():
    metadata = inspect_model_artifact("gpt2")

    assert metadata.source_type == "huggingface_id"
    assert metadata.artifact_kind == "huggingface_model"
    assert metadata.model_type == "gpt"
    assert metadata.tokenizer.source == "gpt2"
