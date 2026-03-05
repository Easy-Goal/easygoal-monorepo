'use client';

import { useCallback } from 'react';

export interface SSOLoginConfig {
  ssoUrl: string;
  apiKey: string;
  callbackPath?: string;
  next?: string;
  logoutPath?: string;
  redirectAfterLogout?: string;
}

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

  const logout = useCallback(() => {
    const returnUrl = `${window.location.origin}${logoutPath}?redirect=${encodeURIComponent(
      redirectAfterLogout
    )}`;

    const url = new URL(`${ssoUrl}/auth/signout`);
    url.searchParams.set("redirect_to", returnUrl);

    window.location.href = url.toString();
  }, [ssoUrl, logoutPath, redirectAfterLogout]);

  return { login, logout };
}