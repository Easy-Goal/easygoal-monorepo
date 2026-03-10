import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import react__default from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
export { ColorToken, animations, colors, cssVars, keyframes } from './tokens/index.mjs';
import { ClassValue } from 'clsx';

interface HeaderNavLink {
    label: string;
    href: string;
}
interface EasyHeaderProps {
    logoSuffix?: string;
    logoVariant?: "dark" | "light";
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
    /** Variante de cor: "dark" = texto branco (fundo escuro), "light" = texto escuro (fundo claro) */
    variant?: "dark" | "light";
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
    variant?: "default" | "outline" | "ghost" | "gradient" | "glass" | "destructive" | null | undefined;
    size?: "sm" | "md" | "lg" | "icon" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    loading?: boolean;
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

declare function cn(...inputs: ClassValue[]): string;

export { AlertBox, type AlertBoxProps, Avatar, Badge, type BadgeProps, Button, type ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, EasyHeader, type EasyHeaderProps, EmptyState, type EmptyStateProps, type HeaderNavLink, type HeaderNotification, type HeaderUser, Input, type InputProps, LoadingState, Logo, MetricCard, NotificationBell, QuickLinkCard, RANK_CONFIG, RankBadge, Skeleton, StatCard, Textarea, type TextareaProps, UserMenu, badgeVariants, buttonVariants, cn };
