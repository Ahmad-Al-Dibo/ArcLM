"""Voorbeeld: simpele lokale multiprocessing met ArcLM."""

from __future__ import annotations

from arclm.distributed import DistributedConfig, launch_processes


def square_worker(config: DistributedConfig) -> dict[str, int]:
    """Berekent een klein getal per worker."""
    value = config.rank + 1
    return {
        "rank": config.rank,
        "world_size": config.world_size,
        "value": value,
        "square": value * value,
    }


def main() -> None:
    """Start twee lokale workers en print hun resultaten."""
    config = DistributedConfig(world_size=2, timeout_seconds=20)
    result = launch_processes(config, square_worker, max_processes=2)
    result.raise_for_errors()

    for worker in result.workers:
        print(worker.result)


if __name__ == "__main__":
    main()
