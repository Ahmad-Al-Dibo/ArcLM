# Presentatiescript — ArcLM (Nederlands)

Gebruik **`presentation/ArcLM-Nederlands.pptx`** als dia-deck, of de website
`framework-site/` als levende presentatie. Dit script is de spreektekst.

Open de PowerPoint of:

```bash
cd framework-site
python -m http.server 8000
# http://127.0.0.1:8000/
```

**Taal:** uitsluitend Nederlands spreken. Code en package-namen blijven Engels.

---

## Voorbereiding (2 min)

| Stap | Actie |
|---|---|
| 1 | Open `presentation/ArcLM-Nederlands.pptx` of de website |
| 2 | Terminal klaar met venv: `arclm` + `[train]` |
| 3 | Eventueel: `python examples/14_translator_from_scratch/main.py` warmdraaien |
| 4 | Zeg tegen het publiek: “We lopen de toolkit door zoals een lezer dat zou doen” |

---

## Dia 1 — Titel (~1 min)

> Dit is ArcLM: een compacte Python-toolkit voor lokaal taalmodel-werk.
> Data, tokenizers, optionele training, Hugging Face, agents en beveiliging.
>
> Te vinden als `pip install arclm` op PyPI — versie 2.0.0, Apache-2.0.

---

## Dia 2 — Wat doet ArcLM? (~1,5 min)

> Negen concrete dingen, geen marketing.
> De belangrijkste: datasets opschonen, tokenizen, een mini-model trainen, een HF-model laden, SFT, evalueren, agents met tools, beveiliging, en lokale experiment-tracking.
>
> Alles werkt lokaal; niets verplicht naar de cloud.

---

## Dia 3 — Problemen (~1,5 min)

> Vier pijnpunten die we expliciet aanpakken.
> Ten eerste: “even een API proberen” mag niet honderden megabytes kosten.
> Ten tweede: documentatie mag geen GPU veronderstellen op dag één.
> Ten derde: je moet kunnen zien hoe data, tokens, model en eval aan elkaar hangen.
> Ten vierde: onderwijs en app-ontwikkeling in dezelfde toolkit.

---

## Dia 4 — Doelgroep (~1 min)

> Drie groepen: docenten en studenten op een laptop, app-ontwikkelaars die agents of HF willen gebruiken, en onderzoekers die een lichte toolkit willen inbedden.
>
> En wat we **niet** zijn: geen ChatGPT-concurrent.

---

## Dia 5 — Ontwerpprincipes (~1,5 min)

> Vijf regels.
> Eén: `import arclm` laadt geen torch.
> Twee: bron is leesbaar — geen black-box trainer van tienduizend regels.
> Drie: eerlijke grenzen — het native model is educatief, dat staat erbij.
> Vier: security faalt gesloten — ontbreekt iets? Een duidelijke fout, geen stille overslaan.
> Vijf: de voorbeeldsuite draait offline op CPU.

---

## Dia 6 — Installatie (~1,5 min)

> Drie niveaus.
> Eén: `pip install arclm` — alleen numpy en sentencepiece, ongeveer 50 MB.
> Twee: `arclm[train]` — voegt PyTorch toe voor training en native modellen.
> Drie: `arclm[hf]` — voor Hugging Face modellen.
>
> Let op: de package-naam is **arclm** met één L. Er bestaat een ander package `arclm` met twee L’s — dat is een ander project.

---

## Dia 7 — Eerste resultaat (~2 min, optioneel live)

> Dit is de snelste succeservaring: een tokenizer en geheimen-verbergen, zonder GPU.
>
> (Terminal, als voorbereid:)

```bash
python -c "import arclm; print(arclm.get_version())"
```

> Verwacht `2.0.0`. Daarna kun je doorgaan met de voorbeelden.

---

## Dia 8 — Echte projecten (~2,5 min)

> Twee vertaalprojecten in `examples/`.
>
> Links: **van nul** — een mini vertaler getraind op twintig zinnenparen. Alleen publieke ArcLM-API’s. De loss daalt van 3,9 naar 1,4 in seconden. De vertalingen zijn zwak — dat is eerlijk gelabeld; het is een lespipeline.
>
> Rechts: **open source model** — een instruct-model laden via `load_any_model` en `.chat()`. Eerste run downloadt gewichten. ArcLM laadt causale modellen, geen MarianMT-seq2seq — dat staat in de README.

---

## Dia 9 — Wat het niet is (~1 min)

> Vier grenzen, hardop.
> Geen competitieve chat-LLM. Geen HF-vervanging. Geen multi-node productieplatform. Geen kwaliteitsgarantie per Hub-model.
>
> Dit soort eerlijkheid is waarom engineers een toolkit vertrouwen.

---

## Dia 10 — Positionering (~1 min)

> ArcLM is geen concurrent van Hugging Face of grote trainingsframeworks.
> Het is een **lichte lokale laag**: data, agents, security, en een klein leesbaar model.
> We beloven geen benchmarks die we niet gemeten hebben.

---

## Dia 11 — Realistisch resultaat (~1 min)

> Wat kun je na deze talk?
> Installeren in seconden. Data valideren. Een HF-model laden op CPU. Een smoketest trainen. Een agent met tools. Redactie in je logging.

---

## Dia 12 — Vragen (~1–5 min)

> Samenvatting in één zin: licht installeren, eerlijk over grenzen, uitbreidbaar via publieke contracts.
>
> Links: `pip install arclm` · `pypi.org/project/arclm` · `github.com/Ahmad-Al-Dibo/ArcLM`.
>
> Vragen?

---

## Timingsoverzicht (~22–28 min)

| Dia | Onderwerp | Minuten |
|---|---|---|
| 1 | Titel | 1 |
| 2 | Wat doet het | 1,5 |
| 3 | Problemen | 1,5 |
| 4 | Doelgroep | 1 |
| 5 | Principes | 1,5 |
| 6 | Installatie | 1,5 |
| 7 | Eerste resultaat | 2 |
| 8 | Echte projecten | 2,5 |
| 9 | Grenzen | 1 |
| 10 | Positionering | 1 |
| 11 | Realistisch | 1 |
| 12 | Vragen | 1–5 |

---

## Demo-checklist (kies er maximaal 1–2)

| Demo | Tijd | Nodig | Commando |
|---|---|---|---|
| Versie + doctor | 10s | kern | `python -c "import arclm; print(arclm.get_version())"` |
| Redactie | 5s | kern | `redact_sensitive_text(...)` |
| Agent-tool | 5s | kern | `python examples/10_agents_tools/01_custom_tool_agent.py` |
| Vertaler van nul | 15s | `[train]` | `python examples/14_translator_from_scratch/main.py` |
| HF vertaler | 40s+ | `[hf]` + net | alleen bij stabiel netwerk |

**Aanbeveling:** redactie + agent-tool (altijd). HF alleen als het netwerk zeker is.

---

## Spreek-tips

1. **Vertel, lees niet voor** — de dia’s zijn de hand-out.
2. **Eén live demo** is genoeg.
3. Package-namen blijven Engels: ArcLM, tokenizer, checkpoint.
4. Verwarrende package-naam: **arclm** (één L) vs **arclm** (twee L’s = ander project).
5. Bij twijgel over een feature: verwijs naar **Wat het niet is** — dat bouwt vertrouwen.
