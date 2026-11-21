import { z } from 'zod';

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

declare const CompleteProfileSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    has_company: z.ZodBoolean;
    beta_accepted: z.ZodLiteral<true>;
    name_company: z.ZodOptional<z.ZodString>;
    cnpj_company: z.ZodOptional<z.ZodString>;
    cpf: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    has_company: boolean;
    beta_accepted: true;
    name_company?: string | undefined;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
}, {
    has_company: boolean;
    beta_accepted: true;
    name_company?: string | undefined;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
}>, {
    has_company: boolean;
    beta_accepted: true;
    name_company?: string | undefined;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
}, {
    has_company: boolean;
    beta_accepted: true;
    name_company?: string | undefined;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
}>, {
    has_company: boolean;
    beta_accepted: true;
    name_company?: string | undefined;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
}, {
    has_company: boolean;
    beta_accepted: true;
    name_company?: string | undefined;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
}>;
type CompleteProfileDto = z.infer<typeof CompleteProfileSchema>;
declare const ForgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
type LoginDto = z.infer<typeof LoginSchema>;
declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    name_company: z.ZodString;
    cnpj_company: z.ZodOptional<z.ZodString>;
    cpf: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    plan_slug: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name_company: string;
    password: string;
    name: string;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
    plan_slug?: string | undefined;
}, {
    email: string;
    name_company: string;
    password: string;
    name: string;
    cnpj_company?: string | undefined;
    cpf?: string | undefined;
    phone?: string | undefined;
    plan_slug?: string | undefined;
}>;
type RegisterDto = z.infer<typeof RegisterSchema>;
declare const ResetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    new_password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    new_password: string;
}, {
    token: string;
    new_password: string;
}>;
type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
declare const SessionExchangeSchema: z.ZodObject<{
    access_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    access_token: string;
}, {
    access_token: string;
}>;
type SessionExchangeDto = z.infer<typeof SessionExchangeSchema>;
declare const VerifyTokenSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
type VerifyTokenDto = z.infer<typeof VerifyTokenSchema>;
declare const TokenRequestSchema: z.ZodDiscriminatedUnion<"grant_type", [z.ZodObject<{
    grant_type: z.ZodLiteral<"client_credentials">;
    client_id: z.ZodString;
    client_secret: z.ZodString;
}, "strip", z.ZodTypeAny, {
    grant_type: "client_credentials";
    client_id: string;
    client_secret: string;
}, {
    grant_type: "client_credentials";
    client_id: string;
    client_secret: string;
}>, z.ZodObject<{
    grant_type: z.ZodLiteral<"password">;
    client_id: z.ZodString;
    client_secret: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    grant_type: "password";
    client_id: string;
    client_secret: string;
    username: string;
}, {
    password: string;
    grant_type: "password";
    client_id: string;
    client_secret: string;
    username: string;
}>, z.ZodObject<{
    grant_type: z.ZodLiteral<"refresh_token">;
    client_id: z.ZodString;
    client_secret: z.ZodString;
    refresh_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    grant_type: "refresh_token";
    client_id: string;
    client_secret: string;
    refresh_token: string;
}, {
    grant_type: "refresh_token";
    client_id: string;
    client_secret: string;
    refresh_token: string;
}>]>;
type TokenRequestDto = z.infer<typeof TokenRequestSchema>;

declare const CreateCompanySchema: z.ZodObject<{
    name: z.ZodString;
    cnpj: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    cnpj: string;
}, {
    name: string;
    cnpj: string;
}>;
type CreateCompanyDto = z.infer<typeof CreateCompanySchema>;
declare const UpdateCompanySchema: z.ZodObject<{
    name: z.ZodString;
    cnpj: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    invite_from_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    invite_from_email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    cnpj?: string | null | undefined;
    invite_from_name?: string | null | undefined;
    invite_from_email?: string | null | undefined;
}, {
    name: string;
    cnpj?: string | null | undefined;
    invite_from_name?: string | null | undefined;
    invite_from_email?: string | null | undefined;
}>;
type UpdateCompanyDto = z.infer<typeof UpdateCompanySchema>;
declare const SwitchCompanySchema: z.ZodObject<{
    company_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    company_id: string;
}, {
    company_id: string;
}>;
type SwitchCompanyDto = z.infer<typeof SwitchCompanySchema>;
declare const UpdateAccountSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone_number?: string | null | undefined;
}, {
    name?: string | undefined;
    phone_number?: string | null | undefined;
}>;
type UpdateAccountDto = z.infer<typeof UpdateAccountSchema>;
declare const UpdateEmailSchema: z.ZodObject<{
    email: z.ZodString;
    currentPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    currentPassword: string;
}, {
    email: string;
    currentPassword: string;
}>;
type UpdateEmailDto = z.infer<typeof UpdateEmailSchema>;
declare const UpdatePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
declare const UpdatePaymentSettingsSchema: z.ZodObject<{
    abacatepay_email: z.ZodOptional<z.ZodString>;
    pix_key: z.ZodOptional<z.ZodString>;
    pix_key_type: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    abacatepay_email?: string | undefined;
    pix_key?: string | undefined;
    pix_key_type?: string | undefined;
}, {
    abacatepay_email?: string | undefined;
    pix_key?: string | undefined;
    pix_key_type?: string | undefined;
}>;
type UpdatePaymentSettingsDto = z.infer<typeof UpdatePaymentSettingsSchema>;

declare const CreateServiceRequestSchema: z.ZodObject<{
    service_id: z.ZodNumber;
    chat_data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    utm_source: z.ZodOptional<z.ZodString>;
    utm_medium: z.ZodOptional<z.ZodString>;
    utm_campaign: z.ZodOptional<z.ZodString>;
    utm_content: z.ZodOptional<z.ZodString>;
    referrer_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    service_id: number;
    chat_data: Record<string, unknown>;
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
    referrer_url?: string | undefined;
}, {
    service_id: number;
    chat_data: Record<string, unknown>;
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
    referrer_url?: string | undefined;
}>;
type CreateServiceRequestDto = z.infer<typeof CreateServiceRequestSchema>;
declare const SignServiceRequestSchema: z.ZodObject<{
    signature_data: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    signature_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    signature_data?: string | null | undefined;
    signature_name?: string | null | undefined;
}, {
    signature_data?: string | null | undefined;
    signature_name?: string | null | undefined;
}>;
type SignServiceRequestDto = z.infer<typeof SignServiceRequestSchema>;
declare const CreateCommentSchema: z.ZodObject<{
    request_id: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    request_id: string;
    content: string;
}, {
    request_id: string;
    content: string;
}>;
type CreateCommentDto = z.infer<typeof CreateCommentSchema>;

declare const CancelSubscriptionSchema: z.ZodObject<{
    subscription_id: z.ZodString;
    reason: z.ZodEnum<["too_expensive", "no_longer_needed", "found_alternative", "technical_issues", "poor_support", "other"]>;
    feedback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    subscription_id: string;
    reason: "too_expensive" | "no_longer_needed" | "found_alternative" | "technical_issues" | "poor_support" | "other";
    feedback?: string | undefined;
}, {
    subscription_id: string;
    reason: "too_expensive" | "no_longer_needed" | "found_alternative" | "technical_issues" | "poor_support" | "other";
    feedback?: string | undefined;
}>;
type CancelSubscriptionDto = z.infer<typeof CancelSubscriptionSchema>;
declare const CreateFeedbackSchema: z.ZodObject<{
    content: z.ZodString;
    rating: z.ZodOptional<z.ZodNumber>;
    visibility: z.ZodDefault<z.ZodEnum<["public", "producer_only"]>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    visibility: "public" | "producer_only";
    rating?: number | undefined;
}, {
    content: string;
    rating?: number | undefined;
    visibility?: "public" | "producer_only" | undefined;
}>;
type CreateFeedbackDto = z.infer<typeof CreateFeedbackSchema>;
declare const InviteProducerSchema: z.ZodObject<{
    email: z.ZodString;
    equity_percent: z.ZodNumber;
    analytics_access: z.ZodDefault<z.ZodEnum<["full", "financial_only"]>>;
    google_email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    equity_percent: number;
    analytics_access: "full" | "financial_only";
    google_email?: string | null | undefined;
}, {
    email: string;
    equity_percent: number;
    analytics_access?: "full" | "financial_only" | undefined;
    google_email?: string | null | undefined;
}>;
type InviteProducerDto = z.infer<typeof InviteProducerSchema>;

declare const CreateSaasProductSchema: z.ZodObject<{
    producer_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    website_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    integration_type: z.ZodEnum<["external", "integrated"]>;
    status: z.ZodDefault<z.ZodEnum<["draft", "pending", "approved", "rejected", "suspended"]>>;
    payment_gateway: z.ZodDefault<z.ZodEnum<["abacatepay", "kiwify", "hotmart", "eduzz", "custom"]>>;
    auth_mode: z.ZodDefault<z.ZodEnum<["platform", "sso_complement", "sso_only"]>>;
    gateway_management: z.ZodDefault<z.ZodEnum<["platform", "producer"]>>;
    eg_equity_percent: z.ZodDefault<z.ZodNumber>;
    kiwify_product_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    kiwify_eg_role: z.ZodNullable<z.ZodOptional<z.ZodEnum<["producer", "coproducer", "affiliate"]>>>;
    kiwify_client_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    kiwify_client_secret: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    kiwify_account_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    gateway_field_map: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        gateway_name: z.ZodString;
        webhook_secret: z.ZodOptional<z.ZodString>;
        order_id_path: z.ZodString;
        customer_email_path: z.ZodString;
        amount_path: z.ZodString;
        amount_multiplier: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<100>]>>;
        status_field_path: z.ZodString;
        approved_values: z.ZodArray<z.ZodString, "many">;
        cancelled_values: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        amount_multiplier: 1 | 100;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
    }, {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
        amount_multiplier?: 1 | 100 | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "draft" | "approved" | "rejected" | "suspended";
    name: string;
    slug: string;
    integration_type: "external" | "integrated";
    payment_gateway: "custom" | "abacatepay" | "kiwify" | "hotmart" | "eduzz";
    auth_mode: "platform" | "sso_complement" | "sso_only";
    gateway_management: "producer" | "platform";
    eg_equity_percent: number;
    producer_id?: string | null | undefined;
    description?: string | null | undefined;
    website_url?: string | null | undefined;
    kiwify_product_id?: string | null | undefined;
    kiwify_eg_role?: "producer" | "coproducer" | "affiliate" | null | undefined;
    kiwify_client_id?: string | null | undefined;
    kiwify_client_secret?: string | null | undefined;
    kiwify_account_id?: string | null | undefined;
    gateway_field_map?: {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        amount_multiplier: 1 | 100;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
    } | null | undefined;
}, {
    name: string;
    slug: string;
    integration_type: "external" | "integrated";
    status?: "pending" | "draft" | "approved" | "rejected" | "suspended" | undefined;
    producer_id?: string | null | undefined;
    description?: string | null | undefined;
    website_url?: string | null | undefined;
    payment_gateway?: "custom" | "abacatepay" | "kiwify" | "hotmart" | "eduzz" | undefined;
    auth_mode?: "platform" | "sso_complement" | "sso_only" | undefined;
    gateway_management?: "producer" | "platform" | undefined;
    eg_equity_percent?: number | undefined;
    kiwify_product_id?: string | null | undefined;
    kiwify_eg_role?: "producer" | "coproducer" | "affiliate" | null | undefined;
    kiwify_client_id?: string | null | undefined;
    kiwify_client_secret?: string | null | undefined;
    kiwify_account_id?: string | null | undefined;
    gateway_field_map?: {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
        amount_multiplier?: 1 | 100 | undefined;
    } | null | undefined;
}>;
type CreateSaasProductDto = z.infer<typeof CreateSaasProductSchema>;
declare const KiwifyConfigSchema: z.ZodObject<{
    client_id: z.ZodString;
    client_secret: z.ZodString;
    account_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    client_id: string;
    client_secret: string;
    account_id?: string | undefined;
}, {
    client_id: string;
    client_secret: string;
    account_id?: string | undefined;
}>;
type KiwifyConfigDto = z.infer<typeof KiwifyConfigSchema>;
declare const CreateAdminFeedbackSchema: z.ZodObject<{
    type: z.ZodEnum<["admin_note", "adjustment_request"]>;
    content: z.ZodString;
    visibility: z.ZodDefault<z.ZodEnum<["admin_only", "producer_only", "public"]>>;
}, "strip", z.ZodTypeAny, {
    type: "admin_note" | "adjustment_request";
    content: string;
    visibility: "public" | "producer_only" | "admin_only";
}, {
    type: "admin_note" | "adjustment_request";
    content: string;
    visibility?: "public" | "producer_only" | "admin_only" | undefined;
}>;
type CreateAdminFeedbackDto = z.infer<typeof CreateAdminFeedbackSchema>;
declare const PatchFeedbackSchema: z.ZodObject<{
    feedback_id: z.ZodString;
    action: z.ZodDefault<z.ZodEnum<["resolve", "approve_hidden", "reject_hidden"]>>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    feedback_id: string;
    action: "resolve" | "approve_hidden" | "reject_hidden";
    note?: string | undefined;
}, {
    feedback_id: string;
    action?: "resolve" | "approve_hidden" | "reject_hidden" | undefined;
    note?: string | undefined;
}>;
type PatchFeedbackDto = z.infer<typeof PatchFeedbackSchema>;
declare const RejectProductSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
type RejectProductDto = z.infer<typeof RejectProductSchema>;
declare const ReopenProductSchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodEnum<["approved", "draft", "pending"]>>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "draft" | "approved";
}, {
    status?: "pending" | "draft" | "approved" | undefined;
}>;
type ReopenProductDto = z.infer<typeof ReopenProductSchema>;
declare const UpdateSaasProductSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    health_check_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    health_check_enabled: z.ZodOptional<z.ZodBoolean>;
    ga4_measurement_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    ga4_property_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sso_service_id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    sso_plan_id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    api_app_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["pending", "suspended", "draft"]>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    payment_gateway: z.ZodNullable<z.ZodOptional<z.ZodEnum<["abacatepay", "mercadopago", "kiwify", "hotmart", "eduzz", "custom"]>>>;
    auth_mode: z.ZodNullable<z.ZodOptional<z.ZodEnum<["platform", "sso_complement", "sso_only"]>>>;
    gateway_management: z.ZodNullable<z.ZodOptional<z.ZodEnum<["platform", "producer"]>>>;
    eg_equity_percent: z.ZodOptional<z.ZodNumber>;
    kiwify_product_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    kiwify_eg_role: z.ZodNullable<z.ZodOptional<z.ZodEnum<["producer", "coproducer", "affiliate"]>>>;
    kiwify_client_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    kiwify_client_secret: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    kiwify_account_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    gateway_field_map: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        gateway_name: z.ZodString;
        webhook_secret: z.ZodOptional<z.ZodString>;
        order_id_path: z.ZodString;
        customer_email_path: z.ZodString;
        amount_path: z.ZodString;
        amount_multiplier: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<100>]>>;
        status_field_path: z.ZodString;
        approved_values: z.ZodArray<z.ZodString, "many">;
        cancelled_values: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        amount_multiplier: 1 | 100;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
    }, {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
        amount_multiplier?: 1 | 100 | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "draft" | "suspended" | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    payment_gateway?: "custom" | "abacatepay" | "kiwify" | "hotmart" | "eduzz" | "mercadopago" | null | undefined;
    auth_mode?: "platform" | "sso_complement" | "sso_only" | null | undefined;
    gateway_management?: "producer" | "platform" | null | undefined;
    eg_equity_percent?: number | undefined;
    kiwify_product_id?: string | null | undefined;
    kiwify_eg_role?: "producer" | "coproducer" | "affiliate" | null | undefined;
    kiwify_client_id?: string | null | undefined;
    kiwify_client_secret?: string | null | undefined;
    kiwify_account_id?: string | null | undefined;
    gateway_field_map?: {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        amount_multiplier: 1 | 100;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
    } | null | undefined;
    health_check_url?: string | null | undefined;
    health_check_enabled?: boolean | undefined;
    ga4_measurement_id?: string | null | undefined;
    ga4_property_id?: string | null | undefined;
    sso_service_id?: number | null | undefined;
    sso_plan_id?: number | null | undefined;
    api_app_id?: string | null | undefined;
    category?: string | null | undefined;
}, {
    status?: "pending" | "draft" | "suspended" | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    payment_gateway?: "custom" | "abacatepay" | "kiwify" | "hotmart" | "eduzz" | "mercadopago" | null | undefined;
    auth_mode?: "platform" | "sso_complement" | "sso_only" | null | undefined;
    gateway_management?: "producer" | "platform" | null | undefined;
    eg_equity_percent?: number | undefined;
    kiwify_product_id?: string | null | undefined;
    kiwify_eg_role?: "producer" | "coproducer" | "affiliate" | null | undefined;
    kiwify_client_id?: string | null | undefined;
    kiwify_client_secret?: string | null | undefined;
    kiwify_account_id?: string | null | undefined;
    gateway_field_map?: {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
        amount_multiplier?: 1 | 100 | undefined;
    } | null | undefined;
    health_check_url?: string | null | undefined;
    health_check_enabled?: boolean | undefined;
    ga4_measurement_id?: string | null | undefined;
    ga4_property_id?: string | null | undefined;
    sso_service_id?: number | null | undefined;
    sso_plan_id?: number | null | undefined;
    api_app_id?: string | null | undefined;
    category?: string | null | undefined;
}>, {
    status?: "pending" | "draft" | "suspended" | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    payment_gateway?: "custom" | "abacatepay" | "kiwify" | "hotmart" | "eduzz" | "mercadopago" | null | undefined;
    auth_mode?: "platform" | "sso_complement" | "sso_only" | null | undefined;
    gateway_management?: "producer" | "platform" | null | undefined;
    eg_equity_percent?: number | undefined;
    kiwify_product_id?: string | null | undefined;
    kiwify_eg_role?: "producer" | "coproducer" | "affiliate" | null | undefined;
    kiwify_client_id?: string | null | undefined;
    kiwify_client_secret?: string | null | undefined;
    kiwify_account_id?: string | null | undefined;
    gateway_field_map?: {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        amount_multiplier: 1 | 100;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
    } | null | undefined;
    health_check_url?: string | null | undefined;
    health_check_enabled?: boolean | undefined;
    ga4_measurement_id?: string | null | undefined;
    ga4_property_id?: string | null | undefined;
    sso_service_id?: number | null | undefined;
    sso_plan_id?: number | null | undefined;
    api_app_id?: string | null | undefined;
    category?: string | null | undefined;
}, {
    status?: "pending" | "draft" | "suspended" | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    payment_gateway?: "custom" | "abacatepay" | "kiwify" | "hotmart" | "eduzz" | "mercadopago" | null | undefined;
    auth_mode?: "platform" | "sso_complement" | "sso_only" | null | undefined;
    gateway_management?: "producer" | "platform" | null | undefined;
    eg_equity_percent?: number | undefined;
    kiwify_product_id?: string | null | undefined;
    kiwify_eg_role?: "producer" | "coproducer" | "affiliate" | null | undefined;
    kiwify_client_id?: string | null | undefined;
    kiwify_client_secret?: string | null | undefined;
    kiwify_account_id?: string | null | undefined;
    gateway_field_map?: {
        gateway_name: string;
        order_id_path: string;
        customer_email_path: string;
        amount_path: string;
        status_field_path: string;
        approved_values: string[];
        cancelled_values: string[];
        webhook_secret?: string | undefined;
        amount_multiplier?: 1 | 100 | undefined;
    } | null | undefined;
    health_check_url?: string | null | undefined;
    health_check_enabled?: boolean | undefined;
    ga4_measurement_id?: string | null | undefined;
    ga4_property_id?: string | null | undefined;
    sso_service_id?: number | null | undefined;
    sso_plan_id?: number | null | undefined;
    api_app_id?: string | null | undefined;
    category?: string | null | undefined;
}>;
type UpdateSaasProductDto = z.infer<typeof UpdateSaasProductSchema>;
declare const CreateProducerSchema: z.ZodObject<{
    user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    display_name: z.ZodString;
    company_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    cnpj: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    display_name: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    cnpj?: string | null | undefined;
    user_id?: string | null | undefined;
    company_name?: string | null | undefined;
}, {
    display_name: string;
    email?: string | null | undefined;
    status?: string | undefined;
    phone?: string | null | undefined;
    cnpj?: string | null | undefined;
    user_id?: string | null | undefined;
    company_name?: string | null | undefined;
}>;
type CreateProducerDto = z.infer<typeof CreateProducerSchema>;
declare const UpdateProducerSchema: z.ZodObject<{
    user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    display_name: z.ZodString;
    company_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    cnpj: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    display_name: string;
    email?: string | null | undefined;
    status?: string | undefined;
    phone?: string | null | undefined;
    cnpj?: string | null | undefined;
    user_id?: string | null | undefined;
    company_name?: string | null | undefined;
}, {
    display_name: string;
    email?: string | null | undefined;
    status?: string | undefined;
    phone?: string | null | undefined;
    cnpj?: string | null | undefined;
    user_id?: string | null | undefined;
    company_name?: string | null | undefined;
}>;
type UpdateProducerDto = z.infer<typeof UpdateProducerSchema>;
declare const InviteProducerAdminSchema: z.ZodObject<{
    email: z.ZodString;
    message: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    message?: string | null | undefined;
}, {
    email: string;
    message?: string | null | undefined;
}>;
type InviteProducerAdminDto = z.infer<typeof InviteProducerAdminSchema>;
declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    role_id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    company_id: z.ZodOptional<z.ZodString>;
    global_plan_slug: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    original_company_id: z.ZodOptional<z.ZodString>;
    original_plan_slug: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    company_id?: string | undefined;
    phone_number?: string | null | undefined;
    role_id?: number | null | undefined;
    global_plan_slug?: string | null | undefined;
    original_company_id?: string | undefined;
    original_plan_slug?: string | null | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    company_id?: string | undefined;
    phone_number?: string | null | undefined;
    role_id?: number | null | undefined;
    global_plan_slug?: string | null | undefined;
    original_company_id?: string | undefined;
    original_plan_slug?: string | null | undefined;
}>;
type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
declare const BulkDeleteUsersSchema: z.ZodObject<{
    userIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    userIds: string[];
}, {
    userIds: string[];
}>;
type BulkDeleteUsersDto = z.infer<typeof BulkDeleteUsersSchema>;
declare const CreateCampaignSchema: z.ZodObject<{
    title: z.ZodString;
    message: z.ZodString;
    action_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    target_type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["all", "rank", "category", "role", "custom"]>>>;
    target_ranks: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
    target_roles: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    target_category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    scheduled_for: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    title: string;
    target_type: "custom" | "category" | "all" | "rank" | "role";
    action_url?: string | null | undefined;
    target_ranks?: any[] | null | undefined;
    target_roles?: string[] | null | undefined;
    target_category?: string | null | undefined;
    scheduled_for?: string | null | undefined;
}, {
    message: string;
    title: string;
    action_url?: string | null | undefined;
    target_type?: "custom" | "category" | "all" | "rank" | "role" | undefined;
    target_ranks?: any[] | null | undefined;
    target_roles?: string[] | null | undefined;
    target_category?: string | null | undefined;
    scheduled_for?: string | null | undefined;
}>;
type CreateCampaignDto = z.infer<typeof CreateCampaignSchema>;
declare const UpdateCampaignSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    action_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    target_type: z.ZodOptional<z.ZodEnum<["all", "rank", "category", "role", "custom"]>>;
    target_ranks: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
    target_roles: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    target_category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    scheduled_for: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "scheduled", "cancelled"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "scheduled" | "cancelled" | undefined;
    message?: string | undefined;
    title?: string | undefined;
    action_url?: string | null | undefined;
    target_type?: "custom" | "category" | "all" | "rank" | "role" | undefined;
    target_ranks?: any[] | null | undefined;
    target_roles?: string[] | null | undefined;
    target_category?: string | null | undefined;
    scheduled_for?: string | null | undefined;
}, {
    status?: "draft" | "scheduled" | "cancelled" | undefined;
    message?: string | undefined;
    title?: string | undefined;
    action_url?: string | null | undefined;
    target_type?: "custom" | "category" | "all" | "rank" | "role" | undefined;
    target_ranks?: any[] | null | undefined;
    target_roles?: string[] | null | undefined;
    target_category?: string | null | undefined;
    scheduled_for?: string | null | undefined;
}>;
type UpdateCampaignDto = z.infer<typeof UpdateCampaignSchema>;
declare const PreviewCampaignSchema: z.ZodObject<{
    target_type: z.ZodString;
    target_roles: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    target_category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    target_type: string;
    target_roles?: string[] | null | undefined;
    target_category?: string | null | undefined;
}, {
    target_type: string;
    target_roles?: string[] | null | undefined;
    target_category?: string | null | undefined;
}>;
type PreviewCampaignDto = z.infer<typeof PreviewCampaignSchema>;

declare const SuggestItemSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | null | undefined;
    category?: string | null | undefined;
}, {
    title: string;
    description?: string | null | undefined;
    category?: string | null | undefined;
}>;
type SuggestItemDto = z.infer<typeof SuggestItemSchema>;
declare const VoteItemSchema: z.ZodObject<{
    item_id: z.ZodString;
    vote: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<-1>]>;
}, "strip", z.ZodTypeAny, {
    item_id: string;
    vote: 1 | -1;
}, {
    item_id: string;
    vote: 1 | -1;
}>;
type VoteItemDto = z.infer<typeof VoteItemSchema>;
declare const DeleteVoteSchema: z.ZodObject<{
    item_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    item_id: string;
}, {
    item_id: string;
}>;
type DeleteVoteDto = z.infer<typeof DeleteVoteSchema>;
declare const TourProgressSchema: z.ZodObject<{
    last_step: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    last_step: number;
}, {
    last_step?: number | undefined;
}>;
type TourProgressDto = z.infer<typeof TourProgressSchema>;

/** Estados de um pedido de serviço, do orçamento à entrega. */
declare const ServiceRequestStatusSchema: z.ZodEnum<["collecting", "pending_quote", "awaiting_signature", "awaiting_payment", "in_progress", "completed", "cancelled"]>;
type ServiceRequestStatus = z.infer<typeof ServiceRequestStatusSchema>;
/** Estados de uma assinatura de ferramenta, vindos do gateway ou do admin. */
declare const SaasSubscriptionStatusSchema: z.ZodEnum<["pending", "active", "cancelled", "suspended", "expired", "failed"]>;
type SaasSubscriptionStatus = z.infer<typeof SaasSubscriptionStatusSchema>;

/** Telefone brasileiro com DDD, com ou sem +55 e máscara. Ex.: (11) 99999-9999. */
declare const PhoneSchema: z.ZodString;
/** Origem do primeiro toque (UTM e página de entrada), gravada uma vez por usuário. */
declare const EntrySourceSchema: z.ZodObject<{
    utm_source: z.ZodOptional<z.ZodString>;
    utm_medium: z.ZodOptional<z.ZodString>;
    utm_campaign: z.ZodOptional<z.ZodString>;
    utm_content: z.ZodOptional<z.ZodString>;
    utm_term: z.ZodOptional<z.ZodString>;
    referrer: z.ZodOptional<z.ZodString>;
    landing: z.ZodOptional<z.ZodString>;
    first_touch_at: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
    utm_term?: string | undefined;
    referrer?: string | undefined;
    landing?: string | undefined;
    first_touch_at?: string | undefined;
}, {
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
    utm_term?: string | undefined;
    referrer?: string | undefined;
    landing?: string | undefined;
    first_touch_at?: string | undefined;
}>;
type EntrySource = z.infer<typeof EntrySourceSchema>;
declare const ENTRY_PROFILES: readonly ["comprador", "builder"];
declare const EntryProfileSchema: z.ZodEnum<["comprador", "builder"]>;
type EntryProfile = z.infer<typeof EntryProfileSchema>;
/** Versão vigente dos termos do builder. Termos novos exigem versão nova e revisão jurídica. */
declare const PRODUCER_TERMS_VERSION = "2.0";
declare const ProducerJoinSchema: z.ZodObject<{
    terms_version: z.ZodLiteral<"2.0">;
    phone: z.ZodString;
    source: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodString>;
        utm_medium: z.ZodOptional<z.ZodString>;
        utm_campaign: z.ZodOptional<z.ZodString>;
        utm_content: z.ZodOptional<z.ZodString>;
        utm_term: z.ZodOptional<z.ZodString>;
        referrer: z.ZodOptional<z.ZodString>;
        landing: z.ZodOptional<z.ZodString>;
        first_touch_at: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    terms_version: "2.0";
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}, {
    phone: string;
    terms_version: "2.0";
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}>;
type ProducerJoinDto = z.infer<typeof ProducerJoinSchema>;
declare const ObjectiveDescriptionSchema: z.ZodString;
declare const BuyerJoinSchema: z.ZodObject<{
    phone: z.ZodString;
    objective: z.ZodString;
    source: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodString>;
        utm_medium: z.ZodOptional<z.ZodString>;
        utm_campaign: z.ZodOptional<z.ZodString>;
        utm_content: z.ZodOptional<z.ZodString>;
        utm_term: z.ZodOptional<z.ZodString>;
        referrer: z.ZodOptional<z.ZodString>;
        landing: z.ZodOptional<z.ZodString>;
        first_touch_at: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    objective: string;
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}, {
    phone: string;
    objective: string;
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}>;
type BuyerJoinDto = z.infer<typeof BuyerJoinSchema>;
declare const OBJECTIVE_STATUSES: readonly ["new", "in_review", "proposal_sent", "closed"];
declare const ObjectiveStatusSchema: z.ZodEnum<["new", "in_review", "proposal_sent", "closed"]>;
type ObjectiveStatus = z.infer<typeof ObjectiveStatusSchema>;
declare const CreateObjectiveSchema: z.ZodObject<{
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
}, {
    description: string;
}>;
type CreateObjectiveDto = z.infer<typeof CreateObjectiveSchema>;
declare const UpdateObjectiveStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["new", "in_review", "proposal_sent", "closed"]>;
}, "strip", z.ZodTypeAny, {
    status: "new" | "in_review" | "proposal_sent" | "closed";
}, {
    status: "new" | "in_review" | "proposal_sent" | "closed";
}>;
type UpdateObjectiveStatusDto = z.infer<typeof UpdateObjectiveStatusSchema>;
declare const PLAN_FREQUENCIES: readonly ["monthly", "quarterly", "yearly", "one_time"];
/** Acesso que o plano libera no SaaS (ex.: vaygo_pro). Vem para entitlements quando o gateway avisa a venda. */
declare const EntitlementKeySchema: z.ZodString;
/** Plano do produto como link do gateway: o preço é opcional, porque fica no gateway. */
declare const CreatePlanLinkSchema: z.ZodObject<{
    name: z.ZodString;
    checkout_url: z.ZodEffects<z.ZodString, string, string>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    frequency: z.ZodOptional<z.ZodEnum<["monthly", "quarterly", "yearly", "one_time"]>>;
    plan_type: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodNumber>;
    is_sandbox: z.ZodOptional<z.ZodBoolean>;
    entitlement_key: z.ZodOptional<z.ZodString>;
    gateway_offer_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    checkout_url: string;
    description?: string | undefined;
    price?: number | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | undefined;
    plan_type?: string | undefined;
    position?: number | undefined;
    is_sandbox?: boolean | undefined;
    entitlement_key?: string | undefined;
    gateway_offer_id?: string | undefined;
}, {
    name: string;
    checkout_url: string;
    description?: string | undefined;
    price?: number | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | undefined;
    plan_type?: string | undefined;
    position?: number | undefined;
    is_sandbox?: boolean | undefined;
    entitlement_key?: string | undefined;
    gateway_offer_id?: string | undefined;
}>;
type CreatePlanLinkDto = z.infer<typeof CreatePlanLinkSchema>;
declare const UpdatePlanLinkSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    checkout_url: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    price: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    frequency: z.ZodOptional<z.ZodNullable<z.ZodEnum<["monthly", "quarterly", "yearly", "one_time"]>>>;
    position: z.ZodOptional<z.ZodNumber>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    entitlement_key: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    gateway_offer_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
    entitlement_key?: string | null | undefined;
    gateway_offer_id?: string | null | undefined;
    is_active?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
    entitlement_key?: string | null | undefined;
    gateway_offer_id?: string | null | undefined;
    is_active?: boolean | undefined;
}>, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
    entitlement_key?: string | null | undefined;
    gateway_offer_id?: string | null | undefined;
    is_active?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
    entitlement_key?: string | null | undefined;
    gateway_offer_id?: string | null | undefined;
    is_active?: boolean | undefined;
}>;
type UpdatePlanLinkDto = z.infer<typeof UpdatePlanLinkSchema>;
/** Domínio de checkout aceito (sem protocolo nem caminho), configurável no backoffice. */
declare const GatewayDomainSchema: z.ZodObject<{
    domain: z.ZodString;
    gateway: z.ZodString;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    domain: string;
    gateway: string;
    is_active?: boolean | undefined;
}, {
    domain: string;
    gateway: string;
    is_active?: boolean | undefined;
}>;
type GatewayDomainDto = z.infer<typeof GatewayDomainSchema>;
declare const UpdateGatewayDomainSchema: z.ZodEffects<z.ZodObject<{
    domain: z.ZodOptional<z.ZodString>;
    gateway: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    is_active?: boolean | undefined;
    domain?: string | undefined;
    gateway?: string | undefined;
}, {
    is_active?: boolean | undefined;
    domain?: string | undefined;
    gateway?: string | undefined;
}>, {
    is_active?: boolean | undefined;
    domain?: string | undefined;
    gateway?: string | undefined;
}, {
    is_active?: boolean | undefined;
    domain?: string | undefined;
    gateway?: string | undefined;
}>;
type UpdateGatewayDomainDto = z.infer<typeof UpdateGatewayDomainSchema>;

/** Nome do parâmetro de query que leva a atribuição ao SSO. */
declare const ATTRIBUTION_PARAM = "att";
/** Tamanho máximo aceito do `att` serializado. O resto é descartado. */
declare const ATTRIBUTION_MAX_LENGTH = 2048;
declare const UTM_KEYS: readonly ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
declare const CLICK_ID_KEYS: readonly ["gclid", "gbraid", "wbraid", "fbclid", "ttclid", "msclkid"];
/** Um toque de atribuição: de onde a pessoa veio e quando. */
declare const AttributionTouchSchema: z.ZodObject<{
    utm_source: z.ZodOptional<z.ZodString>;
    utm_medium: z.ZodOptional<z.ZodString>;
    utm_campaign: z.ZodOptional<z.ZodString>;
    utm_content: z.ZodOptional<z.ZodString>;
    utm_term: z.ZodOptional<z.ZodString>;
    gclid: z.ZodOptional<z.ZodString>;
    gbraid: z.ZodOptional<z.ZodString>;
    wbraid: z.ZodOptional<z.ZodString>;
    fbclid: z.ZodOptional<z.ZodString>;
    ttclid: z.ZodOptional<z.ZodString>;
    msclkid: z.ZodOptional<z.ZodString>;
    referrer: z.ZodOptional<z.ZodString>;
    landing: z.ZodOptional<z.ZodString>;
    at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    at: string;
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
    utm_term?: string | undefined;
    referrer?: string | undefined;
    landing?: string | undefined;
    gclid?: string | undefined;
    gbraid?: string | undefined;
    wbraid?: string | undefined;
    fbclid?: string | undefined;
    ttclid?: string | undefined;
    msclkid?: string | undefined;
}, {
    at: string;
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
    utm_term?: string | undefined;
    referrer?: string | undefined;
    landing?: string | undefined;
    gclid?: string | undefined;
    gbraid?: string | undefined;
    wbraid?: string | undefined;
    fbclid?: string | undefined;
    ttclid?: string | undefined;
    msclkid?: string | undefined;
}>;
type AttributionTouch = z.infer<typeof AttributionTouchSchema>;
/** Tem UTM ou click ID? Toque só com referrer não sobrescreve o último toque de campanha. */
declare function isCampaignTouch(touch: AttributionTouch): boolean;
/**
 * Lê a atribuição de uma URL de entrada (a página que a pessoa abriu).
 * Devolve `null` se não houver UTM nem click ID, para não gravar visita direta como campanha.
 */
declare function readAttributionFromUrl(pageUrl: string, options?: {
    referrer?: string;
    now?: Date;
}): AttributionTouch | null;
/** Serializa para o parâmetro `att`. URLSearchParams cuida da codificação. */
declare function encodeAttribution(touch: AttributionTouch): string;
/** Lê o `att` recebido. Valor inválido, grande demais ou sem campanha vira `null`, sem erro. */
declare function decodeAttribution(value: string | null | undefined): AttributionTouch | null;
/** Acrescenta `att` ao link de login do SSO, preservando os demais parâmetros. */
declare function withAttribution(loginUrl: string, touch: AttributionTouch | null): string;

declare const COMMERCE_GATEWAYS: readonly ["abacatepay", "kiwify", "hotmart", "mercadopago", "custom"];
declare const CommerceGatewaySchema: z.ZodEnum<["abacatepay", "kiwify", "hotmart", "mercadopago", "custom"]>;
type CommerceGateway = z.infer<typeof CommerceGatewaySchema>;
declare const COMMERCE_EVENT_TYPES: readonly ["sale.approved", "sale.refunded", "sale.chargeback", "subscription.started", "subscription.renewed", "subscription.past_due", "subscription.canceled", "payment.pending"];
declare const CommerceEventTypeSchema: z.ZodEnum<["sale.approved", "sale.refunded", "sale.chargeback", "subscription.started", "subscription.renewed", "subscription.past_due", "subscription.canceled", "payment.pending"]>;
type CommerceEventType = z.infer<typeof CommerceEventTypeSchema>;
/** `verified`: assinatura do gateway conferida. `unverified` é gravado, mas não muda acesso. */
declare const COMMERCE_EVENT_VERIFICATION: readonly ["verified", "unverified"];
declare const CommerceEventVerificationSchema: z.ZodEnum<["verified", "unverified"]>;
/** Nome do parâmetro que liga o checkout ao usuário do SSO (vai no link do gateway). */
declare const COMMERCE_REF_PARAM = "eg_ref";
/** Evento já normalizado, como gravado em `commerce_events` e devolvido pela API. */
declare const CommerceEventSchema: z.ZodObject<{
    id: z.ZodString;
    saas_product_id: z.ZodString;
    gateway: z.ZodEnum<["abacatepay", "kiwify", "hotmart", "mercadopago", "custom"]>;
    gateway_event_id: z.ZodString;
    type: z.ZodEnum<["sale.approved", "sale.refunded", "sale.chargeback", "subscription.started", "subscription.renewed", "subscription.past_due", "subscription.canceled", "payment.pending"]>;
    verification: z.ZodEnum<["verified", "unverified"]>;
    occurred_at: z.ZodString;
    amount_cents: z.ZodNullable<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodString>;
    customer_email: z.ZodNullable<z.ZodString>;
    user_id: z.ZodNullable<z.ZodString>;
    plan_id: z.ZodNullable<z.ZodString>;
    eg_ref: z.ZodNullable<z.ZodString>;
    /** Id do lead no Easy CRM, quando o checkout levou `eg_lead` (ver `crm-funnel.ts`). */
    lead_ref: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    received_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "sale.approved" | "sale.refunded" | "sale.chargeback" | "subscription.started" | "subscription.renewed" | "subscription.past_due" | "subscription.canceled" | "payment.pending";
    user_id: string | null;
    gateway: "custom" | "abacatepay" | "kiwify" | "hotmart" | "mercadopago";
    eg_ref: string | null;
    id: string;
    saas_product_id: string;
    gateway_event_id: string;
    verification: "verified" | "unverified";
    occurred_at: string;
    amount_cents: number | null;
    currency: string;
    customer_email: string | null;
    plan_id: string | null;
    received_at: string;
    lead_ref?: string | null | undefined;
}, {
    type: "sale.approved" | "sale.refunded" | "sale.chargeback" | "subscription.started" | "subscription.renewed" | "subscription.past_due" | "subscription.canceled" | "payment.pending";
    user_id: string | null;
    gateway: "custom" | "abacatepay" | "kiwify" | "hotmart" | "mercadopago";
    eg_ref: string | null;
    id: string;
    saas_product_id: string;
    gateway_event_id: string;
    verification: "verified" | "unverified";
    occurred_at: string;
    amount_cents: number | null;
    customer_email: string | null;
    plan_id: string | null;
    received_at: string;
    currency?: string | undefined;
    lead_ref?: string | null | undefined;
}>;
type CommerceEvent = z.infer<typeof CommerceEventSchema>;
declare const ENTITLEMENT_STATUSES: readonly ["active", "past_due", "canceled", "refunded"];
declare const EntitlementStatusSchema: z.ZodEnum<["active", "past_due", "canceled", "refunded"]>;
type EntitlementStatus = z.infer<typeof EntitlementStatusSchema>;
/** Acesso derivado dos eventos. `entitlement_key` vem do plano (ex.: `vaygo_pro`). */
declare const EntitlementSchema: z.ZodObject<{
    user_id: z.ZodString;
    saas_product_id: z.ZodString;
    entitlement_key: z.ZodString;
    status: z.ZodEnum<["active", "past_due", "canceled", "refunded"]>;
    valid_until: z.ZodNullable<z.ZodString>;
    source_event_id: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "active" | "past_due" | "canceled" | "refunded";
    user_id: string;
    entitlement_key: string;
    saas_product_id: string;
    valid_until: string | null;
    source_event_id: string;
    updated_at: string;
}, {
    status: "active" | "past_due" | "canceled" | "refunded";
    user_id: string;
    entitlement_key: string;
    saas_product_id: string;
    valid_until: string | null;
    source_event_id: string;
    updated_at: string;
}>;
type Entitlement = z.infer<typeof EntitlementSchema>;
/** Estados que liberam o SaaS. `past_due` mantém acesso até o gateway cancelar. */
declare function entitlementGrantsAccess(status: EntitlementStatus): boolean;
/** Como o produtor classifica cada produto/oferta do gateway dele. Obrigatório no onboarding. */
declare const OFFER_KINDS: readonly ["recurring", "one_time", "order_bump", "upsell"];
declare const OfferKindSchema: z.ZodEnum<["recurring", "one_time", "order_bump", "upsell"]>;
type OfferKind = z.infer<typeof OfferKindSchema>;
declare const OFFER_KIND_LABELS: Record<OfferKind, string>;
/**
 * Etapas que o onboarding valida com dados reais. Nenhuma bloqueia o SaaS (decisão 2 da s361):
 * elas mostram o que já foi visto funcionando. Só `human_approval` depende de uma pessoa.
 */
declare const VALIDATION_STEPS: readonly ["webhook_verified", "offers_categorized", "page_visit", "login", "sale", "subscription", "human_approval"];
declare const ValidationStepSchema: z.ZodEnum<["webhook_verified", "offers_categorized", "page_visit", "login", "sale", "subscription", "human_approval"]>;
type ValidationStep = z.infer<typeof ValidationStepSchema>;
declare const VALIDATION_STEP_STATUSES: readonly ["pending", "ok", "not_applicable"];
declare const ValidationStepStateSchema: z.ZodObject<{
    step: z.ZodEnum<["webhook_verified", "offers_categorized", "page_visit", "login", "sale", "subscription", "human_approval"]>;
    status: z.ZodEnum<["pending", "ok", "not_applicable"]>;
    /** Quando foi visto pela primeira vez (ISO) — ou null se pendente. */
    seen_at: z.ZodNullable<z.ZodString>;
    /** Detalhe curto para o produtor (ex.: "3 de 4 ofertas categorizadas"). */
    detail: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "ok" | "not_applicable";
    step: "webhook_verified" | "offers_categorized" | "page_visit" | "login" | "sale" | "subscription" | "human_approval";
    seen_at: string | null;
    detail: string | null;
}, {
    status: "pending" | "ok" | "not_applicable";
    step: "webhook_verified" | "offers_categorized" | "page_visit" | "login" | "sale" | "subscription" | "human_approval";
    seen_at: string | null;
    detail: string | null;
}>;
type ValidationStepState = z.infer<typeof ValidationStepStateSchema>;
/** Gateway liberado para o produtor escolher: só os que têm adaptador na API (decisão 9). */
declare const GatewayOptionSchema: z.ZodObject<{
    gateway: z.ZodEnum<["abacatepay", "kiwify", "hotmart", "mercadopago", "custom"]>;
    label: z.ZodString;
    /** URL que o produtor cola no painel do gateway, já com o gateway e a chave do produto. */
    webhook_path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    gateway: "custom" | "abacatepay" | "kiwify" | "hotmart" | "mercadopago";
    label: string;
    webhook_path: string;
}, {
    gateway: "custom" | "abacatepay" | "kiwify" | "hotmart" | "mercadopago";
    label: string;
    webhook_path: string;
}>;
type GatewayOption = z.infer<typeof GatewayOptionSchema>;

declare const DELIVERABLE_GOALS: readonly ["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"];
declare const DeliverableGoalSchema: z.ZodEnum<["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"]>;
type DeliverableGoal = z.infer<typeof DeliverableGoalSchema>;
declare const DELIVERABLE_GOAL_LABELS: Record<DeliverableGoal, string>;
declare const DELIVERABLE_MODALITIES: readonly ["one_off", "setup", "implementation", "recurring"];
declare const DeliverableModalitySchema: z.ZodEnum<["one_off", "setup", "implementation", "recurring"]>;
type DeliverableModality = z.infer<typeof DeliverableModalitySchema>;
declare const DELIVERABLE_MODALITY_LABELS: Record<DeliverableModality, string>;
declare const RECURRENCE_INTERVALS: readonly ["monthly", "quarterly"];
declare const RecurrenceIntervalSchema: z.ZodEnum<["monthly", "quarterly"]>;
type RecurrenceInterval = z.infer<typeof RecurrenceIntervalSchema>;
declare const RECURRENCE_INTERVAL_LABELS: Record<RecurrenceInterval, string>;
declare const DELIVERABLE_EXECUTORS: readonly ["easy_goal", "builder", "both"];
declare const DeliverableExecutorSchema: z.ZodEnum<["easy_goal", "builder", "both"]>;
type DeliverableExecutor = z.infer<typeof DeliverableExecutorSchema>;
declare const DELIVERABLE_EXECUTOR_LABELS: Record<DeliverableExecutor, string>;
/** Sentido em que a métrica de resultado do cliente melhora (custo por lead cai; conversão sobe). */
declare const METRIC_DIRECTIONS: readonly ["up", "down"];
declare const MetricDirectionSchema: z.ZodEnum<["up", "down"]>;
type MetricDirection = z.infer<typeof MetricDirectionSchema>;
declare const DeliverableCategorySchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    goals: z.ZodArray<z.ZodEnum<["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"]>, "many">;
    result_metric_name: z.ZodString;
    result_metric_unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    result_metric_direction: z.ZodDefault<z.ZodEnum<["up", "down"]>>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    sort_order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    is_active: boolean;
    goals: ("sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy")[];
    result_metric_name: string;
    result_metric_direction: "up" | "down";
    sort_order: number;
    description?: string | null | undefined;
    result_metric_unit?: string | null | undefined;
}, {
    name: string;
    slug: string;
    goals: ("sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy")[];
    result_metric_name: string;
    description?: string | null | undefined;
    is_active?: boolean | undefined;
    result_metric_unit?: string | null | undefined;
    result_metric_direction?: "up" | "down" | undefined;
    sort_order?: number | undefined;
}>;
type DeliverableCategoryDto = z.infer<typeof DeliverableCategorySchema>;
declare const UpdateDeliverableCategorySchema: z.ZodObject<Omit<{
    slug: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    goals: z.ZodOptional<z.ZodArray<z.ZodEnum<["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"]>, "many">>;
    result_metric_name: z.ZodOptional<z.ZodString>;
    result_metric_unit: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    result_metric_direction: z.ZodOptional<z.ZodDefault<z.ZodEnum<["up", "down"]>>>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    sort_order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "slug">, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    is_active?: boolean | undefined;
    goals?: ("sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy")[] | undefined;
    result_metric_name?: string | undefined;
    result_metric_unit?: string | null | undefined;
    result_metric_direction?: "up" | "down" | undefined;
    sort_order?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    is_active?: boolean | undefined;
    goals?: ("sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy")[] | undefined;
    result_metric_name?: string | undefined;
    result_metric_unit?: string | null | undefined;
    result_metric_direction?: "up" | "down" | undefined;
    sort_order?: number | undefined;
}>;
type UpdateDeliverableCategoryDto = z.infer<typeof UpdateDeliverableCategorySchema>;
/** Ferramenta que o entregável exige, sempre com o motivo (ADR 070). */
declare const RequiredToolSchema: z.ZodObject<{
    name: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    reason: string;
}, {
    name: string;
    reason: string;
}>;
type RequiredTool = z.infer<typeof RequiredToolSchema>;
/** Regra da ficha: recorrência tem ciclo e não tem prazo; as demais modalidades têm prazo e não têm ciclo. */
declare function checkTemplateTiming(t: {
    modality: DeliverableModality;
    default_lead_time_days?: number | null;
    recurrence_interval?: RecurrenceInterval | null;
}, ctx: z.RefinementCtx): void;
declare const DeliverableTemplateSchema: z.ZodEffects<z.ZodObject<{
    category_id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modality: z.ZodEnum<["one_off", "setup", "implementation", "recurring"]>;
    /** Dias úteis até a entrega. Obrigatório fora da recorrência; na recorrência vale o ciclo. */
    default_lead_time_days: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    recurrence_interval: z.ZodOptional<z.ZodNullable<z.ZodEnum<["monthly", "quarterly"]>>>;
    default_effort_hours: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    acceptance_criteria: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    required_tools: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        reason: string;
    }, {
        name: string;
        reason: string;
    }>, "many">>;
    base_price_cents: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    executor: z.ZodDefault<z.ZodEnum<["easy_goal", "builder", "both"]>>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    sort_order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    is_active: boolean;
    sort_order: number;
    category_id: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    acceptance_criteria: string[];
    required_tools: {
        name: string;
        reason: string;
    }[];
    executor: "builder" | "easy_goal" | "both";
    description?: string | null | undefined;
    default_lead_time_days?: number | null | undefined;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    default_effort_hours?: number | null | undefined;
    base_price_cents?: number | null | undefined;
}, {
    name: string;
    category_id: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    description?: string | null | undefined;
    is_active?: boolean | undefined;
    sort_order?: number | undefined;
    default_lead_time_days?: number | null | undefined;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    default_effort_hours?: number | null | undefined;
    acceptance_criteria?: string[] | undefined;
    required_tools?: {
        name: string;
        reason: string;
    }[] | undefined;
    base_price_cents?: number | null | undefined;
    executor?: "builder" | "easy_goal" | "both" | undefined;
}>, {
    name: string;
    is_active: boolean;
    sort_order: number;
    category_id: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    acceptance_criteria: string[];
    required_tools: {
        name: string;
        reason: string;
    }[];
    executor: "builder" | "easy_goal" | "both";
    description?: string | null | undefined;
    default_lead_time_days?: number | null | undefined;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    default_effort_hours?: number | null | undefined;
    base_price_cents?: number | null | undefined;
}, {
    name: string;
    category_id: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    description?: string | null | undefined;
    is_active?: boolean | undefined;
    sort_order?: number | undefined;
    default_lead_time_days?: number | null | undefined;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    default_effort_hours?: number | null | undefined;
    acceptance_criteria?: string[] | undefined;
    required_tools?: {
        name: string;
        reason: string;
    }[] | undefined;
    base_price_cents?: number | null | undefined;
    executor?: "builder" | "easy_goal" | "both" | undefined;
}>;
type DeliverableTemplateDto = z.infer<typeof DeliverableTemplateSchema>;
/** PATCH parcial; a API junta com a ficha atual e valida o resultado com `DeliverableTemplateSchema`. */
declare const UpdateDeliverableTemplateSchema: z.ZodObject<{
    category_id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    modality: z.ZodOptional<z.ZodEnum<["one_off", "setup", "implementation", "recurring"]>>;
    default_lead_time_days: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    recurrence_interval: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<["monthly", "quarterly"]>>>>;
    default_effort_hours: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    acceptance_criteria: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    required_tools: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        reason: string;
    }, {
        name: string;
        reason: string;
    }>, "many">>>;
    base_price_cents: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    executor: z.ZodOptional<z.ZodDefault<z.ZodEnum<["easy_goal", "builder", "both"]>>>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    sort_order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    is_active?: boolean | undefined;
    sort_order?: number | undefined;
    category_id?: string | undefined;
    modality?: "recurring" | "one_off" | "setup" | "implementation" | undefined;
    default_lead_time_days?: number | null | undefined;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    default_effort_hours?: number | null | undefined;
    acceptance_criteria?: string[] | undefined;
    required_tools?: {
        name: string;
        reason: string;
    }[] | undefined;
    base_price_cents?: number | null | undefined;
    executor?: "builder" | "easy_goal" | "both" | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    is_active?: boolean | undefined;
    sort_order?: number | undefined;
    category_id?: string | undefined;
    modality?: "recurring" | "one_off" | "setup" | "implementation" | undefined;
    default_lead_time_days?: number | null | undefined;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    default_effort_hours?: number | null | undefined;
    acceptance_criteria?: string[] | undefined;
    required_tools?: {
        name: string;
        reason: string;
    }[] | undefined;
    base_price_cents?: number | null | undefined;
    executor?: "builder" | "easy_goal" | "both" | undefined;
}>;
type UpdateDeliverableTemplateDto = z.infer<typeof UpdateDeliverableTemplateSchema>;
declare const NEED_TYPES: readonly ["service", "tool", "tool_with_implementation", "unsure"];
declare const NeedTypeSchema: z.ZodEnum<["service", "tool", "tool_with_implementation", "unsure"]>;
type NeedType = z.infer<typeof NeedTypeSchema>;
declare const NEED_TYPE_LABELS: Record<NeedType, string>;
/** Onde o cliente está hoje em cada área marcada. */
declare const CATEGORY_STAGES: readonly ["none", "has_not_using", "using_wants_scale"];
declare const CategoryStageSchema: z.ZodEnum<["none", "has_not_using", "using_wants_scale"]>;
type CategoryStage = z.infer<typeof CategoryStageSchema>;
declare const CATEGORY_STAGE_LABELS: Record<CategoryStage, string>;
declare const URGENCIES: readonly ["this_week", "this_month", "next_3_months", "no_rush"];
declare const UrgencySchema: z.ZodEnum<["this_week", "this_month", "next_3_months", "no_rush"]>;
type Urgency = z.infer<typeof UrgencySchema>;
declare const URGENCY_LABELS: Record<Urgency, string>;
declare const BUDGET_RANGES: readonly ["up_to_2k", "2k_10k", "10k_30k", "above_30k", "talk"];
declare const BudgetRangeSchema: z.ZodEnum<["up_to_2k", "2k_10k", "10k_30k", "above_30k", "talk"]>;
type BudgetRange = z.infer<typeof BudgetRangeSchema>;
declare const BUDGET_RANGE_LABELS: Record<BudgetRange, string>;
declare const DIAGNOSTIC_CHANNELS: readonly ["app", "site", "typebot", "crm", "admin"];
declare const DiagnosticChannelSchema: z.ZodEnum<["app", "site", "typebot", "crm", "admin"]>;
type DiagnosticChannel = z.infer<typeof DiagnosticChannelSchema>;
/** Número que o cliente quer mudar (pergunta 7), base da medição do resultado (onda 6). */
declare const KpiBaselineSchema: z.ZodObject<{
    category_slug: z.ZodString;
    name: z.ZodString;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    direction: z.ZodEnum<["up", "down"]>;
    value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    category_slug: string;
    direction: "up" | "down";
    value?: number | null | undefined;
    unit?: string | null | undefined;
}, {
    name: string;
    category_slug: string;
    direction: "up" | "down";
    value?: number | null | undefined;
    unit?: string | null | undefined;
}>;
type KpiBaseline = z.infer<typeof KpiBaselineSchema>;
/** Respostas das 8 perguntas. O mesmo payload vem do app, do site e do CRM. */
declare const DiagnosticSchema: z.ZodObject<{
    goal: z.ZodEnum<["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"]>;
    need_type: z.ZodEnum<["service", "tool", "tool_with_implementation", "unsure"]>;
    categories: z.ZodEffects<z.ZodArray<z.ZodObject<{
        slug: z.ZodString;
        stage: z.ZodEnum<["none", "has_not_using", "using_wants_scale"]>;
    }, "strip", z.ZodTypeAny, {
        slug: string;
        stage: "none" | "has_not_using" | "using_wants_scale";
    }, {
        slug: string;
        stage: "none" | "has_not_using" | "using_wants_scale";
    }>, "many">, {
        slug: string;
        stage: "none" | "has_not_using" | "using_wants_scale";
    }[], {
        slug: string;
        stage: "none" | "has_not_using" | "using_wants_scale";
    }[]>;
    urgency: z.ZodEnum<["this_week", "this_month", "next_3_months", "no_rush"]>;
    budget_range: z.ZodEnum<["up_to_2k", "2k_10k", "10k_30k", "above_30k", "talk"]>;
    kpi_baseline: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        category_slug: z.ZodString;
        name: z.ZodString;
        unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        direction: z.ZodEnum<["up", "down"]>;
        value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category_slug: string;
        direction: "up" | "down";
        value?: number | null | undefined;
        unit?: string | null | undefined;
    }, {
        name: string;
        category_slug: string;
        direction: "up" | "down";
        value?: number | null | undefined;
        unit?: string | null | undefined;
    }>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
    need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
    categories: {
        slug: string;
        stage: "none" | "has_not_using" | "using_wants_scale";
    }[];
    urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
    budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
    description?: string | null | undefined;
    kpi_baseline?: {
        name: string;
        category_slug: string;
        direction: "up" | "down";
        value?: number | null | undefined;
        unit?: string | null | undefined;
    } | null | undefined;
}, {
    goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
    need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
    categories: {
        slug: string;
        stage: "none" | "has_not_using" | "using_wants_scale";
    }[];
    urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
    budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
    description?: string | null | undefined;
    kpi_baseline?: {
        name: string;
        category_slug: string;
        direction: "up" | "down";
        value?: number | null | undefined;
        unit?: string | null | undefined;
    } | null | undefined;
}>;
type DiagnosticDto = z.infer<typeof DiagnosticSchema>;
/** /join do comprador com diagnóstico (substitui o texto livre). */
declare const BuyerDiagnosticJoinSchema: z.ZodObject<{
    phone: z.ZodString;
    diagnostic: z.ZodObject<{
        goal: z.ZodEnum<["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"]>;
        need_type: z.ZodEnum<["service", "tool", "tool_with_implementation", "unsure"]>;
        categories: z.ZodEffects<z.ZodArray<z.ZodObject<{
            slug: z.ZodString;
            stage: z.ZodEnum<["none", "has_not_using", "using_wants_scale"]>;
        }, "strip", z.ZodTypeAny, {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }, {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }>, "many">, {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[], {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[]>;
        urgency: z.ZodEnum<["this_week", "this_month", "next_3_months", "no_rush"]>;
        budget_range: z.ZodEnum<["up_to_2k", "2k_10k", "10k_30k", "above_30k", "talk"]>;
        kpi_baseline: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            category_slug: z.ZodString;
            name: z.ZodString;
            unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            direction: z.ZodEnum<["up", "down"]>;
            value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        }, {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        }>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    }, {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    }>;
    source: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodString>;
        utm_medium: z.ZodOptional<z.ZodString>;
        utm_campaign: z.ZodOptional<z.ZodString>;
        utm_content: z.ZodOptional<z.ZodString>;
        utm_term: z.ZodOptional<z.ZodString>;
        referrer: z.ZodOptional<z.ZodString>;
        landing: z.ZodOptional<z.ZodString>;
        first_touch_at: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    diagnostic: {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    };
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}, {
    phone: string;
    diagnostic: {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    };
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}>;
type BuyerDiagnosticJoinDto = z.infer<typeof BuyerDiagnosticJoinSchema>;
/** Site ou CRM: o lead ainda não tem conta; o contato fica no objetivo. */
declare const ExternalDiagnosticSchema: z.ZodObject<{
    channel: z.ZodEnum<["site", "crm"]>;
    contact: z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
    }, {
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
    }>, {
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
    }, {
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
    }>;
    diagnostic: z.ZodObject<{
        goal: z.ZodEnum<["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"]>;
        need_type: z.ZodEnum<["service", "tool", "tool_with_implementation", "unsure"]>;
        categories: z.ZodEffects<z.ZodArray<z.ZodObject<{
            slug: z.ZodString;
            stage: z.ZodEnum<["none", "has_not_using", "using_wants_scale"]>;
        }, "strip", z.ZodTypeAny, {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }, {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }>, "many">, {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[], {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[]>;
        urgency: z.ZodEnum<["this_week", "this_month", "next_3_months", "no_rush"]>;
        budget_range: z.ZodEnum<["up_to_2k", "2k_10k", "10k_30k", "above_30k", "talk"]>;
        kpi_baseline: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            category_slug: z.ZodString;
            name: z.ZodString;
            unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            direction: z.ZodEnum<["up", "down"]>;
            value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        }, {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        }>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    }, {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    }>;
    source: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodString>;
        utm_medium: z.ZodOptional<z.ZodString>;
        utm_campaign: z.ZodOptional<z.ZodString>;
        utm_content: z.ZodOptional<z.ZodString>;
        utm_term: z.ZodOptional<z.ZodString>;
        referrer: z.ZodOptional<z.ZodString>;
        landing: z.ZodOptional<z.ZodString>;
        first_touch_at: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }, {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    diagnostic: {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    };
    channel: "site" | "crm";
    contact: {
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
    };
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}, {
    diagnostic: {
        goal: "sell_more" | "operate_with_less_effort" | "launch_or_scale_product" | "strategy";
        need_type: "service" | "tool" | "tool_with_implementation" | "unsure";
        categories: {
            slug: string;
            stage: "none" | "has_not_using" | "using_wants_scale";
        }[];
        urgency: "this_week" | "this_month" | "next_3_months" | "no_rush";
        budget_range: "up_to_2k" | "2k_10k" | "10k_30k" | "above_30k" | "talk";
        description?: string | null | undefined;
        kpi_baseline?: {
            name: string;
            category_slug: string;
            direction: "up" | "down";
            value?: number | null | undefined;
            unit?: string | null | undefined;
        } | null | undefined;
    };
    channel: "site" | "crm";
    contact: {
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
    };
    source?: {
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        first_touch_at?: string | undefined;
    } | undefined;
}>;
type ExternalDiagnosticDto = z.infer<typeof ExternalDiagnosticSchema>;
declare const PROPOSAL_STATUSES: readonly ["draft", "sent", "accepted", "declined", "superseded"];
declare const ProposalStatusSchema: z.ZodEnum<["draft", "sent", "accepted", "declined", "superseded"]>;
type ProposalStatus = z.infer<typeof ProposalStatusSchema>;
declare const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string>;
declare const ProposalItemSchema: z.ZodEffects<z.ZodObject<{
    template_id: z.ZodString;
    phase: z.ZodNumber;
    name: z.ZodString;
    modality: z.ZodEnum<["one_off", "setup", "implementation", "recurring"]>;
    lead_time_days: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    recurrence_interval: z.ZodOptional<z.ZodNullable<z.ZodEnum<["monthly", "quarterly"]>>>;
    effort_hours: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    price_cents: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    acceptance_criteria: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    required_tools: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        reason: string;
    }, {
        name: string;
        reason: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    acceptance_criteria: string[];
    required_tools: {
        name: string;
        reason: string;
    }[];
    template_id: string;
    phase: number;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    lead_time_days?: number | null | undefined;
    effort_hours?: number | null | undefined;
    price_cents?: number | null | undefined;
}, {
    name: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    template_id: string;
    phase: number;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    acceptance_criteria?: string[] | undefined;
    required_tools?: {
        name: string;
        reason: string;
    }[] | undefined;
    lead_time_days?: number | null | undefined;
    effort_hours?: number | null | undefined;
    price_cents?: number | null | undefined;
}>, {
    name: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    acceptance_criteria: string[];
    required_tools: {
        name: string;
        reason: string;
    }[];
    template_id: string;
    phase: number;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    lead_time_days?: number | null | undefined;
    effort_hours?: number | null | undefined;
    price_cents?: number | null | undefined;
}, {
    name: string;
    modality: "recurring" | "one_off" | "setup" | "implementation";
    template_id: string;
    phase: number;
    recurrence_interval?: "monthly" | "quarterly" | null | undefined;
    acceptance_criteria?: string[] | undefined;
    required_tools?: {
        name: string;
        reason: string;
    }[] | undefined;
    lead_time_days?: number | null | undefined;
    effort_hours?: number | null | undefined;
    price_cents?: number | null | undefined;
}>;
type ProposalItemDto = z.infer<typeof ProposalItemSchema>;
declare const SaveProposalSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    items: z.ZodArray<z.ZodEffects<z.ZodObject<{
        template_id: z.ZodString;
        phase: z.ZodNumber;
        name: z.ZodString;
        modality: z.ZodEnum<["one_off", "setup", "implementation", "recurring"]>;
        lead_time_days: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        recurrence_interval: z.ZodOptional<z.ZodNullable<z.ZodEnum<["monthly", "quarterly"]>>>;
        effort_hours: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        price_cents: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        acceptance_criteria: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        required_tools: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            reason: string;
        }, {
            name: string;
            reason: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        modality: "recurring" | "one_off" | "setup" | "implementation";
        acceptance_criteria: string[];
        required_tools: {
            name: string;
            reason: string;
        }[];
        template_id: string;
        phase: number;
        recurrence_interval?: "monthly" | "quarterly" | null | undefined;
        lead_time_days?: number | null | undefined;
        effort_hours?: number | null | undefined;
        price_cents?: number | null | undefined;
    }, {
        name: string;
        modality: "recurring" | "one_off" | "setup" | "implementation";
        template_id: string;
        phase: number;
        recurrence_interval?: "monthly" | "quarterly" | null | undefined;
        acceptance_criteria?: string[] | undefined;
        required_tools?: {
            name: string;
            reason: string;
        }[] | undefined;
        lead_time_days?: number | null | undefined;
        effort_hours?: number | null | undefined;
        price_cents?: number | null | undefined;
    }>, {
        name: string;
        modality: "recurring" | "one_off" | "setup" | "implementation";
        acceptance_criteria: string[];
        required_tools: {
            name: string;
            reason: string;
        }[];
        template_id: string;
        phase: number;
        recurrence_interval?: "monthly" | "quarterly" | null | undefined;
        lead_time_days?: number | null | undefined;
        effort_hours?: number | null | undefined;
        price_cents?: number | null | undefined;
    }, {
        name: string;
        modality: "recurring" | "one_off" | "setup" | "implementation";
        template_id: string;
        phase: number;
        recurrence_interval?: "monthly" | "quarterly" | null | undefined;
        acceptance_criteria?: string[] | undefined;
        required_tools?: {
            name: string;
            reason: string;
        }[] | undefined;
        lead_time_days?: number | null | undefined;
        effort_hours?: number | null | undefined;
        price_cents?: number | null | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        name: string;
        modality: "recurring" | "one_off" | "setup" | "implementation";
        acceptance_criteria: string[];
        required_tools: {
            name: string;
            reason: string;
        }[];
        template_id: string;
        phase: number;
        recurrence_interval?: "monthly" | "quarterly" | null | undefined;
        lead_time_days?: number | null | undefined;
        effort_hours?: number | null | undefined;
        price_cents?: number | null | undefined;
    }[];
    notes?: string | null | undefined;
}, {
    items: {
        name: string;
        modality: "recurring" | "one_off" | "setup" | "implementation";
        template_id: string;
        phase: number;
        recurrence_interval?: "monthly" | "quarterly" | null | undefined;
        acceptance_criteria?: string[] | undefined;
        required_tools?: {
            name: string;
            reason: string;
        }[] | undefined;
        lead_time_days?: number | null | undefined;
        effort_hours?: number | null | undefined;
        price_cents?: number | null | undefined;
    }[];
    notes?: string | null | undefined;
}>;
type SaveProposalDto = z.infer<typeof SaveProposalSchema>;
declare const DecideProposalSchema: z.ZodObject<{
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    note?: string | null | undefined;
}, {
    note?: string | null | undefined;
}>;
type DecideProposalDto = z.infer<typeof DecideProposalSchema>;
declare const EXECUTION_STATUSES: readonly ["todo", "in_progress", "delivered", "returned", "accepted", "cancelled"];
declare const ExecutionStatusSchema: z.ZodEnum<["todo", "in_progress", "delivered", "returned", "accepted", "cancelled"]>;
type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;
declare const EXECUTION_STATUS_LABELS: Record<ExecutionStatus, string>;
/** Quem pode mover o status: responsável, comprador (aceite/devolução) e admin (tudo). */
type ExecutionActor = 'assignee' | 'buyer' | 'admin';
/** Recorrência não tem entrega única: fica em andamento até ser cancelada. */
declare function canTransition(from: ExecutionStatus, to: ExecutionStatus, actor: ExecutionActor, modality: DeliverableModality): boolean;
declare const UpdateExecutionSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["todo", "in_progress", "delivered", "returned", "accepted", "cancelled"]>>;
    assignee_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "delivered" | "cancelled" | "in_progress" | "accepted" | "todo" | "returned" | undefined;
    note?: string | null | undefined;
    assignee_id?: string | null | undefined;
}, {
    status?: "delivered" | "cancelled" | "in_progress" | "accepted" | "todo" | "returned" | undefined;
    note?: string | null | undefined;
    assignee_id?: string | null | undefined;
}>, {
    status?: "delivered" | "cancelled" | "in_progress" | "accepted" | "todo" | "returned" | undefined;
    note?: string | null | undefined;
    assignee_id?: string | null | undefined;
}, {
    status?: "delivered" | "cancelled" | "in_progress" | "accepted" | "todo" | "returned" | undefined;
    note?: string | null | undefined;
    assignee_id?: string | null | undefined;
}>;
type UpdateExecutionDto = z.infer<typeof UpdateExecutionSchema>;
declare const ReturnDeliverableSchema: z.ZodObject<{
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    note: string;
}, {
    note: string;
}>;
type ReturnDeliverableDto = z.infer<typeof ReturnDeliverableSchema>;
declare const TimeLogSchema: z.ZodObject<{
    hours: z.ZodNumber;
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    logged_on: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    hours: number;
    note?: string | null | undefined;
    logged_on?: string | undefined;
}, {
    hours: number;
    note?: string | null | undefined;
    logged_on?: string | undefined;
}>;
type TimeLogDto = z.infer<typeof TimeLogSchema>;
/** Mínimo de entregas reais para o prazo mostrado deixar de ser o da ficha (decisão D6). */
declare const LEAD_TIME_MIN_SAMPLE = 5;
declare const RESULT_CHECKPOINTS: readonly ["d30", "d60", "d90"];
declare const ResultCheckpointSchema: z.ZodEnum<["d30", "d60", "d90"]>;
type ResultCheckpoint = z.infer<typeof ResultCheckpointSchema>;
declare const RESULT_CHECKPOINT_DAYS: Record<ResultCheckpoint, number>;
declare const ResultMeasurementSchema: z.ZodObject<{
    checkpoint: z.ZodEnum<["d30", "d60", "d90"]>;
    value: z.ZodNumber;
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    value: number;
    checkpoint: "d30" | "d60" | "d90";
    note?: string | null | undefined;
}, {
    value: number;
    checkpoint: "d30" | "d60" | "d90";
    note?: string | null | undefined;
}>;
type ResultMeasurementDto = z.infer<typeof ResultMeasurementSchema>;
/** O número melhorou em relação à partida, no sentido da métrica. Sem partida, não dá para afirmar. */
declare function kpiImproved(baseline: number | null | undefined, current: number, direction: MetricDirection): boolean | null;

/**
 * Parâmetro que leva a referência do lead até o checkout e volta no webhook como `lead_ref`.
 * O valor é um token opaco assinado pelo CRM (`<lead_id>.<hmac>`), devolvido na captura. Quem
 * repassa (LP, gateway, API) não interpreta nem gera: só o CRM assina e confere. É uma dica, nunca
 * autoridade: com e-mail no evento, o CRM só usa o lead se o e-mail bater (revisão de segurança s369).
 */
declare const CRM_LEAD_REF_PARAM = "eg_lead";
/** Horas depois do clique no checkout, sem pagamento, para o lead virar "abandonou checkout" (R-C). */
declare const CHECKOUT_ABANDON_HOURS = 24;
/** Etiquetas automáticas do funil. O texto é o que aparece no CRM e no app. */
declare const CRM_FUNNEL_TAGS: {
    readonly checkoutClicked: "foi ao checkout";
    readonly paymentPending: "pagamento pendente";
    readonly checkoutAbandoned: "abandonou checkout";
    readonly saleWithoutLead: "venda sem lead";
};
type CrmFunnelTag = (typeof CRM_FUNNEL_TAGS)[keyof typeof CRM_FUNNEL_TAGS];
/** Etapas que a automação do funil usa (o CRM tem outras; contas personalizadas podem não ter "Checkout"). */
declare const CRM_FUNNEL_STAGES: readonly ["Novo", "Checkout", "Fechado Ganho", "Perdido"];
/** Campos extras que toda captura pública manda além de nome/e-mail/telefone. */
declare const CrmCaptureExtrasSchema: z.ZodObject<{
    /** Produto dentro da empresa Easy Goal (ex.: "Desafio Builder"). */
    produto: z.ZodOptional<z.ZodString>;
    etiquetas: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Primeiro toque (cookie de primeira parte, 90 dias). Uma captura repetida não sobrescreve. */
    attribution: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodString>;
        utm_medium: z.ZodOptional<z.ZodString>;
        utm_campaign: z.ZodOptional<z.ZodString>;
        utm_content: z.ZodOptional<z.ZodString>;
        utm_term: z.ZodOptional<z.ZodString>;
        gclid: z.ZodOptional<z.ZodString>;
        gbraid: z.ZodOptional<z.ZodString>;
        wbraid: z.ZodOptional<z.ZodString>;
        fbclid: z.ZodOptional<z.ZodString>;
        ttclid: z.ZodOptional<z.ZodString>;
        msclkid: z.ZodOptional<z.ZodString>;
        referrer: z.ZodOptional<z.ZodString>;
        landing: z.ZodOptional<z.ZodString>;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    }, {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    }>>;
    /** URL da página que capturou. */
    origem_pagina: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    produto?: string | undefined;
    etiquetas?: string[] | undefined;
    attribution?: {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    } | undefined;
    origem_pagina?: string | undefined;
}, {
    produto?: string | undefined;
    etiquetas?: string[] | undefined;
    attribution?: {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    } | undefined;
    origem_pagina?: string | undefined;
}>;
type CrmCaptureExtras = z.infer<typeof CrmCaptureExtrasSchema>;
/**
 * Clique no botão do checkout, registrado pelo redirecionador da LP antes de mandar ao gateway (R-B).
 * Precisa de `lead_ref` ou `email`; sem nenhum dos dois, o clique conta só como visita anônima.
 */
declare const CheckoutClickSchema: z.ZodEffects<z.ZodObject<{
    produto: z.ZodString;
    lead_ref: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    destino_url: z.ZodString;
    attribution: z.ZodOptional<z.ZodObject<{
        utm_source: z.ZodOptional<z.ZodString>;
        utm_medium: z.ZodOptional<z.ZodString>;
        utm_campaign: z.ZodOptional<z.ZodString>;
        utm_content: z.ZodOptional<z.ZodString>;
        utm_term: z.ZodOptional<z.ZodString>;
        gclid: z.ZodOptional<z.ZodString>;
        gbraid: z.ZodOptional<z.ZodString>;
        wbraid: z.ZodOptional<z.ZodString>;
        fbclid: z.ZodOptional<z.ZodString>;
        ttclid: z.ZodOptional<z.ZodString>;
        msclkid: z.ZodOptional<z.ZodString>;
        referrer: z.ZodOptional<z.ZodString>;
        landing: z.ZodOptional<z.ZodString>;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    }, {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    }>>;
    occurred_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    occurred_at: string;
    produto: string;
    destino_url: string;
    email?: string | undefined;
    lead_ref?: string | undefined;
    attribution?: {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    } | undefined;
}, {
    occurred_at: string;
    produto: string;
    destino_url: string;
    email?: string | undefined;
    lead_ref?: string | undefined;
    attribution?: {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    } | undefined;
}>, {
    occurred_at: string;
    produto: string;
    destino_url: string;
    email?: string | undefined;
    lead_ref?: string | undefined;
    attribution?: {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    } | undefined;
}, {
    occurred_at: string;
    produto: string;
    destino_url: string;
    email?: string | undefined;
    lead_ref?: string | undefined;
    attribution?: {
        at: string;
        utm_source?: string | undefined;
        utm_medium?: string | undefined;
        utm_campaign?: string | undefined;
        utm_content?: string | undefined;
        utm_term?: string | undefined;
        referrer?: string | undefined;
        landing?: string | undefined;
        gclid?: string | undefined;
        gbraid?: string | undefined;
        wbraid?: string | undefined;
        fbclid?: string | undefined;
        ttclid?: string | undefined;
        msclkid?: string | undefined;
    } | undefined;
}>;
type CheckoutClick = z.infer<typeof CheckoutClickSchema>;
/** Um lead como o CRM devolve no espelho (antes do filtro por perfil da API). */
declare const CrmMirrorLeadSchema: z.ZodObject<{
    id: z.ZodString;
    nome: z.ZodString;
    email: z.ZodString;
    telefone: z.ZodString;
    canal: z.ZodString;
    campanha: z.ZodString;
    etapa: z.ZodString;
    aberto: z.ZodBoolean;
    criado_em: z.ZodString;
    convertido_em: z.ZodNullable<z.ZodString>;
    crm_url: z.ZodString;
    produto: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    etiquetas: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    utm_source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm_medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm_campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm_content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    utm_term: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    gclid: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fbclid: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    /** Campanha do último toque, quando diferente da primeira. */
    ultima_utm_campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    valor_cents: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    /** Nome de quem está atendendo (R-D: o produtor vê, sem ver a conversa). */
    consultor_nome: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ultima_acao_em: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ultima_acao_descricao: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    id: string;
    nome: string;
    telefone: string;
    canal: string;
    campanha: string;
    etapa: string;
    aberto: boolean;
    criado_em: string;
    convertido_em: string | null;
    crm_url: string;
    utm_source?: string | null | undefined;
    utm_medium?: string | null | undefined;
    utm_campaign?: string | null | undefined;
    utm_content?: string | null | undefined;
    utm_term?: string | null | undefined;
    gclid?: string | null | undefined;
    fbclid?: string | null | undefined;
    produto?: string | null | undefined;
    etiquetas?: string[] | undefined;
    ultima_utm_campaign?: string | null | undefined;
    valor_cents?: number | null | undefined;
    consultor_nome?: string | null | undefined;
    ultima_acao_em?: string | null | undefined;
    ultima_acao_descricao?: string | null | undefined;
}, {
    email: string;
    id: string;
    nome: string;
    telefone: string;
    canal: string;
    campanha: string;
    etapa: string;
    aberto: boolean;
    criado_em: string;
    convertido_em: string | null;
    crm_url: string;
    utm_source?: string | null | undefined;
    utm_medium?: string | null | undefined;
    utm_campaign?: string | null | undefined;
    utm_content?: string | null | undefined;
    utm_term?: string | null | undefined;
    gclid?: string | null | undefined;
    fbclid?: string | null | undefined;
    produto?: string | null | undefined;
    etiquetas?: string[] | undefined;
    ultima_utm_campaign?: string | null | undefined;
    valor_cents?: number | null | undefined;
    consultor_nome?: string | null | undefined;
    ultima_acao_em?: string | null | undefined;
    ultima_acao_descricao?: string | null | undefined;
}>;
type CrmMirrorLead = z.infer<typeof CrmMirrorLeadSchema>;
declare const CrmMirrorSchema: z.ZodObject<{
    empresa_id: z.ZodString;
    gerado_em: z.ZodString;
    totais: z.ZodObject<{
        leads: z.ZodNumber;
        ultimos_30_dias: z.ZodNumber;
        abertos: z.ZodNumber;
        ganhos: z.ZodNumber;
        perdidos: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        leads: number;
        ultimos_30_dias: number;
        abertos: number;
        ganhos: number;
        perdidos: number;
    }, {
        leads: number;
        ultimos_30_dias: number;
        abertos: number;
        ganhos: number;
        perdidos: number;
    }>;
    por_etapa: z.ZodArray<z.ZodObject<{
        etapa: z.ZodString;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        etapa: string;
        total: number;
    }, {
        etapa: string;
        total: number;
    }>, "many">;
    por_campanha: z.ZodArray<z.ZodObject<{
        campanha: z.ZodString;
        total: z.ZodNumber;
        ganhos: z.ZodNumber;
        foram_ao_checkout: z.ZodOptional<z.ZodNumber>;
        valor_cents: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        campanha: string;
        ganhos: number;
        total: number;
        valor_cents?: number | undefined;
        foram_ao_checkout?: number | undefined;
    }, {
        campanha: string;
        ganhos: number;
        total: number;
        valor_cents?: number | undefined;
        foram_ao_checkout?: number | undefined;
    }>, "many">;
    leads: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        nome: z.ZodString;
        email: z.ZodString;
        telefone: z.ZodString;
        canal: z.ZodString;
        campanha: z.ZodString;
        etapa: z.ZodString;
        aberto: z.ZodBoolean;
        criado_em: z.ZodString;
        convertido_em: z.ZodNullable<z.ZodString>;
        crm_url: z.ZodString;
        produto: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        etiquetas: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        utm_source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        utm_medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        utm_campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        utm_content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        utm_term: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        gclid: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fbclid: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        /** Campanha do último toque, quando diferente da primeira. */
        ultima_utm_campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        valor_cents: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        /** Nome de quem está atendendo (R-D: o produtor vê, sem ver a conversa). */
        consultor_nome: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        ultima_acao_em: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        ultima_acao_descricao: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        id: string;
        nome: string;
        telefone: string;
        canal: string;
        campanha: string;
        etapa: string;
        aberto: boolean;
        criado_em: string;
        convertido_em: string | null;
        crm_url: string;
        utm_source?: string | null | undefined;
        utm_medium?: string | null | undefined;
        utm_campaign?: string | null | undefined;
        utm_content?: string | null | undefined;
        utm_term?: string | null | undefined;
        gclid?: string | null | undefined;
        fbclid?: string | null | undefined;
        produto?: string | null | undefined;
        etiquetas?: string[] | undefined;
        ultima_utm_campaign?: string | null | undefined;
        valor_cents?: number | null | undefined;
        consultor_nome?: string | null | undefined;
        ultima_acao_em?: string | null | undefined;
        ultima_acao_descricao?: string | null | undefined;
    }, {
        email: string;
        id: string;
        nome: string;
        telefone: string;
        canal: string;
        campanha: string;
        etapa: string;
        aberto: boolean;
        criado_em: string;
        convertido_em: string | null;
        crm_url: string;
        utm_source?: string | null | undefined;
        utm_medium?: string | null | undefined;
        utm_campaign?: string | null | undefined;
        utm_content?: string | null | undefined;
        utm_term?: string | null | undefined;
        gclid?: string | null | undefined;
        fbclid?: string | null | undefined;
        produto?: string | null | undefined;
        etiquetas?: string[] | undefined;
        ultima_utm_campaign?: string | null | undefined;
        valor_cents?: number | null | undefined;
        consultor_nome?: string | null | undefined;
        ultima_acao_em?: string | null | undefined;
        ultima_acao_descricao?: string | null | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    empresa_id: string;
    gerado_em: string;
    totais: {
        leads: number;
        ultimos_30_dias: number;
        abertos: number;
        ganhos: number;
        perdidos: number;
    };
    leads: {
        email: string;
        id: string;
        nome: string;
        telefone: string;
        canal: string;
        campanha: string;
        etapa: string;
        aberto: boolean;
        criado_em: string;
        convertido_em: string | null;
        crm_url: string;
        utm_source?: string | null | undefined;
        utm_medium?: string | null | undefined;
        utm_campaign?: string | null | undefined;
        utm_content?: string | null | undefined;
        utm_term?: string | null | undefined;
        gclid?: string | null | undefined;
        fbclid?: string | null | undefined;
        produto?: string | null | undefined;
        etiquetas?: string[] | undefined;
        ultima_utm_campaign?: string | null | undefined;
        valor_cents?: number | null | undefined;
        consultor_nome?: string | null | undefined;
        ultima_acao_em?: string | null | undefined;
        ultima_acao_descricao?: string | null | undefined;
    }[];
    por_etapa: {
        etapa: string;
        total: number;
    }[];
    por_campanha: {
        campanha: string;
        ganhos: number;
        total: number;
        valor_cents?: number | undefined;
        foram_ao_checkout?: number | undefined;
    }[];
}, {
    empresa_id: string;
    gerado_em: string;
    totais: {
        leads: number;
        ultimos_30_dias: number;
        abertos: number;
        ganhos: number;
        perdidos: number;
    };
    leads: {
        email: string;
        id: string;
        nome: string;
        telefone: string;
        canal: string;
        campanha: string;
        etapa: string;
        aberto: boolean;
        criado_em: string;
        convertido_em: string | null;
        crm_url: string;
        utm_source?: string | null | undefined;
        utm_medium?: string | null | undefined;
        utm_campaign?: string | null | undefined;
        utm_content?: string | null | undefined;
        utm_term?: string | null | undefined;
        gclid?: string | null | undefined;
        fbclid?: string | null | undefined;
        produto?: string | null | undefined;
        etiquetas?: string[] | undefined;
        ultima_utm_campaign?: string | null | undefined;
        valor_cents?: number | null | undefined;
        consultor_nome?: string | null | undefined;
        ultima_acao_em?: string | null | undefined;
        ultima_acao_descricao?: string | null | undefined;
    }[];
    por_etapa: {
        etapa: string;
        total: number;
    }[];
    por_campanha: {
        campanha: string;
        ganhos: number;
        total: number;
        valor_cents?: number | undefined;
        foram_ao_checkout?: number | undefined;
    }[];
}>;
type CrmMirror = z.infer<typeof CrmMirrorSchema>;
declare const MIRROR_PROFILES: readonly ["admin", "producer", "client", "builder"];
type MirrorProfile = (typeof MIRROR_PROFILES)[number];
/** Perfis que o admin configura por ligação (linhas em `crm_mirror_policies`). */
declare const CONFIGURABLE_PROFILES: readonly ["producer", "client"];
type ConfigurableProfile = (typeof CONFIGURABLE_PROFILES)[number];
declare const MIRROR_BLOCKS: readonly ["totais", "por_etapa", "por_campanha", "leads"];
type MirrorBlock = (typeof MIRROR_BLOCKS)[number];
/** Campos do lead que a política pode liberar. Tudo que não está aqui nunca sai da API. */
declare const LEAD_FIELDS: readonly ["nome", "email", "telefone", "canal", "campanha", "produto", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ultima_utm_campaign", "etapa", "aberto", "criado_em", "convertido_em", "valor_cents", "etiquetas", "consultor_nome", "ultima_acao_em", "ultima_acao_descricao"];
type LeadField = (typeof LEAD_FIELDS)[number];
declare const MASKABLE_FIELDS: readonly ["email", "telefone"];
type MaskableField = (typeof MASKABLE_FIELDS)[number];
declare const MirrorPolicyProfileSchema: z.ZodEnum<["producer", "client"]>;
/** Corpo do PUT `/admin/crm-links/:id/policies/:profile` e linha de `crm_mirror_policies`. */
declare const MirrorPolicySchema: z.ZodObject<{
    blocks: z.ZodEffects<z.ZodArray<z.ZodEnum<["totais", "por_etapa", "por_campanha", "leads"]>, "many">, ("totais" | "leads" | "por_etapa" | "por_campanha")[], ("totais" | "leads" | "por_etapa" | "por_campanha")[]>;
    allowed_fields: z.ZodEffects<z.ZodArray<z.ZodEnum<["nome", "email", "telefone", "canal", "campanha", "produto", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ultima_utm_campaign", "etapa", "aberto", "criado_em", "convertido_em", "valor_cents", "etiquetas", "consultor_nome", "ultima_acao_em", "ultima_acao_descricao"]>, "many">, ("email" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "gclid" | "fbclid" | "produto" | "etiquetas" | "nome" | "telefone" | "canal" | "campanha" | "etapa" | "aberto" | "criado_em" | "convertido_em" | "ultima_utm_campaign" | "valor_cents" | "consultor_nome" | "ultima_acao_em" | "ultima_acao_descricao")[], ("email" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "gclid" | "fbclid" | "produto" | "etiquetas" | "nome" | "telefone" | "canal" | "campanha" | "etapa" | "aberto" | "criado_em" | "convertido_em" | "ultima_utm_campaign" | "valor_cents" | "consultor_nome" | "ultima_acao_em" | "ultima_acao_descricao")[]>;
    masked_fields: z.ZodEffects<z.ZodArray<z.ZodEnum<["email", "telefone"]>, "many">, ("email" | "telefone")[], ("email" | "telefone")[]>;
    open_in_crm: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    blocks: ("totais" | "leads" | "por_etapa" | "por_campanha")[];
    allowed_fields: ("email" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "gclid" | "fbclid" | "produto" | "etiquetas" | "nome" | "telefone" | "canal" | "campanha" | "etapa" | "aberto" | "criado_em" | "convertido_em" | "ultima_utm_campaign" | "valor_cents" | "consultor_nome" | "ultima_acao_em" | "ultima_acao_descricao")[];
    masked_fields: ("email" | "telefone")[];
    open_in_crm: boolean;
}, {
    blocks: ("totais" | "leads" | "por_etapa" | "por_campanha")[];
    allowed_fields: ("email" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "gclid" | "fbclid" | "produto" | "etiquetas" | "nome" | "telefone" | "canal" | "campanha" | "etapa" | "aberto" | "criado_em" | "convertido_em" | "ultima_utm_campaign" | "valor_cents" | "consultor_nome" | "ultima_acao_em" | "ultima_acao_descricao")[];
    masked_fields: ("email" | "telefone")[];
    open_in_crm: boolean;
}>;
type MirrorPolicy = z.infer<typeof MirrorPolicySchema>;
/**
 * Padrão ao criar a política (o mesmo que a migration semeia).
 * C-B: e-mail e telefone mascarados para produtor e cliente. R-D: o produtor vê o consultor e a
 * última ação, sem a conversa.
 */
declare const DEFAULT_MIRROR_POLICIES: Record<ConfigurableProfile, MirrorPolicy>;

declare const PREVIEW_LEAD_TIME_SOURCES: readonly ["template", "history"];
/** Uma etapa do preview público. */
declare const DiagnosticPreviewItemSchema: z.ZodObject<{
    name: z.ZodString;
    phase: z.ZodNumber;
    modality: z.ZodString;
    /** Dias úteis; `null` = sem prazo definido no catálogo (o consultor define). */
    lead_time_days: z.ZodNullable<z.ZodNumber>;
    /** `history` = prazo médio das entregas reais; `template` = prazo padrão do catálogo. */
    lead_time_source: z.ZodEnum<["template", "history"]>;
    acceptance_criteria: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    modality: string;
    acceptance_criteria: string[];
    phase: number;
    lead_time_days: number | null;
    lead_time_source: "template" | "history";
}, {
    name: string;
    modality: string;
    acceptance_criteria: string[];
    phase: number;
    lead_time_days: number | null;
    lead_time_source: "template" | "history";
}>;
type DiagnosticPreviewItem = z.infer<typeof DiagnosticPreviewItemSchema>;
/** Devolvido pela API a `POST /internal/diagnostics` (canal `site`) e mostrado pelo site. */
declare const DiagnosticPreviewSchema: z.ZodObject<{
    objective_id: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        phase: z.ZodNumber;
        modality: z.ZodString;
        /** Dias úteis; `null` = sem prazo definido no catálogo (o consultor define). */
        lead_time_days: z.ZodNullable<z.ZodNumber>;
        /** `history` = prazo médio das entregas reais; `template` = prazo padrão do catálogo. */
        lead_time_source: z.ZodEnum<["template", "history"]>;
        acceptance_criteria: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        modality: string;
        acceptance_criteria: string[];
        phase: number;
        lead_time_days: number | null;
        lead_time_source: "template" | "history";
    }, {
        name: string;
        modality: string;
        acceptance_criteria: string[];
        phase: number;
        lead_time_days: number | null;
        lead_time_source: "template" | "history";
    }>, "many">;
    phases: z.ZodNumber;
    /** Soma das fases (recorrência fora), em dias úteis. */
    total_lead_time_days: z.ZodNumber;
    has_recurring: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    items: {
        name: string;
        modality: string;
        acceptance_criteria: string[];
        phase: number;
        lead_time_days: number | null;
        lead_time_source: "template" | "history";
    }[];
    objective_id: string;
    phases: number;
    total_lead_time_days: number;
    has_recurring: boolean;
}, {
    items: {
        name: string;
        modality: string;
        acceptance_criteria: string[];
        phase: number;
        lead_time_days: number | null;
        lead_time_source: "template" | "history";
    }[];
    objective_id: string;
    phases: number;
    total_lead_time_days: number;
    has_recurring: boolean;
}>;
type DiagnosticPreview = z.infer<typeof DiagnosticPreviewSchema>;
/** Item interno da proposta em rascunho (vai ao CRM, nunca ao público). */
declare const CrmProposalDraftItemSchema: z.ZodObject<{
    nome: z.ZodString;
    fase: z.ZodNumber;
    modalidade: z.ZodString;
    prazo_dias: z.ZodNullable<z.ZodNumber>;
    horas: z.ZodNullable<z.ZodNumber>;
    preco_cents: z.ZodNullable<z.ZodNumber>;
    criterios_aceite: z.ZodArray<z.ZodString, "many">;
    ferramentas: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    nome: string;
    fase: number;
    modalidade: string;
    prazo_dias: number | null;
    horas: number | null;
    preco_cents: number | null;
    criterios_aceite: string[];
    ferramentas: string[];
}, {
    nome: string;
    fase: number;
    modalidade: string;
    prazo_dias: number | null;
    horas: number | null;
    preco_cents: number | null;
    criterios_aceite: string[];
    ferramentas: string[];
}>;
type CrmProposalDraftItem = z.infer<typeof CrmProposalDraftItemSchema>;
/**
 * API → Easy CRM (`POST /api/propostas/rascunho`, token de serviço). Idempotente por `objective_id`:
 * reenviar substitui os itens do rascunho, nunca cria outro.
 */
declare const CrmProposalDraftSchema: z.ZodObject<{
    objective_id: z.ZodString;
    email: z.ZodString;
    /** Token assinado do CRM, quando a captura devolveu um (ver `crm-funnel.ts`). Só dica. */
    lead_ref: z.ZodOptional<z.ZodString>;
    produto: z.ZodString;
    resumo_diagnostico: z.ZodString;
    itens: z.ZodArray<z.ZodObject<{
        nome: z.ZodString;
        fase: z.ZodNumber;
        modalidade: z.ZodString;
        prazo_dias: z.ZodNullable<z.ZodNumber>;
        horas: z.ZodNullable<z.ZodNumber>;
        preco_cents: z.ZodNullable<z.ZodNumber>;
        criterios_aceite: z.ZodArray<z.ZodString, "many">;
        ferramentas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        nome: string;
        fase: number;
        modalidade: string;
        prazo_dias: number | null;
        horas: number | null;
        preco_cents: number | null;
        criterios_aceite: string[];
        ferramentas: string[];
    }, {
        nome: string;
        fase: number;
        modalidade: string;
        prazo_dias: number | null;
        horas: number | null;
        preco_cents: number | null;
        criterios_aceite: string[];
        ferramentas: string[];
    }>, "many">;
    prazo_total_dias: z.ZodNumber;
    preco_total_cents: z.ZodNumber;
    /** Link do objetivo no admin do app, para o consultor abrir a proposta completa. */
    app_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    produto: string;
    objective_id: string;
    resumo_diagnostico: string;
    itens: {
        nome: string;
        fase: number;
        modalidade: string;
        prazo_dias: number | null;
        horas: number | null;
        preco_cents: number | null;
        criterios_aceite: string[];
        ferramentas: string[];
    }[];
    prazo_total_dias: number;
    preco_total_cents: number;
    lead_ref?: string | undefined;
    app_url?: string | undefined;
}, {
    email: string;
    produto: string;
    objective_id: string;
    resumo_diagnostico: string;
    itens: {
        nome: string;
        fase: number;
        modalidade: string;
        prazo_dias: number | null;
        horas: number | null;
        preco_cents: number | null;
        criterios_aceite: string[];
        ferramentas: string[];
    }[];
    prazo_total_dias: number;
    preco_total_cents: number;
    lead_ref?: string | undefined;
    app_url?: string | undefined;
}>;
type CrmProposalDraft = z.infer<typeof CrmProposalDraftSchema>;

/** Centavos inteiros. Alias documental — o compilador aceita `number`. */
type Cents = number;
/** Garante centavos inteiros e finitos; qualquer outra coisa vira 0. */
declare function toCents(value: number | null | undefined): Cents;
/** Reais (ex.: 197.9 ou "197,90") → centavos. Usar só na fronteira com dados em reais. */
declare function reaisToCents(reais: number | string | null | undefined): Cents;
/** Centavos → reais (número), para APIs externas que exigem reais. */
declare function centsToReais(cents: Cents | null | undefined): number;
/**
 * Centavos → "R$ 1.234,56". O espaço entre "R$" e o número é inquebrável,
 * então o valor nunca quebra linha no meio.
 */
declare function formatBRL(cents: Cents | null | undefined): string;
/** Centavos → "R$ 1,2 mil" / "R$ 3,4 mi" para cards estreitos. */
declare function formatBRLCompact(cents: Cents | null | undefined): string;
/** Máscara de input estilo caixa eletrônico: "4999" → "49,99". */
declare function maskBRLInput(raw: string): string;
/** Texto mascarado ("49,99") → centavos (4999). */
declare function brlInputToCents(display: string): Cents;
/** Valor de um período convertido para o mês (MRR). */
declare function monthlyCents(cents: Cents | null | undefined, frequency: string | null | undefined): Cents;

export { ATTRIBUTION_MAX_LENGTH, ATTRIBUTION_PARAM, type AttributionTouch, AttributionTouchSchema, BUDGET_RANGES, BUDGET_RANGE_LABELS, type BudgetRange, BudgetRangeSchema, type BulkDeleteUsersDto, BulkDeleteUsersSchema, type BuyerDiagnosticJoinDto, BuyerDiagnosticJoinSchema, type BuyerJoinDto, BuyerJoinSchema, CATEGORY_STAGES, CATEGORY_STAGE_LABELS, CHECKOUT_ABANDON_HOURS, CLICK_ID_KEYS, COMMERCE_EVENT_TYPES, COMMERCE_EVENT_VERIFICATION, COMMERCE_GATEWAYS, COMMERCE_REF_PARAM, CONFIGURABLE_PROFILES, CRM_FUNNEL_STAGES, CRM_FUNNEL_TAGS, CRM_LEAD_REF_PARAM, type CancelSubscriptionDto, CancelSubscriptionSchema, type CategoryStage, CategoryStageSchema, type Cents, type CheckoutClick, CheckoutClickSchema, type CommerceEvent, CommerceEventSchema, type CommerceEventType, CommerceEventTypeSchema, CommerceEventVerificationSchema, type CommerceGateway, CommerceGatewaySchema, type CompleteProfileDto, CompleteProfileSchema, type ConfigurableProfile, type CreateAdminFeedbackDto, CreateAdminFeedbackSchema, type CreateCampaignDto, CreateCampaignSchema, type CreateCommentDto, CreateCommentSchema, type CreateCompanyDto, CreateCompanySchema, type CreateFeedbackDto, CreateFeedbackSchema, type CreateNotificationPayload, type CreateObjectiveDto, CreateObjectiveSchema, type CreatePlanLinkDto, CreatePlanLinkSchema, type CreateProducerDto, CreateProducerSchema, type CreateSaasProductDto, CreateSaasProductSchema, type CreateServiceRequestDto, CreateServiceRequestSchema, type CrmCaptureExtras, CrmCaptureExtrasSchema, type CrmFunnelTag, type CrmMirror, type CrmMirrorLead, CrmMirrorLeadSchema, CrmMirrorSchema, type CrmProposalDraft, type CrmProposalDraftItem, CrmProposalDraftItemSchema, CrmProposalDraftSchema, DEFAULT_MIRROR_POLICIES, DELIVERABLE_EXECUTORS, DELIVERABLE_EXECUTOR_LABELS, DELIVERABLE_GOALS, DELIVERABLE_GOAL_LABELS, DELIVERABLE_MODALITIES, DELIVERABLE_MODALITY_LABELS, DIAGNOSTIC_CHANNELS, type DecideProposalDto, DecideProposalSchema, type DeleteVoteDto, DeleteVoteSchema, type DeliverableCategoryDto, DeliverableCategorySchema, type DeliverableExecutor, DeliverableExecutorSchema, type DeliverableGoal, DeliverableGoalSchema, type DeliverableModality, DeliverableModalitySchema, type DeliverableTemplateDto, DeliverableTemplateSchema, type DiagnosticChannel, DiagnosticChannelSchema, type DiagnosticDto, type DiagnosticPreview, type DiagnosticPreviewItem, DiagnosticPreviewItemSchema, DiagnosticPreviewSchema, DiagnosticSchema, ENTITLEMENT_STATUSES, ENTRY_PROFILES, EXECUTION_STATUSES, EXECUTION_STATUS_LABELS, type Entitlement, EntitlementKeySchema, EntitlementSchema, type EntitlementStatus, EntitlementStatusSchema, type EntryProfile, EntryProfileSchema, type EntrySource, EntrySourceSchema, type ExecutionActor, type ExecutionStatus, ExecutionStatusSchema, type ExternalDiagnosticDto, ExternalDiagnosticSchema, type ForgotPasswordDto, ForgotPasswordSchema, type GatewayDomainDto, GatewayDomainSchema, type GatewayOption, GatewayOptionSchema, type InviteProducerAdminDto, InviteProducerAdminSchema, type InviteProducerDto, InviteProducerSchema, type KiwifyConfigDto, KiwifyConfigSchema, type KpiBaseline, KpiBaselineSchema, LEAD_FIELDS, LEAD_TIME_MIN_SAMPLE, type LeadField, type LoginDto, LoginSchema, MASKABLE_FIELDS, METRIC_DIRECTIONS, MIRROR_BLOCKS, MIRROR_PROFILES, type MaskableField, type MetricDirection, MetricDirectionSchema, type MirrorBlock, type MirrorPolicy, MirrorPolicyProfileSchema, MirrorPolicySchema, type MirrorProfile, NEED_TYPES, NEED_TYPE_LABELS, type NeedType, NeedTypeSchema, type Notification, type NotificationActions, type NotificationCategory, type NotificationChannel, type NotificationFilter, type NotificationPriority, type NotificationRow, type NotificationState, type NotificationStatus, type NotificationStore, type NotificationType, OBJECTIVE_STATUSES, OFFER_KINDS, OFFER_KIND_LABELS, ObjectiveDescriptionSchema, type ObjectiveStatus, ObjectiveStatusSchema, type OfferKind, OfferKindSchema, PLAN_FREQUENCIES, PREVIEW_LEAD_TIME_SOURCES, PRODUCER_TERMS_VERSION, PROPOSAL_STATUSES, PROPOSAL_STATUS_LABELS, type PatchFeedbackDto, PatchFeedbackSchema, PhoneSchema, type PlanTier, type PreviewCampaignDto, PreviewCampaignSchema, type ProducerJoinDto, ProducerJoinSchema, type ProposalItemDto, ProposalItemSchema, type ProposalStatus, ProposalStatusSchema, RECURRENCE_INTERVALS, RECURRENCE_INTERVAL_LABELS, RESULT_CHECKPOINTS, RESULT_CHECKPOINT_DAYS, type RecurrenceInterval, RecurrenceIntervalSchema, type RegisterDto, RegisterSchema, type RejectProductDto, RejectProductSchema, type ReopenProductDto, ReopenProductSchema, type RequiredTool, RequiredToolSchema, type ResetPasswordDto, ResetPasswordSchema, type ResultCheckpoint, ResultCheckpointSchema, type ResultMeasurementDto, ResultMeasurementSchema, type ReturnDeliverableDto, ReturnDeliverableSchema, type SaasSubscriptionStatus, SaasSubscriptionStatusSchema, type SaveProposalDto, SaveProposalSchema, type ServiceRequestStatus, ServiceRequestStatusSchema, type SessionExchangeDto, SessionExchangeSchema, type SignServiceRequestDto, SignServiceRequestSchema, type SuggestItemDto, SuggestItemSchema, type SwitchCompanyDto, SwitchCompanySchema, type TimeLogDto, TimeLogSchema, type TokenRequestDto, TokenRequestSchema, type TourProgressDto, TourProgressSchema, URGENCIES, URGENCY_LABELS, UTM_KEYS, type UpdateAccountDto, UpdateAccountSchema, type UpdateCampaignDto, UpdateCampaignSchema, type UpdateCompanyDto, UpdateCompanySchema, type UpdateDeliverableCategoryDto, UpdateDeliverableCategorySchema, type UpdateDeliverableTemplateDto, UpdateDeliverableTemplateSchema, type UpdateEmailDto, UpdateEmailSchema, type UpdateExecutionDto, UpdateExecutionSchema, type UpdateGatewayDomainDto, UpdateGatewayDomainSchema, type UpdateObjectiveStatusDto, UpdateObjectiveStatusSchema, type UpdatePasswordDto, UpdatePasswordSchema, type UpdatePaymentSettingsDto, UpdatePaymentSettingsSchema, type UpdatePlanLinkDto, UpdatePlanLinkSchema, type UpdateProducerDto, UpdateProducerSchema, type UpdateSaasProductDto, UpdateSaasProductSchema, type UpdateUserDto, UpdateUserSchema, type Urgency, UrgencySchema, type UserCompany, type UserPermissions, type UserProfile, type UserRole, type UserStats, VALIDATION_STEPS, VALIDATION_STEP_STATUSES, type ValidationStep, ValidationStepSchema, type ValidationStepState, ValidationStepStateSchema, type VerifyTokenDto, VerifyTokenSchema, type VoteItemDto, VoteItemSchema, brlInputToCents, canTransition, centsToReais, checkTemplateTiming, decodeAttribution, encodeAttribution, entitlementGrantsAccess, formatBRL, formatBRLCompact, hasPermission, isCampaignTouch, isProducer, isSuperAdmin, kpiImproved, maskBRLInput, monthlyCents, readAttributionFromUrl, reaisToCents, toCents, withAttribution };
