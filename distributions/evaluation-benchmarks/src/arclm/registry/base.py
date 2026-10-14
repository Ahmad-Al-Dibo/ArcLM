"""Kleine registry helper voor ArcLM onderdelen."""

from __future__ import annotations

from types import MappingProxyType


class Registry:
    """Koppelt namen aan objecten en controleert dubbele registraties."""

    def __init__(self, namespace: str):
        """Maakt een registry voor één namespace."""
        self.namespace = namespace
        self._items = {}
        self._aliases = {}

    def register(self, name: str, value, *, aliases: tuple[str, ...] = ()):
        """Registreert een waarde onder een naam en optionele aliassen."""
        key = self._normalize(name)
        if key in self._items or key in self._aliases:
            raise ValueError(f"{self.namespace} registry already contains {name!r}.")
        self._items[key] = value
        for alias in aliases:
            alias_key = self._normalize(alias)
            if alias_key in self._items or alias_key in self._aliases:
                raise ValueError(
                    f"{self.namespace} registry already contains alias {alias!r}."
                )
            self._aliases[alias_key] = key
        return value

    def get(self, name: str):
        """Haalt een geregistreerde waarde op via naam of alias."""
        key = self._normalize(name)
        key = self._aliases.get(key, key)
        try:
            return self._items[key]
        except KeyError as exc:
            available = ", ".join(sorted(self._items)) or "<empty>"
            raise KeyError(
                f"Unknown {self.namespace} {name!r}. Available: {available}."
            ) from exc

    def items(self):
        """Geeft een read-only view van de geregistreerde items terug."""
        return MappingProxyType(dict(self._items))

    @staticmethod
    def _normalize(name: str) -> str:
        """Normaliseert registry namen zodat lookup voorspelbaar is."""
        return name.lower().strip()
