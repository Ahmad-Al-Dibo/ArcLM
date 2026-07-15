# Logic Hulpmiddelen

`arclm.logics` is een kleine module voor simpele kennisregels.

Deze module is niet bedoeld als grote theorem prover. Hij is handig voor kleine voorbeelden, checks en uitleg rond regels zoals:

```text
als er data is, dan kan training starten
```

## Snel Voorbeeld

```python
from arclm.logics import KnowledgeBase, create_symbols

symbols = create_symbols("has_data", "can_train")
has_data = symbols["has_data"]
can_train = symbols["can_train"]

knowledge = KnowledgeBase(
    has_data,
    has_data.implies(can_train),
)

print(knowledge.ask(can_train))
```

## Kortere Syntax

Je kunt logische zinnen ook kort schrijven:

```python
from arclm.logics import KnowledgeBase, Symbol

clean = Symbol("clean_data")
tokens = Symbol("has_tokens")
ready = Symbol("ready")

knowledge = KnowledgeBase(
    clean,
    tokens,
    (clean & tokens).implies(ready),
)

assert knowledge.ask(ready)
```

## Later Kennis Toevoegen

Je hoeft niet alle kennis meteen bij het maken mee te geven. Je kunt later nieuwe feiten of regels toevoegen:

```python
from arclm.logics import KnowledgeBase, Symbol

clean = Symbol("clean")
tokens = Symbol("tokens")
ready = Symbol("ready")

knowledge = KnowledgeBase(
    (clean & tokens).implies(ready),
)

knowledge.add(clean)
knowledge.add(tokens)

print(knowledge.ask(ready))
```

`add()` en `tell()` doen hetzelfde. Gebruik `add()` als je gewone data toevoegt, en `tell()` als je de logic-term mooier vindt.

## Kennis Aanpassen Of Verwijderen

Je kunt later ook kennis verwijderen of vervangen:

```python
from arclm.logics import KnowledgeBase, Symbol

clean = Symbol("clean")
reviewed = Symbol("reviewed")
ready = Symbol("ready")

old_rule = clean.implies(ready)
new_rule = (clean & reviewed).implies(ready)

knowledge = KnowledgeBase(clean, old_rule)

knowledge.update(old_rule, new_rule)
knowledge.add(reviewed)

print(knowledge.ask(ready))
```

Verwijderen kan ook:

```python
knowledge.delete(clean)
```

Je kunt ook checken of een regel bestaat en de hele base opschonen:

```python
if knowledge.has(new_rule):
    knowledge.clear()
```

Gebruik:

- `add(sentence)` om kennis toe te voegen
- `has(sentence)` of `sentence in knowledge` om kennis te controleren
- `delete(sentence)` of `remove(sentence)` om kennis te verwijderen
- `discard(sentence)` als verwijderen stil mag falen
- `update(old_sentence, new_sentence)` om een regel te vervangen
- `replace(old_sentence, new_sentence)` als alias voor `update()`
- `clear()` om alles te verwijderen
- `reset(*sentences)` om alles te vervangen door nieuwe kennis
- `to_list()` om alle regels als gewone lijst terug te krijgen
- `copy()` om een nieuwe knowledge base met dezelfde regels te maken

## Uitleg Krijgen

```python
result = knowledge.explain(ready)

print(result.answer)
print(result.symbols)
print(result.knowledge)
```

`explain()` geeft geen lang bewijs terug. Het geeft bewust alleen een klein resultaat dat makkelijk te lezen is.

## Professioneel AI Voorbeeld

Je kunt de logic helpers ook gebruiken om een AI workflow te controleren.

Voorbeeld: je hebt een extern model en wilt weten of het klaar is voor private fine-tuning en release.

```python
from arclm.logics import KnowledgeBase, create_symbols

symbols = create_symbols(
    "external_model",
    "model_card_available",
    "license_allows_training",
    "tokenizer_loaded",
    "dataset_loaded",
    "dataset_clean",
    "no_pii",
    "dataset_deduplicated",
    "gpu_memory_ok",
    "sft_config_ready",
    "baseline_saved",
    "metrics_pass",
    "safety_pass",
    "model_allowed",
    "data_ready",
    "can_start_sft",
    "can_run_training",
    "ready_for_private_release",
)

knowledge = KnowledgeBase(
    (
        symbols["external_model"]
        & symbols["model_card_available"]
        & symbols["license_allows_training"]
    ).implies(symbols["model_allowed"]),
    (
        symbols["dataset_loaded"]
        & symbols["dataset_clean"]
        & symbols["no_pii"]
        & symbols["dataset_deduplicated"]
    ).implies(symbols["data_ready"]),
    (
        symbols["model_allowed"]
        & symbols["tokenizer_loaded"]
        & symbols["data_ready"]
        & symbols["gpu_memory_ok"]
        & symbols["sft_config_ready"]
    ).implies(symbols["can_start_sft"]),
    (
        symbols["can_start_sft"]
        & symbols["baseline_saved"]
    ).implies(symbols["can_run_training"]),
    (
        symbols["can_run_training"]
        & symbols["metrics_pass"]
        & symbols["safety_pass"]
    ).implies(symbols["ready_for_private_release"]),
)

knowledge.add_all([
    symbols["external_model"],
    symbols["model_card_available"],
    symbols["license_allows_training"],
    symbols["tokenizer_loaded"],
    symbols["dataset_loaded"],
    symbols["dataset_clean"],
    symbols["no_pii"],
    symbols["dataset_deduplicated"],
    symbols["gpu_memory_ok"],
    symbols["sft_config_ready"],
    symbols["baseline_saved"],
    symbols["metrics_pass"],
    symbols["safety_pass"],
])

result = knowledge.explain(symbols["ready_for_private_release"])

print(result.answer)
print(result.consistent)
```

Het volledige script staat in:

```bash
python examples/16_ai_knowledge_base.py
```

## Consistentie Controleren

Een professionele knowledge base moet ook kunnen controleren of je regels elkaar tegenspreken.

```python
from arclm.logics import KnowledgeBase, Symbol

clean = Symbol("clean")

knowledge = KnowledgeBase(clean, ~clean)

print(knowledge.is_consistent())
```

Als `is_consistent()` `False` geeft, moet je eerst je feiten of regels nakijken.

## Publieke API

Belangrijkste imports:

```python
from arclm.logics import (
    And,
    Biconditional,
    Implication,
    KnowledgeBase,
    Not,
    Or,
    Symbol,
    create_symbols,
    model_check,
)
```

## Wanneer Gebruiken?

Gebruik deze module voor:

- kleine kennisregels
- demos
- tests rond simpele beslisregels
- educatieve voorbeelden
- uitleg van conditionele regels
- AI workflow checks

Gebruik iets groters als je echte SAT solving, first-order logic of zware rule engines nodig hebt.
