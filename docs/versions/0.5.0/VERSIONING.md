# ArcLM Versiebeheer

Dit bestand hoort bij het oude `0.5.0` archief.

De repository wordt nu gebruikt voor de speciale ArcLM-versie. Deze versie is private/niet-open-source en mag advanced onderdelen bevatten die niet in een gewone publieke release hoeven te zitten.

## Package Versie

De Python package-versie staat in:

```text
src/arclm/_version.py
```

Controleer de geinstalleerde versie met:

```bash
python -c "import arclm; print(arclm.__version__)"
```

## Documentatie Versie

De actuele documentatie staat in:

- `README.md`
- `docs/special-version.md`
- `docs/roadmap.md`
- `docs/data/`
- `docs/architecture/`

## Werkwijze

- Documenteer alleen wat echt geimplementeerd is.
- Zet geplande features duidelijk als `Gepland`.
- Houd oude imports werkend zolang dat praktisch is.
- Voeg bij hernoemde publieke API's een compatibility alias of wrapper toe.
- Schrijf publieke docs in eenvoudig Nederlands.

## Release Notitie

Deze speciale versie is niet bedoeld als open-source release. Publiceren, delen of opnieuw licenseren moet eerst bewust worden besloten door de eigenaar van het project.
