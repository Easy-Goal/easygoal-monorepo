import { z } from 'zod';

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
