// src/external/index.ts
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
export {
  buildSsoLoginUrl,
  checkAccess,
  decodeEgSession
};
//# sourceMappingURL=external.mjs.map