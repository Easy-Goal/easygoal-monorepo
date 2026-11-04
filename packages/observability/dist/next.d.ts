import { IpOptions, HeaderGetter, Logger } from './index.js';

/**
 * Next.js (middleware no Edge e route handlers). Tipos estruturais: não depende do pacote `next`.
 *
 * Middleware: registra a CHEGADA da requisição (IP, geo, bot, varredura, usuário). O status final não existe
 * ali (a resposta ainda não foi gerada); status e latência vêm do `withObservability` nos route handlers e,
 * para páginas, do log da própria Vercel.
 */

interface NextLikeRequest {
    method: string;
    headers: HeaderGetter;
    nextUrl?: {
        pathname: string;
        host?: string;
    };
    url: string;
}
interface WaitUntil {
    waitUntil(promise: Promise<unknown>): void;
}
interface ObserveOptions extends IpOptions {
    userId?: string | null;
    /** true = não registra. Padrão: assets estáticos e arquivos do Next. */
    skip?: (path: string) => boolean;
}
/**
 * Chamar no `middleware.ts`, depois de resolver a sessão (para ter o userId):
 *   observeRequest(log, req, event, { userId, ...ipOptionsFromEnv() })
 * O envio roda em `event.waitUntil`, sem atrasar a resposta.
 */
declare function observeRequest(log: Logger, req: NextLikeRequest, event?: WaitUntil, opts?: ObserveOptions): void;
interface HandlerOptions extends IpOptions {
    /** `after` de next/server (Next 15+) ou `waitUntil` de @vercel/functions: envia depois da resposta. */
    after?: (task: () => Promise<unknown>) => void;
    userId?: (req: Request) => string | null | undefined | Promise<string | null | undefined>;
}
/**
 * Route handler com status, latência e erro:
 *   export const POST = withObservability(log, async (req) => { ... }, { after })
 * Erro não tratado vira log "http.error" e é relançado (o Next responde 500 como antes).
 */
declare function withObservability<A extends unknown[]>(log: Logger, handler: (req: Request, ...rest: A) => Response | Promise<Response>, opts?: HandlerOptions): (req: Request, ...rest: A) => Promise<Response>;

export { type HandlerOptions, type NextLikeRequest, type ObserveOptions, type WaitUntil, observeRequest, withObservability };
