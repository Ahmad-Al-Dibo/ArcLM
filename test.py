from arclm.training.unified import UnifiedModelLoader, PreTrainedModelLoader


huggingface_model = UnifiedModelLoader(source="gpt2")
model, metadata = huggingface_model.load(revision="main", trust_remote_code=True)

print(model.summary())