def test_evaluation_public_imports():
    from arclm.evaluation import (
        Accuracy,
        BaseEvaluationCallback,
        BaseEvaluator,
        BaseMetric,
        EvaluationConfig,
        EvaluationResult,
        Evaluator,
        LossMetric,
        Perplexity,
        calculate_metrics,
        calculate_perplexity,
        evaluate,
    )

    assert Accuracy is not None
    assert BaseEvaluationCallback is not None
    assert BaseEvaluator is not None
    assert BaseMetric is not None
    assert EvaluationConfig is not None
    assert EvaluationResult is not None
    assert Evaluator is not None
    assert LossMetric is not None
    assert Perplexity is not None
    assert callable(calculate_metrics)
    assert callable(calculate_perplexity)
    assert callable(evaluate)


def test_root_evaluation_exports_are_lazy():
    from arclm import Accuracy, EvaluationConfig, Evaluator, Perplexity

    assert Evaluator.__name__ == "Evaluator"
    assert EvaluationConfig.__name__ == "EvaluationConfig"
    assert Accuracy.__name__ == "Accuracy"
    assert Perplexity.__name__ == "Perplexity"
