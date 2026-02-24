import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { CallbackConfig } from '../types';

export async function handleAuthCallback(
  request: NextRequest,
  config: CallbackConfig
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const next = searchParams.get('next') ?? '/dashboard';

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
