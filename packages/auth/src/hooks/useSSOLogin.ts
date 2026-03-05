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
  /**
   * Rota local de signout para limpar o cookie httpOnly `eg_session`.
   * Deve apontar para um endpoint POST da própria app.
   * (default: '/api/auth/signout')
   */
  logoutPath?: string;
  /**
   * URL ou path para redirecionar após logout (default: '/').
   * Útil para enviar o usuário ao root da app após sair.
   */
  redirectAfterLogout?: string;
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
  const {
    ssoUrl,
    apiKey,
    callbackPath = '/auth/callback',
    next = '/',
    logoutPath = '/api/auth/signout',
    redirectAfterLogout = '/',
  } = config;

  const login = useCallback(() => {
    const callbackUrl = `${window.location.origin}${callbackPath}`;
    const checkUrl = new URL(`${ssoUrl}/auth/check`);
    checkUrl.searchParams.set('api_key', apiKey);
    checkUrl.searchParams.set('redirect_to', callbackUrl);
    checkUrl.searchParams.set('next', next);
    checkUrl.searchParams.set('prompt', 'login');
    window.location.href = checkUrl.toString();
  }, [ssoUrl, apiKey, callbackPath, next]);

  const logout = useCallback(async () => {
    // limpar storage local
    localStorage.clear();
    sessionStorage.clear();

    // limpar cookie local
    await fetch(logoutPath, {
      method: "POST",
      credentials: "include",
    }).catch(() => { });

    // redirecionar para logout do SSO
    const url = new URL(`${ssoUrl}/auth/signout`);
    url.searchParams.set(
      "redirect_to",
      `${window.location.origin}${redirectAfterLogout}`
    );

    window.location.href = url.toString();
  }, [ssoUrl, logoutPath, redirectAfterLogout]);

  return { login, logout };
}
