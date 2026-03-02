'use client';

import { useCallback } from 'react';

export interface SSOLoginConfig {
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
export function useSSOLogin(config: SSOLoginConfig) {
  const { ssoUrl, apiKey, callbackPath = '/auth/callback', next = '/' } = config;

  const login = useCallback(() => {
    const callbackUrl = `${window.location.origin}${callbackPath}`;
    const checkUrl = new URL(`${ssoUrl}/auth/check`);
    checkUrl.searchParams.set('api_key', apiKey);
    checkUrl.searchParams.set('redirect_to', callbackUrl);
    checkUrl.searchParams.set('next', next);
    window.location.href = checkUrl.toString();
  }, [ssoUrl, apiKey, callbackPath, next]);

  return { login };
}
