import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { CallbackConfig } from '../types';

const EG_SESSION_COOKIE = 'eg_session';
const EG_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export async function handleAuthCallback(
  request: NextRequest,
  config: CallbackConfig
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const egToken = searchParams.get('eg_token');
  const next = searchParams.get('next') ?? '/dashboard';

  // Method 0: EasyGoal JWT (eg_token) — modo sem Supabase
  if (egToken && config.apiKey && config.ssoUrl) {
    try {
      const verifyRes = await fetch(`${config.ssoUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({ token: egToken }),
      });

      if (verifyRes.ok) {
        const { eg_session: egSessionJwt } = await verifyRes.json();
        const redirectResponse = NextResponse.redirect(new URL(next, origin));

        // eg_session é um JWT assinado pelo SSO — apps decodificam o payload (base64)
        // para obter claims do usuário, sem precisar de Supabase ou secret.
        if (egSessionJwt) {
          redirectResponse.cookies.set(EG_SESSION_COOKIE, egSessionJwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: EG_SESSION_MAX_AGE,
          });
        }

        return redirectResponse;
      }

      console.error('[auth] eg_token verify failed:', await verifyRes.text());
    } catch (err) {
      console.error('[auth] eg_token verify error:', err);
    }

    // Falha na verificação — redireciona para login
    const loginUrl = config.ssoUrl || origin;
    const appUrl = config.appUrl || origin;
    const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(
      `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`
    );
  }

  // Silent check sem sessão: não forçar login
  const silentCheck = searchParams.get('silent_check');
  if (silentCheck === 'no_session') {
    return NextResponse.redirect(new URL(next, origin));
  }

  // Métodos legados com Supabase (apenas quando supabaseUrl e supabaseAnonKey estão configurados)
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    // Sem Supabase e sem eg_token válido: redirecionar para login
    const loginUrl = config.ssoUrl || origin;
    const appUrl = config.appUrl || origin;
    const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(
      `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`
    );
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    config.supabaseUrl,
    config.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.cookies.set(name, value, options as any)
          );
        },
      },
    }
  );

  let authSuccess = false;

  // Method 1: Token-based (cross-domain SSO — access_token + refresh_token na URL)
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (!error) {
      authSuccess = true;
    } else {
      console.error('[auth] setSession error:', error.message);
    }
  }

  // Method 2: PKCE code exchange (same-domain flow)
  if (!authSuccess && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      authSuccess = true;
    } else {
      console.error('[auth] exchangeCode error:', error.message);
    }
  }

  if (authSuccess) {
    const redirectResponse = NextResponse.redirect(new URL(next, origin));

    response.cookies.getAll().forEach((cookie: { name: string; value: string }) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });

    return redirectResponse;
  }

  // Fallback: redirect to SSO login
  const loginUrl = config.ssoUrl || origin;
  const appUrl = config.appUrl || origin;
  const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`;

  return NextResponse.redirect(
    `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`
  );
}
