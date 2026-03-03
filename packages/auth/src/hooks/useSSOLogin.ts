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
    // Limpar storage local
    localStorage.clear();
    sessionStorage.clear();

    // Limpar o cookie httpOnly eg_session via rota server-side da própria app
    // (document.cookie não consegue deletar cookies httpOnly)
    await fetch(logoutPath, { method: 'POST' }).catch(() => {});

    // Invalidar a sessão Supabase no SSO (fire-and-forget)
    fetch(`${ssoUrl}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});

    window.location.href = redirectAfterLogout;
  }, [ssoUrl, logoutPath, redirectAfterLogout]);

  return { login, logout };
}
