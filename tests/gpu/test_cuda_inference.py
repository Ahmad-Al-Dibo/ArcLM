"""CUDA inference-tests met de publieke inference API."""

from __future__ import annotations

import pytest
import torch

from arclm.configs import Config
from arclm.inference import load_model
from arclm.training import build_model
from tests.gpu.test_cuda_fp32 import require_cuda


pytestmark = [pytest.mark.gpu, pytest.mark.cuda]


def test_cuda_inference_loads_checkpoint_and_generates_without_gradients(tmp_path):
    device = require_cuda()
    torch.cuda.set_device(device)
    torch.cuda.empty_cache()
    torch.cuda.reset_peak_memory_stats()

    vocab = ["<UNK>", "alpha", "beta", "gamma"]
    stoi = {token: index for index, token in enumerate(vocab)}
    itos = {index: token for token, index in stoi.items()}
    config = Config(
        embed_dim=8,
        block_size=4,
        num_blocks=1,
        batch_size=1,
        device="cpu",
        tokenizer_type="word",
    )
    model = build_model(config, vocab_size=len(vocab))
    checkpoint_path = tmp_path / "tiny-inference.pth"
    torch.save(
        {
            "config": config.to_dict(),
            "vocab_size": len(vocab),
            "vocab": vocab,
            "stoi": stoi,
            "itos": itos,
            "model_state_dict": model.state_dict(),
            "tokenizer_metadata": {"tokenizer_type": "word", "max_vocab": len(vocab)},
        },
        checkpoint_path,
    )

    loaded = load_model(checkpoint_path, device="cuda")

    assert loaded.device.type == "cuda"
    assert next(loaded.model.parameters()).device.type == "cuda"
    assert loaded.model.training is False

    before_peak = torch.cuda.max_memory_allocated()
    with torch.no_grad():
        first = loaded.predict("alpha beta", max_new_tokens=1, temperature=1.0)
        second = loaded.predict("alpha beta", max_new_tokens=1, temperature=1.0)
    torch.cuda.synchronize()

    assert isinstance(first, str)
    assert isinstance(second, str)
    assert first
    assert second
    assert loaded.model.training is False
    assert torch.cuda.max_memory_allocated() >= before_peak
