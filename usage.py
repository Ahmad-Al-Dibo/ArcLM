from arclm import load_any_model, load_model



def main():
    model = load_any_model("Qwen/Qwen3-0.6B", device="cpu")
    while True:
        user_input = input("User: ")
        if user_input.lower() in ["exit", "quit"]:
            break

        try:
            chat_template = {
                "role": "system",
                "content" : user_input
            }
            output = model.chat(chat_template)
            print(f"ArcLM: {output}\n")
        except Exception as e:
            print(f"Error during chat: {e}")

if __name__ == "__main__":
    main()