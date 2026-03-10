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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AuthProvider: () => AuthProvider,
  EgSessionProvider: () => EgSessionProvider,
  useAuthSession: () => useAuthSession,
  useEgSession: () => useEgSession,
  useNotifications: () => useNotifications,
  useSSOLogin: () => useSSOLogin
});
module.exports = __toCommonJS(src_exports);

// src/providers/EgSessionProvider.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var EgSessionContext = (0, import_react.createContext)({
  user: null,
  isReady: false
});
function useEgSession() {
  return (0, import_react.useContext)(EgSessionContext);
}
function EgSessionProvider({ children, config }) {
  const {
    sessionPath = "/api/auth/session"
  } = config ?? {};
  const [state, setState] = (0, import_react.useState)({
    user: null,
    isReady: false
  });
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EgSessionContext.Provider, { value: state, children });
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
var import_react2 = require("react");
function useSSOLogin(config) {
  const login = (0, import_react2.useCallback)(() => {
    const url = new URL(`${config.ssoUrl}/auth/login`);
    if (config.apiKey) url.searchParams.set("api_key", config.apiKey);
    url.searchParams.set("redirect_to", window.location.href);
    window.location.href = url.toString();
  }, [config]);
  const logout = (0, import_react2.useCallback)(async () => {
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
var import_react3 = require("react");
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
  const [notifications, setNotifications] = (0, import_react3.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react3.useState)(true);
  const timerRef = (0, import_react3.useRef)(null);
  const fetchNotifications = (0, import_react3.useCallback)(async () => {
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
  (0, import_react3.useEffect)(() => {
    fetchNotifications();
    if (pollInterval > 0) {
      timerRef.current = setInterval(fetchNotifications, pollInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNotifications, pollInterval]);
  const markAsRead = (0, import_react3.useCallback)(async (id) => {
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
  const markAllAsRead = (0, import_react3.useCallback)(async () => {
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
  const dismiss = (0, import_react3.useCallback)(async (id) => {
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
var import_react4 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var AuthContext = (0, import_react4.createContext)({
  session: null,
  isReady: false,
  signOut: async () => {
  }
});
function useAuthSession() {
  return (0, import_react4.useContext)(AuthContext);
}
function AuthProvider({ children, config, supabaseClient }) {
  const {
    loginUrl,
    appUrl,
    callbackPath = "/auth/callback",
    defaultRedirect = "/dashboard",
    loadingComponent
  } = config;
  const [session, setSession] = (0, import_react4.useState)(null);
  const [isReady, setIsReady] = (0, import_react4.useState)(false);
  const redirectToLogin = (0, import_react4.useCallback)(
    (next) => {
      const redirectTarget = next || defaultRedirect;
      const callbackUrl = `${appUrl}${callbackPath}?next=${encodeURIComponent(redirectTarget)}`;
      const url = `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(callbackUrl)}`;
      window.location.href = url;
    },
    [loginUrl, appUrl, callbackPath, defaultRedirect]
  );
  (0, import_react4.useEffect)(() => {
    supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
        setIsReady(true);
      } else {
        redirectToLogin(window.location.pathname);
      }
    });
  }, [supabaseClient.auth, redirectToLogin]);
  (0, import_react4.useEffect)(() => {
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
  const signOut = (0, import_react4.useCallback)(async () => {
    await supabaseClient.auth.signOut();
    redirectToLogin();
  }, [supabaseClient.auth, redirectToLogin]);
  if (!isReady) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: loadingComponent || /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AuthContext.Provider, { value: { session, isReady, signOut }, children });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthProvider,
  EgSessionProvider,
  useAuthSession,
  useEgSession,
  useNotifications,
  useSSOLogin
});
//# sourceMappingURL=index.js.map