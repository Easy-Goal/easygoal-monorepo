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
  BUDGET_RANGES: () => BUDGET_RANGES,
  BUDGET_RANGE_LABELS: () => BUDGET_RANGE_LABELS,
  BudgetRangeSchema: () => BudgetRangeSchema,
  BulkDeleteUsersSchema: () => BulkDeleteUsersSchema,
  BuyerDiagnosticJoinSchema: () => BuyerDiagnosticJoinSchema,
  BuyerJoinSchema: () => BuyerJoinSchema,
  CATEGORY_STAGES: () => CATEGORY_STAGES,
  CATEGORY_STAGE_LABELS: () => CATEGORY_STAGE_LABELS,
  CHECKOUT_ABANDON_HOURS: () => CHECKOUT_ABANDON_HOURS,
  CLICK_ID_KEYS: () => CLICK_ID_KEYS,
  COMMERCE_EVENT_TYPES: () => COMMERCE_EVENT_TYPES,
  COMMERCE_EVENT_VERIFICATION: () => COMMERCE_EVENT_VERIFICATION,
  COMMERCE_GATEWAYS: () => COMMERCE_GATEWAYS,
  COMMERCE_REF_PARAM: () => COMMERCE_REF_PARAM,
  CRM_FUNNEL_STAGES: () => CRM_FUNNEL_STAGES,
  CRM_FUNNEL_TAGS: () => CRM_FUNNEL_TAGS,
  CRM_LEAD_REF_PARAM: () => CRM_LEAD_REF_PARAM,
  CancelSubscriptionSchema: () => CancelSubscriptionSchema,
  CategoryStageSchema: () => CategoryStageSchema,
  CheckoutClickSchema: () => CheckoutClickSchema,
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
  CrmCaptureExtrasSchema: () => CrmCaptureExtrasSchema,
  CrmMirrorLeadSchema: () => CrmMirrorLeadSchema,
  CrmMirrorSchema: () => CrmMirrorSchema,
  DELIVERABLE_EXECUTORS: () => DELIVERABLE_EXECUTORS,
  DELIVERABLE_EXECUTOR_LABELS: () => DELIVERABLE_EXECUTOR_LABELS,
  DELIVERABLE_GOALS: () => DELIVERABLE_GOALS,
  DELIVERABLE_GOAL_LABELS: () => DELIVERABLE_GOAL_LABELS,
  DELIVERABLE_MODALITIES: () => DELIVERABLE_MODALITIES,
  DELIVERABLE_MODALITY_LABELS: () => DELIVERABLE_MODALITY_LABELS,
  DIAGNOSTIC_CHANNELS: () => DIAGNOSTIC_CHANNELS,
  DecideProposalSchema: () => DecideProposalSchema,
  DeleteVoteSchema: () => DeleteVoteSchema,
  DeliverableCategorySchema: () => DeliverableCategorySchema,
  DeliverableExecutorSchema: () => DeliverableExecutorSchema,
  DeliverableGoalSchema: () => DeliverableGoalSchema,
  DeliverableModalitySchema: () => DeliverableModalitySchema,
  DeliverableTemplateSchema: () => DeliverableTemplateSchema,
  DiagnosticChannelSchema: () => DiagnosticChannelSchema,
  DiagnosticSchema: () => DiagnosticSchema,
  ENTITLEMENT_STATUSES: () => ENTITLEMENT_STATUSES,
  ENTRY_PROFILES: () => ENTRY_PROFILES,
  EXECUTION_STATUSES: () => EXECUTION_STATUSES,
  EXECUTION_STATUS_LABELS: () => EXECUTION_STATUS_LABELS,
  EntitlementKeySchema: () => EntitlementKeySchema,
  EntitlementSchema: () => EntitlementSchema,
  EntitlementStatusSchema: () => EntitlementStatusSchema,
  EntryProfileSchema: () => EntryProfileSchema,
  EntrySourceSchema: () => EntrySourceSchema,
  ExecutionStatusSchema: () => ExecutionStatusSchema,
  ExternalDiagnosticSchema: () => ExternalDiagnosticSchema,
  ForgotPasswordSchema: () => ForgotPasswordSchema,
  GatewayDomainSchema: () => GatewayDomainSchema,
  GatewayOptionSchema: () => GatewayOptionSchema,
  InviteProducerAdminSchema: () => InviteProducerAdminSchema,
  InviteProducerSchema: () => InviteProducerSchema,
  KiwifyConfigSchema: () => KiwifyConfigSchema,
  KpiBaselineSchema: () => KpiBaselineSchema,
  LEAD_TIME_MIN_SAMPLE: () => LEAD_TIME_MIN_SAMPLE,
  LoginSchema: () => LoginSchema,
  METRIC_DIRECTIONS: () => METRIC_DIRECTIONS,
  MetricDirectionSchema: () => MetricDirectionSchema,
  NEED_TYPES: () => NEED_TYPES,
  NEED_TYPE_LABELS: () => NEED_TYPE_LABELS,
  NeedTypeSchema: () => NeedTypeSchema,
  OBJECTIVE_STATUSES: () => OBJECTIVE_STATUSES,
  OFFER_KINDS: () => OFFER_KINDS,
  OFFER_KIND_LABELS: () => OFFER_KIND_LABELS,
  ObjectiveDescriptionSchema: () => ObjectiveDescriptionSchema,
  ObjectiveStatusSchema: () => ObjectiveStatusSchema,
  OfferKindSchema: () => OfferKindSchema,
  PLAN_FREQUENCIES: () => PLAN_FREQUENCIES,
  PRODUCER_TERMS_VERSION: () => PRODUCER_TERMS_VERSION,
  PROPOSAL_STATUSES: () => PROPOSAL_STATUSES,
  PROPOSAL_STATUS_LABELS: () => PROPOSAL_STATUS_LABELS,
  PatchFeedbackSchema: () => PatchFeedbackSchema,
  PhoneSchema: () => PhoneSchema,
  PreviewCampaignSchema: () => PreviewCampaignSchema,
  ProducerJoinSchema: () => ProducerJoinSchema,
  ProposalItemSchema: () => ProposalItemSchema,
  ProposalStatusSchema: () => ProposalStatusSchema,
  RECURRENCE_INTERVALS: () => RECURRENCE_INTERVALS,
  RECURRENCE_INTERVAL_LABELS: () => RECURRENCE_INTERVAL_LABELS,
  RESULT_CHECKPOINTS: () => RESULT_CHECKPOINTS,
  RESULT_CHECKPOINT_DAYS: () => RESULT_CHECKPOINT_DAYS,
  RecurrenceIntervalSchema: () => RecurrenceIntervalSchema,
  RegisterSchema: () => RegisterSchema,
  RejectProductSchema: () => RejectProductSchema,
  ReopenProductSchema: () => ReopenProductSchema,
  RequiredToolSchema: () => RequiredToolSchema,
  ResetPasswordSchema: () => ResetPasswordSchema,
  ResultCheckpointSchema: () => ResultCheckpointSchema,
  ResultMeasurementSchema: () => ResultMeasurementSchema,
  ReturnDeliverableSchema: () => ReturnDeliverableSchema,
  SaasSubscriptionStatusSchema: () => SaasSubscriptionStatusSchema,
  SaveProposalSchema: () => SaveProposalSchema,
  ServiceRequestStatusSchema: () => ServiceRequestStatusSchema,
  SessionExchangeSchema: () => SessionExchangeSchema,
  SignServiceRequestSchema: () => SignServiceRequestSchema,
  SuggestItemSchema: () => SuggestItemSchema,
  SwitchCompanySchema: () => SwitchCompanySchema,
  TimeLogSchema: () => TimeLogSchema,
  TokenRequestSchema: () => TokenRequestSchema,
  TourProgressSchema: () => TourProgressSchema,
  URGENCIES: () => URGENCIES,
  URGENCY_LABELS: () => URGENCY_LABELS,
  UTM_KEYS: () => UTM_KEYS,
  UpdateAccountSchema: () => UpdateAccountSchema,
  UpdateCampaignSchema: () => UpdateCampaignSchema,
  UpdateCompanySchema: () => UpdateCompanySchema,
  UpdateDeliverableCategorySchema: () => UpdateDeliverableCategorySchema,
  UpdateDeliverableTemplateSchema: () => UpdateDeliverableTemplateSchema,
  UpdateEmailSchema: () => UpdateEmailSchema,
  UpdateExecutionSchema: () => UpdateExecutionSchema,
  UpdateGatewayDomainSchema: () => UpdateGatewayDomainSchema,
  UpdateObjectiveStatusSchema: () => UpdateObjectiveStatusSchema,
  UpdatePasswordSchema: () => UpdatePasswordSchema,
  UpdatePaymentSettingsSchema: () => UpdatePaymentSettingsSchema,
  UpdatePlanLinkSchema: () => UpdatePlanLinkSchema,
  UpdateProducerSchema: () => UpdateProducerSchema,
  UpdateSaasProductSchema: () => UpdateSaasProductSchema,
  UpdateUserSchema: () => UpdateUserSchema,
  UrgencySchema: () => UrgencySchema,
  VALIDATION_STEPS: () => VALIDATION_STEPS,
  VALIDATION_STEP_STATUSES: () => VALIDATION_STEP_STATUSES,
  ValidationStepSchema: () => ValidationStepSchema,
  ValidationStepStateSchema: () => ValidationStepStateSchema,
  VerifyTokenSchema: () => VerifyTokenSchema,
  VoteItemSchema: () => VoteItemSchema,
  brlInputToCents: () => brlInputToCents,
  canTransition: () => canTransition,
  centsToReais: () => centsToReais,
  checkTemplateTiming: () => checkTemplateTiming,
  decodeAttribution: () => decodeAttribution,
  encodeAttribution: () => encodeAttribution,
  entitlementGrantsAccess: () => entitlementGrantsAccess,
  formatBRL: () => formatBRL,
  formatBRLCompact: () => formatBRLCompact,
  hasPermission: () => hasPermission,
  isCampaignTouch: () => isCampaignTouch,
  isProducer: () => isProducer,
  isSuperAdmin: () => isSuperAdmin,
  kpiImproved: () => kpiImproved,
  maskBRLInput: () => maskBRLInput,
  monthlyCents: () => monthlyCents,
  readAttributionFromUrl: () => readAttributionFromUrl,
  reaisToCents: () => reaisToCents,
  toCents: () => toCents,
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
var EntitlementKeySchema = import_zod8.z.string().trim().regex(/^[a-z0-9_]{2,60}$/, "Use letras min\xFAsculas, n\xFAmeros e _ (ex.: vaygo_pro)");
var GatewayOfferIdSchema = import_zod8.z.string().trim().min(1).max(200);
var CreatePlanLinkSchema = import_zod8.z.object({
  name: import_zod8.z.string().trim().min(1).max(120),
  checkout_url: CheckoutUrlSchema,
  description: import_zod8.z.string().trim().max(500).optional(),
  price: import_zod8.z.number().positive().optional(),
  frequency: import_zod8.z.enum(PLAN_FREQUENCIES).optional(),
  plan_type: import_zod8.z.string().trim().max(40).optional(),
  position: import_zod8.z.number().int().min(0).optional(),
  is_sandbox: import_zod8.z.boolean().optional(),
  entitlement_key: EntitlementKeySchema.optional(),
  gateway_offer_id: GatewayOfferIdSchema.optional()
});
var UpdatePlanLinkSchema = import_zod8.z.object({
  name: import_zod8.z.string().trim().min(1).max(120),
  checkout_url: CheckoutUrlSchema,
  description: import_zod8.z.string().trim().max(500).nullable(),
  price: import_zod8.z.number().positive().nullable(),
  frequency: import_zod8.z.enum(PLAN_FREQUENCIES).nullable(),
  position: import_zod8.z.number().int().min(0),
  is_active: import_zod8.z.boolean(),
  entitlement_key: EntitlementKeySchema.nullable(),
  gateway_offer_id: GatewayOfferIdSchema.nullable()
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
  "subscription.canceled",
  /** Cobrança criada e não paga (Pix gerado, boleto emitido). Só registra; não libera acesso (s369). */
  "payment.pending"
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
  /** Id do lead no Easy CRM, quando o checkout levou `eg_lead` (ver `crm-funnel.ts`). */
  lead_ref: import_zod10.z.string().max(200).nullable().optional(),
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
var OFFER_KINDS = ["recurring", "one_time", "order_bump", "upsell"];
var OfferKindSchema = import_zod10.z.enum(OFFER_KINDS);
var OFFER_KIND_LABELS = {
  recurring: "Assinatura recorrente",
  one_time: "Venda avulsa",
  order_bump: "Order bump",
  upsell: "Upsell"
};
var VALIDATION_STEPS = [
  "webhook_verified",
  // chegou um evento com assinatura do gateway conferida
  "offers_categorized",
  // toda oferta vista nos eventos tem plano e tipo
  "page_visit",
  // visita registrada na página do SaaS antes da contratação
  "login",
  // comprador entrou no SaaS pelo SSO
  "sale",
  // sale.approved verificado
  "subscription",
  // subscription.started verificado (só se houver oferta recorrente)
  "human_approval"
  // aprovação final por um admin da Easy Goal
];
var ValidationStepSchema = import_zod10.z.enum(VALIDATION_STEPS);
var VALIDATION_STEP_STATUSES = ["pending", "ok", "not_applicable"];
var ValidationStepStateSchema = import_zod10.z.object({
  step: ValidationStepSchema,
  status: import_zod10.z.enum(VALIDATION_STEP_STATUSES),
  /** Quando foi visto pela primeira vez (ISO) — ou null se pendente. */
  seen_at: import_zod10.z.string().datetime().nullable(),
  /** Detalhe curto para o produtor (ex.: "3 de 4 ofertas categorizadas"). */
  detail: import_zod10.z.string().max(200).nullable()
});
var GatewayOptionSchema = import_zod10.z.object({
  gateway: CommerceGatewaySchema,
  label: import_zod10.z.string(),
  /** URL que o produtor cola no painel do gateway, já com o gateway e a chave do produto. */
  webhook_path: import_zod10.z.string()
});

// src/contracts/deliverables.ts
var import_zod11 = require("zod");
var DELIVERABLE_GOALS = ["sell_more", "operate_with_less_effort", "launch_or_scale_product", "strategy"];
var DeliverableGoalSchema = import_zod11.z.enum(DELIVERABLE_GOALS);
var DELIVERABLE_GOAL_LABELS = {
  sell_more: "Vender mais",
  operate_with_less_effort: "Operar com menos esfor\xE7o",
  launch_or_scale_product: "Lan\xE7ar ou escalar um produto",
  strategy: "Estrat\xE9gia e consultoria"
};
var DELIVERABLE_MODALITIES = ["one_off", "setup", "implementation", "recurring"];
var DeliverableModalitySchema = import_zod11.z.enum(DELIVERABLE_MODALITIES);
var DELIVERABLE_MODALITY_LABELS = {
  one_off: "Avulso",
  setup: "Setup",
  implementation: "Implementa\xE7\xE3o",
  recurring: "Recorr\xEAncia"
};
var RECURRENCE_INTERVALS = ["monthly", "quarterly"];
var RecurrenceIntervalSchema = import_zod11.z.enum(RECURRENCE_INTERVALS);
var RECURRENCE_INTERVAL_LABELS = { monthly: "Mensal", quarterly: "Trimestral" };
var DELIVERABLE_EXECUTORS = ["easy_goal", "builder", "both"];
var DeliverableExecutorSchema = import_zod11.z.enum(DELIVERABLE_EXECUTORS);
var DELIVERABLE_EXECUTOR_LABELS = {
  easy_goal: "Easy Goal",
  builder: "Builder",
  both: "Easy Goal + builder"
};
var METRIC_DIRECTIONS = ["up", "down"];
var MetricDirectionSchema = import_zod11.z.enum(METRIC_DIRECTIONS);
var slug = import_zod11.z.string().trim().min(2, "Nome curto demais para gerar o identificador").max(60).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use letras min\xFAsculas, n\xFAmeros e h\xEDfen");
var text = (max) => import_zod11.z.string().trim().min(1, "Preencha os campos obrigat\xF3rios").max(max, `Use no m\xE1ximo ${max} caracteres`);
var DeliverableCategorySchema = import_zod11.z.object({
  slug,
  name: text(80),
  description: import_zod11.z.string().trim().max(500).nullish(),
  goals: import_zod11.z.array(DeliverableGoalSchema).min(1, "Escolha ao menos um objetivo").max(DELIVERABLE_GOALS.length),
  result_metric_name: text(120),
  result_metric_unit: import_zod11.z.string().trim().max(20).nullish(),
  result_metric_direction: MetricDirectionSchema.default("up"),
  is_active: import_zod11.z.boolean().default(true),
  sort_order: import_zod11.z.number().int().min(0).max(1e3).default(0)
});
var UpdateDeliverableCategorySchema = DeliverableCategorySchema.partial().omit({ slug: true });
var RequiredToolSchema = import_zod11.z.object({ name: text(80), reason: text(200) });
var templateFields = import_zod11.z.object({
  category_id: import_zod11.z.string().uuid(),
  name: text(120),
  description: import_zod11.z.string().trim().max(1e3).nullish(),
  modality: DeliverableModalitySchema,
  /** Dias úteis até a entrega. Obrigatório fora da recorrência; na recorrência vale o ciclo. */
  default_lead_time_days: import_zod11.z.number().int().min(1).max(365).nullish(),
  recurrence_interval: RecurrenceIntervalSchema.nullish(),
  default_effort_hours: import_zod11.z.number().min(0).max(2e3).nullish(),
  acceptance_criteria: import_zod11.z.array(text(300)).max(20).default([]),
  required_tools: import_zod11.z.array(RequiredToolSchema).max(20).default([]),
  base_price_cents: import_zod11.z.number().int().min(0).nullish(),
  executor: DeliverableExecutorSchema.default("easy_goal"),
  is_active: import_zod11.z.boolean().default(true),
  sort_order: import_zod11.z.number().int().min(0).max(1e3).default(0)
});
function checkTemplateTiming(t, ctx) {
  if (t.modality === "recurring") {
    if (!t.recurrence_interval) ctx.addIssue({ code: import_zod11.z.ZodIssueCode.custom, path: ["recurrence_interval"], message: "Recorr\xEAncia precisa do ciclo" });
  } else {
    if (!t.default_lead_time_days) ctx.addIssue({ code: import_zod11.z.ZodIssueCode.custom, path: ["default_lead_time_days"], message: "Informe o prazo em dias \xFAteis" });
    if (t.recurrence_interval) ctx.addIssue({ code: import_zod11.z.ZodIssueCode.custom, path: ["recurrence_interval"], message: "S\xF3 a recorr\xEAncia tem ciclo" });
  }
}
var DeliverableTemplateSchema = templateFields.superRefine(checkTemplateTiming);
var UpdateDeliverableTemplateSchema = templateFields.partial();
var NEED_TYPES = ["service", "tool", "tool_with_implementation", "unsure"];
var NeedTypeSchema = import_zod11.z.enum(NEED_TYPES);
var NEED_TYPE_LABELS = {
  service: "Um servi\xE7o feito por voc\xEAs",
  tool: "Uma ferramenta",
  tool_with_implementation: "Ferramenta + implementa\xE7\xE3o",
  unsure: "Ainda n\xE3o sei (quero diagn\xF3stico)"
};
var CATEGORY_STAGES = ["none", "has_not_using", "using_wants_scale"];
var CategoryStageSchema = import_zod11.z.enum(CATEGORY_STAGES);
var CATEGORY_STAGE_LABELS = {
  none: "N\xE3o tenho nada",
  has_not_using: "Tenho, mas n\xE3o uso bem",
  using_wants_scale: "Uso e quero automatizar ou escalar"
};
var URGENCIES = ["this_week", "this_month", "next_3_months", "no_rush"];
var UrgencySchema = import_zod11.z.enum(URGENCIES);
var URGENCY_LABELS = {
  this_week: "Esta semana",
  this_month: "Este m\xEAs",
  next_3_months: "Pr\xF3ximos 3 meses",
  no_rush: "Sem pressa"
};
var BUDGET_RANGES = ["up_to_2k", "2k_10k", "10k_30k", "above_30k", "talk"];
var BudgetRangeSchema = import_zod11.z.enum(BUDGET_RANGES);
var BUDGET_RANGE_LABELS = {
  up_to_2k: "At\xE9 R$ 2 mil",
  "2k_10k": "R$ 2 mil a R$ 10 mil",
  "10k_30k": "R$ 10 mil a R$ 30 mil",
  above_30k: "Acima de R$ 30 mil",
  talk: "Prefiro conversar"
};
var DIAGNOSTIC_CHANNELS = ["app", "site", "typebot", "crm", "admin"];
var DiagnosticChannelSchema = import_zod11.z.enum(DIAGNOSTIC_CHANNELS);
var KpiBaselineSchema = import_zod11.z.object({
  category_slug: slug,
  name: text(120),
  unit: import_zod11.z.string().trim().max(20).nullish(),
  direction: MetricDirectionSchema,
  value: import_zod11.z.number().finite().nullish()
});
var DiagnosticSchema = import_zod11.z.object({
  goal: DeliverableGoalSchema,
  need_type: NeedTypeSchema,
  categories: import_zod11.z.array(import_zod11.z.object({ slug, stage: CategoryStageSchema })).min(1, "Escolha ao menos uma \xE1rea").max(9).refine((list) => new Set(list.map((c) => c.slug)).size === list.length, "\xC1rea repetida"),
  urgency: UrgencySchema,
  budget_range: BudgetRangeSchema,
  kpi_baseline: KpiBaselineSchema.nullish(),
  description: import_zod11.z.string().trim().max(2e3, "Use no m\xE1ximo 2.000 caracteres").nullish()
});
var BuyerDiagnosticJoinSchema = import_zod11.z.object({
  phone: PhoneSchema,
  diagnostic: DiagnosticSchema,
  source: EntrySourceSchema.optional()
});
var ExternalDiagnosticSchema = import_zod11.z.object({
  channel: import_zod11.z.enum(["site", "crm"]),
  contact: import_zod11.z.object({
    name: text(120),
    email: import_zod11.z.string().trim().toLowerCase().email("E-mail inv\xE1lido").max(200).nullish(),
    phone: PhoneSchema.nullish()
  }).refine((c) => Boolean(c.email || c.phone), "Informe e-mail ou telefone"),
  diagnostic: DiagnosticSchema,
  source: EntrySourceSchema.optional()
});
var PROPOSAL_STATUSES = ["draft", "sent", "accepted", "declined", "superseded"];
var ProposalStatusSchema = import_zod11.z.enum(PROPOSAL_STATUSES);
var PROPOSAL_STATUS_LABELS = {
  draft: "Rascunho",
  sent: "Enviada",
  accepted: "Aceita",
  declined: "Recusada",
  superseded: "Substitu\xEDda"
};
var ProposalItemSchema = import_zod11.z.object({
  template_id: import_zod11.z.string().uuid(),
  phase: import_zod11.z.number().int().min(1).max(20),
  name: text(120),
  modality: DeliverableModalitySchema,
  lead_time_days: import_zod11.z.number().int().min(1).max(365).nullish(),
  recurrence_interval: RecurrenceIntervalSchema.nullish(),
  effort_hours: import_zod11.z.number().min(0).max(2e3).nullish(),
  price_cents: import_zod11.z.number().int().min(0).nullish(),
  acceptance_criteria: import_zod11.z.array(text(300)).max(20).default([]),
  required_tools: import_zod11.z.array(RequiredToolSchema).max(20).default([])
}).superRefine(
  (item, ctx) => checkTemplateTiming(
    { modality: item.modality, default_lead_time_days: item.lead_time_days, recurrence_interval: item.recurrence_interval },
    ctx
  )
);
var SaveProposalSchema = import_zod11.z.object({
  notes: import_zod11.z.string().trim().max(2e3).nullish(),
  items: import_zod11.z.array(ProposalItemSchema).min(1, "A proposta precisa de ao menos um entreg\xE1vel").max(50)
});
var DecideProposalSchema = import_zod11.z.object({ note: import_zod11.z.string().trim().max(1e3).nullish() });
var EXECUTION_STATUSES = ["todo", "in_progress", "delivered", "returned", "accepted", "cancelled"];
var ExecutionStatusSchema = import_zod11.z.enum(EXECUTION_STATUSES);
var EXECUTION_STATUS_LABELS = {
  todo: "A fazer",
  in_progress: "Em andamento",
  delivered: "Entregue",
  returned: "Devolvido",
  accepted: "Aceito",
  cancelled: "Cancelado"
};
var TRANSITIONS = {
  todo: { in_progress: ["assignee", "admin"], cancelled: ["admin"] },
  in_progress: { delivered: ["assignee", "admin"], cancelled: ["admin"] },
  delivered: { accepted: ["buyer", "admin"], returned: ["buyer", "admin"] },
  returned: { in_progress: ["assignee", "admin"], delivered: ["assignee", "admin"], cancelled: ["admin"] },
  accepted: {},
  cancelled: {}
};
function canTransition(from, to, actor, modality) {
  if (modality === "recurring" && !["in_progress", "cancelled"].includes(to)) return false;
  return TRANSITIONS[from][to]?.includes(actor) ?? false;
}
var UpdateExecutionSchema = import_zod11.z.object({
  status: ExecutionStatusSchema.optional(),
  assignee_id: import_zod11.z.string().uuid().nullable().optional(),
  note: import_zod11.z.string().trim().max(1e3).nullish()
}).refine((v) => v.status !== void 0 || v.assignee_id !== void 0, "Informe o status ou o respons\xE1vel");
var ReturnDeliverableSchema = import_zod11.z.object({ note: text(1e3) });
var TimeLogSchema = import_zod11.z.object({
  hours: import_zod11.z.number().positive("Informe as horas").max(24),
  note: import_zod11.z.string().trim().max(500).nullish(),
  logged_on: import_zod11.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});
var LEAD_TIME_MIN_SAMPLE = 5;
var RESULT_CHECKPOINTS = ["d30", "d60", "d90"];
var ResultCheckpointSchema = import_zod11.z.enum(RESULT_CHECKPOINTS);
var RESULT_CHECKPOINT_DAYS = { d30: 30, d60: 60, d90: 90 };
var ResultMeasurementSchema = import_zod11.z.object({
  checkpoint: ResultCheckpointSchema,
  value: import_zod11.z.number().finite(),
  note: import_zod11.z.string().trim().max(1e3).nullish()
});
function kpiImproved(baseline, current, direction) {
  if (baseline === null || baseline === void 0) return null;
  return direction === "up" ? current > baseline : current < baseline;
}

// src/contracts/crm-funnel.ts
var import_zod12 = require("zod");
var CRM_LEAD_REF_PARAM = "eg_lead";
var CHECKOUT_ABANDON_HOURS = 24;
var CRM_FUNNEL_TAGS = {
  checkoutClicked: "foi ao checkout",
  paymentPending: "pagamento pendente",
  checkoutAbandoned: "abandonou checkout",
  saleWithoutLead: "venda sem lead"
};
var CRM_FUNNEL_STAGES = ["Novo", "Checkout", "Fechado Ganho", "Perdido"];
var shortText2 = import_zod12.z.string().trim().min(1).max(200);
var tag = import_zod12.z.string().trim().min(1).max(60);
var CrmCaptureExtrasSchema = import_zod12.z.object({
  /** Produto dentro da empresa Easy Goal (ex.: "Desafio Builder"). */
  produto: shortText2.optional(),
  etiquetas: import_zod12.z.array(tag).max(10).optional(),
  /** Primeiro toque (cookie de primeira parte, 90 dias). Uma captura repetida não sobrescreve. */
  attribution: AttributionTouchSchema.optional(),
  /** URL da página que capturou. */
  origem_pagina: import_zod12.z.string().trim().url().max(500).optional()
});
var CheckoutClickSchema = import_zod12.z.object({
  produto: shortText2,
  lead_ref: shortText2.optional(),
  email: import_zod12.z.string().trim().toLowerCase().email().optional(),
  destino_url: import_zod12.z.string().trim().url().max(1e3),
  attribution: AttributionTouchSchema.optional(),
  occurred_at: import_zod12.z.string().datetime({ offset: true })
}).refine((c) => Boolean(c.lead_ref || c.email), { message: "lead_ref ou email \xE9 obrigat\xF3rio" });
var CrmMirrorLeadSchema = import_zod12.z.object({
  id: import_zod12.z.string(),
  nome: import_zod12.z.string(),
  email: import_zod12.z.string(),
  telefone: import_zod12.z.string(),
  canal: import_zod12.z.string(),
  campanha: import_zod12.z.string(),
  etapa: import_zod12.z.string(),
  aberto: import_zod12.z.boolean(),
  criado_em: import_zod12.z.string(),
  convertido_em: import_zod12.z.string().nullable(),
  crm_url: import_zod12.z.string(),
  // Campos do refinamento s369 (C3). Ausentes no CRM antigo: o app trata como nulos.
  produto: import_zod12.z.string().nullable().optional(),
  etiquetas: import_zod12.z.array(import_zod12.z.string()).optional(),
  utm_source: import_zod12.z.string().nullable().optional(),
  utm_medium: import_zod12.z.string().nullable().optional(),
  utm_campaign: import_zod12.z.string().nullable().optional(),
  utm_content: import_zod12.z.string().nullable().optional(),
  utm_term: import_zod12.z.string().nullable().optional(),
  gclid: import_zod12.z.string().nullable().optional(),
  fbclid: import_zod12.z.string().nullable().optional(),
  /** Campanha do último toque, quando diferente da primeira. */
  ultima_utm_campaign: import_zod12.z.string().nullable().optional(),
  valor_cents: import_zod12.z.number().int().nullable().optional(),
  /** Nome de quem está atendendo (R-D: o produtor vê, sem ver a conversa). */
  consultor_nome: import_zod12.z.string().nullable().optional(),
  ultima_acao_em: import_zod12.z.string().nullable().optional(),
  ultima_acao_descricao: import_zod12.z.string().nullable().optional()
});
var CrmMirrorSchema = import_zod12.z.object({
  empresa_id: import_zod12.z.string(),
  gerado_em: import_zod12.z.string(),
  totais: import_zod12.z.object({
    leads: import_zod12.z.number().int(),
    ultimos_30_dias: import_zod12.z.number().int(),
    abertos: import_zod12.z.number().int(),
    ganhos: import_zod12.z.number().int(),
    perdidos: import_zod12.z.number().int()
  }),
  por_etapa: import_zod12.z.array(import_zod12.z.object({ etapa: import_zod12.z.string(), total: import_zod12.z.number().int() })),
  por_campanha: import_zod12.z.array(
    import_zod12.z.object({
      campanha: import_zod12.z.string(),
      total: import_zod12.z.number().int(),
      ganhos: import_zod12.z.number().int(),
      // s369: funil por campanha para a aba "Campanhas" do app.
      foram_ao_checkout: import_zod12.z.number().int().optional(),
      valor_cents: import_zod12.z.number().int().optional()
    })
  ),
  leads: import_zod12.z.array(CrmMirrorLeadSchema)
});

// src/money/index.ts
var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
var BRL_COMPACT = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1
});
function toCents(value) {
  if (value == null || !Number.isFinite(value)) return 0;
  return Math.round(value);
}
function reaisToCents(reais) {
  if (reais == null || reais === "") return 0;
  const n = typeof reais === "number" ? reais : Number(String(reais).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
function centsToReais(cents) {
  return toCents(cents) / 100;
}
function formatBRL(cents) {
  return BRL.format(toCents(cents) / 100);
}
function formatBRLCompact(cents) {
  return BRL_COMPACT.format(toCents(cents) / 100);
}
function maskBRLInput(raw) {
  const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  const cents = digits === "" ? 0 : parseInt(digits, 10);
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function brlInputToCents(display) {
  const digits = display.replace(/\D/g, "");
  return digits === "" ? 0 : parseInt(digits, 10);
}
function monthlyCents(cents, frequency) {
  const c = toCents(cents);
  switch (frequency) {
    case "yearly":
    case "annual":
      return Math.round(c / 12);
    case "semiannual":
      return Math.round(c / 6);
    case "quarterly":
      return Math.round(c / 3);
    default:
      return c;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ATTRIBUTION_MAX_LENGTH,
  ATTRIBUTION_PARAM,
  AttributionTouchSchema,
  BUDGET_RANGES,
  BUDGET_RANGE_LABELS,
  BudgetRangeSchema,
  BulkDeleteUsersSchema,
  BuyerDiagnosticJoinSchema,
  BuyerJoinSchema,
  CATEGORY_STAGES,
  CATEGORY_STAGE_LABELS,
  CHECKOUT_ABANDON_HOURS,
  CLICK_ID_KEYS,
  COMMERCE_EVENT_TYPES,
  COMMERCE_EVENT_VERIFICATION,
  COMMERCE_GATEWAYS,
  COMMERCE_REF_PARAM,
  CRM_FUNNEL_STAGES,
  CRM_FUNNEL_TAGS,
  CRM_LEAD_REF_PARAM,
  CancelSubscriptionSchema,
  CategoryStageSchema,
  CheckoutClickSchema,
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
  CrmCaptureExtrasSchema,
  CrmMirrorLeadSchema,
  CrmMirrorSchema,
  DELIVERABLE_EXECUTORS,
  DELIVERABLE_EXECUTOR_LABELS,
  DELIVERABLE_GOALS,
  DELIVERABLE_GOAL_LABELS,
  DELIVERABLE_MODALITIES,
  DELIVERABLE_MODALITY_LABELS,
  DIAGNOSTIC_CHANNELS,
  DecideProposalSchema,
  DeleteVoteSchema,
  DeliverableCategorySchema,
  DeliverableExecutorSchema,
  DeliverableGoalSchema,
  DeliverableModalitySchema,
  DeliverableTemplateSchema,
  DiagnosticChannelSchema,
  DiagnosticSchema,
  ENTITLEMENT_STATUSES,
  ENTRY_PROFILES,
  EXECUTION_STATUSES,
  EXECUTION_STATUS_LABELS,
  EntitlementKeySchema,
  EntitlementSchema,
  EntitlementStatusSchema,
  EntryProfileSchema,
  EntrySourceSchema,
  ExecutionStatusSchema,
  ExternalDiagnosticSchema,
  ForgotPasswordSchema,
  GatewayDomainSchema,
  GatewayOptionSchema,
  InviteProducerAdminSchema,
  InviteProducerSchema,
  KiwifyConfigSchema,
  KpiBaselineSchema,
  LEAD_TIME_MIN_SAMPLE,
  LoginSchema,
  METRIC_DIRECTIONS,
  MetricDirectionSchema,
  NEED_TYPES,
  NEED_TYPE_LABELS,
  NeedTypeSchema,
  OBJECTIVE_STATUSES,
  OFFER_KINDS,
  OFFER_KIND_LABELS,
  ObjectiveDescriptionSchema,
  ObjectiveStatusSchema,
  OfferKindSchema,
  PLAN_FREQUENCIES,
  PRODUCER_TERMS_VERSION,
  PROPOSAL_STATUSES,
  PROPOSAL_STATUS_LABELS,
  PatchFeedbackSchema,
  PhoneSchema,
  PreviewCampaignSchema,
  ProducerJoinSchema,
  ProposalItemSchema,
  ProposalStatusSchema,
  RECURRENCE_INTERVALS,
  RECURRENCE_INTERVAL_LABELS,
  RESULT_CHECKPOINTS,
  RESULT_CHECKPOINT_DAYS,
  RecurrenceIntervalSchema,
  RegisterSchema,
  RejectProductSchema,
  ReopenProductSchema,
  RequiredToolSchema,
  ResetPasswordSchema,
  ResultCheckpointSchema,
  ResultMeasurementSchema,
  ReturnDeliverableSchema,
  SaasSubscriptionStatusSchema,
  SaveProposalSchema,
  ServiceRequestStatusSchema,
  SessionExchangeSchema,
  SignServiceRequestSchema,
  SuggestItemSchema,
  SwitchCompanySchema,
  TimeLogSchema,
  TokenRequestSchema,
  TourProgressSchema,
  URGENCIES,
  URGENCY_LABELS,
  UTM_KEYS,
  UpdateAccountSchema,
  UpdateCampaignSchema,
  UpdateCompanySchema,
  UpdateDeliverableCategorySchema,
  UpdateDeliverableTemplateSchema,
  UpdateEmailSchema,
  UpdateExecutionSchema,
  UpdateGatewayDomainSchema,
  UpdateObjectiveStatusSchema,
  UpdatePasswordSchema,
  UpdatePaymentSettingsSchema,
  UpdatePlanLinkSchema,
  UpdateProducerSchema,
  UpdateSaasProductSchema,
  UpdateUserSchema,
  UrgencySchema,
  VALIDATION_STEPS,
  VALIDATION_STEP_STATUSES,
  ValidationStepSchema,
  ValidationStepStateSchema,
  VerifyTokenSchema,
  VoteItemSchema,
  brlInputToCents,
  canTransition,
  centsToReais,
  checkTemplateTiming,
  decodeAttribution,
  encodeAttribution,
  entitlementGrantsAccess,
  formatBRL,
  formatBRLCompact,
  hasPermission,
  isCampaignTouch,
  isProducer,
  isSuperAdmin,
  kpiImproved,
  maskBRLInput,
  monthlyCents,
  readAttributionFromUrl,
  reaisToCents,
  toCents,
  withAttribution
});
//# sourceMappingURL=index.js.map