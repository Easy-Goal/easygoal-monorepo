/**
 * Easy Goal — Design Tokens
 * Paleta de cores oficial do ecossistema Easy Goal.
 * Fonte da verdade: app-front/src/app/globals.css
 */

export const colors = {
  /** Laranja — cor de destaque principal */
  primary: "#F97316",
  primaryLight: "#FB923C",
  primaryDark: "#EA580C",

  /** Azul escuro neutro — fundo principal */
  background: "#13151B",

  /** Cards e painéis */
  card: "#1A1D23",

  /** Elementos secundários */
  secondary: "#1C1F27",

  /** Bordas e inputs */
  border: "#1C1F27",

  /** Sidebar */
  sidebarBackground: "#0F1115",

  /** Texto primário (sobre fundo escuro) */
  foreground: "#F8FAFC",

  /** Texto secundário / muted */
  mutedForeground: "#858FA3",
} as const;

export type ColorToken = keyof typeof colors;

/**
 * CSS custom properties mapeadas para os tokens acima.
 * Útil para gerar um :root { ... } dinamicamente.
 */
export const cssVars = {
  "--primary": "24 95% 53%",
  "--primary-foreground": "0 0% 100%",
  "--background": "222 18% 9%",
  "--foreground": "210 40% 98%",
  "--card": "222 15% 12%",
  "--card-foreground": "210 40% 98%",
  "--secondary": "222 10% 17%",
  "--secondary-foreground": "210 40% 98%",
  "--muted": "222 10% 19%",
  "--muted-foreground": "220 14% 58%",
  "--accent": "24 95% 53%",
  "--accent-foreground": "0 0% 100%",
  "--border": "222 10% 17%",
  "--input": "222 10% 17%",
  "--ring": "24 95% 53%",
  "--radius": "0.75rem",
  "--sidebar-background": "222 18% 7%",
  "--sidebar-foreground": "220 14% 65%",
  "--sidebar-primary": "24 95% 53%",
  "--sidebar-primary-foreground": "0 0% 100%",
  "--sidebar-accent": "222 10% 14%",
  "--sidebar-accent-foreground": "210 40% 98%",
  "--sidebar-border": "222 10% 15%",
} as const;
