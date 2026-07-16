# Evaluation Audit

Basic Evaluation is implemented and verified.

Evidence:

- Implementation: `src/arclm/evaluation`
- Public API: `Evaluator`, `EvaluationConfig`, `EvaluationResult`,
  `BaseMetric`, `Accuracy`, `Perplexity`
- Tests: `tests/unit/evaluation`, `tests/smoke/test_basic_evaluation.py`

Implemented:

- validation loss
- perplexity from average loss
- classification accuracy
- token accuracy with `ignore_index`
- custom metrics
- callbacks
- model-mode restoration
- no-gradient evaluation
- `Trainer.evaluate()` integration

Limitations:

- No benchmark platform.
- No distributed metric aggregation.
- No streaming metric memory policy for very large datasets.
- No task-specific benchmark suites such as MMLU or GSM8K.

## Model Artifact Compatibility

Core Milestone 1 / Feature 3 verified:

```text
save native ArcLM final artifact
→ load artifact on CPU
→ run Evaluator
→ finite loss and valid accuracy
```

Final artifact metadata does not change metric behavior. Benchmark suites and
distributed evaluation remain out of scope.

## Fine-Tuning Evaluation

Core Milestone 2 / Feature 1 verifies evaluation through the fine-tuning
workflow:

```text
fine_tune(..., eval_dataset=...)
-> existing Evaluator integration
-> final artifact reload
-> Evaluator on loaded model through ModelAdapter
```

The evaluation path uses `LossMetric` and the same no-gradient/model-mode
restoration behavior as the Evaluation Core.

## PEFT Evaluation

Core Milestone 2 / Feature 2 verifies evaluation after a LoRA workflow by
saving a merged final model artifact, loading it on CPU, and running the
existing `Evaluator` through `ModelAdapter`. Adapter metadata does not change
metric behavior.
