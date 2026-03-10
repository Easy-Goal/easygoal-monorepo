// src/callback/handler.ts
import { NextResponse } from "next/server";
var EG_SESSION_COOKIE = "eg_session";
var EG_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
var getCookieDomain = () => process.env.NODE_ENV === "production" ? ".easygoal.com.br" : void 0;
async function handleAuthCallback(request, config) {
  const { searchParams, origin } = new URL(request.url);
  const egSessionParam = searchParams.get("eg_session");
  const egToken = searchParams.get("eg_token");
  const next = searchParams.get("next") ?? "/";
  const response = NextResponse.redirect(new URL(next, origin));
  if (egSessionParam) {
    response.cookies.set(EG_SESSION_COOKIE, egSessionParam, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EG_SESSION_MAX_AGE,
      domain: getCookieDomain()
      // <-- Regra do domínio aplicada!
    });
    return response;
  }
  if (egToken) {
    try {
      const verifyRes = await fetch(`${config.ssoUrl}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({ token: egToken })
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
        domain: getCookieDomain()
        // <-- Regra do domínio aplicada!
      });
      return response;
    } catch (err) {
      console.error("[auth callback error]", err);
    }
  }
  const loginUrl = `${config.ssoUrl}/auth/login`;
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(
    `${loginUrl}?redirect_to=${encodeURIComponent(redirectTo)}`
  );
}

// src/callback/route.ts
function createCallbackRoute(config) {
  return async function GET(request) {
    return handleAuthCallback(request, config);
  };
}

// src/signout/handler.ts
import { NextResponse as NextResponse2 } from "next/server";
async function handleSignout() {
  const response = NextResponse2.json({ success: true });
  response.headers.append(
    "Set-Cookie",
    "eg_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly"
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.append(
      "Set-Cookie",
      "eg_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly; Domain=.easygoal.com.br; Secure"
    );
    response.headers.append(
      "Set-Cookie",
      "eg_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly; Domain=easygoal.com.br; Secure"
    );
  }
  return response;
}
function createSignoutRoute() {
  return async function POST(request) {
    return handleSignout();
  };
}

// src/session/handler.ts
import { cookies } from "next/headers";
import { NextResponse as NextResponse3 } from "next/server";
var EG_SESSION_COOKIE2 = "eg_session";
async function handleSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(EG_SESSION_COOKIE2)?.value;
  if (!raw) {
    return NextResponse3.json({ error: "unauthorized", reason: "missing_session" }, { status: 401 });
  }
  try {
    const payloadBase64 = raw.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8")
    );
    return NextResponse3.json(payload);
  } catch {
    return NextResponse3.json({ error: "unauthorized", reason: "invalid_session" }, { status: 401 });
  }
}

// src/session/route.ts
function createSessionRoute() {
  return async function GET() {
    return handleSession();
  };
}

// src/middleware/updateSession.ts
import { jwtVerify } from "jose";
import { NextResponse as NextResponse4 } from "next/server";
var EG_SESSION_COOKIE3 = "eg_session";
async function updateSession(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return NextResponse4.next();
  }
  const egSession = request.cookies.get(EG_SESSION_COOKIE3)?.value;
  if (!egSession) {
    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_SSO_URL);
    loginUrl.searchParams.set("redirect_to", request.nextUrl.href);
    return NextResponse4.redirect(loginUrl);
  }
  try {
    const secret = new TextEncoder().encode(process.env.SSO_JWT_SECRET);
    const { payload } = await jwtVerify(egSession, secret, {
      audience: "eg_session"
    });
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-eg-user", JSON.stringify(payload));
    return NextResponse4.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch (error) {
    console.error("Sess\xE3o inv\xE1lida:", error);
    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_SSO_URL);
    loginUrl.searchParams.set("redirect_to", request.nextUrl.href);
    const response = NextResponse4.redirect(loginUrl);
    response.cookies.set(EG_SESSION_COOKIE3, "", {
      maxAge: 0,
      domain: process.env.NODE_ENV === "production" ? ".easygoal.com.br" : void 0,
      path: "/"
    });
    return response;
  }
}
var defaultMatcherConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};

// src/notifications/handler.ts
import { cookies as cookies2 } from "next/headers";
import { NextResponse as NextResponse5 } from "next/server";
var EG_SESSION_COOKIE4 = "eg_session";
async function getSessionCookie() {
  try {
    const cookieStore = await cookies2();
    return cookieStore.get(EG_SESSION_COOKIE4)?.value ?? null;
  } catch {
    return null;
  }
}
async function handleGetNotifications(_req, config) {
  const session = await getSessionCookie();
  if (!session) {
    return NextResponse5.json({ error: "unauthorized" }, { status: 401 });
  }
  const res = await fetch(`${config.ssoUrl}/api/notifications`, {
    headers: { Cookie: `${EG_SESSION_COOKIE4}=${session}` },
    cache: "no-store"
  }).catch(() => null);
  if (!res) return NextResponse5.json({ error: "sso_unavailable" }, { status: 502 });
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return NextResponse5.json(data, { status: res.status });
  } catch {
    return NextResponse5.json({ error: "invalid_sso_response" }, { status: 502 });
  }
}
async function handleMarkNotificationsRead(req, config) {
  const session = await getSessionCookie();
  if (!session) {
    return NextResponse5.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${config.ssoUrl}/api/notifications`, {
    method: "POST",
    headers: {
      Cookie: `${EG_SESSION_COOKIE4}=${session}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).catch(() => null);
  if (!res) return NextResponse5.json({ error: "sso_unavailable" }, { status: 502 });
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return NextResponse5.json(data, { status: res.status });
  } catch {
    return NextResponse5.json({ error: "invalid_sso_response" }, { status: 502 });
  }
}
async function handleDeleteNotification(req, config) {
  const session = await getSessionCookie();
  if (!session) {
    return NextResponse5.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${config.ssoUrl}/api/notifications`, {
    method: "DELETE",
    headers: {
      Cookie: `${EG_SESSION_COOKIE4}=${session}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).catch(() => null);
  if (!res) return NextResponse5.json({ error: "sso_unavailable" }, { status: 502 });
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return NextResponse5.json(data, { status: res.status });
  } catch {
    return NextResponse5.json({ error: "invalid_sso_response" }, { status: 502 });
  }
}

// src/notifications/route.ts
function createNotificationsRoute(config) {
  return {
    GET: (req) => handleGetNotifications(req, config),
    POST: (req) => handleMarkNotificationsRead(req, config),
    DELETE: (req) => handleDeleteNotification(req, config)
  };
}
export {
  createCallbackRoute,
  createNotificationsRoute,
  createSessionRoute,
  createSignoutRoute,
  defaultMatcherConfig,
  handleAuthCallback,
  handleDeleteNotification,
  handleGetNotifications,
  handleMarkNotificationsRead,
  handleSession,
  handleSignout,
  updateSession
};
//# sourceMappingURL=server.mjs.map