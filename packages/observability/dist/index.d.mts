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
type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;
interface LogRecord {
    ts: number;
    level: Level;
    msg: string;
    fields: Fields;
}
interface Resource {
    service: string;
    env: string;
    version?: string;
}
interface Sink {
    write(record: LogRecord, resource: Resource): void;
    flush?(): Promise<void>;
}
interface Logger {
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
/** Cópia dos campos com segredos trocados por "[redacted]" e Error virando objeto legível. */
declare function redact(value: unknown, depth?: number, key?: string): unknown;
interface LoggerOptions extends Resource {
    level?: Level;
    sinks?: Sink[];
    base?: Fields;
}
declare function createLogger(opts: LoggerOptions): Logger;
/** Uma linha JSON por registro. error → console.error, warn → console.warn (as plataformas separam por stream). */
declare function stdoutSink(): Sink;
interface OtlpOptions {
    /** URL completa de logs, ex.: https://<cp>.ts.net/api/easygoal/v1/logs */
    endpoint: string;
    /** Valor do header Authorization (ex.: "Basic …" do token de ingestão). */
    authorization?: string;
    /** Stream do OpenObserve (header stream-name). Padrão: o service. */
    stream?: string;
    headers?: Record<string, string>;
    maxBatch?: number;
    maxQueue?: number;
    intervalMs?: number;
    timeoutMs?: number;
    fetch?: typeof fetch;
    onError?: (err: unknown) => void;
}
type AnyValue = {
    stringValue: string;
} | {
    intValue: string;
} | {
    doubleValue: number;
} | {
    boolValue: boolean;
};
/** Achata objetos em chaves com ponto (geo.country): o OpenObserve indexa cada uma como coluna. */
declare function flatten(fields: Fields, prefix?: string, out?: Fields): Fields;
declare function toOtlpLogs(records: LogRecord[], res: Resource): {
    resourceLogs: {
        resource: {
            attributes: {
                key: string;
                value: AnyValue;
            }[];
        };
        scopeLogs: {
            scope: {
                name: string;
            };
            logRecords: {
                timeUnixNano: string;
                severityNumber: number;
                severityText: string;
                body: {
                    stringValue: string;
                };
                attributes: {
                    key: string;
                    value: AnyValue;
                }[];
            }[];
        }[];
    }[];
};
declare function otlpSink(opts: OtlpOptions): Sink & {
    dropped(): number;
};
interface HeaderGetter {
    get(name: string): string | null | undefined;
}
type IpMode = "full" | "hash" | "truncate" | "none";
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
type Platform = "vercel" | "cloudflare" | "proxy" | "direct";
declare function clientIp(h: HeaderGetter, remoteAddress?: string, platform?: Platform): string | undefined;
interface ParsedIp {
    v: 4 | 6;
    parts: number[];
    text: string;
}
/** Parser estrito: aceita [v6]:porta, v4:porta, ::ffff:v4 e zona (%eth0). Qualquer outra coisa → undefined. */
declare function parseIp(raw: string): ParsedIp | undefined;
/** IPv4 → /24, IPv6 → /48. Mantém país/provedor aproximados sem identificar a pessoa. Inválido → undefined. */
declare function truncateIp(ip: string): string | undefined;
/** SHA-256(salt:ip), 16 hex. Mesmo IP → mesmo hash (dá para contar e bloquear), sem guardar o IP. */
declare function hashIp(ip: string, salt: string): Promise<string>;
interface Geo {
    country?: string;
    region?: string;
    city?: string;
}
/** Geo grátis da borda: Vercel (x-vercel-ip-*) ou Cloudflare (cf-ipcountry). Em outra plataforma: nada. */
declare function geoFromHeaders(h: HeaderGetter, platform?: Platform): Geo;
interface Classification {
    is_bot: boolean;
    bot?: string;
    device: "bot" | "mobile" | "tablet" | "desktop" | "unknown";
    scan: boolean;
}
declare function classify(ua: string | null | undefined, path: string): Classification;
interface IpOptions {
    ipMode?: IpMode;
    ipSalt?: string;
    platform?: Platform;
}
interface HttpInput {
    method: string;
    host?: string | null;
    path: string;
    headers: HeaderGetter;
    status?: number;
    durationMs?: number;
    userId?: string | null;
    remoteAddress?: string;
}
/** Campos do evento de requisição (msg "http.request"). Base dos painéis de tráfego, leads e abuso. */
declare function httpEvent(input: HttpInput, opts?: IpOptions): Promise<Fields>;
/** info para 2xx/3xx, warn para 4xx, error para 5xx. */
declare function levelForStatus(status?: number): Level;
type Env = Record<string, string | undefined>;
/**
 * OBS_SERVICE, OBS_ENV, OBS_VERSION, OBS_LEVEL, OBS_STDOUT ("0" desliga), OBS_OTLP_ENDPOINT,
 * OBS_OTLP_AUTHORIZATION, OBS_OTLP_STREAM, OBS_IP_MODE, OBS_IP_SALT, OBS_PLATFORM. Sem OBS_OTLP_ENDPOINT: só stdout.
 */
interface FromEnvOptions {
    service?: string;
    version?: string;
    envName?: string;
    intervalMs?: number;
    env?: Env;
}
declare function loggerFromEnv(defaults?: FromEnvOptions): Logger;
declare function ipOptionsFromEnv(env?: Env): IpOptions;

export { type Classification, type Fields, type FromEnvOptions, type Geo, type HeaderGetter, type HttpInput, type IpMode, type IpOptions, type Level, type LogRecord, type Logger, type LoggerOptions, type OtlpOptions, type Platform, type Resource, type Sink, classify, clientIp, createLogger, flatten, geoFromHeaders, hashIp, httpEvent, ipOptionsFromEnv, levelForStatus, loggerFromEnv, otlpSink, parseIp, redact, stdoutSink, toOtlpLogs, truncateIp };
