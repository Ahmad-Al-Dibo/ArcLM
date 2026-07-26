"""Logische OR voor propositional logic."""

from .sentence import Sentence


class Or(Sentence):
    """Logische OR met een of meer disjuncties."""

    def __init__(self, *disjuncts):
        """Maakt een OR-zin van meerdere logische zinnen."""
        self.disjuncts = []

        for disjunct in disjuncts:
            Sentence.validate(disjunct)

            # Geneste OR-zinnen maken de formule onnodig lang.
            # Daarom trekken we ze hier plat.
            if isinstance(disjunct, Or):
                self.disjuncts.extend(disjunct.disjuncts)
            else:
                self.disjuncts.append(disjunct)

    def __eq__(self, other):
        """Controleert of twee OR-zinnen dezelfde onderdelen hebben."""
        return (
            isinstance(other, Or)
            and self.disjuncts == other.disjuncts
        )

    def __hash__(self):
        """Maakt OR-zinnen bruikbaar in sets en dicts."""
        return hash(
            (
                "or",
                tuple(hash(disjunct) for disjunct in self.disjuncts),
            )
        )

    def __repr__(self):
        """Geeft een debug-weergave van de OR-zin terug."""
        disjuncts = ", ".join(str(disjunct) for disjunct in self.disjuncts)
        return f"Or({disjuncts})"

    def evaluate(self, model):
        """Geeft True terug als minstens een disjunctie True is."""
        return any(disjunct.evaluate(model) for disjunct in self.disjuncts)

    def formula(self):
        """Geeft de formuletekst van de OR-zin terug."""
        if not self.disjuncts:
            return "FALSE"

        if len(self.disjuncts) == 1:
            return self.disjuncts[0].formula()

        return " OR ".join(
            Sentence.parenthesize(disjunct.formula())
            for disjunct in self.disjuncts
        )

    def symbols(self):
        """Geeft alle symbolen uit de disjuncties terug."""
        if not self.disjuncts:
            return set()

        return set.union(
            *[disjunct.symbols() for disjunct in self.disjuncts]
        )
