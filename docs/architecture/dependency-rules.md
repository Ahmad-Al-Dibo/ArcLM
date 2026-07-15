# Dependency Regels

Deze regels houden ArcLM simpel en begrijpelijk.

## Basisregel

Lagere domeinen mogen niet afhankelijk zijn van hogere domeinen.

Goed:

```text
training -> datasets
training -> models
inference -> models
evaluation -> inference
```

Niet goed:

```text
datasets -> training
tokenizers -> training
models -> dashboards
```

## Datasets

`arclm.datasets` mag gebruiken:

- standaard Python modules
- ArcLM exceptions
- kleine tokenizer interfaces waar nodig
- optionele dataset dependencies via lazy imports

`arclm.datasets` mag niet afhankelijk zijn van:

- trainers
- CLI commands
- dashboards
- cloud providers
- deployment code

## Optionele Dependencies

Optionele dependencies mogen `import arclm` niet kapotmaken. Gebruik lazy imports en duidelijke fouten.

Voorbeeld:

```text
WebDataset support requires the optional webdataset dependency.
```

## Speciale Versie

Omdat dit de speciale versie is, mogen advanced onderdelen erbij komen. Maar ze moeten nog steeds netjes geisoleerd blijven. Een dashboard mag bijvoorbeeld datasets gebruiken, maar datasets mogen geen dashboard importeren.
