from arclm.evaluation import EvaluationResult


def test_evaluation_result_serializes():
    result = EvaluationResult(
        metrics={"loss": 1.0},
        num_examples=4,
        num_batches=2,
        metadata={"device": "cpu"},
    )

    data = result.to_dict()

    assert data["metrics"]["loss"] == 1.0
    assert data["num_examples"] == 4
    assert data["predictions"] is None
