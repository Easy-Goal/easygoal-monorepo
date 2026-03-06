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
  useSSOLogin: () => useSSOLogin
});
module.exports = __toCommonJS(src_exports);

// src/providers/AuthProvider.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var AuthContext = (0, import_react.createContext)({
  session: null,
  isReady: false,
  signOut: async () => {
  }
});
function useAuthSession() {
  return (0, import_react.useContext)(AuthContext);
}
function AuthProvider({ children, config, supabaseClient }) {
  const {
    loginUrl,
    appUrl,
    callbackPath = "/auth/callback",
    defaultRedirect = "/dashboard",
    loadingComponent
  } = config;
  const [session, setSession] = (0, import_react.useState)(null);
  const [isReady, setIsReady] = (0, import_react.useState)(false);
  const redirectToLogin = (0, import_react.useCallback)(
    (next) => {
      const redirectTarget = next || defaultRedirect;
      const callbackUrl = `${appUrl}${callbackPath}?next=${encodeURIComponent(redirectTarget)}`;
      const url = `${loginUrl}/auth/login?redirect_to=${encodeURIComponent(callbackUrl)}`;
      window.location.href = url;
    },
    [loginUrl, appUrl, callbackPath, defaultRedirect]
  );
  (0, import_react.useEffect)(() => {
    supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
        setIsReady(true);
      } else {
        redirectToLogin(window.location.pathname);
      }
    });
  }, [supabaseClient.auth, redirectToLogin]);
  (0, import_react.useEffect)(() => {
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
  const signOut = (0, import_react.useCallback)(async () => {
    await supabaseClient.auth.signOut();
    redirectToLogin();
  }, [supabaseClient.auth, redirectToLogin]);
  if (!isReady) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: loadingComponent || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, { value: { session, isReady, signOut }, children });
}

// src/providers/EgSessionProvider.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var EgSessionContext = (0, import_react2.createContext)({
  user: null,
  isReady: false
});
function useEgSession() {
  return (0, import_react2.useContext)(EgSessionContext);
}
function EgSessionProvider({ children, config }) {
  const {
    sessionPath = "/api/auth/session"
  } = config ?? {};
  const [state, setState] = (0, import_react2.useState)({
    user: null,
    isReady: false
  });
  (0, import_react2.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(EgSessionContext.Provider, { value: state, children });
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
var import_react3 = require("react");
function useSSOLogin(config) {
  const login = (0, import_react3.useCallback)(() => {
    const url = new URL(`${config.ssoUrl}/auth/login`);
    if (config.apiKey) url.searchParams.set("api_key", config.apiKey);
    url.searchParams.set("redirect_to", window.location.href);
    window.location.href = url.toString();
  }, [config]);
  const logout = (0, import_react3.useCallback)(async () => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthProvider,
  EgSessionProvider,
  useAuthSession,
  useEgSession,
  useSSOLogin
});
//# sourceMappingURL=index.js.map