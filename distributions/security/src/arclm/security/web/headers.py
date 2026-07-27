"""HTTP security header helpers."""

from __future__ import annotations


def security_headers(*, tls: bool = False) -> dict[str, str]:
    """Return conservative security headers."""

    headers = {
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "X-Frame-Options": "DENY",
        "Content-Security-Policy": "default-src 'self'",
    }
    if tls:
        headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return headers
