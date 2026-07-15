# Dataset Formats

Ondersteunde formats:

Plain text:

```json
{"text": "Example text"}
```

Instruction:

```json
{"instruction": "Translate", "input": "Goedemorgen", "output": "Good morning"}
```

Prompt-response:

```json
{"prompt": "What is Python?", "response": "A programming language."}
```

Chat:

```json
{
  "messages": [
    {"role": "system", "content": "Be helpful."},
    {"role": "user", "content": "What is Python?"},
    {"role": "assistant", "content": "Python is a programming language."}
  ]
}
```

Field-namen zijn configureerbaar via `SFTConfig`.
