// src/callback/handler.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
var EG_SESSION_COOKIE = "eg_session";
var EG_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
async function handleAuthCallback(request, config) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const egToken = searchParams.get("eg_token");
  const next = searchParams.get("next") ?? "/dashboard";
  if (egToken && config.apiKey && config.ssoUrl) {
    try {
      const verifyRes = await fetch(`${config.ssoUrl}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({ token: egToken })
      });
      if (verifyRes.ok) {
        const { eg_session: egSessionJwt } = await verifyRes.json();
        const redirectResponse = NextResponse.redirect(new URL(next, origin));
        if (egSessionJwt) {
          redirectResponse.cookies.set(EG_SESSION_COOKIE, egSessionJwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: EG_SESSION_MAX_AGE
          });
        }
        return redirectResponse;
      }
      console.error("[auth] eg_token verify failed:", await verifyRes.text());
    } catch (err) {
      console.error("[auth] eg_token verify error:", err);
    }
    const loginUrl2 = config.ssoUrl || origin;
    const appUrl2 = config.appUrl || origin;
    const redirectTo2 = `${appUrl2}/auth/callback?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(
      `${loginUrl2}/auth/login?redirect_to=${encodeURIComponent(redirectTo2)}`
    );
  }
  const silentCheck = searchParams.get("silent_check");
  if (silentCheck === "no_session") {
    return NextResponse.redirect(new URL(next, origin));
  }
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    const loginUrl2 = config.ssoUrl || origin;
    const appUrl2 = config.appUrl || origin;
    const redirectTo2 = `${appUrl2}/auth/callback?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(
      `${loginUrl2}/auth/login?redirect_to=${encodeURIComponent(redirectTo2)}`
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(
            ({ name, value, options }) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              response.cookies.set(name, value, options)
            )
          );
        }
      }
    }
  );
  let authSuccess = false;
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    if (!error) {
      authSuccess = true;
    } else {
      console.error("[auth] setSession error:", error.message);
    }
  }
  if (!authSuccess && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      authSuccess = true;
    } else {
      console.error("[auth] exchangeCode error:", error.message);
    }
  }
  if (authSuccess) {
    const redirectResponse = NextResponse.redirect(new URL(next, origin));
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }
  const loginUrl = config.ssoUrl || origin;
  const appUrl = config.appUrl || origin;
  const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(
    `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`
  );
}

// src/callback/route.ts
function createCallbackRoute(config) {
  return async function GET(request) {
    return handleAuthCallback(request, config);
  };
}

// src/signout/handler.ts
import { cookies } from "next/headers";
import { NextResponse as NextResponse2 } from "next/server";
var EG_SESSION_COOKIE2 = "eg_session";
async function handleSignout() {
  const cookieStore = await cookies();
  cookieStore.set(EG_SESSION_COOKIE2, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return NextResponse2.json({ success: true });
}
function createSignoutRoute() {
  return async function POST() {
    return handleSignout();
  };
}

// src/middleware/updateSession.ts
import { createServerClient as createServerClient2 } from "@supabase/ssr";
import { NextResponse as NextResponse3 } from "next/server";
async function updateSession(request, config) {
  let supabaseResponse = NextResponse3.next({ request });
  const supabase = createServerClient2(
    config.supabaseUrl,
    config.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse3.next({ request });
          cookiesToSet.forEach(
            ({ name, value, options }) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              supabaseResponse.cookies.set(name, value, options)
            )
          );
        }
      }
    }
  );
  await supabase.auth.getUser();
  return supabaseResponse;
}
var defaultMatcherConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
export {
  createCallbackRoute,
  createSignoutRoute,
  defaultMatcherConfig,
  handleAuthCallback,
  handleSignout,
  updateSession
};
//# sourceMappingURL=server.mjs.map