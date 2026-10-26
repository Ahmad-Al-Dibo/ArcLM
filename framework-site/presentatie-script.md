# Presentatiescript — ArcLM via framework-site

Gebruik `framework-site/` als **levende presentatie**. Open:

```bash
cd framework-site
python -m http.server 8000
# http://127.0.0.1:8000/
```

Standaard is **Engels**. Klik **NL** rechtsboven voor Nederlandse chrome/koppen.

**Volgorde:** loop de sidebar af van boven naar beneden (~20–25 min).

---

## Voorbereiding (2 min vóór de start)

| Stap | Doe |
|---|---|
| 1 | Open `http://127.0.0.1:8000/` |
| 2 | Optional: **NL** knop aanzetten |
| 3 | Terminal klaar voor live demo (venv met `arclm` + `[train]`) |
| 4 | Vertel het publiek: “We lopen de documentatie door zoals een reader dat zou doen” |

---

## 1. Introduction (`index.html`) — 1,5 min

**Op het scherm:** titel + “What ArcLM does”.

**Zeg ongeveer:**

> Dit is ArcLM — een Python toolkit voor lokaal taalmodel-werk: data, tokenizers, optionele training, Hugging Face inferentie, agents en beveiliging.
>
> Kernpunt: **de installatie is licht**. `pip install arclm` haalt alleen numpy en sentencepiece op — ongeveer 50 MB. PyTorch is een extra, geen verplichting.
>
> ArcLM is geen ChatGPT-concurrent. Het is een **leesbaar** gereedschapskistje om LLM-pipelines te begrijpen en te bouwen, ook zonder GPU.

**Wijs aan:** bullet “What it is not” — benadruk eerlijkheid.

---

## 2. Motivation & design (`philosophy.html`) — 2 min

**Zeg:**

> Waarom bestaat dit? Omdat “even een API proberen” vaak honderden megabytes trekt, en documentatie vaak een GPU veronderstelt.
>
> Vijf ontwerpkeuzes:
> 1. **Licht** — torch optioneel, met duidelijke foutmelding als het ontbreekt.
> 2. **Leesbaar** — geen black-box trainer van 10.000 regels.
> 3. **Eerlijke grenzen** — de native model is educatief, dat staat er ook bij.
> 4. **Security fail-closed** — mist een sleutel? Fout, niet stilletjes overslaan.
> 5. **Blocks** — dezelfde bron, kleinere editions.

---

## 3. Getting started (`getting-started.html`) — 2 min

**Op het scherm:** install-code.

**Zeg:**

> Drie paden:
> - Core: tokenizer + data + agents + security, geen torch.
> - `[train]`: native model + training.
> - `[hf]`: Hugging Face modellen laden.
>
> Live (als terminal klaar is):

```bash
python -c "import arclm; print(arclm.get_version())"
```

> Verwacht `2.0.0`. Daarna doctor:

```bash
arclm doctor
```

> Doctor werkt **zonder** torch — dat is bewust.

---

## 4. Core concepts (`concepts.html`) — 2 min

**Zeg:**

> Vier begrippen voordat je code leest:
> - **Record**: een gewoon dict, meestal met `"text"`.
> - **Config vs TrainingConfig**: twee objecten met verschillende rollen.
> - **Tokenizer**: word-level of SentencePiece; geen automatische lowercase.
> - **Optional torch**: `import arclm` laadt geen torch; `from arclm.models import ArcLM` wel — of een duidelijke fout.
>
> Wijs op de concept-map onderaan de pagina.

---

## 5. Architecture (`architecture.html`) — 2,5 min

**Op het scherm:** SVG-diagram.

**Zeg:**

> Links de **kern** — groen, geen torch. Rechts de **training stack** — blauw, torch verplicht.
>
> De streeplijn is de belangrijkste grens: het root-package is **lazy**. Eerste attribute-access laadt alleen die module.
>
> Regels die je niet moet breken:
> - Geen torch-import in lichte pakketten.
> - Agents importeren `SecurityPolicy` uit een submodule, niet het hele security-pakket.
> - Blocks worden **gegenereerd**, niet handmatig aangepast.

---

## 6. How it works (`workflows.html`) — 2 min

**Zeg:**

> Zes complete workflows, elk met echte API’s:
> A Data · B Native train · C HF load · D SFT · E Agent · F Security · G Tracking.
>
> Voor een demo kies ik nu **A + E** (kern, geen download).

---

## 7–11. Capabilities (5 pagina’s) — 4 min totaal

Loop snel door; **diepte op één demo**:

| Pagina | Zeg in 1 zin |
|---|---|
| Data & tokenizers | “Validate + dedupe voor trainen; tokenizers inspectable.” |
| Models & training | “Native ArcLM is een lesmodel; Trainer + checkpoints; GPU optional.” |
| Inference & eval | “HF load via één API; chat templates; metrics eerlijk labelen.” |
| Agents & security | “Typed tools, bounded loop; redactie voor logs.” |
| Platform | “CLI, tracking, Blocks, Studio, examples-suite.” |

### Live demo (agents) — op **Agents & security**

Terminal:

```bash
python examples/10_agents_tools/01_custom_tool_agent.py
```

**Zeg:**

> Zie: een tool `add_numbers` met type-hints. De runner is bounded. Geen API-key nodig voor dit voorbeeld. Output is JSON met de tool-call.

Eventueel second demo (security):

```bash
python -c "from arclm.security import redact_sensitive_text; print(redact_sensitive_text('api_key=sk-test-123'))"
```

---

## 12. Examples (`examples.html`) — 1,5 min

**Zeg:**

> Beginner tot advanced. Alles in `examples/` in de repo; `run_examples.py run-verified` draait offline op CPU.
>
> Voor researchers: map **13_research_extension** — subcllassen van `BaseTrainer`, `BasePipeline`, callbacks, zonder `import torch` in je eigen code.

---

## 13. Developer workflows (`audiences.html`) — 1 min

**Zeg:**

> Drie routes: app-developer (publieke API’s), researcher (tracking + search + inspection), contributor (CODEBASE_GUIDE + tests + light-import contract).

---

## 14. Positioning (`positioning.html`) — 1,5 min

**Zeg:**

> ArcLM vervangt Hugging Face niet. Het voegt een **lichte lokale laag** toe: data, agents, security, en een klein leesbaar model.
>
> Grote trainingsframeworks blijven beter voor multi-node productie. Wij claimen geen betere benchmarks — alleen een andere afweging.

---

## 15. Status & limits (`status.html`) — 1,5 min

**Zeg — eerlijk:**

> Wat werkt: kern, tokenizer, data, agents, security, tracking, native smoke-train, HF op tiny-gpt2, CLI, Blocks, PyPI 2.0.0.
>
> Experimenteel: multi-GPU, QLoRA.
>
> Niet het doel: ChatGPT-kwaliteit van het native model; productie multi-node.

---

## 16. Future roadmap (`roadmap.html`) — 1,5 min

**Zeg:**

> Labels: Implemented, In progress, Planned, Proposed — **geen data-beloftes**.
>
> Near-term: CI groen, documentatie-artikelen, chat-template test op een instruct-model.
>
> Medium: RAG-bouwblokken (voorgesteld), Arabic-vriendelijke voorbeelden, Blocks-installatie.
>
> Grootste risico’s: vindbaarheid (verwarring met `arclm`), en niet overdrijven van experimentele features.

---

## Afsluiting (1 min)

**Zeg:**

> Samenvatting: licht installeren, eerlijk over grenzen, uitbreidbaar via publieke contracts.
>
> Links: `pip install arclm` · `pypi.org/project/arclm` · `github.com/Ahmad-Al-Dibo/ArcLM`.
>
> Vragen?

Laat `index.html` of `status.html` open staan.

---

## Demo-checklist (optioneel, 1 keuze vóór de meeting)

| Demo | Tijd | Nodig | Commando |
|---|---|---|---|
| Versie + doctor | 10s | core | `python -c "import arclm; print(arclm.get_version())"` |
| Redactie | 5s | core | `redact_sensitive_text(...)` |
| Agent tool | 5s | core | `examples/10_agents_tools/01_custom_tool_agent.py` |
| Research trainer | 10s | `[train]` | `examples/13_research_extension/01_custom_trainer.py` |
| HF tiny-gpt2 | 40s | `[hf]` + net | alleen bij stabiel netwerk |

**Aanbeveling:** Redactie + Agent (altijd), HF alleen als netwerk zeker is.

---

## Timingsoverzicht

| Onderdeel | Minuten |
|---|---|
| Intro + why | 3,5 |
| Start + concepts | 4 |
| Architecture + workflows | 4,5 |
| Capabilities + demo | 5,5 |
| Examples + audiences | 2,5 |
| Positioning + status + roadmap | 4,5 |
| Afsluiting + vragen | 1–5 |
| **Totaal** | **~20–28 min** |

---

## Tips voor de spreker

1. **Vertel, lees niet voor** — de site is de hand-out.
2. **Eén live demo** is genoeg; niet alle code hardop typen.
3. Engelse body-tekst is prima technisch Engels; spreek Nederlands eromheen.
4. Als iemand `arclm` verwart met `arcllm`: “twee L’s is een ander package; onze is `arclm` met één L.”
5. Bij twijfel over een feature: verwijs naar **Status & limits** — dat bouwt vertrouwen.
