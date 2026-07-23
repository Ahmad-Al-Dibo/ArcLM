# Intermediate Lab

Reusable components: manifests, preprocessing, tokenizer persistence, model configuration, forward passes, training loops, and checkpoints.

## Challenges

- `intermediate-01-dataset-manifest` - Create dataset manifests and statistics (data, from_scratch)
- `intermediate-02-preprocessing-pipeline` - Build a preprocessing pipeline (preprocessing, from_scratch)
- `intermediate-03-tokenizer-persistence` - Persist a tokenizer safely (tokenization, from_scratch)
- `intermediate-04-model-configuration` - Validate tiny model configuration (models, from_scratch)
- `intermediate-05-forward-pass` - Implement a tiny forward pass (models, from_scratch)
- `intermediate-06-training-loop` - Implement a tiny training loop (training, from_scratch)
- `intermediate-07-checkpoint-lifecycle` - Save and restore training state (checkpoints, from_scratch)
- `intermediate-08-intermediate-capstone` - Build a tiny training workbench (training, from_scratch)

## Run

`python -m lab.runner test-level intermediate`

## Contributor Notes

Keep new challenges local to `lab/`, add metadata, public tests, manifest entries, examples, and prerequisites before submitting.