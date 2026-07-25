"""Professioneel AI-voorbeeld met een kleine knowledge base.

Dit voorbeeld gebruikt geen downloads en geen externe API. Het model is
"extern" als idee: denk aan een Hugging Face model dat je eerst wilt
controleren voordat je fine-tuning of deployment start.
"""

from arclm.logics import KnowledgeBase, create_symbols


def build_ai_rules(symbols):
    """Maakt de regels voor een AI workflow."""
    external_model = symbols["external_model"]
    model_card = symbols["model_card_available"]
    license_ok = symbols["license_allows_training"]
    tokenizer = symbols["tokenizer_loaded"]

    dataset = symbols["dataset_loaded"]
    clean = symbols["dataset_clean"]
    no_pii = symbols["no_pii"]
    deduped = symbols["dataset_deduplicated"]

    gpu = symbols["gpu_memory_ok"]
    sft_config = symbols["sft_config_ready"]
    baseline = symbols["baseline_saved"]

    metrics = symbols["metrics_pass"]
    safety = symbols["safety_pass"]

    model_allowed = symbols["model_allowed"]
    data_ready = symbols["data_ready"]
    can_start_sft = symbols["can_start_sft"]
    can_run_training = symbols["can_run_training"]
    ready_for_private_release = symbols["ready_for_private_release"]

    return [
        (external_model & model_card & license_ok).implies(model_allowed),
        (dataset & clean & no_pii & deduped).implies(data_ready),
        (model_allowed & tokenizer & data_ready & gpu & sft_config).implies(
            can_start_sft
        ),
        (can_start_sft & baseline).implies(can_run_training),
        (can_run_training & metrics & safety).implies(
            ready_for_private_release
        ),
    ]


def main():
    """Draait een moeilijker AI knowledge voorbeeld."""
    symbols = create_symbols(
        "external_model",
        "model_card_available",
        "license_allows_training",
        "tokenizer_loaded",
        "dataset_loaded",
        "dataset_clean",
        "no_pii",
        "dataset_deduplicated",
        "gpu_memory_ok",
        "sft_config_ready",
        "baseline_saved",
        "metrics_pass",
        "safety_pass",
        "model_allowed",
        "data_ready",
        "can_start_sft",
        "can_run_training",
        "ready_for_private_release",
    )

    knowledge = KnowledgeBase(*build_ai_rules(symbols))

    # Deze feiten zouden normaal uit checks komen: dataset scans,
    # model-card inspectie, evaluatie en safety tests.
    knowledge.add_all(
        [
            symbols["external_model"],
            symbols["model_card_available"],
            symbols["license_allows_training"],
            symbols["tokenizer_loaded"],
            symbols["dataset_loaded"],
            symbols["dataset_clean"],
            symbols["no_pii"],
            symbols["dataset_deduplicated"],
            symbols["gpu_memory_ok"],
            symbols["sft_config_ready"],
            symbols["baseline_saved"],
            symbols["metrics_pass"],
            symbols["safety_pass"],
        ]
    )

    goal = symbols["ready_for_private_release"]
    result = knowledge.explain(goal)

    print("AI knowledge base")
    print("-----------------")
    print("Consistent:", knowledge.is_consistent())
    print("Klaar voor private release:", result.answer)
    print("Gebruikte symbolen:", ", ".join(result.symbols))
    print("Kennisregel:", result.knowledge)


if __name__ == "__main__":
    main()
