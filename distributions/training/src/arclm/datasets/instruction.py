"""Instruction-tuning datasets met response-only loss masking."""

from __future__ import annotations

from ..exceptions import OptionalDependencyError

try:
    import torch
    from torch.utils.data import DataLoader, Dataset
except Exception:
    torch = None

    class Dataset:
        """Fallback zodat imports zonder werkende torch kunnen doorgaan."""


class InstructionDataset(Dataset):
    """Dataset voor instruction tuning met loss alleen op response tokens."""

    def __init__(
        self,
        instructions,
        responses,
        tokenizer,
        block_size,
        instruction_prefix="<|instruction|>",
        response_prefix="<|response|>",
    ):
        """Maakt token-voorbeelden met een mask voor alleen het antwoord."""
        self.tokenizer = tokenizer
        self.block_size = block_size
        self.instruction_prefix = instruction_prefix
        self.response_prefix = response_prefix

        self.data = []
        for instruction, response in zip(instructions, responses):
            full_text = (
                f"{self.instruction_prefix}\n"
                f"{instruction}\n"
                f"{self.response_prefix}\n"
                f"{response}"
            )
            encoded = tokenizer.encode_text(full_text)

            # De mask zorgt dat alleen het antwoord meetelt voor de loss.
            prompt_text = f"{self.instruction_prefix}\n{instruction}\n{self.response_prefix}\n"
            prompt_len = len(tokenizer.encode_text(prompt_text))
            mask = [0.0] * prompt_len + [1.0] * (len(encoded) - prompt_len)
            self.data.append({"tokens": encoded, "mask": mask})

    def __len__(self):
        """Geeft het aantal instruction-response voorbeelden terug."""
        return len(self.data)

    def __getitem__(self, idx):
        """Geeft tensors terug voor één gemaskeerd SFT voorbeeld."""
        if torch is None:
            raise OptionalDependencyError(
                "InstructionDataset requires a working torch installation."
            )

        item = self.data[idx]
        tokens = item["tokens"][: self.block_size]
        mask = item["mask"][: self.block_size]

        pad_len = self.block_size - len(tokens)
        if pad_len > 0:
            tokens = tokens + [0] * pad_len
            mask = mask + [0.0] * pad_len

        x = torch.tensor(tokens, dtype=torch.long)
        y = torch.tensor(tokens[1:] + [0], dtype=torch.long)
        label_mask = mask[1:] + [0.0]
        mask_tensor = torch.tensor(label_mask, dtype=torch.float32)

        return {"x": x, "y": y, "mask": mask_tensor}


def create_instruction_dataloader(
    instructions,
    responses,
    tokenizer,
    block_size,
    batch_size,
    shuffle=True,
):
    """Maakt een DataLoader voor instruction tuning."""
    if torch is None:
        raise OptionalDependencyError(
            "create_instruction_dataloader requires a working torch installation."
        )

    dataset = InstructionDataset(instructions, responses, tokenizer, block_size)
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
