import json


def test_legacy_arclm_sft_helpers_still_import(tmp_path):
    from arclm.sft import _find_subsequence, _load_sft_records, train_sft

    path = tmp_path / "records.jsonl"
    path.write_text(
        json.dumps(
            {
                "messages": [
                    {"role": "user", "content": "Hi"},
                    {"role": "assistant", "content": "Hello"},
                ]
            }
        )
        + "\n",
        encoding="utf-8",
    )

    records = _load_sft_records(str(path))

    assert callable(train_sft)
    assert _find_subsequence([1, 2, 3], [2, 3]) == 1
    assert records[0][-1]["content"] == "Hello"


def test_new_sft_api_lives_under_finetuning():
    from arclm.finetuning import SFTConfig, SFTTrainer

    assert SFTConfig is not None
    assert SFTTrainer is not None
