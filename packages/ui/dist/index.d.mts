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

interface HeaderNotification {
    id: string;
    title: string;
    message: string;
    readAt: string | null;
    createdAt: string;
    actionUrl?: string | null;
}

interface HeaderUser {
    id: string;
    name: string | null;
    email?: string;
    avatarUrl?: string | null;
    rankName?: string | null;
}

interface HeaderNavLink {
    label: string;
    href: string;
}
interface EasyHeaderProps {
    /** Sufixo após o logo, ex: "club", "afiliados" */
    logoSuffix?: string;
    /** Variante de cor do logo */
    logoVariant?: "dark" | "light";
    /** Links de navegação */
    navLinks?: HeaderNavLink[];
    /** Usuário autenticado (null/undefined = não logado) */
    user?: HeaderUser | null;
    /** URL de login (exibida quando não logado) */
    loginUrl?: string;
    /** URL de configurações / perfil do usuário */
    settingsUrl?: string;
    /** URL da documentação */
    docsUrl?: string;
    /** Callback de sign out */
    onSignOut?: () => void;
    /** Notificações (só exibido quando user está presente) */
    notifications?: HeaderNotification[];
    onMarkNotificationRead?: (id: string) => void;
    onMarkAllNotificationsRead?: () => void;
    onDeleteNotification?: (id: string) => void;
    allNotificationsUrl?: string;
    /** Slot direito customizável (mostrado quando não logado ou como override) */
    ctaSlot?: React.ReactNode;
    className?: string;
}
declare function EasyHeader({ logoSuffix, logoVariant, navLinks, user, loginUrl, settingsUrl, docsUrl, onSignOut, notifications, onMarkNotificationRead, onMarkAllNotificationsRead, onDeleteNotification, allNotificationsUrl, ctaSlot, className, }: EasyHeaderProps): react_jsx_runtime.JSX.Element;

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

export { EasyHeader, type EasyHeaderProps, type HeaderNavLink, type HeaderNotification, type HeaderUser, Logo, RANK_CONFIG, RankBadge };
