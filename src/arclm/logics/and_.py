"""Logische AND voor propositional logic."""

from .sentence import Sentence


class And(Sentence):
    """Logische AND met een of meer conjuncties."""

    def __init__(self, *conjuncts):
        """Maakt een AND-zin van meerdere logische zinnen."""
        self.conjuncts = []

        for conjunct in conjuncts:
            Sentence.validate(conjunct)

            # Geneste AND-zinnen maken de formule onnodig lang.
            # Daarom trekken we ze hier plat.
            if isinstance(conjunct, And):
                self.conjuncts.extend(conjunct.conjuncts)
            else:
                self.conjuncts.append(conjunct)

    def __eq__(self, other):
        """Controleert of twee AND-zinnen dezelfde onderdelen hebben."""
        return (
            isinstance(other, And)
            and self.conjuncts == other.conjuncts
        )

    def __hash__(self):
        """Maakt AND-zinnen bruikbaar in sets en dicts."""
        return hash(
            (
                "and",
                tuple(hash(conjunct) for conjunct in self.conjuncts),
            )
        )

    def __repr__(self):
        """Geeft een debug-weergave van de AND-zin terug."""
        conjunctions = ", ".join(str(conjunct) for conjunct in self.conjuncts)
        return f"And({conjunctions})"

    def add(self, conjunct):
        """Voegt een extra conjunctie toe."""
        Sentence.validate(conjunct)
        self.conjuncts.append(conjunct)

    def evaluate(self, model):
        """Geeft True terug als alle conjuncties True zijn."""
        return all(conjunct.evaluate(model) for conjunct in self.conjuncts)

    def formula(self):
        """Geeft de formuletekst van de AND-zin terug."""
        if not self.conjuncts:
            return "TRUE"

        if len(self.conjuncts) == 1:
            return self.conjuncts[0].formula()

        return " AND ".join(
            Sentence.parenthesize(conjunct.formula())
            for conjunct in self.conjuncts
        )

    def symbols(self):
        """Geeft alle symbolen uit de conjuncties terug."""
        if not self.conjuncts:
            return set()

        return set.union(
            *[conjunct.symbols() for conjunct in self.conjuncts]
        )
