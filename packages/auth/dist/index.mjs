// src/providers/EgSessionProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { jsx } from "react/jsx-runtime";
var EgSessionContext = createContext({
  user: null,
  isReady: false
});
function useEgSession() {
  return useContext(EgSessionContext);
}
function EgSessionProvider({ children, config }) {
  const {
    sessionPath = "/api/auth/session"
  } = config ?? {};
  const [state, setState] = useState({
    user: null,
    isReady: false
  });
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(EgSessionContext.Provider, { value: state, children });
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
import { useCallback } from "react";
function useSSOLogin(config) {
  const login = useCallback(() => {
    const url = new URL(`${config.ssoUrl}/auth/login`);
    if (config.apiKey) url.searchParams.set("api_key", config.apiKey);
    url.searchParams.set("redirect_to", window.location.href);
    window.location.href = url.toString();
  }, [config]);
  const logout = useCallback(async () => {
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

// src/hooks/useNotifications.ts
import { useCallback as useCallback2, useEffect as useEffect2, useRef, useState as useState2 } from "react";
function mapRow(row) {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    message: String(row.message ?? ""),
    readAt: row.read_at ?? null,
    createdAt: String(row.created_at ?? ""),
    actionUrl: row.action_url ?? null
  };
}
function useNotifications({
  path = "/api/notifications",
  pollInterval = 3e4
} = {}) {
  const [notifications, setNotifications] = useState2([]);
  const [isLoading, setIsLoading] = useState2(true);
  const timerRef = useRef(null);
  const fetchNotifications = useCallback2(async () => {
    try {
      const res = await fetch(path, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data.map(mapRow) : []);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [path]);
  useEffect2(() => {
    fetchNotifications();
    if (pollInterval > 0) {
      timerRef.current = setInterval(fetchNotifications, pollInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNotifications, pollInterval]);
  const markAsRead = useCallback2(async (id) => {
    setNotifications(
      (prev) => prev.map((n) => n.id === id ? { ...n, readAt: (/* @__PURE__ */ new Date()).toISOString() } : n)
    );
    await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    }).catch(() => null);
  }, [path]);
  const markAllAsRead = useCallback2(async () => {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    setNotifications(
      (prev) => prev.map((n) => n.readAt ? n : { ...n, readAt: now })
    );
    await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true })
    }).catch(() => null);
  }, [path]);
  const dismiss = useCallback2(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await fetch(path, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    }).catch(() => null);
  }, [path]);
  const unreadCount = notifications.filter((n) => !n.readAt).length;
  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismiss,
    refetch: fetchNotifications
  };
}

// src/providers/AuthProvider.tsx
import {
  createContext as createContext2,
  useCallback as useCallback3,
  useContext as useContext2,
  useEffect as useEffect3,
  useState as useState3
} from "react";
import { Fragment, jsx as jsx2 } from "react/jsx-runtime";
var AuthContext = createContext2({
  session: null,
  isReady: false,
  signOut: async () => {
  }
});
function useAuthSession() {
  return useContext2(AuthContext);
}
function AuthProvider({ children, config, supabaseClient }) {
  const {
    loginUrl,
    appUrl,
    callbackPath = "/auth/callback",
    defaultRedirect = "/dashboard",
    loadingComponent
  } = config;
  const [session, setSession] = useState3(null);
  const [isReady, setIsReady] = useState3(false);
  const redirectToLogin = useCallback3(
    (next) => {
      const redirectTarget = next || defaultRedirect;
      const callbackUrl = `${appUrl}${callbackPath}?next=${encodeURIComponent(redirectTarget)}`;
      const url = `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(callbackUrl)}`;
      window.location.href = url;
    },
    [loginUrl, appUrl, callbackPath, defaultRedirect]
  );
  useEffect3(() => {
    supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
        setIsReady(true);
      } else {
        redirectToLogin(window.location.pathname);
      }
    });
  }, [supabaseClient.auth, redirectToLogin]);
  useEffect3(() => {
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
  const signOut = useCallback3(async () => {
    await supabaseClient.auth.signOut();
    redirectToLogin();
  }, [supabaseClient.auth, redirectToLogin]);
  if (!isReady) {
    return /* @__PURE__ */ jsx2(Fragment, { children: loadingComponent || /* @__PURE__ */ jsx2("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsx2("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) }) });
  }
  return /* @__PURE__ */ jsx2(AuthContext.Provider, { value: { session, isReady, signOut }, children });
}
export {
  AuthProvider,
  EgSessionProvider,
  useAuthSession,
  useEgSession,
  useNotifications,
  useSSOLogin
};
//# sourceMappingURL=index.mjs.map