import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const EG_SESSION_COOKIE = "eg_session";

export async function handleSession(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const egSession = cookieStore.get(EG_SESSION_COOKIE)?.value;

  if (!egSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.SSO_JWT_SECRET!);
    const { payload } = await jwtVerify(egSession, secret, {
      audience: "eg_session",
    });

    return NextResponse.json({ claims: payload });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
