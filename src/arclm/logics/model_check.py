"""Model checking voor propositional logic."""


def model_check(knowledge, query):
    """Controleert of kennis altijd de query waar maakt."""
    if hasattr(knowledge, "as_sentence"):
        knowledge = knowledge.as_sentence()

    def check_all(knowledge, query, symbols, model):
        """Probeert alle mogelijke waarden voor de symbolen."""
        if not symbols:
            if knowledge.evaluate(model):
                return query.evaluate(model)

            return True

        remaining = list(symbols)
        symbol = remaining.pop(0)

        model_true = model.copy()
        model_true[symbol] = True

        model_false = model.copy()
        model_false[symbol] = False

        return (
            check_all(knowledge, query, remaining, model_true)
            and check_all(knowledge, query, remaining, model_false)
        )

    symbols = sorted(
        set.union(
            knowledge.symbols(),
            query.symbols(),
        )
    )

    return check_all(knowledge, query, symbols, {})
