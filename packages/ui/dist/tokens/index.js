'use strict';

// src/tokens/colors.ts
var colors = {
  /** Laranja — cor de destaque principal */
  primary: "#F97316",
  primaryLight: "#FB923C",
  primaryDark: "#EA580C",
  /** Azul escuro — fundo principal */
  background: "#0F1729",
  /** Cards e painéis */
  card: "#121E34",
  /** Elementos secundários */
  secondary: "#182644",
  /** Bordas e inputs */
  border: "#1E3050",
  /** Sidebar */
  sidebarBackground: "#0B1220",
  /** Texto primário (sobre fundo escuro) */
  foreground: "#F8FAFC",
  /** Texto secundário / muted */
  mutedForeground: "#798BAA"
};
var cssVars = {
  "--primary": "24 95% 53%",
  "--primary-foreground": "0 0% 100%",
  "--background": "222 47% 11%",
  "--foreground": "210 40% 98%",
  "--card": "222 47% 13%",
  "--card-foreground": "210 40% 98%",
  "--secondary": "222 47% 18%",
  "--secondary-foreground": "210 40% 98%",
  "--muted": "222 47% 20%",
  "--muted-foreground": "215 20% 55%",
  "--accent": "24 95% 53%",
  "--accent-foreground": "0 0% 100%",
  "--border": "222 47% 20%",
  "--input": "222 47% 20%",
  "--ring": "24 95% 53%",
  "--radius": "0.75rem",
  "--sidebar-background": "222 47% 9%",
  "--sidebar-foreground": "215 20% 65%",
  "--sidebar-primary": "24 95% 53%",
  "--sidebar-primary-foreground": "0 0% 100%",
  "--sidebar-accent": "222 47% 15%",
  "--sidebar-accent-foreground": "210 40% 98%",
  "--sidebar-border": "222 47% 18%"
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