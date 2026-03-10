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

/**
 * Decodifica o payload do JWT sem verificar assinatura.
 * Seguro pois o cookie é httpOnly — o SSO já garantiu integridade na emissão.
 */
declare function handleSession(): Promise<NextResponse>;

declare function createSessionRoute(): () => Promise<next_server.NextResponse<unknown>>;

declare function updateSession(request: NextRequest): Promise<NextResponse<unknown>>;
declare const defaultMatcherConfig: {
    matcher: string[];
};

interface NotificationsConfig {
    /** URL base do SSO (ex: https://sso.easygoal.com.br) */
    ssoUrl: string;
}
/**
 * GET /api/notifications
 * Proxy para {ssoUrl}/api/notifications, repassando o eg_session.
 */
declare function handleGetNotifications(_req: NextRequest, config: NotificationsConfig): Promise<NextResponse>;
/**
 * POST /api/notifications
 * Body: { id: string } | { all: true }
 * Proxy para {ssoUrl}/api/notifications (mark as read).
 */
declare function handleMarkNotificationsRead(req: NextRequest, config: NotificationsConfig): Promise<NextResponse>;
/**
 * DELETE /api/notifications
 * Body: { id: string }
 * Proxy para {ssoUrl}/api/notifications (dismiss).
 */
declare function handleDeleteNotification(req: NextRequest, config: NotificationsConfig): Promise<NextResponse>;

/**
 * Cria as Route Handlers do Next.js para notificações.
 *
 * @example
 * // app/api/notifications/route.ts
 * import { createNotificationsRoute } from '@easygoal/auth/server';
 * const config = { supabaseUrl: process.env.SUPABASE_URL!, supabaseAnonKey: process.env.SUPABASE_ANON_KEY! };
 * export const { GET, POST, DELETE } = createNotificationsRoute(config);
 */
declare function createNotificationsRoute(config: NotificationsConfig): {
    GET: (req: NextRequest) => Promise<next_server.NextResponse<unknown>>;
    POST: (req: NextRequest) => Promise<next_server.NextResponse<unknown>>;
    DELETE: (req: NextRequest) => Promise<next_server.NextResponse<unknown>>;
};

export { type AuthCompany, type AuthData, type AuthStats, type AuthUser, type CallbackConfig, type HeaderNotification, type MiddlewareConfig, type NotificationsConfig, createCallbackRoute, createNotificationsRoute, createSessionRoute, createSignoutRoute, defaultMatcherConfig, handleAuthCallback, handleDeleteNotification, handleGetNotifications, handleMarkNotificationsRead, handleSession, handleSignout, updateSession };
