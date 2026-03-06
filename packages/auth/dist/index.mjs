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
  const {
    sessionPath = "/api/auth/session"
  } = config ?? {};
  const [state, setState] = useState2({
    user: null,
    isReady: false
  });
  useEffect2(() => {
    let isMounted = true;
    fetch(sessionPath).then(async (res) => {
      if (!res.ok) {
        return null;
      }
      return res.json();
    }).then((data) => {
      if (!isMounted) return;
      if (data && !data.error) {
        const claimsToMap = data.claims || data;
        setState({
          user: mapClaims(claimsToMap),
          isReady: true
          // Libera a UI
        });
      } else {
        setState({
          user: null,
          isReady: true
          // Libera a UI para mostrar os botões "Entrar"
        });
      }
    }).catch((err) => {
      if (!isMounted) return;
      console.error("Erro ao carregar sess\xE3o:", err);
      setState({ user: null, isReady: true });
    });
    return () => {
      isMounted = false;
    };
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
    planSlug: claims.plan_slug ?? null,
    provider: claims.provider ?? void 0
  };
}

// src/hooks/useSSOLogin.ts
import { useCallback as useCallback2 } from "react";
function useSSOLogin(config) {
  const login = useCallback2(() => {
    const url = new URL(`${config.ssoUrl}/auth/login`);
    if (config.apiKey) url.searchParams.set("api_key", config.apiKey);
    url.searchParams.set("redirect_to", window.location.href);
    window.location.href = url.toString();
  }, [config]);
  const logout = useCallback2(async () => {
    localStorage.clear();
    const localLogoutPath = config.logoutPath || "/api/auth/signout";
    try {
      await fetch(localLogoutPath, { method: "POST" });
    } catch (error) {
      console.error("Erro ao limpar a sess\xE3o local:", error);
    }
    const url = new URL(`${config.ssoUrl}/auth/signout`);
    url.searchParams.set("redirect_to", config.redirectAfterLogout || window.location.origin);
    window.location.href = url.toString();
  }, [config]);
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