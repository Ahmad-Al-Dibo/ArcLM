from arclm.logics import KnowledgeBase, Symbol, create_symbols, model_check


def test_knowledge_base_can_answer_simple_question():
    symbols = create_symbols("rain", "wet")
    rain = symbols["rain"]
    wet = symbols["wet"]

    knowledge = KnowledgeBase(
        rain,
        rain.implies(wet),
    )

    assert knowledge.ask(wet) is True


def test_knowledge_base_can_add_knowledge_later():
    clean = Symbol("clean")
    tokens = Symbol("tokens")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(
        (clean & tokens).implies(ready),
    )

    assert knowledge.ask(ready) is False

    knowledge.add(clean)
    knowledge.add(tokens)

    assert knowledge.ask(ready) is True


def test_knowledge_base_can_delete_knowledge():
    clean = Symbol("clean")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(clean, clean.implies(ready))

    assert knowledge.ask(ready) is True

    knowledge.delete(clean)

    assert knowledge.ask(ready) is False


def test_knowledge_base_can_update_knowledge():
    clean = Symbol("clean")
    reviewed = Symbol("reviewed")
    ready = Symbol("ready")

    old_rule = clean.implies(ready)
    new_rule = (clean & reviewed).implies(ready)

    knowledge = KnowledgeBase(clean, old_rule)

    assert knowledge.ask(ready) is True

    knowledge.update(old_rule, new_rule)

    assert knowledge.ask(ready) is False

    knowledge.add(reviewed)

    assert knowledge.ask(ready) is True


def test_knowledge_base_discard_missing_sentence_does_not_fail():
    clean = Symbol("clean")

    knowledge = KnowledgeBase()

    assert knowledge.discard(clean) == clean


def test_knowledge_base_can_check_membership():
    clean = Symbol("clean")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(clean)

    assert clean in knowledge
    assert knowledge.has(clean) is True
    assert knowledge.has(ready) is False


def test_knowledge_base_can_replace_knowledge():
    clean = Symbol("clean")
    reviewed = Symbol("reviewed")
    ready = Symbol("ready")

    old_rule = clean.implies(ready)
    new_rule = (clean & reviewed).implies(ready)

    knowledge = KnowledgeBase(clean, old_rule)

    knowledge.replace(old_rule, new_rule)

    assert knowledge.ask(ready) is False
    assert knowledge.has(new_rule) is True


def test_knowledge_base_can_clear_and_reset():
    clean = Symbol("clean")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(clean, clean.implies(ready))

    assert knowledge.clear() is knowledge
    assert len(knowledge) == 0
    assert knowledge.formula() == "TRUE"

    assert knowledge.reset(clean) is knowledge
    assert knowledge.to_list() == [clean]


def test_knowledge_base_copy_is_independent_container():
    clean = Symbol("clean")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(clean)
    copied = knowledge.copy()

    copied.add(clean.implies(ready))

    assert len(knowledge) == 1
    assert len(copied) == 2
    assert copied.ask(ready) is True


def test_knowledge_base_can_explain_answer():
    symbols = create_symbols("has_data", "can_train")
    has_data = symbols["has_data"]
    can_train = symbols["can_train"]

    knowledge = KnowledgeBase(
        has_data,
        has_data.implies(can_train),
    )

    result = knowledge.explain(can_train)

    assert result.answer is True
    assert result.consistent is True
    assert result.query == "can_train"
    assert result.symbols == ["can_train", "has_data"]
    assert result.to_dict()["answer"] is True


def test_sentence_operator_helpers_make_rules_shorter():
    clean = Symbol("clean_data")
    tokens = Symbol("has_tokens")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(
        clean,
        tokens,
        (clean & tokens).implies(ready),
    )

    assert knowledge.ask(ready) is True
    assert "AND" in knowledge.formula()


def test_model_check_still_accepts_plain_sentences():
    p = Symbol("P")
    q = Symbol("Q")

    knowledge = p & p.implies(q)

    assert model_check(knowledge, q) is True


def test_knowledge_base_can_check_consistency():
    clean = Symbol("clean")

    knowledge = KnowledgeBase(clean, ~clean)

    assert knowledge.is_consistent() is False
    assert knowledge.possible_models() == []


def test_knowledge_base_returns_possible_models():
    clean = Symbol("clean")
    ready = Symbol("ready")

    knowledge = KnowledgeBase(clean.implies(ready), clean)

    models = knowledge.possible_models()

    assert {"clean": True, "ready": True} in models


def test_ai_workflow_rules_can_prove_release_ready():
    symbols = create_symbols(
        "external_model",
        "license_ok",
        "data_ready",
        "eval_passed",
        "safety_passed",
        "can_train",
        "release_ready",
    )

    knowledge = KnowledgeBase(
        (
            symbols["external_model"]
            & symbols["license_ok"]
            & symbols["data_ready"]
        ).implies(symbols["can_train"]),
        (
            symbols["can_train"]
            & symbols["eval_passed"]
            & symbols["safety_passed"]
        ).implies(symbols["release_ready"]),
    )

    knowledge.add_all(
        [
            symbols["external_model"],
            symbols["license_ok"],
            symbols["data_ready"],
            symbols["eval_passed"],
            symbols["safety_passed"],
        ]
    )

    assert knowledge.ask(symbols["release_ready"]) is True
