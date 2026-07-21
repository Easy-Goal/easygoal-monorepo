import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const EG_SESSION_COOKIE = "eg_session";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🚨 A MÁGICA QUE ACABA COM O LOOP INFINITO 🚨
  // Se a rota for de auth (como o callback), deixamos passar direto!
  if (pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const egSession = request.cookies.get(EG_SESSION_COOKIE)?.value;

  if (!egSession) {
    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_SSO_URL!);
    loginUrl.searchParams.set("redirect_to", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 1. Decodifica e valida o JWT
    const secret = new TextEncoder().encode(process.env.SSO_JWT_SECRET!);
    const { payload } = await jwtVerify(egSession, secret, {
      audience: "eg_session",
    });

    // 2. Clona os headers da requisição
    const requestHeaders = new Headers(request.headers);

    // 3. Injeta o payload do usuário como uma string JSON no header
    requestHeaders.set('x-eg-user', JSON.stringify(payload));

    // 4. Retorna a resposta passando os headers modificados pra frente
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });

  } catch (error) {
    // Se o token for inválido/expirado, ou a secret estiver errada:
    console.error("Sessão inválida:", error);

    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_SSO_URL!);
    loginUrl.searchParams.set("redirect_to", request.nextUrl.href);

    const response = NextResponse.redirect(loginUrl);

    // Já aproveita e limpa o cookie inválido
    response.cookies.set(EG_SESSION_COOKIE, "", {
      maxAge: 0,
      domain: process.env.NODE_ENV === "production" ? ".easygoal.com.br" : undefined,
      path: "/"
    });

    return response;
  }
}

export const defaultMatcherConfig = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};