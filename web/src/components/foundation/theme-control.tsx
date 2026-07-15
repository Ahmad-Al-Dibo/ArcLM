"use client";

import { useEffect, useState } from "react";
import { applyTheme, readStoredTheme, saveTheme, type ThemeChoice } from "@/lib/theme";

const choices: ThemeChoice[] = ["system", "light", "dark"];

export function ThemeControl() {
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    return readStoredTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function chooseTheme(choice: ThemeChoice) {
    setTheme(choice);
    saveTheme(choice);
  }

  return (
    <div className="theme-control" aria-label="Theme foundation demo">
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className="theme-button"
          aria-pressed={theme === choice}
          onClick={() => chooseTheme(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
