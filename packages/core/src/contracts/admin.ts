import { z } from 'zod';

const GatewayFieldMapSchema = z.object({
  gateway_name: z.string(),
  webhook_secret: z.string().optional(),
  order_id_path: z.string(),
  customer_email_path: z.string(),
  amount_path: z.string(),
  amount_multiplier: z.union([z.literal(1), z.literal(100)]).default(100),
  status_field_path: z.string(),
  approved_values: z.array(z.string()),
  cancelled_values: z.array(z.string()),
});

export const CreateSaasProductSchema = z.object({
  producer_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1, 'name é obrigatório').trim(),
  slug: z.string().min(1, 'slug é obrigatório').trim().toLowerCase(),
  description: z.string().optional().nullable(),
  website_url: z.string().url().optional().nullable(),
  integration_type: z.enum(['external', 'integrated']),
  status: z.enum(['draft', 'pending', 'approved', 'rejected', 'suspended']).default('pending'),
  payment_gateway: z.enum(['abacatepay', 'kiwify', 'hotmart', 'eduzz', 'custom']).default('kiwify'),
  auth_mode: z.enum(['platform', 'sso_complement', 'sso_only']).default('sso_complement'),
  gateway_management: z.enum(['platform', 'producer']).default('producer'),
  eg_equity_percent: z.number().int().min(10).max(50).default(20),
  kiwify_product_id: z.string().optional().nullable(),
  kiwify_eg_role: z.enum(['producer', 'coproducer', 'affiliate']).optional().nullable(),
  kiwify_client_id: z.string().optional().nullable(),
  kiwify_client_secret: z.string().optional().nullable(),
  kiwify_account_id: z.string().optional().nullable(),
  gateway_field_map: GatewayFieldMapSchema.optional().nullable(),
});

export type CreateSaasProductDto = z.infer<typeof CreateSaasProductSchema>;

export const KiwifyConfigSchema = z.object({
  client_id: z.string().trim().min(1),
  client_secret: z.string().trim().min(1),
  account_id: z.string().trim().min(1).optional(),
});
export type KiwifyConfigDto = z.infer<typeof KiwifyConfigSchema>;

export const CreateAdminFeedbackSchema = z.object({
  type: z.enum(['admin_note', 'adjustment_request']),
  content: z.string().min(1, 'content é obrigatório').trim(),
  visibility: z.enum(['admin_only', 'producer_only', 'public']).default('admin_only'),
});
export type CreateAdminFeedbackDto = z.infer<typeof CreateAdminFeedbackSchema>;

export const PatchFeedbackSchema = z.object({
  feedback_id: z.string().uuid(),
  action: z.enum(['resolve', 'approve_hidden', 'reject_hidden']).default('resolve'),
  note: z.string().optional(),
});
export type PatchFeedbackDto = z.infer<typeof PatchFeedbackSchema>;

export const RejectProductSchema = z.object({
  reason: z.string().optional(),
});
export type RejectProductDto = z.infer<typeof RejectProductSchema>;

export const ReopenProductSchema = z.object({
  status: z.enum(['approved', 'draft', 'pending']).default('approved'),
});
export type ReopenProductDto = z.infer<typeof ReopenProductSchema>;

export const UpdateSaasProductSchema = z.object({
  name: z.string().min(1, 'name não pode ser vazio').trim().optional(),
  slug: z.string().min(1, 'slug não pode ser vazio').trim().toLowerCase().optional(),
  health_check_url: z.string().url().optional().nullable(),
  health_check_enabled: z.boolean().optional(),
  ga4_measurement_id: z.string().regex(/^G-[A-Z0-9]{4,}$/, 'Formato esperado: G-XXXXXXXXXX').optional().nullable(),
  ga4_property_id: z.string().regex(/^\d+$/, 'Somente dígitos (ex: 123456789)').optional().nullable(),
  sso_service_id: z.number().int().optional().nullable(),
  sso_plan_id: z.number().int().optional().nullable(),
  api_app_id: z.string().uuid().optional().nullable(),
  status: z.enum(['pending', 'suspended', 'draft']).optional(),
  category: z.string().optional().nullable(),
  payment_gateway: z.enum(['abacatepay', 'mercadopago', 'kiwify', 'hotmart', 'eduzz', 'custom']).optional().nullable(),
  auth_mode: z.enum(['platform', 'sso_complement', 'sso_only']).optional().nullable(),
  gateway_management: z.enum(['platform', 'producer']).optional().nullable(),
  eg_equity_percent: z.number().int().min(10).max(50).optional(),
  kiwify_product_id: z.string().optional().nullable(),
  kiwify_eg_role: z.enum(['producer', 'coproducer', 'affiliate']).optional().nullable(),
  kiwify_client_id: z.string().optional().nullable(),
  kiwify_client_secret: z.string().optional().nullable(),
  kiwify_account_id: z.string().optional().nullable(),
  gateway_field_map: GatewayFieldMapSchema.optional().nullable(),
}).refine((d) => Object.keys(d).length > 0, { message: 'Nenhum campo válido para atualizar' });

export type UpdateSaasProductDto = z.infer<typeof UpdateSaasProductSchema>;

export const CreateProducerSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  display_name: z.string().min(1),
  company_name: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.string().optional().default('pending'),
});

export type CreateProducerDto = z.infer<typeof CreateProducerSchema>;

export const UpdateProducerSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  display_name: z.string().min(1),
  company_name: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  status: z.string().optional(),
});

export type UpdateProducerDto = z.infer<typeof UpdateProducerSchema>;

export const InviteProducerAdminSchema = z.object({
  email: z.string().email(),
  message: z.string().optional().nullable(),
});

export type InviteProducerAdminDto = z.infer<typeof InviteProducerAdminSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone_number: z.string().optional().nullable(),
  role_id: z.number().int().optional().nullable(),
  company_id: z.string().uuid().optional(),
  global_plan_slug: z.string().optional().nullable(),
  original_company_id: z.string().uuid().optional(),
  original_plan_slug: z.string().optional().nullable(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const BulkDeleteUsersSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1),
});

export type BulkDeleteUsersDto = z.infer<typeof BulkDeleteUsersSchema>;

const TARGET_TYPES = ['all', 'rank', 'category', 'role', 'custom'] as const;

export const CreateCampaignSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  action_url: z.string().optional().nullable(),
  target_type: z.enum(TARGET_TYPES).optional().default('all'),
  target_ranks: z.array(z.any()).optional().nullable(),
  target_roles: z.array(z.string()).optional().nullable(),
  target_category: z.string().optional().nullable(),
  scheduled_for: z.string().optional().nullable(),
});
export type CreateCampaignDto = z.infer<typeof CreateCampaignSchema>;

export const UpdateCampaignSchema = z.object({
  title: z.string().optional(),
  message: z.string().optional(),
  action_url: z.string().optional().nullable(),
  target_type: z.enum(TARGET_TYPES).optional(),
  target_ranks: z.array(z.any()).optional().nullable(),
  target_roles: z.array(z.string()).optional().nullable(),
  target_category: z.string().optional().nullable(),
  scheduled_for: z.string().optional().nullable(),
  status: z.enum(['draft', 'scheduled', 'cancelled']).optional(),
});
export type UpdateCampaignDto = z.infer<typeof UpdateCampaignSchema>;

export const PreviewCampaignSchema = z.object({
  target_type: z.string(),
  target_roles: z.array(z.string()).optional().nullable(),
  target_category: z.string().optional().nullable(),
});
export type PreviewCampaignDto = z.infer<typeof PreviewCampaignSchema>;
