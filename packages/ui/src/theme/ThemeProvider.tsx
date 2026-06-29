"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Tema padrão se não houver preferência salva. Default: "dark" */
  defaultTheme?: Theme;
  /** Chave no localStorage. Default: "eg-theme" */
  storageKey?: string;
}

export { themeScript } from "./script";

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "eg-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    root.classList.toggle("dark", t === "dark");
    root.setAttribute("data-theme", t);
    localStorage.setItem(storageKey, t);
  }

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const resolved = stored ?? preferred ?? defaultTheme;
    applyTheme(resolved);
    setThemeState(resolved);
    // applyTheme é estável dentro desta closure — storageKey/defaultTheme cobertos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, defaultTheme]);

  function setTheme(t: Theme) {
    applyTheme(t);
    setThemeState(t);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
