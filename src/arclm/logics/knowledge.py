"""Kleine knowledge base voor propositional logic."""

from dataclasses import dataclass

from .and_ import And
from .model_check import model_check
from .sentence import Sentence
from .symbol import Symbol


@dataclass
class EntailmentResult:
    """Resultaat van een vraag aan een knowledge base."""

    query: str
    answer: bool
    symbols: list[str]
    knowledge: str
    consistent: bool = True

    def to_dict(self):
        """Geeft het resultaat terug als gewone dict."""
        return {
            "query": self.query,
            "answer": self.answer,
            "symbols": self.symbols,
            "knowledge": self.knowledge,
            "consistent": self.consistent,
        }


class KnowledgeBase:
    """Bewaart logische regels en beantwoordt simpele vragen."""

    def __init__(self, *sentences):
        """Maakt een knowledge base met optionele startregels."""
        self.sentences = []
        self.tell_all(sentences)

    def __len__(self):
        """Geeft het aantal regels terug."""
        return len(self.sentences)

    def __iter__(self):
        """Loopt door alle regels in de knowledge base."""
        return iter(self.sentences)

    def __contains__(self, sentence):
        """Geeft True als een regel of feit in de knowledge base staat."""
        Sentence.validate(sentence)
        return sentence in self.sentences

    def __repr__(self):
        """Geeft een korte debug-weergave terug."""
        return f"KnowledgeBase({self.formula()})"

    def tell(self, sentence):
        """Voegt een regel of feit toe."""
        Sentence.validate(sentence)
        self.sentences.append(sentence)
        return sentence

    def add(self, sentence):
        """Voegt een regel of feit toe.

        Dit is dezelfde actie als `tell()`, maar de naam voelt
        natuurlijker als je later extra kennis toevoegt.
        """
        return self.tell(sentence)

    def tell_all(self, sentences):
        """Voegt meerdere regels toe."""
        for sentence in sentences:
            self.tell(sentence)
        return self

    def add_all(self, sentences):
        """Voegt meerdere regels of feiten toe."""
        return self.tell_all(sentences)

    def has(self, sentence):
        """Controleert of een regel of feit bestaat."""
        return sentence in self

    def remove(self, sentence):
        """Verwijdert een regel of feit.

        Geeft een duidelijke fout als de regel niet bestaat.
        """
        Sentence.validate(sentence)

        try:
            self.sentences.remove(sentence)
        except ValueError as error:
            raise ValueError("Sentence is not in the knowledge base") from error

        return sentence

    def delete(self, sentence):
        """Verwijdert een regel of feit.

        Dit is dezelfde actie als `remove()`. De naam is handig
        voor developers die aan CRUD-achtige APIs gewend zijn.
        """
        return self.remove(sentence)

    def discard(self, sentence):
        """Verwijdert een regel als die bestaat.

        Als de regel niet bestaat, gebeurt er niets.
        """
        Sentence.validate(sentence)

        if sentence in self.sentences:
            self.sentences.remove(sentence)

        return sentence

    def update(self, old_sentence, new_sentence):
        """Vervangt een oude regel door een nieuwe regel."""
        Sentence.validate(old_sentence)
        Sentence.validate(new_sentence)

        try:
            index = self.sentences.index(old_sentence)
        except ValueError as error:
            raise ValueError("Sentence is not in the knowledge base") from error

        self.sentences[index] = new_sentence
        return new_sentence

    def replace(self, old_sentence, new_sentence):
        """Vervangt een regel.

        Dit is een leesbare alias voor `update()`.
        """
        return self.update(old_sentence, new_sentence)

    def clear(self):
        """Verwijdert alle kennis uit de knowledge base."""
        self.sentences.clear()
        return self

    def reset(self, *sentences):
        """Maakt de knowledge base leeg en vult optioneel nieuwe kennis."""
        self.clear()
        self.tell_all(sentences)
        return self

    def to_list(self):
        """Geeft een kopie van alle regels terug."""
        return list(self.sentences)

    def copy(self):
        """Maakt een nieuwe knowledge base met dezelfde regels."""
        return KnowledgeBase(*self.sentences)

    def as_sentence(self):
        """Geeft alle regels terug als een grote AND-zin."""
        return And(*self.sentences)

    def ask(self, query):
        """Geeft True als de knowledge base de query bewijst."""
        Sentence.validate(query)
        return model_check(self.as_sentence(), query)

    def explain(self, query):
        """Geeft een klein uitlegbaar resultaat voor een query."""
        answer = self.ask(query)
        return EntailmentResult(
            query=query.formula(),
            answer=answer,
            symbols=sorted(self.symbols()),
            knowledge=self.formula(),
            consistent=self.is_consistent(),
        )

    def formula(self):
        """Geeft alle kennis als formuletekst terug."""
        return self.as_sentence().formula()

    def symbols(self):
        """Geeft alle symbolen uit alle regels terug."""
        return self.as_sentence().symbols()

    def possible_models(self, limit=None):
        """Geeft modellen terug waarin alle kennis klopt."""
        models = []
        sentence = self.as_sentence()
        symbols = sorted(self.symbols())

        # We proberen alle True/False combinaties. Dit is prima voor
        # kleine kennisbanken, maar niet voor duizenden symbolen.
        for model in _all_models(symbols):
            if sentence.evaluate(model):
                models.append(model)

                if limit is not None and len(models) >= limit:
                    break

        return models

    def is_consistent(self):
        """Geeft True als minstens een model bij alle kennis past."""
        return bool(self.possible_models(limit=1))


def create_symbols(*names):
    """Maakt meerdere symbolen en geeft ze terug in een dict."""
    return {
        name: Symbol(name)
        for name in names
    }


def _all_models(symbols):
    """Maakt alle True/False combinaties voor een lijst symbolen."""
    if not symbols:
        yield {}
        return

    first = symbols[0]
    rest = symbols[1:]

    for model in _all_models(rest):
        with_true = model.copy()
        with_true[first] = True
        yield with_true

        with_false = model.copy()
        with_false[first] = False
        yield with_false
