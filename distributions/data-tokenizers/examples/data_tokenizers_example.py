from arclm.tokenizers import Tokenizer


tokenizer = Tokenizer(max_vocab=16)
tokenizer.build("ArcLM tokenizers stay small for examples.")
ids = tokenizer.encode_text("ArcLM examples")
print(tokenizer.decode(ids))
