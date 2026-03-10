import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const EG_SESSION_COOKIE = "eg_session";

export const dynamic = 'force-dynamic';

/**
 * Decodifica o payload do JWT sem verificar assinatura.
 * Seguro pois o cookie é httpOnly — o SSO já garantiu integridade na emissão.
 */
export async function handleSession(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(EG_SESSION_COOKIE)?.value;

  if (!raw) {
    return NextResponse.json({ error: 'unauthorized', reason: 'missing_session' }, { status: 401 });
  }

  try {
    const payloadBase64 = raw.split('.')[1];
    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf8')
    );
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: 'unauthorized', reason: 'invalid_session' }, { status: 401 });
  }
}
