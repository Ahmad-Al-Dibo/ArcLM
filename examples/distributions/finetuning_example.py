from arclm.finetuning import SFTConfig


config = SFTConfig(max_length=32)
print(config.max_length)
