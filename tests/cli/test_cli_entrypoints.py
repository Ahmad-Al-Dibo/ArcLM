"""Tests voor de publieke CLI entrypoints."""

import os
import subprocess
import sys
from argparse import Namespace


def run_cli(*args):
    """Voert de CLI uit zoals een gebruiker dat via python -m doet."""
    env = dict(os.environ)
    env["PYTHONPATH"] = "src"
    return subprocess.run(
        [sys.executable, "-m", "arclm", *args],
        capture_output=True,
        text=True,
        env=env,
        check=False,
    )


def combined_output(result):
    """Geeft stdout en stderr samen terug voor makkelijke checks."""
    return f"{result.stdout}\n{result.stderr}"


def test_main_help_discovers_existing_commands():
    result = run_cli("--help")

    assert result.returncode == 0
    output = combined_output(result)
    assert "train" in output
    assert "eval" in output
    assert "generate" in output
    assert "chat" in output
    assert "doctor" in output


def test_subcommand_help_returns_success():
    for command in ("train", "eval", "generate", "chat", "doctor"):
        result = run_cli(command, "--help")

        assert result.returncode == 0
        assert f"arclm {command}" in combined_output(result)


def test_version_returns_success():
    result = run_cli("--version")

    assert result.returncode == 0
    assert "ArcLM" in combined_output(result)


def test_invalid_command_returns_argparse_error():
    result = run_cli("unknown-command")

    assert result.returncode == 2
    assert "invalid choice" in result.stderr


def test_train_missing_required_data_returns_argparse_error():
    result = run_cli("train")

    assert result.returncode == 2
    assert "--data" in result.stderr


def test_eval_missing_model_reports_clear_error_without_traceback():
    result = run_cli("eval", "--model", "missing-model.pth", "--data", "missing-data.txt")
    output = combined_output(result)

    assert result.returncode == 1
    assert "Error" in output
    assert "missing-model.pth" in output
    assert "Traceback" not in output


def test_generate_missing_model_reports_clear_error_without_traceback():
    result = run_cli("generate", "--model", "missing-model.pth", "--prompt", "hello")
    output = combined_output(result)

    assert result.returncode == 1
    assert "Error" in output
    assert "missing-model.pth" in output
    assert "Traceback" not in output


def test_chat_command_keeps_history_and_exits(monkeypatch, capsys):
    from arclm import cli
    import arclm.inference as inference

    calls = []

    class FakeModel:
        def chat(self, messages, **kwargs):
            calls.append([dict(message) for message in messages])
            return "reply"

    monkeypatch.setattr(inference, "load_any_model", lambda *args, **kwargs: FakeModel())
    prompts = iter(["first question", "second question", "/exit"])
    monkeypatch.setattr("builtins.input", lambda _: next(prompts))
    args = Namespace(
        model="local-model",
        device="cpu",
        trust_remote_code=False,
        system_prompt="Be concise.",
        max_new_tokens=12,
        temperature=0.5,
    )

    assert cli.chat_command(args) == 0
    assert calls[0] == [
        {"role": "system", "content": "Be concise."},
        {"role": "user", "content": "first question"},
    ]
    assert calls[1][-2:] == [
        {"role": "user", "content": "second question"},
        {"role": "assistant", "content": "reply"},
    ]
    assert "ArcLM: reply" in capsys.readouterr().out


def test_doctor_reports_safe_runtime_without_traceback():
    result = run_cli("doctor")
    output = combined_output(result)

    assert result.returncode == 0
    assert "ArcLM version:" in output
    assert "Optional integrations:" in output
    assert "Traceback" not in output


def test_doctor_json_reports_safe_runtime_without_traceback():
    result = run_cli("doctor", "--json")
    output = combined_output(result)

    assert result.returncode == 0
    assert '"arclm_version"' in output
    assert '"optional_dependencies"' in output
    assert "Traceback" not in output
