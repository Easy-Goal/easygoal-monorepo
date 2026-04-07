/**
 * @easygoal/auth/external
 *
 * Utilitários para integração no modo externo:
 * - buildSsoLoginUrl: gera URL de login no SSO EG
 * - decodeEgSession: decodifica o JWT sem verificação de assinatura (client-safe)
 * - checkAccess: valida assinatura ativa via /api/saas/check-access
 *
 * Uso típico:
 *   import { buildSsoLoginUrl, checkAccess } from '@easygoal/auth/external'
 */
interface EgSessionClaims {
    sub: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    is_producer?: boolean;
    plan_slug?: string;
    exp?: number;
    iat?: number;
}
interface CheckAccessResult {
    active: boolean;
    subscription_id?: string;
    reason?: string;
}
/**
 * Gera a URL de login no SSO Easy Goal.
 * Inclui api_key para autorizar redirect cross-domain (OAuth Google/GitHub).
 */
declare function buildSsoLoginUrl(appBaseUrl: string, options?: {
    next?: string;
    apiKey?: string;
    ssoUrl?: string;
}): string;
/**
 * Decodifica o payload do eg_session JWT (sem verificar assinatura).
 * Seguro apenas para uso informativo — a verificação de acesso é feita server-side.
 */
declare function decodeEgSession(token: string): EgSessionClaims | null;
/**
 * Valida assinatura ativa consultando o Easy Goal.
 * Deve ser chamado server-side (API route ou Server Action).
 *
 * @param apiKey  - NEXT_PUBLIC_EASY_API_KEY do seu app
 * @param userId  - sub do eg_session (Easy Goal user ID)
 * @param email   - email do eg_session (para lookup guest no primeiro login)
 * @param appUrl  - base URL do app-front Easy Goal (default: https://app.easygoal.com.br)
 */
declare function checkAccess(apiKey: string, userId: string, email?: string, appUrl?: string): Promise<CheckAccessResult>;

export { type CheckAccessResult, type EgSessionClaims, buildSsoLoginUrl, checkAccess, decodeEgSession };
