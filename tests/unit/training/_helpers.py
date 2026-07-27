import torch
from torch import nn
from torch.utils.data import Dataset


class TinyTokenDataset(Dataset):
    def __init__(self, size=4, block_size=3, vocab_size=8):
        self.size = size
        self.block_size = block_size
        self.vocab_size = vocab_size

    def __len__(self):
        return self.size

    def __getitem__(self, index):
        x = torch.arange(self.block_size) + index
        x = x.remainder(self.vocab_size).long()
        y = (x + 1).remainder(self.vocab_size).long()
        return x, y


class TinyTokenModel(nn.Module):
    def __init__(self, vocab_size=8, hidden_size=6):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, hidden_size)
        self.head = nn.Linear(hidden_size, vocab_size)

    def forward(self, x):
        return self.head(self.embedding(x))
