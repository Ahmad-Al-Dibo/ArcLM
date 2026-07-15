# SFT Configuration

`SFTConfig` breidt `TrainingConfig` uit met SFT-instellingen.

Belangrijke velden:

- `text_field`
- `instruction_field`
- `input_field`
- `response_field`
- `prompt_field`
- `messages_field`
- `max_length`
- `padding`
- `truncation`
- `packing`
- `assistant_only_loss`
- `ignore_index`
- `label_shift`

Er mag maar één hoofdformaat tegelijk actief zijn. `assistant_only_loss=True`
werkt alleen bij formats waar response- of assistant-tokens veilig te vinden
zijn.
