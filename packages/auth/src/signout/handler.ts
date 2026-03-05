import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Limpa o cookie httpOnly `eg_session` server-side.
 * Deve ser chamado em um route handler POST da app que usa SSO.
 */
// Dentro de ./signout/handler.ts
export async function handleSignout(): Promise<NextResponse> {
  const cookieStore = await cookies();

  cookieStore.set("eg_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain: process.env.NODE_ENV === "production" ? ".easygoal.com.br" : undefined, // <-- O salvador da pátria!
  });

  return NextResponse.json({ success: true });
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
