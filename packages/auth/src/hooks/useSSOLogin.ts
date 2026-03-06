'use client';

import { useCallback } from 'react';

export interface SSOLoginConfig {
  ssoUrl: string;
  apiKey: string;
  callbackPath?: string;
  next?: string;
  logoutPath?: string; // Por padrão, vamos assumir '/api/auth/signout'
  redirectAfterLogout?: string;
}

export function useSSOLogin(config: SSOLoginConfig) {
  const login = useCallback(() => {
    const url = new URL(`${config.ssoUrl}/auth/login`);
    if (config.apiKey) url.searchParams.set("api_key", config.apiKey);
    url.searchParams.set("redirect_to", window.location.href);
    window.location.href = url.toString();
  }, [config]);

  const logout = useCallback(async () => {
    localStorage.clear();

    // 1. Chama a API local para limpar o cookie httpOnly "eg_session"
    const localLogoutPath = config.logoutPath || '/api/auth/signout';
    try {
      await fetch(localLogoutPath, { method: 'POST' });
    } catch (error) {
      console.error('Erro ao limpar a sessão local:', error);
    }

    // 2. Redireciona para o SSO para invalidar a sessão lá também
    const url = new URL(`${config.ssoUrl}/auth/signout`);
    url.searchParams.set("redirect_to", config.redirectAfterLogout || window.location.origin);

    window.location.href = url.toString();
  }, [config]);

  return { login, logout };
}