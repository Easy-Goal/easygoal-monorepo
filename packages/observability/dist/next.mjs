// src/index.ts
function clientIp(h, remoteAddress, platform = "proxy") {
  const first = (n) => h.get(n)?.split(",")[0]?.trim() || void 0;
  const last = (n) => h.get(n)?.split(",").map((x) => x.trim()).filter(Boolean).pop();
  const raw = platform === "vercel" ? first("x-vercel-forwarded-for") ?? first("x-real-ip") : platform === "cloudflare" ? first("cf-connecting-ip") : platform === "proxy" ? first("x-real-ip") ?? last("x-forwarded-for") ?? remoteAddress : remoteAddress;
  return raw ? parseIp(raw)?.text : void 0;
}
function parseIp(raw) {
  let s = raw.trim();
  const br = s.match(/^\[([^\]]+)\](?::\d{1,5})?$/);
  if (br) s = br[1];
  s = s.replace(/%[\w.-]+$/, "");
  const mapped = s.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) s = mapped[1];
  const v4 = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?::\d{1,5})?$/);
  if (v4) {
    const parts3 = v4.slice(1, 5).map(Number);
    return parts3.every((n) => n <= 255) ? { v: 4, parts: parts3, text: parts3.join(".") } : void 0;
  }
  if (!/^[0-9a-f:]+$/i.test(s) || s.split("::").length > 2) return void 0;
  const [head, tail] = s.includes("::") ? s.split("::") : [s, void 0];
  const hs = head ? head.split(":") : [];
  const ts = tail ? tail.split(":") : [];
  const missing = 8 - hs.length - ts.length;
  if (tail === void 0 ? missing !== 0 : missing < 1) return void 0;
  const groups = [...hs, ...Array(tail === void 0 ? 0 : missing).fill("0"), ...ts];
  if (groups.some((g) => !/^[0-9a-f]{1,4}$/i.test(g))) return void 0;
  const parts2 = groups.map((g) => parseInt(g, 16));
  return { v: 6, parts: parts2, text: parts2.map((n) => n.toString(16)).join(":") };
}
function truncateIp(ip) {
  const p = parseIp(ip);
  if (!p) return void 0;
  return p.v === 4 ? `${p.parts[0]}.${p.parts[1]}.${p.parts[2]}.0/24` : `${p.parts.slice(0, 3).map((n) => n.toString(16)).join(":")}::/48`;
}
async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}:${parseIp(ip)?.text ?? ip}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}
function geoFromHeaders(h, platform = "proxy") {
  const clean = (v, max) => {
    if (!v) return void 0;
    let d = v;
    try {
      d = decodeURIComponent(v);
    } catch {
    }
    return d.slice(0, max);
  };
  const g = platform === "vercel" ? {
    country: clean(h.get("x-vercel-ip-country"), 2),
    region: clean(h.get("x-vercel-ip-country-region"), 8),
    city: clean(h.get("x-vercel-ip-city"), 80)
  } : platform === "cloudflare" ? { country: clean(h.get("cf-ipcountry"), 2) } : {};
  return Object.fromEntries(Object.entries(g).filter(([, v]) => v));
}
var CRAWLERS = /(googlebot|bingbot|yandex(bot)?|duckduckbot|baiduspider|applebot|facebookexternalhit|meta-externalagent|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|discordbot|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-user|perplexitybot|ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|bytespider|uptime-kuma|vercel-(screenshot|favicon))/i;
var TOOLS = /(curl|wget|python-requests|python-urllib|aiohttp|httpx|go-http-client|okhttp|java\/|libwww|httpclient|axios|node-fetch|undici|postmanruntime|insomnia|scrapy|headlesschrome|phantomjs|puppeteer|playwright|nuclei|sqlmap|nikto|masscan|zgrab|nmap)/i;
var BOT_WORD = /(bot|crawl|spider|slurp|scan)/i;
var SCAN_PATH = /(\/\.env|\/\.git(\/|$)|\/\.aws|\/\.ds_store|\/wp-(admin|login|content|includes)|xmlrpc\.php|phpmyadmin|\.php$|\/cgi-bin|\/etc\/passwd|\.\.\/|%2e%2e|\/actuator|\/server-status|\/vendor\/phpunit|\/boaform|\/hnap1|\/\.vscode|\/config\.(json|ya?ml)$|\/\.ssh|\/id_rsa|\/console$|\/solr|\/jenkins)/i;
function classify(ua, path) {
  const u = ua ?? "";
  const crawler = u.match(CRAWLERS)?.[1]?.toLowerCase();
  const tool = u.match(TOOLS)?.[1]?.toLowerCase();
  const isBot = !u || !!crawler || !!tool || BOT_WORD.test(u);
  const device = isBot ? "bot" : /ipad|tablet/i.test(u) ? "tablet" : /mobi|android|iphone/i.test(u) ? "mobile" : /windows|macintosh|linux|cros/i.test(u) ? "desktop" : "unknown";
  return {
    is_bot: isBot,
    ...crawler ? { bot: crawler } : tool ? { bot: `tool:${tool}` } : !u ? { bot: "sem-user-agent" } : {},
    device,
    scan: SCAN_PATH.test(path)
  };
}
async function httpEvent(input, opts = {}) {
  const h = input.headers;
  const path = input.path.split("?")[0].slice(0, 300);
  const ua = h.get("user-agent");
  const platform = opts.platform ?? "proxy";
  const ip = clientIp(h, input.remoteAddress, platform);
  let mode = opts.ipMode ?? (opts.ipSalt ? "hash" : "truncate");
  if (mode === "hash" && !opts.ipSalt) mode = "truncate";
  const ipFields = !ip || mode === "none" ? {} : mode === "full" ? { ip } : mode === "truncate" ? { ip_prefix: truncateIp(ip) } : { ip_hash: await hashIp(ip, opts.ipSalt), ip_prefix: truncateIp(ip) };
  let refererHost;
  try {
    const ref = h.get("referer");
    refererHost = ref ? new URL(ref).host : void 0;
  } catch {
    refererHost = void 0;
  }
  const out = {
    kind: "http",
    http_method: input.method,
    http_host: input.host ?? h.get("host") ?? void 0,
    http_path: path,
    http_status: input.status,
    duration_ms: input.durationMs !== void 0 ? Math.round(input.durationMs) : void 0,
    http_proto: h.get("x-forwarded-proto") ?? void 0,
    referer_host: refererHost,
    ua: ua?.slice(0, 300) ?? void 0,
    ...classify(ua, path),
    ...ipFields,
    geo: geoFromHeaders(h, platform),
    request_id: (h.get("x-request-id") ?? (platform === "vercel" ? h.get("x-vercel-id") : void 0))?.slice(0, 128) ?? void 0,
    user_id: input.userId ?? void 0,
    tls_ja4: platform === "vercel" ? h.get("x-vercel-ja4-digest")?.slice(0, 64) ?? void 0 : void 0
  };
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== void 0));
}
function levelForStatus(status) {
  return status === void 0 || status < 400 ? "info" : status < 500 ? "warn" : "error";
}
function readEnv() {
  return typeof process !== "undefined" && process.env ? process.env : {};
}
function ipOptionsFromEnv(env = readEnv()) {
  const m = env.OBS_IP_MODE;
  const p = env.OBS_PLATFORM;
  return {
    ipMode: m && ["full", "hash", "truncate", "none"].includes(m) ? m : void 0,
    ipSalt: env.OBS_IP_SALT,
    platform: p && ["vercel", "cloudflare", "proxy", "direct"].includes(p) ? p : env.VERCEL === "1" ? "vercel" : "proxy"
  };
}

// src/next.ts
var STATIC = /^\/(_next\/|_vercel\/|favicon\.ico|robots\.txt|sitemap\.xml|manifest\.webmanifest)|\.(js|css|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|txt)$/i;
function parts(req) {
  let host;
  let path = req.nextUrl?.pathname;
  try {
    const u = new URL(req.url);
    host = u.host;
    path ??= u.pathname;
  } catch {
    path ??= req.url;
  }
  return { host: req.nextUrl?.host ?? host, path: path ?? "/" };
}
function observeRequest(log, req, event, opts = {}) {
  const { host, path } = parts(req);
  if ((opts.skip ?? ((p2) => STATIC.test(p2)))(path)) return;
  const p = httpEvent(
    { method: req.method, host, path, headers: req.headers, userId: opts.userId },
    { ...ipOptionsFromEnv(), ...opts }
  ).then((f) => log.info("http.request", { ...f, stage: "edge" })).then(() => log.flush()).catch(() => void 0);
  if (event) event.waitUntil(p);
}
function withObservability(log, handler, opts = {}) {
  return async (req, ...rest) => {
    const start = Date.now();
    let status = 500;
    let error;
    try {
      const res = await handler(req, ...rest);
      status = res.status;
      return res;
    } catch (err) {
      error = err;
      throw err;
    } finally {
      const task = async () => {
        const u = new URL(req.url);
        const userId = await opts.userId?.(req);
        const f = await httpEvent({
          method: req.method,
          host: u.host,
          path: u.pathname,
          headers: req.headers,
          status,
          durationMs: Date.now() - start,
          userId
        }, { ...ipOptionsFromEnv(), ...opts });
        if (error) log.error("http.error", { ...f, err: error });
        else log[levelForStatus(status)]("http.request", { ...f, stage: "handler" });
        await log.flush();
      };
      if (opts.after) opts.after(task);
      else void task().catch(() => void 0);
    }
  };
}
export {
  observeRequest,
  withObservability
};
//# sourceMappingURL=next.mjs.map