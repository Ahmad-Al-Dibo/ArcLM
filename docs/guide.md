# ArcLM Guide

A complete tour of the ArcLM framework: installation, core concepts, and every subpackage with runnable examples.

**Contents**

1. [Getting started](#1-getting-started)
2. [Installation](#2-installation)
3. [Core concepts](#3-core-concepts)
4. [Datasets](#4-datasets)
5. [Tokenizers](#5-tokenizers)
6. [Models](#6-models)
7. [Training](#7-training)
8. [Fine-tuning & SFT](#8-fine-tuning--sft)
9. [Checkpoints](#9-checkpoints)
10. [Evaluation](#10-evaluation)
11. [Inference & generation](#11-inference--generation)
12. [PEFT (LoRA / QLoRA)](#12-peft-lora--qlora)
13. [Experiment tracking](#13-experiment-tracking)
14. [Hyperparameter search](#14-hyperparameter-search)
15. [Agents](#15-agents)
16. [Security](#16-security)
17. [Web Studio](#17-web-studio)
18. [CLI reference](#18-cli-reference)
19. [Pipeline inspection](#19-pipeline-inspection)
20. [Optional dependencies](#20-optional-dependencies)
21. [Troubleshooting & FAQ](#21-troubleshooting--faq)
22. [Migrating from 1.x](#22-migrating-from-1x)

---

## 1. Getting started

ArcLM's supported workflow:

```text
dataset → validation/cleaning → tokenizer → model → training
→ checkpoint → evaluation → generation → inspection
```

Minimal end-to-end example (`pip install "arclm[train]"`):

```python
from arclm.datasets import load_dataset
from arclm.tokenizers import Tokenizer
from arclm.models import ArcLM
from arclm.training import Trainer, TrainingConfig
from arclm.inference import Generator

# 1. Data
records = load_dataset([{"text": "arc lm trains tiny models on local text."} * 50])
text = " ".join(r["text"] for r in records)

# 2. Tokenizer
tokenizer = Tokenizer(max_vocab=256)
tokenizer.build(text)
ids = tokenizer.encode_text(text)

# 3. Model
model = ArcLM(vocab_size=tokenizer.get_vocab_size(), embed_dim=32, block_size=16, num_blocks=1)

# 4. Train
trainer = Trainer(model=model, config=TrainingConfig(epochs=3, batch_size=4))
# (See §7 for full DataLoader wiring; train_model() in §7 is the one-call path.)

# 5. Generate
generator = Generator(model, tokenizer)
print(generator.generate("arc", max_new_tokens=10))
```

For a one-call training path, use `train_model` (§7).

---

## 2. Installation

### Core (light, no PyTorch)

```bash
pip install arclm
```

Installs only `numpy` and `sentencepiece` (~50 MB). Everything except model math works: datasets, tokenizers, configs, agents, security, logics, search, tracking, CLI diagnostics.

### With training

```bash
pip install "arclm[train]"
```

Adds PyTorch (~500 MB CPU wheel). Required for `arclm.models`, `arclm.training`, `arclm.finetuning`, `arclm.inference`, `arclm.evaluation`, `arclm.peft`, `arclm.checkpoints` tensor ops.

CPU-only torch (smaller download):

```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install "arclm[train]"
```

### All extras

```bash
pip install "arclm[all]"       # train + web + hf + peft + security
pip install "arclm[web]"       # FastAPI Studio (includes torch)
pip install "arclm[hf]"        # Hugging Face transformers stack
pip install "arclm[peft]"      # LoRA via peft
pip install "arclm[qlora]"     # QLoRA + bitsandbytes
pip install "arclm[security]"  # cryptography
pip install "arclm[dev]"       # pytest, build, twine
```

### From source

```bash
git clone https://github.com/ahmad-al-dibo/arclm
cd arclm
pip install -e ".[dev,train]"
```

Python: **3.9+**. See [§20](#20-optional-dependencies) for the full dependency matrix.

---

## 3. Core concepts

### Config

`arclm.configs.Config` is the single broad configuration object for model size, data paths, tokenizer, training, and evaluation. It is plain Python — no torch required.

```python
from arclm.configs import Config, create_config, save_config_yaml, load_config_yaml

# From defaults + overrides
config = create_config(embed_dim=64, block_size=32, num_epochs=5, device="cpu")

# Direct
config = Config(embed_dim=64, block_size=32)

# Persist
save_config_yaml(config, "config.yaml")
config = load_config_yaml("config.yaml")
```

Key fields: `embed_dim`, `block_size`, `num_blocks`, `vocab_size`, `batch_size`, `num_epochs`, `learning_rate`, `tokenizer_type` (`"word"` or `"sentencepiece"`), `device`, `seed`, `model_path`, `data_path`.

> **Note:** `TrainingConfig` (from `arclm.training`) is a *different*, smaller dataclass for the modern `Trainer` API. `DatasetConfig` (from `arclm.datasets`) configures `load_dataset`. Do not confuse them with `Config`.

### Optional torch

Importing a torch-backed package without torch installed raises `OptionalDependencyError`:

```text
arclm.models requires optional dependency 'torch'.

Install it with:

    pip install "arclm[train]"
```

Torch-free packages: `arclm.datasets`, `arclm.tokenizers`, `arclm.configs`, `arclm.security`, `arclm.agents`, `arclm.logics`, `arclm.search`, `arclm.tracking`, `arclm.registry`, `arclm.cli` (doctor / security / web-api).

### Exceptions

All domain errors hang off `arclm.exceptions.ArcLMError`:

```python
from arclm.exceptions import (
    ArcLMError, DatasetLoadError, TrainingConfigError,
    CheckpointError, OptionalDependencyError, ...
)
```

---

## 4. Datasets

**Package:** `arclm.datasets` · **Torch:** optional (DataLoader helpers need it)

Load local records, validate, clean, deduplicate, split, and wrap in DataLoaders.

### Loading

```python
from arclm.datasets import load_dataset, load_tokens, prepare_data, split_train_val

# From list of dicts, JSONL path, or text file
records = load_dataset([{"text": "hello world"}, {"text": "arc lm"}])
records = load_dataset("data.jsonl")
records = load_dataset("data.txt")          # one document per line

# Token pipeline helpers
tokens = load_tokens("tokens.txt")
train_ids, val_ids = split_train_val(token_ids, val_split=0.1)

# Full prepare (uses Config: data_path, tokenizer, block_size, …)
bundle = prepare_data(config)  # → DataBundle with train/val loaders + tokenizer
```

### Validation

```python
from arclm.datasets import validate_records, build_dataset_report, create_dataset_manifest

result = validate_records(records, min_chars=1, max_chars=100_000)
if not result.ok:
    for issue in result.issues:
        print(issue)

report = build_dataset_report(records)
manifest = create_dataset_manifest(records, source="data.jsonl")
```

### Cleaning & deduplication

```python
from arclm.datasets import DataPipeline, deduplicate, ExactDeduplicator
from arclm.datasets.cleaning import TextCleaner, FilterStep

# Deduplicate (exact)
clean, dedupe_report = deduplicate(records)

# Pipeline of steps
pipeline = DataPipeline([
    TextCleaner(lowercase=True, strip=True),
    FilterStep(min_chars=10),
])
processed = pipeline.run(records)
```

### Streaming

```python
from arclm.datasets import StreamingDataset

stream = StreamingDataset("huge.jsonl")  # lazy iteration, low memory
for record in stream:
    ...
```

### DatasetConfig

```python
from arclm.datasets import DatasetConfig, load_dataset

cfg = DatasetConfig(path="data.jsonl", val_split=0.1, shuffle=True)
bundle = load_dataset(cfg)
```

---

## 5. Tokenizers

**Package:** `arclm.tokenizers` · **Torch:** not required · **Deps:** `sentencepiece` (core)

Two implementations: whitespace **word-level** and **SentencePiece**.

### Word-level

```python
from arclm.tokenizers import Tokenizer, create_tokenizer

tok = Tokenizer(max_vocab=1000, min_freq=1)
tok.build("corpus text goes here ...")

ids = tok.encode_text("corpus text")
text = tok.decode(ids)
size = tok.get_vocab_size()
unk = tok.get_unknown_index()
```

### SentencePiece

```python
from arclm.tokenizers import SentencePieceTokenizer

tok = SentencePieceTokenizer(model_type="bpe", vocab_size=1000, character_coverage=1.0)
tok.build(corpus_text)
ids = tok.encode_text("hello")
```

### Factory & AutoTokenizer

```python
from arclm.tokenizers import TokenizerFactory, AutoTokenizer, create_tokenizer

# By name
tok = create_tokenizer("word", max_vocab=512)

# Custom registration
TokenizerFactory.register("my_tok", MyTokenizerSubclass)
tok = TokenizerFactory.create("my_tok", ...)

# From Config (uses config.tokenizer_type)
tok = AutoTokenizer.from_config(config)
```

### From a checkpoint

```python
from arclm.training import tokenizer_from_checkpoint

tokenizer = tokenizer_from_checkpoint(checkpoint_dict)
```

---

## 6. Models

**Package:** `arclm.models` · **Torch:** required

A single native GPT-style architecture (`ArcLM`): token + position embeddings → stack of causal transformer blocks → LayerNorm → LM head.

```python
from arclm.models import ArcLM, AutoModel, get_model_capability, model_support_matrix

model = ArcLM(
    vocab_size=tokenizer.get_vocab_size(),
    embed_dim=64,
    block_size=32,
    num_blocks=2,
    dropout=0.0,
)

logits = model(token_ids)          # (batch, time) → (batch, time, vocab)
n_params = model.get_num_parameters()
emb = model.get_input_embeddings()

# Factory
model = AutoModel.from_config(config)          # reads vocab_size, embed_dim, …
model = AutoModel.from_name("arclm", vocab_size=100, ...)

# Capability introspection
print(get_model_capability("ArcLM"))
print(model_support_matrix())
```

Inputs are integer tensors shaped `(batch, sequence_length)`; sequence length must be ≤ `block_size`.

---

## 7. Training

**Package:** `arclm.training` · **Torch:** required

### One-call path: `train_model`

```python
from arclm.configs import create_config
from arclm.training import train_model

config = create_config(embed_dim=64, block_size=32, num_epochs=5, device="cpu")
result = train_model(
    mode="pre_training",       # or "fine_tuning" / "instruction_tuning"
    data="data.txt",
    output="models/run1.pth",
    checkpoint=None,           # path to resume from
    config=config,
)
print(result.history["train_losses"][-1])
print(result.model_path)
```

### Trainer API

```python
from arclm.training import Trainer, TrainingConfig, BaseCallback
from arclm.datasets import create_dataloader

tconfig = TrainingConfig(
    epochs=5,
    batch_size=8,
    learning_rate=1e-3,
    weight_decay=0.01,
    precision="fp32",          # fp32 | fp16 | bf16
    optimizer="adamw",         # adamw | adam | sgd
    scheduler="cosine",        # constant | linear | cosine
    max_grad_norm=1.0,
    log_every_steps=10,
)

trainer = Trainer(model=model, config=tconfig)
history = trainer.train_dataset(train_loader, val_loader=val_loader)
```

### Callbacks

```python
from arclm.training import BaseCallback, create_checkpoint_callback

class LossPrinter(BaseCallback):
    def on_log(self, trainer, payload):
        print(payload)

trainer = Trainer(model=model, config=tconfig, callbacks=[LossPrinter()])
trainer.add_callback(create_checkpoint_callback(config, tokenizer, vocab_size))
```

### Regularization utilities

```python
from arclm.training import (
    L1Regularization, L2Regularization, EarlyStopping,
    LearningRateScheduler, LabelSmoothing, MixupAugmentation,
    GeneralizationMonitor,
)
```

### Reproducibility

```python
from arclm.tracking import set_reproducible_seed

set_reproducible_seed(42, deterministic=False)
```

### Continued training

```python
from arclm.training import checkpoint_is_compatible_for_continue_training, load_compatible_checkpoint

if checkpoint_is_compatible_for_continue_training(ckpt, config, vocab_size, tokenizer=tok):
    trainer.load("models/old.pth")
```

A checkpoint with a **missing/empty config** is never treated as compatible.

---

## 8. Fine-tuning & SFT

**Package:** `arclm.finetuning` · **Torch:** required · HF path needs `[hf]`

### SFT with Hugging Face

```python
from arclm.finetuning import train_sft

result = train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="sft.jsonl",
    output_dir="out/sft",
    backend="huggingface",
    # LoRA
    use_lora=True,
    lora_r=8,
    lora_alpha=16,
)
print(result.output_dir)
```

Dataset formats accepted:

```jsonl
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
{"prompt": "Question?", "completion": "Answer."}
{"instruction": "Do X", "input": "context", "output": "result"}
```

### Record contract & preparation

```python
from arclm.finetuning import (
    get_sft_record_contract, validate_sft_records,
    prepare_fine_tuning_dataset, fine_tune, FineTuningConfig,
)

contract = get_sft_record_contract()
validate_sft_records(records, contract=contract)

prepared = prepare_fine_tuning_dataset(records, config=FineTuningConfig())
```

### Full fine-tune (native)

```python
from arclm.finetuning import FullFineTuner, FineTuningConfig

tuner = FullFineTuner(model=model, tokenizer=tokenizer, config=FineTuningConfig(...))
tuner.fit(train_loader)
```

---

## 9. Checkpoints

**Package:** `arclm.checkpoints` · **Torch:** required for tensor ops

### Safe save / load

```python
from arclm.checkpoints import (
    atomic_save_checkpoint, safe_load_training_checkpoint,
    inspect_checkpoint, validate_checkpoint,
)

atomic_save_checkpoint(state_dict, "models/model.pth", metadata={...})
ckpt = safe_load_training_checkpoint("models/model.pth", map_location="cpu")
info = inspect_checkpoint("models/model.pth")
validate_checkpoint("models/model.pth")
```

`safe_load_training_checkpoint` uses torch's safe loading path (no arbitrary code execution by default).

### SmartLoader

Inspects a source *before* loading and builds a load plan:

```python
from arclm.checkpoints import SmartLoader

loader = SmartLoader("path/to/weights")   # HF folder, safetensors, .pth, …
plan = loader.plan()
bundle = loader.load_for_training(target_config=config)
```

Supported sources: ArcLM checkpoints, Hugging Face folders, safetensors, raw state dicts. Registry: `register_model_inspector`.

### Adapters & tokenizer compatibility

```python
from arclm.checkpoints import adapt_for_training, validate_tokenizer_compatibility

adapted = adapt_for_training(loaded, target_config=config)
validate_tokenizer_compatibility(checkpoint_tokenizer, current_tokenizer)
```

---

## 10. Evaluation

**Package:** `arclm.evaluation` · **Torch:** required

### Evaluator + metrics

```python
from arclm.evaluation import Evaluator, Accuracy, LossMetric, Perplexity, EvaluationConfig

evaluator = Evaluator(
    model=model,
    metrics=[Accuracy(), Perplexity(), LossMetric()],
    config=EvaluationConfig(device="cpu"),
)
result = evaluator.evaluate(val_loader)
print(result.metrics["perplexity"])
```

### Export reports

```python
from arclm.evaluation import export_metrics_to_json, export_metrics_to_markdown

export_metrics_to_json(result, "metrics.json")
export_metrics_to_markdown(result, "metrics.md")
```

### Diagnostics (student-facing)

```python
from arclm.evaluation import (
    predict_top_k, score_concept_relationships,
    run_long_context_evaluation, build_training_diagnostics_report,
    format_tokenizer_coverage_report,
)

top = predict_top_k(model, tokenizer, "machine learning", k=5)
concepts = score_concept_relationships(model, tokenizer, benchmarks=DEFAULT_CONCEPT_BENCHMARKS)
report = build_training_diagnostics_report(model, tokenizer, loader)
print(format_tokenizer_coverage_report(tokenizer, corpus_text))
```

---

## 11. Inference & generation

**Package:** `arclm.inference` · **Torch:** required · HF models need `[hf]` or `[hf-inference]`

### Native generation

```python
from arclm.inference import load_model, Generator, predict

model = load_model("models/tiny.pth", device="cpu")
print(model.predict("the future is", max_new_tokens=20, temperature=0.8))

# Or the Generator directly
gen = Generator(model, tokenizer, block_size=32)
text = gen.generate("hello", max_new_tokens=16, temperature=0.7, top_k=40, top_p=0.9)
```

Sampling options: `temperature`, `top_k`, `top_p`, `repetition_penalty`.

### Hugging Face models

```python
from arclm.inference import load_any_model, predict_external

model = load_any_model("Qwen/Qwen3-0.6B", device="cpu", trust_remote_code=False)
print(predict_external(model, "Hello", max_new_tokens=20))
```

### Chat & chat templates

`.chat()` takes OpenAI-style messages and renders them correctly for the backend:

```python
from arclm.inference import load_any_model

model = load_any_model("Qwen/Qwen3-0.6B", device="cpu")

reply = model.chat(
    [
        {"role": "system", "content": "Be concise."},
        {"role": "user", "content": "What is a causal LM?"},
    ],
    max_new_tokens=128,
    temperature=0.7,
)
```

**How the prompt is rendered (HF models):**

| Situation | What ArcLM does |
|---|---|
| Tokenizer has a `chat_template` (Qwen, Llama, Mistral, Gemma, …) | Uses `tokenizer.apply_chat_template(messages)` — **the model's own format**. This is almost always correct: the model was trained with that exact template. |
| No template on the tokenizer | Falls back to a simple standard format: `system: …\nuser: …\nassistant:` |
| Template exists but `apply_chat_template` fails | Falls back to the simple format unless you set `fallback_to_simple_prompt=False` |

You normally **should not** type a chat template for standard HF models — the tokenizer already ships the right one. The simple fallback is only for bare/custom models without a template.

**Custom system prompt** (auto-prepended if the message list has no `system` entry):

```python
model.chat(
    [{"role": "user", "content": "hi"}],
    default_system_prompt="You are a helpful assistant.",  # via generate kwargs where supported
)
```

Or just include it yourself:

```python
messages = [
    {"role": "system", "content": "You are a pirate."},
    {"role": "user", "content": "Ahoy!"},
]
print(model.chat(messages))
```

**Native ArcLM models** do not have a HF chat template; messages are flattened to `role: content` lines ending with `assistant:`.

**CLI chat** uses the same path:

```bash
arclm chat --model Qwen/Qwen3-0.6B --system-prompt "Be concise."
```

### Save a loaded model

```python
from arclm.inference import save_loaded_model, ModelSaveConfig

save_loaded_model(model, "out/export", save_config=ModelSaveConfig(save_mode="auto", overwrite=True))
```

---

## 12. PEFT (LoRA / QLoRA)

**Package:** `arclm.peft` · **Torch:** required · QLoRA needs `[qlora]`

### LoRA

```python
from arclm.peft import LoRAConfig, apply_lora, merge_lora, get_lora_state_dict

apply_lora(model, LoRAConfig(r=8, alpha=16, dropout=0.05, target_modules=["attn"]))
# ... train ...
state = get_lora_state_dict(model)
merge_lora(model)          # fold adapters into base weights
```

### QLoRA

```python
from arclm.peft import QLoRAConfig, prepare_model_for_qlora, load_quantized_model

model = load_quantized_model("model-id", config=QLoRAConfig(load_in_4bit=True, quant_type="nf4"))
prepare_model_for_qlora(model)
```

### Adapter artifacts

```python
from arclm.peft import save_adapter_artifact, load_adapter_artifact, inspect_adapter_artifact

save_adapter_artifact(model, "adapters/run1")
info = inspect_adapter_artifact("adapters/run1")
model = load_adapter_artifact(base_model, "adapters/run1")
```

---

## 13. Experiment tracking

**Package:** `arclm.tracking` · **Torch:** optional

Local run manifests, JSONL events, reproducibility metadata — no cloud.

```python
from arclm.tracking import create_run, RunConfig, load_run, compare_runs, set_reproducible_seed

set_reproducible_seed(42)

run = create_run(
    name="baseline",
    config={"embed_dim": 64, "lr": 1e-3},
    root="runs",
)
run.log_metrics({"loss": 2.3}, step=1)
run.log_event("checkpoint_saved", {"path": "models/x.pth"})
run.finish(status="completed")

loaded = load_run(run.run_id)
comparison = compare_runs([run.run_id, other_run_id])
```

Status transitions: `created` → `running` → `completed` / `failed` / `interrupted`.

---

## 14. Hyperparameter search

**Package:** `arclm.search` · **Torch:** not required for the search config layer

```python
from arclm.search import create_search, SearchSpace, ChoiceParameter, IntegerParameter

space = SearchSpace(
    learning_rate=ChoiceParameter([1e-4, 1e-3, 1e-2]),
    embed_dim=IntegerParameter(32, 128, step=32),
)

search = create_search(
    space=space,
    objective="min:val_loss",
    strategy="grid",           # or "random"
    base_training_config={...},
    root="searches",
)
best = search.run(trial_fn, max_trials=9)
print(best.effective_config, best.objective_value)
```

Persistence: each trial is a JSONL event stream with fingerprints; reload with `load_search`, compare with `compare_trials`.

---

## 15. Agents

**Package:** `arclm.agents` · **Torch:** not required (bring your own model callable)

Bounded, provider-independent tool-calling runtime with permissions and traces.

```python
from arclm.agents import Agent, AgentRunner, tool, ToolRegistry

@tool
def add(a: int, b: int) -> int:
    """Add two integers."""
    return a + b

@tool(side_effect="network")
def fetch_url(url: str) -> str:
    """Fetch a URL (requires approval)."""
    ...

registry = ToolRegistry([add, fetch_url])
agent = Agent(model_adapter=my_adapter, tools=registry, config=AgentConfig(max_steps=5))
result = agent.run("What is 2+3? Then fetch example.com")
print(result.messages, result.trace)
```

Built-in tools: document readers (markdown/HTML/text), math/JSON utilities, `SafeWebReader` (blocks private hosts). Approvals: auto-deny for side-effecting tools unless an approval handler allows them. Speech-to-text: Whisper integration via `agents-audio`.

Deep dive: [docs/agent-runtime.md](agent-runtime.md).

---

## 16. Security

**Package:** `arclm.security` · **Torch:** not required · **Deps:** `cryptography` via `[security]`

```python
from arclm.security import (
    encrypt_bytes, decrypt_bytes, encrypt_json, decrypt_json,
    derive_key_argon2id, InMemoryKeyProvider, PasswordKeyProvider,
    sign_manifest, verify_manifest, redact_text,
    resolve_under_root, security_status, audit,
)

# Symmetric encryption (AEAD)
key = derive_key_argon2id(password="correct horse", salt=salt)
blob = encrypt_bytes(b"payload", key=key)
plain = decrypt_bytes(blob, key=key)

# Key providers
provider = InMemoryKeyProvider()
provider.enable()

# Integrity
signature = sign_manifest(manifest_dict, key=key)
verify_manifest(manifest_dict, signature, key=key)

# Redaction & paths
safe = redact_text("api_key=sk-1234567890")           # → api_key=***REDACTED***
safe_path = resolve_under_root(root, user_input)       # path-traversal safe

print(security_status())
```

Encrypted artifact store:

```python
from arclm.security import EncryptedArtifactStore, SecureArtifactLoader

store = EncryptedArtifactStore(root="vault", key_provider=provider)
store.save("checkpoint", payload_bytes)
data = SecureArtifactLoader(store).load("checkpoint")
```

Web hardening policies: CORS, CSRF, security headers, transport (`arclm.security.web`). Fail-closed: missing keys/deps raise, never silently skip.

CLI:

```bash
arclm security status --json
arclm security audit
```

---

## 17. Web Studio

**Package:** `arclm.web` · **Deps:** `[web]` (FastAPI + uvicorn + torch)

Local Studio backend for datasets, tokenizers, training jobs, evaluation, and generation. Companion Next.js frontend lives in `web/`.

```bash
python -m arclm web-api --host 127.0.0.1 --port 8765
# or
arclm web-api
```

Python factory:

```python
from arclm.web import WebConfig, create_app

config = WebConfig(host="127.0.0.1", port=8765, expose_docs=True)
app = create_app(config)   # FastAPI instance; run with uvicorn
```

Workspace state (projects, datasets, runs) persists as JSON under a local workspace folder. Training runs in a background thread with cooperative cancellation.

---

## 18. CLI reference

Installed entry point: `arclm` (also `python -m arclm`).

| Command | Purpose | Needs torch? |
|---|---|---|
| `arclm train` | Train from config/args | yes |
| `arclm eval` | Evaluate a checkpoint | yes |
| `arclm generate` | Sample from a checkpoint | yes |
| `arclm chat` | Interactive console chat | yes |
| `arclm doctor` | Runtime diagnostics | no |
| `arclm security status` | Security inventory + threat model | no |
| `arclm security audit` | Run local audit | no |
| `python -m arclm web-api` | Start Studio backend | web extra |

Examples:

```bash
arclm train --config config.yaml --data data.txt --output models/m.pth
arclm train --embed-dim 64 --num-blocks 2 --data data.txt --epochs 5
arclm eval --model models/m.pth --data test.txt --output metrics.json
arclm generate --model models/m.pth --prompt "hello" --length 50 --temperature 0.8
arclm chat --model Qwen/Qwen2.5-0.5B-Instruct --device cpu
arclm doctor --json
```

---

## 19. Pipeline inspection

**Package:** `arclm.inspection` · **Torch:** required

Trace one native generation step without dumping full tensors:

```python
from arclm.inspection import inspect_text

trace = inspect_text(model, tokenizer, "hello world", max_new_tokens=1)
print(trace.token_ids)
print(trace.logits_shape)
print(trace.selected_tokens)
print(trace.to_dict())   # JSON-safe metadata
```

Records: input text → tokens → ids → embeddings → forward → logits → selection → decode. Metadata-first (shapes, names, selected ids).

---

## 20. Optional dependencies

| Package / feature | Core | `train` | `web` | `hf` | `peft` | `qlora` | `security` |
|---|---|---|---|---|---|---|---|
| datasets, tokenizers, configs | ✓ | | | | | | |
| agents, logics, search, tracking | ✓ | | | | | | |
| security (basic) | ✓ | | | | | | crypto helpers* |
| models, training, inference | | ✓ | ✓ | ✓ | ✓ | ✓ | |
| evaluation | | ✓ | ✓ | ✓ | ✓ | ✓ | |
| FastAPI Studio | | | ✓ | | | | |
| transformers / accelerate / datasets | | | | ✓ | | ✓ | |
| peft LoRA | | | | ✓ | ✓ | | |
| bitsandbytes QLoRA | | | | | | ✓ | |
| cryptography | | | | | | | ✓ |

\* Some crypto backends require `cryptography`; install `[security]` for full coverage.

Python: 3.9+. Torch wheels: see [pytorch.org](https://pytorch.org).

---

## 21. Troubleshooting & FAQ

**`ModuleNotFoundError: No module named 'torch'` / `OptionalDependencyError`**  
You imported a training/model package without torch. Run `pip install "arclm[train]"`.

**`import arclm` is slow**  
It should not be — the root package is lazy. If a submodule is slow, you imported a torch-backed one; that cost is torch's import time.

**CUDA not available**  
Install a CUDA torch build from [pytorch.org](https://pytorch.org/get-started/), then set `device="cuda"` in config. Check with `arclm doctor`.

**Checkpoint rejected as incompatible**  
As of 2.0, a checkpoint with a missing/empty `config` dict is never compatible. Re-save with `save_training_checkpoint` / `Trainer.save` so config + tokenizer metadata are stored.

**SentencePiece build fails**  
Ensure `sentencepiece` is installed (it is a core dep). For custom symbols, pass `user_defined_symbols` via `Config`.

**Web Studio port in use**  
`python -m arclm web-api --port 8766`. Remote binding requires an explicit transport policy (security fail-closed).

**Agent tool not called**  
Side-effect tools need an approval handler or they are denied. Check `result.trace` and tool `SideEffectLevel`.

**Can I use ArcLM without any deep-learning dependency?**  
Yes. Core install covers data, tokenizers, agents, security, search, and tracking. Torch is only needed when you construct models or run training/inference.

**Do I need to type a chat template for HF models?**  
No. Modern HF tokenizers ship their own `chat_template`; `.chat()` uses it automatically. Only bare models without a template get the simple `user: … / assistant:` fallback. See [Chat & chat templates](#chat--chat-templates).

---

## 22. Migrating from 1.x

Full table: [docs/migration-1-to-2.md](migration-1-to-2.md). Highlights:

- `pip install arclm` no longer pulls torch → use `arclm[train]`
- Old flat imports (`arclm.trainer`, `arclm.sft`, …) removed → use subpackages
- `MiniGPT` → `ArcLM`
- `checkpoint_is_compatible_for_tuining` → `..._for_tuning`
- `create_config()` no longer seeds global torch RNG

---

## See also

- [README](../README.md) — short overview + feature tour
- [examples/](../examples/) — runnable examples by category
- [lab/](../lab/README.md) — build-the-framework curriculum
- [docs/agent-runtime.md](agent-runtime.md) — agents deep dive
- [docs/project-status.md](project-status.md) — support matrix
