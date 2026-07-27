"""ArcLM generated standalone edition root."""

from __future__ import annotations

from importlib import import_module
from typing import Any

from ._version import __api_version__, __version__
from ._distribution import DISTRIBUTION_INFO

__author__ = 'Ahmad Al Dibo'
LICENSE = 'Apache-2.0'

def get_distribution_info() -> dict[str, Any]:
    return dict(DISTRIBUTION_INFO)

def get_version() -> str:
    return __version__

def get_api_version() -> str:
    return __api_version__

def __getattr__(name: str) -> Any:
    raise AttributeError("This ArcLM edition does not export %r from the root namespace. Import an included submodule or install full ArcLM." % name)

__all__ = ['__version__', '__api_version__', 'get_version', 'get_api_version', 'get_distribution_info']
