/**
 * Next.js (middleware no Edge e route handlers). Tipos estruturais: não depende do pacote `next`.
 *
 * Middleware: registra a CHEGADA da requisição (IP, geo, bot, varredura, usuário). O status final não existe
 * ali (a resposta ainda não foi gerada); status e latência vêm do `withObservability` nos route handlers e,
 * para páginas, do log da própria Vercel.
 */
import { type HeaderGetter, type IpOptions, type Logger, httpEvent, levelForStatus } from "./index";

export interface NextLikeRequest {
  method: string;
  headers: HeaderGetter;
  nextUrl?: { pathname: string; host?: string };
  url: string;
}

export interface WaitUntil {
  waitUntil(promise: Promise<unknown>): void;
}

const STATIC = /^\/(_next\/|_vercel\/|favicon\.ico|robots\.txt|sitemap\.xml|manifest\.webmanifest)|\.(js|css|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|txt)$/i;

export interface ObserveOptions extends IpOptions {
  userId?: string | null;
  /** true = não registra. Padrão: assets estáticos e arquivos do Next. */
  skip?: (path: string) => boolean;
}

function parts(req: NextLikeRequest) {
  let host: string | undefined;
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

/**
 * Chamar no `middleware.ts`, depois de resolver a sessão (para ter o userId):
 *   observeRequest(log, req, event, { userId, ...ipOptionsFromEnv() })
 * O envio roda em `event.waitUntil`, sem atrasar a resposta.
 */
export function observeRequest(log: Logger, req: NextLikeRequest, event?: WaitUntil, opts: ObserveOptions = {}): void {
  const { host, path } = parts(req);
  if ((opts.skip ?? ((p: string) => STATIC.test(p)))(path)) return;
  const p = httpEvent({ method: req.method, host, path, headers: req.headers, userId: opts.userId }, opts)
    .then((f) => log.info("http.request", { ...f, stage: "edge" }))
    .then(() => log.flush())
    .catch(() => undefined);
  if (event) event.waitUntil(p);
}

export interface HandlerOptions extends IpOptions {
  /** `after` de next/server (Next 15+) ou `waitUntil` de @vercel/functions: envia depois da resposta. */
  after?: (task: () => Promise<unknown>) => void;
  userId?: (req: Request) => string | null | undefined | Promise<string | null | undefined>;
}

/**
 * Route handler com status, latência e erro:
 *   export const POST = withObservability(log, async (req) => { ... }, { after })
 * Erro não tratado vira log "http.error" e é relançado (o Next responde 500 como antes).
 */
export function withObservability<A extends unknown[]>(
  log: Logger,
  handler: (req: Request, ...rest: A) => Response | Promise<Response>,
  opts: HandlerOptions = {},
): (req: Request, ...rest: A) => Promise<Response> {
  return async (req, ...rest) => {
    const start = Date.now();
    let status = 500;
    let error: unknown;
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
          method: req.method, host: u.host, path: u.pathname, headers: req.headers, status,
          durationMs: Date.now() - start, userId,
        }, opts);
        if (error) log.error("http.error", { ...f, err: error });
        else log[levelForStatus(status)]("http.request", { ...f, stage: "handler" });
        await log.flush();
      };
      if (opts.after) opts.after(task);
      else void task().catch(() => undefined);
    }
  };
}
