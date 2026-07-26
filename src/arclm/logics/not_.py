"""Negatie voor propositional logic."""

from .sentence import Sentence


class Not(Sentence):
    """Logische NOT rond een operand."""

    def __init__(self, operand):
        """Maakt een negatie van een andere zin."""
        Sentence.validate(operand)
        self.operand = operand

    def __eq__(self, other):
        """Controleert of twee NOT-zinnen dezelfde operand hebben."""
        return (
            isinstance(other, Not)
            and self.operand == other.operand
        )

    def __hash__(self):
        """Maakt NOT-zinnen bruikbaar in sets en dicts."""
        return hash(("not", hash(self.operand)))

    def __repr__(self):
        """Geeft een debug-weergave van de negatie terug."""
        return f"Not({self.operand})"

    def evaluate(self, model):
        """Geeft de omgekeerde waarde van de operand terug."""
        return not self.operand.evaluate(model)

    def formula(self):
        """Geeft de formuletekst van de negatie terug."""
        return "NOT " + Sentence.parenthesize(self.operand.formula())

    def symbols(self):
        """Geeft alle symbolen uit de operand terug."""
        return self.operand.symbols()
