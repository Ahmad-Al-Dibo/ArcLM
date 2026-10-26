"""Build a Dutch PowerPoint presentation for ArcLM."""

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt

# Colors
NAVY = RGBColor(0x0B, 0x10, 0x20)
BLUE = RGBColor(0x00, 0x66, 0xCC)
TEAL = RGBColor(0x3D, 0xD6, 0xC3)
DARK = RGBColor(0x22, 0x22, 0x22)
GRAY = RGBColor(0x55, 0x55, 0x55)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT = RGBColor(0xF4, 0xF7, 0xFB)
GREEN = RGBColor(0x1B, 0x5E, 0x20)
ORANGE = RGBColor(0xE6, 0x51, 0x00)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


def add_bg(slide, color=NAVY):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height  # rectangle
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    # send to back
    spTree = slide.shapes._spTree
    sp = shape._element
    spTree.remove(sp)
    spTree.insert(2, sp)


def add_text(slide, left, top, width, height, text, size=18, bold=False, color=DARK, align=PP_ALIGN.LEFT, font="Calibri"):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.font.name = font
    p.alignment = align
    return tf


def add_bullets(slide, left, top, width, height, items, size=16, color=DARK):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = "â€¢ " + item
        p.font.size = Pt(size)
        p.font.color.rgb = color
        p.font.name = "Calibri"
        p.space_after = Pt(8)
    return tf


def title_bar(slide, title, subtitle=None):
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(1.05))
    bar.fill.solid()
    bar.fill.fore_color.rgb = NAVY
    bar.line.fill.background()
    add_text(slide, 0.5, 0.22, 12, 0.6, title, size=28, bold=True, color=WHITE)
    if subtitle:
        add_text(slide, 0.5, 0.68, 12, 0.35, subtitle, size=13, color=RGBColor(0x9D, 0xB0, 0xD0))


def footer(slide, n, total):
    add_text(slide, 11.5, 7.05, 1.5, 0.35, f"{n} / {total}", size=11, color=GRAY, align=PP_ALIGN.RIGHT)
    add_text(slide, 0.5, 7.05, 4, 0.35, "ArcLM 2.0 Â· Apache-2.0", size=11, color=GRAY)


TOTAL = 12


# --- Slide 1: Titel ---
s = prs.slides.add_slide(BLANK)
add_bg(s, NAVY)
add_text(s, 0.8, 2.2, 11.5, 1.2, "ArcLM", size=54, bold=True, color=WHITE)
add_text(
    s, 0.8, 3.4, 11.5, 1.5,
    "Compacte Python-toolkit voor taalmodel-workflows:\ndata, tokenizers, optionele training, Hugging Face, agents en beveiliging",
    size=20, color=RGBColor(0x9D, 0xB0, 0xD0),
)
add_text(s, 0.8, 5.5, 11.5, 0.5, "pip install arclm   Â·   PyPI 2.0.0   Â·   Apache-2.0", size=16, color=TEAL)
add_text(s, 0.8, 6.2, 11.5, 0.4, "Python 3.9â€“3.14  Â·  Kern ~50 MB  Â·  PyTorch optioneel", size=14, color=GRAY)


# --- Slide 2: Wat doet ArcLM ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Wat doet ArcLM?", "Concrete mogelijkheden (geen marketing)")
add_bullets(s, 0.6, 1.4, 12, 5.5, [
    "Lokale tekst-datasets laden, valideren, opschonen en dedupliceren",
    "Tokenizen: word-level of SentencePiece",
    "Native mini-GPT trainen (optioneel PyTorch)",
    "Hugging Face causale modellen laden achter Ã©Ã©n interface",
    "Fine-tuning (SFT), optioneel met LoRA",
    "Evalueren: accuracy / loss / perplexity + rapportages",
    "Gebonden tool-calling agents zonder GPU",
    "Geheimen verbergen, artefacten versleutelen/ondertekenen, security-status",
    "Lokale experiment-run tracking (runs, metrics, seeds) â€” geen cloud",
], size=17)
footer(s, 2, TOTAL)


# --- Slide 3: Problemen ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Problemen die ArcLM oplost")
rows = [
    ("Probleem", "Antwoord van ArcLM"),
    ("Install voor â€˜even een API proberenâ€™ trekt honderden MB", "Kern = NumPy + SentencePiece; torch achter [train]"),
    ("Docs gaan uit van GPU + multi-GB downloads", "CPU-first voorbeelden; verified suite zonder netwerk/GPU"),
    ("Onduidelijk hoe data â†’ tokens â†’ model â†’ eval loopt", "Kleine leesbare pakketten; inspect_text traces"),
    ("Educatiecode en app-code in aparte werelden", "Zelfde package voor Lab-scripts en apps"),
]
table = s.shapes.add_table(len(rows), 2, Inches(0.5), Inches(1.4), Inches(12.3), Inches(4.8)).table
table.columns[0].width = Inches(5.5)
table.columns[1].width = Inches(6.8)
for r, (a, b) in enumerate(rows):
    for c, val in enumerate((a, b)):
        cell = table.cell(r, c)
        cell.text = val
        for p in cell.text_frame.paragraphs:
            p.font.size = Pt(13 if r else 14)
            p.font.bold = r == 0
            p.font.name = "Calibri"
            p.font.color.rgb = WHITE if r == 0 else DARK
        cell.fill.solid()
        cell.fill.fore_color.rgb = BLUE if r == 0 else (LIGHT if r % 2 else WHITE)
footer(s, 3, TOTAL)


# --- Slide 4: Publiek ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Voor wie is ArcLM?")
cards = [
    (0.5, "Docenten & studenten", ["Laptop, beperkte bandbreedte", "Geen GPU-cluster", "Verified examples offline op CPU"]),
    (4.7, "App-ontwikkelaars", ["HF-modellen laden", "Agents + tools zonder torch", "Security-helpers voor logs"]),
    (8.9, "Onderzoekers", ["Lichte toolkit inembedden", "Trainen alleen als nodig", "Blocks voor subset-install"]),
]
for x, title, items in cards:
    shape = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(1.6), Inches(3.8), Inches(3.8))
    shape.fill.solid()
    shape.fill.fore_color.rgb = LIGHT
    shape.line.color.rgb = RGBColor(0xDD, 0xDD, 0xDD)
    add_text(s, x + 0.2, 1.8, 3.4, 0.5, title, size=18, bold=True, color=BLUE)
    add_bullets(s, x + 0.2, 2.5, 3.4, 2.5, items, size=14)
add_text(s, 0.5, 5.8, 12, 0.6, "Niet de bedoeling: ChatGPT-concurrent, model-zoo, of multi-node productieplatform.", size=14, color=ORANGE)
footer(s, 4, TOTAL)


# --- Slide 5: Ontwerpprincipes ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Ontwerpprincipes")
add_bullets(s, 0.6, 1.5, 12, 5, [
    "Licht als default â€” import arclm laadt geen torch",
    "Leesbare bron â€” pakketten klein genoeg om te studeren; geen 10k-regels trainer als enige pad",
    "Eerlijke grenzen â€” native model is educatief; docs en voorbeelden zeggen dat ook",
    "Security fail-closed â€” ontbrekende sleutel/extra = duidelijke OptionalDependencyError",
    "Geverifieerde voorbeelden â€” maintained suite draait offline op CPU",
], size=18)
footer(s, 5, TOTAL)


# --- Slide 6: Installatie ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Installatie in drie niveaus")
add_text(s, 0.6, 1.4, 12, 0.4, "1 â€” Kern (geen PyTorch, ~50 MB)", size=18, bold=True, color=GREEN)
add_text(s, 0.8, 1.9, 11, 0.5, 'pip install arclm', size=16, font="Consolas")
add_text(s, 0.6, 2.7, 12, 0.4, "2 â€” Training-stack", size=18, bold=True, color=BLUE)
add_text(s, 0.8, 3.2, 11, 0.7, 'pip install "arclm[train]"', size=16, font="Consolas")
add_text(s, 0.6, 4.1, 12, 0.4, "3 â€” Hugging Face inferentie", size=18, bold=True, color=BLUE)
add_text(s, 0.8, 4.6, 11, 0.7, 'pip install "arclm[hf]"', size=16, font="Consolas")
add_text(s, 0.6, 5.6, 12, 0.8, "CPU-only torch eerst (optioneel):\npip install torch --index-url https://download.pytorch.org/whl/cpu", size=14, color=GRAY)
add_text(s, 0.6, 6.5, 12, 0.4, "Let op: package-naam is arclm (niet arclm met twee Lâ€™s)", size=13, color=ORANGE)
footer(s, 6, TOTAL)


# --- Slide 7: Eerste resultaat ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Eerste resultaat in seconden")
code = """from arclm.tokenizers import Tokenizer
from arclm.configs import create_config
from arclm.security import redact_sensitive_text

config = create_config(embed_dim=32, block_size=16, device="cpu")
tok = Tokenizer(max_vocab=64)
tok.build("arc lm trains tiny models on local text about language models")
print(tok.encode_text("arc lm trains"))  # [2, 3, 4]
print(redact_sensitive_text("api_key=sk-test-123"))
# api_key=[REDACTED]"""
box = s.shapes.add_textbox(Inches(0.5), Inches(1.4), Inches(12.3), Inches(4.5))
tf = box.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = code
p.font.size = Pt(15)
p.font.name = "Consolas"
p.font.color.rgb = DARK
add_text(s, 0.5, 6.2, 12, 0.5, "Geen GPU Â· geen download Â· geen torch in dit voorbeeld", size=14, color=GREEN, bold=True)
footer(s, 7, TOTAL)


# --- Slide 8: Mijn projecten ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Echte projecten in examples/", "Van nul en met open-source model")
# left card
shape = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(1.5), Inches(6), Inches(4.8))
shape.fill.solid()
shape.fill.fore_color.rgb = LIGHT
shape.line.color.rgb = RGBColor(0xDD, 0xDD, 0xDD)
add_text(s, 0.7, 1.7, 5.6, 0.4, "14_translator_from_scratch", size=18, bold=True, color=BLUE)
add_bullets(s, 0.7, 2.3, 5.6, 3.5, [
    "ENâ†’NL vertaler trainen vanaf nul",
    "Alleen arclm-publieke APIâ€™s (geen import torch)",
    "20 paarparen Â· loss 3.9 â†’ 1.4 in ~11s CPU",
    "Leerzaam, niet competitief met productie-NMT",
    "python examples/14_translator_from_scratch/main.py",
], size=14)
# right card
shape = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(1.5), Inches(6), Inches(4.8))
shape.fill.solid()
shape.fill.fore_color.rgb = LIGHT
shape.line.color.rgb = RGBColor(0xDD, 0xDD, 0xDD)
add_text(s, 7.0, 1.7, 5.6, 0.4, "14_translator_open_source", size=18, bold=True, color=BLUE)
add_bullets(s, 7.0, 2.3, 5.6, 3.5, [
    "Vertalen met open-source instruct-model",
    "load_any_model + .chat() / .predict()",
    "Standaard: SmolLM2-135M-Instruct",
    "Eerste run: download naar HF-cache",
    "pip install arclm[hf]  +  TRANSLATOR_MODEL=...",
], size=14)
footer(s, 8, TOTAL)


# --- Slide 9: Wat het niet is ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Wat ArcLM niet is", "Eerlijke grenzen bouwen vertrouwen op")
add_bullets(s, 0.6, 1.6, 12, 5, [
    "Geen competitieve algemene chat-LLM op zichzelf",
    "Geen vervanging van Hugging Face als model-hub-client",
    "Geen productie multi-node trainings- of servingplatform",
    "Geen garantie op kwaliteit voor elk Hub-model â€” compatibiliteit is per model",
], size=18, color=DARK)
add_text(s, 0.6, 5.5, 12, 0.8, "Het native model is een lesmodel (duizenden parameters), geen ChatGPT.", size=16, bold=True, color=ORANGE)
footer(s, 9, TOTAL)


# --- Slide 10: Verschil met alternatieven ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Positionering (zonder marketingclaims)")
add_bullets(s, 0.6, 1.5, 12, 5.2, [
    "vs Hugging Face alleen: ArcLM laadt HF-modellen Ã©n levert tokenizers, data-tools, mini-model, agents, security met lichte kern",
    "vs grote trainingsframeworks: geen productie multi-node stack; trainer is klein en leesbaar",
    "vs notebook-tutorials: versieerd PyPI-pakket, CLI, tests, CI, security-laag",
], size=16)
add_text(s, 0.6, 5.5, 12, 0.8, "Geen prestatie-benchmarks beloofd die niet gemeten zijn.", size=15, color=GRAY)
footer(s, 10, TOTAL)


# --- Slide 11: Realistisch resultaat ---
s = prs.slides.add_slide(BLANK)
title_bar(s, "Wat je realistisch kunt bereiken")
add_bullets(s, 0.6, 1.5, 12, 5, [
    "In seconden installeren en meteen data/tokenizen/valideren",
    "Een klein publiek HF-model laden en op CPU genereren",
    "Een mini-trainings-smoketest uitvoeren in seconden",
    "Een lokale agent bouwen met getypeerde tools (geen API-key in het voorbeeld)",
    "Redactie en ondertekende manifests integreren in je eigen logging",
], size=17)
footer(s, 11, TOTAL)


# --- Slide 12: Afsluiting ---
s = prs.slides.add_slide(BLANK)
add_bg(s, NAVY)
add_text(s, 0.8, 2.0, 11.5, 0.8, "Vragen?", size=40, bold=True, color=WHITE)
add_text(s, 0.8, 3.2, 11.5, 1.5,
    "Start licht. Laad een model wanneer je het nodig hebt.\nLees de bron wanneer je het wilt begrijpen.",
    size=20, color=RGBColor(0x9D, 0xB0, 0xD0),
)
add_text(s, 0.8, 5.0, 11.5, 0.5, "pip install arclm", size=18, color=TEAL, font="Consolas")
add_text(s, 0.8, 5.6, 11.5, 0.4, "pypi.org/project/arclm", size=15, color=WHITE)
add_text(s, 0.8, 6.1, 11.5, 0.4, "github.com/Ahmad-Al-Dibo/ArcLM", size=15, color=WHITE)

out = Path("presentation/ArcLM-Nederlands.pptx")
out.parent.mkdir(parents=True, exist_ok=True)
prs.save(out)
print("Saved", out, "slides", len(prs.slides))
