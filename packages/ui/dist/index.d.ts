import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import react__default from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

interface HeaderNavLink {
    label: string;
    href: string;
}
interface EasyHeaderProps {
    logoSuffix?: string;
    logoVariant?: "dark" | "light" | "theme";
    navLinks?: HeaderNavLink[];
    ctaSlot?: react__default.ReactNode;
    className?: string;
    config: {
        ssoUrl: string;
        apiKey: string;
        docsUrl?: string;
        appUrl?: string;
        /** Path do endpoint de notificações. Default: '/api/notifications' */
        notificationsPath?: string;
    };
}
declare function EasyHeader({ logoSuffix, logoVariant, navLinks, ctaSlot, className, config, }: EasyHeaderProps): react_jsx_runtime.JSX.Element;

interface HeaderUser {
    id: string;
    name: string | null;
    email?: string;
    avatarUrl?: string | null;
    rankName?: string | null;
}
interface UserMenuProps {
    user: HeaderUser;
    onSignOut?: () => void;
    appUrl?: string;
    settingsUrl?: string;
    docsUrl?: string;
}
declare function UserMenu({ user, onSignOut, appUrl, settingsUrl, docsUrl }: UserMenuProps): react_jsx_runtime.JSX.Element;

interface HeaderNotification {
    id: string;
    title: string;
    message: string;
    readAt: string | null;
    createdAt: string;
    actionUrl?: string | null;
}
interface NotificationBellProps {
    notifications?: HeaderNotification[];
    onMarkRead?: (id: string) => void;
    onMarkAllRead?: () => void;
    onDelete?: (id: string) => void;
    /** URL for "ver todas" footer link */
    allNotificationsUrl?: string;
}
declare function NotificationBell({ notifications, onMarkRead, onMarkAllRead, onDelete, allNotificationsUrl, }: NotificationBellProps): react_jsx_runtime.JSX.Element;

declare const RANK_CONFIG: Record<string, {
    emoji: string;
    color: string;
    label: string;
}>;
interface RankBadgeProps {
    rankName: string;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    className?: string;
}
declare function RankBadge({ rankName, size, showLabel, className }: RankBadgeProps): react_jsx_runtime.JSX.Element;

interface LogoProps {
    /** Variante de cor:
     *  "dark"  — texto branco + acento laranja (para fundos escuros)
     *  "light" — texto escuro + acento laranja (para fundos claros)
     *  "white" — tudo branco (para fundos coloridos)
     *  "theme" — texto currentColor + acento laranja (adapta ao tema via CSS) */
    variant?: "dark" | "light" | "white" | "theme";
    /** Largura em px. A altura é proporcional ao viewBox 133×37. */
    width?: number;
    className?: string;
}
/**
 * Logo oficial da Easy Goal.
 * O wordmark usa o SVG canônico do projeto com o ícone circular em laranja.
 *
 * @example
 * // Fundo escuro (padrão do app)
 * <Logo variant="dark" width={133} />
 *
 * // Fundo claro
 * <Logo variant="light" width={120} />
 */
declare function Logo({ variant, width, className }: LogoProps): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "default" | "outline" | "ghost" | "gradient" | "business" | "glass" | "destructive" | null | undefined;
    size?: "sm" | "md" | "lg" | "icon" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    loading?: boolean;
    asChild?: boolean;
}
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

declare const Card: react.ForwardRefExoticComponent<react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>>;
declare const CardHeader: react.ForwardRefExoticComponent<react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>>;
declare const CardTitle: react.ForwardRefExoticComponent<react.HTMLAttributes<HTMLHeadingElement> & react.RefAttributes<HTMLHeadingElement>>;
declare const CardDescription: react.ForwardRefExoticComponent<react.HTMLAttributes<HTMLParagraphElement> & react.RefAttributes<HTMLParagraphElement>>;
declare const CardContent: react.ForwardRefExoticComponent<react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>>;
declare const CardFooter: react.ForwardRefExoticComponent<react.HTMLAttributes<HTMLDivElement> & react.RefAttributes<HTMLDivElement>>;

declare const badgeVariants: (props?: ({
    variant?: "default" | "outline" | "destructive" | "secondary" | "success" | "warning" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, ...props }: BadgeProps): react_jsx_runtime.JSX.Element;

declare function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;

declare const sizeMap: {
    readonly xs: "h-6 w-6 text-xs";
    readonly sm: "h-8 w-8 text-xs";
    readonly md: "h-10 w-10 text-sm";
    readonly lg: "h-14 w-14 text-base";
};
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: keyof typeof sizeMap;
}
declare function Avatar({ src, alt, fallback, size, className, ...props }: AvatarProps): react_jsx_runtime.JSX.Element;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}
declare const Input: react.ForwardRefExoticComponent<InputProps & react.RefAttributes<HTMLInputElement>>;
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
}
declare const Textarea: react.ForwardRefExoticComponent<TextareaProps & react.RefAttributes<HTMLTextAreaElement>>;

declare const alertVariants: (props?: ({
    variant?: "error" | "success" | "warning" | "info" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface AlertBoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    title?: string;
}
declare function AlertBox({ className, variant, title, children, ...props }: AlertBoxProps): react_jsx_runtime.JSX.Element;

declare const emptyVariants: (props?: ({
    variant?: "inline" | "dashed" | "card" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyVariants> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}
declare function EmptyState({ className, variant, icon, title, description, action, ...props }: EmptyStateProps): react_jsx_runtime.JSX.Element;

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "inline" | "page";
    text?: string;
}
declare function LoadingState({ variant, text, className, ...props }: LoadingStateProps): react_jsx_runtime.JSX.Element;

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    trend?: number;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}
declare function StatCard({ title, value, trend, icon, action, className, ...props }: StatCardProps): react_jsx_runtime.JSX.Element;

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    subtitle?: string;
}
declare function MetricCard({ title, value, icon, subtitle, className, ...props }: MetricCardProps): react_jsx_runtime.JSX.Element;

interface QuickLinkCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    href?: string;
}
declare function QuickLinkCard({ title, description, icon, href, className, onClick, ...props }: QuickLinkCardProps): react_jsx_runtime.JSX.Element;

declare const themeScript = "(function(){try{var t=localStorage.getItem(\"eg-theme\");var preferred=window.matchMedia(\"(prefers-color-scheme: dark)\").matches?\"dark\":\"light\";var theme=t||preferred||\"dark\";document.documentElement.classList.toggle(\"dark\",theme===\"dark\");document.documentElement.setAttribute(\"data-theme\",theme);}catch(e){}})();";

type Theme = "dark" | "light";
interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
}
declare function useTheme(): ThemeContextValue;
interface ThemeProviderProps {
    children: react__default.ReactNode;
    /** Tema padrão se não houver preferência salva. Default: "dark" */
    defaultTheme?: Theme;
    /** Chave no localStorage. Default: "eg-theme" */
    storageKey?: string;
}

declare function ThemeProvider({ children, defaultTheme, storageKey, }: ThemeProviderProps): react_jsx_runtime.JSX.Element;

interface ThemeToggleProps {
    className?: string;
    /** "icon" = só ícone (default) | "label" = ícone + texto */
    variant?: "icon" | "label";
}
declare function ThemeToggle({ className, variant }: ThemeToggleProps): react_jsx_runtime.JSX.Element;

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

declare function cn(...inputs: ClassValue[]): string;

export { AlertBox, type AlertBoxProps, Avatar, Badge, type BadgeProps, Button, type ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type ColorToken, EasyHeader, type EasyHeaderProps, EmptyState, type EmptyStateProps, type HeaderNavLink, type HeaderNotification, type HeaderUser, Input, type InputProps, LoadingState, Logo, MetricCard, NotificationBell, QuickLinkCard, RANK_CONFIG, RankBadge, Skeleton, StatCard, Textarea, type TextareaProps, ThemeProvider, ThemeToggle, UserMenu, animations, badgeVariants, buttonVariants, cn, colors, cssVars, keyframes, themeScript, useTheme };
