import * as next_server from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

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
interface CallbackConfig {
    supabaseUrl?: string;
    supabaseAnonKey?: string;
    ssoUrl?: string;
    appUrl?: string;
    /** Server-side API key para verificar eg_token via SSO /auth/verify */
    apiKey?: string;
}
interface MiddlewareConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
}

declare function handleAuthCallback(request: NextRequest, config: CallbackConfig): Promise<NextResponse<unknown>>;

declare function createCallbackRoute(config: CallbackConfig): (request: NextRequest) => Promise<next_server.NextResponse<unknown>>;

/**
 * Limpa o cookie httpOnly `eg_session` server-side.
 * Usa a estratégia "nuclear" para garantir a deleção em qualquer variação de domínio.
 */
declare function handleSignout(): Promise<NextResponse>;
/**
 * Factory que cria um route handler POST para signout.
 *
 * Uso em `app/api/auth/signout/route.ts`:
 * ```ts
 * import { createSignoutRoute } from '@easygoal/packages/auth/server';
 * export const POST = createSignoutRoute();
 * ```
 */
declare function createSignoutRoute(): (request: NextRequest) => Promise<NextResponse>;

declare function updateSession(request: NextRequest): Promise<NextResponse<unknown>>;
declare const defaultMatcherConfig: {
    matcher: string[];
};

export { type AuthCompany, type AuthData, type AuthStats, type AuthUser, type CallbackConfig, type MiddlewareConfig, createCallbackRoute, createSignoutRoute, defaultMatcherConfig, handleAuthCallback, handleSignout, updateSession };
