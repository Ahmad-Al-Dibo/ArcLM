from arclm.inspection import inspect_text
from arclm.models import ArcLM
from arclm.tokenizers import Tokenizer

tokenizer = Tokenizer(max_vocab=16)
tokenizer.build("ArcLM trains")
model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=8, block_size=8, num_blocks=1)
print(inspect_text(model=model, tokenizer=tokenizer, text="ArcLM").to_dict())
