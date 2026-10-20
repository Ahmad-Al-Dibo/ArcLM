# Speaker notes — ArcLM presentation

## Files

| File | Language | Structure |
|---|---|---|
| `presentation/index.html` | English | Topic-based deck (~18 slides) |
| `presentation/arabic.html` | **Arabic (RTL)** | **Step-by-step live walkthrough** (18 slides) |

Open in a browser → **F** fullscreen. English: **← →**. Arabic deck: **←** = next (RTL).

## Timing plan (~40 minutes)

| Block | Min | Slides |
|---|---|---|
| Intro + problem + who | 0–5 | Title, agenda, problem, audience, can/cannot |
| Inside the core | 5–12 | Package map, deep dives, lazy loading |
| Live examples (8) | 12–28 | Tokenizer, data+security, model+doctor, HF, training, agent, SentencePiece, checkpoints/eval |
| Deeper topics | 28–34 | SFT overview, architecture paths, comparison, roadmap |
| GPU + Blocks + honesty | 34–38 | GPU training, Blocks, ecosystem, CI honesty |
| Q&A | 38–40 | Links up; discussion |

### Demo options

| Demo | Time | Needs |
|---|---|---|
| A. Tokenizer + redact (light) | ~10s | `pip install arclm` |
| B. Agent calculator | ~5s | light |
| C. tiny-gpt2 HF load | ~40s | `[hf]` + network |
| D. Training smoke | ~30s | `[train]` |

Prefer **A** always; add **C** only if network is reliable.

### Arabic deck

`presentation/arabic.html` — same content, RTL, step badges (الخطوة N).
Keyboard: **←** next, **→** prev (mirrored for RTL).

### Demo option for examples 1–2 (light, no network)

```bash
pip install arclm
python -c "
from arclm.tokenizers import Tokenizer
from arclm.security import redact_sensitive_text
t=Tokenizer(max_vocab=64); t.build('arc lm trains tiny models on local text')
print(t.encode_text('arc lm trains'), t.get_vocab_size())
print(redact_sensitive_text('api_key=sk-test-123'))
"
```

Expected: `[2, 3, 4] 11` and `api_key=[REDACTED]`.

### GPU slide talking points

1. Install CUDA torch wheel **first**, then `arclm[train]`.
2. `arclm doctor` is the shared health check.
3. `device="auto"` friendly; `"cuda"` fails loud if missing.
4. Multi-GPU = experimental contracts — do not oversell.
5. No GPU in the room? Everything demoed runs on CPU.

## Demo checklist (pick ONE for slide 9)

### A. HF model (needs network + `arclm[hf]`)
```bash
pip install "arclm[hf]"
python -c "from arclm.inference import load_any_model; m=load_any_model('sshleifer/tiny-gpt2', device='cpu'); print(m.predict('Hello', max_new_tokens=8))"
```
Say: fixture model → nonsense text on purpose; proves the API path.

### B. Agent tool (no network, light install)
```bash
python examples/10_agents_tools/01_custom_tool_agent.py
```

### C. Security redaction (no network)
```python
from arclm.security import redact_sensitive_text
print(redact_sensitive_text("api_key=sk-test-1234567890"))
```

## Likely questions from senior engineers

**Why not just use Hugging Face?**  
HF is the ecosystem for pretrained models. ArcLM complements it: light teaching toolkit + optional HF loading. Not a replacement for transformers as a model zoo.

**Is the native model competitive?**  
No. It is a teaching GPT (~thousands of params). Production quality comes from loading real models or training with real data/compute.

**Production readiness?**  
Apache-2.0, CI on 3.9–3.14, security helpers fail-closed. Still Beta (4) on PyPI — honest status.

**Multi-GB models / Arabic NLP?**  
ArcLM loads standard HF causal LMs. Arabic-specific models depend on tokenizer/chat-template compatibility — test per model. Contribution welcome.

**Windows + Linux?**  
Developed and CI-tested on both (GitHub Actions Linux + local Windows).

## Etiquette for the room

- English slides are normal for engineering talks in the region; keep tone humble and technical.
- Offer to share the repo link and PyPI name on a slide or chat.
- If bandwidth is limited, emphasize: light install works offline after download; verified examples need no GPU.

## Backup

- Print to PDF: press **P** in the deck.
- If browser fails: open `presentation/index.html` from a USB stick (single file, no server).
