type Fields = Record<string, unknown>;
interface Resource {
    service: string;
    env: string;
    version?: string;
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
interface IpOptions {
    ipMode?: IpMode;
    ipSalt?: string;
    platform?: Platform;
}
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

/**
 * Node (Express e NestJS sobre Express). Tipos estruturais: não depende de express nem de @nestjs.
 *
 *   const log = createNodeLogger({ service: "api-backend" });
 *   app.use(requestLogger(log, { userId: (req) => req.user?.id }));   // Nest: no main.ts, antes do listen
 *   flushOnShutdown(log);
 */

type NodeHeaders = Record<string, string | string[] | undefined>;
interface NodeLikeRequest {
    method?: string;
    url?: string;
    originalUrl?: string;
    headers: NodeHeaders;
    socket?: {
        remoteAddress?: string;
    };
}
interface NodeLikeResponse {
    statusCode: number;
    once(event: "finish" | "close", cb: () => void): unknown;
}
declare function headerGetter(h: NodeHeaders): HeaderGetter;
/** Logger do Node: lê as variáveis OBS_* e faz flush do OTLP a cada 2 s (timer que não segura o processo). */
declare function createNodeLogger(opts?: FromEnvOptions): Logger;
interface RequestLoggerOptions extends IpOptions {
    userId?: (req: any) => string | null | undefined;
    /** true = não registra (padrão: GET /health*, que o Uptime Kuma chama o tempo todo). */
    skip?: (req: NodeLikeRequest) => boolean;
}
declare function requestLogger(log: Logger, opts?: RequestLoggerOptions): (req: NodeLikeRequest, res: NodeLikeResponse, next: () => void) => void;
/** Envia o que estiver na fila ao receber SIGTERM/SIGINT (deploy/restart do Coolify) e no beforeExit. */
declare function flushOnShutdown(log: Logger): void;

export { type NodeLikeRequest, type NodeLikeResponse, type RequestLoggerOptions, createNodeLogger, flushOnShutdown, headerGetter, requestLogger };
