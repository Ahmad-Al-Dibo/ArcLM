"""Chat with a local or Hugging Face causal language model in the console."""

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

    try:
        model = load_any_model(args.model, device=args.device)
    except Exception as exc:
        print(f"Could not load model: {exc}")
        return 1

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