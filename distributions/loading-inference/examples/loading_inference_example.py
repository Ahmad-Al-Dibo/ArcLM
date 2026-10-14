from arclm.inference import GenerationConfig


config = GenerationConfig(max_new_tokens=4)
print(config.max_new_tokens)
