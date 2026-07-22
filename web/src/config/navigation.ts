export type RouteStatus = "available" | "planned" | "experimental";

export type NavigationItem = {
  title: string;
  href: string;
  shortLabel: string;
  section: "Workspace" | "Build" | "Extend" | "System" | "Internal";
  description: string;
  status: RouteStatus;
  milestone: string;
  domain: string;
  backend: string;
  simpleNote: string;
  advancedNotes: string[];
  plannedCapabilities: string[];
};

export const navigationItems: NavigationItem[] = [
  {
    title: "Overview",
    href: "/",
    shortLabel: "OV",
    section: "Workspace",
    description: "ArcLM Web Interface milestone overview.",
    status: "available",
    milestone: "Web Milestone 1",
    domain: "Web Experience",
    backend: "Backend connection begins in Feature 4.",
    simpleNote: "Shell, themes, design system, and planned states are available.",
    advancedNotes: ["Route id: overview", "No backend request is made on this page."],
    plannedCapabilities: ["Backend health", "Environment status", "Project overview"]
  },
  {
    title: "Projects",
    href: "/projects",
    shortLabel: "PR",
    section: "Workspace",
    description: "Create and manage ArcLM project workspaces.",
    status: "planned",
    milestone: "Web Milestone 4",
    domain: "Projects",
    backend: "Project metadata backend is not implemented.",
    simpleNote: "Project management is planned for a later web milestone.",
    advancedNotes: ["Will need project metadata schema.", "No project paths are stored in this feature."],
    plannedCapabilities: ["Project creation wizard", "Import existing project", "Export reproducible config"]
  },
  {
    title: "Data Pipeline",
    href: "/data",
    shortLabel: "DA",
    section: "Workspace",
    description: "Inspect and configure dataset preprocessing visually.",
    status: "planned",
    milestone: "Web Milestone 2",
    domain: "Datasets",
    backend: "Data pipeline backend is not implemented.",
    simpleNote: "Data Pipeline Studio is planned after the shell is stable.",
    advancedNotes: ["Will reuse existing dataset APIs.", "No dataset preview or row counts are shown yet."],
    plannedCapabilities: ["Pipeline graph", "Dataset preview", "Cleaning and deduplication statistics"]
  },
  {
    title: "Training",
    href: "/training",
    shortLabel: "TR",
    section: "Build",
    description: "Monitor and configure training workflows.",
    status: "planned",
    milestone: "Web Milestone 3",
    domain: "Training",
    backend: "Training event backend is not implemented.",
    simpleNote: "Training dashboard work is planned for a later feature.",
    advancedNotes: ["No trainer process is started.", "No fake loss or checkpoint data is displayed."],
    plannedCapabilities: ["Loss charts", "Checkpoints", "Resume controls"]
  },
  {
    title: "Evaluation",
    href: "/evaluation",
    shortLabel: "EV",
    section: "Build",
    description: "Review evaluation results and metrics.",
    status: "planned",
    milestone: "Web Milestone 3",
    domain: "Evaluation",
    backend: "Evaluation backend is not implemented.",
    simpleNote: "Evaluation views will arrive with the training and evaluation dashboard.",
    advancedNotes: ["Will reuse Evaluator outputs.", "No metric values are fabricated."],
    plannedCapabilities: ["Validation loss", "Perplexity", "Accuracy"]
  },
  {
    title: "Models",
    href: "/models",
    shortLabel: "MO",
    section: "Build",
    description: "Browse local models, checkpoints, and metadata.",
    status: "planned",
    milestone: "Web Milestone 4",
    domain: "Models",
    backend: "Model registry backend is not implemented.",
    simpleNote: "Model registry pages are planned for later.",
    advancedNotes: ["No model paths or checkpoint names are read.", "Registry APIs are not connected."],
    plannedCapabilities: ["Model versions", "Checkpoint list", "Metric metadata"]
  },
  {
    title: "Inference",
    href: "/inference",
    shortLabel: "IN",
    section: "Build",
    description: "Run local inference once backend support exists.",
    status: "planned",
    milestone: "Later Web Milestone",
    domain: "Inference",
    backend: "Inference API bridge is not implemented.",
    simpleNote: "Inference controls are intentionally not active yet.",
    advancedNotes: ["No model is loaded.", "No prompt or response is stored."],
    plannedCapabilities: ["Prompt input", "Generation settings", "Result preview"]
  },
  {
    title: "Pipeline Learning",
    href: "/learn/pipeline",
    shortLabel: "LP",
    section: "Build",
    description: "Inspect one native ArcLM generation step visually.",
    status: "available",
    milestone: "Transparent Pipeline Inspection",
    domain: "Learning",
    backend: "Uses POST /api/inspection/text with a configured native model and tokenizer.",
    simpleNote: "Shows tokenizer, tensor-shape, logits, selected-token, and decoded-output stages.",
    advancedNotes: ["Calls arclm.inspect_text through the FastAPI backend.", "No prompts are stored by the frontend."],
    plannedCapabilities: ["Attention visualization later", "Streaming later", "External model tracing later"]
  },
  {
    title: "Plugins",
    href: "/plugins",
    shortLabel: "PL",
    section: "Extend",
    description: "Inspect plugin status after the security model is ready.",
    status: "planned",
    milestone: "Web Milestone 5",
    domain: "Plugins",
    backend: "Plugin management backend is not implemented.",
    simpleNote: "Plugin management is planned after the permission model is approved.",
    advancedNotes: ["No plugins are loaded.", "No enable/disable action exists."],
    plannedCapabilities: ["Installed plugin list", "Permission details", "Read-only extension catalogue"]
  },
  {
    title: "Settings",
    href: "/settings",
    shortLabel: "SE",
    section: "System",
    description: "Adjust local interface preferences.",
    status: "available",
    milestone: "Web Milestone 1",
    domain: "Web Preferences",
    backend: "No backend is required for current preferences.",
    simpleNote: "Theme, mode, and sidebar preferences are stored locally.",
    advancedNotes: ["Uses localStorage only.", "No project data, model paths, or secrets are stored."],
    plannedCapabilities: ["Backend settings later", "Project defaults later"]
  },
  {
    title: "Design System",
    href: "/design-system",
    shortLabel: "DS",
    section: "Internal",
    description: "Internal component review route.",
    status: "available",
    milestone: "Web Milestone 1 / Feature 2",
    domain: "Design",
    backend: "No backend is required.",
    simpleNote: "Internal route for visual review.",
    advancedNotes: ["Not part of product navigation groups.", "No fake product data is shown."],
    plannedCapabilities: ["Component review", "Theme review"]
  }
];

export const navigationSections = ["Workspace", "Build", "Extend", "System"] as const;

export function getNavigationItem(pathname: string) {
  return navigationItems.find((item) => item.href === pathname) ?? navigationItems[0];
}

export function getBreadcrumbs(pathname: string) {
  const current = getNavigationItem(pathname);
  if (current.href === "/") {
    return [current];
  }
  return [navigationItems[0], current];
}
