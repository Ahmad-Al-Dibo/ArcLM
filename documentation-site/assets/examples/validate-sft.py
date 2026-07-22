from arclm import validate_sft_records

records = [{"instruction": "Explain ArcLM.", "response": "ArcLM is native-first."}]
result = validate_sft_records(records)
print(result.summary())
