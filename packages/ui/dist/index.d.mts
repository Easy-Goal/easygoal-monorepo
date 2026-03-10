import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
export { ColorToken, colors, cssVars } from './tokens/index.mjs';

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

interface HeaderNavLink {
    label: string;
    href: string;
}
interface EasyHeaderProps {
    logoSuffix?: string;
    logoVariant?: "dark" | "light";
    navLinks?: HeaderNavLink[];
    ctaSlot?: React.ReactNode;
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

export { EasyHeader, type EasyHeaderProps, type HeaderNavLink, type HeaderNotification, type HeaderUser, Logo, NotificationBell, RANK_CONFIG, RankBadge, UserMenu };
