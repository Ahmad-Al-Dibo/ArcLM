"""Voorbeeld: print de externe multi-GPU validatiematrix.

Dit voorbeeld start geen training en kiest geen cloudprovider. Het laat alleen
zien welke commands en release gates later op geschikte hardware moeten draaien.
"""

from __future__ import annotations

from arclm.distributed import get_external_multi_gpu_validation_matrix


def main() -> None:
    for target in get_external_multi_gpu_validation_matrix():
        print(f"{target.target_id}: {target.name}")
        print(f"  status: {target.implementation_status}")
        print(f"  local: {target.local_runtime_status}")
        print(f"  external: {target.external_runtime_status}")
        print(f"  hardware: {target.required_hardware}")
        print(f"  command: {target.command}")
        print(f"  release gate: {target.release_gate}")
        print()


if __name__ == "__main__":
    main()
