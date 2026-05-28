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
    /** Azul escuro neutro — fundo principal */
    readonly background: "#13151B";
    /** Cards e painéis */
    readonly card: "#1A1D23";
    /** Elementos secundários */
    readonly secondary: "#1C1F27";
    /** Bordas e inputs */
    readonly border: "#1C1F27";
    /** Sidebar */
    readonly sidebarBackground: "#0F1115";
    /** Texto primário (sobre fundo escuro) */
    readonly foreground: "#F8FAFC";
    /** Texto secundário / muted */
    readonly mutedForeground: "#858FA3";
};
type ColorToken = keyof typeof colors;
/**
 * CSS custom properties mapeadas para os tokens acima.
 * Útil para gerar um :root { ... } dinamicamente.
 */
declare const cssVars: {
    readonly "--primary": "24 95% 53%";
    readonly "--primary-foreground": "0 0% 100%";
    readonly "--background": "222 18% 9%";
    readonly "--foreground": "210 40% 98%";
    readonly "--card": "222 15% 12%";
    readonly "--card-foreground": "210 40% 98%";
    readonly "--secondary": "222 10% 17%";
    readonly "--secondary-foreground": "210 40% 98%";
    readonly "--muted": "222 10% 19%";
    readonly "--muted-foreground": "220 14% 58%";
    readonly "--accent": "24 95% 53%";
    readonly "--accent-foreground": "0 0% 100%";
    readonly "--border": "222 10% 17%";
    readonly "--input": "222 10% 17%";
    readonly "--ring": "24 95% 53%";
    readonly "--radius": "0.75rem";
    readonly "--sidebar-background": "222 18% 7%";
    readonly "--sidebar-foreground": "220 14% 65%";
    readonly "--sidebar-primary": "24 95% 53%";
    readonly "--sidebar-primary-foreground": "0 0% 100%";
    readonly "--sidebar-accent": "222 10% 14%";
    readonly "--sidebar-accent-foreground": "210 40% 98%";
    readonly "--sidebar-border": "222 10% 15%";
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
