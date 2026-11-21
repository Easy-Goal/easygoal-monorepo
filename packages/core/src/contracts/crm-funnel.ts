import { z } from 'zod';
import { AttributionTouchSchema } from './attribution';

// Funil do lead entre LP/site, gateway, API, Easy CRM e app (refinamento s369, 2026-11-21).
// Fonte única para os repos que capturam, repassam ou mostram o lead:
//   - LP/site: captura (`CrmCaptureExtras`) e clique no checkout (`CheckoutClick`);
//   - API: repassa eventos do gateway ao CRM com `lead_ref` (ver `commerce.ts`) e filtra o espelho;
//   - CRM: grava etiquetas e etapas e devolve o espelho (`CrmMirror`);
//   - app: só lê o espelho já filtrado pela política (C1).
// Regra: o produto é um recorte dentro da empresa Easy Goal no CRM (decisão R-A).

/** Parâmetro que leva o id do lead do CRM até o checkout e volta no webhook como `lead_ref`. */
export const CRM_LEAD_REF_PARAM = 'eg_lead';

/** Horas depois do clique no checkout, sem pagamento, para o lead virar "abandonou checkout" (R-C). */
export const CHECKOUT_ABANDON_HOURS = 24;

/** Etiquetas automáticas do funil. O texto é o que aparece no CRM e no app. */
export const CRM_FUNNEL_TAGS = {
  checkoutClicked: 'foi ao checkout',
  paymentPending: 'pagamento pendente',
  checkoutAbandoned: 'abandonou checkout',
  saleWithoutLead: 'venda sem lead',
} as const;
export type CrmFunnelTag = (typeof CRM_FUNNEL_TAGS)[keyof typeof CRM_FUNNEL_TAGS];

/** Etapas do funil que o espelho e o app conhecem (as do CRM, na ordem). */
export const CRM_FUNNEL_STAGES = ['Novo', 'Checkout', 'Fechado Ganho', 'Perdido'] as const;

const shortText = z.string().trim().min(1).max(200);
const tag = z.string().trim().min(1).max(60);

/** Campos extras que toda captura pública manda além de nome/e-mail/telefone. */
export const CrmCaptureExtrasSchema = z.object({
  /** Produto dentro da empresa Easy Goal (ex.: "Desafio Builder"). */
  produto: shortText.optional(),
  etiquetas: z.array(tag).max(10).optional(),
  /** Primeiro toque (cookie de primeira parte, 90 dias). Uma captura repetida não sobrescreve. */
  attribution: AttributionTouchSchema.optional(),
  /** URL da página que capturou. */
  origem_pagina: z.string().trim().url().max(500).optional(),
});
export type CrmCaptureExtras = z.infer<typeof CrmCaptureExtrasSchema>;

/**
 * Clique no botão do checkout, registrado pelo redirecionador da LP antes de mandar ao gateway (R-B).
 * Precisa de `lead_ref` ou `email`; sem nenhum dos dois, o clique conta só como visita anônima.
 */
export const CheckoutClickSchema = z
  .object({
    produto: shortText,
    lead_ref: shortText.optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    destino_url: z.string().trim().url().max(1000),
    attribution: AttributionTouchSchema.optional(),
    occurred_at: z.string().datetime({ offset: true }),
  })
  .refine((c) => Boolean(c.lead_ref || c.email), { message: 'lead_ref ou email é obrigatório' });
export type CheckoutClick = z.infer<typeof CheckoutClickSchema>;

/** Um lead como o CRM devolve no espelho (antes do filtro por perfil da API). */
export const CrmMirrorLeadSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string(),
  telefone: z.string(),
  canal: z.string(),
  campanha: z.string(),
  etapa: z.string(),
  aberto: z.boolean(),
  criado_em: z.string(),
  convertido_em: z.string().nullable(),
  crm_url: z.string(),
  // Campos do refinamento s369 (C3). Ausentes no CRM antigo: o app trata como nulos.
  produto: z.string().nullable().optional(),
  etiquetas: z.array(z.string()).optional(),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  utm_term: z.string().nullable().optional(),
  gclid: z.string().nullable().optional(),
  fbclid: z.string().nullable().optional(),
  /** Campanha do último toque, quando diferente da primeira. */
  ultima_utm_campaign: z.string().nullable().optional(),
  valor_cents: z.number().int().nullable().optional(),
  /** Nome de quem está atendendo (R-D: o produtor vê, sem ver a conversa). */
  consultor_nome: z.string().nullable().optional(),
  ultima_acao_em: z.string().nullable().optional(),
  ultima_acao_descricao: z.string().nullable().optional(),
});
export type CrmMirrorLead = z.infer<typeof CrmMirrorLeadSchema>;

export const CrmMirrorSchema = z.object({
  empresa_id: z.string(),
  gerado_em: z.string(),
  totais: z.object({
    leads: z.number().int(),
    ultimos_30_dias: z.number().int(),
    abertos: z.number().int(),
    ganhos: z.number().int(),
    perdidos: z.number().int(),
  }),
  por_etapa: z.array(z.object({ etapa: z.string(), total: z.number().int() })),
  por_campanha: z.array(
    z.object({
      campanha: z.string(),
      total: z.number().int(),
      ganhos: z.number().int(),
      // s369: funil por campanha para a aba "Campanhas" do app.
      foram_ao_checkout: z.number().int().optional(),
      valor_cents: z.number().int().optional(),
    }),
  ),
  leads: z.array(CrmMirrorLeadSchema),
});
export type CrmMirror = z.infer<typeof CrmMirrorSchema>;
