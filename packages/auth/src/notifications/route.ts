import { NextRequest } from 'next/server';
import type { NotificationsConfig } from './handler';
import {
  handleDeleteNotification,
  handleGetNotifications,
  handleMarkNotificationsRead,
} from './handler';

/**
 * Cria as Route Handlers do Next.js para notificações.
 *
 * @example
 * // app/api/notifications/route.ts
 * import { createNotificationsRoute } from '@easygoal/auth/server';
 * const config = { supabaseUrl: process.env.SUPABASE_URL!, supabaseAnonKey: process.env.SUPABASE_ANON_KEY! };
 * export const { GET, POST, DELETE } = createNotificationsRoute(config);
 */
export function createNotificationsRoute(config: NotificationsConfig) {
  return {
    GET: (req: NextRequest) => handleGetNotifications(req, config),
    POST: (req: NextRequest) => handleMarkNotificationsRead(req, config),
    DELETE: (req: NextRequest) => handleDeleteNotification(req, config),
  };
}
