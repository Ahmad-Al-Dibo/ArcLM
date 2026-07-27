from arclm.evaluation import EvaluationResult


result = EvaluationResult(metrics={"loss": 1.0, "perplexity": 2.0, "accuracy": 0.5}, num_examples=2, num_batches=1)
print(result.to_dict()["metrics"]["accuracy"])
