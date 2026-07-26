# Advanced Lab

Model adaptation and usage: artifacts, fine-tuning formatting, SFT preparation, PEFT boundaries, evaluation, generation, and inspection.

## Challenges

- `advanced-01-artifacts-and-tracking` - Track artifacts safely (artifacts, from_scratch)
- `advanced-02-finetuning-formatting` - Format supervised fine-tuning records (fine_tuning, from_scratch)
- `advanced-03-sft-dataset-preparation` - Prepare SFT examples identically (fine_tuning, arclm_integration)
- `advanced-04-peft-and-lora` - Explore PEFT and LoRA boundaries (peft, from_scratch)
- `advanced-05-evaluation` - Build evaluation reports (evaluation, from_scratch)
- `advanced-06-inference-and-generation` - Implement bounded generation (inference, from_scratch)
- `advanced-07-pipeline-inspection` - Trace one model step (inspection, arclm_integration)
- `advanced-08-advanced-capstone` - Build a domain adaptation toolkit (fine_tuning, arclm_integration)

## Run

`python -m lab.runner test-level advanced`

## Contributor Notes

Keep new challenges local to `lab/`, add metadata, public tests, manifest entries, examples, and prerequisites before submitting.