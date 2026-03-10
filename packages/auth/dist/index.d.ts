import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';

interface EgSessionUser {
    id: string;
    email: string | undefined;
    name: string | null;
    avatarUrl: string | null;
    isProducer: boolean;
    companyName: string | null;
    rankName: string | null;
    planSlug: string | null;
    provider?: string;
}
interface EgSessionContextValue {
    user: EgSessionUser | null;
    isReady: boolean;
}
interface EgSessionConfig {
    sessionPath?: string;
    ssoUrl?: string;
    apiKey?: string;
}
declare function useEgSession(): EgSessionContextValue;
interface EgSessionProviderProps {
    children: ReactNode;
    config?: EgSessionConfig;
}
/**
 * Provider para apps que usam o fluxo SSO sem credenciais Supabase direta.
 * Lê a sessão via `eg_session` cookie através do endpoint `/api/auth/session`.
 *
 * Uso:
 * ```tsx
 * // layout.tsx
 * import { EgSessionProvider } from '@easygoal/packages/auth/client';
 *
 * export default function RootLayout({ children }) {
 *   return <EgSessionProvider>{children}</EgSessionProvider>;
 * }
 * ```
 *
 * Em qualquer componente filho:
 * ```tsx
 * const { user, isReady } = useEgSession();
 * ```
 */
declare function EgSessionProvider({ children, config }: EgSessionProviderProps): react_jsx_runtime.JSX.Element;

interface SSOLoginConfig {
    ssoUrl: string;
    apiKey: string;
    callbackPath?: string;
    next?: string;
    logoutPath?: string;
    redirectAfterLogout?: string;
}
declare function useSSOLogin(config: SSOLoginConfig): {
    login: () => void;
    logout: () => Promise<void>;
};

interface AuthProviderConfig {
    /** SSO login URL (e.g. https://sso.easygoal.com.br) */
    loginUrl: string;
    /** This app's public URL */
    appUrl: string;
    /** Path for auth callback (default: /auth/callback) */
    callbackPath?: string;
    /** Default redirect after login (default: /dashboard) */
    defaultRedirect?: string;
    /** Custom loading component */
    loadingComponent?: ReactNode;
    /** Future: API key for third-party app authentication */
    apiKey?: string;
    /** Future: Requested scopes */
    scopes?: string[];
}
interface AuthContextValue {
    session: Session | null;
    isReady: boolean;
    signOut: () => Promise<void>;
}
/**
 * Formato canônico consumido pelo componente NotificationBell do @easygoal/ui.
 * Mapeado a partir do NotificationRow do banco via useNotifications.
 */
interface HeaderNotification {
    id: string;
    title: string;
    message: string;
    readAt: string | null;
    createdAt: string;
    actionUrl?: string | null;
}

interface UseNotificationsConfig {
    /** Path do endpoint de notificações. Default: '/api/notifications' */
    path?: string;
    /** Intervalo de polling em ms. Default: 30_000 (30s). 0 = desabilita. */
    pollInterval?: number;
}
interface UseNotificationsReturn {
    notifications: HeaderNotification[];
    unreadCount: number;
    hasUnread: boolean;
    isLoading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    dismiss: (id: string) => Promise<void>;
    refetch: () => void;
}
declare function useNotifications({ path, pollInterval, }?: UseNotificationsConfig): UseNotificationsReturn;

declare function useAuthSession(): AuthContextValue;
interface AuthProviderProps {
    children: ReactNode;
    config: AuthProviderConfig;
    supabaseClient: SupabaseClient;
}
declare function AuthProvider({ children, config, supabaseClient }: AuthProviderProps): react_jsx_runtime.JSX.Element;

export { AuthProvider, type EgSessionConfig, type EgSessionContextValue, EgSessionProvider, type EgSessionUser, type HeaderNotification, type SSOLoginConfig, type UseNotificationsConfig, type UseNotificationsReturn, useAuthSession, useEgSession, useNotifications, useSSOLogin };
