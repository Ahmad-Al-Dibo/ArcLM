from arclm.agents.builtins import html_to_json, html_to_text, markdown_to_json, markdown_to_text


def test_markdown_tools_cover_basic_blocks():
    markdown = """# ArcLM

ArcLM is a language-model framework.

- Native training
- Fine-tuning

> Safe tools

```python
print("ignored, not executed")
```
"""
    text = markdown_to_text.invoke({"markdown": markdown}).value
    document = markdown_to_json.invoke({"markdown": markdown}).value

    assert "ArcLM" in text
    assert "Native training" in text
    assert document["title"] == "ArcLM"
    assert document["sections"][0]["content"][1]["type"] == "list"


def test_html_tools_remove_scripts_styles_and_preserve_links():
    html = """
    <html><head><style>body{}</style><script>alert(1)</script></head>
    <body><h1>ArcLM</h1><p>A native toolkit &amp; lab.</p><a href="https://example.com">Example</a></body></html>
    """

    text = html_to_text.invoke({"html_text": html}).value
    document = html_to_json.invoke({"html_text": html}).value

    assert "alert" not in text
    assert "body" not in text
    assert "native toolkit & lab" in text
    assert document["links"][0]["url"] == "https://example.com"
