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
  ATTRIBUTION_MAX_LENGTH: () => ATTRIBUTION_MAX_LENGTH,
  ATTRIBUTION_PARAM: () => ATTRIBUTION_PARAM,
  AttributionTouchSchema: () => AttributionTouchSchema,
  BulkDeleteUsersSchema: () => BulkDeleteUsersSchema,
  BuyerJoinSchema: () => BuyerJoinSchema,
  CLICK_ID_KEYS: () => CLICK_ID_KEYS,
  COMMERCE_EVENT_TYPES: () => COMMERCE_EVENT_TYPES,
  COMMERCE_EVENT_VERIFICATION: () => COMMERCE_EVENT_VERIFICATION,
  COMMERCE_GATEWAYS: () => COMMERCE_GATEWAYS,
  COMMERCE_REF_PARAM: () => COMMERCE_REF_PARAM,
  CancelSubscriptionSchema: () => CancelSubscriptionSchema,
  CommerceEventSchema: () => CommerceEventSchema,
  CommerceEventTypeSchema: () => CommerceEventTypeSchema,
  CommerceEventVerificationSchema: () => CommerceEventVerificationSchema,
  CommerceGatewaySchema: () => CommerceGatewaySchema,
  CompleteProfileSchema: () => CompleteProfileSchema,
  CreateAdminFeedbackSchema: () => CreateAdminFeedbackSchema,
  CreateCampaignSchema: () => CreateCampaignSchema,
  CreateCommentSchema: () => CreateCommentSchema,
  CreateCompanySchema: () => CreateCompanySchema,
  CreateFeedbackSchema: () => CreateFeedbackSchema,
  CreateObjectiveSchema: () => CreateObjectiveSchema,
  CreatePlanLinkSchema: () => CreatePlanLinkSchema,
  CreateProducerSchema: () => CreateProducerSchema,
  CreateSaasProductSchema: () => CreateSaasProductSchema,
  CreateServiceRequestSchema: () => CreateServiceRequestSchema,
  DeleteVoteSchema: () => DeleteVoteSchema,
  ENTITLEMENT_STATUSES: () => ENTITLEMENT_STATUSES,
  ENTRY_PROFILES: () => ENTRY_PROFILES,
  EntitlementSchema: () => EntitlementSchema,
  EntitlementStatusSchema: () => EntitlementStatusSchema,
  EntryProfileSchema: () => EntryProfileSchema,
  EntrySourceSchema: () => EntrySourceSchema,
  ForgotPasswordSchema: () => ForgotPasswordSchema,
  GatewayDomainSchema: () => GatewayDomainSchema,
  InviteProducerAdminSchema: () => InviteProducerAdminSchema,
  InviteProducerSchema: () => InviteProducerSchema,
  KiwifyConfigSchema: () => KiwifyConfigSchema,
  LoginSchema: () => LoginSchema,
  OBJECTIVE_STATUSES: () => OBJECTIVE_STATUSES,
  ObjectiveDescriptionSchema: () => ObjectiveDescriptionSchema,
  ObjectiveStatusSchema: () => ObjectiveStatusSchema,
  PLAN_FREQUENCIES: () => PLAN_FREQUENCIES,
  PRODUCER_TERMS_VERSION: () => PRODUCER_TERMS_VERSION,
  PatchFeedbackSchema: () => PatchFeedbackSchema,
  PhoneSchema: () => PhoneSchema,
  PreviewCampaignSchema: () => PreviewCampaignSchema,
  ProducerJoinSchema: () => ProducerJoinSchema,
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
  UTM_KEYS: () => UTM_KEYS,
  UpdateAccountSchema: () => UpdateAccountSchema,
  UpdateCampaignSchema: () => UpdateCampaignSchema,
  UpdateCompanySchema: () => UpdateCompanySchema,
  UpdateEmailSchema: () => UpdateEmailSchema,
  UpdateGatewayDomainSchema: () => UpdateGatewayDomainSchema,
  UpdateObjectiveStatusSchema: () => UpdateObjectiveStatusSchema,
  UpdatePasswordSchema: () => UpdatePasswordSchema,
  UpdatePaymentSettingsSchema: () => UpdatePaymentSettingsSchema,
  UpdatePlanLinkSchema: () => UpdatePlanLinkSchema,
  UpdateProducerSchema: () => UpdateProducerSchema,
  UpdateSaasProductSchema: () => UpdateSaasProductSchema,
  UpdateUserSchema: () => UpdateUserSchema,
  VerifyTokenSchema: () => VerifyTokenSchema,
  VoteItemSchema: () => VoteItemSchema,
  decodeAttribution: () => decodeAttribution,
  encodeAttribution: () => encodeAttribution,
  entitlementGrantsAccess: () => entitlementGrantsAccess,
  hasPermission: () => hasPermission,
  isCampaignTouch: () => isCampaignTouch,
  isProducer: () => isProducer,
  isSuperAdmin: () => isSuperAdmin,
  readAttributionFromUrl: () => readAttributionFromUrl,
  withAttribution: () => withAttribution
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
  // Opcional desde o ADR 072: o cadastro não escolhe plano.
  plan_slug: import_zod.z.string().min(1).optional()
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

// src/contracts/join.ts
var import_zod8 = require("zod");
var PhoneSchema = import_zod8.z.string().trim().regex(/^(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}$/, "Telefone inv\xE1lido");
var EntrySourceSchema = import_zod8.z.object({
  utm_source: import_zod8.z.string().trim().max(200).optional(),
  utm_medium: import_zod8.z.string().trim().max(200).optional(),
  utm_campaign: import_zod8.z.string().trim().max(200).optional(),
  utm_content: import_zod8.z.string().trim().max(200).optional(),
  utm_term: import_zod8.z.string().trim().max(200).optional(),
  referrer: import_zod8.z.string().trim().max(500).optional(),
  landing: import_zod8.z.string().trim().max(500).optional(),
  first_touch_at: import_zod8.z.string().datetime().optional()
}).strict();
var ENTRY_PROFILES = ["comprador", "builder"];
var EntryProfileSchema = import_zod8.z.enum(ENTRY_PROFILES);
var PRODUCER_TERMS_VERSION = "2.0";
var ProducerJoinSchema = import_zod8.z.object({
  terms_version: import_zod8.z.literal(PRODUCER_TERMS_VERSION),
  phone: PhoneSchema,
  source: EntrySourceSchema.optional()
});
var ObjectiveDescriptionSchema = import_zod8.z.string().trim().min(10, "Descreva o objetivo com pelo menos 10 caracteres").max(2e3, "Use no m\xE1ximo 2.000 caracteres");
var BuyerJoinSchema = import_zod8.z.object({
  phone: PhoneSchema,
  objective: ObjectiveDescriptionSchema,
  source: EntrySourceSchema.optional()
});
var OBJECTIVE_STATUSES = ["new", "in_review", "proposal_sent", "closed"];
var ObjectiveStatusSchema = import_zod8.z.enum(OBJECTIVE_STATUSES);
var CreateObjectiveSchema = import_zod8.z.object({
  description: ObjectiveDescriptionSchema
});
var UpdateObjectiveStatusSchema = import_zod8.z.object({
  status: ObjectiveStatusSchema
});
var PLAN_FREQUENCIES = ["monthly", "quarterly", "yearly", "one_time"];
var CheckoutUrlSchema = import_zod8.z.string().trim().max(2e3).url("Link inv\xE1lido").refine((value) => value.startsWith("https://"), "O link precisa come\xE7ar com https://");
var CreatePlanLinkSchema = import_zod8.z.object({
  name: import_zod8.z.string().trim().min(1).max(120),
  checkout_url: CheckoutUrlSchema,
  description: import_zod8.z.string().trim().max(500).optional(),
  price: import_zod8.z.number().positive().optional(),
  frequency: import_zod8.z.enum(PLAN_FREQUENCIES).optional(),
  plan_type: import_zod8.z.string().trim().max(40).optional(),
  position: import_zod8.z.number().int().min(0).optional(),
  is_sandbox: import_zod8.z.boolean().optional()
});
var UpdatePlanLinkSchema = import_zod8.z.object({
  name: import_zod8.z.string().trim().min(1).max(120),
  checkout_url: CheckoutUrlSchema,
  description: import_zod8.z.string().trim().max(500).nullable(),
  price: import_zod8.z.number().positive().nullable(),
  frequency: import_zod8.z.enum(PLAN_FREQUENCIES).nullable(),
  position: import_zod8.z.number().int().min(0),
  is_active: import_zod8.z.boolean()
}).partial().refine((value) => Object.keys(value).length > 0, "Nenhum campo para atualizar");
var GatewayDomainSchema = import_zod8.z.object({
  domain: import_zod8.z.string().trim().toLowerCase().max(253).regex(/^(?!-)[a-z0-9-]{1,63}(\.(?!-)[a-z0-9-]{1,63})+$/, "Dom\xEDnio inv\xE1lido"),
  gateway: import_zod8.z.string().trim().min(1).max(60),
  is_active: import_zod8.z.boolean().optional()
});
var UpdateGatewayDomainSchema = GatewayDomainSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Nenhum campo para atualizar"
);

// src/contracts/attribution.ts
var import_zod9 = require("zod");
var ATTRIBUTION_PARAM = "att";
var ATTRIBUTION_MAX_LENGTH = 2048;
var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
var CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "ttclid", "msclkid"];
var shortText = import_zod9.z.string().trim().min(1).max(200);
var longText = import_zod9.z.string().trim().min(1).max(500);
var AttributionTouchSchema = import_zod9.z.object({
  utm_source: shortText.optional(),
  utm_medium: shortText.optional(),
  utm_campaign: shortText.optional(),
  utm_content: shortText.optional(),
  utm_term: shortText.optional(),
  gclid: shortText.optional(),
  gbraid: shortText.optional(),
  wbraid: shortText.optional(),
  fbclid: shortText.optional(),
  ttclid: shortText.optional(),
  msclkid: shortText.optional(),
  referrer: longText.optional(),
  landing: longText.optional(),
  at: import_zod9.z.string().datetime()
}).strip();
function isCampaignTouch(touch) {
  return [...UTM_KEYS, ...CLICK_ID_KEYS].some((key) => Boolean(touch[key]));
}
function readAttributionFromUrl(pageUrl, options = {}) {
  let url;
  try {
    url = new URL(pageUrl);
  } catch {
    return null;
  }
  const raw = {};
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = url.searchParams.get(key);
    if (value) raw[key] = value;
  }
  if (Object.keys(raw).length === 0) return null;
  raw.landing = `${url.origin}${url.pathname}`;
  if (options.referrer) raw.referrer = options.referrer;
  raw.at = (options.now ?? /* @__PURE__ */ new Date()).toISOString();
  const parsed = AttributionTouchSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}
function encodeAttribution(touch) {
  const value = JSON.stringify(touch);
  return value.length <= ATTRIBUTION_MAX_LENGTH ? value : "";
}
function decodeAttribution(value) {
  if (!value || value.length > ATTRIBUTION_MAX_LENGTH) return null;
  try {
    const parsed = AttributionTouchSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
function withAttribution(loginUrl, touch) {
  if (!touch) return loginUrl;
  const encoded = encodeAttribution(touch);
  if (!encoded) return loginUrl;
  const url = new URL(loginUrl);
  url.searchParams.set(ATTRIBUTION_PARAM, encoded);
  return url.toString();
}

// src/contracts/commerce.ts
var import_zod10 = require("zod");
var COMMERCE_GATEWAYS = ["abacatepay", "kiwify", "hotmart", "mercadopago", "custom"];
var CommerceGatewaySchema = import_zod10.z.enum(COMMERCE_GATEWAYS);
var COMMERCE_EVENT_TYPES = [
  "sale.approved",
  "sale.refunded",
  "sale.chargeback",
  "subscription.started",
  "subscription.renewed",
  "subscription.past_due",
  "subscription.canceled"
];
var CommerceEventTypeSchema = import_zod10.z.enum(COMMERCE_EVENT_TYPES);
var COMMERCE_EVENT_VERIFICATION = ["verified", "unverified"];
var CommerceEventVerificationSchema = import_zod10.z.enum(COMMERCE_EVENT_VERIFICATION);
var COMMERCE_REF_PARAM = "eg_ref";
var CommerceEventSchema = import_zod10.z.object({
  id: import_zod10.z.string().uuid(),
  saas_product_id: import_zod10.z.string().uuid(),
  gateway: CommerceGatewaySchema,
  gateway_event_id: import_zod10.z.string().min(1).max(200),
  type: CommerceEventTypeSchema,
  verification: CommerceEventVerificationSchema,
  occurred_at: import_zod10.z.string().datetime(),
  amount_cents: import_zod10.z.number().int().nullable(),
  currency: import_zod10.z.string().length(3).default("BRL"),
  customer_email: import_zod10.z.string().email().nullable(),
  user_id: import_zod10.z.string().uuid().nullable(),
  plan_id: import_zod10.z.string().uuid().nullable(),
  eg_ref: import_zod10.z.string().max(200).nullable(),
  received_at: import_zod10.z.string().datetime()
});
var ENTITLEMENT_STATUSES = ["active", "past_due", "canceled", "refunded"];
var EntitlementStatusSchema = import_zod10.z.enum(ENTITLEMENT_STATUSES);
var EntitlementSchema = import_zod10.z.object({
  user_id: import_zod10.z.string().uuid(),
  saas_product_id: import_zod10.z.string().uuid(),
  entitlement_key: import_zod10.z.string().regex(/^[a-z0-9_]{2,60}$/),
  status: EntitlementStatusSchema,
  valid_until: import_zod10.z.string().datetime().nullable(),
  source_event_id: import_zod10.z.string().uuid(),
  updated_at: import_zod10.z.string().datetime()
});
function entitlementGrantsAccess(status) {
  return status === "active" || status === "past_due";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ATTRIBUTION_MAX_LENGTH,
  ATTRIBUTION_PARAM,
  AttributionTouchSchema,
  BulkDeleteUsersSchema,
  BuyerJoinSchema,
  CLICK_ID_KEYS,
  COMMERCE_EVENT_TYPES,
  COMMERCE_EVENT_VERIFICATION,
  COMMERCE_GATEWAYS,
  COMMERCE_REF_PARAM,
  CancelSubscriptionSchema,
  CommerceEventSchema,
  CommerceEventTypeSchema,
  CommerceEventVerificationSchema,
  CommerceGatewaySchema,
  CompleteProfileSchema,
  CreateAdminFeedbackSchema,
  CreateCampaignSchema,
  CreateCommentSchema,
  CreateCompanySchema,
  CreateFeedbackSchema,
  CreateObjectiveSchema,
  CreatePlanLinkSchema,
  CreateProducerSchema,
  CreateSaasProductSchema,
  CreateServiceRequestSchema,
  DeleteVoteSchema,
  ENTITLEMENT_STATUSES,
  ENTRY_PROFILES,
  EntitlementSchema,
  EntitlementStatusSchema,
  EntryProfileSchema,
  EntrySourceSchema,
  ForgotPasswordSchema,
  GatewayDomainSchema,
  InviteProducerAdminSchema,
  InviteProducerSchema,
  KiwifyConfigSchema,
  LoginSchema,
  OBJECTIVE_STATUSES,
  ObjectiveDescriptionSchema,
  ObjectiveStatusSchema,
  PLAN_FREQUENCIES,
  PRODUCER_TERMS_VERSION,
  PatchFeedbackSchema,
  PhoneSchema,
  PreviewCampaignSchema,
  ProducerJoinSchema,
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
  UTM_KEYS,
  UpdateAccountSchema,
  UpdateCampaignSchema,
  UpdateCompanySchema,
  UpdateEmailSchema,
  UpdateGatewayDomainSchema,
  UpdateObjectiveStatusSchema,
  UpdatePasswordSchema,
  UpdatePaymentSettingsSchema,
  UpdatePlanLinkSchema,
  UpdateProducerSchema,
  UpdateSaasProductSchema,
  UpdateUserSchema,
  VerifyTokenSchema,
  VoteItemSchema,
  decodeAttribution,
  encodeAttribution,
  entitlementGrantsAccess,
  hasPermission,
  isCampaignTouch,
  isProducer,
  isSuperAdmin,
  readAttributionFromUrl,
  withAttribution
});
//# sourceMappingURL=index.js.map