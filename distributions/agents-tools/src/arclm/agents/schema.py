"""Small JSON-schema subset for safe tool arguments."""

from __future__ import annotations

import dataclasses
import enum
import inspect
import types
from typing import Any, Literal, get_args, get_origin, get_type_hints

from .errors import ToolSchemaError, ToolValidationError


JsonSchema = dict[str, Any]


def schema_for_callable(function: Any, *, context_type: type | None = None) -> JsonSchema:
    """Build a strict JSON-schema-like object from a Python callable."""

    signature = inspect.signature(function)
    hints = get_type_hints(function)
    properties: dict[str, Any] = {}
    required: list[str] = []

    for name, parameter in signature.parameters.items():
        if parameter.kind in (parameter.VAR_POSITIONAL, parameter.VAR_KEYWORD):
            raise ToolSchemaError(f"tool parameter {name!r} may not use *args or **kwargs")
        annotation = hints.get(name, parameter.annotation)
        if _is_context_parameter(name, annotation, context_type):
            continue
        if annotation is inspect.Parameter.empty:
            raise ToolSchemaError(f"tool parameter {name!r} requires a supported type annotation")
        properties[name] = schema_for_type(annotation)
        if parameter.default is inspect.Parameter.empty:
            required.append(name)
        else:
            properties[name]["default"] = parameter.default

    return {
        "type": "object",
        "properties": properties,
        "required": required,
        "additionalProperties": False,
    }


def schema_for_type(annotation: Any) -> JsonSchema:
    """Return a strict JSON-schema-like representation for a supported type."""

    if annotation is Any:
        raise ToolSchemaError("Any is too ambiguous for tool schemas")
    if annotation is None or annotation is type(None):
        return {"type": "null"}
    origin = get_origin(annotation)
    args = get_args(annotation)
    if origin is Literal:
        values = list(args)
        for value in values:
            if not isinstance(value, (str, int, float, bool, type(None))):
                raise ToolSchemaError("Literal values must be JSON-safe scalars")
        return {"enum": values}
    if origin in (list, tuple):
        item_type = args[0] if args else Any
        if item_type is Any:
            raise ToolSchemaError("list annotations must specify an item type")
        return {"type": "array", "items": schema_for_type(item_type)}
    if origin is dict:
        key_type, value_type = args if len(args) == 2 else (str, Any)
        if key_type is not str:
            raise ToolSchemaError("dict tool arguments must use string keys")
        if value_type is Any:
            raise ToolSchemaError("dict annotations must specify a value type")
        return {"type": "object", "additionalProperties": schema_for_type(value_type)}
    if origin in (types.UnionType, getattr(types, "UnionType", ())):
        return _union_schema(args)
    if str(origin) == "typing.Union":
        return _union_schema(args)
    if inspect.isclass(annotation) and issubclass(annotation, enum.Enum):
        return {"enum": [item.value for item in annotation]}
    if dataclasses.is_dataclass(annotation):
        return _schema_for_dataclass(annotation)
    primitive = {str: "string", int: "integer", float: "number", bool: "boolean"}
    if annotation in primitive:
        return {"type": primitive[annotation]}
    if annotation in (list, dict):
        raise ToolSchemaError(f"{annotation.__name__} requires concrete type parameters")
    if _looks_like_pydantic_model(annotation):
        schema_method = getattr(annotation, "model_json_schema", None) or getattr(annotation, "schema")
        return dict(schema_method())
    raise ToolSchemaError(f"unsupported tool annotation: {annotation!r}")


def validate_arguments(
    schema: JsonSchema,
    values: dict[str, Any],
    *,
    max_depth: int = 20,
    max_collection_length: int = 1000,
) -> dict[str, Any]:
    """Validate model-provided arguments and return a defensive copy."""

    if not isinstance(values, dict):
        raise ToolValidationError("tool arguments must be a JSON object")
    _check_bounds(values, max_depth=max_depth, max_collection_length=max_collection_length)
    return _validate_object(schema, values)


def _validate_object(schema: JsonSchema, values: dict[str, Any]) -> dict[str, Any]:
    properties = schema.get("properties", {})
    required = set(schema.get("required", []))
    unknown = set(values) - set(properties)
    if unknown and schema.get("additionalProperties") is False:
        raise ToolValidationError(f"unknown tool argument(s): {', '.join(sorted(unknown))}")
    missing = required - set(values)
    if missing:
        raise ToolValidationError(f"missing required tool argument(s): {', '.join(sorted(missing))}")
    validated: dict[str, Any] = {}
    for name, property_schema in properties.items():
        if name in values:
            validated[name] = _validate_value(property_schema, values[name], path=name)
        elif "default" in property_schema:
            validated[name] = property_schema["default"]
    return validated


def _validate_value(schema: JsonSchema, value: Any, *, path: str) -> Any:
    if "anyOf" in schema:
        errors = []
        for option in schema["anyOf"]:
            try:
                return _validate_value(option, value, path=path)
            except ToolValidationError as exc:
                errors.append(str(exc))
        raise ToolValidationError(f"{path} did not match any supported type: {errors[0]}")
    if "enum" in schema:
        if value not in schema["enum"]:
            raise ToolValidationError(f"{path} must be one of {schema['enum']!r}")
        return value
    expected = schema.get("type")
    if expected == "null":
        if value is not None:
            raise ToolValidationError(f"{path} must be null")
        return None
    if expected == "string":
        if not isinstance(value, str):
            raise ToolValidationError(f"{path} must be a string")
        return value
    if expected == "integer":
        if not isinstance(value, int) or isinstance(value, bool):
            raise ToolValidationError(f"{path} must be an integer")
        return value
    if expected == "number":
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise ToolValidationError(f"{path} must be a number")
        return float(value) if isinstance(value, int) else value
    if expected == "boolean":
        if not isinstance(value, bool):
            raise ToolValidationError(f"{path} must be a boolean")
        return value
    if expected == "array":
        if not isinstance(value, list):
            raise ToolValidationError(f"{path} must be an array")
        return [_validate_value(schema["items"], item, path=f"{path}[]") for item in value]
    if expected == "object":
        if not isinstance(value, dict):
            raise ToolValidationError(f"{path} must be an object")
        if schema.get("additionalProperties") is False:
            return _validate_object(schema, value)
        additional = schema.get("additionalProperties")
        if isinstance(additional, dict):
            return {str(key): _validate_value(additional, item, path=f"{path}.{key}") for key, item in value.items()}
        return dict(value)
    raise ToolValidationError(f"{path} has unsupported schema")


def _union_schema(args: tuple[Any, ...]) -> JsonSchema:
    return {"anyOf": [schema_for_type(arg) for arg in args]}


def _schema_for_dataclass(annotation: Any) -> JsonSchema:
    properties: dict[str, Any] = {}
    required: list[str] = []
    hints = get_type_hints(annotation)
    for field in dataclasses.fields(annotation):
        properties[field.name] = schema_for_type(hints[field.name])
        if field.default is dataclasses.MISSING and field.default_factory is dataclasses.MISSING:
            required.append(field.name)
        elif field.default is not dataclasses.MISSING:
            properties[field.name]["default"] = field.default
    return {
        "type": "object",
        "properties": properties,
        "required": required,
        "additionalProperties": False,
    }


def _looks_like_pydantic_model(annotation: Any) -> bool:
    return inspect.isclass(annotation) and (
        callable(getattr(annotation, "model_json_schema", None))
        or callable(getattr(annotation, "schema", None))
    )


def _is_context_parameter(name: str, annotation: Any, context_type: type | None) -> bool:
    if context_type is None:
        return False
    return annotation is context_type or name in {"context", "ctx"} and annotation is context_type


def _check_bounds(value: Any, *, max_depth: int, max_collection_length: int) -> None:
    def walk(item: Any, depth: int) -> None:
        if depth > max_depth:
            raise ToolValidationError("tool arguments exceed maximum JSON nesting depth")
        if isinstance(item, dict):
            if len(item) > max_collection_length:
                raise ToolValidationError("tool arguments exceed maximum object size")
            for child in item.values():
                walk(child, depth + 1)
        elif isinstance(item, list):
            if len(item) > max_collection_length:
                raise ToolValidationError("tool arguments exceed maximum list size")
            for child in item:
                walk(child, depth + 1)

    walk(value, 0)
