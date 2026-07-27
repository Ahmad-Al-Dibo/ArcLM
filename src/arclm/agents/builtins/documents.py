"""Pure document conversion tools and safe local text reading."""

from __future__ import annotations

import html
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from arclm.agents.permissions import SideEffectLevel, ToolPermission
from arclm.agents.results import ToolResult
from arclm.agents.tool import Tool, tool


MAX_DOCUMENT_BYTES = 1_000_000
SUPPORTED_TEXT_EXTENSIONS = {".txt", ".md", ".json", ".jsonl", ".csv", ".html", ".htm"}


@tool(category="documents")
def markdown_to_text(markdown: str) -> str:
    """Convert basic Markdown to plain text."""

    _check_size(markdown)
    document = _parse_markdown(markdown)
    lines: list[str] = []
    for section in document["sections"]:
        if section["heading"]:
            lines.append(section["heading"])
            lines.append("")
        for block in section["content"]:
            if block["type"] == "paragraph":
                lines.append(block["text"])
                lines.append("")
            elif block["type"] == "list":
                lines.extend(block["items"])
                lines.append("")
            elif block["type"] == "code_block":
                lines.append(block["text"])
                lines.append("")
            elif block["type"] == "quote":
                lines.append(block["text"])
                lines.append("")
    return "\n".join(lines).strip()


@tool(category="documents")
def markdown_to_document(markdown: str) -> dict[str, Any]:
    """Convert basic Markdown to a structured document."""

    _check_size(markdown)
    return _parse_markdown(markdown)


@tool(category="documents")
def markdown_to_json(markdown: str) -> dict[str, Any]:
    """Convert basic Markdown to structured JSON."""

    _check_size(markdown)
    return _parse_markdown(markdown)


@tool(category="documents")
def html_to_text(html_text: str) -> str:
    """Convert safe HTML content to plain text."""

    return _html_document(html_text)["text"]


@tool(category="documents")
def html_to_document(html_text: str) -> dict[str, Any]:
    """Convert safe HTML content to a structured document."""

    return _html_document(html_text)


@tool(category="documents")
def html_to_json(html_text: str) -> dict[str, Any]:
    """Convert safe HTML content to structured JSON."""

    return _html_document(html_text)


def read_text_file(path: str, *, workspace_root: Path, max_bytes: int = MAX_DOCUMENT_BYTES) -> dict[str, str | int]:
    """Read a bounded text file inside an explicit workspace root."""

    root = Path(workspace_root).resolve()
    requested = Path(path)
    if requested.is_absolute():
        raise ValueError("absolute paths are not allowed")
    candidate = (root / requested).resolve()
    try:
        candidate.relative_to(root)
    except ValueError as exc:
        raise ValueError("path traversal is not allowed") from exc
    if candidate.suffix.lower() not in SUPPORTED_TEXT_EXTENSIONS:
        raise ValueError("unsupported text-file extension")
    if not candidate.exists() or not candidate.is_file():
        raise FileNotFoundError("text file was not found")
    if candidate.is_symlink():
        raise ValueError("symlink files are not allowed")
    size = candidate.stat().st_size
    if size > max_bytes:
        raise ValueError("text file is too large")
    data = candidate.read_bytes()
    try:
        text = data.decode("utf-8")
        encoding = "utf-8"
    except UnicodeDecodeError:
        text = data.decode("utf-8-sig")
        encoding = "utf-8-sig"
    return {
        "path": candidate.relative_to(root).as_posix(),
        "text": text,
        "bytes": size,
        "encoding": encoding,
    }


def create_read_text_file_tool(workspace_root: str | Path, *, max_bytes: int = MAX_DOCUMENT_BYTES) -> Tool:
    """Create a read-only text-file tool scoped to one workspace root."""

    def _read_text_file(path: str) -> dict[str, str | int]:
        """Read a bounded text file from the configured workspace."""

        return read_text_file(path, workspace_root=Path(workspace_root), max_bytes=max_bytes)

    return Tool.from_callable(
        _read_text_file,
        name="read_text_file",
        description="Read a bounded text file from the configured workspace.",
        category="documents",
        permission=ToolPermission.READ_LOCAL,
        side_effect=SideEffectLevel.READ_ONLY,
    )


def _parse_markdown(markdown: str) -> dict[str, Any]:
    title = None
    sections: list[dict[str, Any]] = []
    current = {"level": 0, "heading": "", "content": []}
    paragraph: list[str] = []
    list_items: list[str] = []
    in_code = False
    code_lines: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            current["content"].append({"type": "paragraph", "text": _inline_text(" ".join(paragraph))})
            paragraph = []

    def flush_list() -> None:
        nonlocal list_items
        if list_items:
            current["content"].append({"type": "list", "items": list(list_items)})
            list_items = []

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()
        if line.strip().startswith("```"):
            if in_code:
                current["content"].append({"type": "code_block", "text": "\n".join(code_lines)})
                code_lines = []
                in_code = False
            else:
                flush_paragraph()
                flush_list()
                in_code = True
            continue
        if in_code:
            code_lines.append(raw_line)
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading:
            flush_paragraph()
            flush_list()
            if current["heading"] or current["content"]:
                sections.append(current)
            level = len(heading.group(1))
            text = _inline_text(heading.group(2))
            title = title or text
            current = {"level": level, "heading": text, "content": []}
            continue
        if re.match(r"^\s*(-|\*|\+|\d+\.)\s+", line):
            flush_paragraph()
            list_items.append(_inline_text(re.sub(r"^\s*(-|\*|\+|\d+\.)\s+", "", line)))
            continue
        if line.strip().startswith(">"):
            flush_paragraph()
            flush_list()
            current["content"].append({"type": "quote", "text": _inline_text(line.strip()[1:].strip())})
            continue
        if re.match(r"^\s*(-{3,}|\*{3,}|_{3,})\s*$", line):
            flush_paragraph()
            flush_list()
            current["content"].append({"type": "horizontal_rule"})
            continue
        if not line.strip():
            flush_paragraph()
            flush_list()
            continue
        paragraph.append(line.strip())
    flush_paragraph()
    flush_list()
    if in_code:
        current["content"].append({"type": "code_block", "text": "\n".join(code_lines)})
    if current["heading"] or current["content"]:
        sections.append(current)
    return {"type": "document", "title": title, "sections": sections}


def _inline_text(text: str) -> str:
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", text)
    text = re.sub(r"[*_]{1,3}([^*_]+)[*_]{1,3}", r"\1", text)
    return html.unescape(text).strip()


def _html_document(html_text: str) -> dict[str, Any]:
    _check_size(html_text)
    parser = _SafeHTMLParser()
    parser.feed(html_text)
    return parser.document()


def _check_size(text: str) -> None:
    if len(text.encode("utf-8")) > MAX_DOCUMENT_BYTES:
        raise ValueError("document input is too large")


class _SafeHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.current_tag: str | None = None
        self.blocks: list[dict[str, Any]] = []
        self.text_parts: list[str] = []
        self.links: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "template", "noscript"}:
            self.skip_depth += 1
            return
        self.current_tag = tag
        if tag == "a":
            href = dict(attrs).get("href")
            if href:
                self.links.append({"text": "", "url": href})

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "template", "noscript"} and self.skip_depth:
            self.skip_depth -= 1
            return
        if tag in {"p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"}:
            self._flush(tag)
        self.current_tag = None

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        text = " ".join(data.split())
        if not text:
            return
        self.text_parts.append(text)
        if self.current_tag == "a" and self.links:
            self.links[-1]["text"] += text

    def _flush(self, tag: str) -> None:
        text = " ".join(self.text_parts).strip()
        self.text_parts = []
        if not text:
            return
        if tag.startswith("h") and len(tag) == 2 and tag[1].isdigit():
            self.blocks.append({"type": "heading", "level": int(tag[1]), "text": text})
        elif tag == "li":
            self.blocks.append({"type": "list_item", "text": text})
        elif tag == "blockquote":
            self.blocks.append({"type": "quote", "text": text})
        else:
            self.blocks.append({"type": "paragraph", "text": text})

    def document(self) -> dict[str, Any]:
        self._flush("p")
        return {
            "type": "document",
            "text": "\n".join(block["text"] for block in self.blocks if "text" in block),
            "blocks": self.blocks,
            "links": [link for link in self.links if link.get("text") or link.get("url")],
        }
