"""Basisclasses voor simpele propositional logic zinnen."""


class Sentence:
    """Basis class voor logische zinnen."""

    def __and__(self, other):
        """Maakt snel een AND met de `&` operator."""
        from .and_ import And

        return And(self, other)

    def __or__(self, other):
        """Maakt snel een OR met de `|` operator."""
        from .or_ import Or

        return Or(self, other)

    def __invert__(self):
        """Maakt snel een NOT met de `~` operator."""
        from .not_ import Not

        return Not(self)

    def implies(self, other):
        """Maakt een implicatie: als deze zin waar is, dan de andere."""
        from .implication import Implication

        return Implication(self, other)

    def iff(self, other):
        """Maakt een als-en-alleen-als relatie tussen twee zinnen."""
        from .biconditional import Biconditional

        return Biconditional(self, other)

    def evaluate(self, model):
        """Evalueert de zin met waarden uit een model."""
        raise Exception("nothing to evaluate")

    def formula(self):
        """Geeft de formule als tekst terug."""
        return ""

    def symbols(self):
        """Geeft alle symbolen terug die in de zin voorkomen."""
        return set()

    @classmethod
    def validate(cls, sentence):
        """Controleert of een waarde een logische zin is."""
        if not isinstance(sentence, Sentence):
            raise TypeError("must be a logical sentence")

    @classmethod
    def parenthesize(cls, text):
        """Zet haakjes om een formule als dat nodig is."""

        def atomic(value):
            """Controleert of een formule uit een enkel symbool bestaat."""
            return value.replace("_", "").isalnum()

        def balanced(value):
            """Controleert of haakjes in balans zijn."""
            count = 0

            for char in value:
                if char == "(":
                    count += 1
                elif char == ")":
                    if count <= 0:
                        return False
                    count -= 1

            return count == 0

        if (
            not text
            or atomic(text)
            or (
                text[0] == "("
                and text[-1] == ")"
                and balanced(text[1:-1])
            )
        ):
            return text

        return f"({text})"
