import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/** Espelho da NotificationRow de @easygoal/core — mantido em sync com o DB. */
interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  read_at?: string | null;
  action_url?: string | null;
  created_at: string;
}

export interface NotificationsConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const EG_SESSION_COOKIE = 'eg_session';

async function resolveUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(EG_SESSION_COOKIE)?.value;
    if (!raw) return null;
    const payload = JSON.parse(
      Buffer.from(raw.split('.')[1], 'base64url').toString('utf8')
    );
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}

/**
 * GET /api/notifications
 * Lista as notificações do usuário autenticado via eg_session.
 */
export async function handleGetNotifications(
  _req: NextRequest,
  config: NotificationsConfig
): Promise<NextResponse> {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, user_id, type, title, message, data, read_at, action_url, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      if (error.code === '42P01') return NextResponse.json([]);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json((data ?? []) as NotificationRow[]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/**
 * POST /api/notifications/read
 * Body: { id: string } | { all: true }
 */
export async function handleMarkNotificationsRead(
  req: NextRequest,
  config: NotificationsConfig
): Promise<NextResponse> {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  const now = new Date().toISOString();

  if (body.all) {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: now })
      .eq('user_id', userId)
      .is('read_at', null);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: now })
      .eq('id', body.id)
      .eq('user_id', userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
}

/**
 * DELETE /api/notifications
 * Body: { id: string }
 */
export async function handleDeleteNotification(
  req: NextRequest,
  config: NotificationsConfig
): Promise<NextResponse> {
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', body.id)
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
