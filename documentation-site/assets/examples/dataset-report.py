from arclm import build_dataset_report
from arclm.tokenizers import Tokenizer

records = [{"text": "ArcLM keeps data local."}]
tokenizer = Tokenizer(max_vocab=16)
tokenizer.build(records[0]["text"])
report = build_dataset_report(records, tokenizer=tokenizer)
print(report.summary())
