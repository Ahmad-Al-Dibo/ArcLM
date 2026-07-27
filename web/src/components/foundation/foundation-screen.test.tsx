import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { applyTheme } from "@/lib/theme";
import { FoundationScreen } from "./foundation-screen";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
  window.localStorage.clear();
});

describe("FoundationScreen", () => {
  it("renders the root foundation page", () => {
    render(<FoundationScreen />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Web Interface Foundation" })
    ).toBeTruthy();
    expect(screen.getByText("ArcLM")).toBeTruthy();
    expect(screen.getByText("Build ready")).toBeTruthy();
  });

  it("initializes the theme foundation", () => {
    applyTheme("dark");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");

    applyTheme("system");

    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("does not render fake dashboard data", () => {
    render(<FoundationScreen />);

    expect(screen.queryByText(/GPU:/i)).toBeNull();
    expect(screen.queryByText(/loss/i)).toBeNull();
    expect(screen.queryByText(/dataset rows/i)).toBeNull();
    expect(screen.queryByText(/model accuracy/i)).toBeNull();
  });
});
