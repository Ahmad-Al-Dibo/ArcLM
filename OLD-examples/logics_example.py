"""Klein voorbeeld voor de ArcLM logic helpers."""

from arclm.logics import KnowledgeBase, Symbol


def main():
    """Laat de basis van de logic module zien."""
    clean = Symbol("clean_data")
    tokens = Symbol("has_tokens")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(
        clean,
        tokens,
        (clean & tokens).implies(ready),
    )

    print("Kennis:", knowledge.formula())
    print("Consistent:", knowledge.is_consistent())
    print("Ready:", knowledge.ask(ready))
    print("Uitleg:", knowledge.explain(ready).to_dict())


if __name__ == "__main__":
    main()
