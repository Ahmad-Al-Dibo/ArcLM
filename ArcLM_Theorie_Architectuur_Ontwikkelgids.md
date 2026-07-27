# ArcLM — Theorie, Architectuur en Ontwikkelgids

> Een starterdocument voor developers die niet alleen ArcLM willen gebruiken, maar ook willen begrijpen **waarom** de library op deze manier is opgebouwd en **wat er technisch achter de onderdelen gebeurt**.

---

## 1. Waarom dit document bestaat

ArcLM groeit van een eenvoudige Python-library voor tekstmodellen naar een bredere toolkit voor:

- data voorbereiden;
- modellen bouwen en laden;
- modellen trainen en fine-tunen;
- modellen evalueren;
- inference uitvoeren;
- modellen optimaliseren;
- modellen serveren en deployen;
- experimenten volgen;
- later ook team- en enterprisefuncties aanbieden.

Als developer is het niet genoeg om alleen te weten welke functie je moet aanroepen. Je moet ook begrijpen:

- welke stap waarvoor dient;
- welke data door het systeem loopt;
- welke keuzes invloed hebben op snelheid, geheugen en kwaliteit;
- welke onderdelen afhankelijk zijn van elkaar;
- wanneer een eenvoudige oplossing genoeg is;
- wanneer een geavanceerde techniek echt nodig is.

Dit document geeft daarom een theoretische basis voor de huidige en geplande ArcLM-onderdelen.

---

## 2. Huidige status van ArcLM

Op basis van de huidige ontwikkeling bestaat ArcLM al uit een bruikbare basis voor tekstmodellen.

| Onderdeel | Status | Korte uitleg |
|---|---|---|
| Package-structuur | Geïmplementeerd | De library is verdeeld in duidelijke domeinen zoals datasets, training, inference en configs. |
| Tekstmodellen | Geïmplementeerd | De huidige focus ligt op text-only modellen. |
| Tokenizers | Geïmplementeerd | Tekst kan worden omgezet naar token-id’s en terug. |
| Data pipeline | Geïmplementeerd | Laden, schoonmaken, pipelines en deduplicatie hebben een eerste basis. |
| Training Core | Geïmplementeerd en getest | Single-device training, gradient accumulation, mixed precision, checkpoints, resume en callbacks. |
| Inference | Basis aanwezig | Modellen kunnen worden geladen en gebruikt om output te genereren. |
| Configs | Geïmplementeerd | Instellingen voor modellen, training en andere onderdelen. |
| Checkpoints | Geïmplementeerd | Training kan worden opgeslagen en hervat. |
| Basic Evaluation | Volgende fase | Een nette evaluator, metrics, accuracy en perplexity worden als aparte laag toegevoegd. |
| LoRA / PEFT / QLoRA | Gepland | Efficiënte fine-tuning zonder alle modelgewichten volledig te trainen. |
| Distributed training | Gepland | DDP, FSDP en multi-GPU training. |
| Serving en deployment | Gepland | REST API, OpenAI-compatible API, Docker, cloud en Kubernetes. |
| Enterprise | Later gepland | Teams, rollen, API keys, audit logs, billing en licenties. |

Belangrijk: een gepland onderdeel moet niet worden behandeld alsof het al werkt. ArcLM moet duidelijk onderscheid maken tussen:

- **geïmplementeerd**;
- **gedeeltelijk geïmplementeerd**;
- **in ontwikkeling**;
- **gepland**.

---

## 3. Het grote plaatje

Een volledige machine-learningworkflow ziet er ongeveer zo uit:

```text
Ruwe data
    ↓
Laden
    ↓
Schoonmaken
    ↓
Deduplicatie
    ↓
Tokenisatie
    ↓
Dataset splitsen
    ↓
Model bouwen of laden
    ↓
Training of fine-tuning
    ↓
Evaluatie
    ↓
Optimalisatie
    ↓
Inference
    ↓
Serving
    ↓
Deployment
    ↓
Monitoring
```

In ArcLM hoort elk blok bij een eigen domein. Daardoor blijft de code overzichtelijk en kunnen onderdelen later worden vervangen of uitgebreid.

Een goede library probeert niet alles in één grote class te stoppen. Het doel is dat een developer bijvoorbeeld:

- een eigen dataset loader kan schrijven;
- een eigen cleaner kan toevoegen;
- een eigen trainer kan erven van `BaseTrainer`;
- een eigen metric kan bouwen;
- een eigen modelarchitectuur kan registreren;
- een eigen deploymentbackend kan toevoegen.

---

# Deel I — Data en datasets

## 4. Wat is een dataset?

Een dataset is een verzameling voorbeelden waarmee een model leert of wordt getest.

Voor een taalmodel kan één item bijvoorbeeld zijn:

```json
{
  "text": "Amsterdam is de hoofdstad van Nederland."
}
```

Voor instruction tuning kan één item zijn:

```json
{
  "instruction": "Vertaal de zin naar het Engels.",
  "input": "Goedemorgen",
  "output": "Good morning"
}
```

Voor classificatie kan één item zijn:

```json
{
  "text": "Deze film was geweldig.",
  "label": 1
}
```

De dataset bepaalt voor een groot deel wat een model leert. Slechte data geeft meestal slechte resultaten, ook wanneer de trainer en architectuur goed zijn.

---

## 5. Dataset loading

Dataset loading betekent dat data uit een bron wordt gelezen en wordt omgezet naar een vorm die de rest van de library begrijpt.

Veelgebruikte bronnen zijn:

- JSON;
- JSONL;
- CSV;
- TXT;
- Python-lijsten;
- Hugging Face Datasets;
- PyTorch datasets;
- WebDataset-shards;
- later eventueel databases of cloud storage.

Een loader moet minstens drie dingen goed doen:

1. het formaat herkennen;
2. duidelijke fouten geven;
3. de originele data zo weinig mogelijk onverwacht veranderen.

Een simpele API kan zijn:

```python
dataset = load_dataset("data/train.jsonl")
```

Voor meer controle:

```python
loader = DatasetLoader(text_field="text")
dataset = loader.load("data/train.jsonl")
```

De functie is handig voor normaal gebruik. De class is handig wanneer instellingen of state nodig zijn.

---

## 6. Data pipelines

Een data pipeline voert meerdere stappen na elkaar uit.

Bijvoorbeeld:

```text
StripText
    ↓
NormalizeWhitespace
    ↓
RemoveEmptyText
    ↓
FilterByLength
    ↓
ExactDeduplicator
```

Het voordeel is dat iedere stap één duidelijke taak heeft.

```python
pipeline = DataPipeline([
    StripText("text"),
    NormalizeWhitespace("text"),
    RemoveEmptyText("text"),
])

dataset = pipeline.run(dataset)
```

Een goede eerste versie is gewoon sequentieel. Een ingewikkelde graph engine is pas nodig wanneer echte use-cases dat vragen.

### BaseDataStep

Een base class geeft developers een vast contract:

```python
class BaseDataStep(ABC):
    @abstractmethod
    def process(self, item):
        ...
```

Een stap kan:

- een aangepast item teruggeven;
- hetzelfde item teruggeven;
- `None` teruggeven om een item te verwijderen.

Dat maakt custom stappen eenvoudig.

---

## 7. Dataset cleaning

Cleaning verwijdert of repareert problemen in data.

Veelvoorkomende problemen:

- lege teksten;
- extra spaties;
- vreemde control characters;
- ontbrekende velden;
- extreem korte teksten;
- extreem lange teksten;
- kapotte encoding;
- HTML of ongewenste markup;
- verkeerde veldnamen.

Voorbeelden van cleaners:

- `StripText`
- `NormalizeWhitespace`
- `RemoveEmptyText`
- `RemoveControlCharacters`
- `FilterByLength`
- `SelectFields`
- `RenameFields`
- `DropFields`

Cleaning moet voorspelbaar zijn. Een cleaner mag niet stilletjes andere velden aanpassen.

---

## 8. Automatic deduplication

Deduplicatie verwijdert dubbele of bijna dubbele voorbeelden.

Waarom is dit belangrijk?

- Dubbele data kan bepaalde voorbeelden te zwaar laten meetellen.
- Het model kan specifieke teksten onthouden.
- Evaluatiedata kan per ongeluk ook in training voorkomen.
- Training kost onnodig meer tijd.

### Exacte deduplicatie

Twee voorbeelden zijn dubbel als het gekozen veld exact hetzelfde is.

```text
"Hello world"
"Hello world"
```

Dit is eenvoudig en snel.

### Hash-based deduplicatie

De tekst wordt eerst omgezet naar een hash, bijvoorbeeld SHA-256. Daarna worden hashes vergeleken.

Voordeel:

- minder geheugen nodig dan volledige teksten bewaren;
- snel vergelijken;
- makkelijk in manifests opslaan.

### Genormaliseerde deduplicatie

Voor het vergelijken wordt tekst eerst genormaliseerd:

```text
"Hello   world"
"hello world"
```

Mogelijke normalisatie:

- lowercase;
- whitespace normaliseren;
- punctuation verwijderen;
- Unicode normaliseren.

### Approximate deduplicatie

Later kunnen technieken worden toegevoegd zoals:

- MinHash;
- SimHash;
- n-gram similarity;
- embedding similarity.

Deze technieken vinden teksten die bijna hetzelfde zijn. Ze zijn krachtiger, maar ook complexer en duurder.

---

## 9. Data augmentation

Data augmentation maakt nieuwe trainingsvoorbeelden door bestaande voorbeelden gecontroleerd aan te passen.

Voor tekst kan dat bijvoorbeeld zijn:

- een prefix toevoegen;
- een suffix toevoegen;
- velden combineren;
- templates gebruiken;
- woorden vervangen;
- context soms weglaten;
- meerdere promptformaten maken.

Voorbeeld:

```python
TemplateAugmenter(
    template="Question: {question}\nAnswer: {answer}"
)
```

Augmentation moet niet zomaar willekeurige ruis toevoegen. Elke aanpassing moet passen bij het leerdoel.

Bij randomness moet een seed mogelijk zijn:

```python
seed=42
```

Zo blijven experimenten reproduceerbaar.

---

## 10. Streaming datasets

Een gewone dataset wordt vaak volledig in geheugen geladen. Dat werkt niet voor heel grote datasets.

Een streaming dataset leest voorbeelden pas wanneer ze nodig zijn.

```python
for item in dataset:
    ...
```

Voordelen:

- lage RAM-belasting;
- grote bestanden kunnen direct worden verwerkt;
- training kan beginnen voordat alles is geladen.

Beperkingen:

- vaak geen `len(dataset)`;
- meestal geen random access;
- global shuffle is moeilijker;
- sommige statistieken vragen meerdere passes;
- exacte globale deduplicatie kan extra opslag nodig hebben.

Een aparte `BaseStreamingDataset` is daarom beter dan streaming in dezelfde interface forceren als normale datasets.

---

## 11. WebDataset

WebDataset bewaart veel voorbeelden in tar-shards.

Bijvoorbeeld:

```text
shard-0000.tar
shard-0001.tar
shard-0002.tar
```

Een shard kan tekst, afbeeldingen, metadata of andere bestanden bevatten.

Voordelen:

- goed voor streaming;
- geschikt voor grote datasets;
- efficiënt bij training op meerdere workers;
- populair voor vision en multimodale data.

ArcLM moet WebDataset als optionele dependency behandelen. `import arclm` mag niet falen wanneer `webdataset` niet is geïnstalleerd.

---

## 12. Dataset versioning

Dataset versioning houdt bij welke versie van data bij een experiment is gebruikt.

Een manifest kan bevatten:

```json
{
  "dataset_id": "instruction-data",
  "version": "1.0.0",
  "num_examples": 25000,
  "source": "raw/instructions.jsonl",
  "parent_version": null,
  "steps": [
    "normalize_whitespace",
    "remove_empty",
    "exact_deduplication"
  ],
  "hash": "..."
}
```

Waarom is dit belangrijk?

- experimenten kunnen worden herhaald;
- veranderingen in data zijn zichtbaar;
- resultaten zijn beter te vergelijken;
- je weet welk model met welke data is getraind.

Een eenvoudige lokale versie-opslag is meestal genoeg als eerste stap. ArcLM hoeft niet direct DVC na te bouwen.

---

## 13. Dataset statistics

Statistieken helpen problemen vroeg te vinden.

Nuttige statistieken:

- aantal voorbeelden;
- beschikbare velden;
- ontbrekende velden;
- lege waarden;
- gemiddelde tekstlengte;
- minimum en maximum lengte;
- aantal duplicaten;
- geschat geheugengebruik;
- labelverdeling;
- verdeling per taal of bron.

Voorbeeld:

```python
stats = dataset_stats(dataset, text_field="text")
print(stats.avg_text_length)
```

Statistieken zijn niet alleen voor rapporten. Ze helpen ook beslissen:

- welke context length nodig is;
- welke samples moeten worden gefilterd;
- of de dataset scheef verdeeld is;
- hoeveel training ongeveer kost.

---

## 14. Token analysis

Modellen werken niet direct met woorden, maar met tokens.

Token analysis meet bijvoorbeeld:

- totaal aantal tokens;
- gemiddelde tokens per voorbeeld;
- maximale tokenlengte;
- percentage voorbeelden boven context length;
- lege tokenreeksen;
- gebruik van vocabulary;
- meest voorkomende tokens.

Voorbeeld:

```python
stats = analyze_tokens(
    dataset,
    tokenizer=tokenizer,
    text_field="text",
)
```

Dit is belangrijk omdat tekstlengte in karakters niet hetzelfde is als tokenlengte.

```text
"hello"      → mogelijk 1 token
"ongebruikelijkwoord" → mogelijk meerdere tokens
```

Voor grote datasets is sampling belangrijk. Anders kan analyse bijna even duur worden als training.

---

## 15. Synthetic data generation

Synthetic data is data die door een model, regelsysteem of generator wordt gemaakt.

Voorbeelden:

- instruction-response-paren;
- samenvattingen;
- vertalingen;
- codevragen;
- classificatievoorbeelden;
- edge cases.

Een goede interface is provider-onafhankelijk:

```python
class BaseSyntheticDataGenerator(ABC):
    @abstractmethod
    def generate(self, count: int):
        ...
```

Synthetic data moet daarna nog steeds worden:

- gevalideerd;
- schoongemaakt;
- gededupliceerd;
- geanalyseerd;
- eventueel door mensen gecontroleerd.

Synthetic data is geen automatische garantie op kwaliteit.

---

# Deel II — Tokenizers

## 16. Wat doet een tokenizer?

Een tokenizer zet tekst om naar token-id’s.

```text
"Hallo wereld"
    ↓
["Hallo", " wereld"]
    ↓
[15496, 1917]
```

Het model ontvangt getallen, geen tekst.

De tokenizer doet meestal:

1. tekst normaliseren;
2. tekst opsplitsen;
3. stukken koppelen aan vocabulary-id’s;
4. speciale tokens toevoegen;
5. truncation en padding toepassen.

---

## 17. Vocabulary

De vocabulary is de lijst van tokens die de tokenizer kent.

Voorbeeld:

```text
0 = <pad>
1 = <bos>
2 = <eos>
3 = hello
4 = world
```

Een kleine vocabulary:

- gebruikt soms meer tokens per zin;
- heeft minder embedding-parameters.

Een grote vocabulary:

- gebruikt soms minder tokens per zin;
- maakt embedding- en outputlagen groter.

Er is dus een trade-off tussen modelgrootte, taalondersteuning en tokenlengte.

---

## 18. Tokenization-algoritmen

### BPE

Byte Pair Encoding voegt vaak voorkomende combinaties samen.

### WordPiece

Lijkt op BPE, maar gebruikt een andere keuzeformule. Bekend van BERT.

### Unigram

Begint met veel mogelijke tokens en verwijdert geleidelijk minder nuttige tokens.

### Byte-level tokenization

Werkt op bytes en kan daardoor bijna elke tekst representeren zonder onbekende tokens.

ArcLM hoeft niet ieder algoritme zelf vanaf nul te implementeren. Het belangrijkste is een duidelijke interface en goede adapters.

---

## 19. Special tokens

Veelgebruikte speciale tokens:

- `<pad>` voor padding;
- `<bos>` voor begin van sequence;
- `<eos>` voor einde;
- `<unk>` voor onbekende tokens;
- `<mask>` voor masked language modeling.

Voor chatmodellen kunnen ook rollen worden gebruikt:

```text
<system>
<user>
<assistant>
```

De tokenizer en het model moeten dezelfde token-id’s en conventies gebruiken.

---

# Deel III — Modelarchitecturen

## 20. Transformerbasis

De meeste moderne taalmodellen gebruiken Transformers.

Een Transformerblok bevat meestal:

1. attention;
2. residual connection;
3. normalisatie;
4. feedforward network;
5. nog een residual connection.

Simpel weergegeven:

```text
Input
  ↓
Self-Attention
  ↓
Residual + Norm
  ↓
Feedforward
  ↓
Residual + Norm
  ↓
Output
```

---

## 21. Self-attention

Attention laat elk token kijken naar andere tokens in dezelfde sequence.

De kern bestaat uit:

- Query \(Q\)
- Key \(K\)
- Value \(V\)

De bekende formule is:

```text
Attention(Q, K, V) = softmax(QKᵀ / √d) V
```

Intuïtief:

- Query vraagt: “Waar zoek ik naar?”
- Key zegt: “Wat voor informatie bevat ik?”
- Value bevat: “Dit is de informatie die ik kan doorgeven.”

De softmax maakt scores tot gewichten.

---

## 22. Multi-head attention

In plaats van één attentionberekening gebruikt het model meerdere heads.

Elke head kan andere relaties leren, bijvoorbeeld:

- grammatica;
- lange-afstandsrelaties;
- onderwerp en werkwoord;
- verwijzingen;
- code-structuren.

De outputs van de heads worden samengevoegd.

---

## 23. Feedforward network

Na attention gaat ieder token door een klein neuraal netwerk.

Meestal:

```text
hidden_size
    ↓
grotere intermediate size
    ↓
activatiefunctie
    ↓
terug naar hidden_size
```

Bijvoorbeeld:

```text
4096 → 11008 → 4096
```

Dit deel bevat vaak een groot deel van de parameters.

---

## 24. Positional information

Attention zelf weet niet automatisch welk token eerst of later komt.

Daarom gebruikt een model positie-informatie, zoals:

- absolute positional embeddings;
- sinusoidal embeddings;
- RoPE;
- ALiBi.

LLaMA en veel moderne causal models gebruiken RoPE.

---

## 25. GPT-architectuur

GPT is decoder-only en voorspelt het volgende token.

```text
tokens vóór positie t
    ↓
voorspel token t
```

Het gebruikt causal masking: een token mag niet naar toekomstige tokens kijken.

Geschikt voor:

- tekstgeneratie;
- chat;
- codegeneratie;
- completion;
- instruction tuning.

---

## 26. LLaMA

LLaMA is ook decoder-only, maar gebruikt moderne keuzes zoals:

- RoPE;
- RMSNorm;
- SwiGLU;
- vaak grouped-query attention in latere varianten.

Het trainingsdoel blijft meestal next-token prediction.

---

## 27. Mistral

Mistral is eveneens decoder-only en legt extra nadruk op efficiënte attention.

Bekende ideeën zijn onder andere:

- sliding-window attention;
- grouped-query attention;
- efficiënt omgaan met context.

ArcLM moet architectuurspecifieke details loshouden van algemene trainer- en inferencecode.

---

## 28. Encoder-only modellen

BERT is een encoder-only model.

Het ziet meestal beide kanten van een token en is sterk voor:

- classificatie;
- embeddings;
- named entity recognition;
- extractieve taken.

Een veelgebruikt trainingsdoel is masked language modeling.

```text
"De kat zit op de [MASK]."
```

Het model voorspelt het gemaskeerde woord.

---

## 29. Encoder-decoder modellen

T5 gebruikt een encoder en decoder.

De encoder leest input. De decoder genereert output.

Geschikt voor:

- vertaling;
- samenvatting;
- vraag-antwoord;
- text-to-text taken.

---

## 30. Mixture of Experts

MoE bevat meerdere expert-netwerken, maar activeert per token slechts een deel.

Bijvoorbeeld:

```text
8 experts beschikbaar
2 experts actief per token
```

Voordeel:

- veel parameters;
- minder compute per token dan wanneer alle experts actief zijn.

Nadelen:

- routing is ingewikkeld;
- load balancing is nodig;
- distributed training wordt moeilijker;
- communicatie tussen apparaten kan duur zijn.

---

## 31. Vision Transformers

Een Vision Transformer splitst een afbeelding in patches.

```text
afbeelding
    ↓
patches
    ↓
patch embeddings
    ↓
Transformer
```

De patches spelen ongeveer dezelfde rol als tokens in tekst.

---

## 32. Multimodale modellen

Een multimodaal model verwerkt meerdere soorten input:

- tekst;
- afbeeldingen;
- audio;
- video.

Een veelgebruikte structuur is:

```text
Vision encoder
    ↓
projectielaag
    ↓
language model
```

De grootste uitdaging is niet alleen de architectuur, maar ook:

- data-alignment;
- token- en featureformaten;
- batching;
- loss-functies;
- geheugenverbruik.

---

## 33. Custom architecture builder

Een custom builder kan developers helpen lagen samen te stellen.

Maar dit moet niet veranderen in een te algemene no-code engine.

Een goede builder ondersteunt alleen duidelijke componenten:

- embedding;
- attention;
- feedforward;
- normalization;
- aantal lagen;
- hidden size;
- vocabulary size.

Voor unieke researcharchitecturen moet directe Python-code altijd mogelijk blijven.

---

# Deel IV — Training

## 34. Wat gebeurt tijdens training?

Per batch:

1. data wordt geladen;
2. input gaat door het model;
3. model maakt voorspellingen;
4. loss wordt berekend;
5. gradients worden berekend;
6. optimizer past gewichten aan;
7. scheduler past eventueel learning rate aan;
8. state en metrics worden bijgewerkt;
9. soms wordt een checkpoint opgeslagen.

---

## 35. Loss

Loss meet hoe fout de voorspelling is.

Voor causal language modeling wordt meestal cross-entropy gebruikt.

Simpel:

```text
lage loss = model voorspelt juiste tokens beter
hoge loss = model is onzeker of vaak fout
```

Loss is niet hetzelfde als algemene modelkwaliteit. Een model kan lagere loss hebben en toch slechtere antwoorden geven op een bepaalde taak.

---

## 36. Backpropagation

Backpropagation berekent hoe iedere parameter de loss beïnvloedt.

De gradient zegt ongeveer:

```text
Als deze parameter een klein beetje verandert,
hoe verandert de loss dan?
```

De optimizer gebruikt deze gradients om parameters bij te werken.

---

## 37. Optimizers

### SGD

Eenvoudige update op basis van gradients.

### Adam

Gebruikt bewegende gemiddelden van gradients en gekwadrateerde gradients.

### AdamW

Adam met weight decay op een nettere manier toegepast. Veelgebruikt bij Transformers.

Belangrijke instellingen:

- learning rate;
- betas;
- epsilon;
- weight decay.

---

## 38. Learning-rate schedulers

Een scheduler verandert de learning rate tijdens training.

Veelgebruikte vormen:

- constant;
- linear decay;
- cosine decay;
- warmup + decay.

Warmup begint met een lage learning rate en verhoogt die geleidelijk. Dat kan instabiliteit aan het begin verminderen.

---

## 39. Gradient accumulation

Soms past de gewenste batch niet in GPU-geheugen.

Dan worden gradients over meerdere micro-batches opgeteld.

```text
effective batch size =
micro batch size
× accumulation steps
× aantal apparaten
```

Voorbeeld:

```text
micro batch = 4
accumulation = 8
apparaten = 1

effective batch = 32
```

De loss wordt meestal gedeeld door het aantal accumulation steps, zodat de schaal van de gradient klopt.

---

## 40. Mixed precision

Mixed precision gebruikt lagere precisie voor een deel van de berekeningen.

### FP32

- stabiel;
- meer geheugen;
- vaak langzamer.

### FP16

- minder geheugen;
- sneller op veel GPU’s;
- kleiner numeriek bereik;
- vaak gradient scaling nodig.

### BF16

- vergelijkbaar geheugen met FP16;
- groter numeriek bereik;
- vaak stabieler;
- vereist geschikte hardware.

Mixed precision moet alleen worden gebruikt wanneer hardware en framework het ondersteunen.

---

## 41. Gradient clipping

Gradient clipping beperkt extreem grote gradients.

Bijvoorbeeld:

```python
max_grad_norm=1.0
```

Dit kan exploding gradients voorkomen.

Clipping gebeurt meestal vlak vóór de optimizer step.

---

## 42. Checkpoints

Een checkpoint bewaart genoeg informatie om later verder te gaan.

Meestal:

- model state;
- optimizer state;
- scheduler state;
- training state;
- config;
- scaler state;
- metadata.

Alleen modelgewichten opslaan is genoeg voor inference, maar niet altijd voor exact resume.

---

## 43. Resume interrupted training

Bij resume moet een nieuwe trainer kunnen doorgaan vanaf een opgeslagen checkpoint.

Belangrijk om terug te zetten:

- modelparameters;
- optimizerbuffers;
- learning-rate scheduler;
- global step;
- epoch;
- precision scaler;
- random state wanneer volledige reproduceerbaarheid nodig is.

Resume testen op dezelfde trainer is niet genoeg. Een echte test maakt nieuwe model-, optimizer- en trainerobjecten.

---

## 44. Callbacks

Callbacks luisteren naar gebeurtenissen.

Voorbeelden:

- training start;
- epoch start;
- step end;
- checkpoint saved;
- evaluation end;
- training end.

Callbacks zijn handig voor:

- logging;
- early stopping;
- metrics;
- monitoring;
- dashboards.

Ze moeten niet stiekem de hele trainer overnemen.

---

## 45. DDP

DistributedDataParallel maakt een kopie van het model op iedere GPU.

Elke GPU verwerkt een ander deel van de batch.

Daarna worden gradients tussen GPU’s gesynchroniseerd.

Voordelen:

- relatief eenvoudig;
- goede snelheid;
- standaardkeuze voor multi-GPU wanneer het model op één GPU past.

Nadeel:

- iedere GPU bewaart een volledige modelkopie.

---

## 46. FSDP

Fully Sharded Data Parallel verdeelt modelstates over apparaten.

Het kan sharden:

- parameters;
- gradients;
- optimizer state.

Voordelen:

- grotere modellen trainen;
- minder geheugen per GPU.

Nadelen:

- ingewikkeldere checkpoints;
- meer communicatie;
- moeilijkere debugging;
- wrapping strategy is belangrijk.

---

## 47. Hyperparameter search

Hyperparameters worden niet direct door het model geleerd.

Voorbeelden:

- learning rate;
- batch size;
- weight decay;
- aantal epochs;
- LoRA rank.

Searchmethoden:

- grid search;
- random search;
- Bayesian optimization;
- successive halving.

Random search is vaak een goede eenvoudige start.

---

## 48. Curriculum learning

Bij curriculum learning krijgt het model eerst makkelijke voorbeelden en later moeilijkere.

Mogelijke volgorde:

- korte teksten → lange teksten;
- eenvoudige taken → moeilijke taken;
- schone data → meer diverse data.

Dit kan helpen, maar de gekozen moeilijkheidsmaat moet zinvol zijn.

---

# Deel V — Fine-tuning en alignment

## 49. Full fine-tuning

Bij full fine-tuning worden alle modelparameters bijgewerkt.

Voordelen:

- maximale vrijheid;
- kan sterke aanpassing geven.

Nadelen:

- veel VRAM;
- meer opslag;
- grotere kans op catastrophic forgetting;
- iedere variant heeft volledige modelgewichten nodig.

---

## 50. PEFT

Parameter-Efficient Fine-Tuning traint slechts een klein deel van de parameters.

Voordelen:

- minder geheugen;
- sneller;
- kleinere checkpoints;
- meerdere adapters op één basismodel.

LoRA is een van de bekendste PEFT-methoden.

---

## 51. LoRA

LoRA laat de originele gewichtsmatrix meestal bevroren.

In plaats daarvan leert het twee kleine matrices:

```text
W' = W + schaal × B × A
```

Waarbij:

- `W` de originele gewichten zijn;
- `A` en `B` kleine trainbare matrices zijn;
- rank bepaalt hoe groot de adapter is.

Belangrijke instellingen:

- rank;
- alpha;
- dropout;
- target modules.

Een hogere rank geeft meer capaciteit, maar gebruikt meer geheugen.

---

## 52. QLoRA

QLoRA combineert:

- een gequantiseerd basismodel, vaak 4-bit;
- LoRA-adapters in hogere precisie;
- geheugenbesparende trainingstechnieken.

Doel: grote modellen fine-tunen op kleinere hardware.

QLoRA is niet gewoon “LoRA met één instelling”. Quantization, compute dtype en optimizerkeuze moeten goed samenwerken.

---

## 53. SFT

Supervised Fine-Tuning gebruikt gelabelde voorbeelden.

Bijvoorbeeld:

```text
instruction + input → gewenst antwoord
```

Het model leert de gewenste output token voor token.

Belangrijk:

- promptformat;
- masking van user tokens;
- padding;
- truncation;
- label alignment.

Bij chat-SFT wil je soms alleen loss berekenen over assistant-tokens.

---

## 54. DPO

Direct Preference Optimization gebruikt paren:

```text
chosen response
rejected response
```

Het doel is dat het model de gekozen respons waarschijnlijker maakt dan de afgewezen respons.

Voordelen:

- geen aparte RL-loop nodig;
- eenvoudiger dan volledige RLHF;
- vaak stabieler om te implementeren.

---

## 55. RLHF

RLHF bestaat vaak uit:

1. supervised fine-tuning;
2. preference data verzamelen;
3. reward model trainen;
4. policy optimaliseren;
5. evalueren op kwaliteit en veiligheid.

Het is krachtig, maar technisch zwaar.

Uitdagingen:

- reward hacking;
- instabiele training;
- meerdere modellen tegelijk;
- hoge compute-kosten;
- moeilijke evaluatie.

---

## 56. GRPO

GRPO is een reinforcement-learningmethode waarbij meerdere antwoorden per prompt worden vergeleken binnen een groep.

De precieze implementatie hangt af van het gebruikte algoritme en framework.

Belangrijke onderdelen:

- meerdere samples;
- rewardberekening;
- relatieve voordelen;
- policy updates;
- KL-beperking of andere stabilisatie.

ArcLM moet dit pas toevoegen wanneer SFT, evaluation en preference-data goed werken.

---

# Deel VI — Evaluatie

## 57. Waarom evalueren?

Training loss vertelt alleen hoe goed het model de trainingsdoelstelling volgt.

Evaluatie controleert:

- generalisatie;
- prestaties op validation data;
- task accuracy;
- regressies;
- verschil tussen experimenten.

Training zonder evaluatie is grotendeels gokken.

---

## 58. Validation loss

Validation loss wordt berekend op data die niet wordt gebruikt voor parameterupdates.

Tijdens evaluatie:

- gradients staan uit;
- optimizer verandert niet;
- model staat in evaluation mode.

Een groot verschil tussen train loss en validation loss kan op overfitting wijzen.

---

## 59. Perplexity

Perplexity wordt meestal afgeleid van gemiddelde cross-entropy loss:

```text
perplexity = exp(loss)
```

Lage perplexity betekent dat het model minder “verrast” is door de juiste tokens.

Perplexity is nuttig voor taalmodellering, maar vergelijkt niet altijd eerlijk tussen verschillende tokenizers.

---

## 60. Accuracy

Voor classificatie:

```text
accuracy = correcte voorspellingen / totaal
```

Voor token accuracy moeten padding- en ignored labels worden overgeslagen.

Bij language modeling is accuracy vaak minder informatief dan loss en perplexity, omdat ieder token uit een grote vocabulary wordt gekozen.

---

## 61. Custom metrics

Een metric heeft meestal:

```python
update(...)
compute()
reset()
```

- `update` verzamelt informatie per batch;
- `compute` maakt het eindresultaat;
- `reset` maakt de metric klaar voor een nieuwe run.

Zo hoeft niet alles in geheugen te worden opgeslagen.

---

## 62. Benchmark suites

Een benchmark suite voert meerdere taken en datasets uit.

Voorbeelden:

- MMLU;
- GSM8K;
- codebenchmarks;
- taalbenchmarks.

Een benchmarkscore is geen volledige maat voor modelkwaliteit.

Let altijd op:

- contamination;
- promptformat;
- decoding settings;
- few-shot instellingen;
- tokenizer;
- exacte evaluatiecode.

---

## 63. Human evaluation

Mensen beoordelen antwoorden op criteria zoals:

- correctheid;
- duidelijkheid;
- relevantie;
- veiligheid;
- stijl.

Human evaluation is belangrijk voor open vragen waar automatische metrics tekortschieten.

Maar menselijke beoordelingen kunnen ook verschillen. Daarom zijn duidelijke rubrics en meerdere beoordelaars belangrijk.

---

# Deel VII — Inference en serving

## 64. Inference

Inference is het gebruiken van een getraind model zonder gradients.

Stappen:

1. model laden;
2. tokenizer laden;
3. prompt tokenizen;
4. tokens door het model sturen;
5. volgende tokens kiezen;
6. tokens decoden.

---

## 65. Sampling

Bekende generationinstellingen:

### Temperature

Hogere temperature geeft meer variatie. Lagere temperature maakt output voorspelbaarder.

### Top-k

Kiest alleen uit de beste `k` tokens.

### Top-p

Kiest uit de kleinste tokenverzameling waarvan de totale kans minstens `p` is.

### Greedy decoding

Kiest altijd het waarschijnlijkste token.

### Beam search

Houdt meerdere kandidaatsequences bij. Vooral nuttig voor sommige vaste generatieproblemen, minder standaard voor chat.

---

## 66. Streaming generation

Bij streaming worden nieuwe tokens direct naar de gebruiker gestuurd.

Voordelen:

- lagere ervaren latency;
- output verschijnt meteen;
- geschikt voor chat.

De totale generatie is niet per se sneller, maar voelt wel sneller.

---

## 67. Batch inference

Batch inference verwerkt meerdere prompts tegelijk.

Voordelen:

- betere GPU-benutting;
- hogere throughput.

Nadeel:

- requests met verschillende lengtes veroorzaken padding;
- langste request kan de batch vertragen.

---

## 68. Dynamic batching

Dynamic batching groepeert requests die ongeveer tegelijk aankomen.

De server wacht heel kort om een efficiëntere batch te vormen.

Trade-off:

- grotere batch verhoogt throughput;
- te lang wachten verhoogt latency.

---

## 69. Continuous batching

Continuous batching laat nieuwe requests instromen terwijl andere nog genereren.

Afgeronde sequences verlaten de batch en nieuwe sequences nemen hun plek in.

Dit gebruikt GPU-capaciteit efficiënter dan vaste batches.

---

## 70. KV cache

Bij autoregressieve generatie worden eerdere keys en values bewaard.

Zonder cache zou het model bij ieder nieuw token eerdere tokens opnieuw volledig verwerken.

Voordeel:

- veel snellere generatie.

Nadeel:

- gebruikt veel geheugen;
- groeit met sequence length;
- beïnvloedt hoeveel gelijktijdige requests passen.

---

## 71. Speculative decoding

Een klein draft model stelt meerdere tokens voor.

Het grote model controleert deze tokens in één stap.

Als voorstellen kloppen, worden meerdere tokens tegelijk geaccepteerd.

Voordeel:

- lagere latency.

Nadeel:

- extra model nodig;
- winst hangt af van acceptatieratio;
- implementatie is complexer.

---

## 72. Model serving

Serving maakt een model beschikbaar via een service.

Belangrijke onderdelen:

- model lifecycle;
- requestvalidatie;
- batching;
- streaming;
- timeouts;
- concurrency;
- logging;
- health checks;
- metrics.

Inference is de modelberekening. Serving is alles eromheen.

---

## 73. REST API

Een eenvoudige API kan bijvoorbeeld hebben:

```text
POST /generate
POST /chat/completions
GET /health
GET /models
```

Een REST-laag moet dun blijven en de kern-inference engine hergebruiken.

---

## 74. OpenAI-compatible API

Een OpenAI-compatible API gebruikt bekende request- en responsevormen.

Voordelen:

- bestaande clients werken sneller;
- tools kunnen makkelijker migreren;
- developers kennen het formaat.

Compatibel betekent niet per se dat ieder detail of iedere feature meteen ondersteund is. Documenteer verschillen.

---

# Deel VIII — Optimalisatie

## 75. Quantization

Quantization bewaart gewichten of activaties met minder bits.

### INT8

- minder geheugen;
- vaak goede kwaliteit;
- breed ondersteund.

### INT4

- nog minder geheugen;
- grotere kans op kwaliteitsverlies;
- nuttig voor grote modellen op beperkte hardware.

Belangrijke begrippen:

- scale;
- zero point;
- symmetric of asymmetric;
- per-tensor of per-channel;
- weight-only of weight-and-activation quantization.

---

## 76. Pruning

Pruning verwijdert minder belangrijke gewichten, neuronen of heads.

### Unstructured pruning

Verwijdert losse gewichten. Kan hoge sparsity geven, maar gewone hardware benut dat niet altijd goed.

### Structured pruning

Verwijdert complete onderdelen, zoals neurons of attention heads. Makkelijker praktisch te versnellen.

---

## 77. Knowledge distillation

Een groot teacher model helpt een kleiner student model.

De student leert van:

- echte labels;
- teacher logits;
- soft targets;
- intermediate representations.

Doel:

- kleiner model;
- lagere latency;
- minder geheugen;
- zoveel mogelijk kwaliteit behouden.

---

## 78. Flash Attention

Flash Attention berekent attention op een geheugen-efficiëntere manier.

Het verandert de wiskundige bedoeling niet, maar vermindert geheugenverplaatsing en tijdelijke tensors.

Voordelen:

- sneller;
- minder VRAM;
- grotere sequences mogelijk.

Ondersteuning hangt af van hardware, dtype en PyTorch-versie.

---

## 79. xFormers

xFormers bevat efficiënte Transformercomponenten, waaronder memory-efficient attention.

Het moet optioneel blijven. De library mag niet volledig afhankelijk zijn van xFormers.

---

## 80. torch.compile

`torch.compile` probeert PyTorch-code te optimaliseren en te compileren.

Mogelijke voordelen:

- snellere training of inference.

Mogelijke nadelen:

- compileertijd;
- graph breaks;
- niet iedere custom operatie werkt;
- debugging wordt soms moeilijker.

Gebruik benchmarks voordat je het standaard aanzet.

---

## 81. ONNX export

ONNX is een uitwisselingsformaat voor modellen.

Voordelen:

- draaien buiten PyTorch;
- gebruik met ONNX Runtime;
- deployment op verschillende omgevingen.

Uitdagingen:

- dynamische shapes;
- unsupported operators;
- generation loops;
- model-specifieke logica.

---

## 82. TensorRT export

TensorRT optimaliseert modellen voor NVIDIA GPU’s.

Voordelen:

- hoge inferenceperformance.

Nadelen:

- NVIDIA-specifiek;
- engine build kan lang duren;
- shapes en precisionprofielen moeten goed worden ingesteld.

---

## 83. GGUF export

GGUF wordt veel gebruikt voor lokale inference in tools uit het llama.cpp-ecosysteem.

Het bevat modelgewichten en metadata in een formaat dat geschikt is voor lokale en vaak gequantiseerde inference.

Een correcte export vereist mapping van:

- architectuur;
- tensor names;
- tokenizer metadata;
- quantizationformaat.

---

# Deel IX — Monitoring en experimenten

## 84. Experiment tracking

Een experiment moet minstens opslaan:

- config;
- codeversie;
- datasetversie;
- model-id;
- metrics;
- checkpoints;
- start- en eindtijd;
- hardware;
- random seed.

Zonder tracking is het moeilijk te weten waarom experiment B beter was dan experiment A.

---

## 85. GPU en VRAM monitoring

Nuttige waarden:

- GPU utilization;
- VRAM allocated;
- VRAM reserved;
- temperatuur;
- power usage;
- dataloader idle time.

Lage GPU utilization kan betekenen:

- data loading te langzaam;
- batch te klein;
- CPU-bottleneck;
- te veel synchronisatie.

---

## 86. Training speed

Veelgebruikte maten:

- steps per second;
- samples per second;
- tokens per second;
- tijd per epoch.

Tokens per second is vaak het eerlijkst voor taalmodellen.

---

## 87. Cost estimation

Kosten kunnen worden geschat met:

```text
runtime × prijs per uur × aantal apparaten
```

Maar echte kosten kunnen ook bevatten:

- storage;
- dataverkeer;
- idle time;
- checkpointopslag;
- API-kosten;
- preprocessing.

---

## 88. Memory profiling

Memory profiling zoekt waar geheugen wordt gebruikt.

Denk aan:

- parameters;
- gradients;
- optimizer state;
- activations;
- KV cache;
- dataloaderbuffers.

Bij AdamW kan optimizer state veel geheugen gebruiken naast modelgewichten.

---

## 89. Performance profiling

Een profiler onderzoekt:

- CPU-tijd;
- GPU-kernels;
- dataloadingtijd;
- synchronisatie;
- memory copies;
- graph breaks;
- communication overhead.

Profiling hoort pas na een correct werkende implementatie. Eerst correctheid, daarna optimalisatie.

---

# Deel X — Deployment

## 90. Docker

Docker maakt een reproduceerbare omgeving met:

- Python;
- dependencies;
- ArcLM;
- modelserver;
- systeemlibraries.

Een goede image:

- is niet onnodig groot;
- draait als niet-root waar mogelijk;
- heeft health checks;
- gebruikt duidelijke environment variables;
- bewaart modeldata niet per ongeluk in tijdelijke lagen.

---

## 91. Kubernetes

Kubernetes beheert containers op meerdere machines.

Belangrijke onderdelen:

- Deployment;
- Service;
- ConfigMap;
- Secret;
- PersistentVolume;
- autoscaling;
- liveness en readiness probes.

Kubernetes is pas nuttig wanneer de modelserver al betrouwbaar werkt.

---

## 92. Cloud providers

AWS, Azure en GCP bieden:

- GPU-machines;
- storage;
- networking;
- identity;
- monitoring;
- managed Kubernetes;
- serverless opties.

ArcLM moet cloudproviders via adapters ondersteunen, niet cloudlogica door de kerncode mengen.

---

## 93. RunPod en Modal

Deze platforms maken GPU-workloads vaak eenvoudiger dan een volledige cloudsetup.

Mogelijke use-cases:

- tijdelijke training jobs;
- inference endpoints;
- batch inference;
- autoscaling.

Ook hier moet de core onafhankelijk blijven van één provider.

---

# Deel XI — Developer Experience

## 94. CLI

Een CLI kan bijvoorbeeld ondersteunen:

```bash
arclm train config.yaml
arclm evaluate model/
arclm generate model/ --prompt "Hallo"
arclm inspect-dataset data.jsonl
```

De CLI hoort dezelfde Python-API te gebruiken. Geen aparte dubbele implementatie.

---

## 95. Web UI

Een Web UI kan helpen met:

- configs maken;
- datasets bekijken;
- training starten;
- metrics volgen;
- modellen testen.

Maar een UI mag niet nodig zijn om ArcLM te gebruiken.

---

## 96. Model registry

Een registry houdt modellen en metadata bij.

Bijvoorbeeld:

- model-id;
- versie;
- base model;
- datasetversie;
- trainingconfig;
- metrics;
- artifactpad;
- status.

Een registry is niet alleen een Python dictionary. Voor productie kan opslag en versiebeheer nodig zijn.

---

## 97. Plugin system

Plugins voegen functionaliteit toe zonder de kern aan te passen.

Mogelijke plugins:

- nieuwe dataset loaders;
- nieuwe metrics;
- nieuwe exporters;
- nieuwe cloudproviders;
- nieuwe modelarchitecturen.

Een plugin moet een duidelijk contract hebben en niet zomaar verborgen code uitvoeren tijdens `import arclm`.

---

## 98. Project templates

Templates helpen developers snel starten.

Voorbeelden:

```text
text-classification/
causal-lm-training/
lora-finetuning/
local-inference-api/
```

Een template moet klein zijn en duidelijk tonen welke onderdelen vervangen kunnen worden.

---

# Deel XII — Enterprise

## 99. User authentication

Authentication bepaalt wie een gebruiker is.

Voorbeelden:

- username en password;
- OAuth;
- SSO;
- service accounts.

Authentication is iets anders dan authorization.

---

## 100. Role-based permissions

Authorization bepaalt wat iemand mag doen.

Voorbeelden:

- viewer;
- developer;
- trainer;
- admin;
- billing manager.

Controle moet server-side gebeuren. Alleen knoppen verbergen in de UI is niet genoeg.

---

## 101. Team workspaces

Een workspace groepeert:

- gebruikers;
- projecten;
- datasets;
- modellen;
- API keys;
- kosten;
- rechten.

Resources moeten altijd aan een duidelijke owner of workspace gekoppeld zijn.

---

## 102. Audit logs

Audit logs houden belangrijke acties bij:

- wie;
- wat;
- wanneer;
- op welke resource;
- met welk resultaat.

Voorbeelden:

- model verwijderd;
- API key aangemaakt;
- deployment gewijzigd;
- rol aangepast.

Audit logs moeten moeilijk ongemerkt te veranderen zijn.

---

## 103. API keys

API keys geven programma’s toegang.

Belangrijke regels:

- toon de volledige key maar één keer;
- sla alleen een hash op;
- ondersteun intrekken;
- ondersteun scopes;
- houd gebruik bij;
- plaats keys nooit in logs.

---

## 104. Billing

Billing kan meten:

- tokens;
- GPU-seconden;
- requests;
- storage;
- teamplannen;
- features.

Billing moet gebaseerd zijn op betrouwbare usage events. Het hoort niet direct verweven te zijn met trainer- of inferencelogica.

---

## 105. License management

Een betaalde ArcLM Pro-versie kan licenties controleren.

Maar de open-source core mag niet afhankelijk zijn van de Pro-laag.

De dependency-richting moet blijven:

```text
arclm_pro → arclm
```

Niet:

```text
arclm → arclm_pro
```

---

# Deel XIII — Community en Pro

## 106. ArcLM Community

Logische open-sourceonderdelen:

- model building;
- tokenizers;
- dataset loading;
- cleaning en simpele pipelines;
- single-device training;
- checkpoints;
- basic evaluation;
- lokale inference;
- base classes en extension points;
- eenvoudige CLI;
- plugin interfaces.

Community moet zelfstandig bruikbaar blijven.

---

## 107. ArcLM Pro

Logische Pro-onderdelen:

- DDP en FSDP orchestration;
- multi-GPU workflows;
- LoRA/QLoRA automation;
- DPO, RLHF en GRPO;
- hyperparameter optimization;
- experiment tracking;
- dashboards;
- model serving;
- cloud deployment;
- enterprise workspaces;
- roles en audit logs;
- billing en licenties.

Pro moet de Community-API uitbreiden in plaats van dupliceren.

---

# Deel XIV — Ontwerpregels voor ArcLM

## 108. Houd de core simpel

Een korte correcte implementatie is beter dan een groot framework zonder echte noodzaak.

Gebruik een base class wanneer developers echt eigen implementaties moeten kunnen maken.

Gebruik een gewone functie wanneer geen state of lifecycle nodig is.

---

## 109. Scheid verantwoordelijkheden

Voorbeelden:

- datasets weten niets over trainers;
- models weten niets over CLI;
- configs starten geen CUDA;
- inference bevat geen clouddeployment;
- compatibility shims bevatten geen echte implementatie;
- Pro importeert Community, niet andersom.

---

## 110. Houd public APIs klein

Een developer moet vooral dit soort imports gebruiken:

```python
from arclm.datasets import load_dataset, DataPipeline
from arclm.training import Trainer, TrainingConfig
from arclm.evaluation import Evaluator, Accuracy
from arclm.inference import TextGenerator
```

Niet:

```python
from arclm.training.internal.runtime.default_loop_engine import Trainer
```

---

## 111. Maak optionele dependencies echt optioneel

Voorbeeld:

```text
pip install "arclm[webdataset]"
pip install "arclm[peft]"
pip install "arclm[serving]"
```

`import arclm` mag niet falen omdat een optionele package ontbreekt.

---

## 112. Test gedrag, niet alleen imports

Een goede test controleert bijvoorbeeld:

- modelparameters veranderen;
- optimizer step count klopt;
- resume werkt met een nieuwe trainer;
- ignored labels tellen niet mee;
- streaming laadt niet alles in geheugen;
- checkpoint retention verwijdert alleen juiste mappen.

---

## 113. Documenteer beperkingen

Voorbeelden:

- FP16 alleen getest op CUDA;
- WebDataset vereist optionele dependency;
- streaming ondersteunt geen random access;
- perplexity is tokenizer-afhankelijk;
- distributed resume heeft andere eisen dan single-device resume.

Beperkingen duidelijk noemen maakt een library betrouwbaarder.

---

# Deel XV — Aanbevolen ontwikkelvolgorde

## 114. Korte roadmap

```text
1. Data Pipeline ✅
2. Training Core ✅
3. Basic Evaluation
4. Full Fine-Tuning / SFT
5. LoRA
6. PEFT integration
7. QLoRA
8. Experiment tracking basics
9. Distributed training
10. Inference improvements
11. Model serving
12. Optimization and export
13. Deployment
14. Advanced evaluation
15. Enterprise
```

Deze volgorde is logisch omdat latere onderdelen afhankelijk zijn van eerdere fundamenten.

Bijvoorbeeld:

- LoRA heeft een stabiele trainer nodig;
- benchmark suites hebben een stabiele evaluator nodig;
- serving heeft stabiele inference nodig;
- deployment heeft een stabiele server nodig;
- dashboards hebben betrouwbare events en metrics nodig.

---

# Deel XVI — Vragen voor iedere nieuwe feature

Voordat je een feature toevoegt, stel deze vragen:

1. Welk echt probleem lost dit op?
2. Is er al bestaande code die dit deels doet?
3. Hoort dit in Community of Pro?
4. Is een functie genoeg, of is state nodig?
5. Hebben developers een base class nodig?
6. Welke public API is het simpelst?
7. Welke oude API moet compatibel blijven?
8. Welke optionele dependencies zijn nodig?
9. Hoe test ik echte werking?
10. Welke edge cases bestaan?
11. Wat gebeurt op CPU?
12. Wat gebeurt zonder internet?
13. Wat gebeurt bij een onderbroken run?
14. Welke data of metadata moet worden opgeslagen?
15. Welke beperkingen moet documentatie noemen?

---

# Deel XVII — Begrippenlijst

| Begrip | Betekenis |
|---|---|
| Batch | Een groep voorbeelden die samen wordt verwerkt. |
| Epoch | Eén volledige ronde over de trainingsdataset. |
| Step | Eén batchverwerking. |
| Global step | Totaal aantal verwerkte trainingsteps. |
| Optimizer step | Moment waarop gewichten echt worden bijgewerkt. |
| Gradient | Richting waarin een parameter moet veranderen om loss te verlagen. |
| Loss | Getal dat aangeeft hoe fout de voorspelling is. |
| Logits | Ruwe modelscores vóór softmax. |
| Token | Klein tekststuk dat het model verwerkt. |
| Vocabulary | Alle tokens die de tokenizer kent. |
| Context length | Maximaal aantal tokens dat tegelijk wordt verwerkt. |
| Checkpoint | Opgeslagen staat van model en training. |
| Fine-tuning | Verder trainen van een bestaand model op nieuwe data. |
| Adapter | Kleine trainbare toevoeging aan een bevroren model. |
| Quantization | Minder bits gebruiken voor gewichten of activaties. |
| Throughput | Hoeveel werk per seconde wordt verwerkt. |
| Latency | Hoe lang één request duurt. |
| VRAM | Geheugen op de GPU. |
| Inference | Een getraind model gebruiken zonder training. |
| Evaluation | Modelprestaties meten zonder gewichten bij te werken. |
| Serving | Inference beschikbaar maken via een service of API. |
| Deployment | De service in een echte omgeving plaatsen. |

---

# Slot

ArcLM hoeft niet vanaf het begin ieder geavanceerd AI-systeem na te bouwen.

De belangrijkste basis is:

- duidelijke data;
- voorspelbare tokenisatie;
- begrijpelijke modellen;
- stabiele training;
- betrouwbare evaluatie;
- eenvoudige inference;
- goede tests;
- heldere extension points.

Daarna kunnen geavanceerde technieken stap voor stap worden toegevoegd.

De beste ArcLM-code is niet de code met de meeste classes of de langste bestanden. Het is code waarvan een developer kan begrijpen:

- wat erin gaat;
- wat eruit komt;
- welke state verandert;
- waarom een keuze is gemaakt;
- hoe het onderdeel kan worden vervangen;
- hoe de werking wordt getest.
