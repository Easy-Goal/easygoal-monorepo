/**
 * @easygoal/core — Notifications
 *
 * Sistema de notificações unificado para todos os apps do ecossistema.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export type NotificationCategory =
  | 'system'
  | 'goal'
  | 'team'
  | 'billing'
  | 'product'
  | 'alert';

/**
 * Tipos de notificação mapeados na tabela `notifications` do Supabase.
 * Extenda conforme novos eventos forem adicionados ao ecossistema.
 */
export type NotificationType =
  | 'producer_invitation'
  | 'invitation_accepted'
  | 'invitation_declined'
  | 'product_approved'
  | 'product_rejected'
  | 'service_request_comment'
  | 'service_request_info_needed'
  | 'service_request_status_update'
  | 'subscription_activated'
  | 'subscription_cancelled'
  | 'service_feedback_requested'
  | 'affiliate_invitation'
  | 'system';

// ─── Schema do banco (Supabase) ────────────────────────────────────────────────

/**
 * Espelho direto da tabela `notifications` no Supabase.
 * Use este tipo nos handlers server-side e no hook useNotifications.
 */
export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  /** Campo `message` na tabela (não `body`) */
  message: string;
  data?: Record<string, unknown> | null;
  read_at?: string | null;
  action_url?: string | null;
  created_at: string;
}

// ─── Entidade de aplicação (enriquecida) ──────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;

  type: NotificationType;
  title: string;
  message: string;
  /** URL opcional de destino ao clicar na notificação */
  action_url: string | null;
  /** Dados extras (invitation_id, product_id, etc.) */
  data: Record<string, unknown> | null;

  category: NotificationCategory;
  channel: NotificationChannel;
  priority: NotificationPriority;
  status: NotificationStatus;

  read_at: string | null;   // ISO 8601
  created_at: string;       // ISO 8601
  expires_at: string | null; // ISO 8601
}

// ─── Payload para criação ─────────────────────────────────────────────────────

export interface CreateNotificationPayload {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  data?: Record<string, unknown>;
  category?: NotificationCategory;
  channel?: NotificationChannel;
  priority?: NotificationPriority;
  expires_at?: string;
}

// ─── Filtros de consulta ───────────────────────────────────────────────────────

export interface NotificationFilter {
  user_id?: string;
  category?: NotificationCategory;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  unread_only?: boolean;
  limit?: number;
  offset?: number;
}

// ─── Estado client-side ───────────────────────────────────────────────────────

export interface NotificationState {
  items: Notification[];
  unread_count: number;
  is_loading: boolean;
  error: string | null;
}

export interface NotificationActions {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismiss: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export type NotificationStore = NotificationState & NotificationActions;
