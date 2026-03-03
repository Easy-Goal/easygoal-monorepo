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
  const { sessionPath = "/api/auth/session" } = config ?? {};
  const [state, setState] = (0, import_react2.useState)({
    user: null,
    isReady: false
  });
  (0, import_react2.useEffect)(() => {
    fetch(sessionPath).then((res) => res.json()).then((data) => {
      setState({
        user: data ? mapClaims(data) : null,
        isReady: true
      });
    }).catch(() => {
      setState({ user: null, isReady: true });
    });
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
    planSlug: claims.plan_slug ?? null
  };
}

// src/hooks/useSSOLogin.ts
var import_react3 = require("react");
function useSSOLogin(config) {
  const {
    ssoUrl,
    apiKey,
    callbackPath = "/auth/callback",
    next = "/",
    logoutPath = "/api/auth/signout",
    redirectAfterLogout = "/"
  } = config;
  const login = (0, import_react3.useCallback)(() => {
    const callbackUrl = `${window.location.origin}${callbackPath}`;
    const checkUrl = new URL(`${ssoUrl}/auth/check`);
    checkUrl.searchParams.set("api_key", apiKey);
    checkUrl.searchParams.set("redirect_to", callbackUrl);
    checkUrl.searchParams.set("next", next);
    checkUrl.searchParams.set("prompt", "login");
    window.location.href = checkUrl.toString();
  }, [ssoUrl, apiKey, callbackPath, next]);
  const logout = (0, import_react3.useCallback)(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await fetch(logoutPath, { method: "POST" }).catch(() => {
    });
    fetch(`${ssoUrl}/auth/signout`, {
      method: "POST",
      credentials: "include"
    }).catch(() => {
    });
    window.location.href = redirectAfterLogout;
  }, [ssoUrl, logoutPath, redirectAfterLogout]);
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