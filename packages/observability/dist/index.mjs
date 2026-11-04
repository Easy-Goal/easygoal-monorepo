// src/index.ts
var LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
var SECRET_KEY = /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|jwt|session|credential|private[-_]?key|cpf|card[-_]?number|cvv/i;
var MAX_DEPTH = 6;
function redact(value, depth = 0, key = "") {
  if (key && SECRET_KEY.test(key)) return "[redacted]";
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack?.split("\n").slice(0, 8).join("\n") };
  }
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[depth]";
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redact(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) out[k] = redact(v, depth + 1, k);
  return out;
}
function createLogger(opts) {
  const resource = { service: opts.service, env: opts.env, version: opts.version };
  const sinks = opts.sinks ?? [stdoutSink()];
  const min = LEVELS[opts.level ?? "info"];
  const make = (base) => {
    const emit = (level, msg, fields) => {
      if (LEVELS[level] < min) return;
      const record = { ts: Date.now(), level, msg, fields: redact({ ...base, ...fields }) };
      for (const s of sinks) {
        try {
          s.write(record, resource);
        } catch {
        }
      }
    };
    return {
      resource,
      debug: (m, f) => emit("debug", m, f),
      info: (m, f) => emit("info", m, f),
      warn: (m, f) => emit("warn", m, f),
      error: (m, f) => emit("error", m, f),
      child: (f) => make({ ...base, ...f }),
      flush: async () => {
        await Promise.all(sinks.map((s) => s.flush?.().catch(() => void 0)));
      }
    };
  };
  return make(opts.base ?? {});
}
function stdoutSink() {
  return {
    write(r, res) {
      const line = JSON.stringify({
        ts: new Date(r.ts).toISOString(),
        level: r.level,
        msg: r.msg,
        service: res.service,
        env: res.env,
        ...res.version ? { version: res.version } : {},
        ...r.fields
      });
      if (r.level === "error") console.error(line);
      else if (r.level === "warn") console.warn(line);
      else console.log(line);
    }
  };
}
var SEVERITY = { debug: 5, info: 9, warn: 13, error: 17 };
function anyValue(v) {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { boolValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { intValue: String(v) } : { doubleValue: v };
  if (typeof v === "bigint") return { intValue: v.toString() };
  return { stringValue: JSON.stringify(v) };
}
function flatten(fields, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(fields)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else if (v !== void 0) out[key] = v;
  }
  return out;
}
function toOtlpLogs(records, res) {
  const attrs = (o) => Object.entries(o).map(([key, value]) => ({ key, value: anyValue(value) }));
  return {
    resourceLogs: [{
      resource: {
        attributes: attrs({
          "service.name": res.service,
          "deployment.environment": res.env,
          ...res.version ? { "service.version": res.version } : {}
        })
      },
      scopeLogs: [{
        scope: { name: "@easygoal/observability" },
        logRecords: records.map((r) => ({
          timeUnixNano: `${r.ts}000000`,
          severityNumber: SEVERITY[r.level],
          severityText: r.level.toUpperCase(),
          body: { stringValue: r.msg },
          attributes: attrs(flatten(r.fields))
        }))
      }]
    }]
  };
}
function otlpSink(opts) {
  const maxBatch = opts.maxBatch ?? 200;
  const maxQueue = opts.maxQueue ?? 5e3;
  const doFetch = opts.fetch ?? globalThis.fetch;
  let lastWarn = 0;
  const onError = opts.onError ?? ((err) => {
    if (Date.now() - lastWarn < 6e4) return;
    lastWarn = Date.now();
    console.warn(`[observability] envio OTLP falhou: ${err instanceof Error ? err.message : String(err)}`);
  });
  let queue = [];
  let dropped = 0;
  let inflight = Promise.resolve();
  const send = async (batch) => {
    const res = batch[0][1];
    const headers = {
      "content-type": "application/json",
      "stream-name": opts.stream ?? res.service,
      ...opts.headers
    };
    if (opts.authorization) headers.authorization = opts.authorization;
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : void 0;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 5e3) : void 0;
    try {
      const r = await doFetch(opts.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(toOtlpLogs(batch.map((b) => b[0]), res)),
        signal: ctrl?.signal
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
    } catch (err) {
      onError(err);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
  const drain = () => {
    inflight = inflight.then(async () => {
      while (queue.length) {
        const batch = queue.slice(0, maxBatch);
        queue = queue.slice(maxBatch);
        await send(batch);
      }
    });
    return inflight;
  };
  if (opts.intervalMs && typeof setInterval !== "undefined") {
    const t = setInterval(() => void drain(), opts.intervalMs);
    t.unref?.();
  }
  return {
    write(record, res) {
      queue.push([record, res]);
      if (queue.length > maxQueue) {
        dropped += queue.length - maxQueue;
        queue = queue.slice(queue.length - maxQueue);
      }
      if (queue.length >= maxBatch) void drain();
    },
    flush: drain,
    dropped: () => dropped
  };
}
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
    const parts2 = v4.slice(1, 5).map(Number);
    return parts2.every((n) => n <= 255) ? { v: 4, parts: parts2, text: parts2.join(".") } : void 0;
  }
  if (!/^[0-9a-f:]+$/i.test(s) || s.split("::").length > 2) return void 0;
  const [head, tail] = s.includes("::") ? s.split("::") : [s, void 0];
  const hs = head ? head.split(":") : [];
  const ts = tail ? tail.split(":") : [];
  const missing = 8 - hs.length - ts.length;
  if (tail === void 0 ? missing !== 0 : missing < 1) return void 0;
  const groups = [...hs, ...Array(tail === void 0 ? 0 : missing).fill("0"), ...ts];
  if (groups.some((g) => !/^[0-9a-f]{1,4}$/i.test(g))) return void 0;
  const parts = groups.map((g) => parseInt(g, 16));
  return { v: 6, parts, text: parts.map((n) => n.toString(16)).join(":") };
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
function loggerFromEnv(defaults = {}) {
  const e = defaults.env ?? readEnv();
  const sinks = [];
  if (e.OBS_STDOUT !== "0") sinks.push(stdoutSink());
  if (e.OBS_OTLP_ENDPOINT) {
    sinks.push(otlpSink({
      endpoint: e.OBS_OTLP_ENDPOINT,
      authorization: e.OBS_OTLP_AUTHORIZATION,
      stream: e.OBS_OTLP_STREAM,
      intervalMs: defaults.intervalMs
    }));
  }
  const level = ["debug", "info", "warn", "error"].find((l) => l === e.OBS_LEVEL);
  return createLogger({
    service: e.OBS_SERVICE ?? defaults.service ?? "app",
    env: e.OBS_ENV ?? e.VERCEL_ENV ?? defaults.envName ?? e.NODE_ENV ?? "development",
    version: e.OBS_VERSION ?? (e.VERCEL_GIT_COMMIT_SHA ?? e.RAILWAY_GIT_COMMIT_SHA ?? e.SOURCE_COMMIT)?.slice(0, 7) ?? defaults.version,
    level,
    sinks
  });
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
export {
  classify,
  clientIp,
  createLogger,
  flatten,
  geoFromHeaders,
  hashIp,
  httpEvent,
  ipOptionsFromEnv,
  levelForStatus,
  loggerFromEnv,
  otlpSink,
  parseIp,
  redact,
  stdoutSink,
  toOtlpLogs,
  truncateIp
};
//# sourceMappingURL=index.mjs.map