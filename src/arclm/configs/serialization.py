"""Configbestanden laden en opslaan als YAML of JSON."""

from pathlib import Path
from typing import Dict, Any, Optional
import json

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False

from .base import Config


def load_config_yaml(filepath: str) -> Config:
    """Laadt een configuratie uit een YAML-bestand.
    
    Args:
        filepath: Pad naar het YAML-bestand.
    
    Returns:
        Een `Config` object.
    
    Raises:
        FileNotFoundError: Als het bestand niet bestaat.
        ValueError: Als PyYAML mist of het bestand ongeldig is.
    """
    if not YAML_AVAILABLE:
        raise ValueError(
            "PyYAML not installed. Install with: pip install pyyaml"
        )
    
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"Config file not found: {filepath}")
    
    try:
        with open(filepath, "r") as f:
            config_dict = yaml.safe_load(f)
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML file: {e}")
    
    if not isinstance(config_dict, dict):
        raise ValueError("Config must be a YAML dictionary")
    
    # Maak nested configblokken plat zodat Config ze direct kan lezen.
    flat_config = _flatten_config(config_dict)
    
    return Config(**flat_config)


def load_config_json(filepath: str) -> Config:
    """Laadt een configuratie uit een JSON-bestand.
    
    Args:
        filepath: Pad naar het JSON-bestand.
    
    Returns:
        Een `Config` object.
    
    Raises:
        FileNotFoundError: Als het bestand niet bestaat.
        ValueError: Als de JSON ongeldig is.
    """
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"Config file not found: {filepath}")
    
    try:
        with open(filepath, "r") as f:
            config_dict = json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON file: {e}")
    
    if not isinstance(config_dict, dict):
        raise ValueError("Config must be a JSON object/dictionary")
    
    # Maak nested configblokken plat zodat Config ze direct kan lezen.
    flat_config = _flatten_config(config_dict)
    
    return Config(**flat_config)


def load_config(filepath: str) -> Config:
    """Laadt een configbestand en kiest YAML of JSON op basis van extensie.
    
    Args:
        filepath: Pad naar `.yaml`, `.yml` of `.json`.
    
    Returns:
        Een `Config` object.
    
    Raises:
        FileNotFoundError: Als het bestand niet bestaat.
        ValueError: Als het formaat onbekend of ongeldig is.
    """
    filepath = Path(filepath)
    
    if filepath.suffix in [".yaml", ".yml"]:
        return load_config_yaml(str(filepath))
    elif filepath.suffix == ".json":
        return load_config_json(str(filepath))
    else:
        raise ValueError(
            f"Unknown config format: {filepath.suffix}. "
            "Supported: .yaml, .yml, .json"
        )


def save_config_yaml(config: Config, filepath: str) -> None:
    """Slaat een configuratie op als YAML-bestand.
    
    Args:
        config: Config object om op te slaan.
        filepath: Pad voor het YAML-bestand.
    """
    if not YAML_AVAILABLE:
        raise ValueError(
            "PyYAML not installed. Install with: pip install pyyaml"
        )
    
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    config_dict = config.to_dict()
    
    try:
        with open(filepath, "w") as f:
            yaml.dump(config_dict, f, default_flow_style=False, sort_keys=False)
    except Exception as e:
        raise ValueError(f"Error saving YAML file: {e}")


def save_config_json(config: Config, filepath: str) -> None:
    """Slaat een configuratie op als JSON-bestand.
    
    Args:
        config: Config object om op te slaan.
        filepath: Pad voor het JSON-bestand.
    """
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    config_dict = config.to_dict()
    
    try:
        with open(filepath, "w") as f:
            json.dump(config_dict, f, indent=2)
    except Exception as e:
        raise ValueError(f"Error saving JSON file: {e}")


def save_config(config: Config, filepath: str) -> None:
    """Slaat een configuratie op en kiest YAML of JSON op basis van extensie.
    
    Args:
        config: Config object om op te slaan.
        filepath: Pad naar `.yaml`, `.yml` of `.json`.
    """
    filepath = Path(filepath)
    
    if filepath.suffix in [".yaml", ".yml"]:
        save_config_yaml(config, str(filepath))
    elif filepath.suffix == ".json":
        save_config_json(config, str(filepath))
    else:
        raise ValueError(
            f"Unknown config format: {filepath.suffix}. "
            "Supported: .yaml, .yml, .json"
        )


def _flatten_config(config_dict: Dict[str, Any], prefix: str = "") -> Dict[str, Any]:
    """Maakt een geneste config-dict plat.
    
    Args:
        config_dict: Geneste config-dict.
        prefix: Interne waarde voor recursie.
    
    Returns:
        Een platte config-dict.
    """
    flat = {}
    
    for key, value in config_dict.items():
        if isinstance(value, dict):
            # Maak nested dicts recursief plat.
            nested_flat = _flatten_config(value, prefix=key)
            flat.update(nested_flat)
        else:
            # Gewone waarden kunnen direct blijven staan.
            flat[key] = value
    
    return flat


def create_example_configs():
    """Maakt voorbeeldconfiguraties in de `configs/` map."""
    from .base import Config
    
    configs_dir = Path("configs")
    configs_dir.mkdir(exist_ok=True)
    
    # Kleine modelconfiguratie.
    small_config = Config(
        embed_dim=64,
        num_blocks=2,
        block_size=256,
        num_heads=2,
        learning_rate=1e-3,
        batch_size=8,
    )
    save_config_yaml(small_config, str(configs_dir / "small.yaml"))
    save_config_json(small_config, str(configs_dir / "small.json"))
    
    # Middelgrote modelconfiguratie.
    medium_config = Config(
        embed_dim=128,
        num_blocks=4,
        block_size=512,
        num_heads=4,
        learning_rate=5e-4,
        batch_size=16,
    )
    save_config_yaml(medium_config, str(configs_dir / "medium.yaml"))
    save_config_json(medium_config, str(configs_dir / "medium.json"))
    
    # Grote modelconfiguratie.
    large_config = Config(
        embed_dim=256,
        num_blocks=8,
        block_size=1024,
        num_heads=8,
        learning_rate=1e-4,
        batch_size=32,
    )
    save_config_yaml(large_config, str(configs_dir / "large.yaml"))
    save_config_json(large_config, str(configs_dir / "large.json"))
    
    print(f"[OK] Example configs created in {configs_dir}/")
