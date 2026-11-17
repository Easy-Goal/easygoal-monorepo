import { z } from 'zod';
import { EntrySourceSchema, PhoneSchema } from './join';

// Catálogo de entregáveis (ADR 076, onda 1): categorias de lista fechada e fichas
// padrão por categoria. Valores gravados em inglês; rótulos em português abaixo.

export const DELIVERABLE_GOALS = ['sell_more', 'operate_with_less_effort', 'launch_or_scale_product', 'strategy'] as const;
export const DeliverableGoalSchema = z.enum(DELIVERABLE_GOALS);
export type DeliverableGoal = z.infer<typeof DeliverableGoalSchema>;
export const DELIVERABLE_GOAL_LABELS: Record<DeliverableGoal, string> = {
  sell_more: 'Vender mais',
  operate_with_less_effort: 'Operar com menos esforço',
  launch_or_scale_product: 'Lançar ou escalar um produto',
  strategy: 'Estratégia e consultoria',
};

export const DELIVERABLE_MODALITIES = ['one_off', 'setup', 'implementation', 'recurring'] as const;
export const DeliverableModalitySchema = z.enum(DELIVERABLE_MODALITIES);
export type DeliverableModality = z.infer<typeof DeliverableModalitySchema>;
export const DELIVERABLE_MODALITY_LABELS: Record<DeliverableModality, string> = {
  one_off: 'Avulso',
  setup: 'Setup',
  implementation: 'Implementação',
  recurring: 'Recorrência',
};

export const RECURRENCE_INTERVALS = ['monthly', 'quarterly'] as const;
export const RecurrenceIntervalSchema = z.enum(RECURRENCE_INTERVALS);
export type RecurrenceInterval = z.infer<typeof RecurrenceIntervalSchema>;
export const RECURRENCE_INTERVAL_LABELS: Record<RecurrenceInterval, string> = { monthly: 'Mensal', quarterly: 'Trimestral' };

export const DELIVERABLE_EXECUTORS = ['easy_goal', 'builder', 'both'] as const;
export const DeliverableExecutorSchema = z.enum(DELIVERABLE_EXECUTORS);
export type DeliverableExecutor = z.infer<typeof DeliverableExecutorSchema>;
export const DELIVERABLE_EXECUTOR_LABELS: Record<DeliverableExecutor, string> = {
  easy_goal: 'Easy Goal',
  builder: 'Builder',
  both: 'Easy Goal + builder',
};

/** Sentido em que a métrica de resultado do cliente melhora (custo por lead cai; conversão sobe). */
export const METRIC_DIRECTIONS = ['up', 'down'] as const;
export const MetricDirectionSchema = z.enum(METRIC_DIRECTIONS);
export type MetricDirection = z.infer<typeof MetricDirectionSchema>;

const slug = z.string().trim().min(2, 'Nome curto demais para gerar o identificador').max(60).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use letras minúsculas, números e hífen');
const text = (max: number) => z.string().trim().min(1, 'Preencha os campos obrigatórios').max(max, `Use no máximo ${max} caracteres`);

export const DeliverableCategorySchema = z.object({
  slug,
  name: text(80),
  description: z.string().trim().max(500).nullish(),
  goals: z.array(DeliverableGoalSchema).min(1, 'Escolha ao menos um objetivo').max(DELIVERABLE_GOALS.length),
  result_metric_name: text(120),
  result_metric_unit: z.string().trim().max(20).nullish(),
  result_metric_direction: MetricDirectionSchema.default('up'),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(1000).default(0),
});
export type DeliverableCategoryDto = z.infer<typeof DeliverableCategorySchema>;
export const UpdateDeliverableCategorySchema = DeliverableCategorySchema.partial().omit({ slug: true });
export type UpdateDeliverableCategoryDto = z.infer<typeof UpdateDeliverableCategorySchema>;

/** Ferramenta que o entregável exige, sempre com o motivo (ADR 070). */
export const RequiredToolSchema = z.object({ name: text(80), reason: text(200) });
export type RequiredTool = z.infer<typeof RequiredToolSchema>;

const templateFields = z.object({
  category_id: z.string().uuid(),
  name: text(120),
  description: z.string().trim().max(1000).nullish(),
  modality: DeliverableModalitySchema,
  /** Dias úteis até a entrega. Obrigatório fora da recorrência; na recorrência vale o ciclo. */
  default_lead_time_days: z.number().int().min(1).max(365).nullish(),
  recurrence_interval: RecurrenceIntervalSchema.nullish(),
  default_effort_hours: z.number().min(0).max(2000).nullish(),
  acceptance_criteria: z.array(text(300)).max(20).default([]),
  required_tools: z.array(RequiredToolSchema).max(20).default([]),
  base_price_cents: z.number().int().min(0).nullish(),
  executor: DeliverableExecutorSchema.default('easy_goal'),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(1000).default(0),
});

/** Regra da ficha: recorrência tem ciclo e não tem prazo; as demais modalidades têm prazo e não têm ciclo. */
export function checkTemplateTiming(
  t: { modality: DeliverableModality; default_lead_time_days?: number | null; recurrence_interval?: RecurrenceInterval | null },
  ctx: z.RefinementCtx,
) {
  if (t.modality === 'recurring') {
    if (!t.recurrence_interval) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['recurrence_interval'], message: 'Recorrência precisa do ciclo' });
  } else {
    if (!t.default_lead_time_days) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['default_lead_time_days'], message: 'Informe o prazo em dias úteis' });
    if (t.recurrence_interval) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['recurrence_interval'], message: 'Só a recorrência tem ciclo' });
  }
}

export const DeliverableTemplateSchema = templateFields.superRefine(checkTemplateTiming);
export type DeliverableTemplateDto = z.infer<typeof DeliverableTemplateSchema>;
/** PATCH parcial; a API junta com a ficha atual e valida o resultado com `DeliverableTemplateSchema`. */
export const UpdateDeliverableTemplateSchema = templateFields.partial();
export type UpdateDeliverableTemplateDto = z.infer<typeof UpdateDeliverableTemplateSchema>;

// ── Onda 2: diagnóstico inicial ──────────────────────────────────────────────

export const NEED_TYPES = ['service', 'tool', 'tool_with_implementation', 'unsure'] as const;
export const NeedTypeSchema = z.enum(NEED_TYPES);
export type NeedType = z.infer<typeof NeedTypeSchema>;
export const NEED_TYPE_LABELS: Record<NeedType, string> = {
  service: 'Um serviço feito por vocês',
  tool: 'Uma ferramenta',
  tool_with_implementation: 'Ferramenta + implementação',
  unsure: 'Ainda não sei (quero diagnóstico)',
};

/** Onde o cliente está hoje em cada área marcada. */
export const CATEGORY_STAGES = ['none', 'has_not_using', 'using_wants_scale'] as const;
export const CategoryStageSchema = z.enum(CATEGORY_STAGES);
export type CategoryStage = z.infer<typeof CategoryStageSchema>;
export const CATEGORY_STAGE_LABELS: Record<CategoryStage, string> = {
  none: 'Não tenho nada',
  has_not_using: 'Tenho, mas não uso bem',
  using_wants_scale: 'Uso e quero automatizar ou escalar',
};

export const URGENCIES = ['this_week', 'this_month', 'next_3_months', 'no_rush'] as const;
export const UrgencySchema = z.enum(URGENCIES);
export type Urgency = z.infer<typeof UrgencySchema>;
export const URGENCY_LABELS: Record<Urgency, string> = {
  this_week: 'Esta semana',
  this_month: 'Este mês',
  next_3_months: 'Próximos 3 meses',
  no_rush: 'Sem pressa',
};

export const BUDGET_RANGES = ['up_to_2k', '2k_10k', '10k_30k', 'above_30k', 'talk'] as const;
export const BudgetRangeSchema = z.enum(BUDGET_RANGES);
export type BudgetRange = z.infer<typeof BudgetRangeSchema>;
export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  up_to_2k: 'Até R$ 2 mil',
  '2k_10k': 'R$ 2 mil a R$ 10 mil',
  '10k_30k': 'R$ 10 mil a R$ 30 mil',
  above_30k: 'Acima de R$ 30 mil',
  talk: 'Prefiro conversar',
};

export const DIAGNOSTIC_CHANNELS = ['app', 'typebot', 'crm', 'admin'] as const;
export const DiagnosticChannelSchema = z.enum(DIAGNOSTIC_CHANNELS);
export type DiagnosticChannel = z.infer<typeof DiagnosticChannelSchema>;

/** Número que o cliente quer mudar (pergunta 7), base da medição do resultado (onda 6). */
export const KpiBaselineSchema = z.object({
  category_slug: slug,
  name: text(120),
  unit: z.string().trim().max(20).nullish(),
  direction: MetricDirectionSchema,
  value: z.number().finite().nullish(),
});
export type KpiBaseline = z.infer<typeof KpiBaselineSchema>;

/** Respostas das 8 perguntas. O mesmo payload vem do app, do Typebot e do CRM. */
export const DiagnosticSchema = z.object({
  goal: DeliverableGoalSchema,
  need_type: NeedTypeSchema,
  categories: z
    .array(z.object({ slug, stage: CategoryStageSchema }))
    .min(1, 'Escolha ao menos uma área')
    .max(9)
    .refine((list) => new Set(list.map((c) => c.slug)).size === list.length, 'Área repetida'),
  urgency: UrgencySchema,
  budget_range: BudgetRangeSchema,
  kpi_baseline: KpiBaselineSchema.nullish(),
  description: z.string().trim().max(2000, 'Use no máximo 2.000 caracteres').nullish(),
});
export type DiagnosticDto = z.infer<typeof DiagnosticSchema>;

/** /join do comprador com diagnóstico (substitui o texto livre). */
export const BuyerDiagnosticJoinSchema = z.object({
  phone: PhoneSchema,
  diagnostic: DiagnosticSchema,
  source: EntrySourceSchema.optional(),
});
export type BuyerDiagnosticJoinDto = z.infer<typeof BuyerDiagnosticJoinSchema>;

/** Typebot ou CRM: o lead ainda não tem conta; o contato fica no objetivo. */
export const ExternalDiagnosticSchema = z.object({
  channel: z.enum(['typebot', 'crm']),
  contact: z
    .object({
      name: text(120),
      email: z.string().trim().toLowerCase().email('E-mail inválido').max(200).nullish(),
      phone: PhoneSchema.nullish(),
    })
    .refine((c) => Boolean(c.email || c.phone), 'Informe e-mail ou telefone'),
  diagnostic: DiagnosticSchema,
  source: EntrySourceSchema.optional(),
});
export type ExternalDiagnosticDto = z.infer<typeof ExternalDiagnosticSchema>;

// ── Onda 3: proposta (trilha do cliente) ─────────────────────────────────────

export const PROPOSAL_STATUSES = ['draft', 'sent', 'accepted', 'declined', 'superseded'] as const;
export const ProposalStatusSchema = z.enum(PROPOSAL_STATUSES);
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>;
export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: 'Rascunho',
  sent: 'Enviada',
  accepted: 'Aceita',
  declined: 'Recusada',
  superseded: 'Substituída',
};

export const ProposalItemSchema = z
  .object({
    template_id: z.string().uuid(),
    phase: z.number().int().min(1).max(20),
    name: text(120),
    modality: DeliverableModalitySchema,
    lead_time_days: z.number().int().min(1).max(365).nullish(),
    recurrence_interval: RecurrenceIntervalSchema.nullish(),
    effort_hours: z.number().min(0).max(2000).nullish(),
    price_cents: z.number().int().min(0).nullish(),
    acceptance_criteria: z.array(text(300)).max(20).default([]),
    required_tools: z.array(RequiredToolSchema).max(20).default([]),
  })
  .superRefine((item, ctx) =>
    checkTemplateTiming(
      { modality: item.modality, default_lead_time_days: item.lead_time_days, recurrence_interval: item.recurrence_interval },
      ctx,
    ),
  );
export type ProposalItemDto = z.infer<typeof ProposalItemSchema>;

export const SaveProposalSchema = z.object({
  notes: z.string().trim().max(2000).nullish(),
  items: z.array(ProposalItemSchema).min(1, 'A proposta precisa de ao menos um entregável').max(50),
});
export type SaveProposalDto = z.infer<typeof SaveProposalSchema>;

export const DecideProposalSchema = z.object({ note: z.string().trim().max(1000).nullish() });
export type DecideProposalDto = z.infer<typeof DecideProposalSchema>;

// ── Onda 4: execução com responsável ─────────────────────────────────────────

export const EXECUTION_STATUSES = ['todo', 'in_progress', 'delivered', 'returned', 'accepted', 'cancelled'] as const;
export const ExecutionStatusSchema = z.enum(EXECUTION_STATUSES);
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;
export const EXECUTION_STATUS_LABELS: Record<ExecutionStatus, string> = {
  todo: 'A fazer',
  in_progress: 'Em andamento',
  delivered: 'Entregue',
  returned: 'Devolvido',
  accepted: 'Aceito',
  cancelled: 'Cancelado',
};

/** Quem pode mover o status: responsável, comprador (aceite/devolução) e admin (tudo). */
export type ExecutionActor = 'assignee' | 'buyer' | 'admin';

const TRANSITIONS: Record<ExecutionStatus, Partial<Record<ExecutionStatus, ExecutionActor[]>>> = {
  todo: { in_progress: ['assignee', 'admin'], cancelled: ['admin'] },
  in_progress: { delivered: ['assignee', 'admin'], cancelled: ['admin'] },
  delivered: { accepted: ['buyer', 'admin'], returned: ['buyer', 'admin'] },
  returned: { in_progress: ['assignee', 'admin'], delivered: ['assignee', 'admin'], cancelled: ['admin'] },
  accepted: {},
  cancelled: {},
};

/** Recorrência não tem entrega única: fica em andamento até ser cancelada. */
export function canTransition(
  from: ExecutionStatus,
  to: ExecutionStatus,
  actor: ExecutionActor,
  modality: DeliverableModality,
): boolean {
  if (modality === 'recurring' && !['in_progress', 'cancelled'].includes(to)) return false;
  return TRANSITIONS[from][to]?.includes(actor) ?? false;
}

export const UpdateExecutionSchema = z
  .object({
    status: ExecutionStatusSchema.optional(),
    assignee_id: z.string().uuid().nullable().optional(),
    note: z.string().trim().max(1000).nullish(),
  })
  .refine((v) => v.status !== undefined || v.assignee_id !== undefined, 'Informe o status ou o responsável');
export type UpdateExecutionDto = z.infer<typeof UpdateExecutionSchema>;

export const ReturnDeliverableSchema = z.object({ note: text(1000) });
export type ReturnDeliverableDto = z.infer<typeof ReturnDeliverableSchema>;

export const TimeLogSchema = z.object({
  hours: z.number().positive('Informe as horas').max(24),
  note: z.string().trim().max(500).nullish(),
  logged_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type TimeLogDto = z.infer<typeof TimeLogSchema>;

// ── Onda 5: prazo médio vivo ─────────────────────────────────────────────────

/** Mínimo de entregas reais para o prazo mostrado deixar de ser o da ficha (decisão D6). */
export const LEAD_TIME_MIN_SAMPLE = 5;

// ── Onda 6: resultado do cliente ─────────────────────────────────────────────

export const RESULT_CHECKPOINTS = ['d30', 'd60', 'd90'] as const;
export const ResultCheckpointSchema = z.enum(RESULT_CHECKPOINTS);
export type ResultCheckpoint = z.infer<typeof ResultCheckpointSchema>;
export const RESULT_CHECKPOINT_DAYS: Record<ResultCheckpoint, number> = { d30: 30, d60: 60, d90: 90 };

export const ResultMeasurementSchema = z.object({
  checkpoint: ResultCheckpointSchema,
  value: z.number().finite(),
  note: z.string().trim().max(1000).nullish(),
});
export type ResultMeasurementDto = z.infer<typeof ResultMeasurementSchema>;

/** O número melhorou em relação à partida, no sentido da métrica. Sem partida, não dá para afirmar. */
export function kpiImproved(baseline: number | null | undefined, current: number, direction: MetricDirection): boolean | null {
  if (baseline === null || baseline === undefined) return null;
  return direction === 'up' ? current > baseline : current < baseline;
}
