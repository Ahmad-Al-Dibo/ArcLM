"""Beheer van lokale datasetbronnen voor de Web API."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Iterable

from arclm.exceptions import ConfigurationError

from .config import DatasetRoot, WebConfig
from .datasets import SUPPORTED_FORMATS
from .schemas import DatasetRootInfo, DatasetWarning


class DatasetSourceError(Exception):
    """Fout die veilig naar de dataset-source API kan worden vertaald."""

    def __init__(self, code: str, message: str, status_code: int = 400):
        """Bewaart een stabiele foutcode en Engelse melding."""
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


@dataclass(frozen=True)
class RootScanResult:
    """Kleine samenvatting van een bounded rootscan."""

    supported_file_count: int
    ignored_file_count: int
    warnings: tuple[DatasetWarning, ...] = ()


class DatasetSourceManager:
    """Beheert opgeslagen en sessie-only datasetbronnen."""

    def __init__(self, config: WebConfig):
        """Laadt de opgeslagen roots en voegt daarna CLI-roots toe."""
        self.config = config
        self.config_path = _dataset_config_path(config)
        self._session_roots = tuple(
            DatasetRoot(
                name=root.name,
                path=root.path,
                root_id=root.root_id,
                enabled=root.enabled,
                recursive=root.recursive,
                source_origin="command_line",
            )
            for root in config.dataset_roots
        )
        self._persisted: tuple[DatasetRoot, ...] = ()
        self._persisted = self._load_persisted_roots()

    def list_roots(self) -> list[DatasetRootInfo]:
        """Geeft alle roots terug met veilige beheerinformatie."""
        return [self._to_info(root) for root in self.all_roots()]

    def all_roots(self) -> tuple[DatasetRoot, ...]:
        """Geeft opgeslagen roots plus niet-dubbele CLI-roots terug."""
        roots = list(self._persisted)
        seen_names = {root.name for root in roots}
        seen_paths = {_path_key(_resolve(root.path)) for root in roots}
        for root in self._session_roots:
            path_key = _path_key(_resolve(root.path))
            if root.name in seen_names or path_key in seen_paths:
                continue
            roots.append(root)
            seen_names.add(root.name)
            seen_paths.add(path_key)
        return tuple(roots)

    def active_roots(self) -> tuple[DatasetRoot, ...]:
        """Geeft alleen ingeschakelde roots terug voor de catalogus."""
        return tuple(root for root in self.all_roots() if root.enabled)

    def add_root(self, name: str, path: str, recursive: bool = False) -> DatasetRootInfo:
        """Valideert en bewaart een nieuwe persistente datasetbron."""
        self._ensure_room()
        root = self._validated_root(name=name, path=path, recursive=recursive)
        self._persisted = (*self._persisted, root)
        self._save()
        return self._to_info(root)

    def update_root(
        self,
        root_id: str,
        *,
        name: str | None = None,
        enabled: bool | None = None,
        recursive: bool | None = None,
    ) -> DatasetRootInfo:
        """Wijzigt veilige velden van een persistente root."""
        root = self._find_persisted(root_id)
        new_name = root.name if name is None else _validate_name(name)
        new_enabled = root.enabled if enabled is None else enabled
        new_recursive = root.recursive if recursive is None else recursive
        if not isinstance(new_enabled, bool):
            raise DatasetSourceError("invalid_dataset_root", "enabled must be a boolean")
        if not isinstance(new_recursive, bool):
            raise DatasetSourceError("invalid_dataset_root", "recursive must be a boolean")

        updated = self._validated_root(
            name=new_name,
            path=str(root.path),
            recursive=new_recursive,
            enabled=new_enabled,
            current_root_id=root.root_id,
        )
        self._persisted = tuple(updated if item.root_id == root_id else item for item in self._persisted)
        self._save()
        return self._to_info(updated)

    def remove_root(self, root_id: str) -> DatasetRootInfo:
        """Verwijdert alleen de configuratie, nooit bestanden op schijf."""
        root = self._find_persisted(root_id)
        self._persisted = tuple(item for item in self._persisted if item.root_id != root_id)
        self._save()
        return self._to_info(root)

    def validate_root(self, root_id: str) -> DatasetRootInfo:
        """Valideert een bestaande root opnieuw zonder te schrijven."""
        root = self._find_any(root_id)
        return self._to_info(root)

    def refresh_summary(self) -> tuple[int, int, list[DatasetWarning]]:
        """Scant actieve roots en geeft een kleine refreshsamenvatting terug."""
        roots_scanned = 0
        datasets_found = 0
        warnings: list[DatasetWarning] = []
        for root in self.active_roots():
            roots_scanned += 1
            scan = self._scan(root)
            datasets_found += scan.supported_file_count
            warnings.extend(scan.warnings)
        return roots_scanned, datasets_found, warnings

    def _validated_root(
        self,
        *,
        name: str,
        path: str,
        recursive: bool,
        enabled: bool = True,
        current_root_id: str | None = None,
    ) -> DatasetRoot:
        """Maakt een root nadat naam, pad en duplicates zijn gecontroleerd."""
        safe_name = _validate_name(name)
        if not isinstance(recursive, bool):
            raise DatasetSourceError("invalid_dataset_root", "recursive must be a boolean")
        if not isinstance(enabled, bool):
            raise DatasetSourceError("invalid_dataset_root", "enabled must be a boolean")
        resolved = _validate_path(path)
        root = DatasetRoot(
            name=safe_name,
            path=resolved,
            root_id=current_root_id or _root_id_for_path(resolved),
            enabled=enabled,
            recursive=recursive,
            source_origin="persisted",
        )
        self._check_duplicates(root, current_root_id=current_root_id)
        return root

    def _check_duplicates(self, root: DatasetRoot, current_root_id: str | None = None) -> None:
        """Blokkeert gelijke namen en canoniek gelijke paden."""
        target_path = _path_key(_resolve(root.path))
        for existing in self.all_roots():
            if existing.root_id == current_root_id:
                continue
            if existing.name == root.name:
                raise DatasetSourceError("dataset_root_duplicate_name", "Dataset source name already exists.")
            if _path_key(_resolve(existing.path)) == target_path:
                raise DatasetSourceError("dataset_root_duplicate_path", "Dataset source path already exists.")

    def _to_info(self, root: DatasetRoot) -> DatasetRootInfo:
        """Zet een interne root om naar het API-model."""
        try:
            scan = self._scan(root) if root.enabled else RootScanResult(0, 0)
            warnings = list(scan.warnings)
            validation_status = "valid"
            nested = self._nested_warnings(root)
            warnings.extend(nested)
            if warnings:
                validation_status = "warning"
            return DatasetRootInfo(
                root_id=root.root_id or _root_id_for_path(_resolve(root.path)),
                name=root.name,
                path=str(_resolve(root.path)),
                enabled=root.enabled,
                recursive=root.recursive,
                source_origin=root.source_origin,
                validation_status=validation_status,
                supported_file_count=scan.supported_file_count,
                ignored_file_count=scan.ignored_file_count,
                warnings=warnings,
                removable=root.source_origin == "persisted",
                editable=root.source_origin == "persisted",
            )
        except DatasetSourceError as exc:
            return DatasetRootInfo(
                root_id=root.root_id or "root_invalid",
                name=root.name,
                path=str(root.path),
                enabled=root.enabled,
                recursive=root.recursive,
                source_origin=root.source_origin,
                validation_status="error",
                supported_file_count=0,
                ignored_file_count=0,
                warnings=[DatasetWarning(code=exc.code, message=exc.message)],
                removable=root.source_origin == "persisted",
                editable=root.source_origin == "persisted",
            )

    def _scan(self, root: DatasetRoot) -> RootScanResult:
        """Telt ondersteunde bestanden zonder inhoud te lezen."""
        resolved = _validate_path(str(root.path))
        supported = 0
        ignored = 0
        warnings: list[DatasetWarning] = []
        for candidate in _iter_files(resolved, root.recursive, self.config.max_recursive_depth):
            if candidate.suffix.lower() in SUPPORTED_FORMATS:
                supported += 1
            else:
                ignored += 1
            if supported > self.config.max_catalogue_entries:
                warnings.append(
                    DatasetWarning(
                        code="dataset_catalogue_limit_reached",
                        message="Only the configured catalogue limit was counted.",
                    )
                )
                break
        if root.recursive:
            warnings.extend(_recursive_depth_warnings(resolved, self.config.max_recursive_depth))
        return RootScanResult(supported, ignored, tuple(warnings))

    def _nested_warnings(self, root: DatasetRoot) -> list[DatasetWarning]:
        """Waarschuwt wanneer roots elkaar kunnen overlappen."""
        warnings: list[DatasetWarning] = []
        path = _resolve(root.path)
        for other in self.all_roots():
            if other.root_id == root.root_id:
                continue
            other_path = _resolve(other.path)
            if _is_nested(path, other_path):
                warnings.append(
                    DatasetWarning(
                        code="nested_dataset_root",
                        message="This dataset source overlaps another configured source.",
                    )
                )
                break
        return warnings

    def _find_any(self, root_id: str) -> DatasetRoot:
        """Zoekt een root in opgeslagen en sessie-only roots."""
        for root in self.all_roots():
            if root.root_id == root_id:
                return root
        raise DatasetSourceError("dataset_root_not_found", "Dataset source was not found.", status_code=404)

    def _find_persisted(self, root_id: str) -> DatasetRoot:
        """Zoekt alleen roots die naar de JSON store mogen schrijven."""
        for root in self._persisted:
            if root.root_id == root_id:
                return root
        for root in self._session_roots:
            if root.root_id == root_id:
                raise DatasetSourceError(
                    "dataset_root_session_only",
                    "Session-only dataset sources cannot be changed here.",
                    status_code=400,
                )
        raise DatasetSourceError("dataset_root_not_found", "Dataset source was not found.", status_code=404)

    def _ensure_room(self) -> None:
        """Controleert het maximum aantal persistente roots."""
        if len(self._persisted) >= self.config.max_dataset_roots:
            raise DatasetSourceError(
                "dataset_root_limit_reached",
                "The maximum number of dataset sources has been reached.",
            )

    def _load_persisted_roots(self) -> tuple[DatasetRoot, ...]:
        """Leest de JSON store en valideert elk record."""
        if not self.config_path.exists():
            return ()
        try:
            data = json.loads(self.config_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ConfigurationError("dataset root configuration is corrupt") from exc
        roots = data.get("roots") if isinstance(data, dict) else None
        if not isinstance(roots, list):
            raise ConfigurationError("dataset root configuration is invalid")

        loaded: list[DatasetRoot] = []
        for item in roots:
            if not isinstance(item, dict):
                raise ConfigurationError("dataset root configuration is invalid")
            try:
                root = self._validated_root(
                    name=str(item.get("name", "")),
                    path=str(item.get("path", "")),
                    recursive=bool(item.get("recursive", False)),
                    enabled=bool(item.get("enabled", True)),
                    current_root_id=str(item.get("root_id") or "") or None,
                )
            except DatasetSourceError:
                continue
            loaded.append(root)
        return tuple(loaded)

    def _save(self) -> None:
        """Schrijft de JSON store atomisch weg."""
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "version": 1,
            "roots": [
                {
                    "root_id": root.root_id,
                    "name": root.name,
                    "path": str(_resolve(root.path)),
                    "enabled": root.enabled,
                    "recursive": root.recursive,
                }
                for root in self._persisted
            ],
        }
        with NamedTemporaryFile(
            "w",
            encoding="utf-8",
            dir=str(self.config_path.parent),
            delete=False,
        ) as file:
            json.dump(payload, file, indent=2)
            file.write("\n")
            temp_name = file.name
        Path(temp_name).replace(self.config_path)


def _dataset_config_path(config: WebConfig) -> Path:
    """Bepaalt waar de lokale datasetroot-config staat."""
    if config.dataset_config_path is not None:
        return Path(config.dataset_config_path).expanduser().resolve()
    base = Path(os.environ.get("ARCLM_CONFIG_DIR", Path.home() / ".arclm"))
    return (base / "dataset-roots.json").expanduser().resolve()


def _validate_name(value: str) -> str:
    """Controleert de gebruikersnaam van een datasetbron."""
    if not isinstance(value, str) or not value.strip():
        raise DatasetSourceError("invalid_dataset_root", "Dataset source name must not be empty.")
    name = value.strip()
    if len(name) > 80:
        raise DatasetSourceError("invalid_dataset_root", "Dataset source name is too long.")
    return name


def _validate_path(value: str) -> Path:
    """Controleert dat een pad een veilige lokale directory is."""
    if not isinstance(value, str) or not value.strip():
        raise DatasetSourceError("invalid_dataset_root_path", "Dataset source path must not be empty.")
    raw = Path(value).expanduser()
    if not raw.is_absolute():
        raise DatasetSourceError("invalid_dataset_root_path", "Dataset source path must be absolute.")
    if _is_unc_path(value):
        raise DatasetSourceError("invalid_dataset_root_path", "Network paths are not allowed by default.")
    try:
        resolved = raw.resolve(strict=True)
    except OSError as exc:
        raise DatasetSourceError("dataset_root_missing", "Dataset source directory does not exist.") from exc
    if raw.is_symlink() or resolved.is_symlink():
        raise DatasetSourceError("invalid_dataset_root_path", "Symlink dataset sources are not allowed.")
    if not resolved.exists():
        raise DatasetSourceError("dataset_root_missing", "Dataset source directory does not exist.")
    if not resolved.is_dir():
        raise DatasetSourceError("invalid_dataset_root_path", "Dataset source path must be a directory.")
    if resolved == Path(resolved.anchor) or resolved.parent == resolved:
        raise DatasetSourceError("invalid_dataset_root_path", "Filesystem roots are not allowed.")
    return resolved


def _is_unc_path(value: str) -> bool:
    """Herkent UNC/networkpaden zonder netwerk te benaderen."""
    return value.startswith("\\\\") or value.startswith("//")


def _resolve(path: str | Path) -> Path:
    """Resolve helper die overal dezelfde vorm gebruikt."""
    return Path(path).expanduser().resolve()


def _path_key(path: Path) -> str:
    """Normaliseert paden voor duplicate checks per platform."""
    text = str(path)
    return text.lower() if os.name == "nt" else text


def _root_id_for_path(path: Path) -> str:
    """Maakt een ID die stabiel blijft bij herstart."""
    import hashlib

    return "root_" + hashlib.sha256(_path_key(path).encode("utf-8")).hexdigest()[:10]


def _iter_files(root: Path, recursive: bool, max_depth: int) -> Iterable[Path]:
    """Loopt door bestanden met een simpele dieptelimiet."""
    if not recursive:
        for item in root.iterdir():
            if item.is_file():
                yield item
        return

    for item in root.rglob("*"):
        try:
            relative = item.relative_to(root)
        except ValueError:
            continue
        if len(relative.parts) - 1 > max_depth:
            continue
        if item.is_file():
            yield item


def _recursive_depth_warnings(root: Path, max_depth: int) -> list[DatasetWarning]:
    """Waarschuwt als er mappen dieper liggen dan de scanlimiet."""
    for item in root.rglob("*"):
        try:
            relative = item.relative_to(root)
        except ValueError:
            continue
        if item.is_dir() and len(relative.parts) > max_depth:
            return [
                DatasetWarning(
                    code="recursive_depth_limit",
                    message="Some subfolders are deeper than the configured recursive scan limit.",
                )
            ]
    return []


def _is_nested(first: Path, second: Path) -> bool:
    """Controleert of twee roots elkaar overlappen."""
    if _path_key(first) == _path_key(second):
        return False
    try:
        first.relative_to(second)
        return True
    except ValueError:
        pass
    try:
        second.relative_to(first)
        return True
    except ValueError:
        return False
