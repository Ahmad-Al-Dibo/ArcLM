from arclm.datasets import load_dataset

records = load_dataset([{"text": "ArcLM trains locally."}])
print(records)
