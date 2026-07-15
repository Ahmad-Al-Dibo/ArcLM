"""Logische biconditional voor propositional logic."""

from .sentence import Sentence


class Biconditional(Sentence):
    """Logische zin die waar is als beide kanten gelijk zijn."""

    def __init__(self, left, right):
        """Maakt een biconditional met een linker- en rechterkant."""
        Sentence.validate(left)
        Sentence.validate(right)

        self.left = left
        self.right = right

    def evaluate(self, model):
        """Evalueert of beide kanten dezelfde waarde hebben."""
        return (
            self.left.evaluate(model)
            == self.right.evaluate(model)
        )

    def formula(self):
        """Geeft de formuletekst van de biconditional terug."""
        left = Sentence.parenthesize(
            self.left.formula()
        )

        right = Sentence.parenthesize(
            self.right.formula()
        )

        return f"{left} <=> {right}"

    def symbols(self):
        """Geeft alle symbolen uit beide kanten terug."""
        return set.union(
            self.left.symbols(),
            self.right.symbols()
        )
