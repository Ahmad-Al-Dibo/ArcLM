"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { applyTheme, isThemeChoice, type ThemeChoice } from "@/lib/theme";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";

const themeStorageKey = "arclm-theme";

interface ThemeContextValue {
  theme: ThemeChoice;
  setTheme: (theme: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const themeListeners = new Set<() => void>();

function getThemeSnapshot(): ThemeChoice {
  const stored = readStorage(themeStorageKey);
  return isThemeChoice(stored) ? stored : "system";
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function notifyThemeListeners() {
  for (const listener of themeListeners) {
    listener();
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, (): ThemeChoice => "system");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function setTheme(nextTheme: ThemeChoice) {
    applyTheme(nextTheme);
    if (nextTheme === "system") {
      removeStorage(themeStorageKey);
    } else {
      writeStorage(themeStorageKey, nextTheme);
    }
    notifyThemeListeners();
  }

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return value;
}
