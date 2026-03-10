/**
 * @easygoal/core — UserProfile
 *
 * Interface unificada de perfil de usuário para consumo em todos os apps
 * do ecossistema EasyGoal. Não depende de @supabase/supabase-js.
 */
type UserRole = 'super_admin' | 'admin' | 'producer' | 'member' | 'guest';
type PlanTier = 'free' | 'basic' | 'pro' | 'enterprise';
interface UserCompany {
    id: string;
    name: string;
    cnpj: string | null;
    plan: PlanTier | null;
}
interface UserStats {
    saas_products_count: number;
    active_services_count: number;
}
interface UserPermissions {
    role: UserRole;
    role_id: string | null;
    permissions: string[];
    is_super_admin: boolean;
    is_producer: boolean;
}
/**
 * Perfil canônico do usuário. É a fonte de verdade que todos os apps devem
 * usar. Gerado pelo @easygoal/auth a partir do payload do SSO.
 */
interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    phone_number: string | null;
    provider: string | null;
    access: UserPermissions;
    company: UserCompany | null;
    stats: UserStats | null;
    producer_id: string | null;
}
/** Guard: usuário tem permissão específica */
declare function hasPermission(profile: UserProfile, permission: string): boolean;
/** Guard: usuário é produtor */
declare function isProducer(profile: UserProfile): boolean;
/** Guard: usuário é super admin */
declare function isSuperAdmin(profile: UserProfile): boolean;

/**
 * @easygoal/core — Notifications
 *
 * Sistema de notificações unificado para todos os apps do ecossistema.
 */
type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';
type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
type NotificationCategory = 'system' | 'goal' | 'team' | 'billing' | 'product' | 'alert';
/**
 * Tipos de notificação mapeados na tabela `notifications` do Supabase.
 * Extenda conforme novos eventos forem adicionados ao ecossistema.
 */
type NotificationType = 'producer_invitation' | 'invitation_accepted' | 'invitation_declined' | 'product_approved' | 'product_rejected' | 'service_request_comment' | 'service_request_info_needed' | 'service_request_status_update' | 'subscription_activated' | 'subscription_cancelled' | 'service_feedback_requested' | 'affiliate_invitation' | 'system';
/**
 * Espelho direto da tabela `notifications` no Supabase.
 * Use este tipo nos handlers server-side e no hook useNotifications.
 */
interface NotificationRow {
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
interface Notification {
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
    read_at: string | null;
    created_at: string;
    expires_at: string | null;
}
interface CreateNotificationPayload {
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
interface NotificationFilter {
    user_id?: string;
    category?: NotificationCategory;
    channel?: NotificationChannel;
    status?: NotificationStatus;
    unread_only?: boolean;
    limit?: number;
    offset?: number;
}
interface NotificationState {
    items: Notification[];
    unread_count: number;
    is_loading: boolean;
    error: string | null;
}
interface NotificationActions {
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    dismiss: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}
type NotificationStore = NotificationState & NotificationActions;

export { type CreateNotificationPayload, type Notification, type NotificationActions, type NotificationCategory, type NotificationChannel, type NotificationFilter, type NotificationPriority, type NotificationRow, type NotificationState, type NotificationStatus, type NotificationStore, type NotificationType, type PlanTier, type UserCompany, type UserPermissions, type UserProfile, type UserRole, type UserStats, hasPermission, isProducer, isSuperAdmin };
