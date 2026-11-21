import { z } from 'zod';

// Resposta do diagnóstico antes do app (s369, 2026-11-21; ADR 075 item 1, montagem automática).
// O site manda o diagnóstico → a API cria o objetivo, monta a sugestão de proposta pelo catálogo de
// entregáveis (`suggestProposal`, prazo médio vivo do ADR 076) e:
//   1. devolve ao site o PREVIEW público (etapas e prazos, sem preço nem horas);
//   2. grava um rascunho de proposta no objetivo (status `draft`), para o admin revisar no app;
//   3. manda ao Easy CRM a PROPOSTA EM RASCUNHO completa, ligada ao lead, para o consultor chegar
//      ao primeiro contato com squad e prazos já discutidos.
// Preço e horas nunca saem para o público: o consultor confirma o investimento.

export const PREVIEW_LEAD_TIME_SOURCES = ['template', 'history'] as const;

/** Uma etapa do preview público. */
export const DiagnosticPreviewItemSchema = z.object({
  name: z.string(),
  phase: z.number().int().min(1),
  modality: z.string(),
  /** Dias úteis; `null` = sem prazo definido no catálogo (o consultor define). */
  lead_time_days: z.number().int().nullable(),
  /** `history` = prazo médio das entregas reais; `template` = prazo padrão do catálogo. */
  lead_time_source: z.enum(PREVIEW_LEAD_TIME_SOURCES),
  acceptance_criteria: z.array(z.string()),
});
export type DiagnosticPreviewItem = z.infer<typeof DiagnosticPreviewItemSchema>;

/** Devolvido pela API a `POST /internal/diagnostics` (canal `site`) e mostrado pelo site. */
export const DiagnosticPreviewSchema = z.object({
  objective_id: z.string().uuid(),
  items: z.array(DiagnosticPreviewItemSchema),
  phases: z.number().int().min(0),
  /** Soma das fases (recorrência fora), em dias úteis. */
  total_lead_time_days: z.number().int().min(0),
  has_recurring: z.boolean(),
});
export type DiagnosticPreview = z.infer<typeof DiagnosticPreviewSchema>;

/** Item interno da proposta em rascunho (vai ao CRM, nunca ao público). */
export const CrmProposalDraftItemSchema = z.object({
  nome: z.string(),
  fase: z.number().int().min(1),
  modalidade: z.string(),
  prazo_dias: z.number().int().nullable(),
  horas: z.number().nullable(),
  preco_cents: z.number().int().nullable(),
  criterios_aceite: z.array(z.string()),
  ferramentas: z.array(z.string()),
});
export type CrmProposalDraftItem = z.infer<typeof CrmProposalDraftItemSchema>;

/**
 * API → Easy CRM (`POST /api/propostas/rascunho`, token de serviço). Idempotente por `objective_id`:
 * reenviar substitui os itens do rascunho, nunca cria outro.
 */
export const CrmProposalDraftSchema = z.object({
  objective_id: z.string().uuid(),
  email: z.string().trim().toLowerCase().email(),
  /** Token assinado do CRM, quando a captura devolveu um (ver `crm-funnel.ts`). Só dica. */
  lead_ref: z.string().max(300).optional(),
  produto: z.string().max(200),
  resumo_diagnostico: z.string().max(4000),
  itens: z.array(CrmProposalDraftItemSchema),
  prazo_total_dias: z.number().int().min(0),
  preco_total_cents: z.number().int().min(0),
  /** Link do objetivo no admin do app, para o consultor abrir a proposta completa. */
  app_url: z.string().url().optional(),
});
export type CrmProposalDraft = z.infer<typeof CrmProposalDraftSchema>;
