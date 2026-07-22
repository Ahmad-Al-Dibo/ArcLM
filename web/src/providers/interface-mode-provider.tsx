"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

export type InterfaceMode = "simple" | "advanced";

const modeStorageKey = "arclm-interface-mode";

interface InterfaceModeContextValue {
  mode: InterfaceMode;
  setMode: (mode: InterfaceMode) => void;
}

const InterfaceModeContext = createContext<InterfaceModeContextValue | null>(null);
const modeListeners = new Set<() => void>();

function isInterfaceMode(value: string | null): value is InterfaceMode {
  return value === "simple" || value === "advanced";
}

function getModeSnapshot(): InterfaceMode {
  const stored = readStorage(modeStorageKey);
  return isInterfaceMode(stored) ? stored : "simple";
}

function subscribeMode(listener: () => void) {
  modeListeners.add(listener);
  return () => {
    modeListeners.delete(listener);
  };
}

function notifyModeListeners() {
  for (const listener of modeListeners) {
    listener();
  }
}

export function InterfaceModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribeMode, getModeSnapshot, (): InterfaceMode => "simple");

  function setMode(nextMode: InterfaceMode) {
    writeStorage(modeStorageKey, nextMode);
    notifyModeListeners();
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
