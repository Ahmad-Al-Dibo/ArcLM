from __future__ import annotations

from types import SimpleNamespace

import torch


class TinyTokenizer:
    def __init__(self, chat_template=False):
        self.pad_token_id = 0
        self.eos_token_id = 1
        self.unk_token_id = 2
        self.chat_template = "{messages}" if chat_template else None
        self.vocab = {"<pad>": 0, "<eos>": 1, "<unk>": 2}

    def encode(self, text, add_special_tokens=False, **_kwargs):
        ids = []
        for token in str(text).replace("\n", " \n ").split():
            if token not in self.vocab:
                self.vocab[token] = len(self.vocab)
            ids.append(self.vocab[token])
        return ids

    def encode_text(self, text):
        return self.encode(text)

    def __call__(self, text, **kwargs):
        ids = self.encode(text, **kwargs)
        max_length = kwargs.get("max_length")
        if kwargs.get("truncation") and max_length is not None:
            ids = ids[:max_length]
        return {"input_ids": ids, "attention_mask": [1] * len(ids)}

    def apply_chat_template(self, messages, tokenize=False, **kwargs):
        text = "\n".join(
            f"<{message['role']}> {message['content']}"
            for message in messages
        )
        if kwargs.get("add_generation_prompt"):
            text += "\n<assistant>"
        if tokenize:
            return self(text, **kwargs)
        return text


class TinyCausalLM(torch.nn.Module):
    def __init__(self, vocab_size=64, hidden=8):
        super().__init__()
        self.embedding = torch.nn.Embedding(vocab_size, hidden)
        self.linear = torch.nn.Linear(hidden, vocab_size)

    def forward(self, input_ids):
        return self.linear(self.embedding(input_ids))


class TinyDictModel(torch.nn.Module):
    def __init__(self, vocab_size=64, hidden=8):
        super().__init__()
        self.embedding = torch.nn.Embedding(vocab_size, hidden)
        self.linear = torch.nn.Linear(hidden, vocab_size)

    def forward(self, input_ids, attention_mask=None, labels=None):
        logits = self.linear(self.embedding(input_ids))
        loss = None
        if labels is not None:
            loss = torch.nn.functional.cross_entropy(
                logits[:, :-1, :].reshape(-1, logits.shape[-1]),
                labels[:, 1:].reshape(-1),
                ignore_index=-100,
            )
        return {"loss": loss, "logits": logits}


class TinyHFStyleModel(TinyDictModel):
    def forward(self, input_ids, attention_mask=None, labels=None):
        output = super().forward(input_ids, attention_mask=attention_mask, labels=labels)
        return SimpleNamespace(loss=output["loss"], logits=output["logits"])


class TinyExternalModel(torch.nn.Module):
    def __init__(self, vocab_size=64, hidden=8):
        super().__init__()
        self.embedding = torch.nn.Embedding(vocab_size, hidden)
        self.linear = torch.nn.Linear(hidden, vocab_size)

    def forward(self, tokens, mask=None, targets=None):
        scores = self.linear(self.embedding(tokens))
        training_loss = None
        if targets is not None:
            training_loss = torch.nn.functional.cross_entropy(
                scores[:, :-1, :].reshape(-1, scores.shape[-1]),
                targets[:, 1:].reshape(-1),
                ignore_index=-100,
            )
        return {"training_loss": training_loss, "scores": scores}


def instruction_dataset():
    return [
        {"instruction": "Say hi", "input": "politely", "output": "hello"},
        {"instruction": "Say bye", "input": "now", "output": "bye"},
        {"instruction": "Name ArcLM", "input": "", "output": "ArcLM"},
    ]
