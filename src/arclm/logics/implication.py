"""Logische implicatie voor propositional logic."""

from .sentence import Sentence


class Implication(Sentence):
    """Logische zin van de vorm als A dan B."""

    def __init__(
        self,
        antecedent,
        consequent
    ):
        """Maakt een implicatie met antecedent en consequent."""
        Sentence.validate(antecedent)
        Sentence.validate(consequent)

        self.antecedent = antecedent
        self.consequent = consequent

    def evaluate(self, model):
        """Evalueert de implicatie in een model."""
        return (
            not self.antecedent.evaluate(model)
            or self.consequent.evaluate(model)
        )

    def formula(self):
        """Geeft de formuletekst van de implicatie terug."""
        antecedent = Sentence.parenthesize(
            self.antecedent.formula()
        )

        consequent = Sentence.parenthesize(
            self.consequent.formula()
        )

        return f"{antecedent} => {consequent}"

    def symbols(self):
        """Geeft alle symbolen uit beide kanten terug."""
        return set.union(
            self.antecedent.symbols(),
            self.consequent.symbols()
        )
