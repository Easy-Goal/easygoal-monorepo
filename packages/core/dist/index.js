"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BulkDeleteUsersSchema: () => BulkDeleteUsersSchema,
  CancelSubscriptionSchema: () => CancelSubscriptionSchema,
  CompleteProfileSchema: () => CompleteProfileSchema,
  CreateAdminFeedbackSchema: () => CreateAdminFeedbackSchema,
  CreateCampaignSchema: () => CreateCampaignSchema,
  CreateCommentSchema: () => CreateCommentSchema,
  CreateCompanySchema: () => CreateCompanySchema,
  CreateFeedbackSchema: () => CreateFeedbackSchema,
  CreateProducerSchema: () => CreateProducerSchema,
  CreateSaasProductSchema: () => CreateSaasProductSchema,
  CreateServiceRequestSchema: () => CreateServiceRequestSchema,
  DeleteVoteSchema: () => DeleteVoteSchema,
  ForgotPasswordSchema: () => ForgotPasswordSchema,
  InviteProducerAdminSchema: () => InviteProducerAdminSchema,
  InviteProducerSchema: () => InviteProducerSchema,
  KiwifyConfigSchema: () => KiwifyConfigSchema,
  LoginSchema: () => LoginSchema,
  PatchFeedbackSchema: () => PatchFeedbackSchema,
  PreviewCampaignSchema: () => PreviewCampaignSchema,
  RegisterSchema: () => RegisterSchema,
  RejectProductSchema: () => RejectProductSchema,
  ReopenProductSchema: () => ReopenProductSchema,
  ResetPasswordSchema: () => ResetPasswordSchema,
  SaasSubscriptionStatusSchema: () => SaasSubscriptionStatusSchema,
  ServiceRequestStatusSchema: () => ServiceRequestStatusSchema,
  SessionExchangeSchema: () => SessionExchangeSchema,
  SignServiceRequestSchema: () => SignServiceRequestSchema,
  SuggestItemSchema: () => SuggestItemSchema,
  SwitchCompanySchema: () => SwitchCompanySchema,
  TokenRequestSchema: () => TokenRequestSchema,
  TourProgressSchema: () => TourProgressSchema,
  UpdateAccountSchema: () => UpdateAccountSchema,
  UpdateCampaignSchema: () => UpdateCampaignSchema,
  UpdateCompanySchema: () => UpdateCompanySchema,
  UpdateEmailSchema: () => UpdateEmailSchema,
  UpdatePasswordSchema: () => UpdatePasswordSchema,
  UpdatePaymentSettingsSchema: () => UpdatePaymentSettingsSchema,
  UpdateProducerSchema: () => UpdateProducerSchema,
  UpdateSaasProductSchema: () => UpdateSaasProductSchema,
  UpdateUserSchema: () => UpdateUserSchema,
  VerifyTokenSchema: () => VerifyTokenSchema,
  VoteItemSchema: () => VoteItemSchema,
  hasPermission: () => hasPermission,
  isProducer: () => isProducer,
  isSuperAdmin: () => isSuperAdmin
});
module.exports = __toCommonJS(index_exports);

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
var import_zod = require("zod");
var CompleteProfileSchema = import_zod.z.object({
  has_company: import_zod.z.boolean(),
  beta_accepted: import_zod.z.literal(true, {
    errorMap: () => ({ message: "Aceite do Termo Beta \xE9 obrigat\xF3rio para continuar." })
  }),
  name_company: import_zod.z.string().min(2).optional(),
  cnpj_company: import_zod.z.string().min(14).max(18).optional(),
  cpf: import_zod.z.string().min(11).max(14).optional(),
  phone: import_zod.z.string().optional()
}).refine((d) => !d.has_company || !!d.name_company && !!d.cnpj_company, {
  message: "Nome da empresa e CNPJ s\xE3o obrigat\xF3rios para pessoa jur\xEDdica."
}).refine((d) => d.has_company || !!d.cpf, {
  message: "CPF \xE9 obrigat\xF3rio para pessoa f\xEDsica."
});
var ForgotPasswordSchema = import_zod.z.object({
  email: import_zod.z.string().email()
});
var LoginSchema = import_zod.z.object({
  email: import_zod.z.string().email(),
  password: import_zod.z.string().min(6)
});
var RegisterSchema = import_zod.z.object({
  email: import_zod.z.string().email(),
  password: import_zod.z.string().min(8),
  name: import_zod.z.string().min(2),
  name_company: import_zod.z.string().min(2),
  cnpj_company: import_zod.z.string().optional(),
  cpf: import_zod.z.string().optional(),
  phone: import_zod.z.string().optional(),
  plan_slug: import_zod.z.string().min(1)
});
var ResetPasswordSchema = import_zod.z.object({
  token: import_zod.z.string().min(1),
  new_password: import_zod.z.string().min(6)
});
var SessionExchangeSchema = import_zod.z.object({
  access_token: import_zod.z.string().min(1)
});
var VerifyTokenSchema = import_zod.z.object({
  token: import_zod.z.string().min(1)
});
var TokenRequestSchema = import_zod.z.discriminatedUnion("grant_type", [
  import_zod.z.object({
    grant_type: import_zod.z.literal("client_credentials"),
    client_id: import_zod.z.string().min(1),
    client_secret: import_zod.z.string().min(1)
  }),
  import_zod.z.object({
    grant_type: import_zod.z.literal("password"),
    client_id: import_zod.z.string().min(1),
    client_secret: import_zod.z.string().min(1),
    username: import_zod.z.string().email({ message: "username deve ser um e-mail v\xE1lido" }),
    password: import_zod.z.string().min(1)
  }),
  import_zod.z.object({
    grant_type: import_zod.z.literal("refresh_token"),
    client_id: import_zod.z.string().min(1),
    client_secret: import_zod.z.string().min(1),
    refresh_token: import_zod.z.string().min(1)
  })
]);

// src/contracts/settings.ts
var import_zod2 = require("zod");
var CreateCompanySchema = import_zod2.z.object({
  name: import_zod2.z.string().min(1),
  cnpj: import_zod2.z.string().min(1)
});
var UpdateCompanySchema = import_zod2.z.object({
  name: import_zod2.z.string().min(1),
  cnpj: import_zod2.z.string().optional().nullable(),
  invite_from_name: import_zod2.z.string().max(100).optional().nullable(),
  invite_from_email: import_zod2.z.string().email().optional().nullable()
});
var SwitchCompanySchema = import_zod2.z.object({
  company_id: import_zod2.z.string().uuid()
});
var UpdateAccountSchema = import_zod2.z.object({
  name: import_zod2.z.string().optional(),
  phone_number: import_zod2.z.string().nullable().optional()
});
var UpdateEmailSchema = import_zod2.z.object({
  email: import_zod2.z.string().email(),
  currentPassword: import_zod2.z.string().min(1)
});
var UpdatePasswordSchema = import_zod2.z.object({
  currentPassword: import_zod2.z.string().min(1),
  newPassword: import_zod2.z.string().min(6)
});
var UpdatePaymentSettingsSchema = import_zod2.z.object({
  abacatepay_email: import_zod2.z.string().email().optional(),
  pix_key: import_zod2.z.string().optional(),
  pix_key_type: import_zod2.z.string().optional()
});

// src/contracts/marketplace.ts
var import_zod3 = require("zod");
var CreateServiceRequestSchema = import_zod3.z.object({
  service_id: import_zod3.z.number().int().positive(),
  chat_data: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()),
  utm_source: import_zod3.z.string().optional(),
  utm_medium: import_zod3.z.string().optional(),
  utm_campaign: import_zod3.z.string().optional(),
  utm_content: import_zod3.z.string().optional(),
  referrer_url: import_zod3.z.string().optional()
});
var SignServiceRequestSchema = import_zod3.z.object({
  signature_data: import_zod3.z.string().nullable().optional(),
  signature_name: import_zod3.z.string().nullable().optional()
});
var CreateCommentSchema = import_zod3.z.object({
  request_id: import_zod3.z.string().uuid(),
  content: import_zod3.z.string().min(1)
});

// src/contracts/saas.ts
var import_zod4 = require("zod");
var VALID_REASONS = [
  "too_expensive",
  "no_longer_needed",
  "found_alternative",
  "technical_issues",
  "poor_support",
  "other"
];
var CancelSubscriptionSchema = import_zod4.z.object({
  subscription_id: import_zod4.z.string().uuid(),
  reason: import_zod4.z.enum(VALID_REASONS, { message: "Motivo inv\xE1lido" }),
  feedback: import_zod4.z.string().optional()
});
var CreateFeedbackSchema = import_zod4.z.object({
  content: import_zod4.z.string().min(1),
  rating: import_zod4.z.number().int().min(1).max(5).optional(),
  visibility: import_zod4.z.enum(["public", "producer_only"]).default("public")
});
var InviteProducerSchema = import_zod4.z.object({
  email: import_zod4.z.string().email(),
  equity_percent: import_zod4.z.number().positive(),
  analytics_access: import_zod4.z.enum(["full", "financial_only"]).default("full"),
  google_email: import_zod4.z.string().optional().nullable()
});

// src/contracts/admin.ts
var import_zod5 = require("zod");
var GatewayFieldMapSchema = import_zod5.z.object({
  gateway_name: import_zod5.z.string(),
  webhook_secret: import_zod5.z.string().optional(),
  order_id_path: import_zod5.z.string(),
  customer_email_path: import_zod5.z.string(),
  amount_path: import_zod5.z.string(),
  amount_multiplier: import_zod5.z.union([import_zod5.z.literal(1), import_zod5.z.literal(100)]).default(100),
  status_field_path: import_zod5.z.string(),
  approved_values: import_zod5.z.array(import_zod5.z.string()),
  cancelled_values: import_zod5.z.array(import_zod5.z.string())
});
var CreateSaasProductSchema = import_zod5.z.object({
  producer_id: import_zod5.z.string().uuid().optional().nullable(),
  name: import_zod5.z.string().min(1, "name \xE9 obrigat\xF3rio").trim(),
  slug: import_zod5.z.string().min(1, "slug \xE9 obrigat\xF3rio").trim().toLowerCase(),
  description: import_zod5.z.string().optional().nullable(),
  website_url: import_zod5.z.string().url().optional().nullable(),
  integration_type: import_zod5.z.enum(["external", "integrated"]),
  status: import_zod5.z.enum(["draft", "pending", "approved", "rejected", "suspended"]).default("pending"),
  payment_gateway: import_zod5.z.enum(["abacatepay", "kiwify", "hotmart", "eduzz", "custom"]).default("kiwify"),
  auth_mode: import_zod5.z.enum(["platform", "sso_complement", "sso_only"]).default("sso_complement"),
  gateway_management: import_zod5.z.enum(["platform", "producer"]).default("producer"),
  eg_equity_percent: import_zod5.z.number().int().min(10).max(50).default(20),
  kiwify_product_id: import_zod5.z.string().optional().nullable(),
  kiwify_eg_role: import_zod5.z.enum(["producer", "coproducer", "affiliate"]).optional().nullable(),
  kiwify_client_id: import_zod5.z.string().optional().nullable(),
  kiwify_client_secret: import_zod5.z.string().optional().nullable(),
  kiwify_account_id: import_zod5.z.string().optional().nullable(),
  gateway_field_map: GatewayFieldMapSchema.optional().nullable()
});
var KiwifyConfigSchema = import_zod5.z.object({
  client_id: import_zod5.z.string().trim().min(1),
  client_secret: import_zod5.z.string().trim().min(1),
  account_id: import_zod5.z.string().trim().min(1).optional()
});
var CreateAdminFeedbackSchema = import_zod5.z.object({
  type: import_zod5.z.enum(["admin_note", "adjustment_request"]),
  content: import_zod5.z.string().min(1, "content \xE9 obrigat\xF3rio").trim(),
  visibility: import_zod5.z.enum(["admin_only", "producer_only", "public"]).default("admin_only")
});
var PatchFeedbackSchema = import_zod5.z.object({
  feedback_id: import_zod5.z.string().uuid(),
  action: import_zod5.z.enum(["resolve", "approve_hidden", "reject_hidden"]).default("resolve"),
  note: import_zod5.z.string().optional()
});
var RejectProductSchema = import_zod5.z.object({
  reason: import_zod5.z.string().optional()
});
var ReopenProductSchema = import_zod5.z.object({
  status: import_zod5.z.enum(["approved", "draft", "pending"]).default("approved")
});
var UpdateSaasProductSchema = import_zod5.z.object({
  name: import_zod5.z.string().min(1, "name n\xE3o pode ser vazio").trim().optional(),
  slug: import_zod5.z.string().min(1, "slug n\xE3o pode ser vazio").trim().toLowerCase().optional(),
  health_check_url: import_zod5.z.string().url().optional().nullable(),
  health_check_enabled: import_zod5.z.boolean().optional(),
  ga4_measurement_id: import_zod5.z.string().regex(/^G-[A-Z0-9]{4,}$/, "Formato esperado: G-XXXXXXXXXX").optional().nullable(),
  ga4_property_id: import_zod5.z.string().regex(/^\d+$/, "Somente d\xEDgitos (ex: 123456789)").optional().nullable(),
  sso_service_id: import_zod5.z.number().int().optional().nullable(),
  sso_plan_id: import_zod5.z.number().int().optional().nullable(),
  api_app_id: import_zod5.z.string().uuid().optional().nullable(),
  status: import_zod5.z.enum(["pending", "suspended", "draft"]).optional(),
  category: import_zod5.z.string().optional().nullable(),
  payment_gateway: import_zod5.z.enum(["abacatepay", "mercadopago", "kiwify", "hotmart", "eduzz", "custom"]).optional().nullable(),
  auth_mode: import_zod5.z.enum(["platform", "sso_complement", "sso_only"]).optional().nullable(),
  gateway_management: import_zod5.z.enum(["platform", "producer"]).optional().nullable(),
  eg_equity_percent: import_zod5.z.number().int().min(10).max(50).optional(),
  kiwify_product_id: import_zod5.z.string().optional().nullable(),
  kiwify_eg_role: import_zod5.z.enum(["producer", "coproducer", "affiliate"]).optional().nullable(),
  kiwify_client_id: import_zod5.z.string().optional().nullable(),
  kiwify_client_secret: import_zod5.z.string().optional().nullable(),
  kiwify_account_id: import_zod5.z.string().optional().nullable(),
  gateway_field_map: GatewayFieldMapSchema.optional().nullable()
}).refine((d) => Object.keys(d).length > 0, { message: "Nenhum campo v\xE1lido para atualizar" });
var CreateProducerSchema = import_zod5.z.object({
  user_id: import_zod5.z.string().uuid().optional().nullable(),
  display_name: import_zod5.z.string().min(1),
  company_name: import_zod5.z.string().optional().nullable(),
  cnpj: import_zod5.z.string().optional().nullable(),
  email: import_zod5.z.string().email().optional().nullable(),
  phone: import_zod5.z.string().optional().nullable(),
  status: import_zod5.z.string().optional().default("pending")
});
var UpdateProducerSchema = import_zod5.z.object({
  user_id: import_zod5.z.string().uuid().optional().nullable(),
  display_name: import_zod5.z.string().min(1),
  company_name: import_zod5.z.string().optional().nullable(),
  cnpj: import_zod5.z.string().optional().nullable(),
  email: import_zod5.z.string().email().optional().nullable(),
  phone: import_zod5.z.string().optional().nullable(),
  status: import_zod5.z.string().optional()
});
var InviteProducerAdminSchema = import_zod5.z.object({
  email: import_zod5.z.string().email(),
  message: import_zod5.z.string().optional().nullable()
});
var UpdateUserSchema = import_zod5.z.object({
  name: import_zod5.z.string().optional(),
  email: import_zod5.z.string().email().optional(),
  phone_number: import_zod5.z.string().optional().nullable(),
  role_id: import_zod5.z.number().int().optional().nullable(),
  company_id: import_zod5.z.string().uuid().optional(),
  global_plan_slug: import_zod5.z.string().optional().nullable(),
  original_company_id: import_zod5.z.string().uuid().optional(),
  original_plan_slug: import_zod5.z.string().optional().nullable()
});
var BulkDeleteUsersSchema = import_zod5.z.object({
  userIds: import_zod5.z.array(import_zod5.z.string().uuid()).min(1)
});
var TARGET_TYPES = ["all", "rank", "category", "role", "custom"];
var CreateCampaignSchema = import_zod5.z.object({
  title: import_zod5.z.string().min(1),
  message: import_zod5.z.string().min(1),
  action_url: import_zod5.z.string().optional().nullable(),
  target_type: import_zod5.z.enum(TARGET_TYPES).optional().default("all"),
  target_ranks: import_zod5.z.array(import_zod5.z.any()).optional().nullable(),
  target_roles: import_zod5.z.array(import_zod5.z.string()).optional().nullable(),
  target_category: import_zod5.z.string().optional().nullable(),
  scheduled_for: import_zod5.z.string().optional().nullable()
});
var UpdateCampaignSchema = import_zod5.z.object({
  title: import_zod5.z.string().optional(),
  message: import_zod5.z.string().optional(),
  action_url: import_zod5.z.string().optional().nullable(),
  target_type: import_zod5.z.enum(TARGET_TYPES).optional(),
  target_ranks: import_zod5.z.array(import_zod5.z.any()).optional().nullable(),
  target_roles: import_zod5.z.array(import_zod5.z.string()).optional().nullable(),
  target_category: import_zod5.z.string().optional().nullable(),
  scheduled_for: import_zod5.z.string().optional().nullable(),
  status: import_zod5.z.enum(["draft", "scheduled", "cancelled"]).optional()
});
var PreviewCampaignSchema = import_zod5.z.object({
  target_type: import_zod5.z.string(),
  target_roles: import_zod5.z.array(import_zod5.z.string()).optional().nullable(),
  target_category: import_zod5.z.string().optional().nullable()
});

// src/contracts/community.ts
var import_zod6 = require("zod");
var SuggestItemSchema = import_zod6.z.object({
  title: import_zod6.z.string().min(1),
  description: import_zod6.z.string().optional().nullable(),
  category: import_zod6.z.string().optional().nullable()
});
var VoteItemSchema = import_zod6.z.object({
  item_id: import_zod6.z.string().uuid(),
  vote: import_zod6.z.union([import_zod6.z.literal(1), import_zod6.z.literal(-1)])
});
var DeleteVoteSchema = import_zod6.z.object({
  item_id: import_zod6.z.string().uuid()
});
var TourProgressSchema = import_zod6.z.object({
  last_step: import_zod6.z.number().int().min(0).default(0)
});

// src/contracts/status.ts
var import_zod7 = require("zod");
var ServiceRequestStatusSchema = import_zod7.z.enum([
  "collecting",
  "pending_quote",
  "awaiting_signature",
  "awaiting_payment",
  "in_progress",
  "completed",
  "cancelled"
]);
var SaasSubscriptionStatusSchema = import_zod7.z.enum(["pending", "active", "cancelled", "suspended", "expired", "failed"]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map