import torch
from torch import nn
from torch.utils.data import Dataset


class ClassificationDataset(Dataset):
    def __init__(self):
        self.inputs = torch.eye(4)
        self.labels = torch.tensor([0, 1, 1, 0])

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, index):
        return {
            "inputs": self.inputs[index],
            "labels": self.labels[index],
        }


class ClassificationModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(4, 2)

    def forward(self, inputs, labels=None):
        logits = self.linear(inputs)
        loss = None
        if labels is not None:
            loss = nn.functional.cross_entropy(logits, labels)
        return {"loss": loss, "logits": logits}


class TokenDataset(Dataset):
    def __init__(self):
        self.items = [
            {
                "x": torch.tensor([0, 1, 2]),
                "y": torch.tensor([1, 2, -100]),
            },
            {
                "x": torch.tensor([1, 2, 3]),
                "y": torch.tensor([2, 3, 0]),
            },
        ]

    def __len__(self):
        return len(self.items)

    def __getitem__(self, index):
        return self.items[index]


class TokenModel(nn.Module):
    def __init__(self, vocab_size=4):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, 5)
        self.head = nn.Linear(5, vocab_size)

    def forward(self, x):
        return self.head(self.embedding(x))
