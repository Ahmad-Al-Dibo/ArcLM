# Recommended Roadmap

This roadmap is based on repository evidence from the current audit. It should replace broad wish-list planning with dependency-aware work.

## Phase 0: Stabilize Current Repository State

Why first:

- The git tree is in a large migration state.
- The full test suite passes, but many source/docs files are untracked.
- Some README status text is stale.

Work:

- Commit or otherwise normalize the `src/` migration state.
- Update README test/environment notes.
- Add a status badge or status doc pointing to this audit.
- Keep compatibility shims until a deprecation plan exists.

## Phase 1: CLI And Documentation Accuracy

Why:

- CLI help works, but subcommands appear stale.
- Docs contain roadmap and advanced-feature language that can be confused with implementation.

Work:

- Add CLI train/eval/generate smoke tests.
- Fix CLI only where tests prove breakage.
- Document legacy versus current APIs.
- Clarify `TrainingConfig` and `ModelAdapter` duplicate names.

## Phase 2: LoRA And Basic PEFT Foundation

Why:

- LoRA code exists but is experimental.
- PEFT is optional and absent in the current environment.
- This was already the intended next feature phase after SFT.

Work:

- Add a stable PEFT config.
- Keep PEFT optional.
- Add local tiny PEFT tests when dependency is installed.
- Do not start QLoRA until LoRA is stable.

## Phase 3: Hugging Face Runtime Validation

Why:

- HF support exists but is mostly not runtime-tested with real local HF models.

Work:

- Add optional tests with tiny locally constructed HF configs/models.
- Test HF tokenizer chat templates.
- Test `load_any_model` with local HF folders.
- Test save/reload artifacts.

## Phase 4: Inference Improvements

Why:

- Basic generation works, but serving-quality inference is missing.

Work:

- Add explicit greedy decoding.
- Add streaming token generation.
- Add true batch inference.
- Add generation tests for top-k/top-p/temperature.
- Keep production serving separate.

## Phase 5: Monitoring And Experiment Logs

Why:

- Basic metrics and async logs exist.
- ExperimentTracker exists but is untested.

Work:

- Test local `ExperimentTracker`.
- Document tracking limitations.
- Add structured speed metrics.
- Add CPU/RAM/GPU monitoring only after metrics format is stable.

## Phase 6: Distributed Training

Why:

- Single-device training is stable.
- Distributed training should not be mixed into the core trainer prematurely.

Work:

- Design DDP wrapper around existing `Trainer`.
- Add launch docs.
- Add CPU/gloo tests where possible.
- Add CUDA tests in GPU CI.
- Delay FSDP/DeepSpeed until DDP works.

## Phase 7: Optimization And Export

Why:

- External save/export exists but artifact guarantees are not proven.
- Quantization flags exist but are not runtime-tested.

Work:

- Add valid artifact tests for current save/export paths.
- Add ONNX only after export test harness exists.
- Add quantization tests only with supported optional deps.
- Avoid claiming INT4/INT8 stable until reload works.

## Phase 8: Deployment And Serving

Why:

- Simple Flask UI exists, but production serving does not.

Work:

- Add endpoint tests for the simple interface.
- Add a local server health-check test.
- Design production serving separately.
- Add Docker only after a stable server exists.

## Phase 9: Advanced Evaluation

Why:

- Basic evaluation is stable.
- Benchmark suites need dataset handling, downloads, caching and reports.

Work:

- Add a small custom benchmark framework.
- Add local benchmark fixtures first.
- Add MMLU/GSM8K only after download/cache policy is clear.
- Add model comparison reports before dashboards.

## Phase 10: Enterprise

Why:

- No enterprise foundation exists.
- Enterprise should not be mixed into the learning/core library.

Work:

- Define product boundaries.
- Add auth/RBAC/audit logs only if building a server platform.
- Add billing/license checks only in a Pro distribution.

## Dependency Chain

Recommended order:

```text
Repository stabilization
-> CLI/docs accuracy
-> LoRA and PEFT foundation
-> Hugging Face runtime validation
-> inference improvements
-> monitoring
-> distributed training
-> optimization/export
-> deployment/serving
-> advanced evaluation
-> enterprise
```

Do not start QLoRA, RLHF, DPO, GRPO, Kubernetes, dashboards or enterprise features before LoRA/HF runtime validation and inference basics are stable.
