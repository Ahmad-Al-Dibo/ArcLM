"""Kleine helpers achter de lokale ArcLM Web API."""

from __future__ import annotations

import platform as platform_module
import sys
from functools import lru_cache
from importlib import import_module
from importlib import metadata
from typing import Any

import arclm
from arclm.diagnostics_runtime import build_runtime_diagnostics, optional_dependency_status

from .schemas import (
    Capability,
    CapabilitiesResponse,
    EnvironmentResponse,
    GpuInfo,
    IntegrationInfo,
    LimitationInfo,
    PlannedFeature,
    ProgressItem,
    ProjectInfo,
    ProjectStatusResponse,
    ValidationItem,
    WebMilestoneInfo,
)


def _load_torch() -> Any | None:
    """Laadt torch pas wanneer een endpoint runtime-informatie vraagt."""
    try:
        return import_module("torch")
    except ModuleNotFoundError:
        return None


@lru_cache(maxsize=1)
def get_environment() -> EnvironmentResponse:
    """Leest veilige runtime-informatie.

    We vragen CUDA-details alleen op als torch zelf zegt dat CUDA beschikbaar
    is. Daardoor blijft CPU-only gebruik rustig en voorspelbaar.
    """
    diagnostics = build_runtime_diagnostics()
    torch = _load_torch()
    cuda_available = False
    cuda_runtime = None
    device_count = 0
    gpus: list[GpuInfo] = []
    bf16_supported: bool | None = None
    if torch is not None:
        cuda = getattr(torch, "cuda", None)
        cuda_runtime = getattr(getattr(torch, "version", None), "cuda", None)
        cuda_available = bool(cuda is not None and cuda.is_available())
        if cuda_available:
            device_count = int(cuda.device_count())
            for index in range(device_count):
                props = cuda.get_device_properties(index)
                gpus.append(
                    GpuInfo(
                        name=str(cuda.get_device_name(index)),
                        vram_bytes=int(getattr(props, "total_memory", 0)),
                        compute_capability=tuple(cuda.get_device_capability(index)),
                    )
                )
            bf16_probe = getattr(cuda, "is_bf16_supported", None)
            bf16_supported = bool(bf16_probe()) if callable(bf16_probe) else None

    available_devices = ["cpu"]
    if cuda_available:
        available_devices.extend(f"cuda:{index}" for index in range(device_count))

    return EnvironmentResponse(
        arclm_version=str(diagnostics["arclm_version"]),
        python_version=str(diagnostics["python_version"]),
        platform=str(diagnostics["operating_system"]),
        pytorch_version=diagnostics["pytorch_version"],
        cuda_available=cuda_available,
        cuda_runtime=cuda_runtime,
        device_count=device_count,
        available_devices=available_devices,
        preferred_device="cuda:0" if cuda_available else "cpu",
        gpus=gpus,
        bf16_supported=bf16_supported,
    )


def get_system_diagnostics(*, workspace: dict[str, Any], active_compute_operation: str = "idle") -> dict[str, Any]:
    """Return safe diagnostics for the browser-facing system endpoint."""
    return build_runtime_diagnostics(
        include_paths=False,
        workspace=workspace,
        active_compute_operation=active_compute_operation,
    )


def get_capabilities() -> CapabilitiesResponse:
    """Geeft een kleine statuskaart terug voor bekende ArcLM onderdelen."""
    env = get_environment()
    cuda_status = "locally_verified" if env.cuda_available else "hardware_unavailable"
    bf16_status = "locally_verified" if env.bf16_supported else "hardware_unavailable"
    multi_gpu_status = "not_verified" if env.device_count > 1 else "hardware_unavailable"

    return CapabilitiesResponse(
        training={
            "single_device": Capability(
                status="available",
                note="Single-device training API is implemented.",
                evidence="Training Core CPU runtime tests pass.",
                product_state="Community",
            ),
            "gradient_accumulation": Capability(
                status="available",
                note="Gradient accumulation is implemented.",
                evidence="Trainer accumulation tests pass.",
                product_state="Community",
            ),
            "checkpoints": Capability(
                status="available",
                note="Checkpoint save and resume are implemented.",
                evidence="Checkpoint and resume tests pass.",
                product_state="Community",
            ),
            "fp16": Capability(
                status=cuda_status,
                note="FP16 runtime requires CUDA hardware.",
                evidence="Local GPU validation records FP16 on the GTX 1050 Ti when CUDA is available.",
                hardware_requirement="CUDA-capable NVIDIA GPU",
                product_state="Shared Core",
            ),
            "bf16": Capability(
                status=bf16_status,
                note="BF16 requires supported hardware for native runtime validation.",
                evidence="CPU correctness exists; native CUDA BF16 still needs compatible hardware validation.",
                hardware_requirement="CPU autocast support or CUDA GPU with native BF16 support",
                product_state="Shared Core",
            ),
            "multi_gpu": Capability(
                status=multi_gpu_status,
                note="Multi-GPU validation requires at least two GPUs.",
                evidence="Local laptop has one CUDA GPU.",
                hardware_requirement="At least two CUDA GPUs",
                product_state="Pro",
            ),
            "ddp": Capability(
                status="planned",
                note="DDP orchestration is not implemented in the current build.",
                hardware_requirement="At least two devices for real GPU validation",
                product_state="Pro",
            ),
            "fsdp": Capability(
                status="planned",
                note="FSDP orchestration is not implemented in the current build.",
                hardware_requirement="Distributed PyTorch runtime",
                product_state="Pro",
            ),
        },
        evaluation={
            "basic": Capability(
                status="available",
                note="Basic evaluation API is implemented.",
                evidence="Evaluation unit and smoke tests pass.",
                product_state="Community",
            ),
            "benchmarks": Capability(
                status="planned",
                note="Large benchmark suites are not implemented.",
                optional_dependency="datasets",
                product_state="Pro",
            ),
        },
        inference={
            "basic": Capability(
                status="available",
                note="Basic local inference APIs exist.",
                evidence="CLI generation smoke and inference tests pass.",
                product_state="Community",
            ),
            "serving": Capability(
                status="planned",
                note="Model serving is not part of this backend feature.",
                product_state="Pro",
            ),
        },
        web={
            "backend": Capability(
                status="available",
                note="Local read-only Web API is available.",
                evidence="FastAPI endpoint tests and localhost smoke pass.",
                optional_dependency="web",
                product_state="Shared Core",
            ),
            "frontend_client": Capability(
                status="available",
                note="The frontend has a small typed API client.",
                evidence="Frontend client tests pass.",
                product_state="Shared Core",
            ),
            "simple_dashboard": Capability(
                status="locally_verified",
                note="Simple Dashboard is implemented and locally verified.",
                evidence="Feature 5 frontend-to-backend smoke passed.",
                product_state="Shared Core",
            ),
            "advanced_dashboard": Capability(
                status="locally_verified",
                note="Advanced Dashboard is implemented in the current Web milestone.",
                evidence="Feature 6 tests and smoke checks cover the read-only advanced view.",
                product_state="Shared Core",
            ),
            "dataset_inspector_backend": Capability(
                status="available",
                note="Read-only dataset listing and inspection endpoints are implemented.",
                evidence="Web Milestone 2 Feature 2 backend tests and runtime smoke pass.",
                product_state="Shared Core",
            ),
            "dataset_inspector_ui": Capability(
                status="available",
                note="The browser Dataset Inspector UI is implemented.",
                evidence="Web Milestone 2 Feature 3 frontend tests and route smoke pass.",
                product_state="Shared Core",
            ),
            "dataset_source_manager": Capability(
                status="available",
                note="Local dataset source management is implemented for loopback-only Web API sessions.",
                evidence="Web Milestone 2 Feature 4 backend and frontend tests pass.",
                product_state="Shared Core",
            ),
        },
    )


def _package_status(package_name: str) -> str:
    """Controleert package metadata zonder het package zelf te importeren."""
    try:
        metadata.version(package_name)
    except metadata.PackageNotFoundError:
        return "not_installed"
    return "installed"


def _integrations() -> list[IntegrationInfo]:
    """Geeft veilige optionele-integratiestatus terug."""
    items = [
        ("Modern Web API", "fastapi", "available", "Local read-only API for the Next.js app.", "web"),
        ("Legacy Flask interface", "flask", "experimental", "Compatibility simple interface remains available.", "web"),
        ("SentencePiece", "sentencepiece", "available", "Native tokenizer support can use SentencePiece.", None),
        ("Transformers", "transformers", "experimental", "External model/tokenizer paths are partial and optional.", None),
        ("PEFT", "peft", "planned", "LoRA/PEFT stabilization is planned for a later ML milestone.", None),
        ("Accelerate", "accelerate", "planned", "Distributed and advanced training helpers are not in the current build.", None),
        ("WebDataset", "webdataset", "planned", "WebDataset loading is planned, not implemented.", None),
        ("ONNX", "onnx", "planned", "ONNX export is planned, not implemented.", None),
        ("ONNX Runtime", "onnxruntime", "planned", "ONNX runtime validation is planned, not implemented.", None),
        ("MLflow", "mlflow", "experimental", "Tracking integration is experimental and not part of the dashboard.", None),
        ("Weights & Biases", "wandb", "experimental", "Tracking integration is experimental and optional.", None),
    ]
    return [
        IntegrationInfo(
            name=name,
            package=package,
            package_status=_package_status(package),
            arclm_status=arclm_status,
            note=note,
            extra=extra,
        )
        for name, package, arclm_status, note, extra in items
    ]


def get_project_status() -> ProjectStatusResponse:
    """Geeft veilige projectmetadata terug zonder bestanden te lekken."""
    return ProjectStatusResponse(
        project=ProjectInfo(name="ArcLM", version=arclm.__version__),
        web_milestone=WebMilestoneInfo(
            name="Web Milestone 2",
            feature="Dataset Source Manager",
            status="complete",
        ),
        available_sections=[
            "overview",
            "projects",
            "data",
            "training",
            "evaluation",
            "models",
            "inference",
            "plugins",
            "settings",
        ],
        completed=[
            ProgressItem(name="Frontend Foundation", status="implemented"),
            ProgressItem(name="Design System", status="implemented"),
            ProgressItem(name="Application Shell", status="implemented"),
            ProgressItem(name="Local Web Backend", status="implemented"),
            ProgressItem(name="Simple Dashboard", status="implemented"),
            ProgressItem(name="Advanced Dashboard", status="implemented"),
            ProgressItem(name="Data Pipeline Studio Planning", status="implemented"),
            ProgressItem(name="Dataset Inspector Backend", status="implemented"),
            ProgressItem(name="Dataset Inspector UI", status="implemented"),
            ProgressItem(name="Dataset Source Manager", status="implemented"),
            ProgressItem(name="Multiple Dataset Roots", status="implemented"),
            ProgressItem(name="Dashboard Root Configuration", status="implemented"),
        ],
        current=ProgressItem(name="Data Pipeline Studio", status="in_progress"),
        next=[
            ProgressItem(name="Approved Pipeline Step Registry", status="planned"),
        ],
        planned_features=[
            PlannedFeature(
                name="Approved Pipeline Step Registry",
                description="Approved list of real ArcLM data pipeline steps and safe configs.",
                milestone="Web Milestone 2",
            ),
            PlannedFeature(
                name="Dataset Upload",
                description="A safe browser upload flow after source management and step approvals.",
                milestone="Web Milestone 2",
            ),
            PlannedFeature(
                name="Pipeline Preview",
                description="Bounded before/after previews and step result metadata.",
                milestone="Web Milestone 2",
            ),
            PlannedFeature(
                name="Training Dashboard",
                description="Training state, checkpoints, and run progress after event contracts exist.",
                milestone="Web Milestone 3",
            ),
            PlannedFeature(
                name="Model Registry",
                description="Local models, checkpoints, and metadata once project metadata is stable.",
                milestone="Web Milestone 4",
            ),
            PlannedFeature(
                name="Project Templates",
                description="Starter project flows after the project model is approved.",
                milestone="Web Milestone 4",
            ),
            PlannedFeature(
                name="Plugin Management",
                description="Plugin visibility after the permission model is approved.",
                milestone="Web Milestone 5",
            ),
            PlannedFeature(
                name="Visual Training Designer",
                description="Visual training workflow design after dashboard and pipeline foundations.",
                milestone="Later Web Milestone",
            ),
        ],
        validation=[
            ValidationItem(name="CPU core suite", status="verified", note="Full CPU pytest passed in the supported environment."),
            ValidationItem(name="CUDA FP32", status="locally_verified", note="Local GTX 1050 Ti validation exists when CUDA PyTorch is active."),
            ValidationItem(name="CUDA FP16", status="locally_verified", note="Local GTX 1050 Ti validation exists when CUDA PyTorch is active."),
            ValidationItem(name="CUDA BF16 correctness", status="verified_for_correctness", note="Correctness was checked; native BF16 acceleration still needs compatible hardware."),
            ValidationItem(name="Multi-GPU", status="pending_cloud_validation", note="The local laptop has one CUDA GPU."),
            ValidationItem(name="DDP", status="not_implemented", note="Distributed training is planned for a later milestone."),
            ValidationItem(name="FSDP", status="not_implemented", note="FSDP is planned for a later milestone."),
        ],
        integrations=_integrations(),
        limitations=[
            LimitationInfo(
                category="Hardware limitation",
                title="Single local GPU",
                description="The local validation laptop cannot prove multi-GPU behavior.",
                status="hardware_unavailable_locally",
            ),
            LimitationInfo(
                category="Validation pending",
                title="Native BF16 acceleration",
                description="BF16 correctness exists, but representative native BF16 CUDA hardware validation is still pending.",
                status="pending_cloud_validation",
            ),
            LimitationInfo(
                category="Planned feature",
                title="Browser training controls",
                description="The dashboard is read-only and cannot start or resume training from the browser.",
                status="planned",
            ),
            LimitationInfo(
                category="Planned feature",
                title="Dataset upload and Data Pipeline Studio",
                description="Dataset inspection is read-only. Upload, visual preprocessing, and pipeline execution are still planned.",
                status="in_progress",
            ),
            LimitationInfo(
                category="Planned feature",
                title="Model registry and plugins",
                description="Model registry, project templates, and plugin management are planned for later Web milestones.",
                status="planned",
            ),
        ],
    )


def clear_runtime_cache() -> None:
    """Maakt de cache leeg voor tests die hardware nabootsen."""
    get_environment.cache_clear()
