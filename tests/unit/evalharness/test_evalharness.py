"""Unit tests for arclm.evalharness (torch-free)."""

import json
from pathlib import Path

import pytest

from arclm.evalharness import Case, load_cases, run_evalset
from arclm.exceptions import EvalHarnessError


def test_case_from_dict_validation():
    c = Case.from_dict({"input": "hi", "expected": "HI", "match": "icontains", "id": "1"})
    assert c.input == "hi"
    assert c.match == "icontains"
    with pytest.raises(EvalHarnessError):
        Case.from_dict({"expected": "missing input"})
    with pytest.raises(EvalHarnessError):
        Case.from_dict({"input": "x", "match": "regex_unknown"})


def test_run_evalset_scoring_modes():
    cases = [
        Case(input="2+2", expected="4", match="exact"),
        Case(input="hello", expected="hello", match="icontains"),
        Case(input="abc", expected="xyz", match="exact"),
    ]
    rep = run_evalset(cases, lambda q: {"2+2": "4", "hello": "Hello!"}.get(q, "abc"))
    assert rep.total == 3
    assert rep.passed == 2
    assert rep.failed == 1
    assert rep.errors == 0
    assert rep.pass_rate == pytest.approx(2 / 3)
    assert len(rep.failed_cases()) == 1
    d = rep.to_dict()
    assert d["passed"] == 2
    json.dumps(d)  # serializable


def test_run_evalset_captures_fn_errors():
    def boom(q):
        raise RuntimeError("model exploded")

    rep = run_evalset([Case(input="x", expected="y")], boom)
    assert rep.errors == 1
    assert rep.results[0].error and "model exploded" in rep.results[0].error


def test_run_evalset_callable_checker():
    cases = [Case(input="q", expected=None, match="callable", id="c1")]

    def checker(case, actual):
        return actual == "SPECIAL"

    def fn(q):
        return "SPECIAL" if q == "q" else "no"

    rep = run_evalset(cases, fn, checkers={"callable": checker})
    assert rep.passed == 1


def test_load_cases_jsonl(tmp_path):
    p = tmp_path / "c.jsonl"
    p.write_text(
        json.dumps({"input": "a", "expected": "a"}) + "\n\n"
        + json.dumps({"input": "b", "expected": "b", "id": "custom"}) + "\n",
        encoding="utf-8",
    )
    cases = load_cases(p)
    assert len(cases) == 2
    assert cases[1].id == "custom"

    bad = tmp_path / "bad.jsonl"
    bad.write_text("{not json}\n", encoding="utf-8")
    with pytest.raises(EvalHarnessError):
        load_cases(bad)
    with pytest.raises(EvalHarnessError):
        load_cases(tmp_path / "missing.jsonl")


def test_report_save(tmp_path):
    rep = run_evalset([Case(input="x", expected="x")], lambda q: q)
    out = rep.save(tmp_path / "r.json")
    data = json.loads(out.read_text(encoding="utf-8"))
    assert data["pass_rate"] == 1.0
