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

// src/external/index.ts
var external_exports = {};
__export(external_exports, {
  buildSsoLoginUrl: () => buildSsoLoginUrl,
  checkAccess: () => checkAccess,
  decodeEgSession: () => decodeEgSession
});
module.exports = __toCommonJS(external_exports);
function buildSsoLoginUrl(appBaseUrl, options = {}) {
  const {
    next = "/dashboard",
    apiKey,
    ssoUrl = "https://sso.easygoal.com.br"
  } = options;
  const callbackUrl = `${appBaseUrl}/api/auth/easygoal/callback?next=${encodeURIComponent(next)}`;
  const url = new URL(`${ssoUrl}/auth/login`);
  url.searchParams.set("redirect_to", callbackUrl);
  if (apiKey) url.searchParams.set("api_key", apiKey);
  return url.toString();
}
function decodeEgSession(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(
      typeof Buffer !== "undefined" ? Buffer.from(payload, "base64url").toString("utf8") : atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
  } catch {
    return null;
  }
}
async function checkAccess(apiKey, userId, email, appUrl = "https://app.easygoal.com.br") {
  const params = new URLSearchParams({ user_id: userId });
  if (email) params.set("email", email);
  try {
    const res = await fetch(`${appUrl}/api/saas/check-access?${params}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store"
    });
    if (!res.ok) return { active: false, reason: "check_failed" };
    return res.json();
  } catch {
    return { active: false, reason: "network_error" };
  }
}
//# sourceMappingURL=external.js.map