# ArcLM Special Version Senior Handoff

Deze map is geschreven alsof een senior software-architect het project overdraagt
aan een ervaren ontwikkelaar. De bedoeling is niet om de README te herhalen. De
documenten hieronder leggen vooral vast wat je normaal pas ontdekt na dagen of
weken door de code te bewegen.

## Leesvolgorde

1. [01-system-shape.md](01-system-shape.md)  
   Wat dit project werkelijk is, welke producten in dezelfde repo zitten, en
   waar de grenzen niet vanzelf zichtbaar zijn.

2. [02-python-core-boundaries.md](02-python-core-boundaries.md)  
   De belangrijkste Python-package grenzen, publieke API, importstrategie en
   compatibiliteitslaag.

3. [03-data-config-workflow.md](03-data-config-workflow.md)  
   De twee config-werelden, datasetlagen, cache, fingerprints en workflow runner.

4. [04-training-finetuning-checkpoints.md](04-training-finetuning-checkpoints.md)  
   Training, SFT, tokenizer-aannames, checkpoint formats en resume-risico's.

5. [05-web-studio-runtime.md](05-web-studio-runtime.md)  
   FastAPI backend, Next.js frontend, lokale workspace-opslag, jobs en API-
   contracten.

6. [06-security-and-risk-register.md](06-security-and-risk-register.md)  
   Verborgen veiligheidsgrenzen, risico's, technische schuld en release-blokkers.

7. [07-feature-and-bug-recipes.md](07-feature-and-bug-recipes.md)  
   De snelste veilige paden om features te bouwen of bugs te fixen.

8. [08-test-and-release-map.md](08-test-and-release-map.md)  
   Welke tests welke laag bewaken, wat langzaam of optioneel is, en waar release-
   packaging kan afwijken van source.

9. [09-open-source-sync-notes.md](09-open-source-sync-notes.md)  
   Wat recent vanuit de Open Source variant naar Special is gebracht en welke
   integratie-aannames daarbij belangrijk zijn.

## Belangrijkste mentale model

ArcLM Special Version is geen enkelvoudige library. Het is tegelijk:

- een compact PyTorch training package;
- een lokale ML Studio met FastAPI backend en Next.js frontend;
- een checkpoint/artifact lifecycle systeem;
- een agent/security experimentlaag;
- een documentatie-, distributie- en voorbeeldgenerator;
- sinds de recente sync ook een productie-achtig data/config/workflow pakket.

De veiligste manier van werken is daarom altijd: kies eerst de laag die je wijzigt,
zoek het canonicale pad in die laag, en wijzig pas daarna de compatibiliteitsshims.

