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
