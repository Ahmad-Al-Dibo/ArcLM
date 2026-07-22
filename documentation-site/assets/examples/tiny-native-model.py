from arclm.models import ArcLM

model = ArcLM(vocab_size=32, embed_dim=16, block_size=8, num_blocks=1)
print(model.__class__.__name__)
