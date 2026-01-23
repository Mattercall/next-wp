"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

const THEME_STORAGE_KEY = "theme";
const LIGHT_THEME = "light";

function enforceLightTheme() {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const body = document.body;

  root.classList.remove("dark");
  body.classList.remove("dark");
  root.classList.add(LIGHT_THEME);
  body.classList.add(LIGHT_THEME);

  if (root.getAttribute("data-theme") === "dark") {
    root.setAttribute("data-theme", LIGHT_THEME);
  }
  if (body.getAttribute("data-theme") === "dark") {
    body.setAttribute("data-theme", LIGHT_THEME);
  }
}

function persistLightTheme() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(THEME_STORAGE_KEY, LIGHT_THEME);
  document.cookie = `${THEME_STORAGE_KEY}=${LIGHT_THEME}; path=/; max-age=31536000`;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    enforceLightTheme();
    persistLightTheme();
  }, []);

  return (
    <NextThemesProvider forcedTheme={LIGHT_THEME} {...props}>
      {children}
    </NextThemesProvider>
  );
}
