import warnings


def test_old_diagnostics_import_still_exports_metrics():
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        from arclm.diagnostics import MetricsReport, calculate_perplexity

    assert MetricsReport is not None
    assert calculate_perplexity(0.0) == 1.0


def test_existing_evaluation_calculate_perplexity_still_works():
    from arclm.evaluation import calculate_perplexity

    assert calculate_perplexity(0.0) == 1.0
