from arclm.finetuning import validate_sft_records

print(validate_sft_records([{"instruction": "Hi", "response": "Hello"}], strict=False).valid_count)
