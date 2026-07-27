import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { navigationItems } from "@/config/navigation";
import { AppProviders } from "@/providers/app-providers";
import { ApplicationShell } from "./application-shell";
import { sidebarStorageKey } from "./preference-keys";
import { RoutePage } from "./route-page";

let mockedPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockedPathname
}));

function renderShell(pathname = "/", children = <RoutePage href={pathname} />) {
  mockedPathname = pathname;
  return render(
    <AppProviders>
      <ApplicationShell>{children}</ApplicationShell>
    </AppProviders>
  );
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
  mockedPathname = "/";
});

describe("interface mode", () => {
  it("defaults to Simple and persists Advanced mode", () => {
    renderShell();

    expect(screen.getByRole("button", { name: "Simple" }).getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByRole("button", { name: "Advanced" }).getAttribute("aria-pressed")).toBe("true");
    expect(window.localStorage.getItem("arclm-interface-mode")).toBe("advanced");
  });

  it("falls back safely when stored mode is invalid", async () => {
    window.localStorage.setItem("arclm-interface-mode", "expert");
    renderShell();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Simple" }).getAttribute("aria-pressed")).toBe("true");
    });
  });

  it("loads stored Advanced mode after the first client render", async () => {
    window.localStorage.setItem("arclm-interface-mode", "advanced");
    renderShell();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Advanced" }).getAttribute("aria-pressed")).toBe("true");
    });
  });
});

describe("sidebar navigation", () => {
  it("renders approved navigation items with active route indication", () => {
    renderShell("/learn/pipeline");

    for (const item of navigationItems.filter((item) => item.section !== "Internal" && item.status === "available")) {
      expect(screen.getAllByRole("link", { name: new RegExp(item.title) }).length).toBeGreaterThan(0);
    }

    expect(screen.getAllByRole("link", { name: /Inspect Pipeline/ })[0].getAttribute("aria-current")).toBe("page");
    expect(screen.queryByText("Coming later")).toBeNull();
  });

  it("collapses and persists the desktop sidebar preference", () => {
    renderShell();

    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));

    expect(window.localStorage.getItem(sidebarStorageKey)).toBe("true");
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeTruthy();
  });
});

describe("mobile navigation", () => {
  it("opens, closes with Escape, and returns focus to trigger", () => {
    renderShell();

    const trigger = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Mobile navigation" })).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when a route is selected", () => {
    renderShell();

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const dataLinks = screen.getAllByRole("link", { name: /^Data/ });
    fireEvent.click(dataLinks[dataLinks.length - 1]);

    expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).toBeNull();
  });
});

describe("top bar, breadcrumbs, and route pages", () => {
  it("renders current page title and breadcrumb semantics", () => {
    renderShell("/data");

    expect(screen.getAllByText("Data").length).toBeGreaterThan(0);
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumbs).toBeTruthy();
    expect(within(breadcrumbs).getByRole("link", { name: "Overview" })).toBeTruthy();
  });

  it("keeps theme preference compatible", () => {
    renderShell();

    fireEvent.change(screen.getByLabelText(/Theme/), { target: { value: "dark" } });

    expect(window.localStorage.getItem("arclm-theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("shows honest Studio 3 route state and no fake dashboard data", () => {
    renderShell("/projects/project_abc/checkpoints");

    expect(screen.getByText("Available in this build")).toBeTruthy();
    expect(screen.getByText(/Project Checkpoint Manager lives at/)).toBeTruthy();
    expect(screen.queryByText(/GPU:/i)).toBeNull();
    expect(screen.queryByText(/loss/i)).toBeNull();
    expect(screen.queryByText(/accuracy/i)).toBeNull();
  });

  it("shows advanced route details only after mode switch", () => {
    renderShell("/settings");

    expect(screen.queryByText("Advanced planning details")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));

    expect(screen.getByText("Advanced planning details")).toBeTruthy();
    expect(screen.getAllByText("No backend is required for current preferences.").length).toBeGreaterThan(0);
  });

  it("stores only interface preferences", () => {
    renderShell();

    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    fireEvent.change(screen.getByLabelText(/Theme/), { target: { value: "light" } });
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));

    expect(Object.keys(window.localStorage).sort()).toEqual([
      "arclm-interface-mode",
      "arclm-sidebar-collapsed",
      "arclm-theme"
    ]);
  });
});
