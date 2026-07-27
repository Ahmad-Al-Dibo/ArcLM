import torch
from torch import nn

import pytest

from arclm.exceptions import FineTuningError
from arclm.models import ArcLM
from arclm.peft import (
    LoRAConfig,
    LoRALinear,
    apply_lora,
    get_lora_state_dict,
    inspect_lora_targets,
    is_lora_model,
    load_lora_state_dict,
    merge_lora,
    merged_lora_model,
    unmerge_lora,
)


def _model():
    torch.manual_seed(123)
    return ArcLM(vocab_size=32, embed_dim=8, block_size=12, num_blocks=1, dropout=0.0)


def test_lora_config_validates_and_round_trips():
    config = LoRAConfig(rank=2, alpha=4, target_modules=("query", "value"))

    restored = LoRAConfig.from_dict(config.to_dict())

    assert restored == config
    with pytest.raises(FineTuningError, match="rank"):
        LoRAConfig(rank=0).validate()
    with pytest.raises(FineTuningError, match="target_match"):
        LoRAConfig(target_match="contains").validate()


def test_lora_linear_initial_output_matches_base_and_merge_round_trip():
    base = nn.Linear(4, 3)
    layer = LoRALinear(base, LoRAConfig(rank=2, alpha=4, dropout=0.0))
    inputs = torch.randn(2, 4)

    before = layer(inputs)
    assert torch.allclose(before, base(inputs))

    with torch.no_grad():
        layer.lora_b.weight.fill_(0.1)
    updated = layer(inputs)
    assert not torch.allclose(updated, base(inputs))
    layer.merge()
    merged = layer(inputs)
    assert torch.allclose(updated, merged, atol=1e-6)
    layer.unmerge()
    assert torch.allclose(layer(inputs), updated, atol=1e-6)


def test_target_planning_and_application_freezes_base_parameters():
    model = _model()
    config = LoRAConfig(rank=2, alpha=4, target_modules=("query", "value"))

    targets = inspect_lora_targets(model, config)
    result = apply_lora(model, config)

    assert [target.path for target in targets] == ["blocks.0.attn.query", "blocks.0.attn.value"]
    assert result.adapted_modules == ("blocks.0.attn.query", "blocks.0.attn.value")
    assert is_lora_model(model)
    assert result.parameter_report.trainable_parameters > 0
    assert result.parameter_report.trainable_parameters < result.parameter_report.total_parameters
    assert all(
        "lora_" in name
        for name, parameter in model.named_parameters()
        if parameter.requires_grad
    )
    with pytest.raises(FineTuningError, match="already applied"):
        inspect_lora_targets(model, config)


def test_target_matching_modes_and_no_match_error():
    model = _model()

    full = inspect_lora_targets(
        model,
        LoRAConfig(rank=2, target_modules=("blocks.0.attn.query",), target_match="full"),
    )
    leaf = inspect_lora_targets(
        model,
        LoRAConfig(rank=2, target_modules=("query",), target_match="leaf"),
    )

    assert [target.path for target in full] == ["blocks.0.attn.query"]
    assert [target.path for target in leaf] == ["blocks.0.attn.query"]
    with pytest.raises(FineTuningError, match="matched no"):
        inspect_lora_targets(model, LoRAConfig(target_modules=("missing",)))


def test_lora_state_dict_load_and_shape_validation():
    model = _model()
    apply_lora(model, LoRAConfig(rank=2, alpha=4))
    state = get_lora_state_dict(model)
    clean = _model()
    apply_lora(clean, LoRAConfig(rank=2, alpha=4))

    load_lora_state_dict(clean, state)

    for key, value in get_lora_state_dict(clean).items():
        assert torch.equal(value, state[key])
    bad = dict(state)
    first = next(iter(bad))
    bad[first] = bad[first][:1]
    with pytest.raises(FineTuningError, match="shape"):
        load_lora_state_dict(clean, bad)


def test_merge_helpers_preserve_outputs_and_unload_to_plain_linear():
    model = _model()
    apply_lora(model, LoRAConfig(rank=2, alpha=4))
    with torch.no_grad():
        for _name, module in model.named_modules():
            if isinstance(module, LoRALinear):
                module.lora_b.weight.fill_(0.05)
    inputs = torch.randint(0, 32, (1, 6))
    model.eval()
    before = model(inputs)

    merge_lora(model)
    after_merge = model(inputs)
    unmerge_lora(model)
    after_unmerge = model(inputs)
    plain = merged_lora_model(model)

    assert torch.allclose(before, after_merge, atol=1e-5)
    assert torch.allclose(before, after_unmerge, atol=1e-5)
    assert not is_lora_model(plain)
    assert torch.allclose(before, plain(inputs), atol=1e-5)
