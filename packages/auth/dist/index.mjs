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

// src/hooks/useSSOLogin.ts
import { useCallback as useCallback2 } from "react";
function useSSOLogin(config) {
  const { ssoUrl, apiKey, callbackPath = "/auth/callback", next = "/" } = config;
  const login = useCallback2(() => {
    const callbackUrl = `${window.location.origin}${callbackPath}`;
    const checkUrl = new URL(`${ssoUrl}/auth/check`);
    checkUrl.searchParams.set("api_key", apiKey);
    checkUrl.searchParams.set("redirect_to", callbackUrl);
    checkUrl.searchParams.set("next", next);
    window.location.href = checkUrl.toString();
  }, [ssoUrl, apiKey, callbackPath, next]);
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    fetch(`${ssoUrl}/auth/signout`, {
      method: "POST",
      credentials: "include"
    }).catch(() => {
    });
    window.location.href = "/";
  };
  return { login, logout };
}
export {
  AuthProvider,
  useAuthSession,
  useSSOLogin
};
//# sourceMappingURL=index.mjs.map