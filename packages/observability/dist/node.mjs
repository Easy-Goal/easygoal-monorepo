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
  return { ipMode: m && ["full", "hash", "truncate", "none"].includes(m) ? m : void 0, ipSalt: env.OBS_IP_SALT };
}

// src/node.ts
function headerGetter(h) {
  return {
    get(name) {
      const v = h[name.toLowerCase()];
      return Array.isArray(v) ? v.join(", ") : v ?? null;
    }
  };
}
function createNodeLogger(opts = {}) {
  return loggerFromEnv({ intervalMs: 2e3, ...opts });
}
var HEALTH = /^\/(health|healthz|ready|live)(\/|$|\?)/;
function requestLogger(log, opts = {}) {
  const ip = { ...ipOptionsFromEnv(), ...opts };
  const skip = opts.skip ?? ((r) => r.method === "GET" && HEALTH.test(r.originalUrl ?? r.url ?? ""));
  return (req, res, next) => {
    if (skip(req)) return next();
    const start = performance.now();
    let done = false;
    const finish = (aborted) => {
      if (done) return;
      done = true;
      const userId = opts.userId?.(req);
      void httpEvent({
        method: req.method ?? "GET",
        path: req.originalUrl ?? req.url ?? "/",
        headers: headerGetter(req.headers),
        status: res.statusCode,
        durationMs: performance.now() - start,
        userId,
        remoteAddress: req.socket?.remoteAddress
      }, ip).then((f) => log[aborted ? "warn" : levelForStatus(res.statusCode)]("http.request", {
        ...f,
        stage: "server",
        ...aborted ? { aborted: true } : {}
      })).catch(() => void 0);
    };
    res.once("finish", () => finish(false));
    res.once("close", () => finish(true));
    next();
  };
}
function flushOnShutdown(log) {
  const go = () => void log.flush();
  process.once("beforeExit", go);
  for (const sig of ["SIGTERM", "SIGINT"]) {
    process.once(sig, () => {
      void log.flush().finally(() => {
        if (process.listenerCount(sig) === 0) process.kill(process.pid, sig);
      });
    });
  }
}
export {
  createNodeLogger,
  flushOnShutdown,
  headerGetter,
  requestLogger
};
//# sourceMappingURL=node.mjs.map