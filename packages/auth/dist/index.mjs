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

// src/providers/EgSessionProvider.tsx
import {
  createContext as createContext2,
  useContext as useContext2,
  useEffect as useEffect2,
  useState as useState2
} from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var EgSessionContext = createContext2({
  user: null,
  isReady: false
});
function useEgSession() {
  return useContext2(EgSessionContext);
}
function EgSessionProvider({ children, config }) {
  const { sessionPath = "/api/auth/session" } = config ?? {};
  const [state, setState] = useState2({
    user: null,
    isReady: false
  });
  useEffect2(() => {
    fetch(sessionPath).then((res) => res.json()).then((data) => {
      setState({
        user: data ? mapClaims(data) : null,
        isReady: true
      });
    }).catch(() => {
      setState({ user: null, isReady: true });
    });
  }, [sessionPath]);
  return /* @__PURE__ */ jsx2(EgSessionContext.Provider, { value: state, children });
}
function mapClaims(claims) {
  return {
    id: String(claims.sub ?? ""),
    email: claims.email,
    name: claims.name ?? null,
    avatarUrl: claims.avatar_url ?? null,
    isProducer: claims.is_producer === true,
    companyName: claims.company_name ?? null,
    rankName: claims.rank_name ?? null,
    planSlug: claims.plan_slug ?? null
  };
}

// src/hooks/useSSOLogin.ts
import { useCallback as useCallback2 } from "react";
function useSSOLogin(config) {
  const {
    ssoUrl,
    apiKey,
    callbackPath = "/auth/callback",
    next = "/",
    logoutPath = "/api/auth/signout",
    redirectAfterLogout = "/"
  } = config;
  const login = useCallback2(() => {
    const callbackUrl = `${window.location.origin}${callbackPath}`;
    const checkUrl = new URL(`${ssoUrl}/auth/check`);
    checkUrl.searchParams.set("api_key", apiKey);
    checkUrl.searchParams.set("redirect_to", callbackUrl);
    checkUrl.searchParams.set("next", next);
    checkUrl.searchParams.set("prompt", "login");
    window.location.href = checkUrl.toString();
  }, [ssoUrl, apiKey, callbackPath, next]);
  const logout = useCallback2(() => {
    const returnUrl = `${window.location.origin}${logoutPath}?redirect=${encodeURIComponent(
      redirectAfterLogout
    )}`;
    const url = new URL(`${ssoUrl}/auth/signout`);
    url.searchParams.set("redirect_to", returnUrl);
    window.location.href = url.toString();
  }, [ssoUrl, logoutPath, redirectAfterLogout]);
  return { login, logout };
}
export {
  AuthProvider,
  EgSessionProvider,
  useAuthSession,
  useEgSession,
  useSSOLogin
};
//# sourceMappingURL=index.mjs.map