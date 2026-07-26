from arclm.finetuning import BaseFineTuner, BaseModelAdapter, BaseTokenizerAdapter


class MyFineTuner(BaseFineTuner):
    def train(self):
        return "trained"


class MyModelAdapter(BaseModelAdapter):
    def forward(self, **batch):
        return batch


class MyTokenizerAdapter(BaseTokenizerAdapter):
    def encode(self, text, max_length=None, truncation=True):
        return [1]


def test_base_finetuner_subclassing():
    assert MyFineTuner().train() == "trained"


def test_base_model_adapter_subclassing():
    assert MyModelAdapter().forward(input_ids=[1]) == {"input_ids": [1]}


def test_base_tokenizer_adapter_subclassing():
    assert MyTokenizerAdapter().encode("x") == [1]
