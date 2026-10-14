"""
ArcLM Example: Console Chat

What you'll learn
-----------------
- Load a local or Hugging Face causal language model with load_any_model
- Run an interactive multi-turn chat loop in the console
- Control generation with device, system prompt, max tokens, and temperature flags

When to use this
----------------
- For a quick interactive session against a local model directory or a Hugging
  Face model ID, without writing a serving stack.

Requirements
------------
    pip install "arclm[train]"    # native ArcLM models

    For Hugging Face model IDs, additionally: pip install "arclm[hf]"

Run
---
    python examples/08_inference_local_models/03_console_chat.py <model> [--device cpu] [--temperature 0.7]

    <model> is a local model directory or a Hugging Face model ID.

Expected output
---------------
    Model loaded. Enter /exit or /quit to end the conversation.
    You: Hello
    ArcLM: Hi! How can I help you today?

Runtime
-------
    Model load time depends on the chosen model; chat turns are interactive.
"""

import argparse

from arclm import load_any_model


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", help="Local model directory or Hugging Face model ID")
    parser.add_argument("--device", choices=["cpu", "cuda"], default=None)
    parser.add_argument("--system-prompt", default="You are a helpful assistant.")
    parser.add_argument("--max-new-tokens", type=int, default=256)
    parser.add_argument("--temperature", type=float, default=0.7)
    args = parser.parse_args()

    # --- 1. Load the model ---
    try:
        model = load_any_model(args.model, device=args.device)
    except Exception as exc:
        print(f"Could not load model: {exc}")
        return 1

    # --- 2. Run the interactive chat loop ---
    messages = [{"role": "system", "content": args.system_prompt}]
    print("Model loaded. Enter /exit or /quit to end the conversation.")
    while True:
        try:
            prompt = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return 0

        if prompt.lower() in {"/exit", "/quit"}:
            return 0
        if not prompt:
            continue

        # --- 3. Generate and record the assistant reply ---
        messages.append({"role": "user", "content": prompt})
        try:
            response = model.chat(
                messages,
                max_new_tokens=args.max_new_tokens,
                temperature=args.temperature,
            )
        except Exception as exc:
            print(f"Generation failed: {exc}")
            return 1

        messages.append({"role": "assistant", "content": response})
        print(f"ArcLM: {response}")


if __name__ == "__main__":
    raise SystemExit(main())
