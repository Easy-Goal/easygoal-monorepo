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
}, "strip", z.ZodTypeAny, {
    name: string;
    checkout_url: string;
    description?: string | undefined;
    price?: number | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | undefined;
    plan_type?: string | undefined;
    position?: number | undefined;
    is_sandbox?: boolean | undefined;
}, {
    name: string;
    checkout_url: string;
    description?: string | undefined;
    price?: number | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | undefined;
    plan_type?: string | undefined;
    position?: number | undefined;
    is_sandbox?: boolean | undefined;
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
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
    is_active?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
    is_active?: boolean | undefined;
}>, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
    is_active?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    checkout_url?: string | undefined;
    price?: number | null | undefined;
    frequency?: "monthly" | "quarterly" | "yearly" | "one_time" | null | undefined;
    position?: number | undefined;
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
declare const COMMERCE_EVENT_TYPES: readonly ["sale.approved", "sale.refunded", "sale.chargeback", "subscription.started", "subscription.renewed", "subscription.past_due", "subscription.canceled"];
declare const CommerceEventTypeSchema: z.ZodEnum<["sale.approved", "sale.refunded", "sale.chargeback", "subscription.started", "subscription.renewed", "subscription.past_due", "subscription.canceled"]>;
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
    type: z.ZodEnum<["sale.approved", "sale.refunded", "sale.chargeback", "subscription.started", "subscription.renewed", "subscription.past_due", "subscription.canceled"]>;
    verification: z.ZodEnum<["verified", "unverified"]>;
    occurred_at: z.ZodString;
    amount_cents: z.ZodNullable<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodString>;
    customer_email: z.ZodNullable<z.ZodString>;
    user_id: z.ZodNullable<z.ZodString>;
    plan_id: z.ZodNullable<z.ZodString>;
    eg_ref: z.ZodNullable<z.ZodString>;
    received_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "sale.approved" | "sale.refunded" | "sale.chargeback" | "subscription.started" | "subscription.renewed" | "subscription.past_due" | "subscription.canceled";
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
}, {
    type: "sale.approved" | "sale.refunded" | "sale.chargeback" | "subscription.started" | "subscription.renewed" | "subscription.past_due" | "subscription.canceled";
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
    saas_product_id: string;
    entitlement_key: string;
    valid_until: string | null;
    source_event_id: string;
    updated_at: string;
}, {
    status: "active" | "past_due" | "canceled" | "refunded";
    user_id: string;
    saas_product_id: string;
    entitlement_key: string;
    valid_until: string | null;
    source_event_id: string;
    updated_at: string;
}>;
type Entitlement = z.infer<typeof EntitlementSchema>;
/** Estados que liberam o SaaS. `past_due` mantém acesso até o gateway cancelar. */
declare function entitlementGrantsAccess(status: EntitlementStatus): boolean;

export { ATTRIBUTION_MAX_LENGTH, ATTRIBUTION_PARAM, type AttributionTouch, AttributionTouchSchema, type BulkDeleteUsersDto, BulkDeleteUsersSchema, type BuyerJoinDto, BuyerJoinSchema, CLICK_ID_KEYS, COMMERCE_EVENT_TYPES, COMMERCE_EVENT_VERIFICATION, COMMERCE_GATEWAYS, COMMERCE_REF_PARAM, type CancelSubscriptionDto, CancelSubscriptionSchema, type CommerceEvent, CommerceEventSchema, type CommerceEventType, CommerceEventTypeSchema, CommerceEventVerificationSchema, type CommerceGateway, CommerceGatewaySchema, type CompleteProfileDto, CompleteProfileSchema, type CreateAdminFeedbackDto, CreateAdminFeedbackSchema, type CreateCampaignDto, CreateCampaignSchema, type CreateCommentDto, CreateCommentSchema, type CreateCompanyDto, CreateCompanySchema, type CreateFeedbackDto, CreateFeedbackSchema, type CreateNotificationPayload, type CreateObjectiveDto, CreateObjectiveSchema, type CreatePlanLinkDto, CreatePlanLinkSchema, type CreateProducerDto, CreateProducerSchema, type CreateSaasProductDto, CreateSaasProductSchema, type CreateServiceRequestDto, CreateServiceRequestSchema, type DeleteVoteDto, DeleteVoteSchema, ENTITLEMENT_STATUSES, ENTRY_PROFILES, type Entitlement, EntitlementSchema, type EntitlementStatus, EntitlementStatusSchema, type EntryProfile, EntryProfileSchema, type EntrySource, EntrySourceSchema, type ForgotPasswordDto, ForgotPasswordSchema, type GatewayDomainDto, GatewayDomainSchema, type InviteProducerAdminDto, InviteProducerAdminSchema, type InviteProducerDto, InviteProducerSchema, type KiwifyConfigDto, KiwifyConfigSchema, type LoginDto, LoginSchema, type Notification, type NotificationActions, type NotificationCategory, type NotificationChannel, type NotificationFilter, type NotificationPriority, type NotificationRow, type NotificationState, type NotificationStatus, type NotificationStore, type NotificationType, OBJECTIVE_STATUSES, ObjectiveDescriptionSchema, type ObjectiveStatus, ObjectiveStatusSchema, PLAN_FREQUENCIES, PRODUCER_TERMS_VERSION, type PatchFeedbackDto, PatchFeedbackSchema, PhoneSchema, type PlanTier, type PreviewCampaignDto, PreviewCampaignSchema, type ProducerJoinDto, ProducerJoinSchema, type RegisterDto, RegisterSchema, type RejectProductDto, RejectProductSchema, type ReopenProductDto, ReopenProductSchema, type ResetPasswordDto, ResetPasswordSchema, type SaasSubscriptionStatus, SaasSubscriptionStatusSchema, type ServiceRequestStatus, ServiceRequestStatusSchema, type SessionExchangeDto, SessionExchangeSchema, type SignServiceRequestDto, SignServiceRequestSchema, type SuggestItemDto, SuggestItemSchema, type SwitchCompanyDto, SwitchCompanySchema, type TokenRequestDto, TokenRequestSchema, type TourProgressDto, TourProgressSchema, UTM_KEYS, type UpdateAccountDto, UpdateAccountSchema, type UpdateCampaignDto, UpdateCampaignSchema, type UpdateCompanyDto, UpdateCompanySchema, type UpdateEmailDto, UpdateEmailSchema, type UpdateGatewayDomainDto, UpdateGatewayDomainSchema, type UpdateObjectiveStatusDto, UpdateObjectiveStatusSchema, type UpdatePasswordDto, UpdatePasswordSchema, type UpdatePaymentSettingsDto, UpdatePaymentSettingsSchema, type UpdatePlanLinkDto, UpdatePlanLinkSchema, type UpdateProducerDto, UpdateProducerSchema, type UpdateSaasProductDto, UpdateSaasProductSchema, type UpdateUserDto, UpdateUserSchema, type UserCompany, type UserPermissions, type UserProfile, type UserRole, type UserStats, type VerifyTokenDto, VerifyTokenSchema, type VoteItemDto, VoteItemSchema, decodeAttribution, encodeAttribution, entitlementGrantsAccess, hasPermission, isCampaignTouch, isProducer, isSuperAdmin, readAttributionFromUrl, withAttribution };
