import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';

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
interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    role_id: string | null;
    role_name: string | null;
    permissions: string[];
    is_super_admin: boolean;
    is_producer: boolean;
    producer_id: string | null;
    provider: string | null;
    phone_number: string | null;
}
interface AuthCompany {
    id: string;
    name: string;
    cnpj: string | null;
    plan: string | null;
}
interface AuthStats {
    saas_products_count: number;
    active_services_count: number;
}
interface AuthData {
    user: AuthUser;
    company: AuthCompany | null;
    stats: AuthStats | null;
}

declare function useAuthSession(): AuthContextValue;
interface AuthProviderProps {
    children: ReactNode;
    config: AuthProviderConfig;
    supabaseClient: SupabaseClient;
}
declare function AuthProvider({ children, config, supabaseClient }: AuthProviderProps): react_jsx_runtime.JSX.Element;

interface EgSessionUser {
    id: string;
    email: string | undefined;
    name: string | null;
    avatarUrl: string | null;
    isProducer: boolean;
    companyName: string | null;
    rankName: string | null;
    planSlug: string | null;
}
interface EgSessionContextValue {
    user: EgSessionUser | null;
    isReady: boolean;
}
interface EgSessionConfig {
    /** Path do endpoint que retorna os claims da sessão (default: '/api/auth/session') */
    sessionPath?: string;
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
    logout: () => void;
};

export { type AuthCompany, type AuthContextValue, type AuthData, AuthProvider, type AuthProviderConfig, type AuthStats, type AuthUser, type EgSessionConfig, type EgSessionContextValue, EgSessionProvider, type EgSessionUser, type SSOLoginConfig, useAuthSession, useEgSession, useSSOLogin };
