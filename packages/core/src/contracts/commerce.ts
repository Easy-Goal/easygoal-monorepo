import { z } from 'zod';

// Eventos de venda e assinatura normalizados a partir do webhook do gateway do produtor
// (ADR 069 modo leitura, ADR 071 faturas por evento, plano s360 frente M).
// O gateway cobra; a Easy Goal só lê. Nenhum consumidor deve depender do gateway de origem.

export const COMMERCE_GATEWAYS = ['abacatepay', 'kiwify', 'hotmart', 'mercadopago', 'custom'] as const;
export const CommerceGatewaySchema = z.enum(COMMERCE_GATEWAYS);
export type CommerceGateway = z.infer<typeof CommerceGatewaySchema>;

export const COMMERCE_EVENT_TYPES = [
  'sale.approved',
  'sale.refunded',
  'sale.chargeback',
  'subscription.started',
  'subscription.renewed',
  'subscription.past_due',
  'subscription.canceled',
] as const;
export const CommerceEventTypeSchema = z.enum(COMMERCE_EVENT_TYPES);
export type CommerceEventType = z.infer<typeof CommerceEventTypeSchema>;

/** `verified`: assinatura do gateway conferida. `unverified` é gravado, mas não muda acesso. */
export const COMMERCE_EVENT_VERIFICATION = ['verified', 'unverified'] as const;
export const CommerceEventVerificationSchema = z.enum(COMMERCE_EVENT_VERIFICATION);

/** Nome do parâmetro que liga o checkout ao usuário do SSO (vai no link do gateway). */
export const COMMERCE_REF_PARAM = 'eg_ref';

/** Evento já normalizado, como gravado em `commerce_events` e devolvido pela API. */
export const CommerceEventSchema = z.object({
  id: z.string().uuid(),
  saas_product_id: z.string().uuid(),
  gateway: CommerceGatewaySchema,
  gateway_event_id: z.string().min(1).max(200),
  type: CommerceEventTypeSchema,
  verification: CommerceEventVerificationSchema,
  occurred_at: z.string().datetime(),
  amount_cents: z.number().int().nullable(),
  currency: z.string().length(3).default('BRL'),
  customer_email: z.string().email().nullable(),
  user_id: z.string().uuid().nullable(),
  plan_id: z.string().uuid().nullable(),
  eg_ref: z.string().max(200).nullable(),
  received_at: z.string().datetime(),
});
export type CommerceEvent = z.infer<typeof CommerceEventSchema>;

export const ENTITLEMENT_STATUSES = ['active', 'past_due', 'canceled', 'refunded'] as const;
export const EntitlementStatusSchema = z.enum(ENTITLEMENT_STATUSES);
export type EntitlementStatus = z.infer<typeof EntitlementStatusSchema>;

/** Acesso derivado dos eventos. `entitlement_key` vem do plano (ex.: `vaygo_pro`). */
export const EntitlementSchema = z.object({
  user_id: z.string().uuid(),
  saas_product_id: z.string().uuid(),
  entitlement_key: z.string().regex(/^[a-z0-9_]{2,60}$/),
  status: EntitlementStatusSchema,
  valid_until: z.string().datetime().nullable(),
  source_event_id: z.string().uuid(),
  updated_at: z.string().datetime(),
});
export type Entitlement = z.infer<typeof EntitlementSchema>;

/** Estados que liberam o SaaS. `past_due` mantém acesso até o gateway cancelar. */
export function entitlementGrantsAccess(status: EntitlementStatus): boolean {
  return status === 'active' || status === 'past_due';
}

// ─── Categorização das ofertas e validação de ponta a ponta (plano s361, F3) ──

/** Como o produtor classifica cada produto/oferta do gateway dele. Obrigatório no onboarding. */
export const OFFER_KINDS = ['recurring', 'one_time', 'order_bump', 'upsell'] as const;
export const OfferKindSchema = z.enum(OFFER_KINDS);
export type OfferKind = z.infer<typeof OfferKindSchema>;

export const OFFER_KIND_LABELS: Record<OfferKind, string> = {
  recurring: 'Assinatura recorrente',
  one_time: 'Venda avulsa',
  order_bump: 'Order bump',
  upsell: 'Upsell',
};

/**
 * Etapas que o onboarding valida com dados reais. Nenhuma bloqueia o SaaS (decisão 2 da s361):
 * elas mostram o que já foi visto funcionando. Só `human_approval` depende de uma pessoa.
 */
export const VALIDATION_STEPS = [
  'webhook_verified',   // chegou um evento com assinatura do gateway conferida
  'offers_categorized', // toda oferta vista nos eventos tem plano e tipo
  'page_visit',         // visita registrada na página do SaaS antes da contratação
  'login',              // comprador entrou no SaaS pelo SSO
  'sale',               // sale.approved verificado
  'subscription',       // subscription.started verificado (só se houver oferta recorrente)
  'human_approval',     // aprovação final por um admin da Easy Goal
] as const;
export const ValidationStepSchema = z.enum(VALIDATION_STEPS);
export type ValidationStep = z.infer<typeof ValidationStepSchema>;

export const VALIDATION_STEP_STATUSES = ['pending', 'ok', 'not_applicable'] as const;

export const ValidationStepStateSchema = z.object({
  step: ValidationStepSchema,
  status: z.enum(VALIDATION_STEP_STATUSES),
  /** Quando foi visto pela primeira vez (ISO) — ou null se pendente. */
  seen_at: z.string().datetime().nullable(),
  /** Detalhe curto para o produtor (ex.: "3 de 4 ofertas categorizadas"). */
  detail: z.string().max(200).nullable(),
});
export type ValidationStepState = z.infer<typeof ValidationStepStateSchema>;

/** Gateway liberado para o produtor escolher: só os que têm adaptador na API (decisão 9). */
export const GatewayOptionSchema = z.object({
  gateway: CommerceGatewaySchema,
  label: z.string(),
  /** URL que o produtor cola no painel do gateway, já com o gateway e a chave do produto. */
  webhook_path: z.string(),
});
export type GatewayOption = z.infer<typeof GatewayOptionSchema>;
