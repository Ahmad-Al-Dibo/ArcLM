from pathlib import Path

import pytest

from arclm.agents.builtins.documents import create_read_text_file_tool, read_text_file
from arclm.agents.builtins.web import SafeWebReader


def test_safe_text_file_reader_accepts_only_workspace_files(tmp_path):
    root = tmp_path / "workspace"
    root.mkdir()
    (root / "note.md").write_text("# ArcLM", encoding="utf-8")

    assert read_text_file("note.md", workspace_root=root)["text"] == "# ArcLM"
    assert create_read_text_file_tool(root).invoke({"path": "note.md"}).success

    with pytest.raises(ValueError):
        read_text_file("../note.md", workspace_root=root)
    with pytest.raises(ValueError):
        read_text_file(str((root / "note.md").resolve()), workspace_root=root)
    (root / "binary.bin").write_text("x", encoding="utf-8")
    with pytest.raises(ValueError):
        read_text_file("binary.bin", workspace_root=root)


def test_safe_text_file_reader_rejects_symlink_escape(tmp_path):
    root = tmp_path / "workspace"
    root.mkdir()
    outside = tmp_path / "outside.md"
    outside.write_text("secret", encoding="utf-8")
    link = root / "link.md"
    try:
        link.symlink_to(outside)
    except (OSError, NotImplementedError):
        pytest.skip("symlinks unavailable on this platform")

    with pytest.raises(ValueError):
        read_text_file("link.md", workspace_root=root)


def test_web_reader_mocked_success_and_safety_errors(monkeypatch):
    monkeypatch.setattr("arclm.agents.builtins.web._host_is_private", lambda host: host != "example.com")

    def fetcher(url, timeout):
        return 200, {"content-type": "text/html"}, b"<h1>ArcLM</h1><script>x</script>", url

    result = SafeWebReader(fetcher=fetcher).read("https://example.com")
    assert result.success
    assert "ArcLM" in result.value["text"]
    assert "script" not in result.value["text"]

    assert SafeWebReader(fetcher=fetcher).read("file:///tmp/x").error_code == "web_scheme_unsupported"
    assert SafeWebReader(fetcher=fetcher).read("https://127.0.0.1").error_code == "web_private_address_blocked"


def test_web_reader_redirect_to_private_ip_is_rejected(monkeypatch):
    monkeypatch.setattr("arclm.agents.builtins.web._host_is_private", lambda host: host.startswith("127."))

    def fetcher(url, timeout):
        if url == "https://example.com":
            return 302, {"location": "http://127.0.0.1"}, b"", url
        return 200, {"content-type": "text/plain"}, b"private", url

    result = SafeWebReader(fetcher=fetcher).read("https://example.com")
    assert result.error_code == "web_private_address_blocked"
