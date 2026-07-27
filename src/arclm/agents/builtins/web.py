"""Safe bounded website-reading tools."""

from __future__ import annotations

import ipaddress
import socket
from dataclasses import dataclass
from typing import Callable
from urllib.error import URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

from arclm.agents.builtins.documents import html_to_text
from arclm.agents.permissions import SideEffectLevel, ToolPermission
from arclm.agents.results import ToolResult
from arclm.agents.tool import Tool


FetchResult = tuple[int, dict[str, str], bytes, str]


@dataclass
class SafeWebReader:
    """Bounded HTTP(S) reader with private-address protections."""

    fetcher: Callable[[str, float], FetchResult] | None = None
    timeout_seconds: float = 10.0
    max_response_bytes: int = 1_000_000
    max_redirects: int = 5
    allowed_content_types: tuple[str, ...] = ("text/html", "text/plain")

    def read(self, url: str) -> ToolResult:
        """Read and convert a safe webpage."""

        try:
            final_url, headers, body = self._fetch_with_redirects(url)
            content_type = headers.get("content-type", headers.get("Content-Type", "")).split(";")[0].strip().lower()
            if content_type and content_type not in self.allowed_content_types:
                return ToolResult.fail("web_content_type_unsupported", "content type is not supported")
            text = body.decode(_charset_from(headers), errors="strict")
            if content_type == "text/html" or text.lstrip().startswith("<"):
                converted = html_to_text.invoke({"html_text": text}).value
            else:
                converted = text
            return ToolResult.ok(
                {"url": final_url, "content_type": content_type or "text/plain", "text": converted},
                content=str(converted),
            )
        except UnicodeDecodeError:
            return ToolResult.fail("web_request_failed", "response encoding is invalid")
        except ValueError as exc:
            code = str(exc)
            if code in {"web_url_invalid", "web_scheme_unsupported", "web_private_address_blocked", "web_response_too_large"}:
                return ToolResult.fail(code, code.replace("_", " "))
            return ToolResult.fail("web_request_failed", "web request failed")
        except (URLError, OSError):
            return ToolResult.fail("web_request_failed", "web request failed")

    def _fetch_with_redirects(self, url: str) -> tuple[str, dict[str, str], bytes]:
        current = _validate_url(url)
        for _ in range(self.max_redirects + 1):
            status, headers, body, final_url = (self.fetcher or _default_fetch)(current, self.timeout_seconds)
            if len(body) > self.max_response_bytes:
                raise ValueError("web_response_too_large")
            if status in {301, 302, 303, 307, 308}:
                location = headers.get("location") or headers.get("Location")
                if not location:
                    raise ValueError("web_request_failed")
                current = _validate_url(urljoin(final_url or current, location))
                continue
            if 200 <= status < 300:
                final = _validate_url(final_url or current)
                return final, headers, body
            raise ValueError("web_request_failed")
        raise ValueError("web_request_failed")


def read_webpage(url: str) -> ToolResult:
    """Read a safe bounded webpage over HTTP(S)."""

    return SafeWebReader().read(url)


def create_read_webpage_tool(fetcher: Callable[[str, float], FetchResult] | None = None) -> Tool:
    """Create a safe webpage reader tool, optionally with a mocked fetcher."""

    reader = SafeWebReader(fetcher=fetcher)

    def _read_webpage(url: str) -> ToolResult:
        """Read a safe bounded webpage."""

        return reader.read(url)

    return Tool.from_callable(
        _read_webpage,
        name="read_webpage",
        description="Read a safe bounded HTTP(S) webpage as text.",
        category="web",
        permission=ToolPermission.READ_NETWORK,
        side_effect=SideEffectLevel.READ_ONLY,
    )


def _validate_url(url: str) -> str:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("web_scheme_unsupported")
    if not parsed.netloc:
        raise ValueError("web_url_invalid")
    host = parsed.hostname
    if not host:
        raise ValueError("web_url_invalid")
    if _host_is_private(host):
        raise ValueError("web_private_address_blocked")
    return url


def _host_is_private(host: str) -> bool:
    try:
        addresses = [ipaddress.ip_address(host)]
    except ValueError:
        addresses = []
        for result in socket.getaddrinfo(host, None):
            addresses.append(ipaddress.ip_address(result[4][0]))
    return any(
        address.is_private
        or address.is_loopback
        or address.is_link_local
        or address.is_multicast
        or address.is_reserved
        or address.is_unspecified
        for address in addresses
    )


def _default_fetch(url: str, timeout: float) -> FetchResult:
    request = Request(url, headers={"User-Agent": "ArcLM-AgentRuntime/0"})
    with urlopen(request, timeout=timeout) as response:
        body = response.read()
        return int(response.status), dict(response.headers.items()), body, response.geturl()


def _charset_from(headers: dict[str, str]) -> str:
    content_type = headers.get("content-type", headers.get("Content-Type", ""))
    for part in content_type.split(";"):
        part = part.strip()
        if part.lower().startswith("charset="):
            return part.split("=", 1)[1]
    return "utf-8"
