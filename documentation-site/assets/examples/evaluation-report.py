from arclm.evaluation import EvaluationReport

report = EvaluationReport(metrics={"loss": 1.0}, num_examples=1, num_batches=1, num_tokens=None, model_identity=None, checkpoint_identity=None, dataset_identity=None, evaluation_timestamp=0.0, device="cpu", dtype="float32")
print(report.to_json())
