"""Compatibility shim for legacy ``python setup.py`` commands.

Package metadata, dependencies, entry points, and build settings live in
``pyproject.toml``.
"""

from setuptools import setup


if __name__ == "__main__":
    setup()
