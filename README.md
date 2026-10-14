# ArcLM

**A compact language-model toolkit you can actually read.**

ArcLM covers the full local LLM workflow — data → tokenize → train → checkpoint → evaluate → generate → inspect — with a light core install and optional PyTorch for model work.

```bash
pip install arclm            # ~50 MB: data, tokenizers, agents, security, search
pip install "arclm[train]"   # + torch: models, training, inference, evaluation
```

- **Light by default** — core has no PyTorch; train only when you need to
- **Native-first** — tiny GPT-style model in pure PyTorch, no serving stack required
- **Educational** — small modules, clear APIs, inspectable pipeline traces
- **Safe defaults** — security helpers, bounded agent runtime, trusted checkpoint loading

Full documentation: **[docs/guide.md](docs/guide.md)** · Migrating from 1.x: **[docs/migration-1-to-2.md](docs/migration-1-to-2.md)**

---

## 30-second quickstart

#### Train a tiny model on a few sentences (requires `arclm[train]`):

Install the package and run the following in a Python shell:
```md
# run this after `pip install arclm`
pip install "arclm[train]"
```

then run:

```python
from arclm.configs import create_config
from arclm.training import train_model

config = create_config(embed_dim=32, block_size=16, num_blocks=1, num_epochs=3)
result = train_model(
    mode="pre_training",
    data="data.txt",          # plain text file
    output="models/tiny.pth",
    config=config,
)
print("final loss:", result.history["train_losses"][-1])
```

Generate from the checkpoint:

```python
from arclm.inference import load_model

model = load_model("models/tiny.pth")
print(model.predict("the future of", max_new_tokens=20))
```

## Feature tour

Every area in one snippet — details in the [guide](docs/guide.md).

<details>
<summary><b>Datasets</b> — load, validate, clean, dedupe</summary>

```python
from arclm.datasets import load_dataset, validate_records, deduplicate

records = load_dataset([{"text": "ArcLM loads local records."}])
issues = validate_records(records)
clean, report = deduplicate(records)
```
</details>

<details>
<summary><b>Tokenizers</b> — word-level and SentencePiece</summary>

```python
from arclm.tokenizers import Tokenizer, AutoTokenizer

tok = Tokenizer(max_vocab=512)
tok.build("arc lm trains tiny models")
ids = tok.encode_text("arc lm")

# or from a config
tok2 = AutoTokenizer.from_config(config)  # uses config.tokenizer_type
```
</details>

<details>
<summary><b>Models</b> — native ArcLM GPT</summary>

```python
from arclm.models import ArcLM, AutoModel

model = ArcLM(vocab_size=512, embed_dim=64, block_size=32, num_blocks=2)
# or
model = AutoModel.from_config(config)
```
</details>

<details>
<summary><b>Training</b> — Trainer + callbacks</summary>

```python
from arclm.training import Trainer, TrainingConfig

trainer = Trainer(model=model, config=TrainingConfig(epochs=5, batch_size=8))
history = trainer.train_dataset(train_loader, val_loader=val_loader)
```
</details>

<details>
<summary><b>Fine-tuning / SFT</b></summary>

```python
from arclm.finetuning import train_sft

result = train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="sft.jsonl",   # {"messages": [...]} or prompt/completion
    output_dir="out/sft",
    backend="huggingface",
)
```
</details>

<details>
<summary><b>Inference & chat</b> — native + Hugging Face</summary>

```python
from arclm.inference import load_model, load_any_model

# Native ArcLM checkpoint
model = load_model("models/tiny.pth")
print(model.predict("the future is", max_new_tokens=20))

# Any Hugging Face model — uses the model's own chat template
hf = load_any_model("Qwen/Qwen3-0.6B", device="cpu")
reply = hf.chat([
    {"role": "system", "content": "Be concise."},
    {"role": "user", "content": "What is an LLM?"},
])
```
</details>

<details>
<summary><b>Checkpoints</b> — safe load, smart adapt</summary>

```python
from arclm.checkpoints import SmartLoader, safe_load_training_checkpoint, atomic_save_checkpoint

ckpt = safe_load_training_checkpoint("models/tiny.pth")
plan = SmartLoader("path/to/weights").plan()
```
</details>

<details>
<summary><b>Evaluation</b> — metrics + diagnostics</summary>

```python
from arclm.evaluation import Evaluator, Accuracy, Perplexity, predict_top_k

report = Evaluator(model, metrics=[Accuracy(), Perplexity()]).evaluate(loader)
top = predict_top_k(model, tokenizer, "machine learning", k=5)
```
</details>

<details>
<summary><b>PEFT / LoRA</b></summary>

```python
from arclm.peft import LoRAConfig, apply_lora, merge_lora

apply_lora(model, LoRAConfig(r=8, alpha=16, target_modules=["attn"]))
# ... train ...
merge_lora(model)
```
</details>

<details>
<summary><b>Agents</b> — bounded tool-calling runtime</summary>

```python
from arclm.agents import Agent, tool

@tool
def add(a: int, b: int) -> int:
    """Add two integers."""
    return a + b

agent = Agent(model=my_model_adapter, tools=[add])
result = agent.run("What is 2 + 3?")
```
</details>

<details>
<summary><b>Security</b> — encrypt, sign, redact</summary>

```python
from arclm.security import encrypt_bytes, decrypt_bytes, redact_text, security_status

blob = encrypt_bytes(b"secret", key=key)
plain = decrypt_bytes(blob, key=key)
print(security_status())
```
</details>

<details>
<summary><b>Search & tracking</b></summary>

```python
from arclm.tracking import create_run, set_reproducible_seed
from arclm.search import create_search

set_reproducible_seed(42)
run = create_run(name="baseline", config={...})
search = create_search(space={...}, objective="min_loss")
```
</details>

## CLI

```bash
arclm train --config config.yaml --data data.txt --output model.pth
arclm eval --model model.pth --data test.txt
arclm generate --model model.pth --prompt "hello"
arclm chat --model Qwen/Qwen2.5-0.5B-Instruct
arclm doctor                  # runtime diagnostics (no torch needed)
arclm security status
python -m arclm web-api       # local Studio backend
```

## Optional extras

| Extra | Adds | Install |
|---|---|---|
| `train` | PyTorch (models, training, inference) | `arclm[train]` |
| `web` | FastAPI Studio + torch | `arclm[web]` |
| `hf` | transformers, accelerate, datasets, peft | `arclm[hf]` |
| `peft` | torch + peft (LoRA) | `arclm[peft]` |
| `qlora` | torch + transformers + bitsandbytes | `arclm[qlora]` |
| `security` | cryptography | `arclm[security]` |
| `all` | train + web + hf + peft + security | `arclm[all]` |

CPU-only torch: `pip install torch --index-url https://download.pytorch.org/whl/cpu` first.

## Learn more

| Resource | What |
|---|---|
| **[docs/guide.md](docs/guide.md)** | Complete framework guide — every subpackage with examples |
| [docs/migration-1-to-2.md](docs/migration-1-to-2.md) | Upgrading from 1.x |
| [docs/agent-runtime.md](docs/agent-runtime.md) | Agent runtime deep dive |
| [examples/](examples/) | Runnable examples, `python examples/run_examples.py run-verified` |
| [lab/](lab/README.md) | Hands-on curriculum: build the framework yourself |
| [docs/project-status.md](docs/project-status.md) | Support matrix |

## License

Apache-2.0 · Author: Ahmad Al Dibo
