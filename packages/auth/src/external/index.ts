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

export interface EgSessionClaims {
  sub: string
  email?: string
  name?: string
  avatar_url?: string
  is_producer?: boolean
  plan_slug?: string
  exp?: number
  iat?: number
}

export interface CheckAccessResult {
  active: boolean
  subscription_id?: string
  reason?: string
}

/**
 * Gera a URL de login no SSO Easy Goal.
 * Inclui api_key para autorizar redirect cross-domain (OAuth Google/GitHub).
 */
export function buildSsoLoginUrl(
  appBaseUrl: string,
  options: { next?: string; apiKey?: string; ssoUrl?: string } = {}
): string {
  const {
    next = '/dashboard',
    apiKey,
    ssoUrl = 'https://sso.easygoal.com.br',
  } = options

  const callbackUrl = `${appBaseUrl}/api/auth/easygoal/callback?next=${encodeURIComponent(next)}`
  const url = new URL(`${ssoUrl}/auth/login`)
  url.searchParams.set('redirect_to', callbackUrl)
  if (apiKey) url.searchParams.set('api_key', apiKey)
  return url.toString()
}

/**
 * Decodifica o payload do eg_session JWT (sem verificar assinatura).
 * Seguro apenas para uso informativo — a verificação de acesso é feita server-side.
 */
export function decodeEgSession(token: string): EgSessionClaims | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(
      typeof Buffer !== 'undefined'
        ? Buffer.from(payload, 'base64url').toString('utf8')
        : atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    )
  } catch {
    return null
  }
}

/**
 * Valida assinatura ativa consultando o Easy Goal.
 * Deve ser chamado server-side (API route ou Server Action).
 *
 * @param apiKey  - NEXT_PUBLIC_EASY_API_KEY do seu app
 * @param userId  - sub do eg_session (Easy Goal user ID)
 * @param email   - email do eg_session (para lookup guest no primeiro login)
 * @param appUrl  - base URL do app-front Easy Goal (default: https://app.easygoal.com.br)
 */
export async function checkAccess(
  apiKey: string,
  userId: string,
  email?: string,
  appUrl = 'https://app.easygoal.com.br'
): Promise<CheckAccessResult> {
  const params = new URLSearchParams({ user_id: userId })
  if (email) params.set('email', email)

  try {
    const res = await fetch(`${appUrl}/api/saas/check-access?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })

    if (!res.ok) return { active: false, reason: 'check_failed' }
    return res.json()
  } catch {
    return { active: false, reason: 'network_error' }
  }
}
