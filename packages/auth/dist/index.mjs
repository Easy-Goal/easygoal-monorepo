// src/providers/AuthProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { Fragment, jsx } from "react/jsx-runtime";
var AuthContext = createContext({
  session: null,
  isReady: false,
  signOut: async () => {
  }
});
function useAuthSession() {
  return useContext(AuthContext);
}
function AuthProvider({ children, config, supabaseClient }) {
  const {
    loginUrl,
    appUrl,
    callbackPath = "/auth/callback",
    defaultRedirect = "/dashboard",
    loadingComponent
  } = config;
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const redirectToLogin = useCallback(
    (next) => {
      const redirectTarget = next || defaultRedirect;
      const callbackUrl = `${appUrl}${callbackPath}?next=${encodeURIComponent(redirectTarget)}`;
      const url = `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(callbackUrl)}`;
      window.location.href = url;
    },
    [loginUrl, appUrl, callbackPath, defaultRedirect]
  );
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
        setIsReady(true);
      } else {
        redirectToLogin(window.location.pathname);
      }
    });
  }, [supabaseClient.auth, redirectToLogin]);
  useEffect(() => {
    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange((event, currentSession) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setSession(currentSession);
        setIsReady(true);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        redirectToLogin();
      }
    });
    return () => subscription.unsubscribe();
  }, [supabaseClient.auth, redirectToLogin]);
  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut();
    redirectToLogin();
  }, [supabaseClient.auth, redirectToLogin]);
  if (!isReady) {
    return /* @__PURE__ */ jsx(Fragment, { children: loadingComponent || /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) }) });
  }
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { session, isReady, signOut }, children });
}

// src/callback/handler.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
async function handleAuthCallback(request, config) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const next = searchParams.get("next") ?? "/dashboard";
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

// src/middleware/updateSession.ts
import { createServerClient as createServerClient2 } from "@supabase/ssr";
import { NextResponse as NextResponse2 } from "next/server";
async function updateSession(request, config) {
  let supabaseResponse = NextResponse2.next({ request });
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
          supabaseResponse = NextResponse2.next({ request });
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
  AuthProvider,
  createCallbackRoute,
  defaultMatcherConfig,
  handleAuthCallback,
  updateSession,
  useAuthSession
};
//# sourceMappingURL=index.mjs.map