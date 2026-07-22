from arclm.tokenizers import Tokenizer

tokenizer = Tokenizer(max_vocab=32)
tokenizer.build("ArcLM trains locally")
ids = tokenizer.encode_text("ArcLM locally")
print(ids)
print(tokenizer.decode(ids))
