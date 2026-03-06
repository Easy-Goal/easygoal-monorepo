import { NextRequest, NextResponse } from 'next/server';

/**
 * Limpa o cookie httpOnly `eg_session` server-side.
 * Usa a estratégia "nuclear" para garantir a deleção em qualquer variação de domínio.
 */
export async function handleSignout(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });

  // 1. Apaga no domínio estrito (host atual, ex: localhost ou app.easygoal.com.br)
  response.headers.append(
    'Set-Cookie',
    'eg_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly'
  );

  // 2. Apaga no domínio abrangente com ponto (ex: .easygoal.com.br)
  if (process.env.NODE_ENV === "production") {
    response.headers.append(
      'Set-Cookie',
      'eg_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly; Domain=.easygoal.com.br; Secure'
    );

    // 3. Apaga no domínio raiz sem o ponto (alguns browsers diferenciam)
    response.headers.append(
      'Set-Cookie',
      'eg_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly; Domain=easygoal.com.br; Secure'
    );
  }

  return response;
}
/**
 * Factory que cria um route handler POST para signout.
 *
 * Uso em `app/api/auth/signout/route.ts`:
 * ```ts
 * import { createSignoutRoute } from '@easygoal/packages/auth/server';
 * export const POST = createSignoutRoute();
 * ```
 */
export function createSignoutRoute() {
  return async function POST(request: NextRequest): Promise<NextResponse> {
    return handleSignout(); // sua função que limpa o cookie
  };
}
