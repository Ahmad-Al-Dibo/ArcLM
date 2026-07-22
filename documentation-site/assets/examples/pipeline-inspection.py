from arclm import inspect_text
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer

tokenizer = Tokenizer(max_vocab=32)
tokenizer.build("Hello ArcLM")
model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)
trace = inspect_text(model=model, tokenizer=tokenizer, text="Hello")
print(trace.summary())
