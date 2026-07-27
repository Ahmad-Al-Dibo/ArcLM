export type ThemeChoice = "system" | "light" | "dark";

export const themeStorageKey = "arclm-theme";

export function isThemeChoice(value: string | null): value is ThemeChoice {
  return value === "system" || value === "light" || value === "dark";
}

export function applyTheme(choice: ThemeChoice, root: HTMLElement = document.documentElement) {
  if (choice === "system") {
    root.removeAttribute("data-theme");
    root.style.colorScheme = "";
    return;
  }

  root.dataset.theme = choice;
  root.style.colorScheme = choice;
}

export function readStoredTheme(storage: Storage = window.localStorage): ThemeChoice {
  const stored = storage.getItem(themeStorageKey);
  return isThemeChoice(stored) ? stored : "system";
}

export function saveTheme(choice: ThemeChoice, storage: Storage = window.localStorage) {
  if (choice === "system") {
    storage.removeItem(themeStorageKey);
    return;
  }

  storage.setItem(themeStorageKey, choice);
}
