/**
 * Easy Goal — Design Tokens
 * Paleta de cores oficial do ecossistema Easy Goal.
 * Fonte da verdade: app-front/src/app/globals.css
 */
declare const colors: {
    /** Laranja — cor de destaque principal */
    readonly primary: "#F97316";
    readonly primaryLight: "#FB923C";
    readonly primaryDark: "#EA580C";
    /** Azul escuro — fundo principal */
    readonly background: "#0F1729";
    /** Cards e painéis */
    readonly card: "#121E34";
    /** Elementos secundários */
    readonly secondary: "#182644";
    /** Bordas e inputs */
    readonly border: "#1E3050";
    /** Sidebar */
    readonly sidebarBackground: "#0B1220";
    /** Texto primário (sobre fundo escuro) */
    readonly foreground: "#F8FAFC";
    /** Texto secundário / muted */
    readonly mutedForeground: "#798BAA";
};
type ColorToken = keyof typeof colors;
/**
 * CSS custom properties mapeadas para os tokens acima.
 * Útil para gerar um :root { ... } dinamicamente.
 */
declare const cssVars: {
    readonly "--primary": "24 95% 53%";
    readonly "--primary-foreground": "0 0% 100%";
    readonly "--background": "222 47% 11%";
    readonly "--foreground": "210 40% 98%";
    readonly "--card": "222 47% 13%";
    readonly "--card-foreground": "210 40% 98%";
    readonly "--secondary": "222 47% 18%";
    readonly "--secondary-foreground": "210 40% 98%";
    readonly "--muted": "222 47% 20%";
    readonly "--muted-foreground": "215 20% 55%";
    readonly "--accent": "24 95% 53%";
    readonly "--accent-foreground": "0 0% 100%";
    readonly "--border": "222 47% 20%";
    readonly "--input": "222 47% 20%";
    readonly "--ring": "24 95% 53%";
    readonly "--radius": "0.75rem";
    readonly "--sidebar-background": "222 47% 9%";
    readonly "--sidebar-foreground": "215 20% 65%";
    readonly "--sidebar-primary": "24 95% 53%";
    readonly "--sidebar-primary-foreground": "0 0% 100%";
    readonly "--sidebar-accent": "222 47% 15%";
    readonly "--sidebar-accent-foreground": "210 40% 98%";
    readonly "--sidebar-border": "222 47% 18%";
};

declare const animations: {
    readonly shimmer: "shimmer 1.5s infinite";
    readonly fadeUp: "fade-up 0.4s ease-out";
    readonly slideUp: "slide-up 0.3s ease-out";
    readonly float: "float 3s ease-in-out infinite";
    readonly pulseRing: "pulse-ring 2s infinite";
};
declare const keyframes: {
    readonly shimmer: {
        readonly "0%": {
            readonly transform: "translateX(-100%)";
        };
        readonly "100%": {
            readonly transform: "translateX(100%)";
        };
    };
    readonly "fade-up": {
        readonly from: {
            readonly opacity: "0";
            readonly transform: "translateY(16px)";
        };
        readonly to: {
            readonly opacity: "1";
            readonly transform: "translateY(0)";
        };
    };
    readonly "slide-up": {
        readonly from: {
            readonly opacity: "0";
            readonly transform: "translateY(8px)";
        };
        readonly to: {
            readonly opacity: "1";
            readonly transform: "translateY(0)";
        };
    };
    readonly float: {
        readonly "0%, 100%": {
            readonly transform: "translateY(0px)";
        };
        readonly "50%": {
            readonly transform: "translateY(-8px)";
        };
    };
    readonly "pulse-ring": {
        readonly "0%": {
            readonly boxShadow: "0 0 0 0 hsl(18 100% 62% / 0.4)";
        };
        readonly "70%": {
            readonly boxShadow: "0 0 0 10px hsl(18 100% 62% / 0)";
        };
        readonly "100%": {
            readonly boxShadow: "0 0 0 0 hsl(18 100% 62% / 0)";
        };
    };
};

export { type ColorToken, animations, colors, cssVars, keyframes };
