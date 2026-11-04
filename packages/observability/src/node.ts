/**
 * Node (Express e NestJS sobre Express). Tipos estruturais: não depende de express nem de @nestjs.
 *
 *   const log = createNodeLogger({ service: "api-backend" });
 *   app.use(requestLogger(log, { userId: (req) => req.user?.id }));   // Nest: no main.ts, antes do listen
 *   flushOnShutdown(log);
 */
import {
  type FromEnvOptions, type HeaderGetter, type IpOptions, type Logger, httpEvent, ipOptionsFromEnv, levelForStatus,
  loggerFromEnv,
} from "./index";

type NodeHeaders = Record<string, string | string[] | undefined>;

export interface NodeLikeRequest {
  method?: string;
  url?: string;
  originalUrl?: string;
  headers: NodeHeaders;
  socket?: { remoteAddress?: string };
}

export interface NodeLikeResponse {
  statusCode: number;
  once(event: "finish" | "close", cb: () => void): unknown;
}

export function headerGetter(h: NodeHeaders): HeaderGetter {
  return {
    get(name) {
      const v = h[name.toLowerCase()];
      return Array.isArray(v) ? v.join(", ") : v ?? null;
    },
  };
}

/** Logger do Node: lê as variáveis OBS_* e faz flush do OTLP a cada 2 s (timer que não segura o processo). */
export function createNodeLogger(opts: FromEnvOptions = {}): Logger {
  return loggerFromEnv({ intervalMs: 2000, ...opts });
}

export interface RequestLoggerOptions extends IpOptions {
  userId?: (req: any) => string | null | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** true = não registra (padrão: GET /health*, que o Uptime Kuma chama o tempo todo). */
  skip?: (req: NodeLikeRequest) => boolean;
}

const HEALTH = /^\/(health|healthz|ready|live)(\/|$|\?)/;

export function requestLogger(log: Logger, opts: RequestLoggerOptions = {}) {
  const ip = { ...ipOptionsFromEnv(), ...opts };
  const skip = opts.skip ?? ((r: NodeLikeRequest) => r.method === "GET" && HEALTH.test(r.originalUrl ?? r.url ?? ""));
  return (req: NodeLikeRequest, res: NodeLikeResponse, next: () => void) => {
    if (skip(req)) return next();
    const start = performance.now();
    let done = false;
    const finish = (aborted: boolean) => {
      if (done) return;
      done = true;
      // userId depois da resposta: guards/auth do Nest já rodaram e preencheram req.user.
      const userId = opts.userId?.(req);
      void httpEvent({
        method: req.method ?? "GET", path: req.originalUrl ?? req.url ?? "/", headers: headerGetter(req.headers),
        status: res.statusCode, durationMs: performance.now() - start, userId,
        remoteAddress: req.socket?.remoteAddress,
      }, ip).then((f) => log[aborted ? "warn" : levelForStatus(res.statusCode)]("http.request", {
        ...f, stage: "server", ...(aborted ? { aborted: true } : {}),
      })).catch(() => undefined);
    };
    res.once("finish", () => finish(false));
    res.once("close", () => finish(true)); // cliente desistiu antes do fim
    next();
  };
}

/** Envia o que estiver na fila ao receber SIGTERM/SIGINT (deploy/restart do Coolify) e no beforeExit. */
export function flushOnShutdown(log: Logger): void {
  const go = () => void log.flush();
  process.once("beforeExit", go);
  for (const sig of ["SIGTERM", "SIGINT"] as const) {
    process.once(sig, () => {
      // Ouvir o sinal desliga o encerramento padrão do Node. Se mais ninguém ouve (sem enableShutdownHooks do
      // Nest, por exemplo), reenvia o sinal depois do flush; se alguém ouve, ele decide quando sair.
      void log.flush().finally(() => {
        if (process.listenerCount(sig) === 0) process.kill(process.pid, sig);
      });
    });
  }
}
