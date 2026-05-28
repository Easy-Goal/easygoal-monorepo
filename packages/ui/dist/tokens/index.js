'use strict';

// src/tokens/colors.ts
var colors = {
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
  mutedForeground: "#858FA3"
};
var cssVars = {
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
  "--sidebar-border": "222 10% 15%"
};

// src/tokens/animations.ts
var animations = {
  shimmer: "shimmer 1.5s infinite",
  fadeUp: "fade-up 0.4s ease-out",
  slideUp: "slide-up 0.3s ease-out",
  float: "float 3s ease-in-out infinite",
  pulseRing: "pulse-ring 2s infinite"
};
var keyframes = {
  shimmer: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" }
  },
  "fade-up": {
    from: { opacity: "0", transform: "translateY(16px)" },
    to: { opacity: "1", transform: "translateY(0)" }
  },
  "slide-up": {
    from: { opacity: "0", transform: "translateY(8px)" },
    to: { opacity: "1", transform: "translateY(0)" }
  },
  float: {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-8px)" }
  },
  "pulse-ring": {
    "0%": { boxShadow: "0 0 0 0 hsl(18 100% 62% / 0.4)" },
    "70%": { boxShadow: "0 0 0 10px hsl(18 100% 62% / 0)" },
    "100%": { boxShadow: "0 0 0 0 hsl(18 100% 62% / 0)" }
  }
};

exports.animations = animations;
exports.colors = colors;
exports.cssVars = cssVars;
exports.keyframes = keyframes;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map