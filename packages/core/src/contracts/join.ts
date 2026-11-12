import { z } from 'zod';

// Contratos da entrada por /join (ADR 072): builder, comprador, objetivos,
// links do gateway por plano e domínios de checkout aceitos.

/** Telefone brasileiro com DDD, com ou sem +55 e máscara. Ex.: (11) 99999-9999. */
export const PhoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}$/, 'Telefone inválido');

/** Origem do primeiro toque (UTM e página de entrada), gravada uma vez por usuário. */
export const EntrySourceSchema = z
  .object({
    utm_source: z.string().trim().max(200).optional(),
    utm_medium: z.string().trim().max(200).optional(),
    utm_campaign: z.string().trim().max(200).optional(),
    utm_content: z.string().trim().max(200).optional(),
    utm_term: z.string().trim().max(200).optional(),
    referrer: z.string().trim().max(500).optional(),
    landing: z.string().trim().max(500).optional(),
    first_touch_at: z.string().datetime().optional(),
  })
  .strict();
export type EntrySource = z.infer<typeof EntrySourceSchema>;

export const ENTRY_PROFILES = ['comprador', 'builder'] as const;
export const EntryProfileSchema = z.enum(ENTRY_PROFILES);
export type EntryProfile = z.infer<typeof EntryProfileSchema>;

/** Versão vigente dos termos do builder. Termos novos exigem versão nova e revisão jurídica. */
export const PRODUCER_TERMS_VERSION = '2.0';

export const ProducerJoinSchema = z.object({
  terms_version: z.literal(PRODUCER_TERMS_VERSION),
  phone: PhoneSchema,
  source: EntrySourceSchema.optional(),
});
export type ProducerJoinDto = z.infer<typeof ProducerJoinSchema>;

export const ObjectiveDescriptionSchema = z
  .string()
  .trim()
  .min(10, 'Descreva o objetivo com pelo menos 10 caracteres')
  .max(2000, 'Use no máximo 2.000 caracteres');

export const BuyerJoinSchema = z.object({
  phone: PhoneSchema,
  objective: ObjectiveDescriptionSchema,
  source: EntrySourceSchema.optional(),
});
export type BuyerJoinDto = z.infer<typeof BuyerJoinSchema>;

export const OBJECTIVE_STATUSES = ['new', 'in_review', 'proposal_sent', 'closed'] as const;
export const ObjectiveStatusSchema = z.enum(OBJECTIVE_STATUSES);
export type ObjectiveStatus = z.infer<typeof ObjectiveStatusSchema>;

export const CreateObjectiveSchema = z.object({
  description: ObjectiveDescriptionSchema,
});
export type CreateObjectiveDto = z.infer<typeof CreateObjectiveSchema>;

export const UpdateObjectiveStatusSchema = z.object({
  status: ObjectiveStatusSchema,
});
export type UpdateObjectiveStatusDto = z.infer<typeof UpdateObjectiveStatusSchema>;

export const PLAN_FREQUENCIES = ['monthly', 'quarterly', 'yearly', 'one_time'] as const;

const CheckoutUrlSchema = z
  .string()
  .trim()
  .max(2000)
  .url('Link inválido')
  .refine((value) => value.startsWith('https://'), 'O link precisa começar com https://');

/** Acesso que o plano libera no SaaS (ex.: vaygo_pro). Vem para entitlements quando o gateway avisa a venda. */
export const EntitlementKeySchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9_]{2,60}$/, 'Use letras minúsculas, números e _ (ex.: vaygo_pro)');

/** Id do produto ou da oferta no gateway, para saber qual plano o webhook está pagando. */
const GatewayOfferIdSchema = z.string().trim().min(1).max(200);

/** Plano do produto como link do gateway: o preço é opcional, porque fica no gateway. */
export const CreatePlanLinkSchema = z.object({
  name: z.string().trim().min(1).max(120),
  checkout_url: CheckoutUrlSchema,
  description: z.string().trim().max(500).optional(),
  price: z.number().positive().optional(),
  frequency: z.enum(PLAN_FREQUENCIES).optional(),
  plan_type: z.string().trim().max(40).optional(),
  position: z.number().int().min(0).optional(),
  is_sandbox: z.boolean().optional(),
  entitlement_key: EntitlementKeySchema.optional(),
  gateway_offer_id: GatewayOfferIdSchema.optional(),
});
export type CreatePlanLinkDto = z.infer<typeof CreatePlanLinkSchema>;

export const UpdatePlanLinkSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    checkout_url: CheckoutUrlSchema,
    description: z.string().trim().max(500).nullable(),
    price: z.number().positive().nullable(),
    frequency: z.enum(PLAN_FREQUENCIES).nullable(),
    position: z.number().int().min(0),
    is_active: z.boolean(),
    entitlement_key: EntitlementKeySchema.nullable(),
    gateway_offer_id: GatewayOfferIdSchema.nullable(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'Nenhum campo para atualizar');
export type UpdatePlanLinkDto = z.infer<typeof UpdatePlanLinkSchema>;

/** Domínio de checkout aceito (sem protocolo nem caminho), configurável no backoffice. */
export const GatewayDomainSchema = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .max(253)
    .regex(/^(?!-)[a-z0-9-]{1,63}(\.(?!-)[a-z0-9-]{1,63})+$/, 'Domínio inválido'),
  gateway: z.string().trim().min(1).max(60),
  is_active: z.boolean().optional(),
});
export type GatewayDomainDto = z.infer<typeof GatewayDomainSchema>;

export const UpdateGatewayDomainSchema = GatewayDomainSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Nenhum campo para atualizar',
);
export type UpdateGatewayDomainDto = z.infer<typeof UpdateGatewayDomainSchema>;
