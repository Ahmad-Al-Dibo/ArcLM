"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

export type InterfaceMode = "simple" | "advanced";

const modeStorageKey = "arclm-interface-mode";

interface InterfaceModeContextValue {
  mode: InterfaceMode;
  setMode: (mode: InterfaceMode) => void;
}

const InterfaceModeContext = createContext<InterfaceModeContextValue | null>(null);

function isInterfaceMode(value: string | null): value is InterfaceMode {
  return value === "simple" || value === "advanced";
}

export function InterfaceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<InterfaceMode>(() => {
    const stored = readStorage(modeStorageKey);
    if (isInterfaceMode(stored)) {
      return stored;
    }
    return "simple";
  });

  function setMode(nextMode: InterfaceMode) {
    setModeState(nextMode);
    writeStorage(modeStorageKey, nextMode);
  }

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <InterfaceModeContext.Provider value={value}>
      {children}
    </InterfaceModeContext.Provider>
  );
}

export function useInterfaceMode() {
  const value = useContext(InterfaceModeContext);
  if (!value) {
    throw new Error("useInterfaceMode must be used inside InterfaceModeProvider");
  }
  return value;
}

export function clearInvalidInterfaceModeForTest() {
  const stored = readStorage(modeStorageKey);
  if (stored !== null && !isInterfaceMode(stored)) {
    writeStorage(modeStorageKey, "simple");
  }
}
