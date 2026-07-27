"""Distribution-aware ArcLM CLI."""

from __future__ import annotations

import argparse
from ._distribution import DISTRIBUTION_INFO

def main(argv=None):
    parser = argparse.ArgumentParser(prog='arclm', description=DISTRIBUTION_INFO['edition_name'])
    parser.add_argument('--version', action='store_true')
    parser.add_argument('--run', choices=['simple-interface', 'simple_interface'], default=None)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=5000)
    parser.add_argument('--debug', action='store_true')
    parser.add_argument('--no-debug', action='store_true')
    args = parser.parse_args(argv)
    if args.version:
        from ._version import __version__
        print(__version__)
        return 0
    if args.run in {'simple-interface', 'simple_interface'}:
        if 'simple_interface' not in DISTRIBUTION_INFO.get('capabilities', []):
            raise SystemExit("This ArcLM edition does not include '{module}'. Install full ArcLM or build an edition that includes this capability.".format(module='simple_interface'))
        from .simple_interface import run_simple_interface
        return run_simple_interface(host=args.host, port=args.port, debug=args.debug and not args.no_debug)
    parser.print_help()
    return 0
