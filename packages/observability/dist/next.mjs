// src/index.ts
function clientIp(h, remoteAddress) {
  const pick = (n) => h.get(n)?.split(",")[0]?.trim() || void 0;
  return pick("x-vercel-forwarded-for") ?? pick("cf-connecting-ip") ?? pick("x-real-ip") ?? pick("x-forwarded-for") ?? remoteAddress?.replace(/^::ffff:/, "") ?? void 0;
}
function truncateIp(ip) {
  if (ip.includes(":")) return ip.split(":").slice(0, 3).join(":") + "::/48";
  const p = ip.split(".");
  return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}.0/24` : ip;
}
async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}
function geoFromHeaders(h) {
  const city = h.get("x-vercel-ip-city");
  let decoded;
  try {
    decoded = city ? decodeURIComponent(city) : void 0;
  } catch {
    decoded = city ?? void 0;
  }
  const g = {
    country: h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? void 0,
    region: h.get("x-vercel-ip-country-region") ?? void 0,
    city: decoded
  };
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
  const ip = clientIp(h, input.remoteAddress);
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
    geo: geoFromHeaders(h),
    request_id: h.get("x-request-id") ?? h.get("x-vercel-id") ?? void 0,
    user_id: input.userId ?? void 0,
    tls_ja4: h.get("x-vercel-ja4-digest") ?? void 0
  };
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== void 0));
}
function levelForStatus(status) {
  return status === void 0 || status < 400 ? "info" : status < 500 ? "warn" : "error";
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
  const p = httpEvent({ method: req.method, host, path, headers: req.headers, userId: opts.userId }, opts).then((f) => log.info("http.request", { ...f, stage: "edge" })).then(() => log.flush()).catch(() => void 0);
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
        }, opts);
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