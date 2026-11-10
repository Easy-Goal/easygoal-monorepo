// src/types/user-profile.ts
function hasPermission(profile, permission) {
  return profile.access.is_super_admin || profile.access.permissions.includes(permission);
}
function isProducer(profile) {
  return profile.access.is_producer;
}
function isSuperAdmin(profile) {
  return profile.access.is_super_admin;
}

// src/contracts/auth.ts
import { z } from "zod";
var CompleteProfileSchema = z.object({
  has_company: z.boolean(),
  beta_accepted: z.literal(true, {
    errorMap: () => ({ message: "Aceite do Termo Beta \xE9 obrigat\xF3rio para continuar." })
  }),
  name_company: z.string().min(2).optional(),
  cnpj_company: z.string().min(14).max(18).optional(),
  cpf: z.string().min(11).max(14).optional(),
  phone: z.string().optional()
}).refine((d) => !d.has_company || !!d.name_company && !!d.cnpj_company, {
  message: "Nome da empresa e CNPJ s\xE3o obrigat\xF3rios para pessoa jur\xEDdica."
}).refine((d) => d.has_company || !!d.cpf, {
  message: "CPF \xE9 obrigat\xF3rio para pessoa f\xEDsica."
});
var ForgotPasswordSchema = z.object({
  email: z.string().email()
});
var LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
var RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  name_company: z.string().min(2),
  cnpj_company: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  plan_slug: z.string().min(1)
});
var ResetPasswordSchema = z.object({
  token: z.string().min(1),
  new_password: z.string().min(6)
});
var SessionExchangeSchema = z.object({
  access_token: z.string().min(1)
});
var VerifyTokenSchema = z.object({
  token: z.string().min(1)
});
var TokenRequestSchema = z.discriminatedUnion("grant_type", [
  z.object({
    grant_type: z.literal("client_credentials"),
    client_id: z.string().min(1),
    client_secret: z.string().min(1)
  }),
  z.object({
    grant_type: z.literal("password"),
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
    username: z.string().email({ message: "username deve ser um e-mail v\xE1lido" }),
    password: z.string().min(1)
  }),
  z.object({
    grant_type: z.literal("refresh_token"),
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
    refresh_token: z.string().min(1)
  })
]);

// src/contracts/settings.ts
import { z as z2 } from "zod";
var CreateCompanySchema = z2.object({
  name: z2.string().min(1),
  cnpj: z2.string().min(1)
});
var UpdateCompanySchema = z2.object({
  name: z2.string().min(1),
  cnpj: z2.string().optional().nullable(),
  invite_from_name: z2.string().max(100).optional().nullable(),
  invite_from_email: z2.string().email().optional().nullable()
});
var SwitchCompanySchema = z2.object({
  company_id: z2.string().uuid()
});
var UpdateAccountSchema = z2.object({
  name: z2.string().optional(),
  phone_number: z2.string().nullable().optional()
});
var UpdateEmailSchema = z2.object({
  email: z2.string().email(),
  currentPassword: z2.string().min(1)
});
var UpdatePasswordSchema = z2.object({
  currentPassword: z2.string().min(1),
  newPassword: z2.string().min(6)
});
var UpdatePaymentSettingsSchema = z2.object({
  abacatepay_email: z2.string().email().optional(),
  pix_key: z2.string().optional(),
  pix_key_type: z2.string().optional()
});

// src/contracts/marketplace.ts
import { z as z3 } from "zod";
var CreateServiceRequestSchema = z3.object({
  service_id: z3.number().int().positive(),
  chat_data: z3.record(z3.string(), z3.unknown()),
  utm_source: z3.string().optional(),
  utm_medium: z3.string().optional(),
  utm_campaign: z3.string().optional(),
  utm_content: z3.string().optional(),
  referrer_url: z3.string().optional()
});
var SignServiceRequestSchema = z3.object({
  signature_data: z3.string().nullable().optional(),
  signature_name: z3.string().nullable().optional()
});
var CreateCommentSchema = z3.object({
  request_id: z3.string().uuid(),
  content: z3.string().min(1)
});

// src/contracts/saas.ts
import { z as z4 } from "zod";
var VALID_REASONS = [
  "too_expensive",
  "no_longer_needed",
  "found_alternative",
  "technical_issues",
  "poor_support",
  "other"
];
var CancelSubscriptionSchema = z4.object({
  subscription_id: z4.string().uuid(),
  reason: z4.enum(VALID_REASONS, { message: "Motivo inv\xE1lido" }),
  feedback: z4.string().optional()
});
var CreateFeedbackSchema = z4.object({
  content: z4.string().min(1),
  rating: z4.number().int().min(1).max(5).optional(),
  visibility: z4.enum(["public", "producer_only"]).default("public")
});
var InviteProducerSchema = z4.object({
  email: z4.string().email(),
  equity_percent: z4.number().positive(),
  analytics_access: z4.enum(["full", "financial_only"]).default("full"),
  google_email: z4.string().optional().nullable()
});

// src/contracts/admin.ts
import { z as z5 } from "zod";
var GatewayFieldMapSchema = z5.object({
  gateway_name: z5.string(),
  webhook_secret: z5.string().optional(),
  order_id_path: z5.string(),
  customer_email_path: z5.string(),
  amount_path: z5.string(),
  amount_multiplier: z5.union([z5.literal(1), z5.literal(100)]).default(100),
  status_field_path: z5.string(),
  approved_values: z5.array(z5.string()),
  cancelled_values: z5.array(z5.string())
});
var CreateSaasProductSchema = z5.object({
  producer_id: z5.string().uuid().optional().nullable(),
  name: z5.string().min(1, "name \xE9 obrigat\xF3rio").trim(),
  slug: z5.string().min(1, "slug \xE9 obrigat\xF3rio").trim().toLowerCase(),
  description: z5.string().optional().nullable(),
  website_url: z5.string().url().optional().nullable(),
  integration_type: z5.enum(["external", "integrated"]),
  status: z5.enum(["draft", "pending", "approved", "rejected", "suspended"]).default("pending"),
  payment_gateway: z5.enum(["abacatepay", "kiwify", "hotmart", "eduzz", "custom"]).default("kiwify"),
  auth_mode: z5.enum(["platform", "sso_complement", "sso_only"]).default("sso_complement"),
  gateway_management: z5.enum(["platform", "producer"]).default("producer"),
  eg_equity_percent: z5.number().int().min(10).max(50).default(20),
  kiwify_product_id: z5.string().optional().nullable(),
  kiwify_eg_role: z5.enum(["producer", "coproducer", "affiliate"]).optional().nullable(),
  kiwify_client_id: z5.string().optional().nullable(),
  kiwify_client_secret: z5.string().optional().nullable(),
  kiwify_account_id: z5.string().optional().nullable(),
  gateway_field_map: GatewayFieldMapSchema.optional().nullable()
});
var KiwifyConfigSchema = z5.object({
  client_id: z5.string().trim().min(1),
  client_secret: z5.string().trim().min(1),
  account_id: z5.string().trim().min(1).optional()
});
var CreateAdminFeedbackSchema = z5.object({
  type: z5.enum(["admin_note", "adjustment_request"]),
  content: z5.string().min(1, "content \xE9 obrigat\xF3rio").trim(),
  visibility: z5.enum(["admin_only", "producer_only", "public"]).default("admin_only")
});
var PatchFeedbackSchema = z5.object({
  feedback_id: z5.string().uuid(),
  action: z5.enum(["resolve", "approve_hidden", "reject_hidden"]).default("resolve"),
  note: z5.string().optional()
});
var RejectProductSchema = z5.object({
  reason: z5.string().optional()
});
var ReopenProductSchema = z5.object({
  status: z5.enum(["approved", "draft", "pending"]).default("approved")
});
var UpdateSaasProductSchema = z5.object({
  name: z5.string().min(1, "name n\xE3o pode ser vazio").trim().optional(),
  slug: z5.string().min(1, "slug n\xE3o pode ser vazio").trim().toLowerCase().optional(),
  health_check_url: z5.string().url().optional().nullable(),
  health_check_enabled: z5.boolean().optional(),
  ga4_measurement_id: z5.string().regex(/^G-[A-Z0-9]{4,}$/, "Formato esperado: G-XXXXXXXXXX").optional().nullable(),
  ga4_property_id: z5.string().regex(/^\d+$/, "Somente d\xEDgitos (ex: 123456789)").optional().nullable(),
  sso_service_id: z5.number().int().optional().nullable(),
  sso_plan_id: z5.number().int().optional().nullable(),
  api_app_id: z5.string().uuid().optional().nullable(),
  status: z5.enum(["pending", "suspended", "draft"]).optional(),
  category: z5.string().optional().nullable(),
  payment_gateway: z5.enum(["abacatepay", "mercadopago", "kiwify", "hotmart", "eduzz", "custom"]).optional().nullable(),
  auth_mode: z5.enum(["platform", "sso_complement", "sso_only"]).optional().nullable(),
  gateway_management: z5.enum(["platform", "producer"]).optional().nullable(),
  eg_equity_percent: z5.number().int().min(10).max(50).optional(),
  kiwify_product_id: z5.string().optional().nullable(),
  kiwify_eg_role: z5.enum(["producer", "coproducer", "affiliate"]).optional().nullable(),
  kiwify_client_id: z5.string().optional().nullable(),
  kiwify_client_secret: z5.string().optional().nullable(),
  kiwify_account_id: z5.string().optional().nullable(),
  gateway_field_map: GatewayFieldMapSchema.optional().nullable()
}).refine((d) => Object.keys(d).length > 0, { message: "Nenhum campo v\xE1lido para atualizar" });
var CreateProducerSchema = z5.object({
  user_id: z5.string().uuid().optional().nullable(),
  display_name: z5.string().min(1),
  company_name: z5.string().optional().nullable(),
  cnpj: z5.string().optional().nullable(),
  email: z5.string().email().optional().nullable(),
  phone: z5.string().optional().nullable(),
  status: z5.string().optional().default("pending")
});
var UpdateProducerSchema = z5.object({
  user_id: z5.string().uuid().optional().nullable(),
  display_name: z5.string().min(1),
  company_name: z5.string().optional().nullable(),
  cnpj: z5.string().optional().nullable(),
  email: z5.string().email().optional().nullable(),
  phone: z5.string().optional().nullable(),
  status: z5.string().optional()
});
var InviteProducerAdminSchema = z5.object({
  email: z5.string().email(),
  message: z5.string().optional().nullable()
});
var UpdateUserSchema = z5.object({
  name: z5.string().optional(),
  email: z5.string().email().optional(),
  phone_number: z5.string().optional().nullable(),
  role_id: z5.number().int().optional().nullable(),
  company_id: z5.string().uuid().optional(),
  global_plan_slug: z5.string().optional().nullable(),
  original_company_id: z5.string().uuid().optional(),
  original_plan_slug: z5.string().optional().nullable()
});
var BulkDeleteUsersSchema = z5.object({
  userIds: z5.array(z5.string().uuid()).min(1)
});
var TARGET_TYPES = ["all", "rank", "category", "role", "custom"];
var CreateCampaignSchema = z5.object({
  title: z5.string().min(1),
  message: z5.string().min(1),
  action_url: z5.string().optional().nullable(),
  target_type: z5.enum(TARGET_TYPES).optional().default("all"),
  target_ranks: z5.array(z5.any()).optional().nullable(),
  target_roles: z5.array(z5.string()).optional().nullable(),
  target_category: z5.string().optional().nullable(),
  scheduled_for: z5.string().optional().nullable()
});
var UpdateCampaignSchema = z5.object({
  title: z5.string().optional(),
  message: z5.string().optional(),
  action_url: z5.string().optional().nullable(),
  target_type: z5.enum(TARGET_TYPES).optional(),
  target_ranks: z5.array(z5.any()).optional().nullable(),
  target_roles: z5.array(z5.string()).optional().nullable(),
  target_category: z5.string().optional().nullable(),
  scheduled_for: z5.string().optional().nullable(),
  status: z5.enum(["draft", "scheduled", "cancelled"]).optional()
});
var PreviewCampaignSchema = z5.object({
  target_type: z5.string(),
  target_roles: z5.array(z5.string()).optional().nullable(),
  target_category: z5.string().optional().nullable()
});

// src/contracts/community.ts
import { z as z6 } from "zod";
var SuggestItemSchema = z6.object({
  title: z6.string().min(1),
  description: z6.string().optional().nullable(),
  category: z6.string().optional().nullable()
});
var VoteItemSchema = z6.object({
  item_id: z6.string().uuid(),
  vote: z6.union([z6.literal(1), z6.literal(-1)])
});
var DeleteVoteSchema = z6.object({
  item_id: z6.string().uuid()
});
var TourProgressSchema = z6.object({
  last_step: z6.number().int().min(0).default(0)
});

// src/contracts/status.ts
import { z as z7 } from "zod";
var ServiceRequestStatusSchema = z7.enum([
  "collecting",
  "pending_quote",
  "awaiting_signature",
  "awaiting_payment",
  "in_progress",
  "completed",
  "cancelled"
]);
var SaasSubscriptionStatusSchema = z7.enum(["pending", "active", "cancelled", "suspended", "expired", "failed"]);
export {
  BulkDeleteUsersSchema,
  CancelSubscriptionSchema,
  CompleteProfileSchema,
  CreateAdminFeedbackSchema,
  CreateCampaignSchema,
  CreateCommentSchema,
  CreateCompanySchema,
  CreateFeedbackSchema,
  CreateProducerSchema,
  CreateSaasProductSchema,
  CreateServiceRequestSchema,
  DeleteVoteSchema,
  ForgotPasswordSchema,
  InviteProducerAdminSchema,
  InviteProducerSchema,
  KiwifyConfigSchema,
  LoginSchema,
  PatchFeedbackSchema,
  PreviewCampaignSchema,
  RegisterSchema,
  RejectProductSchema,
  ReopenProductSchema,
  ResetPasswordSchema,
  SaasSubscriptionStatusSchema,
  ServiceRequestStatusSchema,
  SessionExchangeSchema,
  SignServiceRequestSchema,
  SuggestItemSchema,
  SwitchCompanySchema,
  TokenRequestSchema,
  TourProgressSchema,
  UpdateAccountSchema,
  UpdateCampaignSchema,
  UpdateCompanySchema,
  UpdateEmailSchema,
  UpdatePasswordSchema,
  UpdatePaymentSettingsSchema,
  UpdateProducerSchema,
  UpdateSaasProductSchema,
  UpdateUserSchema,
  VerifyTokenSchema,
  VoteItemSchema,
  hasPermission,
  isProducer,
  isSuperAdmin
};
//# sourceMappingURL=index.mjs.map