# 01 - System Shape

## Wat dit project werkelijk is

De repo lijkt op een Python package, maar gedraagt zich als een product-suite. De
belangrijkste productlijnen delen dezelfde `src/arclm` bron:

- Python library: root imports, training, datasets, tokenizers, inference,
  finetuning, checkpoints, evaluation, security en agents.
- CLI: `arclm.cli:main` is de pakket-entrypoint en mengt oude commando's met
  nieuwe workflow/data/config commando's.
- Local Studio backend: `src/arclm/web/app.py` bouwt een FastAPI app met veel
  routes, lokale workspace-opslag, training jobs, evaluation jobs en generation.
- Next.js frontend: `web/src` gebruikt een eigen typed API client en meerdere
  feature folders, niet een gegenereerde OpenAPI client.
- Distributies: `distributions/*` zijn snapshots/subsets van `src/arclm`; ze
  lopen niet automatisch mee met elke source-wijziging.
- Examples/lab/docs: voorbeelden en leer-challenges zijn tegelijk documentatie,
  smoke surface en regressie-indicator.

## De verborgen architectuurgrens

De meest foutgevoelige grens is niet package vs web. Het is:

`public API -> canonical domain module -> compatibility shim -> UI/CLI facade`

Voorbeelden:

- Nieuwe code moet liever naar `arclm.datasets`, `arclm.training`,
  `arclm.finetuning`, `arclm.config_schema` of `arclm.web.workspace` wijzen dan
  naar oude shims zoals `arclm.data` en `arclm.config`.
- Root imports in `src/arclm/__init__.py` zijn lazy en bedoeld voor ergonomie,
  niet als plaats voor businesslogica.
- CLI handlers zijn dunne facades, behalve legacy `train/eval/generate`, die
  nog direct training en model-load gedrag bevatten.
- Web Studio valideert via Pydantic schemas en workspace methodes; de frontend
  vertrouwt op exacte responsevormen uit `web/src/lib/api/client.ts`.

## Businesslogica in een zin

ArcLM Special probeert lokale LLM-ontwikkeling bruikbaar en veilig te maken:
datasets inspecteren, tokenizers bouwen, native modellen configureren, tiny
training en SFT draaien, checkpoints/evaluaties/generaties bewaren, en dit alles
zonder browserpaden of ruwe binaire modeldata terug te geven.

## Wat je niet moet aannemen

- Dat `src/arclm/config.py` de enige configbron is. Dat bestand is een legacy
  shim; de recente typed workflow-config zit in `src/arclm/config_schema.py`.
- Dat alle packages in `distributions/*` actueel zijn nadat `src/arclm` is
  aangepast. Rebuilds zijn apart.
- Dat de web UI stateless is. De backend schrijft persistent naar `workspace`.
- Dat externe Hugging Face modellen volledig gevalideerd zijn. De capability
  matrix claimt voor sommige externe modellen alleen boundary compatibility.
- Dat streaming overal streaming blijft. Diverse analyzers materialiseren alsnog
  records in lijsten voor dedupe/splits/rapportage.

## Snel orienteren in de repo

- Public import surface: `src/arclm/__init__.py`
- CLI surface: `src/arclm/cli.py`
- Old training facade: `src/arclm/training/pipeline.py`
- New Trainer core: `src/arclm/training/trainer.py`
- SFT businesslogica: `src/arclm/finetuning/workflow.py`
- Web API factory: `src/arclm/web/app.py`
- Studio state/storage: `src/arclm/web/workspace.py`
- Studio background training: `src/arclm/web/studio_training.py`
- Studio evaluation/generation/checkpoint orchestration: `src/arclm/web/studio3.py`
- Typed config/workflow: `src/arclm/config_schema.py`, `src/arclm/workflow.py`
- Distribution builder: `tools/build_arclm_distributions.py`

## Architectuurregel voor nieuw werk

Begin features in de canonicale domain module. Publiceer ze pas daarna via:

1. domain `__init__.py`;
2. root lazy exports, als het echt public API moet worden;
3. CLI of Web API facade;
4. frontend API client;
5. distributie-build, als de feature in een distributie thuishoort.

