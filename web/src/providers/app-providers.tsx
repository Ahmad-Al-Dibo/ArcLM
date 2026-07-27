"use client";

import type { ReactNode } from "react";
import { InterfaceModeProvider } from "./interface-mode-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <InterfaceModeProvider>{children}</InterfaceModeProvider>
    </ThemeProvider>
  );
}
