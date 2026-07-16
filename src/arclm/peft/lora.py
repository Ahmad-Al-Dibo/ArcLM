"""LoRA-lagen en modelmutaties."""

from __future__ import annotations

import copy
import hashlib
import json
import math
from dataclasses import asdict, dataclass, field
from typing import Any, Mapping

import torch
from torch import nn

from ..exceptions import FineTuningError
from .config import LoRAConfig, PeftConfig, PeftMethod


class LoRALinear(nn.Module):
    """Lineaire laag met trainbare LoRA matrices bovenop een bevroren basislaag."""

    def __init__(self, base: nn.Linear, config: LoRAConfig):
        """Maakt een LoRA wrapper rond een bestaande `nn.Linear`."""
        super().__init__()
        config.validate()
        self.base = base
        self.rank = int(config.rank)
        self.alpha = float(config.alpha)
        self.scaling = self.alpha / self.rank
        self.dropout = nn.Dropout(float(config.dropout))
        self.lora_a = nn.Linear(base.in_features, self.rank, bias=False)
        self.lora_b = nn.Linear(self.rank, base.out_features, bias=False)
        self.merged = False
        self._init_weights(config.init)
        for parameter in self.base.parameters():
            parameter.requires_grad = False

    def _init_weights(self, init: str) -> None:
        """Initialiseert adapters zodat de eerste output gelijk blijft."""
        if init == "zeros":
            nn.init.zeros_(self.lora_a.weight)
        else:
            nn.init.kaiming_uniform_(self.lora_a.weight, a=math.sqrt(5))
        nn.init.zeros_(self.lora_b.weight)

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        """Combineert basisoutput en adapteroutput."""
        if self.merged:
            return self.base(inputs)
        update = self.lora_b(self.lora_a(self.dropout(inputs))) * self.scaling
        return self.base(inputs) + update

    def merge(self) -> None:
        """Voegt de adaptergewichten toe aan de basislaag."""
        if self.merged:
            raise FineTuningError("LoRA adapter is already merged")
        delta = (self.lora_b.weight @ self.lora_a.weight) * self.scaling
        self.base.weight.data.add_(delta.to(self.base.weight.device, self.base.weight.dtype))
        self.merged = True

    def unmerge(self) -> None:
        """Haalt eerder gemergede adaptergewichten weer uit de basislaag."""
        if not self.merged:
            raise FineTuningError("LoRA adapter is not merged")
        delta = (self.lora_b.weight @ self.lora_a.weight) * self.scaling
        self.base.weight.data.sub_(delta.to(self.base.weight.device, self.base.weight.dtype))
        self.merged = False


@dataclass(frozen=True)
class PeftTarget:
    """Een lineaire laag die LoRA kan krijgen."""

    path: str
    module_type: str
    in_features: int
    out_features: int
    parameters: int

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke targetdata terug."""
        return asdict(self)


@dataclass(frozen=True)
class PeftParameterReport:
    """Samenvatting van trainbare en bevroren parameters."""

    total_parameters: int
    trainable_parameters: int
    frozen_parameters: int
    trainable_percentage: float
    adapted_module_count: int
    trainable_parameter_names: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, Any]:
        """Geeft JSON-vriendelijke parameterdata terug."""
        return asdict(self)


@dataclass(frozen=True)
class PeftApplicationResult:
    """Resultaat van een PEFT-injectie."""

    method: str
    adapted_modules: tuple[str, ...]
    config: dict[str, Any]
    parameter_report: PeftParameterReport
    base_model_fingerprint: str
    merged: bool = False

    def to_dict(self) -> dict[str, Any]:
        """Geeft veilige metadata terug."""
        data = asdict(self)
        data["parameter_report"] = self.parameter_report.to_dict()
        return data


def inspect_lora_targets(model: nn.Module, config: LoRAConfig) -> tuple[PeftTarget, ...]:
    """Maakt een droog plan zonder het model te wijzigen."""
    config.validate()
    targets: list[PeftTarget] = []
    for name, module in model.named_modules():
        if not name:
            continue
        if isinstance(module, LoRALinear):
            raise FineTuningError("LoRA is already applied to this model")
        if isinstance(module, nn.Linear) and _target_matches(name, config):
            targets.append(
                PeftTarget(
                    path=name,
                    module_type=type(module).__name__,
                    in_features=int(module.in_features),
                    out_features=int(module.out_features),
                    parameters=sum(parameter.numel() for parameter in module.parameters()),
                )
            )
    if not targets:
        raise FineTuningError("LoRA target selection matched no linear modules")
    return tuple(targets)


def apply_peft(model: nn.Module, config: PeftConfig | None) -> PeftApplicationResult | None:
    """Past de gevraagde PEFT-methode toe."""
    if config is None or not config.enabled or config.method == PeftMethod.NONE:
        return None
    if isinstance(config, LoRAConfig):
        return apply_lora(model, config)
    raise FineTuningError("PEFT method is not implemented")


def apply_lora(model: nn.Module, config: LoRAConfig) -> PeftApplicationResult:
    """Vervangt geselecteerde `nn.Linear` lagen door LoRA wrappers."""
    config.validate()
    targets = inspect_lora_targets(model, config)
    if config.freeze_base_model:
        for parameter in model.parameters():
            parameter.requires_grad = False
    replacements: list[tuple[nn.Module, str, nn.Linear]] = []
    try:
        for target in targets:
            parent, child_name = _parent_module(model, target.path)
            original = getattr(parent, child_name)
            if not isinstance(original, nn.Linear):
                raise FineTuningError("LoRA target changed before injection")
            replacement = LoRALinear(original, config)
            setattr(parent, child_name, replacement)
            replacements.append((parent, child_name, original))
    except Exception:
        for parent, child_name, original in reversed(replacements):
            setattr(parent, child_name, original)
        raise
    report = get_peft_parameter_report(model, include_names=True)
    return PeftApplicationResult(
        method=PeftMethod.LORA.value,
        adapted_modules=tuple(target.path for target in targets),
        config=config.to_dict(),
        parameter_report=report,
        base_model_fingerprint=fingerprint_base_model(model),
    )


def get_peft_parameter_report(
    model: nn.Module,
    *,
    include_names: bool = False,
) -> PeftParameterReport:
    """Telt trainbare parameters na PEFT-injectie."""
    total = 0
    trainable = 0
    names: list[str] = []
    for name, parameter in model.named_parameters():
        count = parameter.numel()
        total += count
        if parameter.requires_grad:
            trainable += count
            if include_names:
                names.append(name)
    return PeftParameterReport(
        total_parameters=total,
        trainable_parameters=trainable,
        frozen_parameters=total - trainable,
        trainable_percentage=(trainable / total * 100.0) if total else 0.0,
        adapted_module_count=sum(1 for _ in iter_lora_modules(model)),
        trainable_parameter_names=tuple(names),
    )


def iter_lora_modules(model: nn.Module):
    """Loopt over alle LoRA-modules met hun pad."""
    for name, module in model.named_modules():
        if isinstance(module, LoRALinear):
            yield name, module


def is_lora_model(model: nn.Module) -> bool:
    """Controleert of een model LoRA-wrappers bevat."""
    return any(True for _ in iter_lora_modules(model))


def merge_lora(model: nn.Module) -> None:
    """Merged alle LoRA-lagen in-place."""
    for _name, module in iter_lora_modules(model):
        if not module.merged:
            module.merge()


def unmerge_lora(model: nn.Module) -> None:
    """Maakt een eerdere merge ongedaan."""
    for _name, module in iter_lora_modules(model):
        if module.merged:
            module.unmerge()


def merged_lora_model(model: nn.Module) -> nn.Module:
    """Geeft een kopie terug waarbij LoRA in gewone Linear lagen is verwerkt."""
    clone = copy.deepcopy(model)
    merge_lora(clone)
    _unload_lora_modules(clone)
    return clone


def get_lora_state_dict(model: nn.Module) -> dict[str, torch.Tensor]:
    """Haalt alleen adaptergewichten uit het model."""
    state: dict[str, torch.Tensor] = {}
    for name, module in iter_lora_modules(model):
        state[f"{name}.lora_a.weight"] = module.lora_a.weight.detach().cpu().clone()
        state[f"{name}.lora_b.weight"] = module.lora_b.weight.detach().cpu().clone()
    if not state:
        raise FineTuningError("Model does not contain LoRA adapters")
    return state


def load_lora_state_dict(
    model: nn.Module,
    state_dict: Mapping[str, torch.Tensor],
    *,
    strict: bool = True,
) -> None:
    """Laadt adaptergewichten in een model dat al LoRA-wrappers heeft."""
    expected = set(get_lora_state_dict(model))
    incoming = set(state_dict)
    if strict and expected != incoming:
        missing = sorted(expected - incoming)
        unexpected = sorted(incoming - expected)
        raise FineTuningError(
            "LoRA adapter state does not match the model "
            f"(missing={missing}, unexpected={unexpected})"
        )
    modules = dict(iter_lora_modules(model))
    for key, value in state_dict.items():
        parts = key.rsplit(".", 2)
        if len(parts) != 3 or parts[-1] != "weight":
            raise FineTuningError("LoRA adapter state key is invalid")
        module_name, layer_name, _ = parts
        module = modules.get(module_name)
        if module is None:
            if strict:
                raise FineTuningError("LoRA adapter state references an unknown module")
            continue
        layer = getattr(module, layer_name, None)
        if layer is None or not hasattr(layer, "weight"):
            raise FineTuningError("LoRA adapter state references an unknown layer")
        if tuple(layer.weight.shape) != tuple(value.shape):
            raise FineTuningError("LoRA adapter tensor shape does not match the model")
        layer.weight.data.copy_(value.to(layer.weight.device, layer.weight.dtype))


def fingerprint_base_model(model: nn.Module) -> str:
    """Maakt een structuur-fingerprint zonder adaptergewichten."""
    rows: list[dict[str, Any]] = []
    skip_prefixes: list[str] = []
    for name, module in model.named_modules():
        if any(name.startswith(prefix) for prefix in skip_prefixes):
            continue
        if isinstance(module, LoRALinear):
            rows.append(_linear_fingerprint_row(name, module.base))
            skip_prefixes.append(f"{name}.")
        elif isinstance(module, nn.Linear):
            rows.append(_linear_fingerprint_row(name, module))
    payload = json.dumps(rows, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "base_" + hashlib.sha256(payload).hexdigest()[:24]


def _linear_fingerprint_row(name: str, module: nn.Linear) -> dict[str, Any]:
    """Beschrijft een Linear laag voor compatibiliteitscontrole."""
    return {
        "name": name,
        "type": "Linear",
        "in_features": int(module.in_features),
        "out_features": int(module.out_features),
        "bias": module.bias is not None,
    }


def _target_matches(name: str, config: LoRAConfig) -> bool:
    """Controleert pad-, leaf- of suffix-matches."""
    leaf = name.rsplit(".", 1)[-1]
    for target in config.target_modules:
        target = str(target)
        if config.target_match == "full" and name == target:
            return True
        if config.target_match == "leaf" and leaf == target:
            return True
        if config.target_match == "suffix" and (
            name == target or name.endswith(f".{target}") or leaf == target
        ):
            return True
    return False


def _parent_module(model: nn.Module, path: str) -> tuple[nn.Module, str]:
    """Vindt de oudermodule voor een modulepad."""
    parts = path.split(".")
    parent = model
    for part in parts[:-1]:
        parent = getattr(parent, part)
    return parent, parts[-1]


def _unload_lora_modules(model: nn.Module) -> None:
    """Vervangt gemergede LoRA wrappers door hun basislaag."""
    for name, module in list(iter_lora_modules(model)):
        if not module.merged:
            raise FineTuningError("LoRA adapters must be merged before unloading")
        parent, child_name = _parent_module(model, name)
        setattr(parent, child_name, module.base)
