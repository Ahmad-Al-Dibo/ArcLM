from arclm.tokenizers import Tokenizer

tokenizer = Tokenizer(max_vocab=16)
tokenizer.build("ArcLM trains locally")
print(tokenizer.encode_text("ArcLM"))
