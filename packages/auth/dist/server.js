"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  createCallbackRoute: () => createCallbackRoute,
  createNotificationsRoute: () => createNotificationsRoute,
  createSessionRoute: () => createSessionRoute,
  createSignoutRoute: () => createSignoutRoute,
  defaultMatcherConfig: () => defaultMatcherConfig,
  handleAuthCallback: () => handleAuthCallback,
  handleDeleteNotification: () => handleDeleteNotification,
  handleGetNotifications: () => handleGetNotifications,
  handleMarkNotificationsRead: () => handleMarkNotificationsRead,
  handleSession: () => handleSession,
  handleSignout: () => handleSignout,
  updateSession: () => updateSession
});
module.exports = __toCommonJS(server_exports);

// src/callback/handler.ts
var import_server = require("next/server");
var EG_SESSION_COOKIE = "eg_session";
var EG_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
var getCookieDomain = () => process.env.NODE_ENV === "production" ? ".easygoal.com.br" : void 0;
async function handleAuthCallback(request, config) {
  const { searchParams, origin } = new URL(request.url);
  const egSessionParam = searchParams.get("eg_session");
  const egToken = searchParams.get("eg_token");
  const next = searchParams.get("next") ?? "/";
  const response = import_server.NextResponse.redirect(new URL(next, origin));
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
  return import_server.NextResponse.redirect(
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
var import_server2 = require("next/server");
async function handleSignout() {
  const response = import_server2.NextResponse.json({ success: true });
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
var import_headers = require("next/headers");
var import_server3 = require("next/server");
var EG_SESSION_COOKIE2 = "eg_session";
async function handleSession() {
  const cookieStore = await (0, import_headers.cookies)();
  const raw = cookieStore.get(EG_SESSION_COOKIE2)?.value;
  if (!raw) {
    return import_server3.NextResponse.json({ error: "unauthorized", reason: "missing_session" }, { status: 401 });
  }
  try {
    const payloadBase64 = raw.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8")
    );
    return import_server3.NextResponse.json(payload);
  } catch {
    return import_server3.NextResponse.json({ error: "unauthorized", reason: "invalid_session" }, { status: 401 });
  }
}

// src/session/route.ts
function createSessionRoute() {
  return async function GET() {
    return handleSession();
  };
}

// src/middleware/updateSession.ts
var import_jose = require("jose");
var import_server4 = require("next/server");
var EG_SESSION_COOKIE3 = "eg_session";
async function updateSession(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return import_server4.NextResponse.next();
  }
  const egSession = request.cookies.get(EG_SESSION_COOKIE3)?.value;
  if (!egSession) {
    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_SSO_URL);
    loginUrl.searchParams.set("redirect_to", request.nextUrl.href);
    return import_server4.NextResponse.redirect(loginUrl);
  }
  try {
    const secret = new TextEncoder().encode(process.env.SSO_JWT_SECRET);
    const { payload } = await (0, import_jose.jwtVerify)(egSession, secret, {
      audience: "eg_session"
    });
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-eg-user", JSON.stringify(payload));
    return import_server4.NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch (error) {
    console.error("Sess\xE3o inv\xE1lida:", error);
    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_SSO_URL);
    loginUrl.searchParams.set("redirect_to", request.nextUrl.href);
    const response = import_server4.NextResponse.redirect(loginUrl);
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
var import_headers2 = require("next/headers");
var import_server5 = require("next/server");
var EG_SESSION_COOKIE4 = "eg_session";
async function getSessionCookie() {
  try {
    const cookieStore = await (0, import_headers2.cookies)();
    return cookieStore.get(EG_SESSION_COOKIE4)?.value ?? null;
  } catch {
    return null;
  }
}
async function handleGetNotifications(_req, config) {
  const session = await getSessionCookie();
  if (!session) {
    return import_server5.NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const res = await fetch(`${config.ssoUrl}/api/notifications`, {
    headers: { Cookie: `${EG_SESSION_COOKIE4}=${session}` },
    cache: "no-store"
  }).catch(() => null);
  if (!res) return import_server5.NextResponse.json({ error: "sso_unavailable" }, { status: 502 });
  const data = await res.json();
  return import_server5.NextResponse.json(data, { status: res.status });
}
async function handleMarkNotificationsRead(req, config) {
  const session = await getSessionCookie();
  if (!session) {
    return import_server5.NextResponse.json({ error: "unauthorized" }, { status: 401 });
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
  if (!res) return import_server5.NextResponse.json({ error: "sso_unavailable" }, { status: 502 });
  const data = await res.json();
  return import_server5.NextResponse.json(data, { status: res.status });
}
async function handleDeleteNotification(req, config) {
  const session = await getSessionCookie();
  if (!session) {
    return import_server5.NextResponse.json({ error: "unauthorized" }, { status: 401 });
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
  if (!res) return import_server5.NextResponse.json({ error: "sso_unavailable" }, { status: 502 });
  const data = await res.json();
  return import_server5.NextResponse.json(data, { status: res.status });
}

// src/notifications/route.ts
function createNotificationsRoute(config) {
  return {
    GET: (req) => handleGetNotifications(req, config),
    POST: (req) => handleMarkNotificationsRead(req, config),
    DELETE: (req) => handleDeleteNotification(req, config)
  };
}
//# sourceMappingURL=server.js.map