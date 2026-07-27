"""Symbolen voor propositional logic."""

from .sentence import Sentence
from .exceptions import EvaluationException


class Symbol(Sentence):
    """Een enkel logisch symbool, zoals P of Q."""

    def __init__(self, name):
        """Maakt een symbool met een naam."""
        self.name = name

    def __eq__(self, other):
        """Controleert of twee symbolen dezelfde naam hebben."""
        return isinstance(other, Symbol) and self.name == other.name

    def __hash__(self):
        """Maakt symbolen bruikbaar in sets en dicts."""
        return hash(("symbol", self.name))

    def __repr__(self):
        """Geeft de naam van het symbool terug voor debugging."""
        return self.name

    def evaluate(self, model):
        """Haalt de waarde van dit symbool uit het model."""
        try:
            return bool(model[self.name])
        except KeyError:
            raise EvaluationException(
                f"variable {self.name} not in model"
            )

    def formula(self):
        """Geeft de formuletekst van dit symbool terug."""
        return self.name

    def symbols(self):
        """Geeft dit ene symbool terug als set."""
        return {self.name}
