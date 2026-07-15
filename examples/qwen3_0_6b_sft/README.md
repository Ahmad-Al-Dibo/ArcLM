# Qwen3-0.6B Fine-Tuning Met ArcLM

Dit voorbeeld laat een grotere SFT workflow zien met `Qwen/Qwen3-0.6B`.

Het voorbeeld doet dit:

1. Laadt het base model via Hugging Face.
2. Genereert baseline antwoorden.
3. Traint op een kleine chat-style dataset met `train_sft`.
4. Slaat standaard een LoRA adapter op.
5. Laadt de adapter bovenop het base model.
6. Genereert opnieuw antwoorden.
7. Draait een kleine functionele benchmark.

Dit is een demo, geen serieuze model-evaluatie. De dataset is heel klein, dus het model kan tekst onthouden in plaats van echt robuust gedrag leren.

## Installatie

```bash
pip install -e ".[peft]"
```

Voor Qwen3 is een moderne `transformers` versie nodig. Deze workflow gebruikt standaard geen `bitsandbytes`.

## PowerShell

```powershell
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/test_base_model.py
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/train_qwen3_0_6b_sft.py
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/test_finetuned_model.py
.\.venv\Scripts\python.exe examples/qwen3_0_6b_sft/benchmark_base_vs_finetuned.py
```

## Cross Platform

```bash
python examples/qwen3_0_6b_sft/test_base_model.py
python examples/qwen3_0_6b_sft/train_qwen3_0_6b_sft.py
python examples/qwen3_0_6b_sft/test_finetuned_model.py
python examples/qwen3_0_6b_sft/benchmark_base_vs_finetuned.py
```

## Fine-Tuning Script

Het script gebruikt de publieke ArcLM API:

```python
from arclm import train_sft

result = train_sft(
    model="Qwen/Qwen3-0.6B",
    dataset="examples/qwen3_0_6b_sft/data/sample_sft.jsonl",
    output_dir="examples/qwen3_0_6b_sft/output/qwen3_0_6b_sft_lora",
    backend="huggingface",
    assistant_only_loss=True,
    use_lora=True,
    batch_size=1,
    gradient_accumulation_steps=8,
    learning_rate=2e-4,
    num_epochs=1,
    max_length=1024,
    dtype="auto",
    device_map="auto",
)
```

## Output

De scripts schrijven onder:

```text
examples/qwen3_0_6b_sft/output/
```

Belangrijke output:

- `base_outputs.jsonl`
- `qwen3_0_6b_sft_lora/`
- `finetuned_outputs.jsonl`
- `benchmark_results.json`

## Assistant-Only Loss

Met `assistant_only_loss=True` telt alleen het antwoord van de assistant mee voor de loss. User/system tokens blijven context, maar hun labels worden op `-100` gezet.

## Dataset Vervangen

Gebruik JSONL records met messages:

```json
{"messages":[{"role":"user","content":"Vraag"},{"role":"assistant","content":"Antwoord"}]}
```

Of instruction/output:

```json
{"instruction":"Vraag","output":"Antwoord"}
```

Houd voorbeelden schoon, feitelijk en consistent met het gedrag dat je wilt leren.

## Problemen

`CUDA out of memory`

Gebruik LoRA, houd `batch_size=1`, verlaag `max_length`, of gebruik een kleiner model.

`Missing PEFT`

Installeer met:

```bash
pip install -e ".[peft]"
```

`Hugging Face download warnings`

De eerste run downloadt modelbestanden. Controleer internet, schijfruimte en eventuele Hugging Face toegang.

## Speciale Versie

Dit voorbeeld hoort bij de speciale ArcLM-versie. Deel adapters, datasets of geavanceerde scripts niet publiek zonder toestemming.
