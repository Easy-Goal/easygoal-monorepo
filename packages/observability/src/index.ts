/**
 * @easygoal/observability — núcleo (ADR 066). Roda em Node e no Edge (sem dependências).
 *
 * - Logger JSON no stdout: já melhora os logs da Vercel, da Railway e do Coolify sem mais nada.
 * - Envio OTLP/HTTP opcional para o OpenObserve do control plane (pelo gateway público de ingestão).
 * - Dados de requisição: IP (cheio, com hash, truncado ou nenhum), geo dos headers da Vercel, bot, varredura.
 *
 * Nunca lança erro por causa de telemetria: falha de envio vira aviso (no máximo 1 por minuto) e o registro é
 * descartado. Campos com cara de segredo (senha, token, cookie, authorization…) saem como "[redacted]".
 */

export type Level = "debug" | "info" | "warn" | "error";
export type Fields = Record<string, unknown>;

export interface LogRecord {
  ts: number; // epoch em ms
  level: Level;
  msg: string;
  fields: Fields;
}

export interface Resource {
  service: string;
  env: string;
  version?: string;
}

export interface Sink {
  write(record: LogRecord, resource: Resource): void;
  flush?(): Promise<void>;
}

export interface Logger {
  debug(msg: string, fields?: Fields): void;
  info(msg: string, fields?: Fields): void;
  warn(msg: string, fields?: Fields): void;
  error(msg: string, fields?: Fields): void;
  /** Logger com campos fixos a mais (ex.: request_id, user_id). Compartilha os sinks. */
  child(fields: Fields): Logger;
  /** Envia o que estiver na fila. Na Vercel: `event.waitUntil(log.flush())` ou `after(() => log.flush())`. */
  flush(): Promise<void>;
  readonly resource: Resource;
}

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

// ---------- redação ----------

const SECRET_KEY = /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|jwt|session|credential|private[-_]?key|cpf|card[-_]?number|cvv/i;
const MAX_DEPTH = 6;

/** Cópia dos campos com segredos trocados por "[redacted]" e Error virando objeto legível. */
export function redact(value: unknown, depth = 0, key = ""): unknown {
  if (key && SECRET_KEY.test(key)) return "[redacted]";
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack?.split("\n").slice(0, 8).join("\n") };
  }
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[depth]";
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redact(v, depth + 1));
  const out: Fields = {};
  for (const [k, v] of Object.entries(value as Fields)) out[k] = redact(v, depth + 1, k);
  return out;
}

// ---------- logger ----------

export interface LoggerOptions extends Resource {
  level?: Level;
  sinks?: Sink[];
  base?: Fields;
}

export function createLogger(opts: LoggerOptions): Logger {
  const resource: Resource = { service: opts.service, env: opts.env, version: opts.version };
  const sinks = opts.sinks ?? [stdoutSink()];
  const min = LEVELS[opts.level ?? "info"];
  const make = (base: Fields): Logger => {
    const emit = (level: Level, msg: string, fields?: Fields) => {
      if (LEVELS[level] < min) return;
      const record: LogRecord = { ts: Date.now(), level, msg, fields: redact({ ...base, ...fields }) as Fields };
      for (const s of sinks) {
        try {
          s.write(record, resource);
        } catch {
          /* telemetria nunca derruba a app */
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
        await Promise.all(sinks.map((s) => s.flush?.().catch(() => undefined)));
      },
    };
  };
  return make(opts.base ?? {});
}

/** Uma linha JSON por registro. error → console.error, warn → console.warn (as plataformas separam por stream). */
export function stdoutSink(): Sink {
  return {
    write(r, res) {
      const line = JSON.stringify({
        ts: new Date(r.ts).toISOString(), level: r.level, msg: r.msg,
        service: res.service, env: res.env, ...(res.version ? { version: res.version } : {}), ...r.fields,
      });
      if (r.level === "error") console.error(line);
      else if (r.level === "warn") console.warn(line);
      else console.log(line);
    },
  };
}

// ---------- OTLP/HTTP (JSON) ----------

export interface OtlpOptions {
  /** URL completa de logs, ex.: https://<cp>.ts.net/api/easygoal/v1/logs */
  endpoint: string;
  /** Valor do header Authorization (ex.: "Basic …" do token de ingestão). */
  authorization?: string;
  /** Stream do OpenObserve (header stream-name). Padrão: o service. */
  stream?: string;
  headers?: Record<string, string>;
  maxBatch?: number; // registros por POST (padrão 200)
  maxQueue?: number; // acima disso descarta os mais antigos (padrão 5000)
  intervalMs?: number; // flush periódico (Node). 0/ausente = só por lote cheio e flush() explícito
  timeoutMs?: number; // padrão 5000
  fetch?: typeof fetch;
  onError?: (err: unknown) => void;
}

const SEVERITY: Record<Level, number> = { debug: 5, info: 9, warn: 13, error: 17 };

type AnyValue = { stringValue: string } | { intValue: string } | { doubleValue: number } | { boolValue: boolean };

function anyValue(v: unknown): AnyValue {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { boolValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { intValue: String(v) } : { doubleValue: v };
  if (typeof v === "bigint") return { intValue: v.toString() };
  return { stringValue: JSON.stringify(v) };
}

/** Achata objetos em chaves com ponto (geo.country): o OpenObserve indexa cada uma como coluna. */
export function flatten(fields: Fields, prefix = "", out: Fields = {}): Fields {
  for (const [k, v] of Object.entries(fields)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) flatten(v as Fields, key, out);
    else if (v !== undefined) out[key] = v;
  }
  return out;
}

export function toOtlpLogs(records: LogRecord[], res: Resource) {
  const attrs = (o: Fields) => Object.entries(o).map(([key, value]) => ({ key, value: anyValue(value) }));
  return {
    resourceLogs: [{
      resource: {
        attributes: attrs({
          "service.name": res.service, "deployment.environment": res.env,
          ...(res.version ? { "service.version": res.version } : {}),
        }),
      },
      scopeLogs: [{
        scope: { name: "@easygoal/observability" },
        logRecords: records.map((r) => ({
          timeUnixNano: `${r.ts}000000`,
          severityNumber: SEVERITY[r.level],
          severityText: r.level.toUpperCase(),
          body: { stringValue: r.msg },
          attributes: attrs(flatten(r.fields)),
        })),
      }],
    }],
  };
}

export function otlpSink(opts: OtlpOptions): Sink & { dropped(): number } {
  const maxBatch = opts.maxBatch ?? 200;
  const maxQueue = opts.maxQueue ?? 5000;
  const doFetch = opts.fetch ?? globalThis.fetch;
  let lastWarn = 0;
  const onError = opts.onError ?? ((err: unknown) => {
    if (Date.now() - lastWarn < 60_000) return;
    lastWarn = Date.now();
    console.warn(`[observability] envio OTLP falhou: ${err instanceof Error ? err.message : String(err)}`);
  });
  let queue: Array<[LogRecord, Resource]> = [];
  let dropped = 0;
  let inflight: Promise<void> = Promise.resolve();

  const send = async (batch: Array<[LogRecord, Resource]>) => {
    const res = batch[0][1];
    const headers: Record<string, string> = {
      "content-type": "application/json",
      "stream-name": opts.stream ?? res.service,
      ...opts.headers,
    };
    if (opts.authorization) headers.authorization = opts.authorization;
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : undefined;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 5000) : undefined;
    try {
      const r = await doFetch(opts.endpoint, {
        method: "POST", headers, body: JSON.stringify(toOtlpLogs(batch.map((b) => b[0]), res)), signal: ctrl?.signal,
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
    } catch (err) {
      onError(err);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const drain = (): Promise<void> => {
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
    const t = setInterval(() => void drain(), opts.intervalMs) as unknown as { unref?: () => void };
    t.unref?.(); // não segura o processo vivo
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
    dropped: () => dropped,
  };
}

// ---------- requisição: IP, geo, bot, varredura ----------

export interface HeaderGetter {
  get(name: string): string | null | undefined;
}

export type IpMode = "full" | "hash" | "truncate" | "none";

/**
 * Em quem confiar para IP e geo. Header de IP/geo só vale quando a borda que o escreve está mesmo na frente:
 * fora da Vercel, qualquer cliente manda `x-vercel-ip-country: BR` ou `x-vercel-forwarded-for` forjados.
 *   vercel      x-vercel-forwarded-for / x-real-ip (a Vercel reescreve) + geo x-vercel-ip-* + JA4
 *   cloudflare  cf-connecting-ip + cf-ipcountry
 *   proxy       x-real-ip (Traefik/Coolify reescreve) → último salto do X-Forwarded-For (o que o proxy
 *               acrescentou; o primeiro o cliente inventa) → socket. Sem geo
 *   direct      só o socket
 * Padrão (ipOptionsFromEnv): OBS_PLATFORM, senão "vercel" quando VERCEL=1, senão "proxy".
 */
export type Platform = "vercel" | "cloudflare" | "proxy" | "direct";

export function clientIp(h: HeaderGetter, remoteAddress?: string, platform: Platform = "proxy"): string | undefined {
  const first = (n: string) => h.get(n)?.split(",")[0]?.trim() || undefined;
  const last = (n: string) => h.get(n)?.split(",").map((x) => x.trim()).filter(Boolean).pop();
  const raw = platform === "vercel" ? first("x-vercel-forwarded-for") ?? first("x-real-ip")
    : platform === "cloudflare" ? first("cf-connecting-ip")
    : platform === "proxy" ? first("x-real-ip") ?? last("x-forwarded-for") ?? remoteAddress
    : remoteAddress;
  return raw ? parseIp(raw)?.text : undefined;
}

interface ParsedIp {
  v: 4 | 6;
  parts: number[]; // 4 octetos ou 8 grupos de 16 bits
  text: string; // forma canônica (IPv4 pontuado; IPv6 com os 8 grupos)
}

/** Parser estrito: aceita [v6]:porta, v4:porta, ::ffff:v4 e zona (%eth0). Qualquer outra coisa → undefined. */
export function parseIp(raw: string): ParsedIp | undefined {
  let s = raw.trim();
  const br = s.match(/^\[([^\]]+)\](?::\d{1,5})?$/);
  if (br) s = br[1];
  s = s.replace(/%[\w.-]+$/, "");
  const mapped = s.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) s = mapped[1];
  const v4 = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?::\d{1,5})?$/);
  if (v4) {
    const parts = v4.slice(1, 5).map(Number);
    return parts.every((n) => n <= 255) ? { v: 4, parts, text: parts.join(".") } : undefined;
  }
  if (!/^[0-9a-f:]+$/i.test(s) || s.split("::").length > 2) return undefined;
  const [head, tail] = s.includes("::") ? s.split("::") : [s, undefined];
  const hs = head ? head.split(":") : [];
  const ts = tail ? tail.split(":") : [];
  const missing = 8 - hs.length - ts.length;
  if (tail === undefined ? missing !== 0 : missing < 1) return undefined;
  const groups = [...hs, ...Array(tail === undefined ? 0 : missing).fill("0"), ...ts];
  if (groups.some((g) => !/^[0-9a-f]{1,4}$/i.test(g))) return undefined;
  const parts = groups.map((g) => parseInt(g, 16));
  return { v: 6, parts, text: parts.map((n) => n.toString(16)).join(":") };
}

/** IPv4 → /24, IPv6 → /48. Mantém país/provedor aproximados sem identificar a pessoa. Inválido → undefined. */
export function truncateIp(ip: string): string | undefined {
  const p = parseIp(ip);
  if (!p) return undefined;
  return p.v === 4 ? `${p.parts[0]}.${p.parts[1]}.${p.parts[2]}.0/24`
    : `${p.parts.slice(0, 3).map((n) => n.toString(16)).join(":")}::/48`;
}

/** SHA-256(salt:ip), 16 hex. Mesmo IP → mesmo hash (dá para contar e bloquear), sem guardar o IP. */
export async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${parseIp(ip)?.text ?? ip}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface Geo {
  country?: string;
  region?: string;
  city?: string;
}

/** Geo grátis da borda: Vercel (x-vercel-ip-*) ou Cloudflare (cf-ipcountry). Em outra plataforma: nada. */
export function geoFromHeaders(h: HeaderGetter, platform: Platform = "proxy"): Geo {
  const clean = (v: string | null | undefined, max: number) => {
    if (!v) return undefined;
    let d = v;
    try {
      d = decodeURIComponent(v);
    } catch {
      /* fica o valor cru */
    }
    return d.slice(0, max);
  };
  const g: Geo = platform === "vercel" ? {
    country: clean(h.get("x-vercel-ip-country"), 2),
    region: clean(h.get("x-vercel-ip-country-region"), 8),
    city: clean(h.get("x-vercel-ip-city"), 80),
  } : platform === "cloudflare" ? { country: clean(h.get("cf-ipcountry"), 2) } : {};
  return Object.fromEntries(Object.entries(g).filter(([, v]) => v)) as Geo;
}

const CRAWLERS = /(googlebot|bingbot|yandex(bot)?|duckduckbot|baiduspider|applebot|facebookexternalhit|meta-externalagent|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|discordbot|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-user|perplexitybot|ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|bytespider|uptime-kuma|vercel-(screenshot|favicon))/i;
const TOOLS = /(curl|wget|python-requests|python-urllib|aiohttp|httpx|go-http-client|okhttp|java\/|libwww|httpclient|axios|node-fetch|undici|postmanruntime|insomnia|scrapy|headlesschrome|phantomjs|puppeteer|playwright|nuclei|sqlmap|nikto|masscan|zgrab|nmap)/i;
const BOT_WORD = /(bot|crawl|spider|slurp|scan)/i;
const SCAN_PATH = /(\/\.env|\/\.git(\/|$)|\/\.aws|\/\.ds_store|\/wp-(admin|login|content|includes)|xmlrpc\.php|phpmyadmin|\.php$|\/cgi-bin|\/etc\/passwd|\.\.\/|%2e%2e|\/actuator|\/server-status|\/vendor\/phpunit|\/boaform|\/hnap1|\/\.vscode|\/config\.(json|ya?ml)$|\/\.ssh|\/id_rsa|\/console$|\/solr|\/jenkins)/i;

export interface Classification {
  is_bot: boolean;
  bot?: string; // nome do crawler conhecido, ou "tool:<nome>" (cliente HTTP/scanner)
  device: "bot" | "mobile" | "tablet" | "desktop" | "unknown";
  scan: boolean; // caminho típico de varredura (.env, wp-admin, …)
}

export function classify(ua: string | null | undefined, path: string): Classification {
  const u = ua ?? "";
  const crawler = u.match(CRAWLERS)?.[1]?.toLowerCase();
  const tool = u.match(TOOLS)?.[1]?.toLowerCase();
  const isBot = !u || !!crawler || !!tool || BOT_WORD.test(u);
  const device = isBot ? "bot" : /ipad|tablet/i.test(u) ? "tablet" : /mobi|android|iphone/i.test(u) ? "mobile"
    : /windows|macintosh|linux|cros/i.test(u) ? "desktop" : "unknown";
  return {
    is_bot: isBot,
    ...(crawler ? { bot: crawler } : tool ? { bot: `tool:${tool}` } : !u ? { bot: "sem-user-agent" } : {}),
    device,
    scan: SCAN_PATH.test(path),
  };
}

export interface IpOptions {
  ipMode?: IpMode; // padrão "hash" com salt, "truncate" sem
  ipSalt?: string; // obrigatório para "hash" (sem salt cai para "truncate")
  platform?: Platform; // em quem confiar para IP/geo (padrão "proxy")
}

export interface HttpInput {
  method: string;
  host?: string | null;
  path: string; // pode vir com query: ela é removida (query costuma carregar token)
  headers: HeaderGetter;
  status?: number;
  durationMs?: number;
  userId?: string | null;
  remoteAddress?: string;
}

/** Campos do evento de requisição (msg "http.request"). Base dos painéis de tráfego, leads e abuso. */
export async function httpEvent(input: HttpInput, opts: IpOptions = {}): Promise<Fields> {
  const h = input.headers;
  const path = input.path.split("?")[0].slice(0, 300);
  const ua = h.get("user-agent");
  const platform = opts.platform ?? "proxy";
  const ip = clientIp(h, input.remoteAddress, platform);
  let mode: IpMode = opts.ipMode ?? (opts.ipSalt ? "hash" : "truncate");
  if (mode === "hash" && !opts.ipSalt) mode = "truncate"; // hash sem salt seria reversível por força bruta
  // clientIp só devolve IP já validado (parseIp): valor estranho no header nunca vai cru para o log.
  const ipFields: Fields = !ip || mode === "none" ? {} : mode === "full" ? { ip }
    : mode === "truncate" ? { ip_prefix: truncateIp(ip) }
    : { ip_hash: await hashIp(ip, opts.ipSalt as string), ip_prefix: truncateIp(ip) };
  let refererHost: string | undefined;
  try {
    const ref = h.get("referer");
    refererHost = ref ? new URL(ref).host : undefined;
  } catch {
    refererHost = undefined;
  }
  const out: Fields = {
    kind: "http",
    http_method: input.method,
    http_host: input.host ?? h.get("host") ?? undefined,
    http_path: path,
    http_status: input.status,
    duration_ms: input.durationMs !== undefined ? Math.round(input.durationMs) : undefined,
    http_proto: h.get("x-forwarded-proto") ?? undefined,
    referer_host: refererHost,
    ua: ua?.slice(0, 300) ?? undefined,
    ...classify(ua, path),
    ...ipFields,
    geo: geoFromHeaders(h, platform),
    request_id: (h.get("x-request-id") ?? (platform === "vercel" ? h.get("x-vercel-id") : undefined))?.slice(0, 128)
      ?? undefined,
    user_id: input.userId ?? undefined,
    tls_ja4: platform === "vercel" ? h.get("x-vercel-ja4-digest")?.slice(0, 64) ?? undefined : undefined,
  };
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined));
}

/** info para 2xx/3xx, warn para 4xx, error para 5xx. */
export function levelForStatus(status?: number): Level {
  return status === undefined || status < 400 ? "info" : status < 500 ? "warn" : "error";
}

// ---------- configuração por ambiente (variáveis sincronizadas pelo cp-secrets) ----------

type Env = Record<string, string | undefined>;

function readEnv(): Env {
  return typeof process !== "undefined" && process.env ? (process.env as Env) : {};
}

/**
 * OBS_SERVICE, OBS_ENV, OBS_VERSION, OBS_LEVEL, OBS_STDOUT ("0" desliga), OBS_OTLP_ENDPOINT,
 * OBS_OTLP_AUTHORIZATION, OBS_OTLP_STREAM, OBS_IP_MODE, OBS_IP_SALT, OBS_PLATFORM. Sem OBS_OTLP_ENDPOINT: só stdout.
 */
export interface FromEnvOptions {
  service?: string; // quando OBS_SERVICE não existe
  version?: string;
  envName?: string; // quando OBS_ENV/VERCEL_ENV/NODE_ENV não existem
  intervalMs?: number; // flush periódico do OTLP (Node)
  env?: Env; // padrão: process.env
}

export function loggerFromEnv(defaults: FromEnvOptions = {}): Logger {
  const e = defaults.env ?? readEnv();
  const sinks: Sink[] = [];
  if (e.OBS_STDOUT !== "0") sinks.push(stdoutSink());
  if (e.OBS_OTLP_ENDPOINT) {
    sinks.push(otlpSink({
      endpoint: e.OBS_OTLP_ENDPOINT, authorization: e.OBS_OTLP_AUTHORIZATION, stream: e.OBS_OTLP_STREAM,
      intervalMs: defaults.intervalMs,
    }));
  }
  const level = (["debug", "info", "warn", "error"] as Level[]).find((l) => l === e.OBS_LEVEL);
  return createLogger({
    service: e.OBS_SERVICE ?? defaults.service ?? "app",
    env: e.OBS_ENV ?? e.VERCEL_ENV ?? defaults.envName ?? e.NODE_ENV ?? "development",
    version: e.OBS_VERSION ?? (e.VERCEL_GIT_COMMIT_SHA ?? e.RAILWAY_GIT_COMMIT_SHA ?? e.SOURCE_COMMIT)?.slice(0, 7)
      ?? defaults.version,
    level,
    sinks,
  });
}

export function ipOptionsFromEnv(env: Env = readEnv()): IpOptions {
  const m = env.OBS_IP_MODE as IpMode | undefined;
  const p = env.OBS_PLATFORM as Platform | undefined;
  return {
    ipMode: m && ["full", "hash", "truncate", "none"].includes(m) ? m : undefined,
    ipSalt: env.OBS_IP_SALT,
    platform: p && ["vercel", "cloudflare", "proxy", "direct"].includes(p) ? p : env.VERCEL === "1" ? "vercel" : "proxy",
  };
}
