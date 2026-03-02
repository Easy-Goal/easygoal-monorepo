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

interface SSOLoginConfig {
    /** URL base do SSO (ex: https://sso.easygoal.com.br) */
    ssoUrl: string;
    /** API key pública da aplicação (NEXT_PUBLIC_EASY_API_KEY) */
    apiKey: string;
    /** Caminho do callback nesta app (default: '/auth/callback') */
    callbackPath?: string;
    /** Rota para redirecionar após login (default: '/') */
    next?: string;
}
/**
 * Hook para iniciar o fluxo de login via SSO Easy Goal manualmente.
 *
 * Uso:
 * ```tsx
 * const { login } = useSSOLogin({ ssoUrl, apiKey });
 * <button onClick={login}>Entrar</button>
 * ```
 */
declare function useSSOLogin(config: SSOLoginConfig): {
    login: () => void;
};

export { type AuthCompany, type AuthContextValue, type AuthData, AuthProvider, type AuthProviderConfig, type AuthStats, type AuthUser, type SSOLoginConfig, useAuthSession, useSSOLogin };
