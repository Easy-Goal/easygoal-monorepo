import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface NotificationsConfig {
  /** URL base do SSO (ex: https://sso.easygoal.com.br) */
  ssoUrl: string;
}

const EG_SESSION_COOKIE = 'eg_session';

async function getSessionCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(EG_SESSION_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * GET /api/notifications
 * Proxy para {ssoUrl}/api/notifications, repassando o eg_session.
 */
export async function handleGetNotifications(
  _req: NextRequest,
  config: NotificationsConfig
): Promise<NextResponse> {
  const session = await getSessionCookie();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${config.ssoUrl}/api/notifications`, {
    headers: { Cookie: `${EG_SESSION_COOKIE}=${session}` },
    cache: 'no-store',
  }).catch(() => null);

  if (!res) return NextResponse.json({ error: 'sso_unavailable' }, { status: 502 });

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'invalid_sso_response' }, { status: 502 });
  }
}

/**
 * POST /api/notifications
 * Body: { id: string } | { all: true }
 * Proxy para {ssoUrl}/api/notifications (mark as read).
 */
export async function handleMarkNotificationsRead(
  req: NextRequest,
  config: NotificationsConfig
): Promise<NextResponse> {
  const session = await getSessionCookie();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${config.ssoUrl}/api/notifications`, {
    method: 'POST',
    headers: {
      Cookie: `${EG_SESSION_COOKIE}=${session}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (!res) return NextResponse.json({ error: 'sso_unavailable' }, { status: 502 });

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'invalid_sso_response' }, { status: 502 });
  }
}

/**
 * DELETE /api/notifications
 * Body: { id: string }
 * Proxy para {ssoUrl}/api/notifications (dismiss).
 */
export async function handleDeleteNotification(
  req: NextRequest,
  config: NotificationsConfig
): Promise<NextResponse> {
  const session = await getSessionCookie();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${config.ssoUrl}/api/notifications`, {
    method: 'DELETE',
    headers: {
      Cookie: `${EG_SESSION_COOKIE}=${session}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (!res) return NextResponse.json({ error: 'sso_unavailable' }, { status: 502 });

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'invalid_sso_response' }, { status: 502 });
  }
}
