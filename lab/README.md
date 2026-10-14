# ArcLM Lab

**Learn the architecture by building it.**

ArcLM Lab is a progressive curriculum of hands-on challenges that teach you how
the ArcLM framework works — from raw text records to training loops, checkpoints,
fine-tuning, evaluation, agents, and architecture decisions.

It is not a test suite. It is a **learning path** with 32 challenges across four
levels, automated tests, and a capstone per level.

```text
Data → Tokenization → Model → Training → Checkpoints
→ Fine-tuning → Evaluation → Generation → Inspection
→ Agents → Security → Distributed runtime → Architecture
```

## Levels at a glance

| Level | Focus | Challenges | You build |
|-------|-------|------------|-----------|
| **Beginner** | Data, tokenizers, training counters | 8 | Tiny Dataset Inspector |
| **Intermediate** | Pipelines, models, training loops, checkpoints | 8 | Tiny Training Workbench |
| **Advanced** | Artifacts, SFT, PEFT, evaluation, inference | 8 | Domain Adaptation Toolkit |
| **Expert** | Registries, events, DDP/FSDP planning, ADRs | 8 | Runtime Architecture Simulator |

## Who is this for?

- New ArcLM contributors
- Python developers entering AI engineering
- ML students and early researchers
- Anyone preparing to modify ArcLM production code

You do **not** need every external course before starting. Use resources to fill
gaps as you go.

## Prerequisites

```bash
pip install -e ".[dev,train,security]"
```

You should be comfortable with Python functions, classes, exceptions, and basic
file/JSON handling. Deep-learning math is introduced gradually in Beginner.

## How to use the Lab

For every level, follow this cycle:

```text
1. Read the level overview
2. Check prerequisites
3. Study the required resources
4. Implement the small exercises
5. Run the challenge tests
6. Fix edge cases
7. Complete the capstone
8. Write a short reflection
9. Continue to the next level
```

Workflow for one challenge:

```bash
python -m lab.runner show <challenge-id>
python -m lab.runner test <challenge-id>
```

After finishing a level:

```bash
python -m lab.runner test-level beginner
```

Run the complete Lab:

```bash
python -m lab.runner test-all
```

List all challenges:

```bash
python -m lab.runner list
```

## Learning rule

Do not copy complete solutions from tutorials. The purpose of the resources is
to understand the concepts. **Your challenge implementation must be your own
work.**

A good learning process:

```text
Learn the concept
→ close the tutorial
→ implement from memory
→ run tests
→ debug
→ compare your reasoning
```

## Resource types

| Type | Meaning |
| ---- | ------- |
| Required | Minimum knowledge needed to complete the level |
| Recommended | Helps you understand the architecture more deeply |
| Deep dive | Advanced material for research or production context |

You are not expected to finish every deep-dive resource.

## Level 1: Beginner

### Goal

Learn the fundamental building blocks used by ArcLM. By the end of this level,
you should understand Python functions and classes, type hints, lists,
dictionaries, dataclasses, files and paths, JSON and JSONL, text cleaning,
dataset records, validation, vocabulary construction, basic tokenization, token
IDs, sequence preparation, basic testing, and simple training counters.

You should be able to build:

```text
Tiny Dataset Inspector
```

### Beginner Prerequisites

Before beginning, you should know Python variables, conditions, loops,
functions, classes, exceptions, imports, and basic file handling. You do not
need advanced mathematics or deep-learning knowledge yet.

### Beginner Roadmap

```text
Python fundamentals
-> Files and structured data
-> Testing
-> NumPy arrays
-> PyTorch tensors
-> Neural-network intuition
-> Dataset and tokenizer challenges
```

### Beginner Required Resources

1. [The Python Tutorial](https://docs.python.org/3/tutorial/)

   Focus on control flow, functions, data structures, modules, input and
   output, errors and exceptions, and classes.

2. [Python Input and Output](https://docs.python.org/3/tutorial/inputoutput.html)
   and [Python JSON Module](https://docs.python.org/3/library/json.html)

   Understand reading and writing text files, loading and saving JSON, UTF-8,
   and missing-file handling.

3. [NumPy Quickstart](https://numpy.org/doc/stable/user/quickstart.html)

   Focus on arrays, shapes, dimensions, indexing, data types, and basic
   numerical operations.

4. [PyTorch: Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/)

   Study Quickstart, Tensors, Datasets and DataLoaders, Build the Neural
   Network, Automatic Differentiation, Optimization, and Save and Load the
   Model.

5. [pytest: Get Started](https://docs.pytest.org/en/stable/getting-started.html)

   Understand test functions, assertions, expected exceptions, fixtures, and
   temporary paths.

### Beginner Recommended Videos

- [3Blue1Brown: Neural Networks](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)
- [Introduction to PyTorch: Official Video Series](https://docs.pytorch.org/tutorials/beginner/introyt.html)

Use these for intuition about neural networks, gradient descent,
backpropagation, and PyTorch workflows.

### Beginner Challenge Path

```text
1. Data Loading
2. Text Cleaning
3. Dataset Validation
4. Vocabulary Construction
5. Word Tokenizer
6. Sequence Preparation
7. Training Counters
8. Beginner Capstone
```

### Beginner Readiness Checklist

You are ready for the Beginner capstone when you can load JSON, JSONL and TXT
safely; explain what a dataset record is; clean text without destroying useful
content; produce structured validation issues; count token frequencies; build a
deterministic vocabulary; convert tokens into IDs; handle unknown tokens;
explain causal input and label shifting; write and run pytest tests; and avoid
modifying input records accidentally.

### Beginner Capstone

Build the Tiny Dataset Inspector:

```text
Load data
-> Clean records
-> Validate records
-> Build vocabulary
-> Tokenize text
-> Calculate statistics
-> Produce a JSON-safe report
```

## Level 2: Intermediate

### Goal

Learn how ArcLM components connect to form a model-training workflow. By the
end of this level, you should understand dataset manifests, deterministic
fingerprints, preprocessing pipelines, tokenizer persistence, PyTorch modules,
model configurations, tensor shapes, embeddings, logits, loss, autograd,
optimizers, training loops, model saving, checkpoints, and restoring training
state.

You should be able to build:

```text
Tiny Training Workbench
```

### Intermediate Prerequisites

Complete the Beginner level or demonstrate equivalent knowledge. You should be
able to write Python classes, use type hints, use NumPy arrays, use PyTorch
tensors, write tests, build a small tokenizer, and prepare input IDs and
labels.

### Intermediate Roadmap

```text
PyTorch tensors
-> nn.Module
-> Forward pass
-> Autograd
-> Loss and optimization
-> Tokenizer persistence
-> Transformer fundamentals
-> Training loop
-> Checkpoint lifecycle
```

### Intermediate Required Resources

1. [Build the Neural Network](https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html)

   Understand `torch.nn.Module`, `__init__`, `forward`, model parameters, and
   train/evaluation modes.

2. [PyTorch Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/)

   Understand `optimizer.zero_grad() -> model(inputs) -> calculate loss ->
   loss.backward() -> optimizer.step()`.

3. [Andrej Karpathy: Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

   Recommended parts: micrograd, makemore, backpropagation, language-model
   construction, and GPT implementation. Do not copy the implementation
   directly into ArcLM Lab.

4. [SentencePiece Project](https://github.com/google/sentencepiece) and
   [SentencePiece paper](https://arxiv.org/abs/1808.06226)

   Focus on raw-text training, fixed vocabulary sizes, BPE, Unigram, encoding,
   and decoding.

5. [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/en/chapter1/1)

   Study Transformer concepts, tokenizers, datasets, model inputs, and
   fine-tuning workflow. Apply the concepts using ArcLM interfaces.

### Intermediate Recommended Resources

- [Stanford CS224N: NLP with Deep Learning](https://web.stanford.edu/class/cs224n/)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)

At this level, focus on self-attention, multi-head attention, positional
information, feed-forward layers, and residual connections.

### Intermediate Challenge Path

```text
1. Dataset Manifest and Statistics
2. Preprocessing Pipeline
3. Tokenizer Persistence
4. Model Configuration
5. Forward Pass
6. Training Loop
7. Checkpoint Lifecycle
8. Intermediate Capstone
```

### Intermediate Readiness Checklist

You are ready for the capstone when you can explain tensor shape conventions;
build an `nn.Module`; explain a forward pass; calculate a loss; run
backpropagation; use an optimizer; explain why gradients are reset; save and
restore a model; persist tokenizer state safely; create deterministic dataset
fingerprints; validate model dimensions; explain why embedding size must be
divisible by attention heads; and restore a training step from a checkpoint.

### Intermediate Capstone

Build the Tiny Training Workbench:

```text
Dataset
-> Manifest
-> Preprocessing
-> Tokenizer
-> Model configuration
-> Forward pass
-> Training
-> Checkpoint
-> Reload
```

## Level 3: Advanced

### Goal

Learn model adaptation, evaluation, and model usage. By the end of this level,
you should understand artifacts and run tracking, pre-training versus
fine-tuning, supervised fine-tuning, instruction/response formatting,
prompt/completion formatting, label masks, response-only training, truncation,
PEFT concepts, LoRA, evaluation, perplexity, generation, sampling, and pipeline
inspection.

You should be able to build:

```text
Domain Adaptation Toolkit
```

### Advanced Prerequisites

Complete the Intermediate level or demonstrate that you can train a tiny
PyTorch model, save and restore checkpoints, explain logits and loss, work with
token IDs, understand basic Transformer architecture, and debug model and
sequence shapes.

### Advanced Roadmap

```text
Language modeling from scratch
-> Supervised fine-tuning
-> Label construction
-> Fine-tuning correctness
-> LoRA concepts
-> Evaluation
-> Generation
-> Pipeline inspection
```

### Advanced Required Resources

1. [Stanford CS336: Language Modeling from Scratch](https://cs336.stanford.edu/)

   Study tokenizer construction, Transformer implementation, language-model
   training, scaling and efficiency, data pipelines, evaluation, and
   distributed concepts.

2. [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/en/chapter1/1)

   Focus on tokenization, dataset processing, model fine-tuning, evaluation,
   generation, and differences between base and task-adapted models.

3. [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)

   Understand freezing base weights, low-rank matrices, rank, alpha/scaling,
   trainable parameter reduction, and merge/unmerge concepts. The ArcLM LoRA
   Lab challenge is educational and does not prove full production support.

4. [PyTorch Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/)

   Study the difference between model weights, model configuration, optimizer
   state, and complete training checkpoints.

### Advanced Concepts To Study

- Fine-tuning versus pre-training:

  ```text
  Pre-training -> learn general patterns from a larger corpus
  Continued pre-training -> continue causal training on additional domain text
  Fine-tuning -> adapt an existing model to specialized data or behavior
  Supervised fine-tuning -> train with structured input/output examples
  ```

- Formatting tag versus special token:

  ```text
  Formatting tag -> text inserted into the record
  Special token -> registered tokenizer vocabulary item
  ```

- Label masking: understand why instruction tokens may use `label = -100`
  while response tokens use their real token IDs as labels.

- Evaluation: understand cross-entropy loss, perplexity, token accuracy,
  comparable evaluation conditions, and why one metric cannot represent every
  model quality.

- Generation: understand greedy decoding, temperature, top-k, top-p, fixed
  seeds, context limits, and maximum new tokens.

### Advanced Challenge Path

```text
1. Artifacts and Tracking
2. Fine-Tuning Formatting
3. SFT Dataset Preparation
4. PEFT and LoRA Boundaries
5. Evaluation
6. Inference and Generation
7. Pipeline Inspection
8. Advanced Capstone
```

### Advanced Readiness Checklist

You are ready for the capstone when you can explain pre-training versus
fine-tuning; prepare instruction/response records; create full-sequence and
response-only labels; explain the ignore index; detect when truncation removes
the trainable response; explain LoRA rank and scaling; calculate trainable
parameter counts; evaluate a model; calculate perplexity safely; implement
bounded generation; explain temperature, top-k and top-p; produce a real
one-step pipeline trace; and avoid fabricating attention or hidden-state
values.

### Advanced Capstone

Build the Domain Adaptation Toolkit:

```text
Structured dataset
-> Validation
-> Fine-tuning configuration
-> Formatting preview
-> Label preparation
-> Fine-tuning
-> Checkpoint
-> Evaluation
-> Generation
-> Inspection
```

## Level 4: Expert

### Goal

Learn the systems and architecture behind a larger AI framework. By the end of
this level, you should understand registries, plugins, aliases, dependency
injection, event systems, lifecycle hooks, job coordination, process isolation,
distributed training concepts, DDP, FSDP, sharded checkpoints, fault tolerance,
architecture decisions, compatibility, and migration policies.

You should be able to build:

```text
ArcLM Runtime Architecture Simulator
```

### Expert Prerequisites

Complete the Advanced level or demonstrate equivalent experience. You should
understand complete native model lifecycle, training and checkpoints,
fine-tuning, evaluation and generation, Python packaging, concurrency
fundamentals, GPU memory basics, and process versus thread differences.

A real multi-GPU system is not required for the Lab simulations.

### Expert Roadmap

```text
Extensible Python architecture
-> Registries and plugins
-> Events and dependency injection
-> Process and resource coordination
-> DDP
-> FSDP
-> Sharded checkpoints
-> Fault tolerance
-> Architecture decision records
```

### Expert Required Resources

1. [Creating and Discovering Plugins: Python Packaging Guide](https://packaging.python.org/en/latest/guides/creating-and-discovering-plugins/)
   and [importlib.metadata](https://docs.python.org/3/library/importlib.metadata.html)

   Study naming-convention discovery, namespace packages, package metadata,
   entry points, and installed-package metadata.

2. [Getting Started with Distributed Data Parallel](https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html)

   Study process groups, ranks, world size, model replicas, gradient
   synchronization, and rank-local execution.

3. [Distributed Data Parallel in PyTorch: Official Video Tutorials](https://docs.pytorch.org/tutorials/beginner/ddp_series_intro.html)

   Follow the progression from a normal training script to multi-machine
   training and fault-tolerant `torchrun` concepts.

4. [Getting Started with FSDP2](https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html)

   Understand how FSDP differs from DDP:

   ```text
   DDP -> every rank normally owns a model replica
   FSDP -> parameters, gradients and optimizer state can be sharded
   ```

5. [ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)

   Study optimizer-state sharding, gradient sharding, parameter sharding,
   memory redundancy, and communication trade-offs.

6. [Architecture Decision Record examples and templates](https://github.com/architecture-decision-record/architecture-decision-record)

   Understand Context, Decision, Alternatives, Consequences, Risks, and
   Migration path.

### Expert Recommended Resources

- [Advanced Model Training with FSDP](https://docs.pytorch.org/tutorials/intermediate/FSDP_advanced_tutorial.html)
- [Stanford CS336](https://cs336.stanford.edu/)

Use these for systems, memory, distributed training, scaling, and efficiency.

### Expert Challenge Path

```text
1. Registry and Plugins
2. Events and Dependency Injection
3. Distributed Runtime Planning
4. DDP Planning
5. FSDP Checkpoint Policy
6. Fault Tolerance
7. Architecture Decisions
8. Expert Capstone
```

### Expert Readiness Checklist

You are ready for the capstone when you can design a safe component registry;
explain plugin discovery; reject arbitrary class paths; implement deterministic
event priority; explain singleton, scoped and transient services; calculate
effective distributed batch size; partition dataset indices between ranks;
explain rank-zero-only side effects; compare DDP and FSDP; design full and
sharded checkpoint policies; define valid job status transitions; detect stale
jobs; design atomic metadata writes; compare thread, subprocess and
external-worker architectures; and write an Architecture Decision Record.

### Expert Capstone

Build the ArcLM Runtime Architecture Simulator:

```text
Job submission
-> Resource allocation
-> Distributed plan
-> Rank assignment
-> Checkpoint policy
-> Failure
-> Interruption
-> Resume decision
-> Final report
```

The simulator must clearly state that it is not real distributed GPU execution.

## Suggested Study Schedule

| Level | Study | Challenges | Capstone |
| ----- | ----- | ---------- | -------- |
| Beginner | 10-20 hours | 10-20 hours | 4-8 hours |
| Intermediate | 20-35 hours | 20-35 hours | 8-15 hours |
| Advanced | 30-50 hours | 30-50 hours | 12-25 hours |
| Expert | 35-60 hours | 30-60 hours | 15-30 hours |

These are suggestions, not deadlines. Experience level and study depth will
change the required time.

## Progress Tracking

Use the Lab runner:

```bash
python -m lab.runner progress
```

Manifest status names are:

```text
stub
in_progress
completed
verified
deprecated
```

Learner-facing meanings are:

```text
stub -> Not started
in_progress -> In progress
completed -> Completed
verified -> Verified
deprecated -> Deprecated
```

Do not mark a challenge as complete only because the file compiles. A challenge
is complete when its implementation exists, public tests pass, edge cases are
handled, and the learner can explain the main concept.

## Reflection Questions

After every level, answer:

1. Which concept was most difficult?
2. Which challenge required the most debugging?
3. Which component would you now trust yourself to modify in ArcLM?
4. Which component still needs more study?
5. Which architectural decision did you disagree with?
6. What would you improve without breaking compatibility?

Store the answers in a local learning journal. Do not include personal notes in
ArcLM production files.

## Contributor Readiness

Completing a level does not automatically give permission to modify every ArcLM
subsystem.

Suggested contributor boundaries:

```text
Beginner completed -> Documentation, fixtures and small data utilities
Intermediate completed -> Dataset, tokenizer and small training improvements
Advanced completed -> Fine-tuning, evaluation, inference and inspection work
Expert completed -> Registries, runtimes, distributed architecture and major design changes
```

Actual contribution access should also depend on code review, test quality,
understanding of the current repository, and task-specific knowledge.

## Important Reminders

- ArcLM changes over time.
- The current repository is the source of truth.
- A paper being listed does not mean ArcLM fully implements it.
- A Lab exercise does not prove production support.
- LoRA exercises remain educational unless production integration is separately verified.
- DDP and FSDP simulations do not prove multi-GPU support.
- Do not download large models or datasets for Lab challenges.
- Do not write Lab output into the real ArcLM workspace.
- Do not change production code to make a Lab challenge pass.
- Use CPU, fixed seeds and temporary directories whenever possible.

## Resource Maintenance

Review external learning links periodically. When adding or replacing a
resource:

1. Prefer official documentation.
2. Prefer the original research paper.
3. Avoid resources that require payment when a good free alternative exists.
4. Check that the link still works.
5. Explain which sections are relevant.
6. Do not require learners to complete unrelated chapters.
7. Keep optional resources clearly separated from required resources.

The Lab should teach ArcLM concepts without depending permanently on one
external course.

## Production Boundary

The Lab can import stable ArcLM public APIs in integration challenges, but it
does not ship as the ArcLM Python package and does not change production source.
The current packaging policy discovers packages only under `src/arclm*`, so the
wheel excludes `lab/`. Build output should be checked if packaging policy
changes.
