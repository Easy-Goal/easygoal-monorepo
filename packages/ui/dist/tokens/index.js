"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/tokens/index.ts
var tokens_exports = {};
__export(tokens_exports, {
  colors: () => colors,
  cssVars: () => cssVars
});
module.exports = __toCommonJS(tokens_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  colors,
  cssVars
});
//# sourceMappingURL=index.js.map