# Status

Verificatiedatum van deze scaffolding: 2026-07-26. Runtime-verificatie met modelgewichten is niet uitgevoerd in deze sessie.

Preflight: Windows 11, Python 3.12.10 in `.venv`, Torch 2.13.0+cpu, Transformers 5.14.1, Hugging Face Hub 1.24.0, Safetensors 0.8.0. CUDA is niet beschikbaar. `peft`, `flask` en `pytest` ontbreken in de project-venv.

| Model | Download | Load | Generate | SFT | Save/Reload | Agent | Tested device |
|---|---|---|---|---|---|---|---|
| qwen3_0_6b | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| smollm2_360m_instruct | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| tinyllama_1_1b_chat | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| bloomz_560m | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| xglm_564m | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| pythia_410m | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| olmo2_1b_instruct | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| falcon3_1b_instruct | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| stablelm2_1_6b_zephyr | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |
| bloom_560m | not_tested | not_tested | not_tested | dependency_missing/not_tested | not_tested | not_tested | none |

## Bekende blockers

- CPU-only omgeving: grote modellen en SFT kunnen lang duren of te veel RAM vragen.
- `peft` ontbreekt: PEFT/LoRA SFT staat op `dependency_missing`.
- `flask` ontbreekt: webstudio-runtime is niet uitgevoerd.
- `pytest` ontbreekt in `.venv`: tests zijn toegevoegd maar niet via pytest in de venv uitgevoerd.
- Geen modelgewichten zijn gedownload; geen model is als core-geverifieerd geteld.

