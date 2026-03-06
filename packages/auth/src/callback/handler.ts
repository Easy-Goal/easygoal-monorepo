// packages/auth/src/server/callback/handler.ts
import { NextResponse, type NextRequest } from 'next/server';
import type { CallbackConfig } from '../types';

const EG_SESSION_COOKIE = 'eg_session';
const EG_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

// Helper para manter a consistência do domínio (essencial pro logout funcionar globalmente!)
const getCookieDomain = () =>
  process.env.NODE_ENV === "production" ? ".easygoal.com.br" : undefined;

export async function handleAuthCallback(
  request: NextRequest,
  config: CallbackConfig
) {
  const { searchParams, origin } = new URL(request.url);

  const egSessionParam = searchParams.get("eg_session"); // <-- App Interno
  const egToken = searchParams.get("eg_token");          // <-- App Externo
  const next = searchParams.get("next") ?? "/";

  // Já preparamos a resposta de sucesso
  const response = NextResponse.redirect(new URL(next, origin));

  // ==========================================
  // CENÁRIO 1: SSO enviou o eg_session direto na URL (App Interno)
  // ==========================================
  if (egSessionParam) {
    response.cookies.set(EG_SESSION_COOKIE, egSessionParam, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EG_SESSION_MAX_AGE,
      domain: getCookieDomain(), // <-- Regra do domínio aplicada!
    });
    return response;
  }

  // ==========================================
  // CENÁRIO 2: SSO enviou um token temporário (App Externo)
  // ==========================================
  if (egToken) {
    try {
      const verifyRes = await fetch(`${config.ssoUrl}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({ token: egToken }),
      });

      if (!verifyRes.ok) {
        throw new Error("eg_token verify failed");
      }

      const { eg_session } = await verifyRes.json();

      response.cookies.set(EG_SESSION_COOKIE, eg_session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: EG_SESSION_MAX_AGE,
        domain: getCookieDomain(), // <-- Regra do domínio aplicada!
      });

      return response;

    } catch (err) {
      console.error("[auth callback error]", err);
      // Se der erro na verificação, ele cai pro bloco final de fallback
    }
  }

  // ==========================================
  // CENÁRIO 3: Fallback (Não tem sessão ou o verify falhou)
  // ==========================================
  const loginUrl = `${config.ssoUrl}/auth/login`;
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  return NextResponse.redirect(
    `${loginUrl}?redirect_to=${encodeURIComponent(redirectTo)}`
  );
}