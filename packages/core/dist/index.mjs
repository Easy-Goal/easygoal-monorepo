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
  // Opcional desde o ADR 072: o cadastro não escolhe plano.
  plan_slug: z.string().min(1).optional()
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

// src/contracts/join.ts
import { z as z8 } from "zod";
var PhoneSchema = z8.string().trim().regex(/^(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}$/, "Telefone inv\xE1lido");
var EntrySourceSchema = z8.object({
  utm_source: z8.string().trim().max(200).optional(),
  utm_medium: z8.string().trim().max(200).optional(),
  utm_campaign: z8.string().trim().max(200).optional(),
  utm_content: z8.string().trim().max(200).optional(),
  utm_term: z8.string().trim().max(200).optional(),
  referrer: z8.string().trim().max(500).optional(),
  landing: z8.string().trim().max(500).optional(),
  first_touch_at: z8.string().datetime().optional()
}).strict();
var ENTRY_PROFILES = ["comprador", "builder"];
var EntryProfileSchema = z8.enum(ENTRY_PROFILES);
var PRODUCER_TERMS_VERSION = "2.0";
var ProducerJoinSchema = z8.object({
  terms_version: z8.literal(PRODUCER_TERMS_VERSION),
  phone: PhoneSchema,
  source: EntrySourceSchema.optional()
});
var ObjectiveDescriptionSchema = z8.string().trim().min(10, "Descreva o objetivo com pelo menos 10 caracteres").max(2e3, "Use no m\xE1ximo 2.000 caracteres");
var BuyerJoinSchema = z8.object({
  phone: PhoneSchema,
  objective: ObjectiveDescriptionSchema,
  source: EntrySourceSchema.optional()
});
var OBJECTIVE_STATUSES = ["new", "in_review", "proposal_sent", "closed"];
var ObjectiveStatusSchema = z8.enum(OBJECTIVE_STATUSES);
var CreateObjectiveSchema = z8.object({
  description: ObjectiveDescriptionSchema
});
var UpdateObjectiveStatusSchema = z8.object({
  status: ObjectiveStatusSchema
});
var PLAN_FREQUENCIES = ["monthly", "quarterly", "yearly", "one_time"];
var CheckoutUrlSchema = z8.string().trim().max(2e3).url("Link inv\xE1lido").refine((value) => value.startsWith("https://"), "O link precisa come\xE7ar com https://");
var EntitlementKeySchema = z8.string().trim().regex(/^[a-z0-9_]{2,60}$/, "Use letras min\xFAsculas, n\xFAmeros e _ (ex.: vaygo_pro)");
var GatewayOfferIdSchema = z8.string().trim().min(1).max(200);
var CreatePlanLinkSchema = z8.object({
  name: z8.string().trim().min(1).max(120),
  checkout_url: CheckoutUrlSchema,
  description: z8.string().trim().max(500).optional(),
  price: z8.number().positive().optional(),
  frequency: z8.enum(PLAN_FREQUENCIES).optional(),
  plan_type: z8.string().trim().max(40).optional(),
  position: z8.number().int().min(0).optional(),
  is_sandbox: z8.boolean().optional(),
  entitlement_key: EntitlementKeySchema.optional(),
  gateway_offer_id: GatewayOfferIdSchema.optional()
});
var UpdatePlanLinkSchema = z8.object({
  name: z8.string().trim().min(1).max(120),
  checkout_url: CheckoutUrlSchema,
  description: z8.string().trim().max(500).nullable(),
  price: z8.number().positive().nullable(),
  frequency: z8.enum(PLAN_FREQUENCIES).nullable(),
  position: z8.number().int().min(0),
  is_active: z8.boolean(),
  entitlement_key: EntitlementKeySchema.nullable(),
  gateway_offer_id: GatewayOfferIdSchema.nullable()
}).partial().refine((value) => Object.keys(value).length > 0, "Nenhum campo para atualizar");
var GatewayDomainSchema = z8.object({
  domain: z8.string().trim().toLowerCase().max(253).regex(/^(?!-)[a-z0-9-]{1,63}(\.(?!-)[a-z0-9-]{1,63})+$/, "Dom\xEDnio inv\xE1lido"),
  gateway: z8.string().trim().min(1).max(60),
  is_active: z8.boolean().optional()
});
var UpdateGatewayDomainSchema = GatewayDomainSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Nenhum campo para atualizar"
);

// src/contracts/attribution.ts
import { z as z9 } from "zod";
var ATTRIBUTION_PARAM = "att";
var ATTRIBUTION_MAX_LENGTH = 2048;
var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
var CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "ttclid", "msclkid"];
var shortText = z9.string().trim().min(1).max(200);
var longText = z9.string().trim().min(1).max(500);
var AttributionTouchSchema = z9.object({
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
  at: z9.string().datetime()
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
import { z as z10 } from "zod";
var COMMERCE_GATEWAYS = ["abacatepay", "kiwify", "hotmart", "mercadopago", "custom"];
var CommerceGatewaySchema = z10.enum(COMMERCE_GATEWAYS);
var COMMERCE_EVENT_TYPES = [
  "sale.approved",
  "sale.refunded",
  "sale.chargeback",
  "subscription.started",
  "subscription.renewed",
  "subscription.past_due",
  "subscription.canceled"
];
var CommerceEventTypeSchema = z10.enum(COMMERCE_EVENT_TYPES);
var COMMERCE_EVENT_VERIFICATION = ["verified", "unverified"];
var CommerceEventVerificationSchema = z10.enum(COMMERCE_EVENT_VERIFICATION);
var COMMERCE_REF_PARAM = "eg_ref";
var CommerceEventSchema = z10.object({
  id: z10.string().uuid(),
  saas_product_id: z10.string().uuid(),
  gateway: CommerceGatewaySchema,
  gateway_event_id: z10.string().min(1).max(200),
  type: CommerceEventTypeSchema,
  verification: CommerceEventVerificationSchema,
  occurred_at: z10.string().datetime(),
  amount_cents: z10.number().int().nullable(),
  currency: z10.string().length(3).default("BRL"),
  customer_email: z10.string().email().nullable(),
  user_id: z10.string().uuid().nullable(),
  plan_id: z10.string().uuid().nullable(),
  eg_ref: z10.string().max(200).nullable(),
  received_at: z10.string().datetime()
});
var ENTITLEMENT_STATUSES = ["active", "past_due", "canceled", "refunded"];
var EntitlementStatusSchema = z10.enum(ENTITLEMENT_STATUSES);
var EntitlementSchema = z10.object({
  user_id: z10.string().uuid(),
  saas_product_id: z10.string().uuid(),
  entitlement_key: z10.string().regex(/^[a-z0-9_]{2,60}$/),
  status: EntitlementStatusSchema,
  valid_until: z10.string().datetime().nullable(),
  source_event_id: z10.string().uuid(),
  updated_at: z10.string().datetime()
});
function entitlementGrantsAccess(status) {
  return status === "active" || status === "past_due";
}
export {
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
  EntitlementKeySchema,
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
};
//# sourceMappingURL=index.mjs.map