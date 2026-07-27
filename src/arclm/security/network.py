"""Network and URL safety helpers."""

from __future__ import annotations

import ipaddress
import socket
from urllib.parse import urlparse

from .errors import SecurityPolicyError


def validate_url_for_fetch(url: str, *, allow_private: bool = False) -> str:
    """Validate an HTTP(S) URL before a network fetch."""

    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise SecurityPolicyError("only HTTP(S) URLs are allowed")
    if not parsed.hostname:
        raise SecurityPolicyError("URL host is required")
    if not allow_private and host_is_private(parsed.hostname):
        raise SecurityPolicyError("private network destinations are blocked")
    return url


def host_is_private(host: str) -> bool:
    """Return whether a host resolves to private or local addresses."""

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
        or address.is_reserved
        or address.is_unspecified
        for address in addresses
    )
