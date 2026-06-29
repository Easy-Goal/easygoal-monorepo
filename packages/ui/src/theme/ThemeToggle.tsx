"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  /** "icon" = só ícone (default) | "label" = ícone + texto */
  variant?: "icon" | "label";
}

export function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className={[
        "inline-flex items-center gap-2 rounded-lg border transition-all duration-200",
        "border-[var(--eg-border)] bg-[var(--eg-bg-surface)]",
        "text-[var(--eg-text-muted)] hover:text-[var(--eg-text)]",
        "hover:border-[var(--eg-accent)] hover:bg-[var(--eg-accent-muted)]",
        "px-2.5 py-2 text-sm font-medium",
        className,
      ].join(" ")}
    >
      {isDark ? (
        // Sol — mudar para claro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Lua — mudar para escuro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      )}
      {variant === "label" && (
        <span>{isDark ? "Claro" : "Escuro"}</span>
      )}
    </button>
  );
}
